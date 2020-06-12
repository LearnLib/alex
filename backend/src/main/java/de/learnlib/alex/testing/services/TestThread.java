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

package de.learnlib.alex.testing.services;

import de.learnlib.alex.auth.entities.User;
import de.learnlib.alex.common.utils.LoggerMarkers;
import de.learnlib.alex.data.entities.Project;
import de.learnlib.alex.testing.dao.TestDAO;
import de.learnlib.alex.testing.dao.TestReportDAO;
import de.learnlib.alex.testing.entities.Test;
import de.learnlib.alex.testing.entities.TestExecutionConfig;
import de.learnlib.alex.testing.entities.TestQueueItem;
import de.learnlib.alex.testing.entities.TestReport;
import de.learnlib.alex.testing.entities.TestResult;
import de.learnlib.alex.testing.events.TestEvent;
import de.learnlib.alex.testing.events.TestExecutionStartedEventData;
import de.learnlib.alex.webhooks.services.WebhookService;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.apache.logging.log4j.ThreadContext;

import java.util.ArrayList;
import java.util.Deque;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentLinkedDeque;

/**
 * The thread that executes tests. There should ever only be one test per project.
 */
public class TestThread extends Thread {

    private static final Logger LOGGER = LogManager.getLogger();

    /** Listener for when the test process finished. */
    public interface FinishedListener {

        /** What to do when the test process finished. */
        void handleFinished();
    }

    /** The user that executes the tests. */
    private final User user;

    /** The project that is used. */
    private final Project project;

    /** The {@link WebhookService} to use. */
    private final WebhookService webhookService;

    /** The {@link TestDAO} to use. */
    private final TestDAO testDAO;

    /** The {@link TestReportDAO} to use. */
    private final TestReportDAO testReportDAO;

    private final TestExecutor testExecutor;

    /** The finished listener. */
    private final FinishedListener finishedListener;

    /** The queue of tests to execute. */
    private final Deque<TestQueueItem> testQueue = new ConcurrentLinkedDeque<>();

    private TestQueueItem currentTest;

    /**
     * Constructor.
     *
     * @param user
     *         {@link #user}.
     * @param project
     *         {@link #project}..
     * @param webhookService
     *         {@link #webhookService}.
     * @param testDAO
     *         {@link #testDAO}.
     * @param testReportDAO
     *         {@link #testReportDAO}.
     * @param finishedListener
     *         {@link #finishedListener}.
     */
    public TestThread(User user, Project project, WebhookService webhookService,
                      TestDAO testDAO, TestReportDAO testReportDAO, TestExecutor testExecutor,
                      FinishedListener finishedListener) {
        this.user = user;
        this.project = project;
        this.webhookService = webhookService;
        this.testDAO = testDAO;
        this.testReportDAO = testReportDAO;
        this.finishedListener = finishedListener;
        this.testExecutor = testExecutor;
    }

    @Override
    public void run() {
        ThreadContext.put("userId", String.valueOf(user.getId()));

        while (!testQueue.isEmpty()) {
            currentTest = testQueue.poll();
            if (currentTest.getReport().getStatus().equals(TestReport.Status.ABORTED)) {
                testReportDAO.update(user, project.getId(), currentTest.getReport().getId(), currentTest.getReport());
                continue;
            }

            final TestExecutionConfig config = currentTest.getConfig();
            final Map<Long, TestResult> results = currentTest.getResults();
            TestReport report = currentTest.getReport();

            try {
                final List<Test> tests = testDAO.get(user, project.getId(), config.getTestIds());

                report.setStatus(TestReport.Status.IN_PROGRESS);
                report = testReportDAO.update(user, project.getId(), report.getId(), report);

                LOGGER.info(LoggerMarkers.LEARNER, "Start executing tests: {}", config.getTestIds());

                // do not fire the event if the test is only called for testing purposes.
                final TestExecutionStartedEventData data = new TestExecutionStartedEventData(project.getId(), config);
                webhookService.fireEvent(user, new TestEvent.ExecutionStarted(data));

                testExecutor.executeTests(user, tests, config, results);
                report.setTestResults(new ArrayList<>(results.values()));

                if (!report.getStatus().equals(TestReport.Status.ABORTED)) {
                    report.setStatus(TestReport.Status.FINISHED);
                }

                report = testReportDAO.update(user, project.getId(), report.getId(), report);
                webhookService.fireEvent(user, new TestEvent.ExecutionFinished(report));

                LOGGER.info(LoggerMarkers.LEARNER, "Successfully executed tests");
            } catch (Exception e) {
                report.setStatus(TestReport.Status.ABORTED);
                testReportDAO.update(user, project.getId(), report.getId(), report);

                LOGGER.info(LoggerMarkers.LEARNER, "Could not execute all tests", e);
                e.printStackTrace();
            }
        }

        finishedListener.handleFinished();
        testQueue.clear();
        this.currentTest = null;

        LOGGER.info(LoggerMarkers.LEARNER, "Finished testing");
        ThreadContext.remove("userId");
    }

    public void abort(Long reportId) {
        if (currentTest == null && this.testQueue.isEmpty()) {
            return;
        }

        if (currentTest.getReport().getId().equals(reportId)) {
            currentTest.getReport().setStatus(TestReport.Status.ABORTED);
            testExecutor.abort();
        } else {
            this.testQueue.forEach(item -> {
                if (item.getReport().getId().equals(reportId)) {
                    item.getReport().setStatus(TestReport.Status.ABORTED);
                }
            });
        }
    }

    /**
     * Add a test configuration to the queue.
     *
     * @param config
     *         The test configuration to add to the queue.
     */
    public TestQueueItem add(TestExecutionConfig config) {
        final TestReport report = new TestReport();
        report.setProject(project);
        report.setEnvironment(config.getEnvironment());
        report.setDescription(config.getDescription());

        final TestQueueItem queueItem = new TestQueueItem(
                testReportDAO.create(user, project.getId(), report),
                config
        );

        this.testQueue.addLast(queueItem);
        return queueItem;
    }

    public List<TestQueueItem> getTestQueue() {
        return new ArrayList<>(testQueue);
    }

    public TestQueueItem getCurrentTest() {
        return currentTest;
    }

    public TestExecutor getTestExecutor() {
        return testExecutor;
    }
}
