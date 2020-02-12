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

package de.learnlib.alex.data.dao;

import com.fasterxml.jackson.databind.ObjectMapper;
import de.learnlib.alex.auth.dao.UserDAO;
import de.learnlib.alex.auth.entities.User;
import de.learnlib.alex.auth.entities.UserRole;
import de.learnlib.alex.common.exceptions.NotFoundException;
import de.learnlib.alex.data.entities.CreateProjectForm;
import de.learnlib.alex.data.entities.Project;
import de.learnlib.alex.data.entities.ProjectEnvironment;
import de.learnlib.alex.data.entities.ProjectEnvironmentVariable;
import de.learnlib.alex.data.entities.ProjectUrl;
import de.learnlib.alex.data.entities.SymbolGroup;
import de.learnlib.alex.data.entities.export.ProjectExportableEntity;
import de.learnlib.alex.data.repositories.ParameterizedSymbolRepository;
import de.learnlib.alex.data.repositories.ProjectEnvironmentRepository;
import de.learnlib.alex.data.repositories.ProjectRepository;
import de.learnlib.alex.data.repositories.ProjectUrlRepository;
import de.learnlib.alex.data.repositories.SymbolActionRepository;
import de.learnlib.alex.data.repositories.SymbolParameterRepository;
import de.learnlib.alex.data.repositories.SymbolStepRepository;
import de.learnlib.alex.data.repositories.UploadableFileRepository;
import de.learnlib.alex.learning.repositories.LearnerResultRepository;
import de.learnlib.alex.learning.repositories.LearnerSetupRepository;
import de.learnlib.alex.testing.dao.TestDAO;
import de.learnlib.alex.testing.entities.Test;
import de.learnlib.alex.testing.entities.TestSuite;
import de.learnlib.alex.testing.repositories.TestExecutionConfigRepository;
import de.learnlib.alex.testing.repositories.TestReportRepository;
import de.learnlib.alex.testing.repositories.TestRepository;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.apache.shiro.authz.UnauthorizedException;
import org.hibernate.Hibernate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.validation.ValidationException;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * Implementation of a ProjectDAO using Spring Data.
 */
@Service
@Transactional(rollbackFor = Exception.class)
public class ProjectDAO {

    private static final Logger LOGGER = LogManager.getLogger();

    private ProjectRepository projectRepository;
    private LearnerResultRepository learnerResultRepository;
    private TestReportRepository testReportRepository;
    private ParameterizedSymbolRepository parameterizedSymbolRepository;
    private SymbolStepRepository symbolStepRepository;
    private SymbolActionRepository symbolActionRepository;
    private FileDAO fileDAO;
    private ProjectEnvironmentDAO projectEnvironmentDAO;
    private ProjectUrlRepository projectUrlRepository;
    private TestExecutionConfigRepository testExecutionConfigRepository;
    private ProjectEnvironmentRepository environmentRepository;
    private SymbolGroupDAO symbolGroupDAO;
    private TestDAO testDAO;
    private UserDAO userDAO;
    private TestRepository testRepository;
    private SymbolParameterRepository symbolParameterRepository;
    private UploadableFileRepository uploadableFileRepository;
    private LearnerSetupRepository learnerSetupRepository;

    @Autowired
    public ProjectDAO(ProjectRepository projectRepository,
                      LearnerResultRepository learnerResultRepository,
                      TestReportRepository testReportRepository,
                      @Lazy FileDAO fileDAO,
                      ParameterizedSymbolRepository parameterizedSymbolRepository,
                      SymbolStepRepository symbolStepRepository,
                      SymbolActionRepository symbolActionRepository,
                      @Lazy ProjectEnvironmentDAO projectEnvironmentDAO,
                      ProjectUrlRepository projectUrlRepository,
                      TestExecutionConfigRepository testExecutionConfigRepository,
                      @Lazy TestDAO testDAO,
                      @Lazy UserDAO userDAO,
                      ProjectEnvironmentRepository environmentRepository,
                      @Lazy SymbolGroupDAO symbolGroupDAO,
                      TestRepository testRepository,
                      SymbolParameterRepository symbolParameterRepository,
                      UploadableFileRepository uploadableFileRepository,
                      LearnerSetupRepository learnerSetupRepository) {
        this.projectRepository = projectRepository;
        this.learnerResultRepository = learnerResultRepository;
        this.fileDAO = fileDAO;
        this.testReportRepository = testReportRepository;
        this.parameterizedSymbolRepository = parameterizedSymbolRepository;
        this.symbolStepRepository = symbolStepRepository;
        this.symbolActionRepository = symbolActionRepository;
        this.projectEnvironmentDAO = projectEnvironmentDAO;
        this.projectUrlRepository = projectUrlRepository;
        this.testExecutionConfigRepository = testExecutionConfigRepository;
        this.environmentRepository = environmentRepository;
        this.symbolGroupDAO = symbolGroupDAO;
        this.testDAO = testDAO;
        this.testRepository = testRepository;
        this.symbolParameterRepository = symbolParameterRepository;
        this.uploadableFileRepository = uploadableFileRepository;
        this.userDAO = userDAO;
        this.learnerSetupRepository = learnerSetupRepository;
    }

    public Project create(final User user, final CreateProjectForm projectForm) throws ValidationException {
        LOGGER.traceEntry("create({})", projectForm);

        final Project project = new Project();
        project.addOwner(user);
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

        final Project createdProject = projectRepository.save(project);

        final ProjectEnvironment defaultEnv = new ProjectEnvironment();
        defaultEnv.setName("Production");
        defaultEnv.setDefault(true);
        final ProjectEnvironment createdDefaultEnvironment = projectEnvironmentDAO.create(user, createdProject.getId(), defaultEnv);

        final ProjectUrl projectUrl = new ProjectUrl();
        projectUrl.setUrl(projectForm.getUrl());
        projectUrl.setEnvironment(createdDefaultEnvironment);
        projectUrl.setName("Base");
        projectUrl.setDefault(true);
        final ProjectUrl createdProjectUrl = projectUrlRepository.save(projectUrl);
        createdDefaultEnvironment.getUrls().add(createdProjectUrl);
        projectEnvironmentDAO.update(user, createdProject.getId(), createdDefaultEnvironment.getId(), createdDefaultEnvironment);

        LOGGER.traceExit(createdProject);
        return loadLazyRelations(createdProject);
    }

    public List<Project> getAll(User user) {
        List<Project> projects = projectRepository.findAllByUser_Id(user.getId());
        projects.forEach(this::loadLazyRelations);
        return projects;
    }

    public Project getByID(User user, Long projectId) throws NotFoundException {
        final Project project = projectRepository.findById(projectId).orElse(null);
        checkAccess(user, project);
        loadLazyRelations(project);
        return project;
    }

    public Project update(User user, Long projectId, Project project) throws NotFoundException, ValidationException {
        LOGGER.traceEntry("update({})", project);

        final Project projectInDb = projectRepository.findById(projectId).orElse(null);
        checkAccess(user, projectInDb);

        if (!projectInDb.getOwners().contains(user) && user.getRole() != UserRole.ADMIN) {
            throw new UnauthorizedException("You are not allowed to update this project.");
        }

        projectInDb.setName(project.getName());
        projectInDb.setDescription(project.getDescription());

        final Project updatedProject = projectRepository.save(projectInDb);
        loadLazyRelations(updatedProject);

        LOGGER.traceExit(project);
        return updatedProject;
    }

    public void delete(User user, Long projectId) throws NotFoundException {
        final Project project = projectRepository.findById(projectId).orElse(null);
        checkAccess(user, project);

        if (!project.getOwners().contains(user) && user.getRole() != UserRole.ADMIN) {
            throw new UnauthorizedException("You are not allowed to delete this project.");
        }

        symbolActionRepository.deleteAllBySymbol_Project_Id(projectId);
        symbolStepRepository.deleteAllBySymbol_Project_Id(projectId);
        testReportRepository.deleteAllByProject_Id(projectId);
        testRepository.deleteAllByProject_Id(projectId);
        learnerResultRepository.deleteAllByProject_Id(projectId);
        learnerSetupRepository.deleteAllByProject_Id(projectId);
        parameterizedSymbolRepository.deleteAllBySymbol_Project_Id(projectId);
        testExecutionConfigRepository.deleteAllByProject_Id(projectId);
        symbolParameterRepository.deleteAllBySymbol_Project_Id(projectId);
        uploadableFileRepository.deleteAllByProject_Id(projectId);

        //clear relationships to members and owners first
        project.getOwners().clear();
        project.getMembers().clear();
        projectRepository.save(project);

        // delete the project directory
        try {
            fileDAO.deleteProjectDirectory(user, projectId);
            projectRepository.delete(project);
        } catch (IOException e) {
            LOGGER.info("The project has been deleted, the directory, however, not.");
        }
    }

    public void delete(User user, List<Long> projectIds) throws NotFoundException {
        for (Long id: projectIds) {
            delete(user, id);
        }
    }

    public Project importProject(User user, ProjectExportableEntity projectExportableEntity) throws NotFoundException {
        final ObjectMapper om = new ObjectMapper();

        final Project project;
        final List<SymbolGroup> groups;
        final List<Test> tests;
        try {
            project = om.readValue(projectExportableEntity.getProject().toString(), Project.class);
            groups = new ArrayList<>(Arrays.asList(om.readValue(projectExportableEntity.getGroups().toString(), SymbolGroup[].class)));
            tests = new ArrayList<>(Arrays.asList(om.readValue(projectExportableEntity.getTests().toString(), Test[].class)));
        } catch (IOException e) {
            e.printStackTrace();
            throw new ValidationException("The input is not formatted correctly");
        }

        if (groups.isEmpty()) {
            throw new ValidationException("There has to be a default group");
        }

        check(user, project);

        final Project newProject = new Project();
        newProject.setName(project.getName());
        newProject.setDescription(project.getDescription());
        newProject.addOwner(user);

        final Project createdProject = projectRepository.save(newProject);
        createdProject.getEnvironments().addAll(project.getEnvironments());
        createdProject.getEnvironments().forEach(e -> {
            e.setProject(createdProject);
            e.getVariables().forEach(v -> v.setEnvironment(e));
            e.getUrls().forEach(u -> u.setEnvironment(e));
            environmentRepository.save(e);
        });

        final TestSuite testSuite = new TestSuite();
        testSuite.setName("Root");
        testSuite.setProject(createdProject);
        testDAO.create(user, createdProject.getId(), testSuite);

        symbolGroupDAO.importGroups(user, createdProject, groups, new HashMap<>());
        if (!tests.isEmpty()) {
            testDAO.importTests(user, createdProject.getId(), tests);
        }

        return createdProject;
    }

    private void check(User user, Project project) {
        // there is a default environment
        if (project.getEnvironments().stream().filter(ProjectEnvironment::isDefault).count() != 1) {
            throw new ValidationException("There has to be exactly one environment");
        }

        // each environment has default url
        for (ProjectEnvironment env: project.getEnvironments()) {
            if (env.getUrls().stream().filter(ProjectUrl::isDefault).count() != 1) {
                throw new ValidationException("An environment needs a default URL");
            }
        }

        // unique environments name
        if (project.getEnvironments().stream().map(ProjectEnvironment::getName).collect(Collectors.toSet()).size() != project.getEnvironments().size()) {
            throw new ValidationException("The names of the environments need to be unique");
        }

        // all environments have same url names
        if (project.getEnvironments().stream().map(e -> e.getUrls().size()).collect(Collectors.toSet()).size() > 1) {
            throw new ValidationException("Each environment has to have the same amount of URLs");
        }
        final Set<String> urlNamesSet = new HashSet<>(project.getEnvironments().stream()
                .map(ProjectEnvironment::getUrls)
                .map(urls -> urls.stream().map(ProjectUrl::getName).collect(Collectors.toList()))
                .reduce(new ArrayList<>(), (acc, val) -> {
                    acc.addAll(val);
                    return acc;
                }));
        if (urlNamesSet.size() != project.getEnvironments().get(0).getUrls().size()) {
            throw new ValidationException("The names of the urls are not equal in the environments");
        }

        // all environments have same variable names
        if (project.getEnvironments().stream().map(e -> e.getVariables().size()).collect(Collectors.toSet()).size() > 1) {
            throw new ValidationException("Each environment has to have the same amount of variables");
        }
        final Set<String> variableNamesSet = new HashSet<>(project.getEnvironments().stream()
                .map(ProjectEnvironment::getVariables)
                .map(urls -> urls.stream().map(ProjectEnvironmentVariable::getName).collect(Collectors.toList()))
                .reduce(new ArrayList<>(), (acc, val) -> {
                    acc.addAll(val);
                    return acc;
                }));
        if (variableNamesSet.size() != project.getEnvironments().get(0).getVariables().size()) {
            throw new ValidationException("The names of the variables are not equal in the environments");
        }
    }

    /**
     * Load objects that are connected with a project over a 'lazy' relation ship.
     *
     * @param project
     *         The project which needs the 'lazy' objects.
     */
    private Project loadLazyRelations(Project project) {
        Hibernate.initialize(project.getEnvironments());
        project.getEnvironments().forEach(env -> {
            Hibernate.initialize(env.getUrls());
            Hibernate.initialize(env.getVariables());
        });
        return project;
    }

    public void checkAccess(User user, Project project) throws NotFoundException, UnauthorizedException {
        if (project == null) {
            throw new NotFoundException("The project does not exist.");
        }

        if (project.getOwners().stream().noneMatch(u -> u.getId().equals(user.getId()))
                && project.getMembers().stream().noneMatch(u -> u.getId().equals(user.getId()))
                && user.getRole() != UserRole.ADMIN) {
            throw new UnauthorizedException("You are not allowed to access the project.");
        }
    }

    public Project addOwners(User user, Long projectId, List<Long> ownerIds) {
        final Project projectInDb = projectRepository.findById(projectId).orElse(null);
        checkAccess(user, projectInDb);

        if (!projectInDb.getOwners().contains(user) && user.getRole() != UserRole.ADMIN) {
            throw new UnauthorizedException("You are not allowed to add users as owners to the project.");
        }

        ownerIds.forEach(ownerId -> {
            projectInDb.removeMember(userDAO.getById(ownerId));
            projectInDb.addOwner(userDAO.getById(ownerId));
        });

        checkProjectIntegrity(projectInDb);

        final Project updatedProject = projectRepository.save(projectInDb);
        loadLazyRelations(updatedProject);

        return updatedProject;
    }

    public Project addMembers(User user, Long projectId, List<Long> memberIds) {
        final Project projectInDb = projectRepository.findById(projectId).orElse(null);
        checkAccess(user, projectInDb);

        if (!projectInDb.getOwners().contains(user) && user.getRole() != UserRole.ADMIN) {
            throw new UnauthorizedException("You are not allowed to add users as members to the project.");
        }

        memberIds.forEach(memberId -> {
            projectInDb.removeOwner(userDAO.getById(memberId));
            projectInDb.addMember(userDAO.getById(memberId));
        });

        checkProjectIntegrity(projectInDb);

        final Project updatedProject = projectRepository.save(projectInDb);
        loadLazyRelations(updatedProject);

        return updatedProject;
    }

    public Project removeOwners(User user, Long projectId, List<Long> ownerIds) {
        final Project projectInDb = projectRepository.findById(projectId).orElse(null);
        checkAccess(user, projectInDb);

        if (!projectInDb.getOwners().contains(user) && user.getRole() != UserRole.ADMIN) {
            throw new UnauthorizedException("You are not allowed to remove owners from the the project.");
        }

        ownerIds.forEach(ownerId -> {
            projectInDb.removeOwner(userDAO.getById(ownerId));
        });

        checkProjectIntegrity(projectInDb);

        final Project updatedProject = projectRepository.save(projectInDb);
        loadLazyRelations(updatedProject);

        return updatedProject;
    }

    public Project removeMembers(User user, Long projectId, List<Long> memberIds) {
        final Project projectInDb = projectRepository.findById(projectId).orElse(null);
        checkAccess(user, projectInDb);

        if (!projectInDb.getOwners().contains(user)
                && !(memberIds.size() == 1 && memberIds.contains(user.getId()))
                && user.getRole() != UserRole.ADMIN) {
            throw new UnauthorizedException("You are not allowed to remove members from the project.");
        }

        memberIds.forEach(memberId -> {
            projectInDb.removeMember(userDAO.getById(memberId));
        });

        final Project updatedProject = projectRepository.save(projectInDb);
        loadLazyRelations(updatedProject);

        return updatedProject;
    }

    private void checkProjectIntegrity(Project project) {
        //at least one owner has to remain
        if (project.getOwners().isEmpty()) {
            throw new ValidationException("There need to be at least one owner in the project.");
        }
    }
}
