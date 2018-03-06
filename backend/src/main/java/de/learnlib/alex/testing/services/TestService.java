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
import de.learnlib.alex.data.entities.Symbol;
import de.learnlib.alex.learning.entities.webdrivers.AbstractWebDriverConfig;
import de.learnlib.alex.learning.services.connectors.ConnectorContextHandler;
import de.learnlib.alex.learning.services.connectors.ConnectorContextHandlerFactory;
import de.learnlib.alex.learning.services.connectors.ConnectorManager;
import de.learnlib.alex.learning.services.connectors.VariableStoreConnector;
import de.learnlib.alex.testing.entities.Test;
import de.learnlib.alex.testing.entities.TestCase;
import de.learnlib.alex.testing.entities.TestCaseActionStep;
import de.learnlib.alex.testing.entities.TestCaseResult;
import de.learnlib.alex.testing.entities.TestCaseStep;
import de.learnlib.alex.testing.entities.TestCaseSymbolStep;
import de.learnlib.alex.testing.entities.TestResult;
import de.learnlib.alex.testing.entities.TestSuite;
import de.learnlib.alex.testing.entities.TestSuiteResult;
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
    private ConnectorContextHandlerFactory contextHandlerFactory;

    /**
     * Constructor.
     *
     * @param contextHandlerFactory The injected {@link ConnectorContextHandlerFactory}
     */
    @Inject
    public TestService(ConnectorContextHandlerFactory contextHandlerFactory) {
        this.contextHandlerFactory = contextHandlerFactory;
    }

    /**
     * Executes multiple tests.
     *
     * @param user         The user that executes the test suite.
     * @param tests        The tests that should be executed.
     * @param driverConfig The config for the web driver.
     * @return
     */
    public Map<Long, TestResult> executeTests(User user, List<Test> tests, AbstractWebDriverConfig driverConfig) {
        final Map<Long, TestResult> results = new HashMap<>();
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

        // set variables from the test case
        final VariableStoreConnector variableStore = connectors.getConnector(VariableStoreConnector.class);
        testCase.getVariables().forEach(variableStore::set);

        // execute the test case
        final List<ExecuteResult> outputs = testCase.getSteps().stream()
                .map(s -> s.execute(connectors))
                .collect(Collectors.toList());

        connectors.dispose();
        final long time = System.currentTimeMillis() - startTime;

        final List<String> sulOutputs = outputs.stream().map(ExecuteResult::getOutput).collect(Collectors.toList());

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

        final TestCaseResult result = new TestCaseResult(testCase, sulOutputs, passed, time, String.join(", ", failureMessage));
        results.put(testCase.getId(), result);

        return result;
    }

}
