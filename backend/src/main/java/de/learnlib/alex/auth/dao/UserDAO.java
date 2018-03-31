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

package de.learnlib.alex.auth.dao;

import de.learnlib.alex.auth.entities.User;
import de.learnlib.alex.auth.entities.UserRole;
import de.learnlib.alex.common.exceptions.NotFoundException;
import de.learnlib.alex.common.utils.IdsList;

import javax.validation.ValidationException;
import java.util.List;

/**
 * Interface for database operations on users.
 */
public interface UserDAO {

    /**
     * Creates a new user
     * .
     *
     * @param user
     *         The user to create
     * @throws ValidationException
     *         If the user could not be created because the object has invalid properties.
     */
    void create(User user) throws ValidationException;

    /**
     * Gets a list of all registered users.
     *
     * @return The list of all users. Can be empty.
     */
    List<User> getAll();

    /**
     * Gets a list of registered users with a specific role.
     *
     * @param role
     *         The role of the user.
     * @return A list of all users with the given role. Can be empty.
     */
    List<User> getAllByRole(UserRole role);

    /**
     * Gets a user by its email.
     *
     * @param email
     *         The users email
     * @return The user with the given email.
     * @throws NotFoundException
     *         If ne User was found.
     */
    User getByEmail(String email) throws NotFoundException;

    /**
     * Gets a user by its id.
     *
     * @param id
     *         The id of the user
     * @return The user with the given id.
     * @throws NotFoundException
     *         If ne User was found.
     */
    User getById(Long id) throws NotFoundException;

    /**
     * Updates a user.
     *
     * @param user
     *         The user to update
     * @throws ValidationException
     *         If the user could not be updated because the object has invalid properties.
     */
    void update(User user) throws ValidationException;

    /**
     * Deletes a user from the database. Admins can only be deleted if there is more than one available.
     *
     * @param id
     *         The id of the user to delete
     * @throws NotFoundException
     *         If the user to delete was not found (and thus not deleted).
     */
    void delete(Long id) throws NotFoundException;

    /**
     * Deletes multiple users from the database at once. This method should only be called by admins.
     * The admin that calls this method cannot delete himself.
     *
     * @param ids
     *          The ids of the users to delete
     * @throws NotFoundException
     *          If the user to delete was not found (and thus not deleted).
     */
    void delete(IdsList ids) throws NotFoundException;
}
