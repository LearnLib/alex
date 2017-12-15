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

/**
 * The result of a test execution.
 */
public abstract class TestResult {

    /** The test that has been executed. */
    private Test.TestRepresentation test;

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
}
