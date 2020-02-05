/*
 * Copyright 2015 - 2020 TU Dortmund
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
import de.learnlib.alex.data.entities.Project;
import de.learnlib.alex.learning.entities.LearnerResult;
import de.learnlib.alex.learning.entities.LearnerResultStep;
import de.learnlib.alex.learning.repositories.LearnerResultRepository;
import de.learnlib.alex.learning.repositories.LearnerResultStepRepository;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.apache.shiro.authz.UnauthorizedException;
import org.hibernate.Hibernate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import javax.validation.ValidationException;
import java.util.List;

/**
 * Implementation of a LearnerResultDAO using Spring Data.
 */
@Service
@Transactional(rollbackFor = Exception.class)
public class LearnerResultDAO {

    private static final Logger LOGGER = LogManager.getLogger();

    /** The ProjectDAO to use. Will be injected. */
    private ProjectDAO projectDAO;

    /** The LearnerResultRepository to use. Will be injected. */
    private LearnerResultRepository learnerResultRepository;

    /** The LearnerResultStepRepository to use. Will be injected. */
    private LearnerResultStepRepository learnerResultStepRepository;

    private LearnerSetupDAO learnerSetupDAO;

    /** The entity manager. */
    private EntityManager entityManager;

    /**
     * Creates a new LearnerResultDAO.
     *
     * @param projectDAO
     *         The ProjectDAO to use.
     * @param learnerResultRepository
     *         The LearnerResultRepository to use.
     * @param learnerResultStepRepository
     *         The {@link LearnerResultStepRepository} to use.
     * @param entityManager
     *         The entity manager.
     */
    @Autowired
    public LearnerResultDAO(ProjectDAO projectDAO, LearnerResultRepository learnerResultRepository,
                            LearnerResultStepRepository learnerResultStepRepository, EntityManager entityManager,
                            LearnerSetupDAO learnerSetupDAO) {
        this.projectDAO = projectDAO;
        this.learnerResultRepository = learnerResultRepository;
        this.learnerResultStepRepository = learnerResultStepRepository;
        this.entityManager = entityManager;
        this.learnerSetupDAO = learnerSetupDAO;
    }

    public LearnerResult create(User user, Project project, LearnerResult learnerResult) throws NotFoundException, ValidationException {
        projectDAO.checkAccess(user, project);
        learnerResult.setProject(project);

        // get the current highest test no in the project and add 1 for the next id
        Long maxTestNo = learnerResultRepository.findHighestTestNo(learnerResult.getProjectId());
        if (maxTestNo == null) {
            maxTestNo = -1L;
        }

        long nextTestNo = maxTestNo + 1;
        learnerResult.setTestNo(nextTestNo);

        try {
            final LearnerResult createdLearnerResult = learnerResultRepository.saveAndFlush(learnerResult);
            initializeLazyRelations(learnerResult);
            return createdLearnerResult;
        } catch (DataIntegrityViolationException e) {
            LOGGER.info("LearnerResult creation failed:", e);
            throw new ValidationException("LearnerResult could not be created.", e);
        }
    }

    public List<LearnerResult> getAll(User user, Long projectId)
            throws NotFoundException {
        projectDAO.getByID(user, projectId); // access check

        final List<LearnerResult> results = learnerResultRepository.findByProject_Id(projectId);
        results.forEach(this::initializeLazyRelations);

        return results;
    }

    public List<LearnerResult> getAll(User user, Long projectId, List<Long> testNos)
            throws NotFoundException {
        projectDAO.getByID(user, projectId); // access check

        final List<LearnerResult> results = learnerResultRepository.findByProject_IdAndTestNoIn(projectId, testNos);
        results.forEach(this::initializeLazyRelations);

        return results;
    }

    public Page<LearnerResult> getAll(User user, Long projectId, PageRequest pr)
            throws NotFoundException {
        projectDAO.getByID(user, projectId); // access check

        final Page<LearnerResult> results = learnerResultRepository.findByProject_Id(projectId, pr);
        results.forEach(this::initializeLazyRelations);

        return results;
    }

    public LearnerResult getLatest(User user, Long projectId) throws NotFoundException {
        projectDAO.getByID(user, projectId);

        final LearnerResult result = learnerResultRepository.findFirstByProject_IdOrderByTestNoDesc(projectId);
        if (result != null) {
            initializeLazyRelations(result);
            return result;
        } else {
            return null;
        }
    }

    public LearnerResult get(User user, Long projectId, Long testNo) throws NotFoundException {
        final Project project = projectDAO.getByID(user, projectId); // access check
        final LearnerResult result = learnerResultRepository.findOneByProject_IdAndTestNo(projectId, testNo);
        checkAccess(user, project, result);

        initializeLazyRelations(result);

        return result;
    }

    public LearnerResultStep createStep(LearnerResult result) throws ValidationException {
        final LearnerResultStep latestStep = result.getSteps().get(result.getSteps().size() - 1);

        final LearnerResultStep step = new LearnerResultStep();
        step.setResult(result);
        result.getSteps().add(step);
        step.setStepNo(latestStep.getStepNo() + 1);
        step.setEqOracle(latestStep.getEqOracle());

        learnerResultStepRepository.save(step);

        return step;
    }

    public LearnerResult copy(User user, Long projectId, Long testNo) throws NotFoundException, UnauthorizedException {
        final Project project = projectDAO.getByID(user, projectId);
        final LearnerResult result = learnerResultRepository.findOneByProject_IdAndTestNo(projectId, testNo);
        checkAccess(user, project, result);

        final LearnerResult resultToClone = new LearnerResult();
        resultToClone.setTestNo(learnerResultRepository.findHighestTestNo(projectId) + 1);
        resultToClone.setComment(result.getComment());
        resultToClone.setProject(project);
        resultToClone.setSetup(learnerSetupDAO.copy(user, projectId, result.getSetup().getId(), false));
        learnerResultRepository.save(resultToClone);

        result.getSteps().forEach(step -> {
            entityManager.detach(step);
            step.setId(null);
            step.setResult(resultToClone);
            resultToClone.getSteps().add(step);
        });

        learnerResultStepRepository.saveAll(resultToClone.getSteps());
        learnerResultRepository.save(resultToClone);

        initializeLazyRelations(resultToClone);

        return resultToClone;
    }

    public LearnerResultStep createStep(LearnerResult result, LearnerResultStep step) {
        step.setResult(result);
        step.setStepNo(result.getSteps().size() + 1L);
        result.getSteps().add(step);
        return learnerResultStepRepository.save(step);
    }

    public LearnerResultStep updateStep(LearnerResultStep step) {
        return learnerResultStepRepository.save(step);
    }

    public void deleteAll(User user, Long projectId, List<Long> testNos)
            throws NotFoundException, ValidationException {
        final Project project = projectDAO.getByID(user, projectId);
        final List<LearnerResult> results = learnerResultRepository.findByProject_IdAndTestNoIn(projectId, testNos);
        for (LearnerResult result: results) {
            checkAccess(user, project, result);
        }
        checkIfResultsCanBeDeleted(results);
        learnerResultRepository.deleteByProject_IdAndTestNoIn(projectId, testNos);
    }

    public void initializeLazyRelations(LearnerResult result) {
        learnerSetupDAO.initializeLazyRelations(result.getSetup());
        Hibernate.initialize(result.getSteps());
    }

    private void checkIfResultsCanBeDeleted(List<LearnerResult> results)
            throws ValidationException {
        if (results.stream().anyMatch(r -> r.getStatus().equals(LearnerResult.Status.IN_PROGRESS))) {
            throw new ValidationException("Can't delete all LearnResults because the learner is active");
        }
    }

    public void checkAccess(User user, Project project, LearnerResult learnerResult)
            throws NotFoundException, UnauthorizedException {
        projectDAO.checkAccess(user, project);

        if (learnerResult == null) {
            throw new NotFoundException("The learner result could not be found.");
        }

        if (!learnerResult.getProjectId().equals(project.getId())) {
            throw new UnauthorizedException("You are not allowed to access the learner result.");
        }
    }
}
