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

package de.learnlib.alex.testing.entities;

import com.fasterxml.jackson.annotation.JsonTypeName;

import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;
import javax.persistence.Transient;

/**
 * The result of the execution of a test suite.
 */
@Entity
@DiscriminatorValue("suite")
@JsonTypeName("suite")
public class TestSuiteResult extends TestResult {

    private static final long serialVersionUID = 6838201007001578578L;

    /** How many test cases passed. */
    private long testCasesPassed;

    /** How many test cases failed. */
    private long testCasesFailed;

    /**
     * Constructor.
     */
    public TestSuiteResult() {
    }

    /**
     * Constructor.
     *
     * @param testSuite
     *         The test suite that has been executed.
     * @param testCasesPassed
     *         The number of test cases that passed.
     * @param testCasesFailed
     *         The number of test cases that failed.
     */
    public TestSuiteResult(TestSuite testSuite, long testCasesPassed, long testCasesFailed) {
        super(testSuite);
        this.testCasesPassed = testCasesPassed;
        this.testCasesFailed = testCasesFailed;
    }

    /**
     * Adds result from children test cases.
     *
     * @param result
     *         The test case in this suite.
     */
    public void add(TestCaseResult result) {
        testCasesPassed += result.isPassed() ? 1 : 0;
        testCasesFailed += !result.isPassed() ? 1 : 0;
        time += result.getTime();
    }

    /**
     * Adds result from children test suites.
     *
     * @param result
     *         The test suite in this suite.
     */
    public void add(TestSuiteResult result) {
        testCasesPassed += result.getTestCasesPassed();
        testCasesFailed += result.getTestCasesFailed();
        time += result.getTime();
    }

    /**
     * Calculate the number of test cases that run.
     *
     * @return The number of test cases.
     */
    @Transient
    public long getTestCasesRun() {
        return testCasesPassed + testCasesFailed;
    }

    public void setTestCasesRun(long num) {
    }

    public long getTestCasesPassed() {
        return testCasesPassed;
    }

    public void setTestCasesPassed(long testCasesPassed) {
        this.testCasesPassed = testCasesPassed;
    }

    public void addTestCasesPassed(long amount) {
        this.testCasesPassed += amount;
    }

    public long getTestCasesFailed() {
        return testCasesFailed;
    }

    public void setTestCasesFailed(long testCasesFailed) {
        this.testCasesFailed = testCasesFailed;
    }

    public void addTestCasesFailed(long amount) {
        this.testCasesFailed += amount;
    }

    /**
     * Check if the test suite passed.
     *
     * @return True if all test cases and nested test suites passed.
     */
    @Transient
    @Override
    public boolean isPassed() {
        return testCasesFailed == 0;
    }
}
