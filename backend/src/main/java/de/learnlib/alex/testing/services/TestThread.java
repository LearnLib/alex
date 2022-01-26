/*
 * Copyright 2015 - 2022 TU Dortmund
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

import de.learnlib.alex.auth.dao.UserDAO;
import de.learnlib.alex.auth.entities.User;
import de.learnlib.alex.common.utils.LoggerMarkers;
import de.learnlib.alex.data.dao.ProjectDAO;
import de.learnlib.alex.data.entities.Project;
import de.learnlib.alex.testing.dao.TestDAO;
import de.learnlib.alex.testing.dao.TestReportDAO;
import de.learnlib.alex.testing.entities.TestProcessQueueItem;
import de.learnlib.alex.testing.entities.TestQueueItem;
import de.learnlib.alex.testing.entities.TestReport;
import de.learnlib.alex.testing.entities.TestResult;
import de.learnlib.alex.testing.events.TestEvent;
import de.learnlib.alex.testing.events.TestExecutionStartedEventData;
import de.learnlib.alex.webhooks.services.WebhookService;
import java.util.ArrayList;
import java.util.Deque;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentLinkedDeque;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.MDC;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.support.TransactionTemplate;

/**
 * The thread that executes tests. There should ever only be one test per project.
 */
@Service
@Scope("prototype")
public class TestThread extends Thread {

    private static final Logger logger = LoggerFactory.getLogger(TestThread.class);

    /** Listener for when the test process finished. */
    public interface FinishedListener {
        /** What to do when the test process finished. */
        void handleFinished();
    }

    private final WebhookService webhookService;
    private final TestDAO testDAO;
    private final TestReportDAO testReportDAO;
    private final ProjectDAO projectDAO;
    private final UserDAO userDAO;
    private final TransactionTemplate transactionTemplate;

    /** The finished listener. */
    private FinishedListener finishedListener;

    public void onFinished(FinishedListener listener) {
        this.finishedListener = listener;
    }

    private final TestExecutor testExecutor;

    /** The user that executes the tests. */
    private User user;

    /** The project that is used. */
    private Project project;

    /** The current test report. */
    private TestReport report;

    /** The queue of tests to execute. */
    private final Deque<TestProcessQueueItem> testProcessQueue = new ConcurrentLinkedDeque<>();

    /** The current test process queue item. */
    private TestProcessQueueItem currentTestProcessQueueItem;

    /** Test results of the current test process. */
    final Map<Long, TestResult> results = new ConcurrentHashMap<>();

    @Autowired
    public TestThread(
            WebhookService webhookService,
            TestDAO testDAO,
            TestReportDAO testReportDAO,
            ProjectDAO projectDAO,
            UserDAO userDAO,
            TransactionTemplate transactionTemplate,
            ApplicationContext applicationContext
    ) {
        this.webhookService = webhookService;
        this.testDAO = testDAO;
        this.testReportDAO = testReportDAO;
        this.projectDAO = projectDAO;
        this.userDAO = userDAO;
        this.transactionTemplate = transactionTemplate;
        this.testExecutor = applicationContext.getBean(TestExecutor.class);
    }

    @Override
    public void run() {
        while (!testProcessQueue.isEmpty()) {
            currentTestProcessQueueItem = testProcessQueue.poll();
            results.clear();

            transactionTemplate.execute((t) -> {
                user = userDAO.getByID(currentTestProcessQueueItem.userId);
                project = projectDAO.getByID(user, currentTestProcessQueueItem.projectId);
                report = testReportDAO.get(user, project.getId(), currentTestProcessQueueItem.reportId);
                return null;
            });

            if (report.getStatus().equals(TestReport.Status.ABORTED)) {
                continue;
            }

            try {
                MDC.put("userId", String.valueOf(user.getId()));
                MDC.put("projectId", String.valueOf(project.getId()));

                final var config = currentTestProcessQueueItem.config;
                logger.info(LoggerMarkers.LEARNER, "Start executing tests: {}", config.getTestIds());

                report = testReportDAO.updateStatus(report.getId(), TestReport.Status.IN_PROGRESS);

                // do not fire the event if the test is only called for testing purposes.
                final TestExecutionStartedEventData data = new TestExecutionStartedEventData(project.getId(), config);
                webhookService.fireEvent(user, new TestEvent.ExecutionStarted(data));

                final var testsToExecute = testDAO.get(user, project.getId(), config.getTestIds());
                testExecutor.executeTests(user, testsToExecute, config, results);

                report = transactionTemplate.execute((t) -> {
                    report = testReportDAO.getByID(report.getId());
                    report.setTestResults(new ArrayList<>(results.values()));

                    if (!report.getStatus().equals(TestReport.Status.ABORTED)) {
                        report.setStatus(TestReport.Status.FINISHED);
                    }

                    return testReportDAO.update(user, project.getId(), report.getId(), report);
                });

                webhookService.fireEvent(user, new TestEvent.ExecutionFinished(report));

                logger.info(LoggerMarkers.LEARNER, "Successfully executed tests");
            } catch (Exception e) {
                testReportDAO.updateStatus(report.getId(), TestReport.Status.ABORTED);

                logger.info(LoggerMarkers.LEARNER, "Could not execute all tests", e);
                e.printStackTrace();
            }
        }

        finishedListener.handleFinished();
        testProcessQueue.clear();

        logger.info(LoggerMarkers.LEARNER, "Finished testing");
        MDC.remove("userId");
        MDC.remove("projectID");
    }

    @Transactional(rollbackFor = Exception.class)
    public void abort(Long reportId) {
        if (report != null) {
            if (report.getId().equals(reportId)) {
                report = testReportDAO.updateStatus(reportId, TestReport.Status.ABORTED);
                testExecutor.abort();
            } else {
                for (var item : testProcessQueue) {
                    if (item.reportId.equals(reportId)) {
                        testReportDAO.updateStatus(item.reportId, TestReport.Status.ABORTED);
                    }
                }
            }
        }
    }

    /**
     * Add a test configuration to the queue.
     *
     * @param item
     *         The test configuration to add to the queue.
     */
    public void add(TestProcessQueueItem item) {
        this.testProcessQueue.addLast(item);
    }

    public List<TestProcessQueueItem> getTestQueue() {
        return new ArrayList<>(testProcessQueue);
    }

    public TestQueueItem getCurrentTest() {
        if (report != null) {
            final var item = new TestQueueItem();
            item.setConfig(currentTestProcessQueueItem.config);
            item.setResults(results);
            item.setReport(report);
            return item;
        }

        return null;
    }

    public TestExecutor getTestExecutor() {
        return testExecutor;
    }
}
