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

package de.learnlib.alex.data.rest;

import de.learnlib.alex.data.dao.CounterDAO;
import de.learnlib.alex.data.entities.Counter;
import de.learnlib.alex.security.AuthContext;
import java.util.Collections;
import java.util.List;
import javax.ws.rs.core.MediaType;
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

/**
 * Resource to read and delete Counters.
 */
@RestController()
@RequestMapping("/rest/projects/{projectId}/counters")
public class CounterResource {

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
    public ResponseEntity<List<Counter>> getAllCounters(@PathVariable("projectId") Long projectId) {
        final var user = authContext.getUser();
        final var counters = counterDAO.getAll(user, projectId);
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
    public ResponseEntity<Counter> createCounter(
            @PathVariable("projectId") Long projectId,
            @RequestBody Counter counter
    ) {
        final var user = authContext.getUser();
        final var createdCounter = counterDAO.create(user, projectId, counter);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdCounter);
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
    public ResponseEntity<Counter> updateCounter(
            @PathVariable("projectId") Long projectId,
            @PathVariable("counterId") Long counterId,
            @RequestBody Counter counter
    ) {
        final var user = authContext.getUser();
        final var updatedCounter = counterDAO.update(user, projectId, counterId, counter);
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
    public ResponseEntity<?> deleteCounter(
            @PathVariable("projectId") Long projectId,
            @PathVariable("counterId") Long counterId
    ) {
        final var user = authContext.getUser();
        counterDAO.delete(user, projectId, Collections.singletonList(counterId));
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
    public ResponseEntity<?> deleteCounter(
            @PathVariable("projectId") Long projectId,
            @PathVariable("counterIds") List<Long> counterIds
    ) {
        final var user = authContext.getUser();
        counterDAO.delete(user, projectId, counterIds);
        return ResponseEntity.noContent().build();
    }

}
