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
import de.learnlib.alex.testing.entities.TestCase;
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
     *         If the test is not valid.
     * @throws NotFoundException
     *         If one of the required entities is not found.
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
     *         If the test is not valid.
     * @throws NotFoundException
     *         If one of the required entities is not found.
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
     * @throws UnauthorizedException
     *         If the user does not have access to one of the resources.
     */
    Test get(User user, Long projectId, Long id) throws NotFoundException, UnauthorizedException;

    /**
     * Get all test cases of a test suite.
     *
     * @param user
     *         The user.
     * @param projectId
     *         The ID of the project.
     * @param testSuiteId
     *         The ID of the test suite.
     * @param includeChildTestSuites
     *         If test cases in child test suites should be included as well.
     * @return All test cases.
     * @throws NotFoundException If the test or project could not be found.
     * @throws ValidationException If the ID does not belong to a test suite.
     */
    List<TestCase> getTestCases(User user, Long projectId, Long testSuiteId, boolean includeChildTestSuites)
            throws NotFoundException, ValidationException;

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
     * @throws UnauthorizedException
     *         If the user does not have access to one of the resources.
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

    /**
     * Move tests to a new test suite.
     *
     * @param user
     *         The current user.
     * @param projectId
     *         The id of the project.
     * @param testIds
     *         The ids of the tests to move.
     * @param targetId
     *         The id of the target test suite.
     * @return The moved tests.
     * @throws NotFoundException
     *         If one of the entities could not be found.
     * @throws ValidationException
     *         If the inputs are not valid.
     */
    List<Test> move(User user, Long projectId, List<Long> testIds, Long targetId)
            throws NotFoundException, ValidationException;

    /**
     * Checks if the user has access to the test.
     *
     * @param user
     *         The user.
     * @param project
     *         The project.
     * @param test
     *         The test.
     * @throws NotFoundException
     *         If one of the resources could not be found.
     * @throws UnauthorizedException
     *         If the user is not allowed to access one of the resources.
     */
    void checkAccess(User user, Project project, Test test) throws NotFoundException, UnauthorizedException;
}
