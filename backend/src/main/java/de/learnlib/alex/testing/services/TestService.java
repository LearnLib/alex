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
import de.learnlib.alex.common.exceptions.NotFoundException;
import de.learnlib.alex.common.utils.LoggerMarkers;
import de.learnlib.alex.common.utils.SearchHelper;
import de.learnlib.alex.data.dao.ProjectDAO;
import de.learnlib.alex.data.entities.ExecuteResult;
import de.learnlib.alex.data.entities.ParameterizedSymbol;
import de.learnlib.alex.data.entities.Project;
import de.learnlib.alex.data.entities.ProjectUrl;
import de.learnlib.alex.data.entities.Symbol;
import de.learnlib.alex.data.entities.SymbolParameter;
import de.learnlib.alex.data.entities.SymbolStep;
import de.learnlib.alex.data.repositories.ProjectUrlRepository;
import de.learnlib.alex.learning.services.connectors.ConnectorContextHandler;
import de.learnlib.alex.learning.services.connectors.ConnectorManager;
import de.learnlib.alex.learning.services.connectors.CounterStoreConnector;
import de.learnlib.alex.learning.services.connectors.PreparedConnectorContextHandlerFactory;
import de.learnlib.alex.learning.services.connectors.VariableStoreConnector;
import de.learnlib.alex.testing.dao.TestDAO;
import de.learnlib.alex.testing.dao.TestReportDAO;
import de.learnlib.alex.testing.entities.Test;
import de.learnlib.alex.testing.entities.TestCase;
import de.learnlib.alex.testing.entities.TestCaseResult;
import de.learnlib.alex.testing.entities.TestCaseStep;
import de.learnlib.alex.testing.entities.TestExecutionConfig;
import de.learnlib.alex.testing.entities.TestExecutionResult;
import de.learnlib.alex.testing.entities.TestReport;
import de.learnlib.alex.testing.entities.TestResult;
import de.learnlib.alex.testing.entities.TestStatus;
import de.learnlib.alex.testing.entities.TestSuite;
import de.learnlib.alex.testing.entities.TestSuiteResult;
import de.learnlib.alex.webhooks.services.WebhookService;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.stereotype.Service;

import javax.inject.Inject;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/** The service that executes tests. */
@Service
public class TestService {

    private static final Logger LOGGER = LogManager.getLogger();

    /** Factory to create a new ContextHandler. */
    private final PreparedConnectorContextHandlerFactory contextHandlerFactory;

    /** The running testing threads. userId -> (projectId -> TestThread). */
    private final Map<Long, Map<Long, TestThread>> testingThreads;

    /** The {@link WebhookService} to use. */
    private final WebhookService webhookService;

    /** The {@link TestDAO} to use. */
    private final TestDAO testDAO;

    /** The {@link TestReportDAO} to use. */
    private final TestReportDAO testReportDAO;

    /** The {@link ProjectUrlRepository} to use. */
    private final ProjectUrlRepository projectUrlRepository;

    /** The {@link ProjectDAO} to use. */
    private final ProjectDAO projectDAO;

    /**
     * Constructor.
     *
     * @param contextHandlerFactory
     *         The injected {@link PreparedConnectorContextHandlerFactory}.
     * @param webhookService
     *         The injected {@link WebhookService}.
     * @param testDAO
     *         The injected {@link TestDAO}.
     * @param testReportDAO
     *         The injected {@link TestReportDAO}.
     * @param projectUrlRepository
     *         The injected {@link ProjectUrlRepository}.
     * @param projectDAO
     *         The injected {@link ProjectDAO}.
     */
    @Inject
    public TestService(PreparedConnectorContextHandlerFactory contextHandlerFactory, WebhookService webhookService,
                       TestDAO testDAO, TestReportDAO testReportDAO, ProjectUrlRepository projectUrlRepository,
                       ProjectDAO projectDAO) {
        this.contextHandlerFactory = contextHandlerFactory;
        this.webhookService = webhookService;
        this.testDAO = testDAO;
        this.testReportDAO = testReportDAO;
        this.testingThreads = new HashMap<>();
        this.projectUrlRepository = projectUrlRepository;
        this.projectDAO = projectDAO;
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
    public TestStatus start(User user, Project project, TestExecutionConfig config) {
        final TestThread thread = new TestThread(user, project, config, webhookService, testDAO,
                testReportDAO, createTestExecutor(), () -> {
            this.testingThreads.get(user.getId()).remove(project.getId());
            if (this.testingThreads.get(user.getId()).values().size() == 0) {
                this.testingThreads.remove(user.getId());
            }
        });

        if (testingThreads.containsKey(user.getId())) {
            if (testingThreads.get(user.getId()).containsKey(project.getId())) {
                testingThreads.get(user.getId()).get(project.getId()).add(config);
            } else {
                testingThreads.get(user.getId()).put(project.getId(), thread);
                thread.start();
            }
        } else {
            this.testingThreads.put(user.getId(), new HashMap<>());
            this.testingThreads.get(user.getId()).put(project.getId(), thread);
            thread.start();
        }

        return getStatus(user, project);
    }

    /**
     * Abort the test thread of the user and the project.
     *
     * @param user
     *         The user.
     * @param projectId
     *         The ID of the project.
     * @throws NotFoundException
     *         If the project cannot be found.
     */
    public void abort(User user, Long projectId) throws NotFoundException {
        final Project project = projectDAO.getByID(user, projectId, ProjectDAO.EmbeddableFields.COUNTERS);
        if (testingThreads.containsKey(user.getId()) && testingThreads.get(user.getId()).containsKey(project.getId())) {
            testingThreads.get(user.getId()).get(project.getId()).abort();
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

        if (!testingThreads.containsKey(user.getId())) {
            status.setActive(false);
        } else {
            if (!testingThreads.get(user.getId()).containsKey(project.getId())) {
                status.setActive(false);
            } else {
                final TestThread testThread = testingThreads.get(user.getId()).get(project.getId());
                status.setActive(true);
                status.setReport(testThread.getReport());
                status.setTestsInQueue(testThread.getNumberOfTestsInQueue());
                status.setCurrentTest(testThread.getTestExecutor().getCurrentTest());
            }
        }

        return status;
    }

    public TestExecutor createTestExecutor() {
        return new TestExecutor(contextHandlerFactory, projectUrlRepository);
    }
}
