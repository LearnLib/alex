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

package de.learnlib.alex.testing.entities;

import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;

/**
 * The result of a test execution.
 */
@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, include = JsonTypeInfo.As.PROPERTY, property = "type")
@JsonSubTypes({
        @JsonSubTypes.Type(name = "case", value = TestCaseResult.class),
        @JsonSubTypes.Type(name = "suite", value = TestSuiteResult.class),
})
public abstract class TestResult {

    /** The test that has been executed. */
    private Test.TestRepresentation test;

    /** The time it took to execute the test in ms. */
    protected long time;

    /**
     * Constructor.
     */
    public TestResult() {
    }

    /**
     * Constructor.
     *
     * @param test The test that has been executed.
     */
    public TestResult(Test test) {
        this.test = new Test.TestRepresentation(test);
    }

    public Test.TestRepresentation getTest() {
        return test;
    }

    public void setTest(Test.TestRepresentation test) {
        this.test = test;
    }

    public long getTime() {
        return time;
    }

    public void setTime(long time) {
        this.time = time;
    }
}
