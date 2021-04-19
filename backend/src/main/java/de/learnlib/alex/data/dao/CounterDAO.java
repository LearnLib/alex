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

import de.learnlib.alex.auth.entities.User;
import de.learnlib.alex.common.exceptions.NotFoundException;
import de.learnlib.alex.data.entities.Counter;
import de.learnlib.alex.data.entities.Project;
import de.learnlib.alex.data.repositories.CounterRepository;
import de.learnlib.alex.data.repositories.ProjectRepository;
import java.util.List;
import javax.validation.ValidationException;
import org.apache.shiro.authz.UnauthorizedException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Implementation of a CounterDAO using Hibernate.
 */
@Service
@Transactional(rollbackFor = Exception.class)
public class CounterDAO {

    private final ProjectDAO projectDAO;
    private final ProjectRepository projectRepository;
    private final CounterRepository counterRepository;

    @Autowired
    public CounterDAO(ProjectDAO projectDAO,
                      CounterRepository counterRepository,
                      ProjectRepository projectRepository
    ) {
        this.projectDAO = projectDAO;
        this.counterRepository = counterRepository;
        this.projectRepository = projectRepository;
    }

    public Counter create(User user, Long projectId, Counter counter) {
        final Project project = projectRepository.getOne(projectId);
        projectDAO.checkAccess(user, project);

        checkNameDoesNotExistInProject(project.getId(), counter.getName());

        final var c = new Counter();
        c.setName(counter.getName());
        c.setValue(counter.getValue());
        c.setProject(project);

        return counterRepository.save(c);
    }

    public void create(User user, Counter counter) {
        final Project project = projectRepository.findById(counter.getProjectId()).orElse(null);
        projectDAO.checkAccess(user, project);

        checkNameDoesNotExistInProject(project.getId(), counter.getName());

        counter.setId(null);
        counter.setProject(project);
        counterRepository.save(counter);
    }

    public List<Counter> getAll(User user, Long projectId) {
        final Project project = projectRepository.findById(projectId).orElse(null);
        projectDAO.checkAccess(user, project);
        return counterRepository.findAllByProject(project);
    }

    public Counter update(User user, Long projectId, Long counterId, Counter counter) {
        final var project = projectRepository.getOne(projectId);
        final var counterToUpdate = counterRepository.getOne(counterId);
        checkAccess(user, project, counterToUpdate);

        counterToUpdate.setValue(counter.getValue());

        return counterRepository.save(counterToUpdate);
    }

    public Counter update(User user, Counter counter) {
        final Counter counterIdDb = doGet(user, counter.getProjectId(), counter.getId());

        if (!counterIdDb.getName().equals(counter.getName())) {
            throw new ValidationException("counters cannot be renamed");
        }

        counterIdDb.setValue(counter.getValue());
        return counterRepository.save(counterIdDb);
    }

    public void delete(User user, Long projectId, List<Long> counterIds) {
        final Project project = projectRepository.findById(projectId).orElse(null);
        final List<Counter> counters = counterRepository.findAllByIdIn(counterIds);

        if (counters.size() != counterIds.size()) {
            throw new NotFoundException("At least one counter cannot be found");
        }

        for (Counter counter : counters) {
            checkAccess(user, project, counter);
        }
        counterRepository.deleteAll(counters);
    }

    public void checkAccess(User user, Project project, Counter counter) {
        projectDAO.checkAccess(user, project);

        if (counter == null) {
            throw new NotFoundException("The counter could not be found.");
        }

        if (!counter.getProjectId().equals(project.getId())) {
            throw new UnauthorizedException("You are not allowed to access the counter.");
        }
    }

    private Counter doGet(User user, Long projectId, Long counterId) {
        final Project project = projectRepository.findById(projectId).orElse(null);
        final Counter counter = counterRepository.findById(counterId).orElse(null);
        checkAccess(user, project, counter);
        return counter;
    }

    private void checkNameDoesNotExistInProject(Long projectId, String name) {
        if (counterRepository.findByProject_IdAndName(projectId, name) != null) {
            throw new ValidationException("A counter with the name already exists.");
        }
    }
}
