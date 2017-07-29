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

import de.learnlib.alex.core.entities.LearnerConfiguration;
import de.learnlib.alex.core.dao.LearnerResultDAO;
import de.learnlib.alex.core.entities.ExecuteResult;
import de.learnlib.alex.core.entities.LearnerResult;
import de.learnlib.alex.core.entities.LearnerResultStep;
import de.learnlib.alex.core.entities.Statistics;
import de.learnlib.alex.core.entities.Symbol;
import de.learnlib.alex.core.entities.learnlibproxies.CompactMealyMachineProxy;
import de.learnlib.alex.core.entities.learnlibproxies.DefaultQueryProxy;
import de.learnlib.alex.core.entities.learnlibproxies.eqproxies.MealyRandomWordsEQOracleProxy;
import de.learnlib.alex.core.learner.connectors.ConnectorContextHandler;
import de.learnlib.alex.core.learner.connectors.ConnectorManager;
import de.learnlib.api.EquivalenceOracle;
import de.learnlib.api.LearningAlgorithm.MealyLearner;
import de.learnlib.api.SUL;
import de.learnlib.cache.mealy.MealyCacheOracle;
import de.learnlib.mapper.ContextExecutableInputSUL;
import de.learnlib.mapper.Mappers;
import de.learnlib.mapper.api.ContextExecutableInput;
import de.learnlib.oracles.DefaultQuery;
import net.automatalib.automata.transout.MealyMachine;
import net.automatalib.words.Alphabet;
import net.automatalib.words.Word;
import net.automatalib.words.impl.SimpleAlphabet;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.apache.logging.log4j.Marker;
import org.apache.logging.log4j.MarkerManager;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

/**
 * Thread to run a learning process. It needs to be a Thread so that the server can still deal with other requests. This
 * class contains the actual learning loop.
 */
public abstract class LearnerThread<T extends LearnerConfiguration> extends Thread {

    protected static final Logger LOGGER = LogManager.getLogger();

    protected static final Marker LEARNER_MARKER = MarkerManager.getMarker("LEARNER");

    /** Is the thread still running? */
    protected boolean finished;

    /** The system under learning. */
    protected final AlexSUL<String, String> sul;

    /** The DAO to remember the learn results. */
    protected final LearnerResultDAO learnerResultDAO;

    /** The learner to use during the learning. */
    protected final MealyLearner<String, String> learner;

    /** The phase of the learner. */
    protected Learner.LearnerPhase learnerPhase;

    /** The learner result. */
    protected LearnerResult result;

    /** The abstract alphabet that is used during the learning process. */
    protected Alphabet<String> abstractAlphabet;

    /** The configuration that is used. */
    protected T configuration;

    /** The membership oracle. */
    protected final DelegationOracle<String, String> mqOracle;

    /** Maps an abstract alphabet to a concrete one. */
    protected final SymbolMapper symbolMapper;

    /** The oracle that monitors which queries are being posed. */
    protected final QueryMonitorOracle<String, String> monitorOracle;

    /** The number of mqs executed in parallel. */
    private int maxConcurrentQueries;

    /** The queries that are executed at the moment. */
    private List<DefaultQueryProxy> currentQueries;

    /**
     * Constructor.
     *
     * @param learnerResultDAO {@link #learnerResultDAO}.
     * @param context          The context to use.
     * @param result           {@link #result}.
     * @param configuration    {@link #configuration}.
     */
    public LearnerThread(LearnerResultDAO learnerResultDAO, ConnectorContextHandler context, LearnerResult result,
                         T configuration) {
        this.learnerResultDAO = learnerResultDAO;
        this.result = result;
        this.configuration = configuration;
        this.abstractAlphabet = new SimpleAlphabet<>(
                result.getSymbols().stream()
                        .map(Symbol::getName)
                        .sorted(String::compareTo)
                        .collect(Collectors.toList())
        );

        this.finished = false;
        this.maxConcurrentQueries = context.getMaxConcurrentQueries();
        this.currentQueries = new ArrayList<>();

        // prepare the mapped sul.
        symbolMapper = new SymbolMapper(result.getSymbols().toArray(new Symbol[]{}));
        final ContextExecutableInputSUL<ContextExecutableInput<ExecuteResult, ConnectorManager>, ExecuteResult, ConnectorManager>
                ceiSUL = new ContextExecutableInputSUL<>(context);
        final SUL<String, String> mappedSUL = Mappers.apply(symbolMapper, ceiSUL);
        this.sul = new AlexSUL<>(mappedSUL);

        // monitor which queries are being processed.
        monitorOracle = new QueryMonitorOracle<>(new MultiSULOracle<>(sul));
        monitorOracle.addPostProcessingListener(queries -> {
            List<DefaultQueryProxy> currentQueries = new ArrayList<>();
            queries.forEach(query -> currentQueries.add(DefaultQueryProxy.createFrom(new DefaultQuery<>(query))));
            this.currentQueries = currentQueries;
        });

        // create the concrete membership oracle.
        this.mqOracle = new DelegationOracle<>();
        if (result.isUseMQCache()) {
            this.mqOracle.setDelegate(MealyCacheOracle.createDAGCacheOracle(this.abstractAlphabet, monitorOracle));
        } else {
            this.mqOracle.setDelegate(monitorOracle);
        }

        // create the learner.
        this.learner = result.getAlgorithm().createLearner(abstractAlphabet, mqOracle);
    }

    @Override
    public void run() {
    }

    protected LearnerResultStep createStep(long start, long end, long eqs, DefaultQuery<String, Word<String>> counterexample) {
        final Statistics statistics = new Statistics();
        statistics.setStartTime(start);
        statistics.getDuration().setLearner(end - start);
        statistics.getMqsUsed().setLearner(sul.getResetCount());
        statistics.getSymbolsUsed().setLearner(sul.getSymbolUsedCount());
        statistics.setEqsUsed(eqs);

        final LearnerResultStep step = learnerResultDAO.createStep(result, configuration);
        step.setStatistics(statistics);
        step.setAlgorithmInformation(result.getAlgorithm().getInternalData(learner));
        step.setHypothesis(CompactMealyMachineProxy.createFrom(learner.getHypothesisModel(), abstractAlphabet));
        step.setCounterExample(DefaultQueryProxy.createFrom(counterexample));
        result.getSteps().add(step);
        learnerResultDAO.saveStep(result, step);

        sul.resetCounter();

        return step;
    }

    protected void updateOnError(Exception e) {
        final String errorMessage = e.getMessage() == null ? e.getClass().getName() : e.getMessage();

        if (!result.getSteps().isEmpty()) {
            final LearnerResultStep lastStep = result.getSteps().get(result.getSteps().size() - 1);
            lastStep.setErrorText(errorMessage);
            learnerResultDAO.saveStep(result, lastStep);
        }

        sul.post();
    }

    private void updateStatisticsWithEqOracle(long start, long end, LearnerResultStep step) {
        step.getStatistics().getDuration().setEqOracle(end - start);
        step.getStatistics().getMqsUsed().setEqOracle(sul.getResetCount());
        step.getStatistics().getSymbolsUsed().setEqOracle(sul.getSymbolUsedCount());
        learnerResultDAO.saveStep(result, step);
        sul.resetCounter();
    }

    protected void doLearn(LearnerResultStep currentStep) {
        final EquivalenceOracle<MealyMachine<?, String, ?, String>, String, Word<String>> eqOracle =
                configuration.getEqOracle().createEqOracle(mqOracle, maxConcurrentQueries);

        long start, end;
        long rounds = 0;

        while (continueLearning(currentStep, rounds)) {

            // search for counterexamples
            learnerPhase = Learner.LearnerPhase.EQUIVALENCE_TESTING;
            start = System.nanoTime();
            DefaultQuery<String, Word<String>> counterexample = eqOracle.findCounterExample(
                    learner.getHypothesisModel(), abstractAlphabet);
            end = System.nanoTime();

            // after having searched for counterexamples, update the statistics of the current step
            // with the numbers of the equivalence oracle
            updateStatisticsWithEqOracle(start, end, currentStep);

            if (counterexample != null) {
                // for long randomly generated words, check if there is a shorter prefix that is also a counterexample
                if (configuration.getEqOracle() instanceof MealyRandomWordsEQOracleProxy) {
                    counterexample = findShortestPrefix(counterexample);
                }

                // refine the hypothesis
                learnerPhase = Learner.LearnerPhase.LEARNING;
                start = System.nanoTime();
                learner.refineHypothesis(counterexample);
                end = System.nanoTime();

                currentStep = createStep(start, end, 1, counterexample);
            } else {
                break;
            }

            rounds++;
        }
    }

    private boolean continueLearning(final LearnerResultStep step, final long rounds) {
        return step.getStepsToLearn() == -1 || step.getStepsToLearn() == rounds || isInterrupted();
    }

    /**
     * Given a counterexample, test if there is a shorter prefix that is also a counterexample.
     *
     * @param ce The counterexample.
     *
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

    public Learner.LearnerPhase getLearnerPhase() {
        return learnerPhase;
    }

    public List<DefaultQueryProxy> getCurrentQueries() {
        return currentQueries;
    }

    public boolean isFinished() {
        return finished;
    }

    public LearnerResult getResult() {
        return result;
    }

}
