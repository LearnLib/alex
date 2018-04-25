/*
 * Copyright 2018 TU Dortmund
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
import de.learnlib.alex.data.entities.SymbolGroup;
import org.apache.shiro.authz.UnauthorizedException;

import javax.validation.ValidationException;
import java.util.List;

/**
 * Interface to describe how Groups are handled.
 */
public interface SymbolGroupDAO {

    /**
     * Enum to select which fields should be not only referenced but directly be included, i.e. loaded from the DB.
     */
    enum EmbeddableFields {
        /** Fetch all fields. */
        ALL,

        /** Fetch all the symbols with all actions. */
        COMPLETE_SYMBOLS,

        /** Fetch the symbols. */
        SYMBOLS;

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
     * Save a group.
     *
     * @param user
     *         The user who wants to perform this method.
     * @param group
     *         The group to persist.
     * @throws NotFoundException
     *         If one of the entities could not be found.
     * @throws ValidationException
     *         IF the Group is not valid and could not be created.
     */
    void create(User user, SymbolGroup group) throws NotFoundException, ValidationException;

    /**
     * Get a list of all groups withing one project.
     *
     * @param user
     *         The user who wants to perform this method.
     * @param projectId
     *         The project the groups should belong to.
     * @param embedFields
     *         A list of field to directly embed/ load into the returned groups.
     * @return A List of groups. Can be empty.
     * @throws NotFoundException
     *         If no project with the given id was found.
     */
    List<SymbolGroup> getAll(User user, long projectId, EmbeddableFields... embedFields) throws NotFoundException;

    /**
     * Get one group.
     *
     * @param user
     *         The user who wants to perform this method.
     * @param projectId
     *         The project the group belongs to.
     * @param groupId
     *         The ID of the group within the project.
     * @param embedFields
     *         A list of field to directly embed/ load into the returned groups.
     * @return The group you are looking for.
     * @throws NotFoundException
     *         If the Project or the Group could not be found.
     */
    SymbolGroup get(User user, long projectId, Long groupId, EmbeddableFields... embedFields) throws NotFoundException;

    /**
     * Update a group.
     *
     * @param user
     *         The user who wants to perform this method.
     * @param group
     *         The group to update.
     * @throws NotFoundException
     *         If the group was not found, because you can only update existing groups.
     * @throws ValidationException
     *         If the group was invalid.
     */
    void update(User user, SymbolGroup group) throws NotFoundException, ValidationException;

    /**
     * Move a group.
     *
     * @param user
     *         The user who wants to perform this method.
     * @param group
     *         The group to move which contains the new parent id.
     * @return The updated group.
     * @throws NotFoundException
     *         If the group was not found, because you can only update existing groups.
     * @throws ValidationException
     *         If the group was invalid.
     */
    SymbolGroup move(User user, SymbolGroup group) throws NotFoundException, ValidationException;

    /**
     * Delete a group.
     *
     * @param user
     *         The user who wants to perform this method.
     * @param projectId
     *         The project the group belongs to.
     * @param groupId
     *         The ID of the group within the project.
     * @throws IllegalArgumentException
     *         If you want to delete a default group.
     * @throws NotFoundException
     *         If The project or group could not be found.
     */
    void delete(User user, long projectId, Long groupId) throws IllegalArgumentException, NotFoundException;

    /**
     * Checks if the user has access to the group.
     *
     * @param user
     *         The user.
     * @param project
     *         The project.
     * @param group
     *         The group.
     * @throws NotFoundException
     *         If one of the entities could not be found.
     * @throws UnauthorizedException
     *         If the user does not have access to one of the resources.
     */
    void checkAccess(User user, Project project, SymbolGroup group) throws NotFoundException, UnauthorizedException;

}
