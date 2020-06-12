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
import de.learnlib.alex.learning.entities.LearnerResult;
import de.learnlib.alex.learning.entities.LearnerResultStep;
import de.learnlib.alex.learning.entities.LearnerSetup;
import de.learnlib.alex.learning.entities.learnlibproxies.CompactMealyMachineProxy;
import de.learnlib.alex.learning.entities.learnlibproxies.DefaultQueryProxy;
import de.learnlib.alex.learning.entities.learnlibproxies.eqproxies.AbstractEquivalenceOracleProxy;
import de.learnlib.alex.learning.entities.learnlibproxies.eqproxies.TestSuiteEQOracleProxy;
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
import net.automatalib.words.impl.GrowingMapAlphabet;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Thread to run a learning process. It needs to be a Thread so that the server can still deal with other requests. This
 * class contains the actual learning loop.
 */
public abstract class AbstractLearnerProcess {

    protected static final Logger logger = LogManager.getLogger();

    /** The webhook service to user. */
    protected final WebhookService webhookService;

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

    protected LearnerSetup setup;

    protected AbstractEquivalenceOracleProxy equivalenceOracleProxy;

    protected EquivalenceOracle<MealyMachine<?, String, ?, String>, String, Word<String>> equivalenceOracle;

    public AbstractLearnerProcess(User user, LearnerResultDAO learnerResultDAO, WebhookService webhookService,
                                  TestDAO testDAO, PreparedContextHandler context, LearnerResult result,
                                  LearnerSetup setup, AbstractEquivalenceOracleProxy equivalenceOracleProxy) {
        this.user = user;
        this.learnerResultDAO = learnerResultDAO;
        this.webhookService = webhookService;
        this.result = result;
        this.setup = setup;
        this.testDAO = testDAO;
        this.equivalenceOracleProxy = equivalenceOracleProxy;

        this.abstractAlphabet = new GrowingMapAlphabet<>(new HashSet<>(// remove duplicate names with set
                setup.getSymbols().stream()
                        .map(ParameterizedSymbol::getAliasOrComputedName)
                        .sorted(String::compareTo)
                        .collect(Collectors.toList())
        ));

        this.preparedContextHandler = context;
        this.currentQueries = new ArrayList<>();
        this.symbolMapper = new SymbolMapper(setup.getSymbols());

        // create a sul oracle for each url
        this.sulOracles = setup.getEnvironments().stream()
                .map(env -> new ContextAwareSulOracle(symbolMapper, preparedContextHandler.create(env)))
                .collect(Collectors.toList());

        final DynamicParallelOracle<String, Word<String>> parallelOracle =
                    new DynamicParallelOracleBuilder<>(sulOracles)
                            .withBatchSize(1)
                            .withPoolSize(setup.getEnvironments().size())
                            .create();

        monitorOracle = new QueryMonitorOracle<>(parallelOracle);
        monitorOracle.addPostProcessingListener(queries -> {
            this.currentQueries = queries.stream()
                    .map(q -> DefaultQueryProxy.createFrom(new DefaultQuery<>(q)))
                    .collect(Collectors.toList());
        });

        interruptOracle = new InterruptibleOracle<>(monitorOracle);
        counterOracle = new StatisticsOracle<>(interruptOracle);

        // create the concrete membership oracle.
        this.mqOracle = new DelegationOracle<>();
        if (result.getSetup().isEnableCache()) {
            this.cacheOracle = MealyCacheOracle.createDAGCacheOracle(this.abstractAlphabet, counterOracle);
            this.mqOracle.setDelegate(cacheOracle);
        } else {
            this.mqOracle.setDelegate(counterOracle);
        }

        // create the learner.
        this.learner = result.getSetup().getAlgorithm().createLearner(abstractAlphabet, mqOracle);

        if (equivalenceOracleProxy instanceof TestSuiteEQOracleProxy) {
            equivalenceOracle = ((TestSuiteEQOracleProxy) equivalenceOracleProxy).createEqOracle(mqOracle, testDAO, user, result);
        } else {
            equivalenceOracle = equivalenceOracleProxy.createEqOracle(mqOracle);
        }
    }

    protected void startLearningLoop() throws Exception {
        while (true) {
            learnerPhase = LearnerService.LearnerPhase.EQUIVALENCE_TESTING;

            final long eqOracleStartTime = System.currentTimeMillis();
            final DefaultQuery<String, Word<String>> ce = equivalenceOracle.findCounterExample(learner.getHypothesisModel(), abstractAlphabet);
            final long eqOracleEndTime = System.currentTimeMillis();

            final LearnerResultStep currentStep = result.getSteps().get(result.getSteps().size() -1 );
            currentStep.getStatistics().getSymbolsUsed().setEqOracle(counterOracle.getSymbolCount());
            currentStep.getStatistics().getMqsUsed().setEqOracle(counterOracle.getQueryCount());
            currentStep.getStatistics().getDuration().setEqOracle(eqOracleEndTime - eqOracleStartTime);
            currentStep.setCounterExample(ce != null ? DefaultQueryProxy.createFrom(ce) : null);
            learnerResultDAO.updateStep(currentStep);
            counterOracle.reset();

            if (ce != null) {
                learnerPhase = LearnerService.LearnerPhase.LEARNING;

                final long learnerRefineStartTime = System.currentTimeMillis();
                learner.refineHypothesis(ce);
                final long learnerRefineEndTime = System.currentTimeMillis();

                createStep(learnerRefineEndTime, learnerRefineStartTime);
            } else {
                break;
            }
        }
    }

    protected void createStep(Long endTime, Long startTime) throws Exception {
        final LearnerResultStep step = new LearnerResultStep();
        step.getStatistics().getSymbolsUsed().setLearner(counterOracle.getSymbolCount());
        step.getStatistics().getMqsUsed().setLearner(counterOracle.getQueryCount());
        step.getStatistics().getDuration().setLearner(endTime - startTime);
        step.setEqOracle(equivalenceOracleProxy);
        step.setHypothesis(CompactMealyMachineProxy.createFrom(learner.getHypothesisModel(), abstractAlphabet));
        step.setState(setup.getAlgorithm().suspend(learner));
        step.setAlgorithmInformation(result.getSetup().getAlgorithm().getInternalData(learner));
        learnerResultDAO.createStep(result, step);
        counterOracle.reset();
    }

    abstract void run();

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
