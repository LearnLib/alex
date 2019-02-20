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
import de.learnlib.alex.testing.dao.TestReportDAO;
import de.learnlib.alex.testing.entities.TestReport;
import de.learnlib.alex.testing.services.reporters.JUnitTestResultReporter;
import de.learnlib.alex.testing.services.reporters.TestResultReporter;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;

import javax.annotation.security.RolesAllowed;
import javax.inject.Inject;
import javax.validation.ValidationException;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.SecurityContext;

/** The resource for test reports. */
@Path("/projects/{project_id}/tests/reports")
@RolesAllowed({"REGISTERED"})
public class TestReportResource {

    private static final Logger LOGGER = LogManager.getLogger();

    /** The security context containing the user of the request. */
    @Context
    private SecurityContext securityContext;

    /** The test report DAO. */
    private TestReportDAO testReportDAO;

    /**
     * Constructor.
     *
     * @param testReportDAO
     *         {@link #testReportDAO}
     */
    @Inject
    public TestReportResource(TestReportDAO testReportDAO) {
        this.testReportDAO = testReportDAO;
    }

    /**
     * Get all test reports.
     *
     * @param projectId
     *         The id of the project.
     * @param page
     *         The page to get.
     * @param size
     *         The number of items in a page.
     * @return All test reports.
     */
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response get(@PathParam("project_id") Long projectId, @QueryParam("page") int page,
                        @QueryParam("size") int size) {
        final User user = ((UserPrincipal) securityContext.getUserPrincipal()).getUser();
        LOGGER.traceEntry("getAll({}) for user {}.", projectId, user);

        final PageRequest pr = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "startDate"));
        final Page<TestReport> testReports = testReportDAO.getAll(user, projectId, pr);

        LOGGER.traceExit(testReports.getContent());
        return Response.ok(testReports).build();
    }

    /**
     * Get a test report by ids id.
     *
     * @param projectId
     *         The id of the project.
     * @param reportId
     *         The id of the report in the project.
     * @param format
     *         The format to export the report to.
     * @return The report.
     */
    @GET
    @Path("/{report_id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response get(@PathParam("project_id") Long projectId,
                        @PathParam("report_id") Long reportId,
                        @QueryParam("format") String format) {
        final User user = ((UserPrincipal) securityContext.getUserPrincipal()).getUser();
        LOGGER.traceEntry("get({}, {}) for user {}.", projectId, reportId, user);

        final TestReport testReport = testReportDAO.get(user, projectId, reportId);

        if (format == null) {
            return Response.ok(testReport).build();
        } else {
            switch (format) {
                case "junit+xml":
                    final TestResultReporter<String> reporter = new JUnitTestResultReporter();
                    final String report = reporter.createReport(testReport);

                    LOGGER.traceExit(report);
                    return Response.status(Response.Status.OK)
                            .header("Content-Type", "application/xml")
                            .entity(report)
                            .build();
                default:
                    final Exception e = new ValidationException("format " + format + " does not exist");
                    LOGGER.traceExit(e);

                    return ResourceErrorHandler.createRESTErrorMessage("TestReportResource.get",
                            Response.Status.BAD_REQUEST, e);
            }
        }
    }

    /**
     * Get the latest test report.
     *
     * @param projectId
     *         The id of the project.
     * @return 200 if a report is available, 204 otherwise.
     */
    @GET
    @Path("/latest")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getLatest(@PathParam("project_id") Long projectId) {
        final User user = ((UserPrincipal) securityContext.getUserPrincipal()).getUser();
        LOGGER.traceEntry("getLatest({}) for user {}.", projectId, user);

        final TestReport latestReport = testReportDAO.getLatest(user, projectId);
        LOGGER.traceExit(latestReport);
        return latestReport == null ? Response.noContent().build() : Response.ok(latestReport).build();
    }

    /**
     * Deletes a single test report.
     *
     * @param projectId
     *         The id of the project.
     * @param reportId
     *         The id of the report to delete.
     * @return Status 204 - no content on success.
     */
    @DELETE
    @Path("/{report_id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response delete(@PathParam("project_id") Long projectId, @PathParam("report_id") Long reportId) {
        final User user = ((UserPrincipal) securityContext.getUserPrincipal()).getUser();
        LOGGER.traceEntry("delete({}, {}) for user {}.", projectId, reportId, user);

        testReportDAO.delete(user, projectId, reportId);

        LOGGER.traceExit("Report {} deleted", reportId);
        return Response.noContent().build();
    }

    /**
     * Deletes multiple test reports at once.
     *
     * @param projectId
     *         The id of the project.
     * @param reportIds
     *         The ids of the reports to delete.
     * @return Status 204 - no content on success.
     */
    @DELETE
    @Path("/batch/{report_ids}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response delete(@PathParam("project_id") Long projectId, @PathParam("report_ids") IdsList reportIds) {
        final User user = ((UserPrincipal) securityContext.getUserPrincipal()).getUser();
        LOGGER.traceEntry("delete({}, {}) for user {}.", projectId, reportIds, user);

        testReportDAO.delete(user, projectId, reportIds);

        LOGGER.traceExit("Reports {} deleted", reportIds);
        return Response.noContent().build();
    }
}
