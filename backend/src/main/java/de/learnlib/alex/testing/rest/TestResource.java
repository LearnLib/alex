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
import de.learnlib.alex.auth.security.UserPrincipal;
import de.learnlib.alex.common.utils.IdsList;
import de.learnlib.alex.common.utils.ResourceErrorHandler;
import de.learnlib.alex.data.dao.ProjectDAO;
import de.learnlib.alex.data.entities.Project;
import de.learnlib.alex.data.entities.export.ExportableEntity;
import de.learnlib.alex.testing.entities.export.TestsExportConfig;
import de.learnlib.alex.testing.dao.TestDAO;
import de.learnlib.alex.testing.dao.TestReportDAO;
import de.learnlib.alex.testing.entities.Test;
import de.learnlib.alex.testing.entities.TestCase;
import de.learnlib.alex.testing.entities.TestExecutionConfig;
import de.learnlib.alex.testing.entities.TestReport;
import de.learnlib.alex.testing.entities.TestResult;
import de.learnlib.alex.testing.entities.TestStatus;
import de.learnlib.alex.testing.events.TestEvent;
import de.learnlib.alex.testing.services.TestService;
import de.learnlib.alex.testing.services.export.TestsExporter;
import de.learnlib.alex.webhooks.services.WebhookService;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.apache.logging.log4j.ThreadContext;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;

import javax.annotation.security.RolesAllowed;
import javax.inject.Inject;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.SecurityContext;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * REST endpoints for working with tests.
 */
@Path("/projects/{projectId}/tests")
@RolesAllowed({"REGISTERED"})
public class TestResource {

    private static final Logger LOGGER = LogManager.getLogger();

    @Context
    private SecurityContext securityContext;

    private final TestDAO testDAO;
    private final TestService testService;
    private final WebhookService webhookService;
    private final TestReportDAO testReportDAO;
    private final ProjectDAO projectDAO;
    private final TestsExporter testsExporter;

    @Inject
    public TestResource(TestDAO testDAO,
                        TestService testService,
                        WebhookService webhookService,
                        TestReportDAO testReportDAO,
                        ProjectDAO projectDAO,
                        TestsExporter testsExporter) {
        this.testDAO = testDAO;
        this.testService = testService;
        this.webhookService = webhookService;
        this.testReportDAO = testReportDAO;
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
    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response createTest(@PathParam("projectId") Long projectId, Test test) {
        final User user = ((UserPrincipal) securityContext.getUserPrincipal()).getUser();
        testDAO.create(user, projectId, test);
        webhookService.fireEvent(user, new TestEvent.Created(test));
        return Response.ok(test).status(Response.Status.CREATED).build();
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
    @POST
    @Path("/batch")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response createTests(@PathParam("projectId") Long projectId, List<Test> tests) {
        final User user = ((UserPrincipal) securityContext.getUserPrincipal()).getUser();
        final List<Test> createdTests = testDAO.create(user, projectId, tests);
        webhookService.fireEvent(user, new TestEvent.CreatedMany(createdTests));
        return Response.ok(createdTests).status(Response.Status.CREATED).build();
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
    @GET
    @Path("/{testId}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response get(@PathParam("projectId") Long projectId, @PathParam("testId") Long testId) {
        final User user = ((UserPrincipal) securityContext.getUserPrincipal()).getUser();
        final Test test = testDAO.get(user, projectId, testId);
        return Response.ok(test).build();
    }

    /**
     * Get a single test.
     *
     * @param projectId
     *         The id of the project.
     * @return The test.
     */
    @GET
    @Path("/root")
    @Produces(MediaType.APPLICATION_JSON)
    public Response get(@PathParam("projectId") Long projectId) {
        final User user = ((UserPrincipal) securityContext.getUserPrincipal()).getUser();
        final Test root = testDAO.getRoot(user, projectId);
        return Response.ok(root).build();
    }

    /**
     * Execute a test.
     *
     * @param projectId
     *         The id of the project.
     * @param testId
     *         The id of the test.
     * @param testConfig
     *         The configuration to run the test with.
     * @return The result of the test execution.
     */
    @POST
    @Path("/{testId}/execute")
    @Produces(MediaType.APPLICATION_JSON)
    public Response execute(@PathParam("projectId") Long projectId,
                            @PathParam("testId") Long testId,
                            TestExecutionConfig testConfig) {
        final User user = ((UserPrincipal) securityContext.getUserPrincipal()).getUser();
        ThreadContext.put("userId", String.valueOf(user.getId()));

        final Test test = testDAO.get(user, projectId, testId);
        if (!(test instanceof TestCase)) {
            final Exception e = new Exception("The test is not a test case.");
            return ResourceErrorHandler.createRESTErrorMessage("TestResource.execute", Response.Status.BAD_REQUEST, e);
        } else if (((TestCase) test).getSteps().isEmpty()) {
            final Exception e = new Exception("The test has no steps to execute");
            return ResourceErrorHandler.createRESTErrorMessage("TestResource.execute", Response.Status.BAD_REQUEST, e);
        }

        final Map<Long, TestResult> results = new HashMap<>();
        testService.createTestExecutor().executeTestCase(user, (TestCase) test, testConfig, results);

        TestReport report = new TestReport();
        report.setTestResults(new ArrayList<>(results.values()));
        report.setEnvironment(testConfig.getEnvironment());

        if (testConfig.isCreateReport()) {
            report = testReportDAO.create(user, projectId, report);
            webhookService.fireEvent(user, new TestEvent.ExecutionFinished(report));
        }

        ThreadContext.remove("userId");
        return Response.ok(report).build();
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
    @POST
    @Path("/execute")
    @Produces(MediaType.APPLICATION_JSON)
    public Response execute(@PathParam("projectId") Long projectId,
                            TestExecutionConfig testConfig) {
        final User user = ((UserPrincipal) securityContext.getUserPrincipal()).getUser();
        final Project project = projectDAO.getByID(user, projectId);
        final TestStatus status = testService.start(user, project, testConfig);
        return Response.ok(status).build();
    }

    /**
     * Get the status of the current test process.
     *
     * @param projectId
     *         The id of the project.
     * @return Status 200 with a {@link TestStatus}.
     */
    @GET
    @Path("/status")
    @Produces(MediaType.APPLICATION_JSON)
    public Response status(@PathParam("projectId") Long projectId) {
        final User user = ((UserPrincipal) securityContext.getUserPrincipal()).getUser();
        LOGGER.traceEntry("status(projectId: {}) with user {}", projectId, user);
        final Project project = projectDAO.getByID(user, projectId);
        final TestStatus status = testService.getStatus(user, project);
        LOGGER.traceExit("status() with status {}", status);
        return Response.ok(status).build();
    }

    /**
     * Abort the testing process.
     *
     * @param projectId
     *         The ID of the project.
     * @return 200 if the process could be aborted.
     */
    @POST
    @Path("/abort")
    public Response abort(@PathParam("projectId") Long projectId) {
        final User user = ((UserPrincipal) securityContext.getUserPrincipal()).getUser();
        LOGGER.traceEntry("abort(projectId: {}) with user {}", projectId, user);

        testService.abort(user, projectId);
        LOGGER.traceExit("abort() with status {}", Response.Status.OK.getStatusCode());
        return Response.ok().build();
    }

    @POST
    @Path("/export")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response exportTests(@PathParam("projectId") Long projectId, TestsExportConfig config) throws Exception {
        final User user = ((UserPrincipal) securityContext.getUserPrincipal()).getUser();
        final ExportableEntity exportedTests = testsExporter.export(user, projectId, config);
        return Response.ok(exportedTests).build();
    }

    @POST
    @Path("/import")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response importTests(@PathParam("projectId") Long projectId, List<Test> tests) {
        final User user = ((UserPrincipal) securityContext.getUserPrincipal()).getUser();
        final List<Test> importedTests = testDAO.importTests(user, projectId, tests);
        return Response.ok(importedTests).build();
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
    @PUT
    @Path("/{testId}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response update(@PathParam("projectId") Long projectId,
                           @PathParam("testId") Long testId,
                           Test test) {
        final User user = ((UserPrincipal) securityContext.getUserPrincipal()).getUser();

        if (!test.getId().equals(testId)) {
            return Response.status(Response.Status.BAD_REQUEST).build();
        }

        if (test.getId() == null) {
            test.setId(testId);
        }

        test.setProjectId(projectId);

        // if a test case is updated by a user remove generated flag
        if (test instanceof TestCase) {
            ((TestCase) test).setGenerated(false);
        }
        testDAO.update(user, test);

        webhookService.fireEvent(user, new TestEvent.Updated(test));
        return Response.ok(test).build();
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
    @PUT
    @Path("/batch/{testIds}/moveTo/{targetId}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response move(@PathParam("projectId") Long projectId,
                         @PathParam("testIds") IdsList testIds,
                         @PathParam("targetId") Long targetId) {
        final User user = ((UserPrincipal) securityContext.getUserPrincipal()).getUser();
        final List<Test> movedTests = testDAO.move(user, projectId, testIds, targetId);
        webhookService.fireEvent(user, new TestEvent.MovedMany(movedTests));
        return Response.ok(movedTests).build();
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
    @DELETE
    @Path("/{testId}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response delete(@PathParam("projectId") Long projectId, @PathParam("testId") Long testId) {
        final User user = ((UserPrincipal) securityContext.getUserPrincipal()).getUser();
        testDAO.delete(user, projectId, testId);
        webhookService.fireEvent(user, new TestEvent.Deleted(testId));
        return Response.status(Response.Status.NO_CONTENT).build();
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
    @DELETE
    @Path("/batch/{testIds}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response delete(@PathParam("projectId") Long projectId, @PathParam("testIds") IdsList testIds) {
        final User user = ((UserPrincipal) securityContext.getUserPrincipal()).getUser();
        testDAO.delete(user, projectId, testIds);
        webhookService.fireEvent(user, new TestEvent.DeletedMany(testIds));
        return Response.status(Response.Status.NO_CONTENT).build();
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
    @GET
    @Path("/{testId}/results")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getResults(@PathParam("projectId") Long projectId,
                               @PathParam("testId") Long testId,
                               @QueryParam("page") int page, @QueryParam("size") int size) {
        final User user = ((UserPrincipal) securityContext.getUserPrincipal()).getUser();
        final PageRequest pr = PageRequest.of(page, size);
        final Page<TestResult> results = testDAO.getResults(user, projectId, testId, pr);
        return Response.ok(results).build();
    }
}
