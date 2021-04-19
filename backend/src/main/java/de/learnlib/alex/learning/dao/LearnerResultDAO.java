/*
 * Copyright 2015 - 2021 TU Dortmund
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
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;
import javax.persistence.EntityManager;
import javax.validation.ValidationException;
import org.apache.shiro.authz.UnauthorizedException;
import org.hibernate.Hibernate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Implementation of a LearnerResultDAO using Spring Data.
 */
@Service
@Transactional(rollbackFor = Exception.class)
public class LearnerResultDAO {

    private final EntityManager entityManager;
    private final ProjectDAO projectDAO;
    private final LearnerResultRepository learnerResultRepository;
    private final LearnerResultStepRepository learnerResultStepRepository;
    private final LearnerSetupDAO learnerSetupDAO;
    private final LearnerResultStepDAO learnerResultStepDAO;

    @Autowired
    public LearnerResultDAO(
            ProjectDAO projectDAO,
            LearnerResultRepository learnerResultRepository,
            LearnerResultStepRepository learnerResultStepRepository,
            LearnerSetupDAO learnerSetupDAO,
            EntityManager entityManager,
            LearnerResultStepDAO learnerResultStepDAO
    ) {
        this.projectDAO = projectDAO;
        this.learnerResultRepository = learnerResultRepository;
        this.learnerResultStepRepository = learnerResultStepRepository;
        this.learnerSetupDAO = learnerSetupDAO;
        this.entityManager = entityManager;
        this.learnerResultStepDAO = learnerResultStepDAO;
    }

    public LearnerResult create(User user, Long projectId, LearnerResult learnerResult) {
        final var project = projectDAO.getByID(user, projectId);
        projectDAO.checkAccess(user, project);

        learnerResult.setProject(project);
        learnerResult.setExecutedBy(user);

        // get the current highest test no in the project and add 1 for the next id
        var highestTestNo = learnerResultRepository.findHighestTestNo(learnerResult.getProjectId());
        if (highestTestNo == null) {
            highestTestNo = -1L;
        }

        var nextTestNo = highestTestNo + 1;
        learnerResult.setTestNo(nextTestNo);

        final LearnerResult createdLearnerResult = learnerResultRepository.save(learnerResult);
        initializeLazyRelations(learnerResult);
        return createdLearnerResult;
    }

    public List<LearnerResult> getByIDs(User user, Long projectId, List<Long> resultIds) {
        final var project = projectDAO.getByID(user, projectId);

        final var results = learnerResultRepository.findByIdIn(resultIds);
        for (var result : results) {
            checkAccess(user, project, result);
            initializeLazyRelations(result);
        }

        return results;
    }

    public List<LearnerResult> getAll(User user, Long projectId) {
        projectDAO.getByID(user, projectId); // access check

        final var results = learnerResultRepository.findByProject_Id(projectId);
        results.forEach(this::initializeLazyRelations);

        return results;
    }

    public List<LearnerResult> getAll(User user, Long projectId, List<Long> testNos) {
        final var project = projectDAO.getByID(user, projectId); // access check

        final var results = learnerResultRepository.findByProject_IdAndTestNoIn(projectId, testNos);
        for (var result : results) {
            checkAccess(user, project, result);
            initializeLazyRelations(result);
        }

        return results;
    }

    public Page<LearnerResult> getAll(User user, Long projectId, PageRequest pr) {
        projectDAO.getByID(user, projectId); // access check

        final var results = learnerResultRepository.findByProject_Id(projectId, pr);
        results.forEach(this::initializeLazyRelations);

        return results;
    }

    public LearnerResult getLatest(User user, Long projectId) {
        projectDAO.getByID(user, projectId);

        final var result = learnerResultRepository.findFirstByProject_IdOrderByTestNoDesc(projectId);

        if (result != null) {
            initializeLazyRelations(result);
            return result;
        } else {
            return null;
        }
    }

    public LearnerResult getByTestNo(User user, Long projectId, Long testNo) {
        final Project project = projectDAO.getByID(user, projectId); // access check
        final LearnerResult result = learnerResultRepository.findOneByProject_IdAndTestNo(projectId, testNo);
        checkAccess(user, project, result);

        initializeLazyRelations(result);

        return result;
    }

    public LearnerResult getByID(User user, Long projectId, Long resultId) {
        final Project project = projectDAO.getByID(user, projectId); // access check
        final LearnerResult result = learnerResultRepository.getOne(resultId);
        checkAccess(user, project, result);

        initializeLazyRelations(result);

        return result;
    }

    public List<LearnerResult> abortActiveLearnerResults() {
        final List<LearnerResult> pendingLearnerProcesses = learnerResultRepository.findAllByStatusIn(
                Arrays.asList(LearnerResult.Status.IN_PROGRESS, LearnerResult.Status.PENDING)
        );
        pendingLearnerProcesses.forEach(p -> p.setStatus(LearnerResult.Status.ABORTED));
        return learnerResultRepository.saveAll(pendingLearnerProcesses);
    }

    public LearnerResult updateStatus(Long resultId, LearnerResult.Status status) {
        var result = learnerResultRepository.findById(resultId)
                .orElseThrow(() -> new NotFoundException("result not found."));

        result.setStatus(status);
        result = learnerResultRepository.save(result);

        initializeLazyRelations(result);
        return result;
    }

    public LearnerResult copy(User user, Long projectId, Long testNo) {
        final var project = projectDAO.getByID(user, projectId);
        final var result = learnerResultRepository.findOneByProject_IdAndTestNo(projectId, testNo);
        checkAccess(user, project, result);

        final var resultToClone = new LearnerResult();
        resultToClone.setTestNo(learnerResultRepository.findHighestTestNo(projectId) + 1);
        resultToClone.setComment(result.getComment());
        resultToClone.setProject(project);
        resultToClone.setSetup(learnerSetupDAO.copy(user, projectId, result.getSetup().getId(), false));
        learnerResultRepository.save(resultToClone);

        for (var step : result.getSteps()) {
            entityManager.detach(step);
            step.setId(null);
            step.setResult(resultToClone);
            step.setModelCheckingResults(new ArrayList<>());
            resultToClone.getSteps().add(step);
        }

        learnerResultStepRepository.saveAll(resultToClone.getSteps());
        learnerResultRepository.save(resultToClone);

        initializeLazyRelations(resultToClone);

        return resultToClone;
    }

    public LearnerResult addStep(Long resultId, LearnerResultStep step) {
        var result = learnerResultRepository.findById(resultId)
                .orElseThrow(() -> new NotFoundException("result not found"));

        step.setStepNo(result.getSteps().size() + 1L);
        step.setResult(result);
        final var createdStep = learnerResultStepRepository.save(step);

        result.getSteps().add(createdStep);

        final var updatedResult = learnerResultRepository.save(result);
        initializeLazyRelations(updatedResult);

        return updatedResult;
    }

    public LearnerResult removeSteps(Long resultId, List<LearnerResultStep> steps) {
        final var result = learnerResultRepository.findById(resultId)
                .orElseThrow(() -> new NotFoundException("result not found"));

        final var stepIds = steps.stream()
                .map(LearnerResultStep::getId)
                .collect(Collectors.toList());

        learnerResultStepRepository.deleteAllByIdIn(stepIds);

        result.getSteps().removeIf(s -> stepIds.contains(s.getId()));
        result.getStatistics().setEqsUsed(result.getSteps().size());
        final var updatedResult = learnerResultRepository.save(result);

        initializeLazyRelations(updatedResult);
        return updatedResult;
    }

    public void deleteByTestNos(User user, Long projectId, List<Long> testNos) {
        final var project = projectDAO.getByID(user, projectId);
        final var results = learnerResultRepository.findByProject_IdAndTestNoIn(projectId, testNos);

        for (LearnerResult result : results) {
            checkAccess(user, project, result);
        }

        checkIfResultsCanBeDeleted(results);

        learnerResultRepository.deleteByProject_IdAndTestNoIn(projectId, testNos);
    }

    public void initializeLazyRelations(LearnerResult result) {
        learnerSetupDAO.loadLazyRelations(result.getSetup());
        Hibernate.initialize(result.getSteps());
        result.getSteps().forEach(learnerResultStepDAO::loadLazyRelations);
    }

    private void checkIfResultsCanBeDeleted(List<LearnerResult> results) {
        final var learnerIsActive = results.stream()
                .anyMatch(r -> r.getStatus().equals(LearnerResult.Status.IN_PROGRESS));

        if (learnerIsActive) {
            throw new ValidationException("Can't delete all LearnResults because the learner is active");
        }
    }

    public void checkAccess(User user, Project project, LearnerResult learnerResult) {
        projectDAO.checkAccess(user, project);

        if (learnerResult == null) {
            throw new NotFoundException("The learner result could not be found.");
        }

        if (!learnerResult.getProject().getId().equals(project.getId())) {
            throw new UnauthorizedException("You are not allowed to access the learner result.");
        }
    }
}
