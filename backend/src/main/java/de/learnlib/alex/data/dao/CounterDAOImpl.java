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

package de.learnlib.alex.data.dao;

import de.learnlib.alex.auth.entities.User;
import de.learnlib.alex.common.exceptions.NotFoundException;
import de.learnlib.alex.data.entities.Counter;
import de.learnlib.alex.data.entities.Project;
import de.learnlib.alex.data.repositories.CounterRepository;
import de.learnlib.alex.data.repositories.ProjectRepository;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.apache.shiro.authz.UnauthorizedException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.TransactionSystemException;
import org.springframework.transaction.annotation.Transactional;

import javax.inject.Inject;
import javax.validation.ValidationException;
import java.util.List;

/**
 * Implementation of a CounterDAO using Hibernate.
 */
@Service
public class CounterDAOImpl implements CounterDAO {

    private static final Logger LOGGER = LogManager.getLogger();

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
        try {
            Project project = projectDAO.getByID(user.getId(), counter.getProjectId());

            if (counterRepository.findByProjectAndName(project, counter.getName()) != null) {
                throw new ValidationException("A counter with the name already exists.");
            }

            counter.setProject(project);
            counterRepository.save(counter);
        } catch (DataIntegrityViolationException | TransactionSystemException e) {
            LOGGER.info("Counter creation failed:", e);
            throw new ValidationException("Counter could not be created.", e);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<Counter> getAll(User user, Long projectId) throws NotFoundException {
        Project project = projectRepository.findOne(projectId);
        projectDAO.checkAccess(user, project);
        return counterRepository.findAllByProject(project);
    }

    @Override
    @Transactional(readOnly = true)
    public Counter get(User user, Long projectId, String name) throws NotFoundException {
        return doGet(user, projectId, name);
    }

    private Counter doGet(User user, Long projectId, String name) throws NotFoundException {
        Project project = projectDAO.getByID(user.getId(), projectId);

        Counter result = counterRepository.findByProjectAndName(project, name);
        if (result == null) {
            throw new NotFoundException("Could not find the counter with the name '" + name
                    + "' in the project " + projectId + "!");
        }

        return result;
    }

    @Override
    @Transactional
    public void update(User user, Counter counter) throws NotFoundException, ValidationException {
        try {
            doGet(user, counter.getProjectId(), counter.getName()); // check if the counter exists
            counterRepository.save(counter);
        } catch (DataIntegrityViolationException| TransactionSystemException e) {
            LOGGER.error("Counter update failed:", e);
            throw new ValidationException("Counter could not be updated.", e);
        }
    }

    @Override
    @Transactional
    public void delete(User user, Long projectId, String... names) throws NotFoundException {
        Project project = projectRepository.findOne(projectId);
        List<Counter> counters = counterRepository.findAllByProjectAndNameIn(project, names);
        for (Counter counter: counters) {
            checkAccess(user, project, counter);
        }

        if (names.length == counters.size()) { // all counters found -> delete them & success
            counterRepository.delete(counters);
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
}
