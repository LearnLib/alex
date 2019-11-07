package de.learnlib.alex.testing.entities;

import java.util.HashMap;
import java.util.Map;

public class TestQueueItem {
    private TestReport report;
    private TestExecutionConfig config;
    private Map<Long, TestResult> results;

    public TestQueueItem(TestReport report,
                         TestExecutionConfig config) {
        this.report = report;
        this.config = config;
        this.results = new HashMap<>();
    }

    public TestReport getReport() {
        return report;
    }

    public TestExecutionConfig getConfig() {
        return config;
    }

    public Map<Long, TestResult> getResults() {
        return results;
    }
}
