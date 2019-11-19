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

package de.learnlib.alex.data.rest;

import de.learnlib.alex.auth.entities.User;
import de.learnlib.alex.data.dao.ProjectEnvironmentDAO;
import de.learnlib.alex.data.entities.ProjectEnvironment;
import de.learnlib.alex.data.entities.ProjectEnvironmentVariable;
import de.learnlib.alex.data.entities.ProjectUrl;
import de.learnlib.alex.security.AuthContext;
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

@RestController
@RequestMapping("/rest/projects/{projectId}/environments")
public class ProjectEnvironmentResource {

    private static final Logger LOGGER = LogManager.getLogger();

    private AuthContext authContext;

    private ProjectEnvironmentDAO environmentDAO;

    @Autowired
    public ProjectEnvironmentResource(AuthContext authContext, ProjectEnvironmentDAO environmentDAO) {
        this.authContext = authContext;
        this.environmentDAO = environmentDAO;
    }

    @GetMapping(
            produces = MediaType.APPLICATION_JSON
    )
    public ResponseEntity getAll(@PathVariable("projectId") Long projectId) {
        final User user = authContext.getUser();
        LOGGER.traceEntry("enter getAll(projectId: {}) for user {}.", projectId, user);

        final List<ProjectEnvironment> envs = environmentDAO.getAll(user, projectId);

        LOGGER.traceEntry("leave getAll(projectId: {}) for user {}.", projectId, user);
        return ResponseEntity.ok(envs);
    }

    @PostMapping(
            produces = MediaType.APPLICATION_JSON,
            consumes = MediaType.APPLICATION_JSON
    )
    public ResponseEntity create(@PathVariable("projectId") Long projectId, @RequestBody ProjectEnvironment env) {
        final User user = authContext.getUser();
        final ProjectEnvironment createdEnv = environmentDAO.create(user, projectId, env);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdEnv);
    }

    @DeleteMapping(
            value = "/{environmentId}"
    )
    public ResponseEntity delete(@PathVariable("projectId") Long projectId, @PathVariable("environmentId") Long environmentId) {
        final User user = authContext.getUser();
        environmentDAO.delete(user, projectId, environmentId);
        return ResponseEntity.noContent().build();
    }

    @PutMapping(
            value = "/{environmentId}",
            produces = MediaType.APPLICATION_JSON,
            consumes = MediaType.APPLICATION_JSON
    )
    public ResponseEntity update(@PathVariable("projectId") Long projectId,
                                 @PathVariable("environmentId") Long environmentId,
                                 @RequestBody ProjectEnvironment environment) {
        final User user = authContext.getUser();
        final ProjectEnvironment updatedEnv = environmentDAO.update(user, projectId, environmentId, environment);
        return ResponseEntity.ok(updatedEnv);
    }

    @PostMapping(
            value = "/{environmentId}/urls",
            produces = MediaType.APPLICATION_JSON,
            consumes = MediaType.APPLICATION_JSON
    )
    public ResponseEntity createUrl(@PathVariable("projectId") Long projectId,
                                    @PathVariable("environmentId") Long environmentId,
                                    @RequestBody ProjectUrl url) {
        final User user = authContext.getUser();
        final List<ProjectUrl> createdUrls = environmentDAO.createUrls(user, projectId, environmentId, url);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdUrls);
    }

    @DeleteMapping(
            value = "/{environmentId}/urls/{urlId}"
    )
    public ResponseEntity deleteUrl(@PathVariable("projectId") Long projectId,
                                    @PathVariable("environmentId") Long environmentId,
                                    @PathVariable("urlId") Long urlId) {
        final User user = authContext.getUser();
        environmentDAO.deleteUrl(user, projectId, environmentId, urlId);
        return ResponseEntity.noContent().build();
    }

    @PutMapping(
            value = "/{environmentId}/urls/{urlId}",
            produces = MediaType.APPLICATION_JSON,
            consumes = MediaType.APPLICATION_JSON
    )
    public ResponseEntity updateUrl(@PathVariable("projectId") Long projectId,
                                    @PathVariable("environmentId") Long environmentId,
                                    @PathVariable("urlId") Long urlId,
                                    @RequestBody ProjectUrl url) {
        final User user = authContext.getUser();
        final List<ProjectUrl> updatedUrls = environmentDAO.updateUrls(user, projectId, environmentId, urlId, url);
        return ResponseEntity.ok(updatedUrls);
    }

    @PostMapping(
            value = "/{environmentId}/variables",
            produces = MediaType.APPLICATION_JSON,
            consumes = MediaType.APPLICATION_JSON
    )
    public ResponseEntity createVariable(@PathVariable("projectId") Long projectId,
                                         @PathVariable("environmentId") Long environmentId,
                                         @RequestBody ProjectEnvironmentVariable variable) {
        final User user = authContext.getUser();
        final ProjectEnvironmentVariable createdVariable = environmentDAO.createVariable(user, projectId, environmentId, variable);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdVariable);
    }

    @DeleteMapping(
            value = "/{environmentId}/variables/{varId}"
    )
    public ResponseEntity deleteVariable(@PathVariable("projectId") Long projectId,
                                         @PathVariable("environmentId") Long environmentId,
                                         @PathVariable("varId") Long varId) {
        final User user = authContext.getUser();
        environmentDAO.deleteVariable(user, projectId, environmentId, varId);
        return ResponseEntity.noContent().build();
    }

    @PutMapping(
            value = "/{environmentId}/variables/{varId}",
            produces = MediaType.APPLICATION_JSON,
            consumes = MediaType.APPLICATION_JSON
    )
    public ResponseEntity updateUrl(@PathVariable("projectId") Long projectId,
                                    @PathVariable("environmentId") Long environmentId,
                                    @PathVariable("varId") Long varId,
                                    @RequestBody ProjectEnvironmentVariable variable) {
        final User user = authContext.getUser();
        final ProjectEnvironmentVariable updatedVariable = environmentDAO.updateVariable(user, projectId, environmentId, varId, variable);
        return ResponseEntity.ok(updatedVariable);
    }
}
