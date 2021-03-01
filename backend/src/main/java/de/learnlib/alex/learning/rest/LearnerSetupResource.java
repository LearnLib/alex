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

package de.learnlib.alex.learning.rest;

import de.learnlib.alex.auth.entities.User;
import de.learnlib.alex.data.dao.ProjectDAO;
import de.learnlib.alex.data.entities.Project;
import de.learnlib.alex.learning.dao.LearnerSetupDAO;
import de.learnlib.alex.learning.entities.LearnerOptions;
import de.learnlib.alex.learning.entities.LearnerResult;
import de.learnlib.alex.learning.entities.LearnerSetup;
import de.learnlib.alex.learning.entities.LearnerStartConfiguration;
import de.learnlib.alex.learning.services.LearnerService;
import de.learnlib.alex.security.AuthContext;
import java.util.List;
import java.util.stream.Collectors;
import javax.ws.rs.core.MediaType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/rest/projects/{projectId}/learner/setups")
@Transactional(rollbackFor = Exception.class)
public class LearnerSetupResource {

    private final AuthContext authContext;
    private final LearnerSetupDAO learnerSetupDAO;
    private final LearnerService learnerService;
    private final ProjectDAO projectDAO;

    @Autowired
    public LearnerSetupResource(AuthContext authContext,
                                LearnerSetupDAO learnerSetupDAO,
                                ProjectDAO projectDAO,
                                LearnerService learnerService) {
        this.authContext = authContext;
        this.learnerSetupDAO = learnerSetupDAO;
        this.projectDAO = projectDAO;
        this.learnerService = learnerService;
    }

    @GetMapping(
            produces = MediaType.APPLICATION_JSON
    )
    public ResponseEntity<List<LearnerSetup>> getAll(@PathVariable("projectId") Long projectId) {
        final User user = authContext.getUser();
        final List<LearnerSetup> setups = learnerSetupDAO.getAll(user, projectId).stream()
                .filter(LearnerSetup::isSaved)
                .collect(Collectors.toList());
        return ResponseEntity.ok(setups);
    }

    @GetMapping(
            value = "/{setupId}",
            produces = MediaType.APPLICATION_JSON
    )
    public ResponseEntity<LearnerSetup> getById(@PathVariable("projectId") Long projectId,
                                                @PathVariable("setupId") Long setupId) {
        final User user = authContext.getUser();
        final LearnerSetup setup = learnerSetupDAO.getById(user, projectId, setupId);
        return ResponseEntity.ok(setup);
    }

    @PostMapping(
            consumes = MediaType.APPLICATION_JSON,
            produces = MediaType.APPLICATION_JSON
    )
    public ResponseEntity<LearnerSetup> create(@PathVariable("projectId") Long projectId,
                                               @RequestBody @Validated LearnerSetup learnerSetup) {
        final User user = authContext.getUser();
        learnerSetup.setSaved(true);
        final LearnerSetup createdSetup = learnerSetupDAO.create(user, projectId, learnerSetup);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdSetup);
    }

    @PutMapping(
            value = "/{setupId}",
            consumes = MediaType.APPLICATION_JSON,
            produces = MediaType.APPLICATION_JSON
    )
    public ResponseEntity<LearnerSetup> update(@PathVariable("projectId") Long projectId,
                                               @PathVariable("setupId") Long setupId,
                                               @RequestBody LearnerSetup learnerSetup) {
        final User user = authContext.getUser();
        final LearnerSetup updatedSetup = learnerSetupDAO.update(user, projectId, setupId, learnerSetup);
        return ResponseEntity.ok(updatedSetup);
    }

    @PostMapping(
            value = "/{setupId}/copy",
            consumes = MediaType.APPLICATION_JSON,
            produces = MediaType.APPLICATION_JSON
    )
    public ResponseEntity<LearnerSetup> copy(@PathVariable("projectId") Long projectId,
                                             @PathVariable("setupId") Long setupId) {
        final User user = authContext.getUser();
        final LearnerSetup copiedSetup = learnerSetupDAO.copy(user, projectId, setupId, true);
        return ResponseEntity.ok(copiedSetup);
    }

    @DeleteMapping(
            value = "/{setupId}",
            produces = MediaType.APPLICATION_JSON
    )
    public ResponseEntity<String> delete(@PathVariable("projectId") Long projectId,
                                         @PathVariable("setupId") Long setupId) {
        final User user = authContext.getUser();
        learnerSetupDAO.delete(user, projectId, setupId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping(
            value = "/{setupId}/run",
            produces = MediaType.APPLICATION_JSON
    )
    public ResponseEntity<LearnerResult> run(@PathVariable("projectId") Long projectId,
                                             @PathVariable("setupId") Long setupId,
                                             @RequestBody(required = false) LearnerOptions options) {
        final User user = authContext.getUser();
        final Project project = projectDAO.getByID(user, projectId);
        final LearnerSetup setup = learnerSetupDAO.copy(user, projectId, setupId, false);

        final LearnerStartConfiguration startConfiguration = new LearnerStartConfiguration();
        startConfiguration.setOptions(options);
        startConfiguration.setSetup(setup);

        final LearnerResult result = learnerService.start(user, project, startConfiguration);
        return ResponseEntity.ok(result);
    }
}
