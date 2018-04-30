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
import de.learnlib.alex.common.utils.SearchHelper;
import de.learnlib.alex.data.entities.ExecuteResult;
import de.learnlib.alex.data.entities.Project;
import de.learnlib.alex.data.entities.ProjectUrl;
import de.learnlib.alex.data.entities.Symbol;
import de.learnlib.alex.data.repositories.ProjectUrlRepository;
import de.learnlib.alex.learning.services.connectors.ConnectorContextHandler;
import de.learnlib.alex.learning.services.connectors.ConnectorContextHandlerFactory;
import de.learnlib.alex.learning.services.connectors.ConnectorManager;
import de.learnlib.alex.learning.services.connectors.VariableStoreConnector;
import de.learnlib.alex.testing.dao.TestDAO;
import de.learnlib.alex.testing.dao.TestReportDAO;
import de.learnlib.alex.testing.entities.Test;
import de.learnlib.alex.testing.entities.TestCase;
import de.learnlib.alex.testing.entities.TestCaseResult;
import de.learnlib.alex.testing.entities.TestCaseStep;
import de.learnlib.alex.testing.entities.TestExecutionResult;
import de.learnlib.alex.testing.entities.TestExecutionConfig;
import de.learnlib.alex.testing.entities.TestReport;
import de.learnlib.alex.testing.entities.TestResult;
import de.learnlib.alex.testing.entities.TestStatus;
import de.learnlib.alex.testing.entities.TestSuite;
import de.learnlib.alex.testing.entities.TestSuiteResult;
import de.learnlib.alex.webhooks.services.WebhookService;
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
     */
    @Inject
    public TestService(ConnectorContextHandlerFactory contextHandlerFactory, WebhookService webhookService,
            TestDAO testDAO, TestReportDAO testReportDAO, ProjectUrlRepository projectUrlRepository) {
        this.contextHandlerFactory = contextHandlerFactory;
        this.webhookService = webhookService;
        this.testDAO = testDAO;
        this.testReportDAO = testReportDAO;
        this.testingThreads = new HashMap<>();
        this.projectUrlRepository = projectUrlRepository;
    }

    /**
     * Check if a test process in active for a project.
     *
     * @param user
     *         The current user.
     * @param projectId
     *         The id of the the project.
     * @return If a test process is active.
     */
    public boolean isActive(User user, Long projectId) {
        return testingThreads.containsKey(user.getId()) && testingThreads.get(user.getId()).containsKey(projectId);
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

        this.testingThreads.putIfAbsent(user.getId(), new HashMap<>());
        this.testingThreads.get(user.getId()).put(project.getId(), thread);

        thread.start();

        final TestStatus status = new TestStatus();
        status.setActive(true);
        return status;
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

        for (Test test: testCases) {
            final TestCaseResult result = executeTestCase(user, (TestCase) test, testConfig, results);
            tsResult.add(result);
        }

        final List<Test> testSuites = testSuite.getTests().stream()
                .filter(TestSuite.class::isInstance)
                .collect(Collectors.toList());

        for (Test test: testSuites) {
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

        final ProjectUrl projectUrl = projectUrlRepository.findOne(testConfig.getUrlId());

        final ConnectorContextHandler ctxHandler = contextHandlerFactory.createContext(user, testCase.getProject(),
                Collections.singletonList(projectUrl), testConfig.getDriverConfig());
        ctxHandler.setResetSymbol(new Symbol());

        final long startTime = System.currentTimeMillis();
        final ConnectorManager connectors = ctxHandler.createContext();
        final VariableStoreConnector variableStore = connectors.getConnector(VariableStoreConnector.class);

        final List<ExecuteResult> outputs = new ArrayList<>();

        // execute the steps as long as they do not fail
        int failedStepIndex = 0;
        for (int i = 0; i < testCase.getSteps().size(); i++) {
            final TestCaseStep step = testCase.getSteps().get(i);

            // here, the values for the parameters of the symbols are set
            step.getParameterValues().stream()
                    .filter(value -> value.getValue() != null)
                    .forEach(value -> {
                        final String valueWithVariables =
                                SearchHelper.insertVariableValues(connectors, testCase.getProjectId(),
                                        value.getValue());
                        variableStore.set(value.getParameter().getName(), valueWithVariables);
                    });

            ExecuteResult result = step.execute(connectors);
            if (!result.isSuccess() && step.isShouldFail()) {
                result = new ExecuteResult(true, result.getOutput());
            }

            outputs.add(result);
            failedStepIndex = i;
            if (!result.isSuccess()) {
                break;
            }
        }

        // the remaining steps after the failing step are not executed
        while (failedStepIndex + 1 < testCase.getSteps().size()) {
            outputs.add(new ExecuteResult(false, "Not executed"));
            failedStepIndex++;
        }

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
            sulOutputs.get(i).setSymbol(step.getSymbol());

            if (!output.isSuccess()) {
                final String msg = step.getSymbol().getName() + ": " + output.getOutput();
                failureMessageParts.add(msg);
            }
        }

        final String failureMessage = failureMessageParts.isEmpty() ? "" : String.join(", ", failureMessageParts);

        final TestCaseResult result =
                new TestCaseResult(testCase, sulOutputs, passed, time, String.join(", ", failureMessage));
        results.put(testCase.getId(), result);

        return result;
    }

}
