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

package de.learnlib.alex.data.rest;

import de.learnlib.alex.auth.entities.User;
import de.learnlib.alex.data.dao.ProjectDAO;
import de.learnlib.alex.data.entities.CreateProjectForm;
import de.learnlib.alex.data.entities.Project;
import de.learnlib.alex.data.entities.export.ExportableEntity;
import de.learnlib.alex.data.entities.export.ProjectExportableEntity;
import de.learnlib.alex.data.events.ProjectEvent;
import de.learnlib.alex.data.services.export.ProjectExporter;
import de.learnlib.alex.security.AuthContext;
import de.learnlib.alex.webhooks.services.WebhookService;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
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
@RequestMapping("/rest/projects")
public class ProjectResource {

    private static final Logger LOGGER = LogManager.getLogger();

    private final AuthContext authContext;
    private final ProjectDAO projectDAO;
    private final WebhookService webhookService;
    private final ProjectExporter projectExporter;

    @Autowired
    public ProjectResource(AuthContext authContext,
                           ProjectDAO projectDAO,
                           WebhookService webhookService,
                           ProjectExporter projectExporter) {
        this.authContext = authContext;
        this.projectDAO = projectDAO;
        this.webhookService = webhookService;
        this.projectExporter = projectExporter;
    }

    /**
     * Create a new Project.
     *
     * @param project
     *         The project to create.
     * @return On success the added project (enhanced with information from the DB); an error message on failure.
     */
    @PostMapping(
            consumes = MediaType.APPLICATION_JSON,
            produces = MediaType.APPLICATION_JSON
    )
    public ResponseEntity<Project> create(@RequestBody @Validated CreateProjectForm project) {
        final User user = authContext.getUser();
        LOGGER.traceEntry("create({}) for user {}.", project, user);

        final Project createdProject = projectDAO.create(user, project);
        webhookService.fireEvent(user, new ProjectEvent.Created(createdProject));
        LOGGER.traceExit(createdProject);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdProject);
    }

    /**
     * Get a list of all the projects owned by the user of the request.
     *
     * @return All projects in a list. This list can be empty.
     */
    @GetMapping(
            produces = MediaType.APPLICATION_JSON
    )
    public ResponseEntity<List<Project>> getAll() {
        final User user = authContext.getUser();
        LOGGER.traceEntry("getAll({}) for user {}.", user);

        final List<Project> projects = projectDAO.getAll(user);
        LOGGER.traceExit(projects);
        return ResponseEntity.ok(projects);
    }

    /**
     * Get a specific project.
     *
     * @param projectId
     *         The ID of the project.
     * @return The project or an error message.
     */
    @GetMapping(
            value = "/{projectId}",
            produces = MediaType.APPLICATION_JSON
    )
    public ResponseEntity<Project> get(@PathVariable("projectId") Long projectId) {
        final User user = authContext.getUser();
        LOGGER.traceEntry("get({}) for user {}.", projectId, user);

        final Project project = projectDAO.getByID(user, projectId);
        return ResponseEntity.ok(project);
    }

    /**
     * Update a specific project.
     *
     * @param projectId
     *         The ID of the project.
     * @param project
     *         The new values
     * @return On success the updated project (enhanced with information from the DB); an error message on failure.
     */
    @PutMapping(
            value = "/{projectId}",
            consumes = MediaType.APPLICATION_JSON,
            produces = MediaType.APPLICATION_JSON
    )
    public ResponseEntity<Project> update(@PathVariable("projectId") Long projectId, @RequestBody Project project) {
        final User user = authContext.getUser();
        LOGGER.traceEntry("update({}, {}) for user {}.", projectId, project, user);

        final Project updatedProject = projectDAO.update(user, projectId, project);
        webhookService.fireEvent(user, new ProjectEvent.Updated(updatedProject));
        LOGGER.traceExit(updatedProject);
        return ResponseEntity.ok(updatedProject);
    }

    /**
     * Delete a specific project.
     *
     * @param projectId
     *         The ID of the project.
     * @return On success no content will be returned; an error message on failure.
     */
    @DeleteMapping(
            value = "/{projectId}",
            produces = MediaType.APPLICATION_JSON
    )
    public ResponseEntity<?> delete(@PathVariable("projectId") Long projectId) {
        final User user = authContext.getUser();
        LOGGER.traceEntry("delete({}) for user {}.", projectId, user);

        projectDAO.delete(user, projectId);
        webhookService.fireEvent(user, new ProjectEvent.Deleted(projectId));
        LOGGER.traceExit("Project {} deleted", projectId);
        return ResponseEntity.noContent().build();
    }

    /**
     * Delete multiple projects at once.
     *
     * @param projectIds
     *         The IDs of the projects to delete.
     * @return 204 No content on success
     */
    @DeleteMapping(
            value = "/batch/{projectIds}",
            produces = MediaType.APPLICATION_JSON
    )
    public ResponseEntity<?> delete(@PathVariable("projectIds") List<Long> projectIds) {
        final User user = authContext.getUser();
        LOGGER.traceEntry("delete({}) for user {}.", projectIds, user);

        projectDAO.delete(user, projectIds);
        LOGGER.traceExit("Projects {} deleted", projectIds);
        return ResponseEntity.noContent().build();
    }

    /**
     * Export a project as JSON document.
     *
     * @param projectId
     *         The ID of the project to export.
     * @return The exported project.
     * @throws Exception
     *         If something goes wrong.
     */
    @PostMapping(
            value = "/{projectId}/export",
            produces = MediaType.APPLICATION_JSON
    )
    public ResponseEntity<ExportableEntity> exportProject(@PathVariable("projectId") Long projectId) throws Exception {
        final User user = authContext.getUser();
        final var export = projectExporter.export(user, projectId);
        return ResponseEntity.ok(export);
    }

    /**
     * Import a project, its symbols and tests.
     *
     * @param project
     *         The project to import
     * @return the imported project.
     */
    @PostMapping(
            value = "/import",
            consumes = MediaType.APPLICATION_JSON,
            produces = MediaType.APPLICATION_JSON
    )
    public ResponseEntity<Project> importProject(@RequestBody ProjectExportableEntity project) {
        final User user = authContext.getUser();
        final Project importedProject = projectDAO.importProject(user, project);
        webhookService.fireEvent(user, new ProjectEvent.Created(importedProject));
        return ResponseEntity.status(HttpStatus.CREATED).body(importedProject);
    }

    @PostMapping(
            value="/{projectId}/owners",
            consumes = MediaType.APPLICATION_JSON,
            produces = MediaType.APPLICATION_JSON
    )
    public ResponseEntity<Project> addOwners(@PathVariable("projectId") Long projectId, @RequestBody List<Long> ownerIds) {
        final User user = authContext.getUser();
        final Project updatedProject = projectDAO.addOwners(user, projectId, ownerIds);

        return ResponseEntity.ok(updatedProject);
    }

    @PostMapping(
            value="/{projectId}/members",
            consumes = MediaType.APPLICATION_JSON,
            produces = MediaType.APPLICATION_JSON
    )
    public ResponseEntity<Project> addMembers(@PathVariable("projectId") Long projectId, @RequestBody List<Long> memberIds) {
        final User user = authContext.getUser();
        final Project updatedProject = projectDAO.addMembers(user, projectId, memberIds);

        return ResponseEntity.ok(updatedProject);
    }

    @DeleteMapping(
            value="/{projectId}/owners/{ownerIds}",
            produces = MediaType.APPLICATION_JSON
    )
    public ResponseEntity<Project> removeOwner(@PathVariable("projectId") Long projectId, @PathVariable("ownerIds") List<Long> ownerIds) {
        final User user = authContext.getUser();
        final Project updatedProject = projectDAO.removeOwners(user, projectId, ownerIds);

        return ResponseEntity.ok(updatedProject);
    }

    @DeleteMapping(
            value="/{projectId}/members/{memberIds}",
            produces = MediaType.APPLICATION_JSON
    )
    public ResponseEntity<Project> removeMember(@PathVariable("projectId") Long projectId, @PathVariable("memberIds") List<Long> memberIds) {
        final User user = authContext.getUser();
        final Project updatedProject = projectDAO.removeMembers(user, projectId, memberIds);

        return ResponseEntity.ok(updatedProject);
    }
}
