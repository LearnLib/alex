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

package de.learnlib.alex.auth.repositories;

import de.learnlib.alex.auth.entities.User;
import de.learnlib.alex.auth.entities.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository to persist Users.
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    /**
     * Find all users by their role.
     *
     * @param role
     *         The role to look for.
     * @return All users with that role.
     */
    List<User> findByRole(UserRole role);

    /**
     * Find a User by its email.
     *
     * @param email
     *         The email to look for.
     * @return The users with that email or null.
     */
    Optional<User> findOneByEmail(String email);

    /**
     * Find a User by its username.
     *
     * @param username
     *         The username to look for.
     * @return The users with that username or null.
     */
    Optional<User> findOneByUsername(String username);

    /**
     * Find multiple users by IDs.
     *
     * @param userIds
     *         The IDs of the users to get.
     * @return The matching users.
     */
    List<User> findAllByIdIn(List<Long> userIds);
}
