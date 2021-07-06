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
import de.learnlib.alex.learning.dao.LearnerSetupDAO;
import de.learnlib.alex.learning.entities.LearnerSetup;
import de.learnlib.alex.learning.repositories.LearnerResultRepository;
import de.learnlib.alex.learning.repositories.LearnerResultStepRepository;
import de.learnlib.alex.learning.repositories.LearnerSetupRepository;
import de.learnlib.alex.modelchecking.dao.LtsFormulaDAO;
import de.learnlib.alex.modelchecking.dao.LtsFormulaSuiteDAO;
import de.learnlib.alex.modelchecking.entities.LtsFormula;
import de.learnlib.alex.modelchecking.entities.LtsFormulaSuite;
import de.learnlib.alex.testing.dao.TestDAO;
import de.learnlib.alex.testing.dao.TestExecutionConfigDAO;
import de.learnlib.alex.testing.dao.TestReportDAO;
import de.learnlib.alex.testing.entities.Test;
import de.learnlib.alex.testing.entities.TestExecutionConfig;
import de.learnlib.alex.testing.entities.TestSuite;
import de.learnlib.alex.testing.repositories.TestExecutionConfigRepository;
import de.learnlib.alex.testing.repositories.TestReportRepository;
import de.learnlib.alex.testing.repositories.TestRepository;
import de.learnlib.alex.websocket.services.ProjectPresenceService;
import de.learnlib.alex.websocket.services.SymbolPresenceService;
import de.learnlib.alex.websocket.services.TestPresenceService;
import java.io.IOException;
import java.util.Arrays;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import javax.validation.ValidationException;
import org.apache.shiro.authz.UnauthorizedException;
import org.hibernate.Hibernate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Implementation of a ProjectDAO using Spring Data.
 */
@Service
@Transactional(rollbackFor = Exception.class)
public class ProjectDAO {

    private static final Logger logger = LoggerFactory.getLogger(ProjectDAO.class);

    private final ProjectRepository projectRepository;
    private final LearnerResultRepository learnerResultRepository;
    private final TestReportRepository testReportRepository;
    private final ParameterizedSymbolRepository parameterizedSymbolRepository;
    private final SymbolStepRepository symbolStepRepository;
    private final SymbolActionRepository symbolActionRepository;
    private final FileDAO fileDAO;
    private final ProjectEnvironmentDAO projectEnvironmentDAO;
    private final ProjectUrlRepository projectUrlRepository;
    private final TestExecutionConfigRepository testExecutionConfigRepository;
    private final ProjectEnvironmentRepository environmentRepository;
    private final SymbolGroupDAO symbolGroupDAO;
    private final TestDAO testDAO;
    private final UserDAO userDAO;
    private final TestRepository testRepository;
    private final SymbolParameterRepository symbolParameterRepository;
    private final UploadableFileRepository uploadableFileRepository;
    private final LearnerSetupRepository learnerSetupRepository;
    private final TestPresenceService testPresenceService;
    private final SymbolPresenceService symbolPresenceService;
    private final ProjectPresenceService projectPresenceService;
    private final TestReportDAO testReportDAO;
    private final LtsFormulaSuiteDAO ltsFormulaSuiteDAO;
    private final LtsFormulaDAO ltsFormulaDAO;
    private final LearnerResultStepRepository learnerResultStepRepository;
    private final LearnerSetupDAO learnerSetupDAO;
    private final TestExecutionConfigDAO testExecutionConfigDAO;

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
                      LearnerSetupRepository learnerSetupRepository,
                      LearnerResultStepRepository learnerResultStepRepository,
                      @Lazy TestPresenceService testPresenceService,
                      @Lazy SymbolPresenceService symbolPresenceService,
                      @Lazy ProjectPresenceService projectPresenceService,
                      @Lazy TestReportDAO testReportDAO,
                      @Lazy LtsFormulaSuiteDAO ltsFormulaSuiteDAO,
                      @Lazy LtsFormulaDAO ltsFormulaDAO,
                      @Lazy LearnerSetupDAO learnerSetupDAO,
                      @Lazy TestExecutionConfigDAO testExecutionConfigDAO) {
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
        this.testPresenceService = testPresenceService;
        this.symbolPresenceService = symbolPresenceService;
        this.projectPresenceService = projectPresenceService;
        this.testReportDAO = testReportDAO;
        this.ltsFormulaSuiteDAO = ltsFormulaSuiteDAO;
        this.ltsFormulaDAO = ltsFormulaDAO;
        this.learnerResultStepRepository = learnerResultStepRepository;
        this.learnerSetupDAO = learnerSetupDAO;
        this.testExecutionConfigDAO = testExecutionConfigDAO;
    }

    public Project create(final User user, final CreateProjectForm projectForm) {
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
        final var createdDefaultEnvironment = projectEnvironmentDAO.create(user, createdProject.getId(), defaultEnv);

        final ProjectUrl projectUrl = new ProjectUrl();
        projectUrl.setUrl(projectForm.getUrl());
        projectUrl.setEnvironment(createdDefaultEnvironment);
        projectUrl.setName("Base");
        projectUrl.setDefault(true);
        final ProjectUrl createdProjectUrl = projectUrlRepository.save(projectUrl);
        createdDefaultEnvironment.getUrls().add(createdProjectUrl);
        projectEnvironmentDAO.update(
                user,
                createdProject.getId(),
                createdDefaultEnvironment.getId(),
                createdDefaultEnvironment
        );

        return loadLazyRelations(createdProject);
    }

    public List<Project> getAll(User user) {
        List<Project> projects = projectRepository.findAllByUser_Id(user.getId());
        projects.forEach(this::loadLazyRelations);
        return projects;
    }

    public Project getByID(User user, Long projectId) {
        final Project project = projectRepository.findById(projectId).orElse(null);
        checkAccess(user, project);
        loadLazyRelations(project);
        return project;
    }

    public Project update(User user, Long projectId, Project project) {
        final Project projectInDb = projectRepository.findById(projectId).orElse(null);
        checkAccess(user, projectInDb);

        if (!projectInDb.getOwners().contains(user) && user.getRole() != UserRole.ADMIN) {
            throw new UnauthorizedException("You are not allowed to update this project.");
        }

        projectInDb.setName(project.getName());
        projectInDb.setDescription(project.getDescription());

        final Project updatedProject = projectRepository.save(projectInDb);
        loadLazyRelations(updatedProject);

        return updatedProject;
    }

    public void delete(User user, Long projectId) {
        final Project project = projectRepository.findById(projectId).orElse(null);
        checkAccess(user, project);

        if (!project.getOwners().contains(user) && user.getRole() != UserRole.ADMIN) {
            throw new UnauthorizedException("You are not allowed to delete this project.");
        }

        symbolActionRepository.deleteAllBySymbol_Project_Id(projectId);
        symbolStepRepository.deleteAllBySymbol_Project_Id(projectId);
        testExecutionConfigRepository.deleteAllByProject_Id(projectId);
        testReportRepository.deleteAllByProject_Id(projectId);
        testRepository.deleteAllByProject_Id(projectId);
        learnerResultStepRepository.deleteAllByResult_Project_Id(projectId);
        learnerResultRepository.deleteAllByProject_Id(projectId);
        learnerSetupRepository.deleteAllByProject_Id(projectId);
        parameterizedSymbolRepository.deleteAllBySymbol_Project_Id(projectId);
        symbolParameterRepository.deleteAllBySymbol_Project_Id(projectId);
        uploadableFileRepository.deleteAllByProject_Id(projectId);

        // clear relationships to members and owners first
        project.getOwners().clear();
        project.getMembers().clear();
        projectRepository.save(project);

        // release all project locks
        this.symbolPresenceService.releaseSymbolLocksByProject(projectId);
        this.testPresenceService.releaseTestLocksByProject(projectId);
        this.projectPresenceService.removeProjectFromPresenceMap(projectId);

        // delete the screenshot directory
        testReportDAO.deleteScreenshotDirectory(user, projectId);

        // delete the project directory
        try {
            fileDAO.deleteProjectDirectory(user, projectId);
            projectRepository.delete(project);
        } catch (IOException e) {
            logger.info("The project has been deleted, the directory, however, not.");
        }

    }

    public void delete(User user, List<Long> projectIds) {
        for (Long id : projectIds) {
            delete(user, id);
        }
    }

    public Project importProject(User user, ProjectExportableEntity projectExportableEntity) {
        final ObjectMapper om = new ObjectMapper();

        final Project project;
        final List<SymbolGroup> groups;
        final List<Test> tests;
        final List<LtsFormulaSuite> formulaSuites;
        final List<LearnerSetup> learnerSetups;
        final List<TestExecutionConfig> testExecutionConfigs;

        try {
            project = om.readValue(projectExportableEntity.getProject().toString(), Project.class);
            groups = Arrays.asList(om.readValue(projectExportableEntity.getGroups().toString(), SymbolGroup[].class));
            tests = Arrays.asList(om.readValue(projectExportableEntity.getTests().toString(), Test[].class));
            formulaSuites = Arrays.asList(om.readValue(projectExportableEntity.getFormulaSuites().toString(), LtsFormulaSuite[].class));
            learnerSetups = Arrays.asList(om.readValue(projectExportableEntity.getLearnerSetups().toString(), LearnerSetup[].class));
            testExecutionConfigs = Arrays.asList(om.readValue(projectExportableEntity.getTestExecutionConfigs().toString(), TestExecutionConfig[].class));
        } catch (IOException e) {
            e.printStackTrace();
            throw new ValidationException("The input is not formatted correctly");
        }

        if (groups.isEmpty()) {
            throw new ValidationException("There has to be a default group");
        }

        check(project);

        final var newProject = new Project();
        newProject.setName(project.getName());
        newProject.setDescription(project.getDescription());
        newProject.addOwner(user);

        final TestSuite rootTestSuite = new TestSuite();
        rootTestSuite.setName("Root");
        rootTestSuite.setProject(newProject);
        newProject.getTests().add(rootTestSuite);

        final var createdProject = projectRepository.save(newProject);
        createdProject.getEnvironments().addAll(project.getEnvironments().stream()
                .map(e -> {
                    e.setProject(createdProject);
                    e.getVariables().forEach(v -> v.setEnvironment(e));
                    e.getUrls().forEach(u -> u.setEnvironment(e));
                    return environmentRepository.save(e);
                })
                .collect(Collectors.toList())
        );

        // newSymbolId -> oldSymbolId
        Map<Long, Long> symbolRefMap = new HashMap<>();

        symbolGroupDAO.importGroups(user, createdProject, groups, symbolRefMap);

        /*  oldTestId -> newTestId
         *  maps the exported testids to the corresponding newly created ones,
         *  enabling correct referencing when importing testExecutionConfigs
         */
        Map<Long, Long> configRefMap = new HashMap<>();

        if (!tests.isEmpty()) {
            testDAO.importTests(user, createdProject.getId(), tests, configRefMap, symbolRefMap);
        }

        for (LtsFormulaSuite suite : formulaSuites) {
            final LtsFormulaSuite createdSuite = ltsFormulaSuiteDAO.create(user, createdProject.getId(), suite);
            for (LtsFormula formula : suite.getFormulas()) {
                ltsFormulaDAO.create(user, createdProject.getId(), createdSuite.getId(), formula);
            }
        }

        if (!learnerSetups.isEmpty()) {
            learnerSetupDAO.importLearnerSetups(user, createdProject, learnerSetups, symbolRefMap);
        }

        if (!testExecutionConfigs.isEmpty()) {
            testExecutionConfigDAO.importTestExecutionConfigs(user, createdProject, testExecutionConfigs, configRefMap);
        }

        loadLazyRelations(createdProject);
        return createdProject;
    }

    private void check(Project project) {
        checkProjectHasDefaultEnvironment(project);
        checkEnvironmentsHaveDefaultUrl(project);
        checkEnvironmentNamesAreUnique(project);
        checkEnvironmentsHaveSameUrlNames(project);
        checkEnvironmentsHaveSameVariableNames(project);
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
        Hibernate.initialize(project.getOwners());
        Hibernate.initialize(project.getMembers());
        return project;
    }

    public void checkAccess(User user, Project project) {
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
            projectInDb.removeMember(userDAO.getByID(ownerId));
            projectInDb.addOwner(userDAO.getByID(ownerId));
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
            projectInDb.removeOwner(userDAO.getByID(memberId));
            projectInDb.addMember(userDAO.getByID(memberId));
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
            projectInDb.removeOwner(userDAO.getByID(ownerId));
        });

        checkProjectIntegrity(projectInDb);

        final Project updatedProject = projectRepository.save(projectInDb);
        loadLazyRelations(updatedProject);

        // remove owner presences from project and release locks
        ownerIds.forEach(ownerId -> {
            this.projectPresenceService.removeUserFromProjectPresence(ownerId, projectId);
            this.testPresenceService.releaseUserLocksFromProject(ownerId, projectId);
            this.symbolPresenceService.releaseUserLocksFromProject(ownerId, projectId);
        });

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
            projectInDb.removeMember(userDAO.getByID(memberId));
        });

        final Project updatedProject = projectRepository.save(projectInDb);
        loadLazyRelations(updatedProject);

        // remove member presences from project and release locks
        memberIds.forEach(memberId -> {
            this.projectPresenceService.removeUserFromProjectPresence(memberId, projectId);
            this.testPresenceService.releaseUserLocksFromProject(memberId, projectId);
            this.symbolPresenceService.releaseUserLocksFromProject(memberId, projectId);
        });

        return updatedProject;
    }

    private void checkProjectIntegrity(Project project) {
        //at least one owner has to remain
        if (project.getOwners().isEmpty()) {
            throw new ValidationException("There need to be at least one owner in the project.");
        }
    }

    private void checkEnvironmentNamesAreUnique(Project project) {
        final var numberOfUniqueEnvironments = project.getEnvironments().stream()
                .map(ProjectEnvironment::getName)
                .collect(Collectors.toSet())
                .size();

        if (numberOfUniqueEnvironments != project.getEnvironments().size()) {
            throw new ValidationException("The names of the environments need to be unique.");
        }
    }

    private void checkEnvironmentsHaveDefaultUrl(Project project) {
        for (ProjectEnvironment env : project.getEnvironments()) {
            if (env.getUrls().stream().filter(ProjectUrl::isDefault).count() != 1) {
                throw new ValidationException("An environment needs a default URL");
            }
        }
    }

    private void checkEnvironmentsHaveSameVariableNames(Project project) {
        final var numberOfVariables = project.getEnvironments().stream()
                .map(e -> e.getVariables().size())
                .collect(Collectors.toSet())
                .size();

        if (numberOfVariables > 1) {
            throw new ValidationException("Each environment has to have the same amount of variables");
        }

        final var variableNamesSet = project.getEnvironments().stream()
                .map(ProjectEnvironment::getVariables)
                .flatMap(Collection::stream)
                .map(ProjectEnvironmentVariable::getName)
                .collect(Collectors.toSet());

        if (variableNamesSet.size() != project.getEnvironments().get(0).getVariables().size()) {
            throw new ValidationException("The names of the variables are not equal in the environments");
        }
    }

    private void checkEnvironmentsHaveSameUrlNames(Project project) {
        final var numberOfUrls = project.getEnvironments().stream()
                .map(e -> e.getUrls().size()).collect(Collectors.toSet())
                .size();

        if (numberOfUrls > 1) {
            throw new ValidationException("Each environment has to have the same amount of URLs");
        }

        final var urlNamesSet = project.getEnvironments().stream()
                .map(ProjectEnvironment::getUrls)
                .flatMap(Collection::stream)
                .map(ProjectUrl::getName)
                .collect(Collectors.toSet());

        if (urlNamesSet.size() != project.getEnvironments().get(0).getUrls().size()) {
            throw new ValidationException("The names of the urls are not equal in the environments");
        }
    }

    private void checkProjectHasDefaultEnvironment(Project project) {
        if (project.getEnvironments().stream().filter(ProjectEnvironment::isDefault).count() != 1) {
            throw new ValidationException("There has to be exactly one environment");
        }
    }
}
