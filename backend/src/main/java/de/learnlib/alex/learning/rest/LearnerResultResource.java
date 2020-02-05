/*
 * Copyright 2015 - 2020 TU Dortmund
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

package de.learnlib.alex.learning.rest;

import de.learnlib.alex.auth.entities.User;
import de.learnlib.alex.learning.dao.LearnerResultDAO;
import de.learnlib.alex.learning.entities.LearnerResult;
import de.learnlib.alex.learning.entities.ModelExportFormat;
import de.learnlib.alex.learning.entities.TestSuiteGenerationConfig;
import de.learnlib.alex.learning.services.ModelExporter;
import de.learnlib.alex.learning.services.TestGenerator;
import de.learnlib.alex.security.AuthContext;
import de.learnlib.alex.testing.entities.TestSuite;
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
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.ws.rs.core.MediaType;
import java.io.IOException;
import java.util.List;

/**
 * REST API to fetch the test results.
 */
@RestController
@RequestMapping("/rest/projects/{projectId}/results")
public class LearnerResultResource {

    private static final Logger LOGGER = LogManager.getLogger();

    private AuthContext authContext;
    private LearnerResultDAO learnerResultDAO;
    private TestGenerator testGenerator;
    private ModelExporter modelExporter;

    @Autowired
    public LearnerResultResource(AuthContext authContext,
                                 LearnerResultDAO learnerResultDAO,
                                 TestGenerator testGenerator,
                                 ModelExporter modelExporter) {
        this.authContext = authContext;
        this.learnerResultDAO = learnerResultDAO;
        this.testGenerator = testGenerator;
        this.modelExporter = modelExporter;
    }

    /**
     * Get all learn results one project.
     *
     * @param projectId
     *         The project of the learn results.
     * @return A List of all learn results within one project.
     */
    @GetMapping(
            produces = MediaType.APPLICATION_JSON
    )
    public ResponseEntity getAll(@PathVariable("projectId") Long projectId,
                                 @RequestParam(name = "page", required = false) String page,
                                 @RequestParam(name = "size", required = false) String size) {
        final User user = authContext.getUser();
        LOGGER.trace("LearnerResultResource.getAllFinalResults(" + projectId + ") for user " + user + ".");

        if ((page == null && size != null) || (size == null && page != null)) {
            throw new IllegalArgumentException("'page' and 'size' params have to be used in combination.");
        }

        if (page == null) {
            final List<LearnerResult> results = learnerResultDAO.getAll(user, projectId);
            LOGGER.traceExit();
            return ResponseEntity.ok(results);
        } else {
            final PageRequest pr = PageRequest.of(
                    Integer.parseInt(page),
                    Integer.parseInt(size),
                    Sort.by(Sort.Direction.DESC, "testNo")
            );
            final Page<LearnerResult> resultPage = learnerResultDAO.getAll(user, projectId, pr);
            LOGGER.traceExit();
            return ResponseEntity.ok(resultPage);
        }
    }

    /**
     * Get the latest learner result.
     *
     * @param projectId
     *         The id of the project.
     * @return 200 with The latest learner result. 204 If there is not result.
     */
    @GetMapping(
            value = "/latest",
            produces = MediaType.APPLICATION_JSON
    )
    public ResponseEntity<LearnerResult> getLatest(@PathVariable("projectId") Long projectId) {
        final User user = authContext.getUser();
        LOGGER.trace("LearnerResultResource.getLatest(" + projectId + ") for user " + user + ".");

        final LearnerResult result = learnerResultDAO.getLatest(user, projectId);
        return result == null ? ResponseEntity.noContent().build() : ResponseEntity.ok(result);
    }

    /**
     * Get one / a list of learn result(s).
     *
     * @param projectId
     *         The project of the learn result(s).
     * @param testNos
     *         The number(s) of the learn result(s).
     * @return A List of all step of possible multiple test runs.
     */
    @GetMapping(
            value = "/{testNos}",
            produces = MediaType.APPLICATION_JSON
    )
    public ResponseEntity getAll(@PathVariable("projectId") Long projectId,
                                 @PathVariable("testNos") List<Long> testNos) {
        final User user = authContext.getUser();
        LOGGER.trace("LearnerResultResource.getAllSteps(" + projectId + ", " + testNos + ") for user " + user + ".");

        if (testNos.size() == 1) {
            final LearnerResult result = learnerResultDAO.get(user, projectId, testNos.get(0));
            LOGGER.traceExit();
            return ResponseEntity.ok(result);
        } else {
            final List<LearnerResult> results = learnerResultDAO.getAll(user, projectId, testNos);
            LOGGER.traceExit();
            return ResponseEntity.ok(results);
        }
    }

    /**
     * Clone a learner result.
     *
     * @param projectId
     *         The ID of the project.
     * @param testNo
     *         The test no of the learner result to clone.
     * @return The cloned learner result.
     */
    @PostMapping(
            value = "/{testNo}/copy",
            produces = MediaType.APPLICATION_JSON
    )
    public ResponseEntity<LearnerResult> copy(@PathVariable("projectId") Long projectId, @PathVariable("testNo") Long testNo) {
        final User user = authContext.getUser();
        LOGGER.traceEntry("LearnerResultResource.clone(" + projectId + ", " + testNo + ") for user " + user + ".");

        final LearnerResult clonedResult = learnerResultDAO.copy(user, projectId, testNo);
        LOGGER.traceExit();
        return ResponseEntity.status(HttpStatus.CREATED).body(clonedResult);
    }

    @PostMapping(
            value = "/{testNo}/steps/{stepNo}/export",
            produces = MediaType.TEXT_PLAIN
    )
    public ResponseEntity export(@PathVariable("projectId") Long projectId,
                                 @PathVariable("testNo") Long testNo,
                                 @PathVariable("stepNo") Long stepNo,
                                 @RequestParam(name = "format", defaultValue = "DOT") ModelExportFormat format) {
        final User user = authContext.getUser();

        switch (format) {
            case DOT:
                return ResponseEntity.ok(modelExporter.exportDot(user, projectId, testNo, stepNo));
            default:
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    /**
     * Generate a test suite from the discrimination tree.
     *
     * @param projectId
     *         The ID of the project.
     * @param testNo
     *         The number of the learning experiment.
     * @param config
     *         The configuration object.
     * @return The generated test suite.
     */
    @PostMapping(
            value = "/{testNo}/generateTestSuite",
            produces = MediaType.APPLICATION_JSON
    )
    public ResponseEntity generateTestSuite(@PathVariable("projectId") Long projectId,
                                            @PathVariable("testNo") Long testNo,
                                            @RequestBody TestSuiteGenerationConfig config) {
        User user = authContext.getUser();
        LOGGER.traceEntry("generateTestSuite(projectId: {}, testNo: {}, config: {}) for user {}", projectId, testNo, config, user);

        config.validate();
        try {
            final TestSuite testSuite = testGenerator.generate(user, projectId, testNo, config);
            LOGGER.traceExit("generateTestSuite() with status {}", HttpStatus.CREATED);
            return ResponseEntity.status(HttpStatus.CREATED).body(testSuite);
        } catch (IOException | ClassNotFoundException e) {
            LOGGER.traceExit("failed to generate test suite", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    /**
     * Delete one or more learn result(s).
     *
     * @param projectId
     *         The project of the learn results.
     * @param testNumbers
     *         The test numbers of the results to delete as a comma (',') separated list. E.g. 1,2,3
     * @return On success no content will be returned.
     */
    @DeleteMapping(
            value = "/{testNos}",
            produces = MediaType.APPLICATION_JSON
    )
    public ResponseEntity deleteResultSet(@PathVariable("projectId") Long projectId,
                                          @PathVariable("testNos") List<Long> testNumbers) {
        final User user = authContext.getUser();
        LOGGER.trace("LearnerResultResource.deleteResultSet(" + projectId + ", " + testNumbers + ") "
                + "for user " + user + ".");

        learnerResultDAO.deleteAll(user, projectId, testNumbers);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

}
