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
import de.learnlib.alex.testing.dao.TestExecutionConfigDAO;
import de.learnlib.alex.testing.entities.TestExecutionConfig;
import java.util.List;
import javax.ws.rs.core.MediaType;

import de.learnlib.alex.testing.entities.TestQueueItem;
import de.learnlib.alex.testing.services.TestService;
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

/** Endpoints for handling test configs. */
@RestController
@RequestMapping("/rest/projects/{projectId}/testConfigs")
public class TestExecutionConfigResource {

    private final AuthContext authContext;
    private final TestExecutionConfigDAO testExecutionConfigDAO;
    private final TestService testService;


    @Autowired
    public TestExecutionConfigResource(AuthContext authContext,
                                       TestExecutionConfigDAO testExecutionConfigDAO,
                                       TestService testService) {
        this.authContext = authContext;
        this.testExecutionConfigDAO = testExecutionConfigDAO;
        this.testService = testService;
    }

    @GetMapping(
            value = "/{configId}",
            produces = MediaType.APPLICATION_JSON
    )
    public ResponseEntity<TestExecutionConfig> get(@PathVariable("projectId") Long projectId,
                                                   @PathVariable("configId") Long configId) {
        final var user = authContext.getUser();
        final var config = testExecutionConfigDAO.get(user, projectId, configId);
        return ResponseEntity.ok(config);
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
    public ResponseEntity<List<TestExecutionConfig>> getAll(@PathVariable("projectId") Long projectId) {
        final var user = authContext.getUser();
        final var configs = testExecutionConfigDAO.getAll(user, projectId);
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

    public ResponseEntity<TestExecutionConfig> create(
            @PathVariable("projectId") Long projectId,
            @RequestBody TestExecutionConfig config
    ) {
        final var user = authContext.getUser();
        final var createdConfig = testExecutionConfigDAO.create(user, projectId, config);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdConfig);
    }

    /**
     * Update a test configuration
     *
     * @param projectId
     *         The ID of the project.
     * @param configId
     *         The ID of the config to update.
     * @param config
     *         The updated config object.
     * @return The updated config object.
     */
    @PutMapping(
            value = "/{configId}",
            consumes = MediaType.APPLICATION_JSON,
            produces = MediaType.APPLICATION_JSON
    )
    public ResponseEntity<TestExecutionConfig> update(
            @PathVariable("projectId") Long projectId,
            @PathVariable("configId") Long configId,
            @RequestBody TestExecutionConfig config
    ) {
        final var user = authContext.getUser();
        final var updatedConfig = testExecutionConfigDAO.update(user, projectId, configId, config);
        return ResponseEntity.status(HttpStatus.OK).body(updatedConfig);
    }

    @PostMapping(
            value = "/{configId}/copy",
            consumes = MediaType.APPLICATION_JSON,
            produces = MediaType.APPLICATION_JSON
    )
    public ResponseEntity<TestExecutionConfig> copy(@PathVariable("projectId") Long projectId,
                                                    @PathVariable("configId") Long configId) {
        final User user = authContext.getUser();
        final TestExecutionConfig copiedConfig = testExecutionConfigDAO.copy(user, projectId, configId);
        return ResponseEntity.ok(copiedConfig);
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
    public ResponseEntity<?> delete(@PathVariable("projectId") Long projectId,
                                    @PathVariable("configId") Long configId) {
        final var user = authContext.getUser();
        testExecutionConfigDAO.delete(user, projectId, configId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping(
            value = "/{configId}/run",
            produces = MediaType.APPLICATION_JSON
    )
    public ResponseEntity<TestQueueItem> run(@PathVariable("projectId") Long projectId,
                                             @PathVariable("configId") Long configId) {
        final var user = authContext.getUser();
        final var config = this.testExecutionConfigDAO.get(user, projectId, configId);
        final var testRun = testService.start(user, projectId, config);
        return ResponseEntity.ok(testRun);
    }
}
