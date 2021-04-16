/*
 * Copyright 2015 - 2021 TU Dortmund
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

import de.learnlib.alex.testing.entities.TestExecutionConfig;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/** Repository for test execution configs. */
@Repository
public interface TestExecutionConfigRepository extends JpaRepository<TestExecutionConfig, Long> {

    /**
     * Get all configurations by a project id.
     *
     * @param projectId
     *         The id of the project.
     * @return The configurations.
     */
    List<TestExecutionConfig> findAllByProject_Id(Long projectId);

    void deleteAllByProject_Id(Long projectId);

    @Query(nativeQuery = true, value = "select * from PUBLIC.test_execution_config where project_id = ? and is_default = true limit 1")
    TestExecutionConfig findByProject_IdAndIs_Default(Long projectId);

    @Query(value = "select tc "
            +      "from TestExecutionConfig tc join tc.tests t "
            +      "where tc.project.id = :projectId and t.id = :testId")
    List<TestExecutionConfig> findAllByProject_IdAndTest_Id(@Param("projectId") Long projectId, @Param("testId") Long testId);
}
