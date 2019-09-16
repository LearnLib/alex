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
import de.learnlib.alex.data.entities.ProjectEnvironment;
import de.learnlib.alex.data.entities.ProjectUrl;
import de.learnlib.alex.data.repositories.ProjectEnvironmentRepository;
import de.learnlib.alex.data.repositories.ProjectRepository;
import de.learnlib.alex.data.repositories.ProjectUrlRepository;
import org.apache.shiro.authz.UnauthorizedException;
import org.hibernate.Hibernate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import javax.validation.ValidationException;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class ProjectEnvironmentDAO {

    @Autowired
    private ProjectDAO projectDAO;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private ProjectEnvironmentRepository environmentRepository;

    @Autowired
    private ProjectUrlRepository urlRepository;

    public ProjectEnvironment create(User user, Long projectId, ProjectEnvironment environment) {
        final Project project = projectRepository.findById(projectId).orElse(null);
        projectDAO.checkAccess(user, project);

        if (environmentRepository.findByProject_IdAndName(projectId, environment.getName()) != null) {
            throw new ValidationException("There has to be at least one environment.");
        }

        List<ProjectUrl> urls = new ArrayList<>();
        final List<ProjectEnvironment> envs = environmentRepository.findAllByProject_Id(projectId);
        if (envs.size() > 0) {
            urls = envs.get(0).getUrls();
        }

        final ProjectEnvironment envToCreate = new ProjectEnvironment();
        envToCreate.setName(environment.getName());
        envToCreate.setProject(project);
        envToCreate.setDefault(environment.isDefault());

        final ProjectEnvironment projectEnvironment = environmentRepository.save(envToCreate);
        project.getEnvironments().add(projectEnvironment);
        projectRepository.save(project);

        final List<ProjectUrl> createdUrls = new ArrayList<>();
        for (ProjectUrl url: urls) {
            final ProjectUrl u = new ProjectUrl();
            u.setName(url.getName());
            u.setEnvironment(projectEnvironment);
            u.setUrl(url.getUrl());
            u.setDefault(url.isDefault());
            createdUrls.add(urlRepository.save(u));
        }
        projectEnvironment.getUrls().addAll(createdUrls);
        environmentRepository.save(projectEnvironment);

        return loadLazyRelations(projectEnvironment);
    }

    public void delete(User user, Long projectId, Long environmentId) {
        final Project project = projectRepository.findById(projectId).orElse(null);
        final ProjectEnvironment environment = environmentRepository.findById(environmentId).orElse(null);
        checkAccess(user, project, environment);

        if (environmentRepository.findAllByProject_Id(projectId).size() == 1) {
            throw new ValidationException("There has to be at least one environment.");
        }

        // select next best default environment
        if (environment.isDefault()) {
            final List<ProjectEnvironment> envs = environmentRepository.findAllByProject_Id(projectId);
            final ProjectEnvironment env = envs.stream().filter(e -> !e.isDefault()).findFirst().orElse(null);
            env.setDefault(true);
            environmentRepository.save(env);
        }

        project.getEnvironments().remove(environment);
        projectRepository.save(project);
        environmentRepository.delete(environment);
    }

    public ProjectEnvironment update(User user, Long projectId, Long envId, ProjectEnvironment env) {
        final Project project = projectRepository.findById(projectId).orElse(null);
        final ProjectEnvironment envInDb = environmentRepository.findById(envId).orElse(null);
        checkAccess(user, project, envInDb);

        if (environmentRepository.findByProject_IdAndNameAndIdNot(projectId, env.getName(), envInDb.getId()) != null) {
            throw new ValidationException("The name of the environment already exists");
        }

        envInDb.setName(env.getName());

        // switch default environment
        if (env.isDefault() && !envInDb.isDefault()) {
            final ProjectEnvironment defaultEnv = environmentRepository.findByProject_IdAndIs_Default(projectId, true);
            defaultEnv.setDefault(false);
            environmentRepository.save(defaultEnv);
            envInDb.setDefault(true);
        }

        final ProjectEnvironment updatedEnv = environmentRepository.save(envInDb);
        return loadLazyRelations(updatedEnv);
    }

    public List<ProjectEnvironment> getAll(User user, Long projectId) {
        final Project project = projectRepository.findById(projectId).orElse(null);
        projectDAO.checkAccess(user, project);

        final List<ProjectEnvironment> environments = environmentRepository.findAllByProject_Id(projectId);
        environments.forEach(this::loadLazyRelations);
        return environments;
    }

    public List<ProjectUrl> createUrls(User user, Long projectId, Long environmentId, ProjectUrl url) {
        final Project project = projectRepository.findById(projectId).orElse(null);
        final ProjectEnvironment env = environmentRepository.findById(environmentId).orElse(null);
        checkAccess(user, project, env);

        if (urlRepository.findByEnvironment_IdAndName(environmentId, url.getName()) != null) {
            throw new ValidationException("The name for the URL already exists.");
        }

        // create the url for each environment
        final List<ProjectUrl> urlsToCreate = new ArrayList<>();
        final List<ProjectEnvironment> envs = environmentRepository.findAllByProject_Id(projectId);
        for (ProjectEnvironment e: envs) {
            final ProjectUrl u = new ProjectUrl();
            u.setName(url.getName());
            u.setEnvironment(e);
            u.setUrl(url.getUrl());
            urlsToCreate.add(u);
        }

        return urlRepository.saveAll(urlsToCreate);
    }

    public void deleteUrl(User user, Long projectId, Long environmentId, Long urlId) {
        final Project project = projectRepository.findById(projectId).orElse(null);
        final ProjectEnvironment env = environmentRepository.findById(environmentId).orElse(null);
        final ProjectUrl url = urlRepository.findById(urlId).orElse(null);
        checkAccess(user, project, env, url);

        final List<ProjectEnvironment> envs = environmentRepository.findAllByProject_Id(projectId);
        for (ProjectEnvironment e: envs) {
            if (e.getUrls().size() == 1) {
                throw new ValidationException("Environments require at least one URL.");
            }

            e.setUrls(e.getUrls().stream().filter(u -> !u.getName().equals(url.getName())).collect(Collectors.toList()));
            urlRepository.deleteByEnvironment_IdAndName(e.getId(), url.getName());

            // make new default url
            if (url.isDefault()) {
                e.getUrls().get(0).setDefault(true);
                urlRepository.save(e.getUrls().get(0));
            }
        }

        environmentRepository.saveAll(envs);
    }

    public List<ProjectUrl> updateUrls(User user, Long projectId, Long envId, Long urlId, ProjectUrl url) {
        final Project project = projectRepository.findById(projectId).orElse(null);
        final ProjectEnvironment env = environmentRepository.findById(envId).orElse(null);
        final ProjectUrl urlInDb = urlRepository.findById(urlId).orElse(null);
        checkAccess(user, project, env, urlInDb);

        if (urlRepository.findByEnvironment_IdAndNameAndIdNot(envId, url.getName(), urlInDb.getId()) != null) {
            throw new ValidationException("The name of the URL already exists.");
        }

        // update default url
        if (url.isDefault() && !urlInDb.isDefault()) {
            List<ProjectUrl> urls = urlRepository.findByEnvironment_Project_IdAndIsDefault(projectId, true);
            urls.forEach(u -> u.setDefault(false));
            urlRepository.saveAll(urls);

            urls = urlRepository.findByEnvironment_Project_IdAndName(projectId, urlInDb.getName());
            urls.forEach(u -> u.setDefault(true));
            urlRepository.saveAll(urls);
        }

        final List<ProjectUrl> updatedUrls = new ArrayList<>();
        final String originalName = urlInDb.getName();

        urlInDb.setUrl(url.getUrl());
        urlInDb.setName(url.getName());
        updatedUrls.add(urlRepository.save(urlInDb));

        // update the name of all other urls if the name changed
        if (!url.getName().equals(originalName)) {
            final List<ProjectEnvironment> envs = environmentRepository.findAllByProject_Id(projectId);
            for (ProjectEnvironment e: envs) {
                for (ProjectUrl u: e.getUrls()) {
                    if (u.getName().equals(originalName)) {
                        u.setName(url.getName());
                        updatedUrls.add(urlRepository.save(u));
                    }
                }
            }
        }

        return updatedUrls;
    }

    public void checkAccess(User user, Project project, ProjectEnvironment env)
            throws NotFoundException, UnauthorizedException {
        projectDAO.checkAccess(user, project);

        if (env == null) {
            throw new NotFoundException("The environment could not be found.");
        }

        if (!env.getProjectId().equals(project.getId())) {
            throw new UnauthorizedException("You are not allowed to access the environment.");
        }
    }

    public void checkAccess(User user, Project project, ProjectEnvironment env, ProjectUrl url)
            throws NotFoundException, UnauthorizedException {
        checkAccess(user, project, env);

        if (url == null) {
            throw new NotFoundException("The url could not be found.");
        }

        if (!url.getEnvironmentId().equals(env.getId())) {
            throw new UnauthorizedException("You are not allowed to access the url.");
        }
    }

    private ProjectEnvironment loadLazyRelations(ProjectEnvironment environment) {
        Hibernate.initialize(environment.getUrls());
        return environment;
    }
}
