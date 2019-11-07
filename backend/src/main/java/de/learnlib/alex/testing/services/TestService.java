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

package de.learnlib.alex.testing.services;

import de.learnlib.alex.auth.entities.User;
import de.learnlib.alex.data.dao.ProjectDAO;
import de.learnlib.alex.data.dao.ProjectEnvironmentDAO;
import de.learnlib.alex.data.entities.Project;
import de.learnlib.alex.learning.services.connectors.PreparedConnectorContextHandlerFactory;
import de.learnlib.alex.testing.dao.TestDAO;
import de.learnlib.alex.testing.dao.TestReportDAO;
import de.learnlib.alex.testing.entities.TestExecutionConfig;
import de.learnlib.alex.testing.entities.TestQueueItem;
import de.learnlib.alex.testing.entities.TestReport;
import de.learnlib.alex.testing.entities.TestStatus;
import de.learnlib.alex.webhooks.services.WebhookService;
import org.springframework.stereotype.Service;

import javax.inject.Inject;
import java.util.HashMap;
import java.util.Map;

/** The service that executes tests. */
@Service
public class TestService {

    /** Factory to create a new ContextHandler. */
    private final PreparedConnectorContextHandlerFactory contextHandlerFactory;

    /** The running testing threads (projectId -> TestThread). */
    private final Map<Long, TestThread> testThreads;

    /** The {@link WebhookService} to use. */
    private final WebhookService webhookService;

    /** The {@link TestDAO} to use. */
    private final TestDAO testDAO;

    /** The {@link TestReportDAO} to use. */
    private final TestReportDAO testReportDAO;

    /** The {@link ProjectDAO} to use. */
    private final ProjectDAO projectDAO;

    private final ProjectEnvironmentDAO environmentDAO;

    @Inject
    public TestService(PreparedConnectorContextHandlerFactory contextHandlerFactory, WebhookService webhookService,
                       TestDAO testDAO, TestReportDAO testReportDAO, ProjectEnvironmentDAO environmentDAO,
                       ProjectDAO projectDAO) {
        this.contextHandlerFactory = contextHandlerFactory;
        this.webhookService = webhookService;
        this.testDAO = testDAO;
        this.testReportDAO = testReportDAO;
        this.testThreads = new HashMap<>();
        this.projectDAO = projectDAO;
        this.environmentDAO = environmentDAO;
    }

    /**
     * Starts a new test thread.
     *
     * @param user
     *         The user.
     * @param project
     *         The project.
     * @param config
     *         The config for the tests.
     * @return A test status.
     */
    public TestQueueItem start(User user, Project project, TestExecutionConfig config) {
        final TestReport r = new TestReport();
        r.setEnvironment(config.getEnvironment());

        if (testThreads.containsKey(project.getId())) {
            final TestThread testThread = testThreads.get(project.getId());
            return testThread.add(config);
        } else {
            final TestThread testThread = new TestThread(user, project, webhookService, testDAO,
                    testReportDAO, createTestExecutor(), () ->
                this.testThreads.remove(project.getId())
            );
            this.testThreads.put(project.getId(), testThread);
            final TestQueueItem testStatus = testThread.add(config);
            testThread.start();
            return testStatus;
        }
    }

    /**
     * Gets the status of the active test process of a project.
     *
     * @param user
     *         The user.
     * @param project
     *         The project.
     * @return The status.
     */
    public TestStatus getStatus(User user, Project project) {
        final TestStatus status = new TestStatus();
        projectDAO.checkAccess(user, project);

        if (testThreads.containsKey(project.getId())) {
            final TestThread testThread = testThreads.get(project.getId());
            status.setTestRunQueue(testThread.getTestQueue());
            status.setCurrentTestRun(testThread.getCurrentTest());
            status.setCurrentTest(testThread.getTestExecutor().getCurrentTest());
        }

        return status;
    }

    public void abort(User user, Long projectId, Long reportId) {
        testReportDAO.get(user, projectId, reportId);

        if (testThreads.containsKey(projectId)) {
            final TestThread testThread = testThreads.get(projectId);
            testThread.abort(reportId);
        }
    }

    public TestExecutor createTestExecutor() {
        return new TestExecutor(contextHandlerFactory, environmentDAO);
    }
}
