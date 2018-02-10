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

package de.learnlib.alex.testing.repositories;

import de.learnlib.alex.testing.entities.TestReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

/** The repository for test reports. */
@Repository
public interface TestReportRepository extends JpaRepository<TestReport, UUID> {

    @Transactional(readOnly = true)
    @Query("SELECT MAX(r.id) FROM TestReport r WHERE r.project.id = ?1")
    Long findHighestId(Long projectId);

    @Transactional(readOnly = true)
    @SuppressWarnings("checkstyle:methodname")
    TestReport findOneByProject_IdAndId(Long projectId, Long id);

    @Transactional(readOnly = true)
    @SuppressWarnings("checkstyle:methodname")
    List<TestReport> findAllByProject_Id(Long projectId);
}
