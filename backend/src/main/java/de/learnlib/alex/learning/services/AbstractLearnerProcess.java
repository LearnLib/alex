/*
 * Copyright 2015 - 2020 TU Dortmund
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
import de.learnlib.alex.data.entities.ParameterizedSymbol;
import de.learnlib.alex.learning.dao.LearnerResultDAO;
import de.learnlib.alex.learning.entities.AbstractLearnerConfiguration;
import de.learnlib.alex.learning.entities.LearnerResult;
import de.learnlib.alex.learning.entities.LearnerResultStep;
import de.learnlib.alex.learning.entities.Statistics;
import de.learnlib.alex.learning.entities.learnlibproxies.CompactMealyMachineProxy;
import de.learnlib.alex.learning.entities.learnlibproxies.DefaultQueryProxy;
import de.learnlib.alex.learning.entities.learnlibproxies.eqproxies.TestSuiteEQOracleProxy;
import de.learnlib.alex.learning.events.LearnerEvent;
import de.learnlib.alex.learning.services.connectors.PreparedContextHandler;
import de.learnlib.alex.learning.services.oracles.ContextAwareSulOracle;
import de.learnlib.alex.learning.services.oracles.DelegationOracle;
import de.learnlib.alex.learning.services.oracles.InterruptibleOracle;
import de.learnlib.alex.learning.services.oracles.QueryMonitorOracle;
import de.learnlib.alex.learning.services.oracles.StatisticsOracle;
import de.learnlib.alex.testing.dao.TestDAO;
import de.learnlib.alex.webhooks.services.WebhookService;
import de.learnlib.api.algorithm.LearningAlgorithm;
import de.learnlib.api.oracle.EquivalenceOracle;
import de.learnlib.api.query.DefaultQuery;
import de.learnlib.filter.cache.mealy.MealyCacheOracle;
import de.learnlib.oracle.parallelism.DynamicParallelOracle;
import de.learnlib.oracle.parallelism.DynamicParallelOracleBuilder;
import net.automatalib.automata.transducers.MealyMachine;
import net.automatalib.words.Alphabet;
import net.automatalib.words.Word;
import net.automatalib.words.impl.SimpleAlphabet;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Thread to run a learning process. It needs to be a Thread so that the server can still deal with other requests. This
 * class contains the actual learning loop.
 *
 * @param <T>
 *         The type of the configuration.
 */
public abstract class AbstractLearnerProcess<T extends AbstractLearnerConfiguration> {

    protected static final Logger LOGGER = LogManager.getLogger();

    /** The webhook service to user. */
    private final WebhookService webhookService;

    /** The queries that are executed at the moment. */
    private List<DefaultQueryProxy> currentQueries;

    /** The user who is stating the Learning Thread. */
    protected User user;

    /** The DAO to remember the learn results. */
    protected final LearnerResultDAO learnerResultDAO;

    /** The learner to use during the learning. */
    protected final LearningAlgorithm.MealyLearner<String, String> learner;

    /** The phase of the learner. */
    protected LearnerService.LearnerPhase learnerPhase;

    /** The learner result. */
    protected LearnerResult result;

    /** The abstract alphabet that is used during the learning process. */
    protected Alphabet<String> abstractAlphabet;

    /** The configuration that is used. */
    protected T configuration;

    /** The membership oracle on the upmost level that all queries are posed to. */
    protected final DelegationOracle<String, String> mqOracle;

    /** Maps an abstract alphabet to a concrete one. */
    protected final SymbolMapper symbolMapper;

    /** The oracle that monitors which queries are being posed. */
    protected final QueryMonitorOracle<String, String> monitorOracle;

    /** The oracle that can be interrupted. */
    protected final InterruptibleOracle<String, String> interruptOracle;

    /** The test DAO. */
    protected final TestDAO testDAO;

    protected final StatisticsOracle<String, Word<String>> counterOracle;

    protected final PreparedContextHandler preparedContextHandler;

    protected final List<ContextAwareSulOracle> sulOracles;

    protected MealyCacheOracle<String, String> cacheOracle = null;

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
    public AbstractLearnerProcess(User user, LearnerResultDAO learnerResultDAO, WebhookService webhookService,
                                  TestDAO testDAO, PreparedContextHandler context, LearnerResult result, T configuration) {
        this.user = user;
        this.learnerResultDAO = learnerResultDAO;
        this.webhookService = webhookService;
        this.result = result;
        this.configuration = configuration;
        this.testDAO = testDAO;

        this.abstractAlphabet = new SimpleAlphabet<>(new HashSet<>(// remove duplicate names with set
                result.getSymbols().stream()
                        .map(ParameterizedSymbol::getAliasOrComputedName)
                        .sorted(String::compareTo)
                        .collect(Collectors.toList())
        ));

        this.preparedContextHandler = context;
        this.currentQueries = new ArrayList<>();
        this.symbolMapper = new SymbolMapper(result.getSymbols());

        // create a sul oracle for each url
        this.sulOracles = configuration.getEnvironments().stream()
                .map(env -> new ContextAwareSulOracle(symbolMapper, preparedContextHandler.create(env)))
                .collect(Collectors.toList());

        final int numUrls = configuration.getEnvironments().size();
        if (numUrls > 1) {
            final DynamicParallelOracle<String, Word<String>> parallelOracle =
                    new DynamicParallelOracleBuilder<>(sulOracles)
                            .withBatchSize(1)
                            .withPoolSize(numUrls)
                            .create();

            monitorOracle = new QueryMonitorOracle<>(parallelOracle);
        } else {
            monitorOracle = new QueryMonitorOracle<>(sulOracles.get(0));
        }

        monitorOracle.addPostProcessingListener(queries -> {
            this.currentQueries = queries.stream()
                    .map(q -> DefaultQueryProxy.createFrom(new DefaultQuery<>(q)))
                    .collect(Collectors.toList());
        });

        interruptOracle = new InterruptibleOracle<>(monitorOracle);
        counterOracle = new StatisticsOracle<>(interruptOracle);

        // create the concrete membership oracle.
        this.mqOracle = new DelegationOracle<>();
        if (result.isUseMQCache()) {
            this.cacheOracle = MealyCacheOracle.createDAGCacheOracle(this.abstractAlphabet, counterOracle);
            this.mqOracle.setDelegate(cacheOracle);
        } else {
            this.mqOracle.setDelegate(counterOracle);
        }

        // create the learner.
        this.learner = result.getAlgorithm().createLearner(abstractAlphabet, mqOracle);
    }

    abstract void run();

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
        statistics.getDuration().setLearner(end - start);
        statistics.getMqsUsed().setLearner(counterOracle.getQueryCount());
        statistics.getSymbolsUsed().setLearner(counterOracle.getSymbolCount());
        statistics.setEqsUsed(eqs);

        final LearnerResultStep step = learnerResultDAO.createStep(result, configuration);
        step.setStatistics(statistics);

        try {
            step.setState(result.getAlgorithm().suspend(learner));
        } catch (IOException e) {
            e.printStackTrace();
        }

        try {
            step.setAlgorithmInformation(result.getAlgorithm().getInternalData(learner));
            step.setCounterExample(DefaultQueryProxy.createFrom(counterexample));
            result.getSteps().add(step);
            step.setHypothesis(CompactMealyMachineProxy.createFrom(learner.getHypothesisModel(), abstractAlphabet));
        } catch (Exception e) {
            e.printStackTrace();
            step.setErrorText("Failed to save step: " + e.getMessage());
        }

        learnerResultDAO.saveStep(result, step);
        counterOracle.reset();
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
            createStep(0, 0, 0, null);
        }
    }

    private void updateStatisticsWithEqOracle(long start, long end, LearnerResultStep step) {
        step.getStatistics().getDuration().setEqOracle(end - start);
        step.getStatistics().getMqsUsed().setEqOracle(counterOracle.getQueryCount());
        step.getStatistics().getSymbolsUsed().setEqOracle(counterOracle.getSymbolCount());
        try {
            learnerResultDAO.saveStep(result, step);
        } catch (de.learnlib.alex.common.exceptions.NotFoundException e) {
            e.printStackTrace();
        }
        counterOracle.reset();
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
            eqOracle = ((TestSuiteEQOracleProxy) configuration.getEqOracle()).createEqOracle(mqOracle, testDAO, user, result);
        } else {
            eqOracle = configuration.getEqOracle().createEqOracle(mqOracle);
        }

        long start, end;

        while (true) {

            // search for counterexamples
            learnerPhase = LearnerService.LearnerPhase.EQUIVALENCE_TESTING;
            start = System.currentTimeMillis();
            DefaultQuery<String, Word<String>> counterexample = eqOracle.findCounterExample(
                    learner.getHypothesisModel(), abstractAlphabet);
            end = System.currentTimeMillis();

            // after having searched for counterexamples, update the statistics of the current step
            // with the numbers of the equivalence oracle
            updateStatisticsWithEqOracle(start, end, currentStep);

            if (counterexample != null) {
                // refine the hypothesis
                learnerPhase = LearnerService.LearnerPhase.LEARNING;
                start = System.currentTimeMillis();
                learner.refineHypothesis(counterexample);
                end = System.currentTimeMillis();

                currentStep = createStep(start, end, 1, counterexample);
            } else {
                break;
            }
        }

        webhookService.fireEvent(user, new LearnerEvent.Finished(result));
    }

    public void stopLearning() {
        this.interruptOracle.interrupt();
    }

    public LearnerService.LearnerPhase getLearnerPhase() {
        return learnerPhase;
    }

    public List<DefaultQueryProxy> getCurrentQueries() {
        return currentQueries;
    }

    public LearnerResult getResult() {
        return result;
    }

    protected void shutdown() {
        sulOracles.forEach(ContextAwareSulOracle::shutdown);
    }
}
