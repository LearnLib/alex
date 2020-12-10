/*
 * Copyright 2015 - 2020 TU Dortmund
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

import java.util.HashMap;
import java.util.Map;

public class TestQueueItem {

    private TestReport report;
    private TestExecutionConfig config;
    private Map<Long, TestResult> results;

    public TestQueueItem() {
        this.results = new HashMap<>();
    }

    public TestQueueItem(TestReport report, TestExecutionConfig config) {
        this();
        this.report = report;
        this.config = config;
    }

    public TestReport getReport() {
        return report;
    }

    public void setReport(TestReport report) {
        this.report = report;
    }

    public TestExecutionConfig getConfig() {
        return config;
    }

    public void setConfig(TestExecutionConfig config) {
        this.config = config;
    }

    public Map<Long, TestResult> getResults() {
        return results;
    }

    public void setResults(Map<Long, TestResult> results) {
        this.results = results;
    }
}
