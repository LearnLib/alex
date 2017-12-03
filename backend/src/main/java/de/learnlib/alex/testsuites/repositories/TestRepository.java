/*
 * Copyright 2016 TU Dortmund
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

package de.learnlib.alex.testsuites.repositories;

import de.learnlib.alex.testsuites.entities.Test;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

/**
 * Repository to persist Test Cases.
 */
@Repository
public interface TestRepository extends JpaRepository<Test, UUID> {

    @Transactional(readOnly = true)
    @SuppressWarnings("checkstyle:methodname")
    @Query("SELECT t FROM Test t WHERE t.project.id = ?1 AND t.parent = NULL")
    List<Test> findAllByProject_Id(Long projectId);

    @Transactional(readOnly = true)
    @SuppressWarnings("checkstyle:methodname")
    Test findOneByProject_IdAndId(Long projectId, Long id);

    @SuppressWarnings("checkstyle:methodname")
    Test findOneByProject_IdAndName(Long projectId, String name);

    @Transactional(readOnly = true)
    @SuppressWarnings("checkstyle:methodname")
    @Query("SELECT MAX(t.id) FROM Test t WHERE t.project.id = ?1")
    Long findHighestTestNo(Long projectId);

}
