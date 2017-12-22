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

package de.learnlib.alex.testsuites.entities;

import com.fasterxml.jackson.annotation.JsonTypeName;

import javax.persistence.DiscriminatorValue;
import java.util.List;

/**
 * The result of the execution of a test case.
 */
@DiscriminatorValue("case")
@JsonTypeName("case")
public class TestCaseResult extends TestResult {

    /** The outputs of the system. */
    private List<String> outputs;

    /** If the test passed. */
    private boolean passed;

    /** The failure message. */
    private String failureMessage;

    /**
     * Constructor.
     */
    public TestCaseResult() {
    }

    /**
     * Constructor.
     *
     * @param testCase       The test case that has been executed.
     * @param outputs        The recorded outputs.
     * @param passed         If the test passed.
     * @param time           The time it took to execute the test in ms.
     * @param failureMessage The message that is displayed in case the test case failed.
     */
    public TestCaseResult(TestCase testCase, List<String> outputs, boolean passed, long time, String failureMessage) {
        super(testCase);
        this.outputs = outputs;
        this.passed = passed;
        this.passed = testCase.isShouldPass() == passed;
        this.time = time;
        this.failureMessage = failureMessage;
    }

    public List<String> getOutputs() {
        return outputs;
    }

    public void setOutputs(List<String> outputs) {
        this.outputs = outputs;
    }

    public boolean isPassed() {
        return passed;
    }

    public void setPassed(boolean passed) {
        this.passed = passed;
    }

    public String getFailureMessage() {
        return failureMessage;
    }

    public void setFailureMessage(String failureMessage) {
        this.failureMessage = failureMessage;
    }
}
