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

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.verify;

import de.learnlib.alex.auth.entities.User;
import de.learnlib.alex.common.exceptions.NotFoundException;
import de.learnlib.alex.data.entities.Counter;
import de.learnlib.alex.data.entities.Project;
import de.learnlib.alex.data.repositories.CounterRepository;
import de.learnlib.alex.data.repositories.ProjectRepository;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
public class CounterDAOTest {

    private static final long USER_ID = 21L;
    private static final long PROJECT_ID = 42L;
    private static final String COUNTER_NAME = "CounterNo1";
    private static final Integer COUNTER_VALUE = 123;
    private static final int AMOUNT_OF_COUNTERS = 3;

    @Mock
    private ProjectDAO projectDAO;

    @Mock
    private CounterRepository counterRepository;

    @Mock
    private ProjectRepository projectRepository;

    private CounterDAO counterDAO;

    @BeforeEach
    public void setUp() {
        counterDAO = new CounterDAO(projectDAO, counterRepository, projectRepository);
    }

    @Test
    public void shouldCreateACounter() {
        User user = new User();

        Project project = new Project();
        project.setId(PROJECT_ID);

        given(projectRepository.getOne(PROJECT_ID)).willReturn(project);

        Counter counter = new Counter();
        counter.setName(COUNTER_NAME);
        counter.setValue(COUNTER_VALUE);

        counterDAO.create(user, PROJECT_ID, counter);

        verify(counterRepository).save(any(Counter.class));
    }

    @Test
    public void shouldGetAllCounterOfAProject() {
        User user = new User();
        user.setId(USER_ID);

        Project project = new Project();

        List<Counter> counters = createCounterList();

        given(projectRepository.findById(PROJECT_ID)).willReturn(Optional.of(project));
        given(counterRepository.findAllByProject(project)).willReturn(counters);

        List<Counter> allCounters = counterDAO.getAll(user, PROJECT_ID);

        assertEquals(counters.size(), allCounters.size());
        for (Counter c : allCounters) {
            assertTrue(counters.contains(c));
        }
    }

    @Test
    public void shouldUpdateACounter() {
        final Long counterId = 1L;

        User user = new User();
        user.setId(USER_ID);

        Project project = new Project();
        project.setId(PROJECT_ID);

        Counter counter = new Counter();
        counter.setProject(project);
        counter.setName(COUNTER_NAME);
        counter.setId(counterId);

        given(projectRepository.findById(PROJECT_ID)).willReturn(Optional.of(project));
        given(counterRepository.findById(counterId)).willReturn(Optional.of(counter));

        counterDAO.update(user, counter);

        verify(counterRepository).save(counter);
    }

    @Test
    public void shouldDeleteACounter() {
        final Long counterId = 1L;

        User user = new User();
        user.setId(USER_ID);

        Project project = new Project();
        project.setId(PROJECT_ID);

        Counter counter = new Counter();
        counter.setId(counterId);
        counter.setProject(project);
        List<Counter> counterAsList = Collections.singletonList(counter);

        given(projectRepository.findById(PROJECT_ID)).willReturn(Optional.of(project));
        given(counterRepository.findAllByIdIn(Collections.singletonList(counterId))).willReturn(counterAsList);

        counterDAO.delete(user, PROJECT_ID, Collections.singletonList(counterId));

        verify(counterRepository).deleteAll(counterAsList);
    }

    @Test
    public void shouldFailToDeleteACounterThatDoesNotExist() {
        User user = new User();
        assertThrows(NotFoundException.class, () -> counterDAO.delete(user, PROJECT_ID, Collections.singletonList(-1L)));
    }

    private List<Counter> createCounterList() {
        List<Counter> counters = new ArrayList<>();
        for (int i = 0; i < AMOUNT_OF_COUNTERS; i++) {
            Counter c = new Counter();
            counters.add(c);
        }
        return counters;
    }

}
