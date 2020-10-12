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
import de.learnlib.alex.data.dao.ParameterizedSymbolDAO;
import de.learnlib.alex.data.dao.ProjectDAO;
import de.learnlib.alex.data.entities.ParameterizedSymbol;
import de.learnlib.alex.data.entities.Project;
import de.learnlib.alex.data.entities.ProjectEnvironment;
import de.learnlib.alex.data.repositories.ProjectEnvironmentRepository;
import de.learnlib.alex.data.repositories.ProjectRepository;
import de.learnlib.alex.learning.entities.LearnerSetup;
import de.learnlib.alex.learning.entities.WebDriverConfig;
import de.learnlib.alex.learning.repositories.LearnerResultRepository;
import de.learnlib.alex.learning.repositories.LearnerSetupRepository;
import org.hibernate.Hibernate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import javax.validation.ValidationException;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional(rollbackFor = Exception.class)
public class LearnerSetupDAO {

    private final LearnerSetupRepository learnerSetupRepository;
    private final ProjectRepository projectRepository;
    private final ProjectDAO projectDAO;
    private final ParameterizedSymbolDAO parameterizedSymbolDAO;
    private final LearnerResultRepository learnerResultRepository;
    private final ProjectEnvironmentRepository projectEnvironmentRepository;
    private final EntityManager entityManager;

    @Autowired
    public LearnerSetupDAO(LearnerSetupRepository learnerSetupRepository,
                           ParameterizedSymbolDAO parameterizedSymbolDAO,
                           ProjectRepository projectRepository,
                           ProjectDAO projectDAO,
                           LearnerResultRepository learnerResultRepository,
                           ProjectEnvironmentRepository projectEnvironmentRepository,
                           EntityManager entityManager) {
        this.learnerSetupRepository = learnerSetupRepository;
        this.projectDAO = projectDAO;
        this.projectRepository = projectRepository;
        this.parameterizedSymbolDAO = parameterizedSymbolDAO;
        this.learnerResultRepository = learnerResultRepository;
        this.projectEnvironmentRepository = projectEnvironmentRepository;
        this.entityManager = entityManager;
    }

    public List<LearnerSetup> getAll(User user, Long projectId) {
        final Project project = projectRepository.findById(projectId).orElse(null);
        projectDAO.checkAccess(user, project);

        final List<LearnerSetup> setups = learnerSetupRepository.findAllByProject_Id(projectId);
        setups.forEach(this::initializeLazyRelations);
        return setups;
    }

    public LearnerSetup getById(User user, Long projectId, Long setupId) {
        final Project project = projectRepository.findById(projectId).orElse(null);
        final LearnerSetup setup = learnerSetupRepository.findById(setupId).orElse(null);
        checkAccess(user, project, setup);
        initializeLazyRelations(setup);
        return setup;
    }

    public LearnerSetup update(User user, Long projectId, Long setupId, LearnerSetup setup) {
        final Project project = projectRepository.findById(projectId).orElse(null);
        final LearnerSetup setupInDb = learnerSetupRepository.findById(setupId).orElse(null);
        checkAccess(user, project, setupInDb);

        setupInDb.setName(setup.getName());
        setupInDb.setAlgorithm(setup.getAlgorithm());
        setupInDb.setEquivalenceOracle(setup.getEquivalenceOracle());
        setupInDb.setEnableCache(setup.isEnableCache());

        entityManager.detach(setup.getWebDriver());
        setup.getWebDriver().setId(null);
        setupInDb.setWebDriver(setup.getWebDriver());

        setupInDb.setEnvironments(projectEnvironmentRepository.findAllByIdIn(setup.getEnvironments().stream()
                .map(ProjectEnvironment::getId)
                .collect(Collectors.toList())));

        setupInDb.setPreSymbol(setup.getPreSymbol().copy());
        setupInDb.setSymbols(setup.getSymbols().stream()
                .map(ParameterizedSymbol::copy)
                .collect(Collectors.toList()));
        if (setup.getPostSymbol() != null) {
            setupInDb.setPostSymbol(setup.getPostSymbol().copy());
        }

        saveSymbols(setupInDb);

        final LearnerSetup updatedSetup = learnerSetupRepository.save(setupInDb);
        initializeLazyRelations(updatedSetup);
        return updatedSetup;
    }

    public LearnerSetup copy(User user, Long projectId, Long setupId, boolean saved) {
        final Project project = projectRepository.findById(projectId).orElse(null);
        final LearnerSetup setupInDb = learnerSetupRepository.findById(setupId).orElse(null);
        checkAccess(user, project, setupInDb);

        final LearnerSetup newSetup = new LearnerSetup();
        newSetup.setProject(project);
        newSetup.setName(setupInDb.getName());
        newSetup.setAlgorithm(setupInDb.getAlgorithm());
        newSetup.setEquivalenceOracle(setupInDb.getEquivalenceOracle());
        newSetup.setEnableCache(setupInDb.isEnableCache());
        newSetup.setSaved(saved);

        final WebDriverConfig webDriverConfig = setupInDb.getWebDriver();
        entityManager.detach(webDriverConfig);
        webDriverConfig.setId(null);

        newSetup.setWebDriver(webDriverConfig);
        newSetup.setEnvironments(projectEnvironmentRepository.findAllByIdIn(setupInDb.getEnvironments().stream()
                .map(ProjectEnvironment::getId)
                .collect(Collectors.toList())));

        newSetup.setPreSymbol(setupInDb.getPreSymbol().copy());
        newSetup.setSymbols(setupInDb.getSymbols().stream()
                .map(ParameterizedSymbol::copy)
                .collect(Collectors.toList()));
        newSetup.setPostSymbol(setupInDb.getPostSymbol() == null ? null : setupInDb.getPostSymbol().copy());

        saveSymbols(newSetup);

        final LearnerSetup copiedSetup = learnerSetupRepository.save(newSetup);
        initializeLazyRelations(copiedSetup);
        return copiedSetup;
    }

    public LearnerSetup create(User user, Long projectId, LearnerSetup setup) {
        final Project project = projectRepository.findById(projectId).orElse(null);
        projectDAO.checkAccess(user, project);

        saveSymbols(setup);

        setup.setProject(project);
        setup.setId(null);
        setup.getWebDriver().setId(null);
        final LearnerSetup createdSetup = learnerSetupRepository.save(setup);
        initializeLazyRelations(createdSetup);
        return createdSetup;
    }

    public void delete(User user, Long projectId, Long setupId) {
        final Project project = projectRepository.findById(projectId).orElse(null);
        final LearnerSetup setup = learnerSetupRepository.findById(setupId).orElse(null);
        checkAccess(user, project, setup);

        if (learnerResultRepository.countAllBySetup_Id(setupId) > 0) {
            throw new ValidationException("The setup cannot be deleted because it is referenced by a learner result.");
        } else {
            learnerSetupRepository.delete(setup);
        }
    }

    public void checkAccess(User user, Project project, LearnerSetup learnerSetup) {
        projectDAO.checkAccess(user, project);

        if (learnerSetup == null) {
            throw new NotFoundException("The learner setup could not be found.");
        }

        if (!learnerSetup.getProjectId().equals(project.getId())) {
            throw new NotFoundException("Cannot access the learner setup.");
        }
    }

    public void initializeLazyRelations(LearnerSetup learnerSetup) {
        Hibernate.initialize(learnerSetup.getPreSymbol());
        ParameterizedSymbolDAO.loadLazyRelations(learnerSetup.getPreSymbol());

        Hibernate.initialize(learnerSetup.getSymbols());
        learnerSetup.getSymbols().forEach(ParameterizedSymbolDAO::loadLazyRelations);

        if (learnerSetup.getPostSymbol() != null) {
            Hibernate.initialize(learnerSetup.getPostSymbol());
            ParameterizedSymbolDAO.loadLazyRelations(learnerSetup.getPostSymbol());
        }

        Hibernate.initialize(learnerSetup.getEnvironments());
        Hibernate.initialize(learnerSetup.getWebDriver());
    }

    private void saveSymbols(LearnerSetup setup) {
        setup.getPreSymbol().setId(null);
        parameterizedSymbolDAO.create(setup.getPreSymbol());
        for (ParameterizedSymbol ps: setup.getSymbols()) {
            ps.setId(null);
            parameterizedSymbolDAO.create(ps);
        }
        if (setup.getPostSymbol() != null) {
            setup.getPostSymbol().setId(null);
            parameterizedSymbolDAO.create(setup.getPostSymbol());
        }
    }
}
