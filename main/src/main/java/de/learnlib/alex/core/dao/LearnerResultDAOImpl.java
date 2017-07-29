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

import de.learnlib.alex.core.entities.LearnerConfiguration;
import de.learnlib.alex.core.entities.LearnerResult;
import de.learnlib.alex.core.entities.LearnerResultStep;
import de.learnlib.alex.core.entities.LearnerStatus;
import de.learnlib.alex.core.entities.User;
import de.learnlib.alex.core.learner.Learner;
import de.learnlib.alex.core.repositories.LearnerResultRepository;
import de.learnlib.alex.core.repositories.LearnerResultStepRepository;
import de.learnlib.alex.exceptions.NotFoundException;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.hibernate.Hibernate;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.inject.Inject;
import javax.validation.ValidationException;
import java.util.Arrays;
import java.util.List;

/**
 * Implementation of a LearnerResultDAO using Spring Data.
 */
@Service
public class LearnerResultDAOImpl implements LearnerResultDAO {

    private static final Logger LOGGER = LogManager.getLogger();

    /** The LearnerResultRepository to use. Will be injected. */
    private LearnerResultRepository learnerResultRepository;

    /** The LearnerResultStepRepository to use. Will be injected. */
    private LearnerResultStepRepository learnerResultStepRepository;

    /**
     * Creates a new LearnerResultDAO.
     *
     * @param learnerResultRepository
     *         The LearnerResultRepository to use.
     * @param learnerResultStepRepository
     *         The LearnerResultStepRepository to use.
     */
    @Inject
    public LearnerResultDAOImpl(LearnerResultRepository learnerResultRepository,
                                LearnerResultStepRepository learnerResultStepRepository) {
        this.learnerResultRepository = learnerResultRepository;
        this.learnerResultStepRepository = learnerResultStepRepository;
    }

    @Override
    @Transactional
    public void create(LearnerResult learnerResult) throws ValidationException {

        // pre validation
        if (learnerResult.getUser() == null || learnerResult.getProject() == null) {
            throw new ValidationException("To create a LearnResult it must have a User and Project.");
        }

        if (learnerResult.getTestNo() != null) {
            throw new ValidationException("To create a LearnResult it must not have a test no.");
        }

        // get the current highest test no in the project and add 1 for the next id
        Long maxTestNo = learnerResultRepository.findHighestTestNo(learnerResult.getUserId(),
                                                                   learnerResult.getProjectId());
        if (maxTestNo == null) {
            maxTestNo = -1L;
        }

        long nextTestNo = maxTestNo + 1;

        learnerResult.setId(0L);
        learnerResult.setTestNo(nextTestNo);

        try {
            LearnerResult learnerResultSaved = learnerResultRepository.save(learnerResult);
            learnerResult.setId(learnerResultSaved.getId());
        } catch (DataIntegrityViolationException e) {
            LOGGER.info("LearnerResult creation failed:", e);
            throw new ValidationException("LearnerResult could not be created.", e);
        }

    }

    @Override
    @Transactional(readOnly = true)
    public List<LearnerResult> getAll(Long userId, Long projectId, boolean includeSteps) throws NotFoundException {
        List<LearnerResult> results = learnerResultRepository.findByUser_IdAndProject_IdOrderByTestNoAsc(userId,
                                                                                                         projectId);
        if (results.isEmpty()) {
            throw new NotFoundException("The project with the id " + projectId + " was not found.");
        }

        initializeLazyRelations(results, includeSteps);

        return results;
    }

    @Override
    @Transactional(readOnly = true)
    public List<LearnerResult> getAll(Long userId, Long projectId, Long[] testNos, boolean includeSteps)
            throws NotFoundException {
        List<LearnerResult> results = learnerResultRepository.findByUser_IdAndProject_IdAndTestNoIn(userId,
                                                                                                    projectId,
                                                                                                    testNos);
        if (results.size() != testNos.length) {
            throw new NotFoundException("Not all Results with the test nos. " + Arrays.toString(testNos)
                                                + " in the Project " + projectId + " for the user " + userId
                                                + " were found.");
        }

        initializeLazyRelations(results, includeSteps);

        return results;
    }

    @Override
    @Transactional(readOnly = true)
    public LearnerResult get(Long userId, Long projectId, Long testNo, boolean includeSteps) throws NotFoundException {
        Long[] testNos = new Long[] {testNo};
        List<LearnerResult> results = learnerResultRepository.findByUser_IdAndProject_IdAndTestNoIn(userId,
                                                                                                    projectId,
                                                                                                    testNos);
        if (results.size() != 1) {
            throw new NotFoundException("Could not find the Result with the test nos. " + testNo
                                                + " in the Project " + projectId + " for the User " + userId
                                                + " were found.");
        }

        initializeLazyRelations(results, includeSteps);

        return results.get(0);
    }

    @Override
    @Transactional
    public LearnerResultStep createStep(LearnerResult result)
            throws ValidationException {
        final LearnerResultStep latestStep = result.getSteps().get(result.getSteps().size() - 1);

        final LearnerResultStep step = new LearnerResultStep();
        step.setUser(result.getUser());
        step.setProject(result.getProject());
        step.setResult(result);
        result.getSteps().add(step);
        step.setStepNo(latestStep.getStepNo() + 1);

        step.setEqOracle(latestStep.getEqOracle());
        if (latestStep.getStepsToLearn() > 0) {
            step.setStepsToLearn(latestStep.getStepsToLearn() - 1);
        } else if (latestStep.getStepsToLearn() == -1) {
            step.setStepsToLearn(-1);
        } else {
            throw new IllegalStateException("The previous step has a step to learn of 0 -> no new step can be crated!");
        }

        learnerResultStepRepository.save(step);

        return step;
    }

    @Override
    @Transactional
    public LearnerResultStep createStep(LearnerResult result, LearnerConfiguration configuration)
            throws ValidationException {

        final LearnerResultStep step = new LearnerResultStep();
        step.setUser(result.getUser());
        step.setProject(result.getProject());
        step.setResult(result);
        step.setStepNo((long) result.getSteps().size() + 1);

        step.setEqOracle(configuration.getEqOracle());
        step.setStepsToLearn(configuration.getMaxAmountOfStepsToLearn());

        return step;
    }

    @Override
    @Transactional
    public void saveStep(LearnerResult result, LearnerResultStep step) throws ValidationException {
        learnerResultStepRepository.save(step);
        updateSummary(result, step);
        learnerResultRepository.save(result);
    }

    @Override
    @Transactional(rollbackFor = NotFoundException.class)
    public void delete(Learner learner, User user, Long projectId, Long... testNo)
            throws NotFoundException, ValidationException {
        checkIfResultsCanBeDeleted(learner, user, projectId, testNo); // check before the session is opened

        Long amountOfDeletedResults = learnerResultRepository.deleteByUserAndProject_IdAndTestNoIn(user,
                                                                                                   projectId,
                                                                                                   testNo);
        if (amountOfDeletedResults != testNo.length) {
            throw new NotFoundException("Could not delete all results!");
        }
    }

    private void updateSummary(LearnerResult result, LearnerResultStep step) {
        result.setHypothesis(step.getHypothesis());
        result.setErrorText(step.getErrorText());
        result.getStatistics().updateBy(step.getStatistics());
    }

    private void initializeLazyRelations(List<LearnerResult> results, boolean includeSteps) {
        results.forEach(r -> Hibernate.initialize(r.getResetSymbol()));
        results.forEach(r -> Hibernate.initialize(r.getSymbols()));
        if (includeSteps) {
            results.forEach(r -> Hibernate.initialize(r.getSteps()));
        } else {
            results.forEach(r -> r.setSteps(null));
        }
    }

    private void checkIfResultsCanBeDeleted(Learner learner, User user, Long projectId, Long... testNo)
            throws ValidationException {
        // don't delete the learnResult of the active learning process
        LearnerStatus status = learner.getStatus(user);

        // user has no active thread -> no conflict possible
        if (!status.isActive()) {
            return;
        }

        Long activeTestNo = status.getTestNo();
        Long activeProjectId = status.getProjectId();

        if (projectId.equals(activeProjectId)) {
            if (testNo.length == 1 && activeTestNo.equals(testNo[0])) {
                throw new ValidationException("Can't delete LearnResult with testNo " + activeTestNo + " because the "
                                                      + "learner is active on this one");
            } else if (testNo.length > 1) {
                for (Long t : testNo) {
                    if (activeTestNo.equals(t)) {
                        throw new ValidationException("Can't delete all LearnResults because the learner is active "
                                                              + "with testNo " + activeTestNo);
                    }
                }
            }
        }
    }

}
