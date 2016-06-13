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

package de.learnlib.alex.core.dao;

import de.learnlib.alex.core.entities.LearnerResult;
import de.learnlib.alex.core.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface LearnerResultRepository extends JpaRepository<LearnerResult, Long> {

    @Transactional(readOnly = true)
    List<LearnerResult> findByUser_IdAndProject_IdOrderByTestNoAsc(Long userId, Long projectId);

    @Transactional(readOnly = true)
    List<LearnerResult> findByUser_IdAndProject_IdAndTestNoIn(Long userId, Long projectId, Long... testNos);

    @Transactional(readOnly = true)
    @Query("SELECT MAX(l.testNo) FROM LearnerResult l WHERE l.user.id = ?1 AND l.project.id = ?2")
    Long findHighestTestNo(Long userId, Long projectId);

    @Modifying
    @Transactional
    Long deleteByUserAndProject_IdAndTestNoIn(User user, Long projectId, Long... testNos);

}
