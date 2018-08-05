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
import de.learnlib.alex.testing.entities.TestReport;
import org.apache.shiro.authz.UnauthorizedException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

/** The DAO for test reports. */
public interface TestReportDAO {

    /**
     * Create a test report.
     *
     * @param user
     *         The user.
     * @param projectId
     *         The id of the project.
     * @param testReport
     *         The report to create.
     * @throws NotFoundException
     *         If the project could not be found.
     */
    void create(User user, Long projectId, TestReport testReport) throws NotFoundException;

    /**
     * Get all test reports in a project.
     *
     * @param user
     *         The user.
     * @param projectId
     *         The id of the project.
     * @param pageable
     *         The pageable object.
     * @return The reports in the project.
     * @throws NotFoundException
     *         If the project could not be found.
     */
    Page<TestReport> getAll(User user, Long projectId, Pageable pageable) throws NotFoundException;

    /**
     * Get a single test report.
     *
     * @param user
     *         The user.
     * @param projectId
     *         The project.
     * @param testReportId
     *         The id of the report in the project.
     * @return The report.
     * @throws NotFoundException
     *         If the project or the report could not be found.
     */
    TestReport get(User user, Long projectId, Long testReportId) throws NotFoundException;

    /**
     * Get the latest test report.
     *
     * @param user
     *         The user.
     * @param projectId
     *         The id of the project.
     * @return The latest test report or null.
     * @throws NotFoundException
     *         If the project could not be found.
     */
    TestReport getLatest(User user, Long projectId) throws NotFoundException;

    /**
     * Deletes a single test report.
     *
     * @param user
     *         The user.
     * @param projectId
     *         The id of the project.
     * @param testReportId
     *         The id of the report.
     * @throws NotFoundException
     *         If the project or the report could not be found.
     */
    void delete(User user, Long projectId, Long testReportId) throws NotFoundException;

    /**
     * Deletes multiple test reports at once.
     *
     * @param user
     *         The user.
     * @param projectId
     *         The id of the project.
     * @param testReportIds
     *         The ids of the reports.
     * @throws NotFoundException
     *         If the project or a report could not be found.
     */
    void delete(User user, Long projectId, List<Long> testReportIds) throws NotFoundException;

    /**
     * Checks if the user has access to the test report.
     *
     * @param user
     *         The user.
     * @param project
     *         The project.
     * @param report
     *         The test report.
     * @throws NotFoundException
     *         If one of the entities could not be found.
     * @throws UnauthorizedException
     *         If the user has no access to one of the entities.
     */
    void checkAccess(User user, Project project, TestReport report) throws NotFoundException, UnauthorizedException;
}
