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

package de.learnlib.alex.learning.dao;

import de.learnlib.alex.auth.entities.User;
import de.learnlib.alex.common.exceptions.NotFoundException;
import de.learnlib.alex.data.dao.ProjectDAO;
import de.learnlib.alex.learning.entities.AbstractLearnerConfiguration;
import de.learnlib.alex.learning.entities.LearnerResult;
import de.learnlib.alex.learning.entities.LearnerResultStep;
import de.learnlib.alex.learning.entities.LearnerStatus;
import de.learnlib.alex.learning.repositories.LearnerResultRepository;
import de.learnlib.alex.learning.repositories.LearnerResultStepRepository;
import de.learnlib.alex.learning.services.Learner;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.hibernate.Hibernate;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.inject.Inject;
import javax.validation.ValidationException;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

/**
 * Implementation of a LearnerResultDAO using Spring Data.
 */
@Service
public class LearnerResultDAOImpl implements LearnerResultDAO {

    private static final Logger LOGGER = LogManager.getLogger();

    /** The ProjectDAO to use. Will be injected. */
    private ProjectDAO projectDAO;

    /** The LearnerResultRepository to use. Will be injected. */
    private LearnerResultRepository learnerResultRepository;

    /** The LearnerResultStepRepository to use. Will be injected. */
    private LearnerResultStepRepository learnerResultStepRepository;

    /**
     * Creates a new LearnerResultDAO.
     *
     * @param projectDAO
     *         The ProjectDAO to use.
     * @param learnerResultRepository
     *         The LearnerResultRepository to use.
     * @param learnerResultStepRepository
     *         The {@link LearnerResultStepRepository} to use.
     */
    @Inject
    public LearnerResultDAOImpl(ProjectDAO projectDAO, LearnerResultRepository learnerResultRepository,
                                LearnerResultStepRepository learnerResultStepRepository) {
        this.projectDAO = projectDAO;
        this.learnerResultRepository = learnerResultRepository;
        this.learnerResultStepRepository = learnerResultStepRepository;
    }

    @Override
    @Transactional
    public void create(User user, LearnerResult learnerResult) throws NotFoundException, ValidationException {
        // pre validation
        if (user == null || learnerResult.getProject() == null) {
            throw new ValidationException("To create a LearnResult it must have a User and Project.");
        }
        projectDAO.getByID(user.getId(), learnerResult.getProjectId()); // access check

        if (learnerResult.getTestNo() != null) {
            throw new ValidationException("To create a LearnResult it must not have a test no.");
        }

        // get the current highest test no in the project and add 1 for the next id
        Long maxTestNo = learnerResultRepository.findHighestTestNo(learnerResult.getProjectId());
        if (maxTestNo == null) {
            maxTestNo = -1L;
        }

        long nextTestNo = maxTestNo + 1;

        learnerResult.setUUID(null);
        learnerResult.setTestNo(nextTestNo);

        try {
            LearnerResult learnerResultSaved = learnerResultRepository.save(learnerResult);
            learnerResult.setUUID(learnerResultSaved.getUUID());
        } catch (DataIntegrityViolationException e) {
            LOGGER.info("LearnerResult creation failed:", e);
            throw new ValidationException("LearnerResult could not be created.", e);
        }

    }

    @Override
    @Transactional(readOnly = true)
    public List<LearnerResult> getAll(User user, Long projectId, boolean includeSteps) throws NotFoundException {
        projectDAO.getByID(user.getId(), projectId); // access check

        List<LearnerResult> results = learnerResultRepository.findByProject_IdOrderByTestNoAsc(projectId);

        if (!results.isEmpty()) {
            initializeLazyRelations(results, includeSteps);
        }

        return results;
    }

    @Override
    @Transactional(readOnly = true)
    public List<LearnerResult> getAll(User user, Long projectId, Long[] testNos, boolean includeSteps)
            throws NotFoundException {
        projectDAO.getByID(user.getId(), projectId); // access check

        List<LearnerResult> results = learnerResultRepository.findByProject_IdAndTestNoIn(projectId, testNos);
        if (results.size() != testNos.length) {
            throw new NotFoundException("Not all Results with the test nos. " + Arrays.toString(testNos)
                                                + " in the Project " + projectId + " for the user " + user
                                                + " were found.");
        }

        initializeLazyRelations(results, includeSteps);

        return results;
    }

    @Override
    @Transactional(readOnly = true)
    public LearnerResult getLatest(User user, Long projectId) throws NotFoundException {
        projectDAO.getByID(user.getId(), projectId);

        final LearnerResult result = learnerResultRepository.findFirstByProject_IdOrderByTestNoDesc(projectId);
        if (result != null) {
            initializeLazyRelations(Collections.singletonList(result), true);
            return result;
        } else {
            return null;
        }
    }

    @Override
    @Transactional(readOnly = true)
    public LearnerResult get(User user, Long projectId, Long testNo, boolean includeSteps) throws NotFoundException {
        projectDAO.getByID(user.getId(), projectId); // access check

        Long[] testNos = new Long[] {testNo};
        List<LearnerResult> results = learnerResultRepository.findByProject_IdAndTestNoIn(projectId, testNos);
        if (results.size() != 1) {
            throw new NotFoundException("Could not find the Result with the test nos. " + testNo
                                                + " in the Project " + projectId + " for the User " + user
                                                + " were found.");
        }

        initializeLazyRelations(results, includeSteps);

        return results.get(0);
    }

    @Override
    @Transactional
    public LearnerResultStep createStep(LearnerResult result) throws ValidationException {
        final LearnerResultStep latestStep = result.getSteps().get(result.getSteps().size() - 1);

        final LearnerResultStep step = new LearnerResultStep();
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
    public LearnerResultStep createStep(LearnerResult result, AbstractLearnerConfiguration configuration)
            throws ValidationException {
        final LearnerResultStep step = new LearnerResultStep();
        step.setResult(result);
        step.setStepNo((long) result.getSteps().size() + 1);

        step.setEqOracle(configuration.getEqOracle());
        step.setStepsToLearn(configuration.getMaxAmountOfStepsToLearn());

        return step;
    }

    @Override
    @Transactional
    public void saveStep(LearnerResult result, LearnerResultStep step)
            throws NotFoundException, ValidationException {
        learnerResultStepRepository.save(step);
        updateSummary(result, step);
        learnerResultRepository.save(result);
    }

    @Override
    @Transactional(rollbackFor = NotFoundException.class)
    public void delete(Learner learner, Long projectId, Long... testNo)
            throws NotFoundException, ValidationException {
        checkIfResultsCanBeDeleted(learner, projectId, testNo);

        Long amountOfDeletedResults = learnerResultRepository.deleteByProject_IdAndTestNoIn(
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

    private void checkIfResultsCanBeDeleted(Learner learner, Long projectId, Long... testNo)
            throws ValidationException {
        // don't delete the learnResult of the active learning process
        LearnerStatus status = learner.getStatus(projectId);

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
