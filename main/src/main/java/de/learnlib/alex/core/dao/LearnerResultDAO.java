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
import de.learnlib.alex.core.entities.LearnerResultStep;
import de.learnlib.alex.core.entities.LearnerResumeConfiguration;
import de.learnlib.alex.core.entities.User;
import de.learnlib.alex.core.learner.Learner;
import de.learnlib.alex.exceptions.NotFoundException;

import javax.validation.ValidationException;
import java.util.List;

/**
 * Interface to describe how to deal with LearnerResult.
 */
public interface LearnerResultDAO {

    /**
     * Persists a LearnerResult. This method must also verify that the given result is valid.
     *
     * @param learnerResult
     *         The LearnerResult to save.
     * @throws ValidationException
     *         If the given LearnerResult was invalid.
     */
    void create(LearnerResult learnerResult) throws ValidationException;

    /**
     * Get a list of all the LearnerResults for a given
     * Project.
     *
     * @param userId
     *         The user of the LearnerResult
     * @param projectId
     *         The project id of the test run.
     * @param includeSteps
     *         Should all steps be included?
     * @return A list of LearnerResults.
     * @throws NotFoundException
     *         If the project id was invalid.
     */
    List<LearnerResult> getAll(Long userId, Long projectId, boolean includeSteps) throws NotFoundException;

    /**
     * Get a list of LearnResults with given testNos for a given Project.
     *
     * @param userId
     *         The user of the LearnerResult
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
    List<LearnerResult> getAll(Long userId, Long projectId, Long[] testNos, boolean includeSteps)
            throws NotFoundException;

    /**
     * Get a single LearnResult.
     *
     * @param userId
     *         The user of the LearnerResult
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
    LearnerResult get(Long userId, Long projectId, Long testNos, boolean includeSteps) throws NotFoundException;

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
    LearnerResultStep createStep(LearnerResult result, LearnerResumeConfiguration configuration)
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
    void saveStep(LearnerResult result, LearnerResultStep step) throws ValidationException;

    /**
     * Remove a complete test run of a project.
     *
     * @param learner
     *         The learner.
     * @param user
     *         The user of the LearnerResult.
     * @param projectId
     *         The project id.
     * @param testNo
     *         The test numbers to delete.
     * @throws NotFoundException
     *         If the project id or test no. was invalid.
     */
    void delete(Learner learner, User user, Long projectId, Long... testNo) throws  NotFoundException;
}
