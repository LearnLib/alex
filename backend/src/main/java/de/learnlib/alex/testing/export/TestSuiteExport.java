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
package de.learnlib.alex.testing.export;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import de.learnlib.alex.testing.entities.Test;
import de.learnlib.alex.testing.entities.TestCase;
import de.learnlib.alex.testing.entities.TestCaseStep;
import de.learnlib.alex.testing.entities.TestSuite;

/**
 * @author Philip Koch
 * @author frohme
 */
public class TestSuiteExport {

    private final String projectURL;

    private final List<TestCaseExport> testCases;

    private final String name;

    public TestSuiteExport(String projectURL, TestSuite suite, String name) {
        this.name = name;
        this.projectURL = projectURL;
        this.testCases = new ArrayList<>();
        for (Test test : suite.getTests()) {
            TestCase testCase = (TestCase) test;

            final int testCaseSize =
                    testCase.getPreSteps().size() + testCase.getSteps().size() + testCase.getPostSteps().size();
            final List<TestCaseStep> testCaseSteps = new ArrayList<>(testCaseSize);

            testCaseSteps.addAll(testCase.getPreSteps());
            testCaseSteps.addAll(testCase.getSteps());
            testCaseSteps.addAll(testCase.getPostSteps());

            this.testCases.add(new TestCaseExport(testCase.getName(),
                                                  testCaseSteps.stream()
                                                               .map(TestCaseStep::getPSymbol)
                                                               .collect(Collectors.toList()),
                                                  testCaseSteps.stream()
                                                               .map(TestCaseStep::getExpectedResult)
                                                               .collect(Collectors.toList())));
        }

    }

    public String getName() {
        return name;
    }

    public String getProjectURL() {
        return projectURL;
    }

    public List<TestCaseExport> getTestCases() {
        return testCases;
    }
}
