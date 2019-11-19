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
import de.learnlib.alex.security.AuthContext;
import de.learnlib.alex.testing.dao.TestExecutionConfigDAO;
import de.learnlib.alex.testing.entities.TestExecutionConfig;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.ws.rs.core.MediaType;
import java.util.List;

/** Endpoints for handling test configs. */
@RestController
@RequestMapping("/rest/projects/{projectId}/testConfigs")
public class TestExecutionConfigResource {

    private static final Logger LOGGER = LogManager.getLogger();

    private AuthContext authContext;
    private final TestExecutionConfigDAO testExecutionConfigDAO;

    @Autowired
    public TestExecutionConfigResource(AuthContext authContext, TestExecutionConfigDAO testExecutionConfigDAO) {
        this.authContext = authContext;
        this.testExecutionConfigDAO = testExecutionConfigDAO;
    }

    /**
     * Get all test configs in a project.
     *
     * @param projectId
     *         The id of the project.
     * @return 200 and the created project on success.
     */
    @GetMapping(
            produces = MediaType.APPLICATION_JSON
    )
    public ResponseEntity getAll(@PathVariable("projectId") Long projectId) {
        final User user = authContext.getUser();
        LOGGER.traceEntry("getAll({}) for user {}.", projectId, user);

        final List<TestExecutionConfig> configs = testExecutionConfigDAO.getAll(user, projectId);

        LOGGER.traceExit(configs);
        return ResponseEntity.ok(configs);
    }

    /**
     * Create a test config.
     *
     * @param projectId
     *         The id of the project.
     * @param config
     *         The config to create
     * @return 201 and the created test config on success.
     */
    @PostMapping(
            consumes = MediaType.APPLICATION_JSON,
            produces = MediaType.APPLICATION_JSON
    )
    
    public ResponseEntity create(@PathVariable("projectId") Long projectId, @RequestBody TestExecutionConfig config) {
        final User user = authContext.getUser();
        LOGGER.traceEntry("create({}) for user {}.", projectId, user);

        final TestExecutionConfig createdConfig = testExecutionConfigDAO.create(user, projectId, config);

        LOGGER.traceExit(createdConfig);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdConfig);
    }

    @PutMapping(
            value = "/{configId}",
            consumes = MediaType.APPLICATION_JSON,
            produces = MediaType.APPLICATION_JSON
    )
    public ResponseEntity update(@PathVariable("projectId") Long projectId,
                                 @PathVariable("configId") Long configId,
                                 @RequestBody TestExecutionConfig config) {
        final User user = authContext.getUser();
        LOGGER.traceEntry("update({}) for user {}.", projectId, user);

        final TestExecutionConfig updatedConfig = testExecutionConfigDAO.update(user, projectId, configId, config);

        LOGGER.traceExit(updatedConfig);
        return ResponseEntity.status(HttpStatus.OK).body(updatedConfig);
    }

    /**
     * Delete a test config.
     *
     * @param projectId
     *         The id of the project.
     * @param configId
     *         The id of the test config to delete.
     * @return 204 on success.
     */
    @DeleteMapping(
            value = "/{configId}",
            produces = MediaType.APPLICATION_JSON
    )
    public ResponseEntity delete(@PathVariable("projectId") Long projectId,
                                 @PathVariable("configId") Long configId) {
        final User user = authContext.getUser();
        LOGGER.traceEntry("delete({}) for user {}.", projectId, user);

        testExecutionConfigDAO.delete(user, projectId, configId);

        LOGGER.traceExit("Config with id " + configId + " deleted.");
        return ResponseEntity.noContent().build();
    }
}
