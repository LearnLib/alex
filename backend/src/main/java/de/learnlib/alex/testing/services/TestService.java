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

package de.learnlib.alex.testing.services;

import de.learnlib.alex.auth.entities.User;
import de.learnlib.alex.common.exceptions.NotFoundException;
import de.learnlib.alex.common.utils.LoggerMarkers;
import de.learnlib.alex.common.utils.SearchHelper;
import de.learnlib.alex.data.dao.ProjectDAO;
import de.learnlib.alex.data.entities.ExecuteResult;
import de.learnlib.alex.data.entities.ParameterizedSymbol;
import de.learnlib.alex.data.entities.Project;
import de.learnlib.alex.data.entities.ProjectUrl;
import de.learnlib.alex.data.entities.Symbol;
import de.learnlib.alex.data.entities.SymbolParameter;
import de.learnlib.alex.data.entities.SymbolStep;
import de.learnlib.alex.data.repositories.ProjectUrlRepository;
import de.learnlib.alex.learning.services.connectors.ConnectorContextHandler;
import de.learnlib.alex.learning.services.connectors.ConnectorContextHandlerFactory;
import de.learnlib.alex.learning.services.connectors.ConnectorManager;
import de.learnlib.alex.learning.services.connectors.CounterStoreConnector;
import de.learnlib.alex.learning.services.connectors.VariableStoreConnector;
import de.learnlib.alex.testing.dao.TestDAO;
import de.learnlib.alex.testing.dao.TestReportDAO;
import de.learnlib.alex.testing.entities.Test;
import de.learnlib.alex.testing.entities.TestCase;
import de.learnlib.alex.testing.entities.TestCaseResult;
import de.learnlib.alex.testing.entities.TestCaseStep;
import de.learnlib.alex.testing.entities.TestExecutionConfig;
import de.learnlib.alex.testing.entities.TestExecutionResult;
import de.learnlib.alex.testing.entities.TestReport;
import de.learnlib.alex.testing.entities.TestResult;
import de.learnlib.alex.testing.entities.TestStatus;
import de.learnlib.alex.testing.entities.TestSuite;
import de.learnlib.alex.testing.entities.TestSuiteResult;
import de.learnlib.alex.webhooks.services.WebhookService;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.stereotype.Service;

import javax.inject.Inject;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/** The service that executes tests. */
@Service
public class TestService {

    private static final Logger LOGGER = LogManager.getLogger();

    /** Factory to create a new ContextHandler. */
    private final ConnectorContextHandlerFactory contextHandlerFactory;

    /** The running testing threads. userId -> (projectId -> TestThread). */
    private final Map<Long, Map<Long, TestThread>> testingThreads;

    /** The {@link WebhookService} to use. */
    private final WebhookService webhookService;

    /** The {@link TestDAO} to use. */
    private final TestDAO testDAO;

    /** The {@link TestReportDAO} to use. */
    private final TestReportDAO testReportDAO;

    /** The {@link ProjectUrlRepository} to use. */
    private final ProjectUrlRepository projectUrlRepository;

    /** The {@link ProjectDAO} to use. */
    private final ProjectDAO projectDAO;

    /**
     * Constructor.
     *
     * @param contextHandlerFactory
     *         The injected {@link ConnectorContextHandlerFactory}.
     * @param webhookService
     *         The injected {@link WebhookService}.
     * @param testDAO
     *         The injected {@link TestDAO}.
     * @param testReportDAO
     *         The injected {@link TestReportDAO}.
     * @param projectUrlRepository
     *         The injected {@link ProjectUrlRepository}.
     * @param projectDAO
     *         The injected {@link ProjectDAO}.
     */
    @Inject
    public TestService(ConnectorContextHandlerFactory contextHandlerFactory, WebhookService webhookService,
            TestDAO testDAO, TestReportDAO testReportDAO, ProjectUrlRepository projectUrlRepository,
            ProjectDAO projectDAO) {
        this.contextHandlerFactory = contextHandlerFactory;
        this.webhookService = webhookService;
        this.testDAO = testDAO;
        this.testReportDAO = testReportDAO;
        this.testingThreads = new HashMap<>();
        this.projectUrlRepository = projectUrlRepository;
        this.projectDAO = projectDAO;
    }

    /**
     * Starts a new test thread.
     *
     * @param user
     *         The user.
     * @param project
     *         The project.
     * @param config
     *         The config for the tests.
     * @return A test status.
     */
    public TestStatus start(User user, Project project, TestExecutionConfig config) {
        final TestThread thread = new TestThread(user, project, config, webhookService, testDAO,
                testReportDAO, this, () -> {
            this.testingThreads.get(user.getId()).remove(project.getId());
            if (this.testingThreads.get(user.getId()).values().size() == 0) {
                this.testingThreads.remove(user.getId());
            }
        });

        if (testingThreads.containsKey(user.getId())) {
            if (testingThreads.get(user.getId()).containsKey(project.getId())) {
                testingThreads.get(user.getId()).get(project.getId()).add(config);
            } else {
                testingThreads.get(user.getId()).put(project.getId(), thread);
                thread.start();
            }
        } else {
            this.testingThreads.put(user.getId(), new HashMap<>());
            this.testingThreads.get(user.getId()).put(project.getId(), thread);
            thread.start();
        }

        return getStatus(user, project);
    }

    /**
     * Abort the test thread of the user and the project.
     *
     * @param user
     *         The user.
     * @param projectId
     *         The ID of the project.
     * @throws NotFoundException
     *         If the project cannot be found.
     */
    public void abort(User user, Long projectId) throws NotFoundException {
        final Project project = projectDAO.getByID(user.getId(), projectId, ProjectDAO.EmbeddableFields.COUNTERS);
        if (testingThreads.containsKey(user.getId()) && testingThreads.get(user.getId()).containsKey(project.getId())) {
            testingThreads.get(user.getId()).get(project.getId()).abort();
        }
    }

    /**
     * Gets the status of the active test process of a project.
     *
     * @param user
     *         The user.
     * @param project
     *         The project.
     * @return The status.
     */
    public TestStatus getStatus(User user, Project project) {
        final TestStatus status = new TestStatus();

        if (!testingThreads.containsKey(user.getId())) {
            status.setActive(false);
        } else {
            if (!testingThreads.get(user.getId()).containsKey(project.getId())) {
                status.setActive(false);
            } else {
                final TestReport report = testingThreads.get(user.getId()).get(project.getId()).getReport();
                status.setReport(report);
                status.setActive(true);
                status.setTestsInQueue(testingThreads.get(user.getId()).get(project.getId()).getNumberOfTestsInQueue());
            }
        }

        return status;
    }

    /**
     * Executes multiple tests.
     *
     * @param user
     *         The user that executes the test suite.
     * @param tests
     *         The tests that should be executed.
     * @param testConfig
     *         The config for the test.
     * @param results
     *         The map with the test results.
     * @return The updated test result map.
     */
    public Map<Long, TestResult> executeTests(User user, List<Test> tests, TestExecutionConfig testConfig,
            Map<Long, TestResult> results) {
        for (Test test : tests) {
            if (test instanceof TestCase) {
                executeTestCase(user, (TestCase) test, testConfig, results);
            } else if (test instanceof TestSuite) {
                executeTestSuite(user, (TestSuite) test, testConfig, results);
            }
        }
        return results;
    }

    /**
     * Execute a test suite.
     *
     * @param user
     *         The user that executes the test suite.
     * @param testSuite
     *         The test suite that is being executed.
     * @param testConfig
     *         The config for the test.
     * @param results
     *         The map with the test results.
     * @return The updated test result map.
     */
    public TestSuiteResult executeTestSuite(User user, TestSuite testSuite, TestExecutionConfig testConfig,
            Map<Long, TestResult> results) {
        final TestSuiteResult tsResult = new TestSuiteResult(testSuite, 0L, 0L);

        final List<Test> testCases = testSuite.getTests().stream()
                .filter(TestCase.class::isInstance)
                .collect(Collectors.toList());

        for (Test test : testCases) {
            final TestCaseResult result = executeTestCase(user, (TestCase) test, testConfig, results);
            tsResult.add(result);
        }

        final List<Test> testSuites = testSuite.getTests().stream()
                .filter(TestSuite.class::isInstance)
                .collect(Collectors.toList());

        for (Test test : testSuites) {
            final TestSuiteResult result = executeTestSuite(user, (TestSuite) test, testConfig, results);
            tsResult.add(result);
        }

        results.put(testSuite.getId(), tsResult);
        return tsResult;
    }

    /**
     * Executes a test case.
     *
     * @param user
     *         The user that executes the test suite.
     * @param testCase
     *         The test case that is being executed.
     * @param testConfig
     *         The config for the test.
     * @param results
     *         The map with the test results.
     * @return The updated test result map.
     */
    public TestCaseResult executeTestCase(User user, TestCase testCase, TestExecutionConfig testConfig,
            Map<Long, TestResult> results) {
        LOGGER.info(LoggerMarkers.LEARNER, "Execute test[id={}] '{}'", testCase.getId(), testCase.getName());

        final ProjectUrl projectUrl = projectUrlRepository.findOne(testConfig.getUrlId());

        final ConnectorContextHandler ctxHandler = contextHandlerFactory.createContext(user, testCase.getProject(),
                Collections.singletonList(projectUrl), testConfig.getDriverConfig());

        final Symbol dummySymbol = new Symbol();
        dummySymbol.setName("dummy");
        dummySymbol.getSteps().add(new SymbolStep() {
            @Override
            public ExecuteResult execute(int i, ConnectorManager connectors) {
                return new ExecuteResult(true);
            }
        });

        ctxHandler.setResetSymbol(new ParameterizedSymbol(dummySymbol));

        final long startTime = System.currentTimeMillis();
        final ConnectorManager connectors = ctxHandler.createContext();

        final List<ExecuteResult> outputs = new ArrayList<>();

        boolean preSuccess = executePreSteps(connectors, testCase, testCase.getPreSteps());

        // execute the steps as long as they do not fail
        int failedStepIndex = 0;

        if (preSuccess) {
            for (int i = 0; i < testCase.getSteps().size(); i++) {
                final TestCaseStep step = testCase.getSteps().get(i);

                ExecuteResult result = executeStep(connectors, testCase, step);
                if (!result.isSuccess() && step.isShouldFail()) {
                    result = new ExecuteResult(true, result.getOutput(), result.getTime());
                }

                outputs.add(result);
                failedStepIndex = i;
                if (!result.isSuccess()) {
                    break;
                }
            }
        } else {
            failedStepIndex = -1;
        }

        // the remaining steps after the failing step are not executed
        while (failedStepIndex + 1 < testCase.getSteps().size()) {
            outputs.add(new ExecuteResult(false, "Not executed"));
            failedStepIndex++;
        }

        executePostSteps(connectors, testCase, testCase.getPostSteps());

        connectors.dispose();
        connectors.post();
        final long time = System.currentTimeMillis() - startTime;

        final List<TestExecutionResult> sulOutputs = outputs.stream()
                .map(TestExecutionResult::new)
                .collect(Collectors.toList());

        final List<String> failureMessageParts = new ArrayList<>();

        boolean passed = true;
        for (int i = 0; i < outputs.size(); i++) {
            final ExecuteResult output = outputs.get(i);
            passed = passed & output.isSuccess();

            final TestCaseStep step = testCase.getSteps().get(i);
            sulOutputs.get(i).setSymbol(step.getPSymbol().getSymbol());

            if (!output.isSuccess()) {
                final String msg = step.getPSymbol().getSymbol().getName() + ": " + output.getOutput();
                failureMessageParts.add(msg);
            }
        }

        final String failureMessage = failureMessageParts.isEmpty() ? "" : String.join(", ", failureMessageParts);

        final TestCaseResult result =
                new TestCaseResult(testCase, sulOutputs, passed, time, String.join(", ", failureMessage));
        results.put(testCase.getId(), result);

        LOGGER.info(LoggerMarkers.LEARNER, "Finished executing test[id={}], passed=" + String.valueOf(passed), testCase.getId());
        return result;
    }

    private boolean executePreSteps(ConnectorManager connectors, TestCase testCase, List<TestCaseStep> preSteps) {
        for (TestCaseStep preStep : preSteps) {
            final ExecuteResult result = executeStep(connectors, testCase, preStep);
            if (!result.isSuccess()) {
                return false;
            }
        }
        return true;
    }

    private void executePostSteps(ConnectorManager connectors, TestCase testCase, List<TestCaseStep> postSteps) {
        for (TestCaseStep postStep : postSteps) {
            executeStep(connectors, testCase, postStep);
        }
    }

    private ExecuteResult executeStep(ConnectorManager connectors, TestCase testCase, TestCaseStep step) {
        final VariableStoreConnector variableStore = connectors.getConnector(VariableStoreConnector.class);
        final CounterStoreConnector counterStore = connectors.getConnector(CounterStoreConnector.class);

        try {
            // here, the values for the parameters of the symbols are set
            step.getPSymbol().getParameterValues().stream()
                    .filter(value -> value.getValue() != null)
                    .forEach(value -> {
                        final String valueWithVariables =
                                SearchHelper.insertVariableValues(connectors, testCase.getProjectId(), value.getValue());

                        if (value.getParameter().getParameterType().equals(SymbolParameter.ParameterType.STRING)) {
                            variableStore.set(value.getParameter().getName(), valueWithVariables);
                        } else {
                            counterStore.set(testCase.getProject().getId(), value.getParameter()
                                    .getName(), Integer.valueOf(valueWithVariables));
                        }
                    });

            return step.execute(connectors);
        } catch (Exception e) {
            return new ExecuteResult(false);
        }
    }
}
