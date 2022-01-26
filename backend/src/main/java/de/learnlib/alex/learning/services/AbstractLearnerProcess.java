/*
 * Copyright 2015 - 2022 TU Dortmund
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

import de.learnlib.alex.auth.dao.UserDAO;
import de.learnlib.alex.auth.entities.User;
import de.learnlib.alex.data.dao.ProjectDAO;
import de.learnlib.alex.data.entities.ParameterizedSymbol;
import de.learnlib.alex.data.entities.Project;
import de.learnlib.alex.learning.dao.LearnerResultDAO;
import de.learnlib.alex.learning.dao.LearnerResultStepDAO;
import de.learnlib.alex.learning.dao.LearnerSetupDAO;
import de.learnlib.alex.learning.entities.LearnerResult;
import de.learnlib.alex.learning.entities.LearnerResultStep;
import de.learnlib.alex.learning.entities.LearnerSetup;
import de.learnlib.alex.learning.entities.learnlibproxies.CompactMealyMachineProxy;
import de.learnlib.alex.learning.entities.learnlibproxies.DefaultQueryProxy;
import de.learnlib.alex.learning.entities.learnlibproxies.eqproxies.AbstractEquivalenceOracleProxy;
import de.learnlib.alex.learning.entities.learnlibproxies.eqproxies.TestSuiteEQOracleProxy;
import de.learnlib.alex.learning.services.connectors.PreparedConnectorContextHandlerFactory;
import de.learnlib.alex.learning.services.connectors.PreparedContextHandler;
import de.learnlib.alex.learning.services.oracles.ContextAwareSulOracle;
import de.learnlib.alex.learning.services.oracles.DelegationOracle;
import de.learnlib.alex.learning.services.oracles.InterruptibleOracle;
import de.learnlib.alex.learning.services.oracles.QueryMonitorOracle;
import de.learnlib.alex.learning.services.oracles.StatisticsOracle;
import de.learnlib.alex.modelchecking.services.ModelCheckerService;
import de.learnlib.alex.testing.dao.TestDAO;
import de.learnlib.alex.webhooks.services.WebhookService;
import de.learnlib.api.algorithm.LearningAlgorithm;
import de.learnlib.api.oracle.EquivalenceOracle;
import de.learnlib.api.query.DefaultQuery;
import de.learnlib.filter.cache.mealy.MealyCacheOracle;
import de.learnlib.oracle.parallelism.DynamicParallelOracleBuilder;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.stream.Collectors;
import net.automatalib.automata.transducers.MealyMachine;
import net.automatalib.words.Alphabet;
import net.automatalib.words.Word;
import net.automatalib.words.impl.GrowingMapAlphabet;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.transaction.support.TransactionTemplate;

/**
 * Thread to run a learning process. It needs to be a Thread so that the server can still deal with other requests. This
 * class contains the actual learning loop.
 */
public abstract class AbstractLearnerProcess<C extends AbstractLearnerProcessQueueItem> {

    protected static final Logger logger = LoggerFactory.getLogger(AbstractLearnerProcess.class);

    protected final UserDAO userDAO;
    protected final ProjectDAO projectDAO;
    protected final LearnerSetupDAO learnerSetupDAO;
    protected final LearnerResultDAO learnerResultDAO;
    protected final LearnerResultStepDAO learnerResultStepDAO;
    protected final TestDAO testDAO;
    protected final WebhookService webhookService;
    protected final PreparedConnectorContextHandlerFactory contextHandlerFactory;
    protected final TransactionTemplate transactionTemplate;
    protected final ModelCheckerService modelCheckerService;

    /** The user who is stating the Learning Thread. */
    protected User user;

    /** The current project. */
    protected Project project;

    /** The learner result. */
    protected LearnerResult result;

    /** The learner setup. */
    protected LearnerSetup setup;

    /** The queries that are executed at the moment. */
    private List<DefaultQueryProxy> currentQueries;

    /** The learner to use during the learning. */
    protected LearningAlgorithm.MealyLearner<String, String> learner;

    /** The phase of the learner. */
    protected LearnerService.LearnerPhase learnerPhase;

    /** The abstract alphabet that is used during the learning process. */
    protected Alphabet<String> abstractAlphabet;

    /** The membership oracle on the upmost level that all queries are posed to. */
    protected DelegationOracle<String, String> mqOracle;

    /** Maps an abstract alphabet to a concrete one. */
    protected SymbolMapper symbolMapper;

    /** The oracle that monitors which queries are being posed. */
    protected QueryMonitorOracle<String, String> monitorOracle;

    /** The oracle that can be interrupted. */
    protected InterruptibleOracle<String, String> interruptOracle;

    protected StatisticsOracle<String, Word<String>> counterOracle;

    protected PreparedContextHandler preparedContextHandler;

    protected List<ContextAwareSulOracle> sulOracles;

    protected MealyCacheOracle<String, String> cacheOracle;

    protected AbstractEquivalenceOracleProxy equivalenceOracleProxy;

    protected EquivalenceOracle<MealyMachine<?, String, ?, String>, String, Word<String>> equivalenceOracle;

    public AbstractLearnerProcess(
            UserDAO userDAO,
            ProjectDAO projectDAO,
            LearnerResultDAO learnerResultDAO,
            LearnerSetupDAO learnerSetupDAO,
            LearnerResultStepDAO learnerResultStepDAO,
            TestDAO testDAO,
            WebhookService webhookService,
            PreparedConnectorContextHandlerFactory contextHandlerFactory,
            TransactionTemplate transactionTemplate,
            ModelCheckerService modelCheckerService
    ) {
        this.userDAO = userDAO;
        this.projectDAO = projectDAO;
        this.learnerResultDAO = learnerResultDAO;
        this.learnerResultStepDAO = learnerResultStepDAO;
        this.learnerSetupDAO = learnerSetupDAO;
        this.testDAO = testDAO;
        this.webhookService = webhookService;
        this.contextHandlerFactory = contextHandlerFactory;
        this.transactionTemplate = transactionTemplate;
        this.modelCheckerService = modelCheckerService;
    }

    public boolean isAborted() {
        return result.getStatus().equals(LearnerResult.Status.ABORTED);
    }

    public boolean isInitialized() {
        return learner != null;
    }

    protected void initInternal(C context) {
        user = userDAO.getByID(context.userId);
        project = projectDAO.getByID(user, context.projectId);
        result = learnerResultDAO.getByID(user, context.projectId, context.resultId);
        setup = learnerSetupDAO.getById(user, project.getId(), result.getSetup().getId());

        this.abstractAlphabet = new GrowingMapAlphabet<>(new HashSet<>(// remove duplicate names with set
                setup.getSymbols().stream()
                        .map(ParameterizedSymbol::getAliasOrComputedName)
                        .sorted(String::compareTo)
                        .collect(Collectors.toList())
        ));

        this.preparedContextHandler = contextHandlerFactory.createPreparedContextHandler(
                user, result.getProject(), setup.getWebDriver(), setup.getPreSymbol(), setup.getPostSymbol());

        this.currentQueries = new ArrayList<>();
        this.symbolMapper = new SymbolMapper(setup.getSymbols());

        // create a sul oracle for each url
        this.sulOracles = setup.getEnvironments().stream()
                .map(env -> new ContextAwareSulOracle(symbolMapper, preparedContextHandler.create(env)))
                .collect(Collectors.toList());

        final var parallelOracle =
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
        if (setup.isEnableCache()) {
            this.cacheOracle = MealyCacheOracle.createDAGCacheOracle(this.abstractAlphabet, counterOracle);
            this.mqOracle.setDelegate(cacheOracle);
        } else {
            this.mqOracle.setDelegate(counterOracle);
        }

        // create the learner.
        this.learner = setup.getAlgorithm().createLearner(abstractAlphabet, mqOracle);
    }

    public void setEquivalenceOracle(AbstractEquivalenceOracleProxy equivalenceOracleProxy) {
        this.equivalenceOracleProxy = equivalenceOracleProxy;
        if (equivalenceOracleProxy instanceof TestSuiteEQOracleProxy) {
            equivalenceOracle = ((TestSuiteEQOracleProxy) equivalenceOracleProxy).createEqOracle(mqOracle, testDAO, user, result);
        } else {
            equivalenceOracle = equivalenceOracleProxy.createEqOracle(mqOracle);
        }
    }

    protected void startLearningLoop() {
        while (true) {
            learnerPhase = LearnerService.LearnerPhase.EQUIVALENCE_TESTING;

            final var eqOracleStartTime = System.currentTimeMillis();
            final var ce = equivalenceOracle.findCounterExample(learner.getHypothesisModel(), abstractAlphabet);
            final var eqOracleEndTime = System.currentTimeMillis();

            final LearnerResultStep currentStep = result.getSteps().get(result.getSteps().size() - 1);

            transactionTemplate.execute(t -> {
                final var stepToUpdate = learnerResultStepDAO.getById(user, project.getId(), result.getId(), currentStep.getId());
                stepToUpdate.getStatistics().getSymbolsUsed().setEqOracle(counterOracle.getSymbolCount());
                stepToUpdate.getStatistics().getMqsUsed().setEqOracle(counterOracle.getQueryCount());
                stepToUpdate.getStatistics().getDuration().setEqOracle(eqOracleEndTime - eqOracleStartTime);
                stepToUpdate.setCounterExample(ce != null ? DefaultQueryProxy.createFrom(ce) : null);

                learnerResultStepDAO.update(stepToUpdate.getId(), stepToUpdate);
                return null;
            });

            result = learnerResultDAO.getByID(user, project.getId(), result.getId());

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

    protected void createStep(Long endTime, Long startTime) {
        final LearnerResultStep step = new LearnerResultStep();
        step.getStatistics().getSymbolsUsed().setLearner(counterOracle.getSymbolCount());
        step.getStatistics().getMqsUsed().setLearner(counterOracle.getQueryCount());
        step.getStatistics().getDuration().setLearner(endTime - startTime);
        step.setEqOracle(equivalenceOracleProxy);
        step.setHypothesis(CompactMealyMachineProxy.createFrom(learner.getHypothesisModel(), abstractAlphabet));
        try {
            step.setState(setup.getAlgorithm().suspend(learner));
        } catch (IOException e) {
            e.printStackTrace();
        }
        step.setAlgorithmInformation(setup.getAlgorithm().getInternalData(learner));
        modelCheck(step);
        counterOracle.reset();
        result = learnerResultDAO.addStep(result.getId(), step);
    }

    abstract void init(C context);

    abstract void run();

    public void abort() {
        result = learnerResultDAO.updateStatus(result.getId(), LearnerResult.Status.ABORTED);

        if (isInitialized()) {
            this.interruptOracle.interrupt();
        }
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

    protected void shutdownWithErrors() {
        result = learnerResultDAO.updateStatus(result.getId(), LearnerResult.Status.ABORTED);
        sulOracles.forEach(ContextAwareSulOracle::shutdown);
    }

    protected void shutdown() {
        result = learnerResultDAO.updateStatus(result.getId(), LearnerResult.Status.FINISHED);
        sulOracles.forEach(ContextAwareSulOracle::shutdown);
    }

    private void modelCheck(LearnerResultStep step) {
        if (!setup.getModelCheckingConfig().getFormulaSuites().isEmpty()) {
            final var results = modelCheckerService.check(step, setup.getModelCheckingConfig());
            step.setModelCheckingResults(results);
        }
    }
}
