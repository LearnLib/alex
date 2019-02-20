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

package de.learnlib.alex.modelchecking.repositories;

import de.learnlib.alex.modelchecking.entities.LtsFormula;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/** Repository for lts formulas. */
@Repository
public interface LtsFormulaRepository extends JpaRepository<LtsFormula, Long> {

    /**
     * Get all formulas in a project.
     *
     * @param projectId
     *         The ID of the project.
     * @return The formulas stored in the project.
     */
    @Transactional(readOnly = true)
    @SuppressWarnings("checkstyle:methodname")
    List<LtsFormula> findAllByProject_Id(Long projectId);

    /**
     * Get all formulas in a project.
     *
     * @param projectId
     *         The ID of the project.
     * @param formulaIds
     *         The IDs of the formulas.
     * @return The formulas stored in the project.
     */
    @Transactional(readOnly = true)
    @SuppressWarnings("checkstyle:methodname")
    List<LtsFormula> findAllByProject_IdAndIdIn(Long projectId, List<Long> formulaIds);
}
