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

package de.learnlib.alex.testing.repositories;

import de.learnlib.alex.testing.entities.Test;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/** Repository to persist tests. */
@Repository
public interface TestRepository extends JpaRepository<Test, Long> {

    /**
     * Find a test by its name within its parent.
     *
     * @param parentId
     *         The id of the parent.
     * @param name
     *         The name of the test.
     * @return The test matching the name.
     */
    Test findOneByParent_IdAndName(Long parentId, String name);

    /**
     * Get the default test suite.
     *
     * @param projectId
     *         The id of the project.
     * @return The default test suite.
     */
    Test findFirstByProject_IdOrderByIdAsc(Long projectId);

    /**
     * Get all tests of a project.
     *
     * @param projectId
     *         The id of the project.
     * @return The tests in the project.
     */
    List<Test> findAllByProject_Id(Long projectId);

    void deleteAllByProject_Id(Long projectId);

    List<Test> findAllByProject_IdAndIdIn(Long projectId, List<Long> testIds);
}
