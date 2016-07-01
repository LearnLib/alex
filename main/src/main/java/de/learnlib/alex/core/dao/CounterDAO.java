/*
 * Copyright 2016 TU Dortmund
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

package de.learnlib.alex.core.dao;

import de.learnlib.alex.core.entities.Counter;
import de.learnlib.alex.exceptions.NotFoundException;
import org.jvnet.hk2.annotations.Service;

import javax.validation.ValidationException;
import java.util.List;

/**
 * Interface to describe how a counter should be handed.
 */
@Service
public interface CounterDAO {

    /**
     * Create a counter.
     *
     * @param counter
     *         The counter to create.
     * @throws ValidationException
     *         When the counter could not be created,
     *         e.g. if already a counter with the same name exists in the project.
     */
    void create(Counter counter) throws ValidationException;

    /**
     * Get all counter of a project.
     *
     * @param userId
     *          The user that owns the counters
     * @param projectId
     *         The project of the counters.
     * @return A list of counters within the given project.
     * @throws NotFoundException
     *         If no project with the given ID exists.
     */
    List<Counter> getAll(Long userId, Long projectId) throws NotFoundException;

    /**
     * Get a specific counter.
     *
     * @param userId
     *         The user that owns the counter.
     * @param projectId
     *         The project of the counter.
     * @param name
     *         The name of the counter.
     * @return The counter you are looking for.
     * @throws NotFoundException
     *         If the counter was not found.
     */
    Counter get(Long userId, Long projectId, String name) throws NotFoundException;

    /**
     * Update a counter.
     *
     * @param counter
     *         The counter to update.
     * @throws NotFoundException
     *         If the counter was not created before and thus could not be found.
     * @throws ValidationException
     *         If the counter could not be updated because of not met validation constrains.
     */
    void update(Counter counter) throws NotFoundException, ValidationException;

    /**
     * Deletes counters.
     *
     * @param userId
     *          The user that owns the counters
     * @param projectId
     *         The project of the counter.
     * @param names
     *         The names of the counters.
     * @throws NotFoundException
     *         If the project or counter was not found.
     */
    void delete(Long userId, Long projectId, String... names) throws NotFoundException;

}
