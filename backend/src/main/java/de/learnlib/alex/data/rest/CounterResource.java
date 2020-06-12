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
import de.learnlib.alex.data.dao.CounterDAO;
import de.learnlib.alex.data.entities.Counter;
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

import javax.validation.ValidationException;
import javax.ws.rs.core.MediaType;
import java.util.Collections;
import java.util.List;

/**
 * Resource to read and delete Counters.
 */
@RestController()
@RequestMapping("/rest/projects/{projectId}/counters")
public class CounterResource {

    private static final Logger LOGGER = LogManager.getLogger();

    private final AuthContext authContext;
    private final CounterDAO counterDAO;

    @Autowired
    public CounterResource(AuthContext authContext, CounterDAO counterDAO) {
        this.authContext = authContext;
        this.counterDAO = counterDAO;
    }

    /**
     * Get all counters of a project.
     *
     * @param projectId
     *         The Project ID.
     * @return A List of the counters within the project. This list can be empty.
     */
    @GetMapping(
            produces = MediaType.APPLICATION_JSON
    )
    public ResponseEntity getAllCounters(@PathVariable("projectId") Long projectId) {
        final User user = authContext.getUser();
        LOGGER.traceEntry("getAllCounters({}) for user {}.", projectId, user);

        final List<Counter> counters = counterDAO.getAll(user, projectId);

        LOGGER.traceExit(counters);
        return ResponseEntity.ok(counters);
    }

    /**
     * Creates a new counter.
     *
     * @param projectId
     *         The id of the project.
     * @param counter
     *         The counter to create.
     * @return The created counter.
     */
    @PostMapping(
            consumes = MediaType.APPLICATION_JSON,
            produces = MediaType.APPLICATION_JSON
    )
    public ResponseEntity createCounter(@PathVariable("projectId") Long projectId, @RequestBody Counter counter) {
        final User user = authContext.getUser();
        LOGGER.traceEntry("createCounter({}, {}) for user {}.", projectId, counter.getName(), user);

        if (!counter.getProjectId().equals(projectId)) {
            throw new ValidationException("The ID of the project does not match with the URL.");
        }

        counterDAO.create(user, counter);
        return ResponseEntity.status(HttpStatus.CREATED).body(counter);
    }

    /**
     * Update the value of a counter.
     *
     * @param projectId
     *         The id of the project.
     * @param counterId
     *         The id of the counter.
     * @param counter
     *         The updated counter to update.
     * @return The updated counter.
     */
    @PutMapping(
            value = "/{counterId}",
            produces = MediaType.APPLICATION_JSON,
            consumes = MediaType.APPLICATION_JSON
    )
    public ResponseEntity updateCounter(@PathVariable("projectId") Long projectId,
                                        @PathVariable("counterId") Long counterId,
                                        @RequestBody Counter counter) {
        final User user = authContext.getUser();
        LOGGER.traceEntry("updateCounter({}, {}) for user {}.", projectId, counterId, user);

        if (!counter.getProjectId().equals(projectId)) {
            throw new ValidationException("The ID of the project does not match with the URL.");
        }

        final Counter updatedCounter = counterDAO.update(user, counter);
        return ResponseEntity.ok(updatedCounter);
    }

    /**
     * Delete one counter.
     *
     * @param projectId
     *         The Project ID.
     * @param counterId
     *         The id of the counter to remove.
     * @return Nothing if everything went OK.
     */
    @DeleteMapping(
            value = "/{counterId}",
            produces = MediaType.APPLICATION_JSON
    )
    public ResponseEntity deleteCounter(@PathVariable("projectId") Long projectId,
                                        @PathVariable("counterId") Long counterId) {
        final User user = authContext.getUser();
        LOGGER.traceEntry("deleteCounter({}, {}) for user {}.", projectId, counterId, user);

        counterDAO.delete(user, projectId, Collections.singletonList(counterId));

        LOGGER.traceExit("Counter {} deleted.", counterId);
        return ResponseEntity.noContent().build();
    }

    /**
     * Delete multiple counters.
     *
     * @param projectId
     *         The Project ID.
     * @param counterIds
     *         The ids of the counters to remove.
     * @return Nothing if everything went OK.
     */
    @DeleteMapping(
            value = "/batch/{counterIds}",
            produces = MediaType.APPLICATION_JSON
    )
    public ResponseEntity deleteCounter(@PathVariable("projectId") Long projectId,
                                        @PathVariable("counterIds") List<Long> counterIds) {
        final User user = authContext.getUser();
        LOGGER.traceEntry("deleteCounter({}, {}) for user {}.", projectId, counterIds, user);

        counterDAO.delete(user, projectId, counterIds);

        LOGGER.traceExit("Counter(s) {} deleted.", counterIds);
        return ResponseEntity.noContent().build();
    }

}
