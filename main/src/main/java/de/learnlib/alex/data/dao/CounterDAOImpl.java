/*
 * Copyright 2016 TU Dortmund
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

import de.learnlib.alex.common.exceptions.NotFoundException;
import de.learnlib.alex.common.utils.ValidationExceptionHelper;
import de.learnlib.alex.data.entities.Counter;
import de.learnlib.alex.data.entities.Project;
import de.learnlib.alex.data.repositories.CounterRepository;
import de.learnlib.alex.data.repositories.ProjectRepository;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.TransactionSystemException;
import org.springframework.transaction.annotation.Transactional;

import javax.inject.Inject;
import javax.validation.ConstraintViolationException;
import javax.validation.ValidationException;
import java.util.List;

/**
 * Implementation of a CounterDAO using Hibernate.
 */
@Service
public class CounterDAOImpl implements CounterDAO {

    private static final Logger LOGGER = LogManager.getLogger();

    /** The ProjectRepository to use. Will be injected. */
    private ProjectRepository projectRepository;

    /** The CounterRepository to use. Will be injected. */
    private CounterRepository counterRepository;

    /**
     * Creates a new CounterDAO.
     *
     * @param projectRepository
     *         The ProjectRepository to use.
     * @param counterRepository
     *         The CounterRepository to use.
     */
    @Inject
    public CounterDAOImpl(ProjectRepository projectRepository, CounterRepository counterRepository) {
        this.projectRepository = projectRepository;
        this.counterRepository = counterRepository;
    }

    @Override
    @Transactional
    public void create(Counter counter) throws ValidationException {
        try {
            Project project = projectRepository.findOne(counter.getProjectId());
            counter.setProject(project);
            counterRepository.save(counter);
        } catch (DataIntegrityViolationException e) {
            LOGGER.info("Counter creation failed:", e);
            throw new javax.validation.ValidationException("Counter could not be created.", e);
        } catch (TransactionSystemException e) {
            LOGGER.info("Counter creation failed:", e);
            ConstraintViolationException cve = (ConstraintViolationException) e.getCause().getCause();
            throw ValidationExceptionHelper.createValidationException("Counter was not created:", cve);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<Counter> getAll(Long userId, Long projectId) throws NotFoundException {
        Project project = projectRepository.findOneByUser_IdAndId(userId, projectId);
        if (project == null) {
            throw new NotFoundException("The project with the id " + projectId + " was not found.");
        }

        return counterRepository.findByUser_IdAndProject(userId, project);
    }

    @Override
    @Transactional(readOnly = true)
    public Counter get(Long userId, Long projectId, String name) throws NotFoundException {
        return doGet(userId, projectId, name);
    }

    private Counter doGet(Long userId, Long projectId, String name) throws NotFoundException {
        Project project = projectRepository.findOneByUser_IdAndId(userId, projectId);
        if (project == null) {
            throw new NotFoundException("The project with the id " + projectId + " was not found.");
        }

        Counter result = counterRepository.findByUser_IdAndProjectAndName(userId, project, name);
        if (result == null) {
            throw new NotFoundException("Could not find the counter with the name '" + name
                    + "' in the project " + projectId + "!");
        }

        return result;
    }

    @Override
    @Transactional
    public void update(Counter counter) throws NotFoundException, ValidationException {
        try {
            doGet(counter.getUserId(), counter.getProjectId(), counter.getName()); // check if the counter exists
            counterRepository.save(counter);
        } catch (DataIntegrityViolationException e) {
            LOGGER.info("Counter update failed:", e);
            throw new javax.validation.ValidationException("Counter could not be updated.", e);
        } catch (TransactionSystemException e) {
            LOGGER.info("Counter update failed:", e);
            ConstraintViolationException cve = (ConstraintViolationException) e.getCause().getCause();
            throw ValidationExceptionHelper.createValidationException("Counter was not created.", cve);
        } catch (NotFoundException e) {
            throw e;
        }
    }

    @Override
    public void update(List<Counter> counters) {
        counterRepository.save(counters);
    }

    @Override
    @Transactional
    public void delete(Long userId, Long projectId, String... names) throws NotFoundException {
        Project project = projectRepository.findOneByUser_IdAndId(userId, projectId);

        List<Counter> counters = counterRepository.findAllByUser_IdAndProjectAndNameIn(userId, project, names);

        if (names.length == counters.size()) { // all counters found -> delete them & success
            counterRepository.delete(counters);
        } else {
            throw new NotFoundException("Could not delete the counter(s), because at least one does not exists!");
        }
    }
}
