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
import de.learnlib.alex.data.entities.ExecuteResult;
import de.learnlib.alex.data.entities.Project;
import de.learnlib.alex.data.entities.Symbol;
import de.learnlib.alex.learning.entities.webdrivers.AbstractWebDriverConfig;
import de.learnlib.alex.learning.services.connectors.ConnectorContextHandler;
import de.learnlib.alex.learning.services.connectors.ConnectorContextHandlerFactory;
import de.learnlib.alex.learning.services.connectors.ConnectorManager;
import de.learnlib.alex.testing.dao.TestDAO;
import de.learnlib.alex.testing.dao.TestReportDAO;
import de.learnlib.alex.testing.entities.Test;
import de.learnlib.alex.testing.entities.TestCase;
import de.learnlib.alex.testing.entities.TestCaseActionStep;
import de.learnlib.alex.testing.entities.TestCaseResult;
import de.learnlib.alex.testing.entities.TestCaseStep;
import de.learnlib.alex.testing.entities.TestCaseSymbolStep;
import de.learnlib.alex.testing.entities.TestExecuteResult;
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
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * The service that executes tests.
 */
@Service
public class TestService {

    /** Factory to create a new ContextHandler. */
    private final ConnectorContextHandlerFactory contextHandlerFactory;

    /**
     * The running testing threads.
     * userId -> (projectId -> TestThread).
     */
    private final Map<Long, Map<Long, TestThread>> testingThreads;

    /** The {@link WebhookService} to use. */
    private final WebhookService webhookService;

    /** The {@link TestDAO} to use. */
    private final TestDAO testDAO;

    /** The {@link TestReportDAO} to use. */
    private final TestReportDAO testReportDAO;

    /**
     * Constructor.
     *
     * @param contextHandlerFactory The injected {@link ConnectorContextHandlerFactory}
     */
    @Inject
    public TestService(ConnectorContextHandlerFactory contextHandlerFactory, WebhookService webhookService,
                       TestDAO testDAO, TestReportDAO testReportDAO) {
        this.contextHandlerFactory = contextHandlerFactory;
        this.webhookService = webhookService;
        this.testDAO = testDAO;
        this.testReportDAO = testReportDAO;
        this.testingThreads = new HashMap<>();
    }

    /**
     * Check if a test process in active for a project.
     *
     * @param user      The current user.
     * @param projectId The id of the the project.
     * @return If a test process is active.
     */
    public boolean isActive(User user, Long projectId) {
        return testingThreads.containsKey(user.getId()) && testingThreads.get(user.getId()).containsKey(projectId);
    }

    /**
     * Starts a new test thread.
     *
     * @param user    The user.
     * @param project The project.
     * @param config  The config for the tests.
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
     * @param user    The user.
     * @param project The project.
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
     * @param user         The user that executes the test suite.
     * @param tests        The tests that should be executed.
     * @param driverConfig The config for the web driver.
     * @return
     */
    public Map<Long, TestResult> executeTests(User user, List<Test> tests, AbstractWebDriverConfig driverConfig, Map<Long, TestResult> results) {
        for (Test test : tests) {
            if (test instanceof TestCase) {
                executeTestCase(user, (TestCase) test, driverConfig, results);
            } else if (test instanceof TestSuite) {
                executeTestSuite(user, (TestSuite) test, driverConfig, results);
            }
        }
        return results;
    }

    /**
     * Execute a test suite.
     *
     * @param user         The user that executes the test suite.
     * @param testSuite    The test suite that is being executed.
     * @param driverConfig The config for the web driver.
     * @return
     */
    public TestSuiteResult executeTestSuite(User user, TestSuite testSuite, AbstractWebDriverConfig driverConfig, Map<Long, TestResult> results) {
        TestSuiteResult tsResult = new TestSuiteResult(testSuite, 0L, 0L);

        for (Test test : testSuite.getTests()) {
            if (test instanceof TestCase) {
                TestCaseResult result = executeTestCase(user, (TestCase) test, driverConfig, results);
                tsResult.add(result);
            } else {
                TestSuiteResult r = executeTestSuite(user, (TestSuite) test, driverConfig, results);
                tsResult.add(r);
            }
        }

        results.put(testSuite.getId(), tsResult);
        return tsResult;
    }

    /**
     * Executes a test case.
     *
     * @param user         The user that executes the test suite.
     * @param testCase     The test case that is being executed.
     * @param driverConfig The config for the web driver.
     * @return
     */
    public TestCaseResult executeTestCase(User user, TestCase testCase, AbstractWebDriverConfig driverConfig, Map<Long, TestResult> results) {
        final ConnectorContextHandler ctxHandler = contextHandlerFactory.createContext(user, testCase.getProject(),
                driverConfig);
        ctxHandler.setResetSymbol(new Symbol());

        final long startTime = System.currentTimeMillis();
        final ConnectorManager connectors = ctxHandler.createContext();

        final List<ExecuteResult> outputs = new ArrayList<>();

        // execute the steps as long as they do not fail
        int failedStepIndex = 0;
        for (int i = 0; i < testCase.getSteps().size(); i++) {
            final TestCaseStep step = testCase.getSteps().get(i);
            final ExecuteResult result = step.execute(connectors);
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

        final List<String> failureMessageParts = new ArrayList<>();

        boolean passed = true;
        for (int i = 0; i < outputs.size(); i++) {
            final ExecuteResult output = outputs.get(i);
            passed = passed & output.isSuccess();
            if (!output.isSuccess()) {
                final TestCaseStep step = testCase.getSteps().get(i);
                if (step instanceof TestCaseSymbolStep) {
                    failureMessageParts.add(((TestCaseSymbolStep) step).getSymbol().getName() + ": " + output.getOutput());
                } else if (step instanceof TestCaseActionStep) {
                    failureMessageParts.add(output.getOutput());
                }
            }
        }

        final String failureMessage = failureMessageParts.isEmpty() ? "" : String.join(", ", failureMessageParts);

        final List<TestExecuteResult> sulOutputs = outputs.stream()
                .map(TestExecuteResult::new)
                .collect(Collectors.toList());

        final TestCaseResult result = new TestCaseResult(testCase, sulOutputs, passed, time, String.join(", ", failureMessage));
        results.put(testCase.getId(), result);

        return result;
    }

}
