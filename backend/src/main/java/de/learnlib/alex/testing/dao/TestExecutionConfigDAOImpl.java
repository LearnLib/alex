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

package de.learnlib.alex.testing.dao;

import de.learnlib.alex.auth.entities.User;
import de.learnlib.alex.common.exceptions.NotFoundException;
import de.learnlib.alex.data.dao.ProjectDAO;
import de.learnlib.alex.data.dao.ProjectUrlDAO;
import de.learnlib.alex.data.entities.Project;
import de.learnlib.alex.data.entities.ProjectUrl;
import de.learnlib.alex.data.repositories.ProjectRepository;
import de.learnlib.alex.data.repositories.ProjectUrlRepository;
import de.learnlib.alex.testing.entities.Test;
import de.learnlib.alex.testing.entities.TestExecutionConfig;
import de.learnlib.alex.testing.repositories.TestExecutionConfigRepository;
import de.learnlib.alex.testing.repositories.TestRepository;
import org.apache.shiro.authz.UnauthorizedException;
import org.hibernate.Hibernate;
import org.springframework.stereotype.Service;

import javax.inject.Inject;
import javax.transaction.Transactional;
import java.util.List;

/** The implementation for the {@link TestExecutionConfigDAO}. */
@Service
public class TestExecutionConfigDAOImpl implements TestExecutionConfigDAO {

    /** The injected DAO for projects. */
    @Inject
    private ProjectDAO projectDAO;

    /** The injected DAO for project URLs. */
    @Inject
    private ProjectUrlDAO projectUrlDAO;

    /** THe injected DAO for tests. */
    @Inject
    private TestDAO testDAO;

    /** The injected repository for project.. */
    @Inject
    private ProjectRepository projectRepository;

    /** The injected repository for test configs. */
    @Inject
    private TestExecutionConfigRepository testExecutionConfigRepository;

    /** The injected repository for tests. */
    @Inject
    private TestRepository testRepository;

    /** The injected repository for project URLs. */
    @Inject
    private ProjectUrlRepository projectUrlRepository;

    @Override
    @Transactional
    public TestExecutionConfig create(User user, Long projectId, TestExecutionConfig config)
            throws NotFoundException, UnauthorizedException {
        final Project project = projectRepository.findOne(projectId);
        projectDAO.checkAccess(user, project);

        final List<Test> tests = testRepository.findAll(config.getTestIds());
        if (tests.isEmpty()) {
            throw new NotFoundException("At least one test could not be found.");
        }

        for (Test test: tests) {
            testDAO.checkAccess(user, project, test);
        }

        final ProjectUrl projectUrl = projectUrlRepository.findOne(config.getUrlId());
        projectUrlDAO.checkAccess(user, project, projectUrl);

        config.setProject(project);
        config.setTests(tests);
        config.setUrl(projectUrl);

        final TestExecutionConfig createdConfig = testExecutionConfigRepository.save(config);
        loadLazyRelations(createdConfig);

        return createdConfig;
    }

    @Override
    @Transactional
    public List<TestExecutionConfig> getAll(User user, Long projectId) throws NotFoundException, UnauthorizedException {
        final Project project = projectRepository.findOne(projectId);
        projectDAO.checkAccess(user, project);

        final List<TestExecutionConfig> configs = testExecutionConfigRepository.findAllByProject_Id(projectId);
        configs.forEach(this::loadLazyRelations);

        return configs;
    }

    @Override
    @Transactional
    public TestExecutionConfig get(User user, Long projectId, Long configId)
            throws NotFoundException, UnauthorizedException {
        final Project project = projectRepository.findOne(projectId);
        final TestExecutionConfig config = testExecutionConfigRepository.findOne(configId);
        checkAccess(user, project, config);

        loadLazyRelations(config);
        return config;
    }

    @Override
    @Transactional
    public void delete(User user, Long projectId, Long configId)
            throws NotFoundException, UnauthorizedException {
        final Project project = projectRepository.findOne(projectId);
        final TestExecutionConfig config = testExecutionConfigRepository.findOne(configId);
        checkAccess(user, project, config);

        testExecutionConfigRepository.delete(configId);
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
        Hibernate.initialize(config.getUrl());
    }
}
