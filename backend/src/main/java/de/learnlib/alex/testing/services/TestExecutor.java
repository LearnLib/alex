/*
 * Copyright 2015 - 2019 TU Dortmund
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
import de.learnlib.alex.common.utils.LoggerMarkers;
import de.learnlib.alex.common.utils.SearchHelper;
import de.learnlib.alex.data.entities.ExecuteResult;
import de.learnlib.alex.data.entities.ParameterizedSymbol;
import de.learnlib.alex.data.entities.ProjectUrl;
import de.learnlib.alex.data.entities.Symbol;
import de.learnlib.alex.data.entities.SymbolParameter;
import de.learnlib.alex.data.entities.SymbolStep;
import de.learnlib.alex.data.repositories.ProjectUrlRepository;
import de.learnlib.alex.learning.services.connectors.ConnectorContextHandler;
import de.learnlib.alex.learning.services.connectors.ConnectorManager;
import de.learnlib.alex.learning.services.connectors.CounterStoreConnector;
import de.learnlib.alex.learning.services.connectors.PreparedConnectorContextHandlerFactory;
import de.learnlib.alex.learning.services.connectors.VariableStoreConnector;
import de.learnlib.alex.testing.entities.Test;
import de.learnlib.alex.testing.entities.TestCase;
import de.learnlib.alex.testing.entities.TestCaseResult;
import de.learnlib.alex.testing.entities.TestCaseStep;
import de.learnlib.alex.testing.entities.TestExecutionConfig;
import de.learnlib.alex.testing.entities.TestExecutionResult;
import de.learnlib.alex.testing.entities.TestResult;
import de.learnlib.alex.testing.entities.TestSuite;
import de.learnlib.alex.testing.entities.TestSuiteResult;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class TestExecutor {

    private static final Logger LOGGER = LogManager.getLogger();

    private final PreparedConnectorContextHandlerFactory contextHandlerFactory;
    private final ProjectUrlRepository projectUrlRepository;

    private Test currentTest;

    public TestExecutor(PreparedConnectorContextHandlerFactory contextHandlerFactory,
                        ProjectUrlRepository projectUrlRepository) {
        this.contextHandlerFactory = contextHandlerFactory;
        this.projectUrlRepository = projectUrlRepository;
    }

    public Map<Long, TestResult> executeTests(User user, List<Test> tests, TestExecutionConfig testConfig, Map<Long, TestResult> results) {
        for (Test test : tests) {
            currentTest = test;

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

        final Symbol dummySymbol = new Symbol();
        dummySymbol.setName("dummy");
        dummySymbol.getSteps().add(new SymbolStep() {
            @Override
            public ExecuteResult execute(int i, ConnectorManager connectors) {
                return new ExecuteResult(true);
            }
        });
        final ParameterizedSymbol dummyPSymbol = new ParameterizedSymbol(dummySymbol);

        final ProjectUrl projectUrl = projectUrlRepository.findById(testConfig.getUrlId()).orElse(null);

        final ConnectorContextHandler ctxHandler = contextHandlerFactory
                .createPreparedContextHandler(user, testCase.getProject(), testConfig.getDriverConfig(), dummyPSymbol, null)
                .create(projectUrl.getUrl());

        final long startTime = System.currentTimeMillis();
        final ConnectorManager connectors = ctxHandler.createContext();

        final List<ExecuteResult> outputs = new ArrayList<>();

        boolean preSuccess = executePreSteps(connectors, testCase, testCase.getPreSteps());

        // execute the steps as long as they do not fail
        long failedStep = -1L;

        if (preSuccess) {
            for (int i = 0; i < testCase.getSteps().size(); i++) {
                final TestCaseStep step = testCase.getSteps().get(i);
                final ExecuteResult result = executeStep(connectors, testCase, step);
                outputs.add(result);

                if (step.getExpectedOutputMessage().equals("")) {
                    if (result.isSuccess() != step.isExpectedOutputSuccess()) {
                        failedStep = i;
                        break;
                    }
                } else {
                    if (!result.getOutput().equals(step.getComputedOutput())) {
                        failedStep = i;
                        break;
                    }
                }
            }
        } else {
            failedStep = -2L;
        }

        // the remaining steps after the failing step are not executed
        while (outputs.size() < testCase.getSteps().size()) {
            outputs.add(new ExecuteResult(false, "Not executed"));
        }

        executePostSteps(connectors, testCase, testCase.getPostSteps());

        connectors.dispose();
        connectors.post();
        final long time = System.currentTimeMillis() - startTime;

        final List<TestExecutionResult> sulOutputs = outputs.stream()
                .map(TestExecutionResult::new)
                .collect(Collectors.toList());

        for (int i = 0; i < outputs.size(); i++) {
            final TestCaseStep step = testCase.getSteps().get(i);
            sulOutputs.get(i).setSymbol(step.getPSymbol().getSymbol());
        }

        final TestCaseResult result = new TestCaseResult(testCase, sulOutputs, failedStep, time);
        results.put(testCase.getId(), result);

        LOGGER.info(LoggerMarkers.LEARNER, "Finished executing test[id={}], passed=" + result.isPassed(), testCase.getId());
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

    public Test getCurrentTest() {
        return currentTest;
    }


}
