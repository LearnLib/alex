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

package de.learnlib.alex.testing.repositories;

import de.learnlib.alex.testing.entities.TestReport;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

/** The repository for test reports. */
@Repository
public interface TestReportRepository extends JpaRepository<TestReport, Long> {

    /**
     * Get the latest test report in a project.
     *
     * @param projectId
     *         The id of the project.
     * @return The latest test report.
     */
    @Transactional(readOnly = true)
    @SuppressWarnings("checkstyle:methodname")
    TestReport findFirstByProject_IdOrderByIdDesc(Long projectId);

    /**
     * Get all test reports in a project.
     *
     * @param projectId
     *         The id of the project.
     * @param pageable
     *         The pageable object.
     * @return The test reports.
     */
    @Transactional(readOnly = true)
    @SuppressWarnings("checkstyle:methodname")
    Page<TestReport> findAllByProject_Id(Long projectId, Pageable pageable);

    /**
     * Delete all test reports by project id.
     *
     * @param projectId
     *         The id of the project.
     * @return The number of deleted test reports.
     */
    @Transactional
    @SuppressWarnings("checkstyle:methodname")
    Long deleteAllByProject_Id(Long projectId);

    @Transactional
    @SuppressWarnings("checkstyle:methodname")
    void deleteAllByEnvironment_Id(Long envId);
}
