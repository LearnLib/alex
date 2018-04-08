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

package de.learnlib.alex.testing.dao;

import de.learnlib.alex.auth.entities.User;
import de.learnlib.alex.common.exceptions.NotFoundException;
import de.learnlib.alex.common.utils.IdsList;
import de.learnlib.alex.data.entities.Project;
import de.learnlib.alex.testing.entities.Test;
import org.apache.shiro.authz.UnauthorizedException;

import javax.validation.ValidationException;
import java.util.List;

/**
 * The DAO for tests.
 */
public interface TestDAO {

    /**
     * Creates a test.
     *
     * @param user
     *         The user that belongs to the test.
     * @param test
     *         The test to create.
     * @throws ValidationException
     * @throws NotFoundException
     */
    void create(User user, Test test) throws ValidationException, NotFoundException;

    /**
     * Creates multiple tests at once.
     *
     * @param user
     *         The user that belongs to the test.
     * @param tests
     *         The tests to create.
     * @throws ValidationException
     * @throws NotFoundException
     */
    void create(User user, List<Test> tests) throws ValidationException, NotFoundException;

    /**
     * Gets a test.
     *
     * @param user
     *         The user that belongs to the test.
     * @param projectId
     *         The id of the project the test belongs to.
     * @param id
     *         The id of the test to get.
     * @return The test.
     * @throws NotFoundException
     *         If the test could not be found.
     */
    Test get(User user, Long projectId, Long id) throws NotFoundException, UnauthorizedException;

    /**
     * Gets all tests of a specific type.
     *
     * @param user
     *         The user.
     * @param projectId
     *         The id of the project.
     * @param type
     *         The type of the test ['case', 'suite'].
     * @return The tests that match the type.
     * @throws NotFoundException
     *         If one of the entities could not be found.
     * @throws UnauthorizedException
     *         If the user has no access to one of the entities.
     * @throws IllegalArgumentException
     *         If the type is invalid.
     */
    List<Test> getByType(User user, Long projectId, String type)
            throws NotFoundException, UnauthorizedException, IllegalArgumentException;

    /**
     * Gets the root test.
     *
     * @param user
     *         The user that belongs to the test.
     * @param projectId
     *         The id of the project the test belongs to.
     * @return The test.
     * @throws NotFoundException
     *         If the test could not be found.
     */
    Test getRoot(User user, Long projectId) throws NotFoundException;

    /**
     * Gets multiple test.
     *
     * @param user
     *         The user that belongs to the tests.
     * @param projectId
     *         The id of the project the tests belongs to.
     * @param ids
     *         The ids of the tests to get.
     * @return The test.
     * @throws NotFoundException
     *         If a test could not be found.
     */
    List<Test> get(User user, Long projectId, List<Long> ids) throws NotFoundException, UnauthorizedException;

    /**
     * Update a test.
     *
     * @param user
     *         The user that belongs to the test.
     * @param test
     *         The test to create.
     * @throws NotFoundException
     *         If the test could not be found.
     */
    void update(User user, Test test) throws NotFoundException;

    /**
     * Deletes a test.
     *
     * @param user
     *         The user that belongs to the test.
     * @param projectId
     *         The id of the project the test belongs to.
     * @param id
     *         The id of the test to get.
     * @throws NotFoundException
     *         If the test could not be found.
     */
    void delete(User user, Long projectId, Long id) throws NotFoundException;

    /**
     * Deletes multiple tests at once.
     *
     * @param user
     *         The user that belongs to the test.
     * @param projectId
     *         The id of the project the test belongs to.
     * @param ids
     *         The ids of the tests to get.
     * @throws NotFoundException
     *         If the test could not be found.
     */
    void delete(User user, Long projectId, IdsList ids) throws NotFoundException;

    void checkAccess(User user, Project project, Test test) throws NotFoundException, UnauthorizedException;
}
