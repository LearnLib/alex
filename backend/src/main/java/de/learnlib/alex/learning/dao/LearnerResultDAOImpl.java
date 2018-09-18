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
import de.learnlib.alex.data.dao.SymbolDAOImpl;
import de.learnlib.alex.data.entities.ParameterizedSymbol;
import de.learnlib.alex.data.entities.Project;
import de.learnlib.alex.data.repositories.ParameterizedSymbolRepository;
import de.learnlib.alex.data.repositories.SymbolParameterValueRepository;
import de.learnlib.alex.learning.entities.AbstractLearnerConfiguration;
import de.learnlib.alex.learning.entities.LearnerResult;
import de.learnlib.alex.learning.entities.LearnerResultStep;
import de.learnlib.alex.learning.entities.LearnerStatus;
import de.learnlib.alex.learning.repositories.LearnerResultRepository;
import de.learnlib.alex.learning.repositories.LearnerResultStepRepository;
import de.learnlib.alex.learning.services.Learner;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.apache.shiro.authz.UnauthorizedException;
import org.hibernate.Hibernate;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.inject.Inject;
import javax.persistence.EntityManager;
import javax.validation.ValidationException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

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

    /** The repository for parameterized symbols. */
    private ParameterizedSymbolRepository parameterizedSymbolRepository;

    /** The repository for symbol parameter values. */
    private SymbolParameterValueRepository symbolParameterValueRepository;

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
     * @param parameterizedSymbolRepository
     *         The repository for parameterized symbols.
     * @param symbolParameterValueRepository
     *         The repository for symbol parameter values.
     */
    @Inject
    public LearnerResultDAOImpl(ProjectDAO projectDAO, LearnerResultRepository learnerResultRepository,
            LearnerResultStepRepository learnerResultStepRepository, EntityManager entityManager,
            ParameterizedSymbolRepository parameterizedSymbolRepository,
            SymbolParameterValueRepository symbolParameterValueRepository) {
        this.projectDAO = projectDAO;
        this.learnerResultRepository = learnerResultRepository;
        this.learnerResultStepRepository = learnerResultStepRepository;
        this.entityManager = entityManager;
        this.parameterizedSymbolRepository = parameterizedSymbolRepository;
        this.symbolParameterValueRepository = symbolParameterValueRepository;
    }

    @Override
    @Transactional
    public LearnerResult create(User user, LearnerResult learnerResult) throws NotFoundException, ValidationException {
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
        learnerResult.setTestNo(nextTestNo);

        symbolParameterValueRepository.save(learnerResult.getResetSymbol().getParameterValues());
        learnerResult.getSymbols().forEach(s -> symbolParameterValueRepository.save(s.getParameterValues()));
        parameterizedSymbolRepository.save(learnerResult.getResetSymbol());
        parameterizedSymbolRepository.save(learnerResult.getSymbols());
        if (learnerResult.getPostSymbol() != null) {
            symbolParameterValueRepository.save(learnerResult.getPostSymbol().getParameterValues());
            parameterizedSymbolRepository.save(learnerResult.getPostSymbol());
        }

        try {
            LearnerResult createdLearnerResult = learnerResultRepository.save(learnerResult);
            initializeLazyRelations(Collections.singletonList(learnerResult), true);
            return createdLearnerResult;
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
    public List<LearnerResult> getAll(User user, Long projectId, List<Long> testNos, boolean includeSteps)
            throws NotFoundException {
        projectDAO.getByID(user.getId(), projectId); // access check

        List<LearnerResult> results = learnerResultRepository.findByProject_IdAndTestNoIn(projectId, testNos);
        if (results.size() != testNos.size()) {
            throw new NotFoundException("Not all Results with the test nos. " + testNos
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

        List<Long> testNos = Collections.singletonList(testNo);
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
    public LearnerResult clone(User user, Long projectId, Long testNo) throws NotFoundException, UnauthorizedException {
        final Project project = projectDAO.getByID(user.getId(), projectId, ProjectDAO.EmbeddableFields.ALL);
        final LearnerResult result = learnerResultRepository.findOneByProject_IdAndTestNo(projectId, testNo);
        initializeLazyRelations(Collections.singletonList(result), true);
        checkAccess(user, project, result);

        // temporarily save theses lists here, otherwise we get exceptions from hibernate or
        // the symbols are removed from the result to be cloned.
        final List<LearnerResultStep> steps = result.getSteps();
        final List<ParameterizedSymbol> symbols = result.getSymbols();

        entityManager.detach(result);
        final Long nextTestNo = learnerResultRepository.findHighestTestNo(projectId) + 1;
        result.setId(null);
        result.setTestNo(nextTestNo);
        result.setSteps(new ArrayList<>());
        result.setSymbols(new ArrayList<>());

        entityManager.detach(result.getDriverConfig());
        result.getDriverConfig().setId(null);

        final LearnerResult clonedResult = learnerResultRepository.save(result);

        steps.forEach(step -> {
            entityManager.detach(step);
            step.setId(null);
            step.setResult(clonedResult);
        });

        clonedResult.setResetSymbol(result.getResetSymbol().copy());
        clonedResult.setSymbols(symbols
                .stream()
                .map(ParameterizedSymbol::copy)
                .collect(Collectors.toList()));
        if (result.getPostSymbol() != null) {
            clonedResult.setPostSymbol(result.getPostSymbol().copy());
        }

        symbolParameterValueRepository.save(clonedResult.getResetSymbol().getParameterValues());
        clonedResult.getSymbols().forEach(s -> symbolParameterValueRepository.save(s.getParameterValues()));
        parameterizedSymbolRepository.save(clonedResult.getResetSymbol());
        parameterizedSymbolRepository.save(clonedResult.getSymbols());
        clonedResult.getSymbols().forEach(ps -> symbolParameterValueRepository.save(ps.getParameterValues()));
        if (clonedResult.getPostSymbol() != null) {
            symbolParameterValueRepository.save(clonedResult.getPostSymbol().getParameterValues());
            parameterizedSymbolRepository.save(clonedResult.getPostSymbol());
        }

        final List<LearnerResultStep> clonedSteps = learnerResultStepRepository.save(steps);
        clonedResult.setSteps(clonedSteps);

        learnerResultRepository.save(clonedResult);
        initializeLazyRelations(Collections.singletonList(clonedResult), true);
        return clonedResult;
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
    public void delete(Learner learner, Long projectId, List<Long> testNos)
            throws NotFoundException, ValidationException {
        checkIfResultsCanBeDeleted(learner, projectId, testNos);

        final List<LearnerResult> results = learnerResultRepository.findByProject_IdAndTestNoIn(projectId, testNos);
        results.forEach(result -> {
            parameterizedSymbolRepository.delete(result.getResetSymbol());
            parameterizedSymbolRepository.delete(result.getSymbols());
            if (result.getPostSymbol() != null) {
                parameterizedSymbolRepository.delete(result.getPostSymbol());
            }
        });

        Long amountOfDeletedResults = learnerResultRepository.deleteByProject_IdAndTestNoIn(projectId, testNos);
        if (amountOfDeletedResults != testNos.size()) {
            throw new NotFoundException("Could not delete all results!");
        }
    }

    private void updateSummary(LearnerResult result, LearnerResultStep step) {
        result.setHypothesis(step.getHypothesis());
        result.setErrorText(step.getErrorText());
        result.getStatistics().updateBy(step.getStatistics());
    }

    private void initializeLazyRelations(List<LearnerResult> results, boolean includeSteps) {
        results.forEach(r -> {
            Hibernate.initialize(r.getResetSymbol());
            Hibernate.initialize(r.getResetSymbol().getParameterValues());
            SymbolDAOImpl.loadLazyRelations(r.getResetSymbol().getSymbol());
            if (r.getPostSymbol() != null) {
                Hibernate.initialize(r.getPostSymbol());
                Hibernate.initialize(r.getPostSymbol().getParameterValues());
                SymbolDAOImpl.loadLazyRelations(r.getPostSymbol().getSymbol());
            }

            Hibernate.initialize(r.getSymbols());
            r.getSymbols().forEach(s -> {
                Hibernate.initialize(s.getParameterValues());
                SymbolDAOImpl.loadLazyRelations(s.getSymbol());
            });

            Hibernate.initialize(r.getUrls());
            Hibernate.initialize(r.getDriverConfig());

            if (includeSteps) {
                Hibernate.initialize(r.getSteps());
            }
        });
    }

    private void checkIfResultsCanBeDeleted(Learner learner, Long projectId, List<Long> testNos)
            throws ValidationException {
        // don't delete the learnResult of the active learning process
        LearnerStatus status = learner.getStatus(projectId);
        if (!status.isActive()) {
            return;
        }

        Long activeTestNo = status.getTestNo();
        Long activeProjectId = status.getProjectId();

        if (projectId.equals(activeProjectId)) {
            if (testNos.size() == 1 && activeTestNo.equals(testNos.get(0))) {
                throw new ValidationException("Can't delete LearnResult with testNo " + activeTestNo + " because the "
                        + "learner is active on this one");
            } else if (testNos.size() > 1) {
                for (Long t : testNos) {
                    if (activeTestNo.equals(t)) {
                        throw new ValidationException("Can't delete all LearnResults because the learner is active "
                                + "with testNo " + activeTestNo);
                    }
                }
            }
        }
    }

    @Override
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
