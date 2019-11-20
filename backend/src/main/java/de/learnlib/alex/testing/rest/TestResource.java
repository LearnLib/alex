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

package de.learnlib.alex.testing.rest;

import de.learnlib.alex.auth.entities.User;
import de.learnlib.alex.data.dao.ProjectDAO;
import de.learnlib.alex.data.entities.Project;
import de.learnlib.alex.data.entities.export.ExportableEntity;
import de.learnlib.alex.security.AuthContext;
import de.learnlib.alex.testing.dao.TestDAO;
import de.learnlib.alex.testing.entities.Test;
import de.learnlib.alex.testing.entities.TestExecutionConfig;
import de.learnlib.alex.testing.entities.TestQueueItem;
import de.learnlib.alex.testing.entities.TestReport;
import de.learnlib.alex.testing.entities.TestResult;
import de.learnlib.alex.testing.entities.TestStatus;
import de.learnlib.alex.testing.entities.export.TestsExportConfig;
import de.learnlib.alex.testing.events.TestEvent;
import de.learnlib.alex.testing.services.TestService;
import de.learnlib.alex.testing.services.export.TestsExporter;
import de.learnlib.alex.webhooks.services.WebhookService;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.ws.rs.core.MediaType;
import java.util.List;

/**
 * REST endpoints for working with tests.
 */
@RestController
@RequestMapping("/rest/projects/{projectId}/tests")
public class TestResource {

    private static final Logger LOGGER = LogManager.getLogger();

    private AuthContext authContext;
    private final TestDAO testDAO;
    private final TestService testService;
    private final WebhookService webhookService;
    private final ProjectDAO projectDAO;
    private final TestsExporter testsExporter;

    @Autowired
    public TestResource(AuthContext authContext,
                        TestDAO testDAO,
                        TestService testService,
                        WebhookService webhookService,
                        ProjectDAO projectDAO,
                        TestsExporter testsExporter) {
        this.authContext = authContext;
        this.testDAO = testDAO;
        this.testService = testService;
        this.webhookService = webhookService;
        this.projectDAO = projectDAO;
        this.testsExporter = testsExporter;
    }

    /**
     * Create a test.
     *
     * @param projectId
     *         The id of the project to create the test in.
     * @param test
     *         The test to create.
     * @return The created test.
     */
    @PostMapping(
            consumes = MediaType.APPLICATION_JSON,
            produces = MediaType.APPLICATION_JSON
    )
    public ResponseEntity createTest(@PathVariable("projectId") Long projectId,
                                     @RequestBody Test test) {
        final User user = authContext.getUser();
        testDAO.create(user, projectId, test);
        webhookService.fireEvent(user, new TestEvent.Created(test));
        return ResponseEntity.status(HttpStatus.CREATED).body(test);
    }

    /**
     * Create multiple tests at once.
     *
     * @param projectId
     *         The id of the project to create the tests in.
     * @param tests
     *         The tests to create.
     * @return The created tests.
     */
    @PostMapping(
            value = "/batch",
            consumes = MediaType.APPLICATION_JSON,
            produces = MediaType.APPLICATION_JSON
    )
    public ResponseEntity createTests(@PathVariable("projectId") Long projectId,
                                      @RequestBody List<Test> tests) {
        final User user = authContext.getUser();
        final List<Test> createdTests = testDAO.create(user, projectId, tests);
        webhookService.fireEvent(user, new TestEvent.CreatedMany(createdTests));
        return ResponseEntity.status(HttpStatus.CREATED).body(createdTests);
    }

    /**
     * Get a single test.
     *
     * @param projectId
     *         The id of the project.
     * @param testId
     *         The id of the test.
     * @return The test.
     */
    @GetMapping(
            value = "/{testId}",
            produces = MediaType.APPLICATION_JSON
    )
    public ResponseEntity get(@PathVariable("projectId") Long projectId,
                              @PathVariable("testId") Long testId) {
        final User user = authContext.getUser();
        final Test test = testDAO.get(user, projectId, testId);
        return ResponseEntity.ok(test);
    }

    /**
     * Get a single test.
     *
     * @param projectId
     *         The id of the project.
     * @return The test.
     */
    @GetMapping(
            value = "/root",
            produces = MediaType.APPLICATION_JSON
    )
    public ResponseEntity get(@PathVariable("projectId") Long projectId) {
        final User user = authContext.getUser();
        final Test root = testDAO.getRoot(user, projectId);
        return ResponseEntity.ok(root);
    }

    /**
     * Executes a test run that can contains multiple tests.
     *
     * @param projectId
     *         The id of the project
     * @param testConfig
     *         The configuration for the test
     * @return A {@link TestReport}.
     */
    @PostMapping(
            value = "/execute",
            consumes = MediaType.APPLICATION_JSON,
            produces = MediaType.APPLICATION_JSON
    )
    public ResponseEntity execute(@PathVariable("projectId") Long projectId,
                                  @RequestBody TestExecutionConfig testConfig) {
        final User user = authContext.getUser();
        final Project project = projectDAO.getByID(user, projectId);
        final TestQueueItem testRun = testService.start(user, project, testConfig);
        return ResponseEntity.ok(testRun);
    }

    /**
     * Get the status of the current test process.
     *
     * @param projectId
     *         The id of the project.
     * @return Status 200 with a {@link TestStatus}.
     */
    @GetMapping(
            value = "/status",
            produces = MediaType.APPLICATION_JSON
    )
    public ResponseEntity status(@PathVariable("projectId") Long projectId) {
        final User user = authContext.getUser();
        LOGGER.traceEntry("status(projectId: {}) with user {}", projectId, user);
        final Project project = projectDAO.getByID(user, projectId);
        final TestStatus status = testService.getStatus(user, project);
        LOGGER.traceExit("status() with status {}", status);
        return ResponseEntity.ok(status);
    }

    @PostMapping(
            value = "/export",
            consumes = MediaType.APPLICATION_JSON,
            produces = MediaType.APPLICATION_JSON
    )
    public ResponseEntity exportTests(@PathVariable("projectId") Long projectId,
                                      @RequestBody TestsExportConfig config) throws Exception {
        final User user = authContext.getUser();
        final ExportableEntity exportedTests = testsExporter.export(user, projectId, config);
        return ResponseEntity.ok(exportedTests);
    }

    @PostMapping(
            value = "/import",
            consumes = MediaType.APPLICATION_JSON,
            produces = MediaType.APPLICATION_JSON
    )
    public ResponseEntity importTests(@PathVariable("projectId") Long projectId,
                                      @RequestBody List<Test> tests) {
        final User user = authContext.getUser();
        final List<Test> importedTests = testDAO.importTests(user, projectId, tests);
        return ResponseEntity.ok(importedTests);
    }

    /**
     * Update a test.
     *
     * @param projectId
     *         The id of the project.
     * @param testId
     *         The id of the test.
     * @param test
     *         The updated test.
     * @return The updated test.
     */
    @PutMapping(
            value = "/{testId}",
            consumes = MediaType.APPLICATION_JSON,
            produces = MediaType.APPLICATION_JSON
    )
    public ResponseEntity update(@PathVariable("projectId") Long projectId,
                                 @PathVariable("testId") Long testId,
                                 @RequestBody Test test) {
        final User user = authContext.getUser();

        if (!test.getId().equals(testId)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }

        if (test.getId() == null) {
            test.setId(testId);
        }

        test.setProjectId(projectId);

        testDAO.update(user, test);

        webhookService.fireEvent(user, new TestEvent.Updated(test));
        return ResponseEntity.ok(test);
    }

    /**
     * Move tests to another test suite.
     *
     * @param projectId
     *         The id of the project.
     * @param testIds
     *         The ids of the tests to move.
     * @param targetId
     *         The id of the target test suite.
     * @return 200 If the tests have been moved successfully.
     */
    @PutMapping(
            value = "/batch/{testIds}/moveTo/{targetId}",
            consumes = MediaType.APPLICATION_JSON,
            produces = MediaType.APPLICATION_JSON
    )
    public ResponseEntity move(@PathVariable("projectId") Long projectId,
                               @PathVariable("testIds") List<Long> testIds,
                               @PathVariable("targetId") Long targetId) {
        final User user = authContext.getUser();
        final List<Test> movedTests = testDAO.move(user, projectId, testIds, targetId);
        webhookService.fireEvent(user, new TestEvent.MovedMany(movedTests));
        return ResponseEntity.ok(movedTests);
    }

    /**
     * Delete a test.
     *
     * @param projectId
     *         The id of the project.
     * @param testId
     *         The id of the test.
     * @return An empty body if the test has been deleted.
     */
    @DeleteMapping(
            value = "/{testId}",
            produces = MediaType.APPLICATION_JSON
    )
    public ResponseEntity delete(@PathVariable("projectId") Long projectId,
                                 @PathVariable("testId") Long testId) {
        final User user = authContext.getUser();
        testDAO.delete(user, projectId, testId);
        webhookService.fireEvent(user, new TestEvent.Deleted(testId));
        return ResponseEntity.noContent().build();
    }

    @PostMapping(
            value = "/abort/{reportId}",
            produces = MediaType.APPLICATION_JSON
    )
    public ResponseEntity abort(@PathVariable("projectId") Long projectId,
                                @PathVariable("reportId") Long reportId) {
        final User user = authContext.getUser();
        testService.abort(user, projectId, reportId);
        return ResponseEntity.ok().build();
    }

    /**
     * Deletes multiple tests.
     *
     * @param projectId
     *         The id of the project.
     * @param testIds
     *         The ids of the tests to delete.
     * @return An empty body if the project has been deleted.
     */
    @DeleteMapping(
            value = "/batch/{testIds}",
            produces = MediaType.APPLICATION_JSON
    )
    public ResponseEntity delete(@PathVariable("projectId") Long projectId,
                                 @PathVariable("testIds") List<Long> testIds) {
        final User user = authContext.getUser();
        testDAO.delete(user, projectId, testIds);
        webhookService.fireEvent(user, new TestEvent.DeletedMany(testIds));
        return ResponseEntity.noContent().build();
    }

    /**
     * Get all test results of a test.
     *
     * @param projectId
     *         The ID of the project.
     * @param testId
     *         The ID of the test.
     * @param page
     *         The page number.
     * @param size
     *         The number of items in the page.
     * @return All test results of a test.
     */
    @GetMapping(
            value = "/{testId}/results",
            produces = MediaType.APPLICATION_JSON
    )
    public ResponseEntity getResults(@PathVariable("projectId") Long projectId,
                                     @PathVariable("testId") Long testId,
                                     @RequestParam(name = "page", defaultValue = "1") int page,
                                     @RequestParam(name = "size", defaultValue = "25") int size) {
        final User user = authContext.getUser();
        final PageRequest pr = PageRequest.of(page, size);
        final Page<TestResult> results = testDAO.getResults(user, projectId, testId, pr);
        return ResponseEntity.ok(results);
    }
}
