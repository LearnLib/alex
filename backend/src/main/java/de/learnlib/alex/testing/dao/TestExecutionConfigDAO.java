/*
 * Copyright 2015 - 2022 TU Dortmund
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

package de.learnlib.alex.testing.dao;

import de.learnlib.alex.auth.entities.User;
import de.learnlib.alex.common.exceptions.NotFoundException;
import de.learnlib.alex.data.dao.ProjectDAO;
import de.learnlib.alex.data.dao.ProjectEnvironmentDAO;
import de.learnlib.alex.data.entities.Project;
import de.learnlib.alex.data.entities.ProjectEnvironment;
import de.learnlib.alex.data.repositories.ProjectEnvironmentRepository;
import de.learnlib.alex.data.repositories.ProjectRepository;
import de.learnlib.alex.learning.entities.WebDriverConfig;
import de.learnlib.alex.testing.entities.Test;
import de.learnlib.alex.testing.entities.TestExecutionConfig;
import de.learnlib.alex.testing.repositories.TestExecutionConfigRepository;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;
import javax.persistence.EntityManager;
import org.apache.shiro.authz.UnauthorizedException;
import org.hibernate.Hibernate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(rollbackFor = Exception.class)
public class TestExecutionConfigDAO {

    private final ProjectDAO projectDAO;
    private final ProjectRepository projectRepository;
    private final TestExecutionConfigRepository testExecutionConfigRepository;
    private final ProjectEnvironmentRepository environmentRepository;
    private final ProjectEnvironmentDAO environmentDAO;
    private final EntityManager entityManager;
    private final TestDAO testDAO;

    @Autowired
    public TestExecutionConfigDAO(ProjectDAO projectDAO,
                                  ProjectRepository projectRepository,
                                  TestExecutionConfigRepository testExecutionConfigRepository,
                                  ProjectEnvironmentRepository environmentRepository,
                                  ProjectEnvironmentDAO environmentDAO,
                                  EntityManager entityManager,
                                  TestDAO testDAO) {
        this.projectDAO = projectDAO;
        this.projectRepository = projectRepository;
        this.testExecutionConfigRepository = testExecutionConfigRepository;
        this.environmentRepository = environmentRepository;
        this.environmentDAO = environmentDAO;
        this.entityManager = entityManager;
        this.testDAO = testDAO;
    }

    public TestExecutionConfig create(User user, Long projectId, TestExecutionConfig config) {
        final Project project = projectRepository.findById(projectId).orElse(null);
        projectDAO.checkAccess(user, project);

        List<Test> tests = new ArrayList<>();
        Optional.ofNullable(config.getTestIds())
                .ifPresent(testIds -> testIds.forEach(testId -> {
                    tests.add(this.testDAO.get(user, projectId, testId));
                }));
        config.setTests(tests);

        final ProjectEnvironment projectUrl = environmentRepository.findById(config.getEnvironmentId()).orElse(null);
        environmentDAO.checkAccess(user, project, projectUrl);

        config.setProject(project);
        config.setEnvironment(projectUrl);
        config.setDefault(false);

        final TestExecutionConfig createdConfig = testExecutionConfigRepository.save(config);
        loadLazyRelations(createdConfig);

        return createdConfig;
    }

    public List<TestExecutionConfig> getAll(User user, Long projectId) {
        final Project project = projectRepository.findById(projectId).orElse(null);
        projectDAO.checkAccess(user, project);

        final List<TestExecutionConfig> configs = testExecutionConfigRepository.findAllByProject_Id(projectId);
        configs.forEach(this::loadLazyRelations);

        return configs;
    }

    public TestExecutionConfig get(User user, Long projectId, Long configId) {
        final Project project = projectRepository.findById(projectId).orElse(null);
        final TestExecutionConfig config = testExecutionConfigRepository.findById(configId).orElse(null);
        checkAccess(user, project, config);

        loadLazyRelations(config);
        return config;
    }

    public void delete(User user, Long projectId, Long configId) {
        final Project project = projectRepository.findById(projectId).orElse(null);
        final TestExecutionConfig config = testExecutionConfigRepository.findById(configId).orElse(null);
        checkAccess(user, project, config);

        testExecutionConfigRepository.deleteById(configId);
    }

    public TestExecutionConfig update(User user, Long projectId, Long configId, TestExecutionConfig config) {
        final Project project = projectRepository.findById(projectId).orElse(null);
        final TestExecutionConfig configInDb = testExecutionConfigRepository.findById(configId).orElse(null);
        checkAccess(user, project, configInDb);

        if (config.isDefault()) {
            final TestExecutionConfig defaultConfig = testExecutionConfigRepository.findByProject_IdAndIs_Default(projectId);
            if (defaultConfig == null) {
                configInDb.setDefault(true);
            } else {
                if (!defaultConfig.equals(configInDb)) {
                    defaultConfig.setDefault(false);
                    testExecutionConfigRepository.save(defaultConfig);
                    configInDb.setDefault(true);
                }
            }
        }

        configInDb.setDriverConfig(config.getDriverConfig());
        configInDb.setEnvironmentId(config.getEnvironmentId());
        configInDb.setName(config.getName());
        configInDb.setDescription(config.getDescription());
        configInDb.setTests(testDAO.get(user, projectId, config.getTestIds()));

        final TestExecutionConfig updatedConfig = testExecutionConfigRepository.save(configInDb);
        loadLazyRelations(updatedConfig);
        return updatedConfig;
    }

    public TestExecutionConfig copy(User user, Long projectId, Long configId) {
        final Project project = projectRepository.findById(projectId).orElse(null);
        final TestExecutionConfig configInDb = testExecutionConfigRepository.findById(configId).orElse(null);
        checkAccess(user, project, configInDb);

        final TestExecutionConfig newConfig = new TestExecutionConfig();
        newConfig.setProject(project);
        newConfig.setName(configInDb.getName());
        newConfig.setDescription(configInDb.getDescription());
        newConfig.setEnvironment(configInDb.getEnvironment());
        newConfig.setTests(List.copyOf(configInDb.getTests()));

        final WebDriverConfig webDriverConfig = configInDb.getDriverConfig();
        entityManager.detach(webDriverConfig);
        webDriverConfig.setId(null);
        newConfig.setDriverConfig(webDriverConfig);

        final TestExecutionConfig copiedConfig = testExecutionConfigRepository.save(newConfig);
        loadLazyRelations(newConfig);
        return copiedConfig;
    }

    public List<TestExecutionConfig> importTestExecutionConfigs(User user, Project project, List<TestExecutionConfig> testExecutionConfigs, Map<Long, Long> configRefMap) {
        testExecutionConfigs.forEach(testExecutionConfig -> {
            testExecutionConfig.setProject(projectRepository.getOne(project.getId()));
            testExecutionConfig.setEnvironment(environmentRepository.findByProject_IdAndName(project.getId(), testExecutionConfig.getEnvironment().getName()));
            testExecutionConfig.setTests(testDAO.get(user, project.getId(), testExecutionConfig.getTestIds().stream().map(configRefMap::get).collect(Collectors.toList())));
        });

        List<TestExecutionConfig> importedConfigs = testExecutionConfigRepository.saveAll(testExecutionConfigs);
        return importedConfigs;
    }

    public void checkAccess(User user, Project project, TestExecutionConfig config) {
        projectDAO.checkAccess(user, project);

        if (config == null || config.getProjectId() == null) {
            throw new NotFoundException("The config could not be found.");
        }

        if (!config.getProjectId().equals(project.getId())) {
            throw new UnauthorizedException("You are not allowed to access the config.");
        }
    }

    private void loadLazyRelations(TestExecutionConfig config) {
        Hibernate.initialize(config.getProject());
        Hibernate.initialize(config.getTests());
        Hibernate.initialize(config.getEnvironment());
    }
}
