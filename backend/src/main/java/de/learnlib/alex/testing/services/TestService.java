/*
 * Copyright 2015 - 2021 TU Dortmund
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
import de.learnlib.alex.data.dao.ProjectDAO;
import de.learnlib.alex.testing.dao.TestReportDAO;
import de.learnlib.alex.testing.entities.TestExecutionConfig;
import de.learnlib.alex.testing.entities.TestProcessQueueItem;
import de.learnlib.alex.testing.entities.TestQueueItem;
import de.learnlib.alex.testing.entities.TestReport;
import de.learnlib.alex.testing.entities.TestStatus;
import org.apache.shiro.authz.UnauthorizedException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

/** The service that executes tests. */
@Service
@Transactional(rollbackFor = Exception.class)
public class TestService {

    private final ApplicationContext applicationContext;
    private final TestReportDAO testReportDAO;
    private final ProjectDAO projectDAO;

    /** The running testing threads (projectId -> TestThread). */
    private final Map<Long, TestThread> testThreads;

    @Autowired
    public TestService(
            ApplicationContext applicationContext,
            TestReportDAO testReportDAO,
            ProjectDAO projectDAO
    ) {
        this.applicationContext = applicationContext;
        this.testReportDAO = testReportDAO;
        this.projectDAO = projectDAO;

        this.testThreads = new HashMap<>();
    }

    /**
     * Starts a new test thread.
     *
     * @param user
     *         The user.
     * @param projectId
     *         The ID of the project.
     * @param config
     *         The config for the tests.
     * @return A test status.
     */
    public TestQueueItem start(User user, Long projectId, TestExecutionConfig config) {
        final var project = projectDAO.getByID(user, projectId);

        final var r = new TestReport();
        r.setEnvironment(config.getEnvironment());
        r.setExecutedBy(user);
        r.setProject(project);
        r.setDescription(config.getDescription());

        final var createdReport = testReportDAO.create(user, projectId, r);

        final var item = new TestProcessQueueItem(
                user.getId(),
                project.getId(),
                createdReport.getId(),
                config
        );

        if (testThreads.containsKey(project.getId())) {
            final var testThread = testThreads.get(project.getId());
            testThread.add(item);
        } else {
            final var testThread = applicationContext.getBean(TestThread.class);
            testThread.onFinished(() -> this.testThreads.remove(project.getId()));

            this.testThreads.put(project.getId(), testThread);
            testThread.add(item);
            testThread.start();
        }

        final var qi = new TestQueueItem();
        qi.setConfig(config);
        qi.setReport(createdReport);
        qi.setResults(new HashMap<>());

        return qi;
    }

    /**
     * Gets the status of the active test process of a project.
     *
     * @param user
     *         The user.
     * @param projectId
     *         The ID of the project.
     * @return The status.
     */
    public TestStatus getStatus(User user, Long projectId) {
        final var project = projectDAO.getByID(user, projectId);
        final var status = new TestStatus();

        if (testThreads.containsKey(project.getId())) {
            final TestThread testThread = testThreads.get(project.getId());
            status.setTestRunQueue(testThread.getTestQueue().stream()
                    .map(item -> {
                        final var i = new TestQueueItem();
                        i.setReport(testReportDAO.get(user, projectId, item.reportId));
                        i.setConfig(item.config);
                        return i;
                    })
                    .collect(Collectors.toList())
            );
            status.setCurrentTestRun(testThread.getCurrentTest());
            status.setCurrentTest(testThread.getTestExecutor().getCurrentTest());
        }

        return status;
    }

    /**
     * Abort the test process for a given report id.
     *
     * @param user
     *          The user.
     * @param projectId
     *          The ID of the project.
     * @param reportId
     *          The ID of the report to abort.
     */
    public void abort(User user, Long projectId, Long reportId) {
        final var project = projectDAO.getByID(user, projectId);
        final var report = testReportDAO.get(user, projectId, reportId);

        final var isOwner = project.getOwners().stream()
                .anyMatch(u -> u.equals(user));

        if (!isOwner && report.getExecutedBy() != null && !report.getExecutedBy().equals(user)) {
            throw new UnauthorizedException("You are not allowed to abort this test run.");
        }

        if (testThreads.containsKey(projectId)) {
            final TestThread testThread = testThreads.get(projectId);
            testThread.abort(reportId);
        }
    }
}
