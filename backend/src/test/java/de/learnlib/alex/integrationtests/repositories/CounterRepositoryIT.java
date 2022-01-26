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

package de.learnlib.alex.integrationtests.repositories;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import de.learnlib.alex.auth.entities.User;
import de.learnlib.alex.data.entities.Counter;
import de.learnlib.alex.data.entities.Project;
import de.learnlib.alex.data.repositories.CounterRepository;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.dao.EmptyResultDataAccessException;

public class CounterRepositoryIT extends AbstractRepositoryIT {

    @Autowired
    private CounterRepository counterRepository;

    private User user;

    private Project project;

    @BeforeEach
    public void before() {
        User user = createUser("alex@test.example");
        this.user = userRepository.save(user);

        Project project = createProject(user, "Test Project 1");
        this.project = projectRepository.save(project);
    }

    @Test
    public void shouldCreateAValidCounter() {
        Counter counter = createCounter(project, "TestCounter");
        counter = counterRepository.save(counter);

        assertNotNull(counter.getId());
        assertEquals(1, counterRepository.count());
    }

    @Test
    public void shouldFailToSaveACounterWithoutAProject() {
        Counter counter = createCounter(null, "TestCounter");

        assertThrows(DataIntegrityViolationException.class, () -> counterRepository.save(counter));
    }

    @Test
    public void shouldFailToSaveACounterWithADuplicateNames() {
        Counter counter1 = createCounter(project, "TestCounter");
        counterRepository.save(counter1);
        Counter counter2 = createCounter(project, "TestCounter");

        assertThrows(DataIntegrityViolationException.class, () -> counterRepository.save(counter2));
    }

    @Test
    public void shouldSaveCountersWithADuplicateNamesInDifferentProjects() {
        Project project2 = createProject(user, "Test Project 2");
        project2 = projectRepository.save(project2);

        Counter counter1 = createCounter(project, "TestCounter");
        counterRepository.save(counter1);
        Counter counter2 = createCounter(project2, "TestCounter");
        counter2 = counterRepository.save(counter2);

        assertNotNull(counter2.getId());
    }

    @Test
    public void shouldFetchAllCountersOfAProject() {
        Counter counter1 = createCounter(project, "TestCounter1");
        counter1 = counterRepository.save(counter1);
        Counter counter2 = createCounter(project, "TestCounter2");
        counter2 = counterRepository.save(counter2);

        List<Counter> counters = counterRepository.findAllByProject(project);

        assertEquals(2, counters.size());
        assertTrue(counters.contains(counter1));
        assertTrue(counters.contains(counter2));
    }

    @Test
    public void shouldFetchOntCountersOfAProjectByItsName() {
        Counter counter = createCounter(project, "TestCounter1");
        counter = counterRepository.save(counter);

        Counter counterFromDB = counterRepository.findByProjectAndName(project, "TestCounter1");

        assertEquals(counter, counterFromDB);
    }

    @Test
    public void shouldDeleteACounter() {
        Counter counter = createCounter(project, "TestCounter");
        counter = counterRepository.save(counter);

        counterRepository.deleteById(counter.getId());

        assertEquals(0L, counterRepository.count());
    }

    @Test
    public void shouldThrowAnExceptionWhenDeletingAnNonExistingCounter() {
        assertThrows(EmptyResultDataAccessException.class, () -> counterRepository.deleteById(-1L));
    }

    private Counter createCounter(Project project, String name) {
        Counter counter = new Counter();
        counter.setProject(project);
        counter.setName(name);
        return counter;
    }

}
