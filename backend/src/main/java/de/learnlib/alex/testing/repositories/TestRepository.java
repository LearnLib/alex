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

package de.learnlib.alex.testing.repositories;

import de.learnlib.alex.testing.entities.Test;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

/** Repository to persist tests. */
@Repository
public interface TestRepository extends JpaRepository<Test, UUID> {

    /**
     * Get a test by a project id and its id.
     *
     * @param projectId The id of the project.
     * @param id        The id of the test.
     * @return The test.
     */
    @Transactional(readOnly = true)
    @SuppressWarnings("checkstyle:methodname")
    Test findOneByProject_IdAndId(Long projectId, Long id);

    /**
     * Find a test by its name within its parent.
     *
     * @param projectId The id of the project.
     * @param parentId  The id of the parent.
     * @param name      The name of the test.
     * @return The test matching the name.
     */
    @Transactional(readOnly = true)
    @SuppressWarnings("checkstyle:methodname")
    Test findOneByProject_IdAndParent_IdAndName(Long projectId, Long parentId, String name);

    /**
     * Get the highest id of all tests in a project.
     *
     * @param projectId The id of the project.
     * @return The highest id.
     */
    @Transactional(readOnly = true)
    @SuppressWarnings("checkstyle:methodname")
    @Query("SELECT MAX(t.id) FROM Test t WHERE t.project.id = ?1")
    Long findHighestTestNo(Long projectId);

}
