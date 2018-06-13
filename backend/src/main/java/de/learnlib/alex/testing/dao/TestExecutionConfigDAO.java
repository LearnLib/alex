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
import de.learnlib.alex.data.entities.Project;
import de.learnlib.alex.testing.entities.TestExecutionConfig;
import org.apache.shiro.authz.UnauthorizedException;

import java.util.List;

/**
 * DAO for {@link TestExecutionConfig}.
 */
public interface TestExecutionConfigDAO {

    /**
     * Create a new test config.
     *
     * @param user
     *         The current user.
     * @param projectId
     *         The id of the project.
     * @param config
     *         The test config to create.
     * @return The created test config
     * @throws NotFoundException
     *         If one of the entities could not be found.
     * @throws UnauthorizedException
     *         If the user has not access to one of the entities.
     */
    TestExecutionConfig create(User user, Long projectId, TestExecutionConfig config)
            throws NotFoundException, UnauthorizedException;

    /**
     * Get all test configs in a project.
     *
     * @param user
     *         The current user.
     * @param projectId
     *         The id of the project.
     * @return The test configs in the project.
     * @throws NotFoundException
     *         If one of the entities could not be found.
     * @throws UnauthorizedException
     *         If the user has not access to one of the entities.
     */
    List<TestExecutionConfig> getAll(User user, Long projectId)
            throws NotFoundException, UnauthorizedException;

    /**
     * Delete a test config.
     *
     * @param user
     *         The current user.
     * @param projectId
     *         The id of the project.
     * @param configId
     *         The id of the config to delete.
     * @throws NotFoundException
     *         If one of the entities could not be found.
     * @throws UnauthorizedException
     *         If the user has not access to one of the entities.
     */
    void delete(User user, Long projectId, Long configId)
            throws NotFoundException, UnauthorizedException;

    /**
     * Check if the user has access to a test config object.
     *
     * @param user
     *         The current user.
     * @param project
     *         The project.
     * @param config
     *         The config.
     * @throws NotFoundException
     *         If one of the entities could not be found.
     * @throws UnauthorizedException
     *         If the user has not access to one of the entities.
     */
    void checkAccess(User user, Project project, TestExecutionConfig config)
            throws NotFoundException, UnauthorizedException;
}
