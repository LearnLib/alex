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

package de.learnlib.alex.learning.dao;

import de.learnlib.alex.auth.entities.User;
import de.learnlib.alex.common.exceptions.NotFoundException;
import de.learnlib.alex.learning.entities.AbstractLearnerConfiguration;
import de.learnlib.alex.learning.entities.LearnerResult;
import de.learnlib.alex.learning.entities.LearnerResultStep;
import de.learnlib.alex.learning.services.Learner;

import javax.validation.ValidationException;
import java.util.List;

/**
 * Interface to describe how to deal with LearnerResult.
 */
public interface LearnerResultDAO {

    /**
     * Persists a LearnerResult. This method must also verify that the given result is valid.
     *
     *
     * @param user
     *         The user performing the action.
     * @param learnerResult
     *         The LearnerResult to save.
     * @throws ValidationException
     *         If the given LearnerResult was invalid.
     */
    void create(User user, LearnerResult learnerResult) throws NotFoundException, ValidationException;

    /**
     * Get a list of all the LearnerResults for a given
     * Project.
     *
     * @param user
     *         The user performing the action.
     * @param projectId
     *         The project id of the test run.
     * @param includeSteps
     *         Should all steps be included?
     * @return A list of LearnerResults.
     * @throws NotFoundException
     *         If the project id was invalid.
     */
    List<LearnerResult> getAll(User user, Long projectId, boolean includeSteps) throws NotFoundException;

    /**
     * Get a list of LearnResults with given testNos for a given Project.
     *
     * @param user
     *         The user performing the action.
     * @param projectId
     *         The project id if the test run.
     * @param testNos
     *         The list of test nos. of the LearnResults.
     * @param includeSteps
     *         Should all steps be included?
     * @return A list of LearnerResults.
     * @throws NotFoundException
     *         If the project id or test no. was invalid.
     */
    List<LearnerResult> getAll(User user, Long projectId, Long[] testNos, boolean includeSteps)
            throws NotFoundException;

    /**
     * Get the latest learner result.
     *
     * @param user
     *          The user.
     * @param projectId
     *          The id of the project.
     * @return The latest learner result.
     * @throws NotFoundException
     *          If the project could not be found.
     */
    LearnerResult getLatest(User user, Long projectId) throws NotFoundException;

    /**
     * Get a single LearnResult.
     *
     * @param user
     *         The user performing the action.
     * @param projectId
     *         The project id if the test run.
     * @param testNos
     *         The list of test nos. of the LearnResults.
     * @param includeSteps
     *         Should all steps be included?
     * @return The LearnResult you are looking for.
     * @throws NotFoundException
     *         If the given LearnerResult was invalid.
     */
    LearnerResult get(User user, Long projectId, Long testNos, boolean includeSteps) throws NotFoundException;

    /**
     * Create a new step for a LearnResult based on the latest step within the result.
     *
     * @param result
     *         The result that the new step will be added to.
     * @return A new step.
     * @throws ValidationException
     *         If the requested result could not be found.
     */
    LearnerResultStep createStep(LearnerResult result) throws ValidationException;

    /**
     * Create a new step for a LearnResult based on the given configuration.
     *
     * @param result
     *         The result that the new step will be added to.
     * @param configuration
     *         The configuration to set the step up.
     * @return A new step.
     * @throws ValidationException
     *         If the given LearnerResult was invalid.
     */
    LearnerResultStep createStep(LearnerResult result, AbstractLearnerConfiguration configuration)
            throws ValidationException;

    /**
     * Save / Update a step.
     *
     * @param result
     *         The result that the step is part of.
     * @param step
     *         The step the should be saved / updated.
     * @throws ValidationException
     *         If the given LearnerResult was invalid.
     */
    void saveStep(LearnerResult result, LearnerResultStep step) throws NotFoundException, ValidationException;

    /**
     * Remove a complete test run of a project.
     *
     * @param learner
     *         The learner.
     * @param projectId
     *         The project id.
     * @param testNo
     *         The test numbers to delete.
     * @throws NotFoundException
     *         If the project id or test no. was invalid.
     */
    void delete(Learner learner, Long projectId, Long... testNo) throws  NotFoundException;
}
