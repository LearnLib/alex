/*
 * Copyright 2015 - 2022 TU Dortmund
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

import de.learnlib.alex.learning.entities.LearnerSetup;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface LearnerSetupRepository extends JpaRepository<LearnerSetup, Long> {

    List<LearnerSetup> findAllByProject_Id(Long projectId);

    void deleteAllByProject_Id(Long projectId);

    @Query(value = "select ls "
            +      "from LearnerSetup ls join ls.environments e "
            +      "where ls.project.id = :projectId and e.id = :environmentId")
    List<LearnerSetup> findAllByProject_IdAndEnvironment_Id(@Param("projectId") Long projectId, @Param("environmentId") Long environmentId);
}
