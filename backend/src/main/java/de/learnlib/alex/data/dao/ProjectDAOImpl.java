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

package de.learnlib.alex.data.dao;

import de.learnlib.alex.auth.entities.User;
import de.learnlib.alex.common.exceptions.NotFoundException;
import de.learnlib.alex.data.entities.CreateProjectForm;
import de.learnlib.alex.data.entities.Project;
import de.learnlib.alex.data.entities.ProjectEnvironment;
import de.learnlib.alex.data.entities.ProjectUrl;
import de.learnlib.alex.data.entities.SymbolGroup;
import de.learnlib.alex.data.repositories.ParameterizedSymbolRepository;
import de.learnlib.alex.data.repositories.ProjectRepository;
import de.learnlib.alex.data.repositories.ProjectUrlRepository;
import de.learnlib.alex.data.repositories.SymbolActionRepository;
import de.learnlib.alex.data.repositories.SymbolStepRepository;
import de.learnlib.alex.learning.repositories.LearnerResultRepository;
import de.learnlib.alex.testing.entities.TestSuite;
import de.learnlib.alex.testing.repositories.TestReportRepository;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.apache.shiro.authz.UnauthorizedException;
import org.hibernate.Hibernate;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.inject.Inject;
import javax.validation.ValidationException;
import java.io.IOException;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

/**
 * Implementation of a ProjectDAO using Spring Data.
 */
@Service
public class ProjectDAOImpl implements ProjectDAO {

    private static final Logger LOGGER = LogManager.getLogger();

    /** The ProjectRepository to use. Will be injected. */
    private ProjectRepository projectRepository;

    /** The repository for learner results. */
    private LearnerResultRepository learnerResultRepository;

    /** The repository for test reports. */
    private TestReportRepository testReportRepository;

    /** The repository for parameterized symbols. */
    private ParameterizedSymbolRepository parameterizedSymbolRepository;

    /** The repository for symbol steps. */
    private SymbolStepRepository symbolStepRepository;

    /** The repository for actions. */
    private SymbolActionRepository symbolActionRepository;

    /** The FileDAO to use. Will be injected. */
    private FileDAO fileDAO;

    private ProjectEnvironmentDAO projectEnvironmentDAO;

    private ProjectUrlRepository projectUrlRepository;

    /**
     * Constructor.
     *
     * @param projectRepository
     *         The ProjectRepository to use.
     * @param learnerResultRepository
     *         The LearnerResultRepository to use.
     * @param fileDAO
     *         The FileDAO to use.
     * @param testReportRepository
     *         The repository for test reports.
     * @param parameterizedSymbolRepository
     *         The repository for parameterized symbols.
     * @param symbolStepRepository
     *         The repository for symbol steps.
     * @param symbolActionRepository
     *         The repository for actions.
     */
    @Inject
    public ProjectDAOImpl(ProjectRepository projectRepository,
                          LearnerResultRepository learnerResultRepository,
                          TestReportRepository testReportRepository,
                          @Lazy FileDAO fileDAO,
                          ParameterizedSymbolRepository parameterizedSymbolRepository,
                          SymbolStepRepository symbolStepRepository,
                          SymbolActionRepository symbolActionRepository,
                          @Lazy ProjectEnvironmentDAO projectEnvironmentDAO,
                          ProjectUrlRepository projectUrlRepository) {
        this.projectRepository = projectRepository;
        this.learnerResultRepository = learnerResultRepository;
        this.fileDAO = fileDAO;
        this.testReportRepository = testReportRepository;
        this.parameterizedSymbolRepository = parameterizedSymbolRepository;
        this.symbolStepRepository = symbolStepRepository;
        this.symbolActionRepository = symbolActionRepository;
        this.projectEnvironmentDAO = projectEnvironmentDAO;
        this.projectUrlRepository = projectUrlRepository;
    }

    @Override
    @Transactional
    public Project create(final User user, final CreateProjectForm projectForm) throws ValidationException {
        LOGGER.traceEntry("create({})", projectForm);

        final Project project = new Project();
        project.setUser(user);
        project.setName(projectForm.getName());
        project.setDescription(projectForm.getDescription());

        final SymbolGroup defaultGroup = new SymbolGroup();
        defaultGroup.setName("Default group");
        defaultGroup.setProject(project);
        project.addGroup(defaultGroup);

        final TestSuite testSuite = new TestSuite();
        testSuite.setName("Root");
        testSuite.setProject(project);
        project.getTests().add(testSuite);

        final Project projectWithSameName = projectRepository.findByUser_IdAndName(user.getId(), project.getName());
        if (projectWithSameName != null && !projectWithSameName.getId().equals(project.getId())) {
            throw new ValidationException("A project with that name already exists.");
        }

        Project createdProject = projectRepository.save(project);
        final ProjectEnvironment defaultEnv = new ProjectEnvironment();
        defaultEnv.setName("Production");
        defaultEnv.setDefault(true);
        final ProjectEnvironment createdDefaultEnvironment = projectEnvironmentDAO.create(user, createdProject.getId(), defaultEnv);
        createdProject.getEnvironments().add(createdDefaultEnvironment);
        createdProject = projectRepository.save(createdProject);

        final ProjectUrl projectUrl = new ProjectUrl();
        projectUrl.setUrl(projectForm.getUrl());
        projectUrl.setEnvironment(createdDefaultEnvironment);
        projectUrl.setName("Base");
        final ProjectUrl createdProjectUrl = projectUrlRepository.save(projectUrl);
        createdDefaultEnvironment.getUrls().add(createdProjectUrl);
        projectEnvironmentDAO.update(user, createdProject.getId(), createdDefaultEnvironment.getId(), createdDefaultEnvironment);

        LOGGER.traceExit(createdProject);
        return createdProject;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Project> getAll(User user, EmbeddableFields... embedFields) {
        List<Project> projects = projectRepository.findAllByUser_Id(user.getId());
        projects.forEach(p -> initLazyRelations(p, embedFields));
        return projects;
    }

    @Override
    @Transactional(readOnly = true)
    public Project getByID(User user, Long projectId, EmbeddableFields... embedFields) throws NotFoundException {
        final Project project = projectRepository.findById(projectId).orElse(null);
        checkAccess(user, project);
        initLazyRelations(project, embedFields);
        return project;
    }

    @Override
    @Transactional
    public Project update(User user, Project project) throws NotFoundException, ValidationException {
        LOGGER.traceEntry("update({})", project);

        final Project projectInDb = projectRepository.findById(project.getId()).orElse(null);
        checkAccess(user, projectInDb);

        if (projectRepository.findByUser_IdAndNameAndIdNot(user.getId(), project.getName(), projectInDb.getId()) != null) {
            throw new ValidationException("The name of the project already exists.");
        }

        projectInDb.setName(project.getName());
        projectInDb.setDescription(project.getDescription());

        final Project updatedProject = projectRepository.save(projectInDb);
        initLazyRelations(updatedProject);

        LOGGER.traceExit(project);
        return updatedProject;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void delete(User user, Long projectId) throws NotFoundException {
        final Project project = projectRepository.findById(projectId).orElse(null);
        checkAccess(user, project);

        symbolActionRepository.deleteAllBySymbol_Project_Id(projectId);
        symbolStepRepository.deleteAllBySymbol_Project_Id(projectId);
        parameterizedSymbolRepository.deleteAllBySymbol_Project_Id(projectId);
        testReportRepository.deleteAllByProject_Id(projectId);
        learnerResultRepository.deleteAllByProject_Id(projectId);

        // delete the project directory
        try {
            fileDAO.deleteProjectDirectory(user, projectId);
            projectRepository.delete(project);
        } catch (IOException e) {
            LOGGER.info("The project has been deleted, the directory, however, not.");
        }
    }

    /**
     * Load objects that are connected with a project over a 'lazy' relation ship.
     *
     * @param project
     *         The project which needs the 'lazy' objects.
     */
    private void initLazyRelations(Project project, EmbeddableFields... embedFields) {
        Hibernate.initialize(project.getEnvironments());
        project.getEnvironments().forEach(env -> Hibernate.initialize(env.getUrls()));

        if (embedFields != null && embedFields.length > 0) {
            Set<EmbeddableFields> fieldsToLoad = fieldsArrayToHashSet(embedFields);

            if (fieldsToLoad.contains(EmbeddableFields.GROUPS)) {
                project.getGroups().forEach(group -> group.getSymbols().forEach(SymbolDAOImpl::loadLazyRelations));
            } else {
                project.setGroups(null);
            }

            if (fieldsToLoad.contains(EmbeddableFields.SYMBOLS)) {
                project.getSymbols().forEach(SymbolDAOImpl::loadLazyRelations);
            } else {
                project.setSymbols(null);
            }

            if (fieldsToLoad.contains(EmbeddableFields.COUNTERS)) {
                Hibernate.initialize(project.getCounters());
            } else {
                project.setCounters(null);
            }
        } else {
            project.setGroups(null);
            project.setSymbols(null);
            project.setCounters(null);
        }
    }

    private Set<EmbeddableFields> fieldsArrayToHashSet(EmbeddableFields[] embedFields) {
        Set<EmbeddableFields> fieldsToLoad = new HashSet<>();
        if (Arrays.asList(embedFields).contains(EmbeddableFields.ALL)) {
            fieldsToLoad.add(EmbeddableFields.GROUPS);
            fieldsToLoad.add(EmbeddableFields.SYMBOLS);
            fieldsToLoad.add(EmbeddableFields.COUNTERS);
        } else {
            Collections.addAll(fieldsToLoad, embedFields);
        }
        return fieldsToLoad;
    }

    @Override
    public void checkAccess(User user, Project project) throws NotFoundException, UnauthorizedException {
        if (project == null) {
            throw new NotFoundException("The project does not exist.");
        }

        if (!project.getUser().equals(user)) {
            throw new UnauthorizedException("You are not allowed to access the project.");
        }
    }
}
