/*
 * Copyright 2016 TU Dortmund
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package de.learnlib.alex.core.learner;

import de.learnlib.alex.core.entities.algorithms.AbstractLearningAlgorithm;
import de.learnlib.alex.core.dao.LearnerResultDAO;
import de.learnlib.alex.core.entities.ExecuteResult;
import de.learnlib.alex.core.entities.LearnerResult;
import de.learnlib.alex.core.entities.LearnerResultStep;
import de.learnlib.alex.core.entities.Statistics;
import de.learnlib.alex.core.entities.Symbol;
import de.learnlib.alex.core.entities.learnlibproxies.AlphabetProxy;
import de.learnlib.alex.core.entities.learnlibproxies.DefaultQueryProxy;
import de.learnlib.alex.core.entities.learnlibproxies.eqproxies.MealyRandomWordsEQOracleProxy;
import de.learnlib.alex.core.learner.connectors.ConnectorContextHandler;
import de.learnlib.alex.core.learner.connectors.ConnectorManager;
import de.learnlib.alex.exceptions.LearnerException;
import de.learnlib.alex.exceptions.NotFoundException;
import de.learnlib.api.EquivalenceOracle;
import de.learnlib.api.LearningAlgorithm.MealyLearner;
import de.learnlib.api.MembershipOracle;
import de.learnlib.api.SUL;
import de.learnlib.cache.mealy.MealyCacheOracle;
import de.learnlib.mapper.ContextExecutableInputSUL;
import de.learnlib.mapper.Mappers;
import de.learnlib.mapper.api.ContextExecutableInput;
import de.learnlib.oracles.DefaultQuery;
import de.learnlib.oracles.SimulatorOracle;
import net.automatalib.automata.transout.MealyMachine;
import net.automatalib.automata.transout.impl.compact.CompactMealy;
import net.automatalib.util.automata.Automata;
import net.automatalib.words.Alphabet;
import net.automatalib.words.Word;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.apache.logging.log4j.Marker;
import org.apache.logging.log4j.MarkerManager;
import org.apache.logging.log4j.ThreadContext;

import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Set;

/**
 * Thread to run a learning process. It needs to be a Thread so that the server can still deal with other requests.
 * This class contains the actual learning loop.
 */
public class LearnerThread extends Thread {

    private static final Logger LOGGER = LogManager.getLogger();

    private static final Marker LEARNER_MARKER = MarkerManager.getMarker("LEARNER");

    /** Is the thread still running? */
    private boolean finished;

    /** The system under learning. */
    private final AlexSUL<String, String> sul;

    /** The DAO to remember the learn results. */
    private final LearnerResultDAO learnerResultDAO;

    /** The result of this learning thread. */
    private final LearnerResult result;

    /** The current step of the learn result. */
    private LearnerResultStep currentStep;

    /** The learner to use during the learning. */
    private final MealyLearner<String, String> learner;

    /** The Alphabet of the Symbols which will be used during the learning. */
    private final Alphabet<String> sigma;

    /** The membership oracle. */
    private final DelegationOracle<String, String> mqOracle;

    /** The number of mqs executed in parallel. */
    private int maxConcurrentQueries;

    /** The equivalence oracle to use. */
    private EquivalenceOracle<MealyMachine<?, String, ?, String>, String, Word<String>> eqOracle;

    /** The phase of the learner. */
    private Learner.LearnerPhase learnerPhase;

    /** The queries that are executed at the moment. */
    private List<DefaultQueryProxy> currentQueries;

    /**
     * Constructor to set the LearnerThread up.
     *
     * @param learnerResultDAO
     *         The DAO to persists the results.
     * @param result
     *         The result to update, including the proper configuration.
     * @param context
     *         The context of the SUL. If this context is a counter, the 'amountOfResets' field will be set correctly.
     */
    public LearnerThread(LearnerResultDAO learnerResultDAO, LearnerResult result, ConnectorContextHandler context) {
        this.finished = false;
        this.learnerResultDAO = learnerResultDAO;
        this.result = result;
        this.currentStep = result.getSteps().get(result.getSteps().size() - 1); // get the latest step
        this.maxConcurrentQueries = context.getMaxConcurrentQueries();
        this.currentQueries = new ArrayList<>();

        Symbol[] symbolsArray = readSymbolArray(); // use the symbols in the result to create the symbol array.
        SymbolMapper mapper = new SymbolMapper(symbolsArray);
        this.sigma = mapper.getAlphabet();
        this.result.setSigma(AlphabetProxy.createFrom(sigma));

        ContextExecutableInputSUL<ContextExecutableInput<ExecuteResult, ConnectorManager>, ExecuteResult, ConnectorManager>
                ceiSUL = new ContextExecutableInputSUL<>(context);
        SUL<String, String> mappedSUL = Mappers.apply(mapper, ceiSUL);
        this.sul = new AlexSUL<>(mappedSUL);

        // monitor which queries are being processed.
        QueryMonitorOracle<String, String> monitorOracle = new QueryMonitorOracle<>(new MultiSULOracle<>(sul));
        monitorOracle.addPostProcessingListener(queries -> {
            List<DefaultQueryProxy> currentQueries = new ArrayList<>();
            queries.forEach(query -> currentQueries.add(DefaultQueryProxy.createFrom(new DefaultQuery<>(query))));
            this.currentQueries = currentQueries;
        });

        if (result.isUseMQCache()) {
            this.mqOracle = new DelegationOracle<>(MealyCacheOracle.createDAGCacheOracle(this.sigma, monitorOracle));
        } else {
            this.mqOracle = new DelegationOracle<>(monitorOracle);
        }

        this.learner = result.getAlgorithm().createLearner(sigma, mqOracle);
    }

    /**
     * Advanced constructor to set the LearnerThread up.
     * Most likely to be used when resuming a learn process.
     *
     * @param learnerResultDAO
     *         The DAO to persists the results.
     * @param result
     *         The result to update, including the proper configuration.
     * @param context
     *         The context of the SUL. If this context is a counter, the 'amountOfResets' field will be set correctly.
     * @param step
     *         The step from where to continue.
     */
    public LearnerThread(LearnerResultDAO learnerResultDAO, LearnerResult result, ConnectorContextHandler context,
                         int step) {
        this(learnerResultDAO, result, context);
        learnFromHypothesis(step);
    }

    private Symbol[] readSymbolArray() {
        Set<Symbol> symbols = result.getSymbols();
        return symbols.toArray(new Symbol[symbols.size()]);
    }

    /**
     * Use the hypothesis of a previous step as a SUL and learn until no more counterexamples can be found.
     * The learner is then internally where it stopped the last time.
     */
    private void learnFromHypothesis(int step) {
        final CompactMealy<String, String> hypothesis = result.getSteps().get(step - 1).getHypothesis()
                .createMealyMachine(sigma);

        final MembershipOracle<String, Word<String>> oracle = mqOracle.getDelegate();
        mqOracle.setDelegate(new SimulatorOracle<>(hypothesis));

        learner.startLearning();
        while (true) {
            Word<String> input = Automata.findSeparatingWord(learner.getHypothesisModel(), hypothesis, sigma);
            if (input == null) {
                break;
            }
            DefaultQuery<String, Word<String>> counterexample = new DefaultQuery<>(input);
            counterexample.answer(hypothesis.computeOutput(input));
            learner.refineHypothesis(counterexample);
        }

        mqOracle.setDelegate(oracle);
    }

    /**
     * Returns the current status of the Thread.
     *
     * @return true, if the Thread is still active; false otherwise.
     */
    public boolean isFinished() {
        return finished;
    }

    /**
     * Get the result the Thread, which also contains the current configuration.
     *
     * @return The current result.
     */
    public LearnerResult getResult() {
        return result;
    }

    @Override
    public void run() {
        ThreadContext.put("userId", String.valueOf(result.getUserId()));
        ThreadContext.put("testNo", String.valueOf(result.getTestNo()));
        ThreadContext.put("indent", "");
        LOGGER.traceEntry();
        LOGGER.info(LEARNER_MARKER, "Started a learn thread.");

        try {
            learn();
        } catch (Exception e) {
            LOGGER.warn(LEARNER_MARKER, "Something in the LearnerThread went wrong:", e);
            e.printStackTrace();

            String message = e.getMessage();
            if (message == null) {
                message = e.getClass().getName();
            }
            currentStep.setErrorText(message);
            learnerResultDAO.saveStep(result, currentStep);

            sul.post();
        } finally {
            finished = true;
            LOGGER.info(LEARNER_MARKER, "The learn thread has finished.");
            LOGGER.traceExit();
        }
    }

    private void learn() throws NotFoundException {
        LOGGER.traceEntry();
        do {
            learnOneStep();
        } while (continueLearning());
        LOGGER.traceExit();
    }

    private boolean continueLearning() {
        return currentStep.getCounterExample() != null && (currentStep.getStepsToLearn() > 0
                || currentStep.getStepsToLearn() == -1) && !Thread.interrupted();
    }

    private void learnOneStep() throws NotFoundException {
        LOGGER.traceEntry();
        if (result.getStatistics().getDuration().getTotal() == 0L) {
            learnFirstStep();
        } else {
            learnSuccessiveStep();
        }
        learnerResultDAO.saveStep(result, currentStep);
        LOGGER.traceExit();
    }

    private void learnFirstStep() throws NotFoundException {
        LOGGER.traceEntry();

        // init. statistics
        Statistics statistics = currentStep.getStatistics();
        statistics.setStartDate(ZonedDateTime.now());
        statistics.setStartTime(System.nanoTime());
        statistics.setEqsUsed(0L);
        statistics.setDuration(new Statistics.DetailedStatistics());
        statistics.setMqsUsed(new Statistics.DetailedStatistics());
        statistics.setSymbolsUsed(new Statistics.DetailedStatistics());
        result.getStatistics().setStartDate(statistics.getStartDate());

        // learn
        learnerPhase = Learner.LearnerPhase.LEARNING;
        learner.startLearning();
        storeLearnerMetaData();

//        ((SupportsGrowingAlphabet<String>) learner).addAlphabetSymbol();

        // search counter example
        findCounterExample();
        storeCounterExampleSearchMetaData();

        LOGGER.traceExit();
    }

    private void learnSuccessiveStep() throws NotFoundException {
        LOGGER.traceEntry();

        // When we continue to learn, we have to create a new step based on the previous one.
        // Otherwise, if the learning is resumed, a new step with the new configuration, will already exists.
        LearnerResultStep previousStep;
        if (currentStep.getStatistics().getDuration().getTotal() > 0) {
            previousStep = currentStep;
            currentStep = learnerResultDAO.createStep(result);
        } else {
            previousStep = result.getSteps().get((int) (currentStep.getStepNo() - 1));
        }

        // set the start date and the start time:
        // - The start date acts as timestamp and is public.
        // - The start time is more accurate (nanoseconds) and will be only used internally to calculate the duration.
        Statistics statistics = currentStep.getStatistics();
        statistics.setStartDate(ZonedDateTime.now());
        statistics.setStartTime(System.nanoTime());

        // Get the counter example from the previous step and use it to refine the hypothesis (if possible).
        DefaultQueryProxy counterExample = previousStep.getCounterExample();
        if (counterExample != null) {
            DefaultQuery<String, Word<String>> counterexample = counterExample.createDefaultProxy();

            // for long randomly generated words, check if there is a shorter prefix that is also a counterexample
            if (previousStep.getEqOracle() instanceof MealyRandomWordsEQOracleProxy) {
                counterexample = findShortestPrefix(counterexample);
            }

            try {
                learnerPhase = Learner.LearnerPhase.LEARNING;
                learner.refineHypothesis(counterexample);
            } catch (NullPointerException e) {
                throw new LearnerException("Presumably the detected counterexample '" + counterexample
                                                   + "' was not a real counterexample!");
            } finally {
                storeLearnerMetaData();
            }
        }

        // search counter example
        findCounterExample();
        storeCounterExampleSearchMetaData();

        LOGGER.traceExit();
    }

    /**
     * Given a counterexample, est if there is a shorter prefix that is also a counterexample.
     *
     * @param ce The counterexample.
     * @return The prefix.
     */
    private DefaultQuery<String, Word<String>> findShortestPrefix(DefaultQuery<String, Word<String>> ce) {
        Word<String> input = ce.getInput();
        Word<String> output = ce.getOutput();

        int i;
        for (i = 0; i <= input.size(); i++) {
            Word<String> prefix = input.subWord(0, i);
            Word<String> sulOutput = output.subWord(0, i);
            Word<String> hypOutput = learner.getHypothesisModel().computeOutput(prefix);
            if (!Objects.equals(sulOutput, hypOutput)) {
                break;
            }
        }

        DefaultQuery<String, Word<String>> prefix = new DefaultQuery<>(input.subWord(0, i));
        prefix.answer(output.subWord(0, i));

        return prefix;
    }

    private void storeLearnerMetaData() throws NotFoundException {
        LOGGER.traceEntry();

        Statistics statistics = currentStep.getStatistics();
        long startTime = statistics.getStartTime();
        long currentTime = System.nanoTime();
        statistics.getDuration().setLearner(currentTime - startTime);
        LOGGER.info(LEARNER_MARKER, "Duration of the learning: {} (start: {}, end: {}).", statistics.getDuration(),
                    startTime, currentTime);

        statistics.getMqsUsed().setLearner(sul.getResetCount());
        statistics.getSymbolsUsed().setLearner(sul.getSymbolUsedCount());
        sul.resetCounter();

        // algorithm information
        currentStep.createHypothesisFrom(learner.getHypothesisModel());

        AbstractLearningAlgorithm<String, String> algorithm = result.getAlgorithm();
        String algorithmInformation;
        try {
            algorithmInformation = algorithm.getInternalData(learner);
        } catch (IllegalStateException e) { // algorithm has no internal data to show
            algorithmInformation = "";
        }
        currentStep.setAlgorithmInformation(algorithmInformation);

        LOGGER.traceExit();
    }

    private void findCounterExample() {
        LOGGER.traceEntry();

        if (eqOracle == null) {
            eqOracle = currentStep.getEqOracle().createEqOracle(mqOracle, maxConcurrentQueries);
        }

        DefaultQuery<String, Word<String>> newCounterExample;
        learnerPhase = Learner.LearnerPhase.EQUIVALENCE_TESTING;

        newCounterExample = eqOracle.findCounterExample(learner.getHypothesisModel(), sigma);

        // remember the counter example, if any
        if (newCounterExample == null) {
            currentStep.setCounterExample(null);
        } else {
            currentStep.setCounterExample(DefaultQueryProxy.createFrom(newCounterExample));
        }
        LOGGER.info(LEARNER_MARKER, "The new counter example is '{}'.", newCounterExample);

        LOGGER.traceExit();
    }

    /** @return {@link #learnerPhase}. */
    public Learner.LearnerPhase getPhase() {
        return learnerPhase;
    }

    /** @return {@link #currentQueries}. */
    public List<DefaultQueryProxy> getCurrentQueries() {
        return currentQueries;
    }

    private void storeCounterExampleSearchMetaData() {
        LOGGER.traceEntry();
        // statistics
        Statistics statistics = currentStep.getStatistics();

        statistics.setEqsUsed(currentStep.getStatistics().getEqsUsed() + 1);

        long startTime = statistics.getStartTime();
        long currentTime = System.nanoTime();
        long duration = currentTime - startTime - statistics.getDuration().getLearner();
        statistics.getDuration().setEqOracle(duration);
        LOGGER.info(LEARNER_MARKER, "Duration of the eq oracle: {}.", duration);

        statistics.getMqsUsed().setEqOracle(sul.getResetCount());
        statistics.getSymbolsUsed().setEqOracle(sul.getSymbolUsedCount());
        sul.resetCounter();

        LOGGER.traceExit();
    }

}
