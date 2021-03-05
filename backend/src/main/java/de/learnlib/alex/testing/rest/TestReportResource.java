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

package de.learnlib.alex.testing.rest;

import de.learnlib.alex.auth.entities.User;
import de.learnlib.alex.security.AuthContext;
import de.learnlib.alex.testing.dao.TestReportDAO;
import de.learnlib.alex.testing.entities.TestReport;
import de.learnlib.alex.testing.services.reporters.JUnitTestResultReporter;
import de.learnlib.alex.testing.services.reporters.TestResultReporter;
import java.util.List;
import javax.validation.ValidationException;
import javax.ws.rs.core.MediaType;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/** The resource for test reports. */
@RestController
@RequestMapping("/rest/projects/{projectId}/tests/reports")
public class TestReportResource {

    private static final Logger LOGGER = LogManager.getLogger();

    private final AuthContext authContext;
    private final TestReportDAO testReportDAO;

    @Autowired
    public TestReportResource(AuthContext authContext, TestReportDAO testReportDAO) {
        this.authContext = authContext;
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
    @GetMapping(
            produces = MediaType.APPLICATION_JSON
    )
    public ResponseEntity get(@PathVariable("projectId") Long projectId,
                              @RequestParam(name = "page", defaultValue = "1") int page,
                              @RequestParam(name = "size", defaultValue = "25") int size) {
        final User user = authContext.getUser();
        LOGGER.traceEntry("getAll({}) for user {}.", projectId, user);

        final PageRequest pr = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "startDate"));
        final Page<TestReport> testReports = testReportDAO.getAll(user, projectId, pr);

        LOGGER.traceExit(testReports.getContent());
        return ResponseEntity.ok(testReports);
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
    @GetMapping(
            value = "/{reportId}",
            produces = MediaType.APPLICATION_JSON
    )
    public ResponseEntity get(@PathVariable("projectId") Long projectId,
                              @PathVariable("reportId") Long reportId,
                              @RequestParam(name = "format", defaultValue = "") String format) {
        final User user = authContext.getUser();
        LOGGER.traceEntry("get({}, {}) for user {}.", projectId, reportId, user);

        final TestReport testReport = testReportDAO.get(user, projectId, reportId);

        switch (format) {
            case "":
                return ResponseEntity.ok(testReport);
            case "junit":
                final TestResultReporter<String> reporter = new JUnitTestResultReporter();
                final String report = reporter.createReport(testReport);

                LOGGER.traceExit(report);
                return ResponseEntity.status(HttpStatus.OK)
                        .header("Content-Type", "application/xml")
                        .body(report);
            default:
                final var e = new ValidationException("format " + format + " does not exist");
                LOGGER.traceExit(e);
                throw e;
        }
    }

    /**
     * Get the latest test report.
     *
     * @param projectId
     *         The id of the project.
     * @return 200 if a report is available, 204 otherwise.
     */
    @GetMapping(
            value = "/latest",
            produces = MediaType.APPLICATION_JSON
    )
    public ResponseEntity getLatest(@PathVariable("projectId") Long projectId) {
        final User user = authContext.getUser();
        LOGGER.traceEntry("getLatest({}) for user {}.", projectId, user);

        final TestReport latestReport = testReportDAO.getLatest(user, projectId);
        LOGGER.traceExit(latestReport);
        return latestReport == null ? ResponseEntity.noContent().build() : ResponseEntity.ok(latestReport);
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
    @DeleteMapping(
            value = "/{reportId}",
            produces = MediaType.APPLICATION_JSON
    )
    public ResponseEntity delete(@PathVariable("projectId") Long projectId,
                                 @PathVariable("reportId") Long reportId) {
        final User user = authContext.getUser();
        LOGGER.traceEntry("delete({}, {}) for user {}.", projectId, reportId, user);

        testReportDAO.delete(user, projectId, reportId);

        LOGGER.traceExit("Report {} deleted", reportId);
        return ResponseEntity.noContent().build();
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
    @DeleteMapping(
            value = "/batch/{reportIds}",
            produces = MediaType.APPLICATION_JSON
    )
    public ResponseEntity delete(@PathVariable("projectId") Long projectId,
                                 @PathVariable("reportIds") List<Long> reportIds) {
        final User user = authContext.getUser();
        LOGGER.traceEntry("delete({}, {}) for user {}.", projectId, reportIds, user);

        testReportDAO.delete(user, projectId, reportIds);

        LOGGER.traceExit("Reports {} deleted", reportIds);
        return ResponseEntity.noContent().build();
    }
}
