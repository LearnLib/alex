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
import de.learnlib.alex.data.entities.Counter;
import de.learnlib.alex.data.entities.Project;
import de.learnlib.alex.data.repositories.CounterRepository;
import de.learnlib.alex.data.repositories.ProjectRepository;
import org.apache.shiro.authz.UnauthorizedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.inject.Inject;
import javax.validation.ValidationException;
import java.util.List;

/**
 * Implementation of a CounterDAO using Hibernate.
 */
@Service
public class CounterDAOImpl implements CounterDAO {

    /** The ProjectDAO to use. Will be injected. */
    private ProjectDAO projectDAO;

    /** The injected repository for projects. */
    private ProjectRepository projectRepository;

    /** The CounterRepository to use. Will be injected. */
    private CounterRepository counterRepository;

    /**
     * Creates a new CounterDAO.
     *
     * @param projectDAO
     *         The projectDAO to use.
     * @param counterRepository
     *         The counterRepository to use.
     * @param projectRepository
     *         The projectRepository to use.
     */
    @Inject
    public CounterDAOImpl(ProjectDAO projectDAO, CounterRepository counterRepository,
                          ProjectRepository projectRepository) {
        this.projectDAO = projectDAO;
        this.counterRepository = counterRepository;
        this.projectRepository = projectRepository;
    }

    @Override
    @Transactional
    public void create(User user, Counter counter) throws NotFoundException, ValidationException {
        final Project project = projectRepository.findById(counter.getProjectId()).orElse(null);
        projectDAO.checkAccess(user, project);

        if (counterRepository.findByProjectAndName(project, counter.getName()) != null) {
            throw new ValidationException("A counter with the name already exists.");
        }

        counter.setId(null);
        counter.setProject(project);
        counterRepository.save(counter);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Counter> getAll(User user, Long projectId) throws NotFoundException {
        final Project project = projectRepository.findById(projectId).orElse(null);
        projectDAO.checkAccess(user, project);
        return counterRepository.findAllByProject(project);
    }

    @Override
    @Transactional(readOnly = true)
    public Counter get(User user, Long projectId, String name) throws NotFoundException {
        return doGet(user, projectId, name);
    }

    @Override
    @Transactional
    public void update(User user, Counter counter) throws NotFoundException, ValidationException {
        doGet(user, counter.getProjectId(), counter.getName());
        counterRepository.save(counter);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void delete(User user, Long projectId, String... names) throws NotFoundException {
        final Project project = projectRepository.findById(projectId).orElse(null);
        final List<Counter> counters = counterRepository.findAllByProjectAndNameIn(project, names);
        for (Counter counter : counters) {
            checkAccess(user, project, counter);
        }

        if (names.length == counters.size()) { // all counters found -> delete them & success
            counterRepository.deleteAll(counters);
        } else {
            throw new NotFoundException("Could not delete the counter(s), because at least one does not exists!");
        }
    }

    @Override
    public void checkAccess(User user, Project project, Counter counter)
            throws NotFoundException, UnauthorizedException {
        projectDAO.checkAccess(user, project);

        if (counter == null) {
            throw new NotFoundException("The counter could not be found.");
        }

        if (!counter.getProjectId().equals(project.getId())) {
            throw new UnauthorizedException("You are not allowed to access the counter.");
        }
    }

    private Counter doGet(User user, Long projectId, String name) {
        final Project project = projectRepository.findById(projectId).orElse(null);
        final Counter counter = counterRepository.findByProjectAndName(project, name);
        checkAccess(user, project, counter);
        return counter;
    }
}
