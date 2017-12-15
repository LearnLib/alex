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

package de.learnlib.alex.testsuites.services;

import de.learnlib.alex.auth.entities.User;
import de.learnlib.alex.config.entities.BrowserConfig;
import de.learnlib.alex.data.entities.ExecuteResult;
import de.learnlib.alex.data.entities.Symbol;
import de.learnlib.alex.learning.services.connectors.ConnectorContextHandler;
import de.learnlib.alex.learning.services.connectors.ConnectorContextHandlerFactory;
import de.learnlib.alex.learning.services.connectors.ConnectorManager;
import de.learnlib.alex.learning.services.connectors.VariableStoreConnector;
import de.learnlib.alex.testsuites.entities.Test;
import de.learnlib.alex.testsuites.entities.TestCase;
import de.learnlib.alex.testsuites.entities.TestCaseResult;
import de.learnlib.alex.testsuites.entities.TestSuite;
import de.learnlib.alex.testsuites.entities.TestSuiteResult;
import org.springframework.stereotype.Service;

import javax.inject.Inject;
import java.util.ArrayList;
import java.util.List;
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
     * Execute a test suite.
     *
     * @param user          The user that executes the test suite.
     * @param testSuite     The test suite that is being executed.
     * @param browserConfig The config for the web driver.
     * @return
     */
    public TestSuiteResult executeTestSuite(User user, TestSuite testSuite, BrowserConfig browserConfig) {
        TestSuiteResult tsResult = new TestSuiteResult(testSuite, 0L, 0L);

        for (Test test : testSuite.getTests()) {
            if (test instanceof TestCase) {
                TestCaseResult result = executeTestCase(user, (TestCase) test, browserConfig);
                tsResult.add(result);
                tsResult.getResults().put(test.getId(), result);
            } else {
                TestSuiteResult r = executeTestSuite(user, (TestSuite) test, browserConfig);
                tsResult.add(r);
                tsResult.getResults().put(test.getId(), r);
            }
        }

        return tsResult;
    }

    /**
     * Executes a test case.
     *
     * @param user          The user that executes the test suite.
     * @param testCase      The test case that is being executed.
     * @param browserConfig The config for the web driver.
     * @return
     */
    public TestCaseResult executeTestCase(User user, TestCase testCase, BrowserConfig browserConfig) {
        final ConnectorContextHandler ctxHandler = contextHandlerFactory.createContext(user, testCase.getProject(),
                                                                                       browserConfig);
        ctxHandler.setResetSymbol(new Symbol());

        final long startTime = System.currentTimeMillis();
        final ConnectorManager connectors = ctxHandler.createContext();

        // set variables from the test case
        final VariableStoreConnector variableStore = connectors.getConnector(VariableStoreConnector.class);
        testCase.getVariables().forEach(variableStore::set);

        // execute the test case
        final List<ExecuteResult> outputs = testCase.getSymbols().stream()
                .map(s -> s.execute(connectors))
                .collect(Collectors.toList());

        connectors.dispose();
        final long time = System.currentTimeMillis() - startTime;

        final List<String> sulOutputs = outputs.stream().map(ExecuteResult::getOutput).collect(Collectors.toList());

        final List<Symbol> failedSymbols = new ArrayList<>();
        final List<String> failureMessageParts = new ArrayList<>();

        for (int i = 0; i < outputs.size(); i++) {
            final ExecuteResult output = outputs.get(i);
            if (!output.isSuccessful()) {
                final Symbol symbol = testCase.getSymbols().get(i);
                failedSymbols.add(symbol);
                failureMessageParts.add(symbol.getName() + ":" + output.getOutput());
            }
        }

        final String failureMessage = failureMessageParts.isEmpty() ? null : String.join(", ", failureMessageParts);

        return new TestCaseResult(testCase, sulOutputs, failedSymbols.size() == 0, time, String.join(", ", failureMessage));
    }

}
