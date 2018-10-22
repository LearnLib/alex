/*
 * Copyright 2018 TU Dortmund
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

package de.learnlib.alex.learning.services;

import de.learnlib.alex.auth.entities.User;
import de.learnlib.alex.data.entities.ExecuteResult;
import de.learnlib.alex.data.entities.ParameterizedSymbol;
import de.learnlib.alex.learning.dao.LearnerResultDAO;
import de.learnlib.alex.learning.entities.AbstractLearnerConfiguration;
import de.learnlib.alex.learning.entities.LearnerResult;
import de.learnlib.alex.learning.entities.LearnerResultStep;
import de.learnlib.alex.learning.entities.Statistics;
import de.learnlib.alex.learning.entities.learnlibproxies.CompactMealyMachineProxy;
import de.learnlib.alex.learning.entities.learnlibproxies.DefaultQueryProxy;
import de.learnlib.alex.learning.entities.learnlibproxies.eqproxies.MealyRandomWordsEQOracleProxy;
import de.learnlib.alex.learning.entities.learnlibproxies.eqproxies.TestSuiteEQOracleProxy;
import de.learnlib.alex.learning.events.LearnerEvent;
import de.learnlib.alex.learning.services.connectors.ConnectorContextHandler;
import de.learnlib.alex.learning.services.connectors.ConnectorManager;
import de.learnlib.alex.learning.services.oracles.DelegationOracle;
import de.learnlib.alex.learning.services.oracles.InterruptibleOracle;
import de.learnlib.alex.learning.services.oracles.QueryMonitorOracle;
import de.learnlib.alex.testing.dao.TestDAO;
import de.learnlib.alex.webhooks.services.WebhookService;
import de.learnlib.api.SUL;
import de.learnlib.api.algorithm.LearningAlgorithm;
import de.learnlib.api.oracle.EquivalenceOracle;
import de.learnlib.api.query.DefaultQuery;
import de.learnlib.filter.cache.mealy.MealyCacheOracle;
import de.learnlib.mapper.ContextExecutableInputSUL;
import de.learnlib.mapper.SULMappers;
import de.learnlib.mapper.api.ContextExecutableInput;
import de.learnlib.oracle.membership.SULOracle;
import de.learnlib.oracle.parallelism.DynamicParallelOracle;
import de.learnlib.oracle.parallelism.DynamicParallelOracleBuilder;
import de.learnlib.oracle.parallelism.ParallelOracle;
import net.automatalib.automata.transout.MealyMachine;
import net.automatalib.words.Alphabet;
import net.automatalib.words.Word;
import net.automatalib.words.impl.SimpleAlphabet;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

/**
 * Thread to run a learning process. It needs to be a Thread so that the server can still deal with other requests. This
 * class contains the actual learning loop.
 *
 * @param <T>
 *         The type of the configuration.
 */
public abstract class AbstractLearnerThread<T extends AbstractLearnerConfiguration> extends Thread {

    protected static final Logger LOGGER = LogManager.getLogger();

    /** The user who is stating the Learning Thread. */
    protected User user;

    /** Is the thread still running? */
    protected boolean finished;

    /** The system under learning. */
    protected final AlexSUL<String, String> sul;

    /** The DAO to remember the learn results. */
    protected final LearnerResultDAO learnerResultDAO;

    /** The webhook service to user. */
    private final WebhookService webhookService;

    /** The learner to use during the learning. */
    protected final LearningAlgorithm.MealyLearner<String, String> learner;

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

    /** The oracle that can be interrupted. */
    protected final InterruptibleOracle<String, String> interruptOracle;

    /** The test DAO. */
    protected final TestDAO testDAO;

    /** The number of mqs executed in parallel. */
    private int maxConcurrentQueries;

    /** The queries that are executed at the moment. */
    private List<DefaultQueryProxy> currentQueries;

    /** The current connector context. */
    protected ConnectorContextHandler context;

    /**
     * Constructor.
     *
     * @param user
     *         The current user.
     * @param learnerResultDAO
     *         {@link #learnerResultDAO}.
     * @param webhookService
     *         {@link #webhookService}.
     * @param context
     *         The context to use.
     * @param testDAO
     *         The test DAO to use.
     * @param result
     *         {@link #result}.
     * @param configuration
     *         {@link #configuration}.
     */
    public AbstractLearnerThread(User user, LearnerResultDAO learnerResultDAO, WebhookService webhookService,
                                 TestDAO testDAO, ConnectorContextHandler context, LearnerResult result, T configuration) {
        this.user = user;
        this.learnerResultDAO = learnerResultDAO;
        this.webhookService = webhookService;
        this.result = result;
        this.configuration = configuration;
        this.testDAO = testDAO;

        this.abstractAlphabet = new SimpleAlphabet<>(new HashSet<>(// remove duplicate names with set
                result.getSymbols().stream()
                        .map(ParameterizedSymbol::getComputedName)
                        .sorted(String::compareTo)
                        .collect(Collectors.toList())
        ));

        this.context = context;
        this.finished = false;
        this.maxConcurrentQueries = context.getMaxConcurrentQueries();
        this.currentQueries = new ArrayList<>();

        // prepare the mapped sul.
        symbolMapper = new SymbolMapper(result.getSymbols());
        final ContextExecutableInputSUL<ContextExecutableInput<ExecuteResult, ConnectorManager>, ExecuteResult, ConnectorManager>
                ceiSUL = new ContextExecutableInputSUL<>(context);
        final SUL<String, String> mappedSUL = SULMappers.apply(symbolMapper, ceiSUL);
        this.sul = new AlexSUL<>(mappedSUL);

        final int numUrls = configuration.getUrls().size();
        if (numUrls > 1) {
            final DynamicParallelOracle<String, Word<String>> parallelOracle =
                    new DynamicParallelOracleBuilder<>(() -> new SULOracle<>(sul))
                            .withPoolPolicy(ParallelOracle.PoolPolicy.CACHED)
                            .withBatchSize(numUrls)
                            .withPoolSize(numUrls)
                            .create();

            monitorOracle = new QueryMonitorOracle<>(parallelOracle);
        } else {
            monitorOracle = new QueryMonitorOracle<>(new SULOracle<>(sul));
        }

        monitorOracle.addPostProcessingListener(queries -> {
            this.currentQueries = queries.stream()
                    .map(q -> DefaultQueryProxy.createFrom(new DefaultQuery<>(q)))
                    .collect(Collectors.toList());
        });

        interruptOracle = new InterruptibleOracle<>(monitorOracle);

        // create the concrete membership oracle.
        this.mqOracle = new DelegationOracle<>();
        if (result.isUseMQCache()) {
            this.mqOracle.setDelegate(MealyCacheOracle.createDAGCacheOracle(this.abstractAlphabet, interruptOracle));
        } else {
            this.mqOracle.setDelegate(interruptOracle);
        }

        // create the learner.
        this.learner = result.getAlgorithm().createLearner(abstractAlphabet, mqOracle);
    }

    @Override
    public void run() {
    }

    /**
     * Creates and persists a learner step.
     *
     * @param start
     *         The start time of the step in ns.
     * @param end
     *         The end time of the step in ns.
     * @param eqs
     *         The number of equivalence queries posed in the step.
     * @param counterexample
     *         The counterexample used in the step.
     * @return The persisted step.
     */
    protected LearnerResultStep createStep(long start, long end, long eqs,
                                           DefaultQuery<String, Word<String>> counterexample) {
        final Statistics statistics = new Statistics();
        statistics.setStartTime(start);
        statistics.getDuration().setLearner(end - start);
        statistics.getMqsUsed().setLearner(sul.getResetCount());
        statistics.getSymbolsUsed().setLearner(sul.getSymbolUsedCount());
        statistics.setEqsUsed(eqs);

        final LearnerResultStep step = learnerResultDAO.createStep(result, configuration);
        step.setStatistics(statistics);
        try {
            step.setState(result.getAlgorithm().suspend(learner));
        } catch (IOException e) {
            e.printStackTrace();
        }
        step.setAlgorithmInformation(result.getAlgorithm().getInternalData(learner));
        step.setHypothesis(CompactMealyMachineProxy.createFrom(learner.getHypothesisModel(), abstractAlphabet));
        step.setCounterExample(DefaultQueryProxy.createFrom(counterexample));
        result.getSteps().add(step);

        try {
            learnerResultDAO.saveStep(result, step);
        } catch (de.learnlib.alex.common.exceptions.NotFoundException e) {
            e.printStackTrace();
        }

        sul.resetCounter();

        return step;
    }

    /**
     * Creates a new steps that only contains an error message for the current step.
     *
     * @param e
     *         The exception that led to the error.
     */
    protected void updateOnError(Exception e) {
        final String errorMessage = e.getMessage() == null ? e.getClass().getName() : e.getMessage();

        if (!result.getSteps().isEmpty()) {
            final LearnerResultStep errorStep = createStep(0L, 0L, 0, null);
            errorStep.setErrorText(errorMessage);

            try {
                learnerResultDAO.saveStep(result, errorStep);
            } catch (de.learnlib.alex.common.exceptions.NotFoundException e1) {
                e1.printStackTrace();
            }
        } else {
            if (result.getId() == null) {
                try {
                    result = learnerResultDAO.create(user, result);
                } catch (de.learnlib.alex.common.exceptions.NotFoundException e1) {
                    e1.printStackTrace();
                }
            }
            createStep(0, 0, 0, null);
        }

        sul.post();
    }

    private void updateStatisticsWithEqOracle(long start, long end, LearnerResultStep step) {
        step.getStatistics().getDuration().setEqOracle(end - start);
        step.getStatistics().getMqsUsed().setEqOracle(sul.getResetCount());
        step.getStatistics().getSymbolsUsed().setEqOracle(sul.getSymbolUsedCount());
        try {
            learnerResultDAO.saveStep(result, step);
        } catch (de.learnlib.alex.common.exceptions.NotFoundException e) {
            e.printStackTrace();
        }
        sul.resetCounter();
    }

    /**
     * Execute the learning loop.
     *
     * @param currentStep
     *         The current step.
     */
    protected void doLearn(LearnerResultStep currentStep) {

        final EquivalenceOracle<MealyMachine<?, String, ?, String>, String, Word<String>> eqOracle;
        if (configuration.getEqOracle() instanceof TestSuiteEQOracleProxy) {
            eqOracle =
                    ((TestSuiteEQOracleProxy) configuration.getEqOracle()).createEqOracle(mqOracle, maxConcurrentQueries, testDAO, user, result);
        } else {
            eqOracle = configuration.getEqOracle().createEqOracle(mqOracle, maxConcurrentQueries);
        }

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

        webhookService.fireEvent(user, new LearnerEvent.Finished(result));
    }

    private boolean continueLearning(final LearnerResultStep step, final long rounds) {
        return step.getStepsToLearn() == -1 || step.getStepsToLearn() == rounds || isInterrupted();
    }

    /**
     * Given a counterexample, test if there is a shorter prefix that is also a counterexample.
     *
     * @param ce
     *         The counterexample.
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

    public void stopLearning() {
        this.interruptOracle.interrupt();
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
