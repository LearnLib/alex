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

package de.learnlib.alex.data.dao;

import de.learnlib.alex.auth.entities.User;
import de.learnlib.alex.common.exceptions.NotFoundException;
import de.learnlib.alex.data.entities.Project;
import org.apache.shiro.authz.UnauthorizedException;

import javax.validation.ValidationException;
import java.util.List;

/**
 * Interface to describe how Projects are handled.
 */
public interface ProjectDAO {

    /**
     * Enum to describe what to embed while fetching a  project.
     */
    enum EmbeddableFields {

        /** Flag to embed the groups of the project. */
        GROUPS,

        /** Flag to embed the symbols of the project. */
        SYMBOLS,

        /** FLag to embed counters. */
        COUNTERS,

        /** Flag to embed everything. */
        ALL;

        /**
         * Parse a string into an entry of this enum. It is forbidden to override toValue(), so we use this method to
         * allow the lowercase variants, too.
         *
         * @param name
         *         THe name to parse into an entry.
         * @return The fitting entry of this enum.
         * @throws IllegalArgumentException
         *         If the name could not be parsed.
         */
        public static EmbeddableFields fromString(String name) throws IllegalArgumentException {
            return EmbeddableFields.valueOf(name.toUpperCase());
        }

        @Override
        public String toString() {
            return name().toLowerCase();
        }
    }

    /**
     * Save the given project.
     *
     * @param user
     *         The user that creates the project.
     * @param project
     *         The project to be saved.
     * @return The created project.
     * @throws ValidationException
     *         If the Project was not valid.
     */
    Project create(User user, Project project) throws ValidationException;

    /**
     * Get a list of all the projects.
     *
     * @param user
     *         The user of the project.
     * @param embedFields
     *         The fields to include in returned project. By default no additional data will be fetched from the DB.
     * @return All projects in a list.
     */
    List<Project> getAll(User user, EmbeddableFields... embedFields);

    /**
     * Get a specific project by its ID.
     *
     * @param user
     *         The user.
     * @param projectId
     *         The ID of the project to find.
     * @param embedFields
     *         The fields to include in returned project. By default no additional data will be fetched from the DB.
     * @return The project with the ID.
     * @throws NotFoundException
     *         If the project could not be found.
     */
    Project getByID(User user, Long projectId, EmbeddableFields... embedFields) throws NotFoundException;

    /**
     * Update a project.
     *
     * @param user
     *         The user.
     * @param project
     *         The project to update.
     * @return The updated project.
     * @throws NotFoundException
     *         When the Project was not found.
     * @throws ValidationException
     *         When the Project was not valid.
     */
    Project update(User user, Project project) throws NotFoundException, ValidationException;

    /**
     * Delete a project.
     *
     * @param user
     *         The user.
     * @param projectId
     *         The id of the project to delete.
     * @throws NotFoundException
     *         When the Project id was not found.
     */
    void delete(User user, Long projectId) throws NotFoundException;

    /**
     * Check if the user is allowed to access or modify the project.
     *
     * @param user
     *         The user.
     * @param project
     *         The project.
     * @throws NotFoundException
     *         If the project could not be found.
     * @throws UnauthorizedException
     *         If the project does not belong to the project.
     */
    void checkAccess(User user, Project project) throws NotFoundException, UnauthorizedException;
}
