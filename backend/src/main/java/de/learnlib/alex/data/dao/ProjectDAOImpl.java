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
import de.learnlib.alex.data.entities.Project;
import de.learnlib.alex.data.entities.ProjectUrl;
import de.learnlib.alex.data.entities.SymbolGroup;
import de.learnlib.alex.data.repositories.ParameterizedSymbolRepository;
import de.learnlib.alex.data.repositories.ProjectRepository;
import de.learnlib.alex.data.repositories.SymbolActionRepository;
import de.learnlib.alex.data.repositories.SymbolStepRepository;
import de.learnlib.alex.learning.entities.LearnerResult;
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
import java.util.stream.Collectors;

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

    /** The ProjectUrlDAO to use. */
    private ProjectUrlDAO projectUrlDAO;

    /**
     * Constructor.
     *
     * @param projectRepository
     *         The ProjectRepository to use.
     * @param learnerResultRepository
     *         The LearnerResultRepository to use.
     * @param fileDAO
     *         The FileDAO to use.
     * @param projectUrlDAO
     *         The ProjectUrlDAO to use.
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
    public ProjectDAOImpl(ProjectRepository projectRepository, LearnerResultRepository learnerResultRepository,
                          TestReportRepository testReportRepository, @Lazy FileDAO fileDAO, @Lazy ProjectUrlDAO projectUrlDAO,
                          ParameterizedSymbolRepository parameterizedSymbolRepository,
                          SymbolStepRepository symbolStepRepository, SymbolActionRepository symbolActionRepository) {
        this.projectRepository = projectRepository;
        this.learnerResultRepository = learnerResultRepository;
        this.fileDAO = fileDAO;
        this.projectUrlDAO = projectUrlDAO;
        this.testReportRepository = testReportRepository;
        this.parameterizedSymbolRepository = parameterizedSymbolRepository;
        this.symbolStepRepository = symbolStepRepository;
        this.symbolActionRepository = symbolActionRepository;
    }

    @Override
    @Transactional
    public Project create(final User user, final Project project) throws ValidationException {
        LOGGER.traceEntry("create({})", project);

        project.setUser(user);
        project.setId(null);

        final SymbolGroup defaultGroup = new SymbolGroup();
        defaultGroup.setName("Default group");
        defaultGroup.setProject(project);
        project.addGroup(defaultGroup);

        final TestSuite testSuite = new TestSuite();
        testSuite.setName("Root");
        testSuite.setProject(project);
        project.getTests().add(testSuite);

        if (project.getUrls().isEmpty()) {
            throw new ValidationException("The project has to have at least one URL.");
        }

        final Project projectWithSameName = projectRepository.findByUser_IdAndName(user.getId(), project.getName());
        if (projectWithSameName != null && !projectWithSameName.getId().equals(project.getId())) {
            throw new ValidationException("A project with that name already exists.");
        }

        project.getUrls().forEach(url -> {
            url.setId(null);
            url.setProject(project);
        });

        final Project createdProject = projectRepository.save(project);
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

        final List<ProjectUrl> urls = project.getUrls().stream()
                .filter(url -> url.getId() != null)
                .collect(Collectors.toList());
        projectUrlDAO.checkAccess(user, project, urls);

        if (project.getUrls().isEmpty()) {
            throw new ValidationException("The project has to have at least one URL.");
        }

        project.setUser(user);
        project.setGroups(projectInDb.getGroups());
        project.getUrls().forEach(url -> url.setProject(project));

        final List<ProjectUrl> urlsToRemove = projectInDb.getUrls().stream()
                .filter(url -> !project.getUrls().contains(url))
                .collect(Collectors.toList());
        if (!urlsToRemove.isEmpty()) {
            removeUrlsFromLearnerResults(urlsToRemove);
        }

        final Project updatedProject = projectRepository.save(project);
        initLazyRelations(updatedProject);

        LOGGER.traceExit(project);
        return updatedProject;
    }

    private void removeUrlsFromLearnerResults(List<ProjectUrl> urlsToRemove) {
        final List<LearnerResult> learnerResults = learnerResultRepository.findAllByUrlsIn(urlsToRemove);
        learnerResults.forEach(result -> result.getUrls().removeAll(urlsToRemove));
        learnerResultRepository.saveAll(learnerResults);
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
        projectRepository.delete(project);

        // delete the project directory
        try {
            fileDAO.deleteProjectDirectory(user, projectId);
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
        Hibernate.initialize(project.getUrls());
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

            Hibernate.initialize(project.getUrls());
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
