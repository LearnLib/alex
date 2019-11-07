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

package de.learnlib.alex.testing.entities;

import java.util.ArrayList;
import java.util.List;

/**
 * The class that contains the current status of a test process.
 */
public class TestStatus {

    private List<TestQueueItem> testRunQueue;

    private TestQueueItem currentTestRun;

    /** The test(suite) that is currently being executed. */
    private Test currentTest;

    /** Constructor. */
    public TestStatus() {
        testRunQueue = new ArrayList<>();
    }

    public TestQueueItem getCurrentTestRun() {
        return currentTestRun;
    }

    public void setCurrentTestRun(TestQueueItem currentTestRun) {
        this.currentTestRun = currentTestRun;
    }

    public List<TestQueueItem> getTestRunQueue() {
        return testRunQueue;
    }

    public void setTestRunQueue(List<TestQueueItem> testRunQueue) {
        this.testRunQueue = testRunQueue;
    }

    public boolean isActive() {
        return !(testRunQueue.isEmpty() && currentTestRun == null && currentTest == null);
    }

    public Test getCurrentTest() {
        return currentTest;
    }

    public void setCurrentTest(Test currentTest) {
        this.currentTest = currentTest;
    }
}
