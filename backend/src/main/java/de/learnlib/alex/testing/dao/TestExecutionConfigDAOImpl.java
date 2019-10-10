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

package de.learnlib.alex.testing.dao;

import de.learnlib.alex.auth.entities.User;
import de.learnlib.alex.common.exceptions.NotFoundException;
import de.learnlib.alex.data.dao.ProjectDAO;
import de.learnlib.alex.data.dao.ProjectEnvironmentDAO;
import de.learnlib.alex.data.entities.Project;
import de.learnlib.alex.data.entities.ProjectEnvironment;
import de.learnlib.alex.data.repositories.ProjectEnvironmentRepository;
import de.learnlib.alex.data.repositories.ProjectRepository;
import de.learnlib.alex.testing.entities.TestExecutionConfig;
import de.learnlib.alex.testing.repositories.TestExecutionConfigRepository;
import org.apache.shiro.authz.UnauthorizedException;
import org.hibernate.Hibernate;
import org.springframework.stereotype.Service;

import javax.inject.Inject;
import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.List;

/** The implementation for the {@link TestExecutionConfigDAO}. */
@Service
@Transactional(rollbackOn = Exception.class)
public class TestExecutionConfigDAOImpl implements TestExecutionConfigDAO {

    private final ProjectDAO projectDAO;
    private final ProjectRepository projectRepository;
    private final TestExecutionConfigRepository testExecutionConfigRepository;
    private final ProjectEnvironmentRepository environmentRepository;
    private final ProjectEnvironmentDAO environmentDAO;

    @Inject
    public TestExecutionConfigDAOImpl(ProjectDAO projectDAO,
                                      ProjectRepository projectRepository,
                                      TestExecutionConfigRepository testExecutionConfigRepository,
                                      ProjectEnvironmentRepository environmentRepository,
                                      ProjectEnvironmentDAO environmentDAO) {
        this.projectDAO = projectDAO;
        this.projectRepository = projectRepository;
        this.testExecutionConfigRepository = testExecutionConfigRepository;
        this.environmentRepository = environmentRepository;
        this.environmentDAO = environmentDAO;
    }

    @Override
    public TestExecutionConfig create(User user, Long projectId, TestExecutionConfig config)
            throws NotFoundException, UnauthorizedException {
        final Project project = projectRepository.findById(projectId).orElse(null);
        projectDAO.checkAccess(user, project);

        config.setTests(new ArrayList<>());

        final ProjectEnvironment projectUrl = environmentRepository.findById(config.getEnvironmentId()).orElse(null);
        environmentDAO.checkAccess(user, project, projectUrl);

        config.setProject(project);
        config.setEnvironment(projectUrl);
        config.setDefault(false);

        final TestExecutionConfig createdConfig = testExecutionConfigRepository.save(config);
        loadLazyRelations(createdConfig);

        return createdConfig;
    }

    @Override
    public List<TestExecutionConfig> getAll(User user, Long projectId) throws NotFoundException, UnauthorizedException {
        final Project project = projectRepository.findById(projectId).orElse(null);
        projectDAO.checkAccess(user, project);

        final List<TestExecutionConfig> configs = testExecutionConfigRepository.findAllByProject_Id(projectId);
        configs.forEach(this::loadLazyRelations);

        return configs;
    }

    @Override
    public TestExecutionConfig get(User user, Long projectId, Long configId)
            throws NotFoundException, UnauthorizedException {
        final Project project = projectRepository.findById(projectId).orElse(null);
        final TestExecutionConfig config = testExecutionConfigRepository.findById(configId).orElse(null);
        checkAccess(user, project, config);

        loadLazyRelations(config);
        return config;
    }

    @Override
    public void delete(User user, Long projectId, Long configId)
            throws NotFoundException, UnauthorizedException {
        final Project project = projectRepository.findById(projectId).orElse(null);
        final TestExecutionConfig config = testExecutionConfigRepository.findById(configId).orElse(null);
        checkAccess(user, project, config);

        testExecutionConfigRepository.deleteById(configId);
    }

    @Override
    public TestExecutionConfig update(User user, Long projectId, Long configId, TestExecutionConfig config)
            throws NotFoundException, UnauthorizedException {
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

        final TestExecutionConfig updatedConfig = testExecutionConfigRepository.save(configInDb);
        loadLazyRelations(updatedConfig);
        return updatedConfig;
    }

    @Override
    public void checkAccess(User user, Project project, TestExecutionConfig config)
            throws NotFoundException, UnauthorizedException {
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
