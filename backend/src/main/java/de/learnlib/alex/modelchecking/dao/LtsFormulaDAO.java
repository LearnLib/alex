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

package de.learnlib.alex.modelchecking.dao;

import de.learnlib.alex.auth.entities.User;
import de.learnlib.alex.common.exceptions.NotFoundException;
import de.learnlib.alex.data.entities.Project;
import de.learnlib.alex.modelchecking.entities.LtsFormula;

import java.util.List;

/** The DAO for lts formulas. */
public interface LtsFormulaDAO {

    /**
     * Constructor.
     *
     * @param user
     *         The user.
     * @param projectId
     *         The ID of the project.
     * @return All formulas in the project.
     * @throws NotFoundException
     *         If the project could not be found.
     */
    List<LtsFormula> getAll(User user, Long projectId) throws NotFoundException;

    /**
     * Constructor.
     *
     * @param user
     *         The user.
     * @param projectId
     *         The ID of the project.
     * @param formula
     *         The formula to create.
     * @return The created formula.
     * @throws NotFoundException
     *         If the project or formula could not be found.
     */
    LtsFormula create(User user, Long projectId, LtsFormula formula) throws NotFoundException;

    /**
     * Constructor.
     *
     * @param user
     *         The user.
     * @param projectId
     *         The ID of the project.
     * @param formula
     *         The formula to updated.
     * @return The updated formula.
     * @throws NotFoundException
     *         If the project or formula could not be found.
     */
    LtsFormula update(User user, Long projectId, LtsFormula formula) throws NotFoundException;

    /**
     * Constructor.
     *
     * @param user
     *         The user.
     * @param projectId
     *         The ID of the project.
     * @param formulaId
     *         The ID of the formula to delete.
     * @throws NotFoundException
     *         If the project or formula could not be found.
     */
    void delete(User user, Long projectId, Long formulaId) throws NotFoundException;

    /**
     * Constructor.
     *
     * @param user
     *         The user.
     * @param projectId
     *         The ID of the project.
     * @param formulaIds
     *         The IDs of the formulas to delete.
     * @throws NotFoundException
     *         If the project or formula could not be found.
     */
    void delete(User user, Long projectId, List<Long> formulaIds) throws NotFoundException;

    /**
     * Constructor.
     *
     * @param user
     *         The user.
     * @param project
     *         The project.
     * @param formula
     *         The formula.
     * @throws NotFoundException
     *         If the project or formula could not be found.
     */
    void checkAccess(User user, Project project, LtsFormula formula) throws NotFoundException;

}
