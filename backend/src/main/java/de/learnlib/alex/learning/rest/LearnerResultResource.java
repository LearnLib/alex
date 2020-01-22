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
import de.learnlib.alex.common.utils.ResourceErrorHandler;
import de.learnlib.alex.learning.dao.LearnerResultDAO;
import de.learnlib.alex.learning.entities.LearnerResult;
import de.learnlib.alex.learning.entities.ModelExportFormat;
import de.learnlib.alex.learning.entities.TestSuiteGenerationConfig;
import de.learnlib.alex.learning.services.LearnerService;
import de.learnlib.alex.learning.services.ModelExporter;
import de.learnlib.alex.learning.services.TestGenerator;
import de.learnlib.alex.security.AuthContext;
import de.learnlib.alex.testing.entities.TestSuite;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
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

    /** The security context containing the user of the request. */
    private AuthContext authContext;

    /** The {@link LearnerResultDAO} to use. */
    private LearnerResultDAO learnerResultDAO;

    /** The Learner to check if a result is not active before deletion. */
    private LearnerService learnerService;

    /** The test generator service. */
    private TestGenerator testGenerator;
    private ModelExporter modelExporter;

    @Autowired
    public LearnerResultResource(AuthContext authContext,
                                 LearnerResultDAO learnerResultDAO,
                                 LearnerService learnerService,
                                 TestGenerator testGenerator,
                                 ModelExporter modelExporter) {
        this.authContext = authContext;
        this.learnerResultDAO = learnerResultDAO;
        this.learnerService = learnerService;
        this.testGenerator = testGenerator;
        this.modelExporter = modelExporter;
    }

    /**
     * Get all learn results one project.
     *
     * @param projectId
     *         The project of the learn results.
     * @param embed
     *         By default no steps are included in the ResponseEntity. However you can ask to include them with this parameter
     *         set to 'steps'.
     * @return A List of all learn results within one project.
     */
    @GetMapping(
            produces = MediaType.APPLICATION_JSON
    )
    public ResponseEntity getAll(@PathVariable("projectId") Long projectId,
                                 @RequestParam(name = "embed", defaultValue = "") String embed) {
        User user = authContext.getUser();
        LOGGER.trace("LearnerResultResource.getAllFinalResults(" + projectId + ") for user " + user + ".");

        try {
            boolean includeSteps = parseEmbeddableFields(embed);

            List<LearnerResult> results = learnerResultDAO.getAll(user, projectId, includeSteps);
            return ResponseEntity.ok(results);
        } catch (IllegalArgumentException e) {
            LOGGER.traceExit(e);
            return ResourceErrorHandler.createRESTErrorMessage("LearnerResultResource.getAllSteps",
                    HttpStatus.BAD_REQUEST, e);
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
    public ResponseEntity getLatest(@PathVariable("projectId") Long projectId) {
        User user = authContext.getUser();
        LOGGER.trace("LearnerResultResource.getLatest(" + projectId + ") for user " + user + ".");

        try {
            final LearnerResult result = learnerResultDAO.getLatest(user, projectId);
            return result == null ? ResponseEntity.noContent().build() : ResponseEntity.ok(result);
        } catch (IllegalArgumentException e) {
            LOGGER.traceExit(e);
            return ResourceErrorHandler.createRESTErrorMessage("LearnerResultResource.getLatest",
                    HttpStatus.NOT_FOUND, e);
        }
    }

    /**
     * Get one / a list of learn result(s).
     *
     * @param projectId
     *         The project of the learn result(s).
     * @param testNos
     *         The number(s) of the learn result(s).
     * @param embed
     *         By default no steps are included in the ResponseEntity. However you can ask to include them with this parameter
     *         set to 'steps'.
     * @return A List of all step of possible multiple test runs.
     */
    @GetMapping(
            value = "/{testNos}",
            produces = MediaType.APPLICATION_JSON
    )
    public ResponseEntity getAll(@PathVariable("projectId") Long projectId,
                                 @PathVariable("testNos") List<Long> testNos,
                                 @RequestParam(name = "embed", defaultValue = "") String embed) {
        User user = authContext.getUser();
        LOGGER.trace("LearnerResultResource.getAllSteps(" + projectId + ", " + testNos + ") for user " + user + ".");

        try {
            boolean includeSteps = parseEmbeddableFields(embed);

            if (testNos.size() == 1) {
                LearnerResult result = learnerResultDAO.get(user, projectId, testNos.get(0), includeSteps);
                return ResponseEntity.ok(result);
            } else {
                List<LearnerResult> results = learnerResultDAO.getAll(user, projectId, testNos, includeSteps);
                return ResponseEntity.ok(results);
            }
        } catch (IllegalArgumentException e) {
            LOGGER.traceExit(e);
            return ResourceErrorHandler.createRESTErrorMessage("LearnerResultResource.getAllSteps",
                    HttpStatus.BAD_REQUEST, e);
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
            value = "/{testNo}/clone",
            produces = MediaType.APPLICATION_JSON
    )
    public ResponseEntity clone(@PathVariable("projectId") Long projectId, @PathVariable("testNo") Long testNo) {
        User user = authContext.getUser();
        LOGGER.traceEntry("LearnerResultResource.clone(" + projectId + ", " + testNo + ") for user " + user + ".");

        try {
            final LearnerResult clonedResult = learnerResultDAO.clone(user, projectId, testNo);
            return ResponseEntity.status(HttpStatus.CREATED).body(clonedResult);
        } catch (IllegalArgumentException e) {
            LOGGER.traceExit(e);
            return ResourceErrorHandler.createRESTErrorMessage("LearnerResultResource.clone",
                    HttpStatus.BAD_REQUEST, e);
        }
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
        User user = authContext.getUser();
        LOGGER.trace("LearnerResultResource.deleteResultSet(" + projectId + ", " + testNumbers + ") "
                + "for user " + user + ".");

        learnerResultDAO.delete(learnerService, projectId, testNumbers);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

    private boolean parseEmbeddableFields(String embed) throws IllegalArgumentException {
        if (embed == null || embed.isEmpty()) {
            return false;
        } else if (embed.toLowerCase().equals("steps")) {
            return true;
        } else {
            throw new IllegalArgumentException("Could not parse the embed value '" + embed + "'.");
        }
    }

}
