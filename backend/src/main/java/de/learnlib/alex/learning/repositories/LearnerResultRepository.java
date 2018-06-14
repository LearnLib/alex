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

package de.learnlib.alex.learning.repositories;

import de.learnlib.alex.data.entities.ProjectUrl;
import de.learnlib.alex.learning.entities.LearnerResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

/**
 * Repository to persist LearnerResults.
 */
@Repository
public interface LearnerResultRepository extends JpaRepository<LearnerResult, UUID> {

    /**
     * Find all LearnerResults in a Project.
     *
     * @param projectId
     *         The ID the Project the LearnerResults belong to.
     * @return The LearnerResults.
     */
    @Transactional(readOnly = true)
    @SuppressWarnings("checkstyle:methodname")
    List<LearnerResult> findByProject_IdOrderByTestNoAsc(Long projectId);

    /**
     * Find all LearnerResults by their test no in a Project.
     *
     * @param projectId
     *         The ID the Project the LearnerResults belong to.
     * @param testNos
     *         The test no of the LearnResults to fetch.
     * @return The LearnResults.
     */
    @Transactional(readOnly = true)
    @SuppressWarnings("checkstyle:methodname")
    List<LearnerResult> findByProject_IdAndTestNoIn(Long projectId, Long... testNos);

    /**
     * Find a single learner result.
     *
     * @param projectId
     *         The ID of the project.
     * @param testNo
     *         The test number.
     * @return The learner result.
     */
    @Transactional(readOnly = true)
    @SuppressWarnings("checkstyle:methodname")
    LearnerResult findOneByProject_IdAndTestNo(Long projectId, Long testNo);

    /**
     * Get the highest / latest test no used in a Project.
     *
     * @param projectId
     *         The ID of the Project to check.
     * @return The highest test no within that project.
     */
    @Transactional(readOnly = true)
    @SuppressWarnings("checkstyle:methodname")
    @Query("SELECT MAX(l.testNo) FROM LearnerResult l WHERE l.project.id = ?1")
    Long findHighestTestNo(Long projectId);

    /**
     * Get all learner results that contain specific project URLs.
     *
     * @param urls
     *         The URLs the learner result should contain.
     * @return The learner results.
     */
    @Transactional(readOnly = true)
    @SuppressWarnings("checkstyle:methodname")
    List<LearnerResult> findAllByUrlsIn(List<ProjectUrl> urls);

    /**
     * Get the latest learner result.
     *
     * @param projectId
     *         The id of the project.
     * @return The latest learner result.
     */
    @Transactional(readOnly = true)
    @SuppressWarnings("checkstyle:methodname")
    LearnerResult findFirstByProject_IdOrderByTestNoDesc(Long projectId);

    /**
     * Delete LearnResults by their test no in a Project.
     *
     * @param projectId
     *         The ID the Project the LearnerResults belong to.
     * @param testNos
     *         The test no of the LearnResults to delete.
     * @return The amount of deleted LearnResults.
     */
    @Transactional
    @SuppressWarnings("checkstyle:methodname")
    Long deleteByProject_IdAndTestNoIn(Long projectId, Long... testNos);

    /**
     * Delete all learner results in a project.
     *
     * @param projectId
     *         The ID of the project.
     * @return The amount of deleted LearnResults.
     */
    @Transactional
    @SuppressWarnings("checkstyle:methodname")
    Long deleteAllByProject_Id(Long projectId);

}
