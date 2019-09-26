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
import de.learnlib.alex.data.entities.SymbolGroup;
import org.apache.shiro.authz.UnauthorizedException;

import javax.validation.ValidationException;
import java.util.List;

/**
 * Interface to describe how Groups are handled.
 */
public interface SymbolGroupDAO {

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
     * Create multiple symbol groups.
     *
     * @param user
     *         The user.
     * @param projectId
     *         The ID of the project.
     * @param groups
     *         The groups to create.
     * @return The created symbol groups.
     * @throws NotFoundException
     *         If one of the entities could not be found.
     * @throws ValidationException
     *         If the groups are not valid.
     */
    List<SymbolGroup> create(User user, Long projectId, List<SymbolGroup> groups)
            throws NotFoundException, ValidationException;

    /**
     * Import symbols groups.
     *
     * @param user
     *         The user.
     * @param projectId
     *         The ID of the project.
     * @param groups
     *         The groups to import.
     * @return The imported groups.
     */
    List<SymbolGroup> importGroups(User user, Long projectId, List<SymbolGroup> groups);

    /**
     * Get a list of all groups withing one project.
     *
     * @param user
     *         The user who wants to perform this method.
     * @param projectId
     *         The project the groups should belong to.
     * @return A List of groups. Can be empty.
     * @throws NotFoundException
     *         If no project with the given id was found.
     */
    List<SymbolGroup> getAll(User user, long projectId) throws NotFoundException;

    /**
     * Get one group.
     *
     * @param user
     *         The user who wants to perform this method.
     * @param projectId
     *         The project the group belongs to.
     * @param groupId
     *         The ID of the group within the project.
     * @return The group you are looking for.
     * @throws NotFoundException
     *         If the Project or the Group could not be found.
     */
    SymbolGroup get(User user, long projectId, Long groupId) throws NotFoundException;

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
