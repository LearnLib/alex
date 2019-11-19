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
import de.learnlib.alex.common.utils.ResourceErrorHandler;
import de.learnlib.alex.data.dao.SymbolGroupDAO;
import de.learnlib.alex.data.entities.SymbolGroup;
import de.learnlib.alex.data.events.SymbolGroupEvent;
import de.learnlib.alex.security.AuthContext;
import de.learnlib.alex.webhooks.services.WebhookService;
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

/**
 * REST API to manage groups.
 */
@RestController
@RequestMapping("/rest/projects/{projectId}/groups")
public class SymbolGroupResource {

    private static final Logger LOGGER = LogManager.getLogger();

    private AuthContext authContext;
    private final SymbolGroupDAO symbolGroupDAO;
    private final WebhookService webhookService;

    @Autowired
    public SymbolGroupResource(AuthContext authContext,
                               SymbolGroupDAO symbolGroupDAO,
                               WebhookService webhookService) {
        this.authContext = authContext;
        this.symbolGroupDAO = symbolGroupDAO;
        this.webhookService = webhookService;
    }

    /**
     * Create a new group.
     *
     * @param projectId
     *         The ID of the project.
     * @param group
     *         The group to create.
     * @return On success the added group (enhanced with information from the DB); an error message on failure.
     */
    @PostMapping(
            consumes = MediaType.APPLICATION_JSON,
            produces = MediaType.APPLICATION_JSON
    )
    public ResponseEntity createGroup(@PathVariable("projectId") Long projectId,
                                      @RequestBody SymbolGroup group) {
        final User user = authContext.getUser();
        LOGGER.traceEntry("createGroup({}, {}) for user {}.", projectId, group, user);

        group.setProjectId(projectId);
        symbolGroupDAO.create(user, group);

        LOGGER.traceExit(group);

        webhookService.fireEvent(user, new SymbolGroupEvent.Created(group));
        return ResponseEntity.status(HttpStatus.CREATED).body(group);
    }

    /**
     * Create multiple symbol groups including symbols at once.
     *
     * @param projectId
     *         The ID of the project.
     * @param groups
     *         The groups to create.
     * @return The created groups.
     */
    @PostMapping(
            value = "/batch",
            consumes = MediaType.APPLICATION_JSON,
            produces = MediaType.APPLICATION_JSON
    )
    public ResponseEntity createGroups(@PathVariable("projectId") Long projectId,
                                       @RequestBody List<SymbolGroup> groups) {
        final User user = authContext.getUser();
        LOGGER.traceEntry("createGroups({}, {}) for user {}.", projectId, groups, user);

        final List<SymbolGroup> createdGroups = symbolGroupDAO.create(user, projectId, groups);
        webhookService.fireEvent(user, new SymbolGroupEvent.CreatedMany(createdGroups));
        LOGGER.traceExit(createdGroups);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdGroups);
    }

    @PostMapping(
            value = "/import",
            consumes = MediaType.APPLICATION_JSON,
            produces = MediaType.APPLICATION_JSON
    )
    public ResponseEntity importGroups(@PathVariable("projectId") Long projectId,
                                       @RequestBody List<SymbolGroup> groups) {
        final User user = authContext.getUser();
        LOGGER.traceEntry("importGroups({}, {}) for user {}.", projectId, groups, user);

        final List<SymbolGroup> importedGroups = symbolGroupDAO.importGroups(user, projectId, groups);
        webhookService.fireEvent(user, new SymbolGroupEvent.CreatedMany(importedGroups));
        LOGGER.traceExit(importedGroups);
        return ResponseEntity.status(HttpStatus.CREATED).body(importedGroups);
    }

    /**
     * Get a list of all groups within on projects.
     *
     * @param projectId
     *         The ID of the project.
     * @return All groups in a list. If the project contains no groups the list will be empty.
     */
    @GetMapping(
            produces = MediaType.APPLICATION_JSON
    )
    public ResponseEntity getAll(@PathVariable("projectId") Long projectId) {
        final User user = authContext.getUser();
        LOGGER.traceEntry("getAll({}) for user {}.", projectId, user);

        final List<SymbolGroup> groups = symbolGroupDAO.getAll(user, projectId);

        LOGGER.traceExit(groups);
        return ResponseEntity.ok(groups);
    }

    /**
     * Get a one group.
     *
     * @param projectId
     *         The ID of the project.
     * @param groupId
     *         The ID of the group within the project.
     * @return The requested group.
     */
    @GetMapping(
            value = "/{groupId}",
            produces = MediaType.APPLICATION_JSON
    )
    public ResponseEntity get(@PathVariable("projectId") Long projectId, @PathVariable("groupId") Long groupId) {
        final User user = authContext.getUser();
        LOGGER.traceEntry("get({}, {}) for user {}.", projectId, groupId, user);

        final SymbolGroup group = symbolGroupDAO.get(user, projectId, groupId);

        LOGGER.traceExit(group);
        return ResponseEntity.ok(group);
    }

    /**
     * Update a group.
     *
     * @param projectId
     *         The ID of the project.
     * @param groupId
     *         The ID of the group within the project.
     * @param group
     *         The new values
     * @return On success the updated group (enhanced with information from the DB).
     */
    @PutMapping(
            value = "/{groupId}",
            consumes = MediaType.APPLICATION_JSON,
            produces = MediaType.APPLICATION_JSON
    )
    public ResponseEntity update(@PathVariable("projectId") Long projectId,
                                 @PathVariable("groupId") Long groupId,
                                 @RequestBody SymbolGroup group) {
        User user = authContext.getUser();
        LOGGER.traceEntry("update({}, {}, {}) for user {}.", projectId, groupId, group, user);

        symbolGroupDAO.update(user, group);

        LOGGER.traceExit(group);
        webhookService.fireEvent(user, new SymbolGroupEvent.Updated(group));
        return ResponseEntity.ok(group);
    }

    /**
     * Moves a group to another group.
     *
     * @param projectId
     *         The id of the project.
     * @param groupId
     *         The id of the group to move.
     * @param group
     *         The group to move with the updated {@link SymbolGroup#getParent()} property. The parent property may be null
     *         to indicate that the group is moved to the upmost level.
     * @return 200 with the updated group.
     */
    @PutMapping(
            value = "/{groupId}/move",
            consumes = MediaType.APPLICATION_JSON,
            produces = MediaType.APPLICATION_JSON
    )
    public ResponseEntity move(@PathVariable("projectId") Long projectId,
                               @PathVariable("groupId") Long groupId,
                               @RequestBody SymbolGroup group) {
        User user = authContext.getUser();
        LOGGER.traceEntry("move({}, {}, {}) for user {}.", projectId, groupId, group, user);

        final SymbolGroup movedGroup = symbolGroupDAO.move(user, group);

        LOGGER.traceExit(movedGroup);
        webhookService.fireEvent(user, new SymbolGroupEvent.Moved(movedGroup));
        return ResponseEntity.ok(movedGroup);
    }

    /**
     * Delete a group.
     *
     * @param projectId
     *         The ID of the project.
     * @param groupId
     *         The ID of the group within the project.
     * @return On success no content will be returned.
     */
    @DeleteMapping(
            value = "/{groupId}"
    )
    public ResponseEntity delete(@PathVariable("projectId") Long projectId, @PathVariable("groupId") Long groupId) {
        User user = authContext.getUser();
        LOGGER.traceEntry("delete({}, {}) for user {}.", projectId, groupId, user);

        try {
            symbolGroupDAO.delete(user, projectId, groupId);
            LOGGER.traceExit("Group {} deleted.", groupId);
            webhookService.fireEvent(user, new SymbolGroupEvent.Deleted(groupId));
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            LOGGER.traceExit(e);
            return ResourceErrorHandler.createRESTErrorMessage("SymbolGroupResource.update", HttpStatus.BAD_REQUEST, e);
        }
    }
}
