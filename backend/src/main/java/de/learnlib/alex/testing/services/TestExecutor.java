/*
 * Copyright 2015 - 2021 TU Dortmund
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
import de.learnlib.alex.data.dao.ProjectEnvironmentDAO;
import de.learnlib.alex.data.entities.ExecuteResult;
import de.learnlib.alex.data.entities.ParameterizedSymbol;
import de.learnlib.alex.data.entities.Project;
import de.learnlib.alex.data.entities.ProjectEnvironment;
import de.learnlib.alex.data.entities.Symbol;
import de.learnlib.alex.data.entities.SymbolStep;
import de.learnlib.alex.learning.services.connectors.ConnectorContextHandler;
import de.learnlib.alex.learning.services.connectors.ConnectorManager;
import de.learnlib.alex.learning.services.connectors.PreparedConnectorContextHandlerFactory;
import de.learnlib.alex.learning.services.connectors.WebSiteConnector;
import de.learnlib.alex.testing.entities.Test;
import de.learnlib.alex.testing.entities.TestCase;
import de.learnlib.alex.testing.entities.TestCaseResult;
import de.learnlib.alex.testing.entities.TestCaseStep;
import de.learnlib.alex.testing.entities.TestExecutionConfig;
import de.learnlib.alex.testing.entities.TestExecutionResult;
import de.learnlib.alex.testing.entities.TestResult;
import de.learnlib.alex.testing.entities.TestScreenshot;
import de.learnlib.alex.testing.entities.TestSuite;
import de.learnlib.alex.testing.entities.TestSuiteResult;
import java.io.File;
import java.io.IOException;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Service;
import org.springframework.util.FileCopyUtils;

@Service
@Scope("prototype")
public class TestExecutor {

    private static final Logger logger = LoggerFactory.getLogger(TestExecutor.class);

    @Value("${alex.filesRootDir}")
    private String filesRootDir;
    private final ProjectEnvironmentDAO projectEnvironmentDAO;
    private final PreparedConnectorContextHandlerFactory contextHandlerFactory;

    private Test currentTest;
    private boolean aborted;

    @Autowired
    public TestExecutor(
            PreparedConnectorContextHandlerFactory contextHandlerFactory,
            ProjectEnvironmentDAO projectEnvironmentDAO
    ) {
        this.contextHandlerFactory = contextHandlerFactory;
        this.projectEnvironmentDAO = projectEnvironmentDAO;

        this.aborted = false;
    }

    public void executeTests(User user, List<Test> tests, TestExecutionConfig testConfig, Map<Long, TestResult> results) {
        for (Test test : tests) {
            currentTest = test;
            if (aborted) {
                break;
            }

            if (test instanceof TestCase) {
                executeTestCase(user, (TestCase) test, testConfig, results);
            } else if (test instanceof TestSuite) {
                executeTestSuite(user, (TestSuite) test, testConfig, results);
            }
        }
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
            if (aborted) {
                return tsResult;
            }
            final TestCaseResult result = executeTestCase(user, (TestCase) test, testConfig, results);
            tsResult.add(result);
        }

        final List<Test> testSuites = testSuite.getTests().stream()
                .filter(TestSuite.class::isInstance)
                .collect(Collectors.toList());

        for (Test test : testSuites) {
            if (aborted) {
                return tsResult;
            }
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
        logger.info(LoggerMarkers.LEARNER, "Execute test[id={}] '{}'", testCase.getId(), testCase.getName());

        final Symbol dummySymbol = new Symbol();
        dummySymbol.setName("dummy");
        dummySymbol.getSteps().add(new SymbolStep() {
            @Override
            public ExecuteResult execute(int i, ConnectorManager connectors) {
                return new ExecuteResult(true);
            }
        });
        final ParameterizedSymbol dummyPSymbol = new ParameterizedSymbol(dummySymbol);

        final ProjectEnvironment env = projectEnvironmentDAO.getByID(user, testConfig.getEnvironmentId());

        final ConnectorContextHandler ctxHandler = contextHandlerFactory
                .createPreparedContextHandler(user, testCase.getProject(), testConfig.getDriverConfig(), dummyPSymbol, null)
                .create(env);

        final long startTime = System.currentTimeMillis();
        final ConnectorManager connectors = ctxHandler.createContext();

        final List<ExecuteResult> outputs = new ArrayList<>();

        boolean preSuccess = executePreSteps(connectors, testCase.getPreSteps());

        // execute the steps as long as they do not fail
        long failedStep = -1L;

        TestScreenshot beforeScreenshot = null;

        if (preSuccess) {

            beforeScreenshot = takeAndStoreScreenshot(testCase.getProject(), connectors.getConnector(WebSiteConnector.class), "pre");

            for (int i = 0; i < testCase.getSteps().size(); i++) {
                if (aborted) {
                    break;
                }

                final TestCaseStep step = testCase.getSteps().get(i);
                if (step.isDisabled()) {
                    outputs.add(new ExecuteResult(true, "Skipped"));
                    continue;
                }

                final ExecuteResult result = executeStep(connectors, step);
                outputs.add(result);

                final TestScreenshot stepScreenshot = takeAndStoreScreenshot(
                        testCase.getProject(),
                        connectors.getConnector(WebSiteConnector.class),
                        step.getId().toString()
                );
                result.setTestScreenshot(stepScreenshot);

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

        executePostSteps(connectors, testCase.getPostSteps());

        connectors.dispose();
        connectors.post();
        final long time = System.currentTimeMillis() - startTime;

        final List<TestExecutionResult> sulOutputs = outputs.stream()
                .map(TestExecutionResult::new)
                .collect(Collectors.toList());

        for (int i = 0; i < outputs.size(); i++) {
            final TestCaseStep step = testCase.getSteps().get(i);
            sulOutputs.get(i).setSymbol(step.getPSymbol().getSymbol());
            sulOutputs.get(i).setTestScreenshot(outputs.get(i).getTestScreenshot());
        }

        final TestCaseResult result = new TestCaseResult(testCase, sulOutputs, failedStep, time);
        result.setBeforeScreenshot(beforeScreenshot);
        results.put(testCase.getId(), result);

        logger.info(LoggerMarkers.LEARNER, "Finished executing test[id={}], passed=" + result.isPassed(), testCase.getId());
        return result;
    }

    private TestScreenshot takeAndStoreScreenshot(Project project, WebSiteConnector webSiteConnector, String fileNameSuffix) {

        String directoryPath = filesRootDir + "/test_screenshots/" + project.getId().toString();

        // check files structure
        File testScreenshotBaseDirectory = Paths.get(directoryPath).toFile();
        if (!testScreenshotBaseDirectory.exists()) {
            testScreenshotBaseDirectory.mkdirs();
        }

        final File screenshot = webSiteConnector.takeScreenshot();
        TestScreenshot testScreenshot = null;
        if (screenshot != null) {
            String filename = System.currentTimeMillis() + "_" + fileNameSuffix;
            try {
                FileCopyUtils.copy(screenshot, new File(directoryPath + "/" + filename + ".png"));
            } catch (IOException e) {
                e.printStackTrace();
                return null;
            }

            testScreenshot = new TestScreenshot();
            testScreenshot.setFilename(filename);
        }

        return testScreenshot;
    }

    private boolean executePreSteps(ConnectorManager connectors, List<TestCaseStep> preSteps) {
        for (TestCaseStep preStep : preSteps) {
            final ExecuteResult result = executeStep(connectors, preStep);
            if (!result.isSuccess()) {
                return false;
            }
        }
        return true;
    }

    private void executePostSteps(ConnectorManager connectors, List<TestCaseStep> postSteps) {
        for (TestCaseStep postStep : postSteps) {
            executeStep(connectors, postStep);
        }
    }

    private ExecuteResult executeStep(ConnectorManager connectors, TestCaseStep step) {
        try {
            return step.execute(connectors);
        } catch (Exception e) {
            return new ExecuteResult(false);
        }
    }

    public Test getCurrentTest() {
        return currentTest;
    }

    public void abort() {
        this.aborted = true;
    }
}
