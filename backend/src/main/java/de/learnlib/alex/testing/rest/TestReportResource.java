/*
 * Copyright 2016 TU Dortmund
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
import de.learnlib.alex.common.exceptions.NotFoundException;
import de.learnlib.alex.common.utils.IdsList;
import de.learnlib.alex.common.utils.ResourceErrorHandler;
import de.learnlib.alex.testing.dao.TestReportDAO;
import de.learnlib.alex.testing.entities.TestReport;
import de.learnlib.alex.testing.services.reporters.JUnitTestResultReporter;
import de.learnlib.alex.testing.services.reporters.TestResultReporter;

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
import java.util.List;

/** The resource for test reports. */
@Path("/projects/{project_id}/tests/reports")
@RolesAllowed({"REGISTERED"})
public class TestReportResource {

    /** The security context containing the user of the request. */
    @Context
    private SecurityContext securityContext;

    /** The test report DAO. */
    private TestReportDAO testReportDAO;

    /**
     * Constructor.
     *
     * @param testReportDAO {@link #testReportDAO}
     */
    @Inject
    public TestReportResource(TestReportDAO testReportDAO) {
        this.testReportDAO = testReportDAO;
    }

    /**
     * Get all test reports.
     *
     * @param projectId The id of the project.
     * @return All test reports.
     * @throws NotFoundException If the project could not be found.
     */
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response get(@PathParam("project_id") Long projectId) throws NotFoundException {
        final User user = ((UserPrincipal) securityContext.getUserPrincipal()).getUser();
        final List<TestReport> testReports = testReportDAO.get(user, projectId);
        return Response.ok(testReports).build();
    }

    /**
     * Get a test report by ids id.
     *
     * @param projectId The id of the project.
     * @param reportId  The id of the report in the project.
     * @return The report.
     * @throws NotFoundException If the project could not be found.
     */
    @GET
    @Path("/{report_id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response get(@PathParam("project_id") Long projectId, @PathParam("report_id") Long reportId,
                        @QueryParam("format") String format) throws NotFoundException {
        final User user = ((UserPrincipal) securityContext.getUserPrincipal()).getUser();

        final TestReport testReport = testReportDAO.get(user, projectId, reportId);

        if (format == null) {
            return Response.ok(testReport).build();
        } else {
            switch (format) {
                case "junit+xml":
                    final TestResultReporter<String> reporter = new JUnitTestResultReporter();
                    final String report = reporter.createReport(testReport);
                    return Response.status(Response.Status.OK)
                            .header("Content-Type", "application/xml")
                            .entity(report)
                            .build();
                default:
                    final Exception e = new ValidationException("format " + format + " does not exist");
                    return ResourceErrorHandler.createRESTErrorMessage("TestReportResource.get", Response.Status.BAD_REQUEST, e);
            }
        }
    }

    /**
     * Deletes a single test report.
     *
     * @param projectId The id of the project.
     * @param reportId  The id of the report to delete.
     * @return Status 204 - no content on success.
     * @throws NotFoundException If the project or the report could not be found.
     */
    @DELETE
    @Path("/{report_id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response delete(@PathParam("project_id") Long projectId, @PathParam("report_id") Long reportId) throws NotFoundException {
        final User user = ((UserPrincipal) securityContext.getUserPrincipal()).getUser();
        testReportDAO.delete(user, projectId, reportId);
        return Response.noContent().build();
    }

    /**
     * Deletes multiple test reports at once.
     *
     * @param projectId The id of the project.
     * @param reportIds The ids of the reports to delete.
     * @return Status 204 - no content on success.
     * @throws NotFoundException If the project or a report could not be found.
     */
    @DELETE
    @Path("/batch/{report_ids}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response delete(@PathParam("project_id") Long projectId, @PathParam("report_ids") IdsList reportIds) throws NotFoundException {
        final User user = ((UserPrincipal) securityContext.getUserPrincipal()).getUser();
        testReportDAO.delete(user, projectId, reportIds);
        return Response.noContent().build();
    }
}
