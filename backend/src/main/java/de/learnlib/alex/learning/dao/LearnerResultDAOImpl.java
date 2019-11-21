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

package de.learnlib.alex.learning.dao;

import de.learnlib.alex.auth.entities.User;
import de.learnlib.alex.common.exceptions.NotFoundException;
import de.learnlib.alex.data.dao.ProjectDAO;
import de.learnlib.alex.data.dao.SymbolDAOImpl;
import de.learnlib.alex.data.entities.ParameterizedSymbol;
import de.learnlib.alex.data.entities.Project;
import de.learnlib.alex.data.entities.ProjectEnvironment;
import de.learnlib.alex.data.repositories.ParameterizedSymbolRepository;
import de.learnlib.alex.data.repositories.ProjectEnvironmentRepository;
import de.learnlib.alex.data.repositories.SymbolParameterValueRepository;
import de.learnlib.alex.learning.entities.AbstractLearnerConfiguration;
import de.learnlib.alex.learning.entities.LearnerResult;
import de.learnlib.alex.learning.entities.LearnerResultStep;
import de.learnlib.alex.learning.entities.webdrivers.AbstractWebDriverConfig;
import de.learnlib.alex.learning.repositories.LearnerResultRepository;
import de.learnlib.alex.learning.repositories.LearnerResultStepRepository;
import de.learnlib.alex.learning.services.LearnerService;
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

    private ProjectEnvironmentRepository projectEnvironmentRepository;

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
            SymbolParameterValueRepository symbolParameterValueRepository,
            ProjectEnvironmentRepository projectEnvironmentRepository) {
        this.projectDAO = projectDAO;
        this.learnerResultRepository = learnerResultRepository;
        this.learnerResultStepRepository = learnerResultStepRepository;
        this.entityManager = entityManager;
        this.parameterizedSymbolRepository = parameterizedSymbolRepository;
        this.symbolParameterValueRepository = symbolParameterValueRepository;
        this.projectEnvironmentRepository = projectEnvironmentRepository;
    }

    @Override
    @Transactional
    public LearnerResult create(User user, LearnerResult learnerResult) throws NotFoundException, ValidationException {
        // pre validation
        if (user == null || learnerResult.getProject() == null) {
            throw new ValidationException("To create a LearnResult it must have a User and Project.");
        }
        projectDAO.getByID(user, learnerResult.getProjectId()); // access check

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

        symbolParameterValueRepository.saveAll(learnerResult.getResetSymbol().getParameterValues());
        learnerResult.getSymbols().forEach(s -> symbolParameterValueRepository.saveAll(s.getParameterValues()));
        parameterizedSymbolRepository.save(learnerResult.getResetSymbol());
        parameterizedSymbolRepository.saveAll(learnerResult.getSymbols());
        if (learnerResult.getPostSymbol() != null) {
            symbolParameterValueRepository.saveAll(learnerResult.getPostSymbol().getParameterValues());
            parameterizedSymbolRepository.save(learnerResult.getPostSymbol());
        }

        try {
            LearnerResult createdLearnerResult = learnerResultRepository.saveAndFlush(learnerResult);
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
        projectDAO.getByID(user, projectId); // access check

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
        projectDAO.getByID(user, projectId); // access check

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
        projectDAO.getByID(user, projectId);

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
        projectDAO.getByID(user, projectId); // access check

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
    @Transactional(rollbackFor = Exception.class)
    public LearnerResult clone(User user, Long projectId, Long testNo) throws NotFoundException, UnauthorizedException {
        final Project project = projectDAO.getByID(user, projectId);
        final LearnerResult result = learnerResultRepository.findOneByProject_IdAndTestNo(projectId, testNo);
        initializeLazyRelations(Collections.singletonList(result), true);
        checkAccess(user, project, result);

        final LearnerResult resultToClone = new LearnerResult();
        resultToClone.setTestNo(learnerResultRepository.findHighestTestNo(projectId) + 1);
        resultToClone.setUseMQCache(result.isUseMQCache());
        resultToClone.setAlgorithm(result.getAlgorithm());
        resultToClone.setComment(result.getComment());
        resultToClone.setProject(project);
        resultToClone.setEnvironments(projectEnvironmentRepository.findAllByIdIn(result.getEnvironments().stream()
                .map(ProjectEnvironment::getId)
                .collect(Collectors.toList())));

        final AbstractWebDriverConfig driverConfig = result.getDriverConfig();
        entityManager.detach(driverConfig);
        driverConfig.setId(null);
        resultToClone.setDriverConfig(driverConfig);

        resultToClone.setResetSymbol(result.getResetSymbol().copy());
        resultToClone.setSymbols(result.getSymbols().stream()
                .map(ParameterizedSymbol::copy)
                .collect(Collectors.toList()));
        if (result.getPostSymbol() != null) {
            resultToClone.setPostSymbol(result.getPostSymbol().copy());
        }

        resultToClone.getSymbols().forEach(s -> symbolParameterValueRepository.saveAll(s.getParameterValues()));
        parameterizedSymbolRepository.save(resultToClone.getResetSymbol());
        parameterizedSymbolRepository.saveAll(resultToClone.getSymbols());
        resultToClone.getSymbols().forEach(ps -> symbolParameterValueRepository.saveAll(ps.getParameterValues()));
        if (resultToClone.getPostSymbol() != null) {
            symbolParameterValueRepository.saveAll(resultToClone.getPostSymbol().getParameterValues());
            parameterizedSymbolRepository.save(resultToClone.getPostSymbol());
        }

        learnerResultRepository.save(resultToClone);

        result.getSteps().forEach(step -> {
            entityManager.detach(step);
            step.setId(null);
            step.setResult(resultToClone);
            resultToClone.getSteps().add(step);
        });

        learnerResultStepRepository.saveAll(resultToClone.getSteps());
        learnerResultRepository.save(resultToClone);

        initializeLazyRelations(Collections.singletonList(resultToClone), true);

        return resultToClone;
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
        learnerResultRepository.save(result);
    }

    @Override
    @Transactional(rollbackFor = NotFoundException.class)
    public void delete(LearnerService learnerService, Long projectId, List<Long> testNos)
            throws NotFoundException, ValidationException {
        final List<LearnerResult> results = learnerResultRepository.findByProject_IdAndTestNoIn(projectId, testNos);
        checkIfResultsCanBeDeleted(results);
        results.forEach(result -> {
            parameterizedSymbolRepository.delete(result.getResetSymbol());
            parameterizedSymbolRepository.deleteAll(result.getSymbols());
            if (result.getPostSymbol() != null) {
                parameterizedSymbolRepository.delete(result.getPostSymbol());
            }
        });

        Long amountOfDeletedResults = learnerResultRepository.deleteByProject_IdAndTestNoIn(projectId, testNos);
        if (amountOfDeletedResults != testNos.size()) {
            throw new NotFoundException("Could not delete all results!");
        }
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

            Hibernate.initialize(r.getEnvironments());
            Hibernate.initialize(r.getDriverConfig());

            if (includeSteps) {
                Hibernate.initialize(r.getSteps());
            }
        });
    }

    private void checkIfResultsCanBeDeleted(List<LearnerResult> results)
            throws ValidationException {
        if (results.stream().anyMatch(r -> r.getStatus().equals(LearnerResult.Status.IN_PROGRESS))) {
            throw new ValidationException("Can't delete all LearnResults because the learner is active");
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
