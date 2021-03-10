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
import de.learnlib.alex.testing.dao.TestResultDAO;
import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.IOException;
import javax.ws.rs.InternalServerErrorException;
import javax.ws.rs.core.HttpHeaders;
import javax.ws.rs.core.MediaType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/rest/projects/{projectId}/tests/reports/{reportId}/results")
public class TestResultResource {

    /** The security context containing the user of the request. */
    private final AuthContext authContext;
    private final TestReportDAO testReportDAO;
    private final TestResultDAO testResultDAO;

    @Autowired
    public TestResultResource(AuthContext authContext,
                              TestReportDAO testReportDAO,
                              TestResultDAO testResultDAO) {
        this.authContext = authContext;
        this.testReportDAO = testReportDAO;
        this.testResultDAO = testResultDAO;
    }

    /**
     * Get a test result by ids id.
     *
     * @param projectId
     *         The id of the project.
     * @param resultId
     *         The id of the report in the project.
     * @return The result.
     */
    @GetMapping(
            value = "/{resultId}",
            produces = MediaType.APPLICATION_JSON
    )
    public ResponseEntity get(@PathVariable("projectId") Long projectId,
                              @PathVariable("reportId") Long reportId,
                              @PathVariable("resultId") Long resultId) {
        final User user = authContext.getUser();
        final var result = testResultDAO.getByID(user, projectId, reportId, resultId);
        return ResponseEntity.ok(result);
    }

    @GetMapping(
            value = "/{resultId}/screenshots/{screenshotName}"
    )
    public ResponseEntity<Resource> getScreenshot(@PathVariable("projectId") Long projectId,
                                                  @PathVariable("reportId") Long reportId,
                                                  @PathVariable("screenshotName") String screenshotName) {
        final User user = authContext.getUser();

        final File screenshot = testReportDAO.getScreenshot(user, projectId, reportId, screenshotName);

        final Resource resource = new FileSystemResource(screenshot);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + screenshot.getName() + "\"")
                .body(resource);
    }

    @GetMapping(
            value = "/{resultId}/screenshots/batch"
    )
    public ResponseEntity<?> getAllScreenshots(@PathVariable("projectId") Long projectId,
                                               @PathVariable("reportId") Long reportId,
                                               @PathVariable("resultId") Long resultId) {
        final User user = authContext.getUser();

        try {
            final ByteArrayInputStream is = new ByteArrayInputStream(testReportDAO.getScreenshotsAsZip(user, projectId, reportId, resultId));
            final Resource resource = new InputStreamResource(is);
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"screenshots.zip\"")
                    .body(resource);
        } catch (IOException e) {
            throw new InternalServerErrorException("There was a problem generation the zip file.");
        }
    }
}
