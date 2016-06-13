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

package de.learnlib.alex.core.dao;

import de.learnlib.alex.core.entities.Counter;
import de.learnlib.alex.core.entities.Project;
import de.learnlib.alex.core.entities.User;
import de.learnlib.alex.exceptions.NotFoundException;
import org.hamcrest.MatcherAssert;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.transaction.TransactionSystemException;

import javax.persistence.RollbackException;
import javax.validation.ConstraintViolationException;
import javax.validation.ValidationException;
import java.util.Collections;
import java.util.HashSet;
import java.util.LinkedList;
import java.util.List;

import static org.hamcrest.CoreMatchers.equalTo;
import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.assertThat;
import static org.junit.Assert.assertTrue;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.verify;

@RunWith(MockitoJUnitRunner.class)
public class CounterDAOImplTest {

    private static final long USER_ID = 21L;
    private static final long PROJECT_ID = 42L;
    private static final String COUNTER_NAME  = "CounterNo1";
    private static final Integer COUNTER_VALUE = 123;
    private static final int AMOUNT_OF_COUNTERS = 3;

    @Mock
    private UserRepository userRepository;

    @Mock
    private ProjectRepository projectRepository;

    @Mock
    private CounterRepository counterRepository;

    private static CounterDAO counterDAO;

    @Before
    public void setUp() {
        counterDAO = new CounterDAOImpl(projectRepository, counterRepository);
    }

    @Test
    public void shouldCreateACounter() {
        User user = new User();
        //
        Project project = new Project();
        //
        Counter counter = new Counter();
        counter.setUser(user);
        counter.setProject(project);
        counter.setName(COUNTER_NAME);
        counter.setValue(COUNTER_VALUE);

        counterDAO.create(counter);

        verify(counterRepository).save(counter);
    }

    @Test(expected = ValidationException.class)
    public void shouldHandleConstraintViolationExceptionOnCounterCreationGracefully() {
        Counter counter = new Counter();
        //
        given(counterRepository.save(counter)).willThrow(ConstraintViolationException.class);

        counterDAO.create(counter); // should fail
    }

    @Test(expected = ValidationException.class)
    public void shouldHandleDataIntegrityViolationExceptionOnCounterCreationGracefully() {
        Counter counter = new Counter();
        //
        given(counterRepository.save(counter)).willThrow(DataIntegrityViolationException.class);

        counterDAO.create(counter); // should fail
    }

    @Test(expected = ValidationException.class)
    public void shouldHandleTransactionSystemExceptionOnCounterCreationGracefully() {
        Counter counter = new Counter();
        //
        ConstraintViolationException constraintViolationException = new ConstraintViolationException("Counter is not valid!", new HashSet<>());
        RollbackException rollbackException = new RollbackException("RollbackException", constraintViolationException);
        TransactionSystemException transactionSystemException = new TransactionSystemException("Spring TransactionSystemException", rollbackException);
        given(counterRepository.save(counter)).willThrow(transactionSystemException);

        counterDAO.create(counter); // should fail
    }

    @Test
    public void shouldGetAllCounterOfAProject() throws NotFoundException {
        User user = new User();
        user.setId(USER_ID);
        //
        Project project = new Project();
        //
        List<Counter> counters = createCounterList();
        //
        given(projectRepository.findOneByUser_IdAndId(USER_ID, PROJECT_ID)).willReturn(project);
        given(counterRepository.findByUser_IdAndProject(USER_ID, project)).willReturn(counters);

        List<Counter> allCounters = counterDAO.getAll(USER_ID, PROJECT_ID);

        MatcherAssert.assertThat(allCounters.size(), is(equalTo(counters.size())));
        for (Counter c : allCounters) {
            assertTrue(counters.contains(c));
        }
    }

    @Test
    public void shouldGetOneCounter() throws NotFoundException {
        Project project = new Project();
        //
        Counter counter = new Counter();
        //
        given(projectRepository.findOneByUser_IdAndId(USER_ID, PROJECT_ID)).willReturn(project);
        given(counterRepository.findByUser_IdAndProjectAndName(USER_ID, project, COUNTER_NAME)).willReturn(counter);

        Counter c = counterDAO.get(USER_ID, PROJECT_ID, COUNTER_NAME);

        assertThat(c, is(equalTo(counter)));
    }

    @Test(expected = NotFoundException.class)
    public void shouldThrowAnExceptionIfTheCounterCanNotBeFoundByItsName() throws NotFoundException {
        Project project = new Project();
        //
        given(projectRepository.findOneByUser_IdAndId(USER_ID, PROJECT_ID)).willReturn(project);

        counterDAO.get(USER_ID, PROJECT_ID, COUNTER_NAME); // should fail
    }

    @Test
    public void shouldUpdateACounter() throws NotFoundException {
        User user = new User();
        user.setId(USER_ID);
        //
        Project project = new Project();
        project.setId(PROJECT_ID);
        //
        Counter counter = new Counter();
        counter.setUser(user);
        counter.setProject(project);
        counter.setName(COUNTER_NAME);
        //
        given(projectRepository.findOneByUser_IdAndId(USER_ID, PROJECT_ID)).willReturn(project);
        given(counterRepository.findByUser_IdAndProjectAndName(USER_ID, project, COUNTER_NAME)).willReturn(counter);

        counterDAO.update(counter);

        verify(counterRepository).save(counter);
    }

    @Test(expected = ValidationException.class)
    public void shouldHandleConstraintViolationExceptionOnCounterUpdateGracefully() throws NotFoundException {
        User user = new User();
        user.setId(USER_ID);
        //
        Project project = new Project();
        project.setId(PROJECT_ID);
        //
        Counter counter = new Counter();
        counter.setUser(user);
        counter.setProject(project);
        counter.setName(COUNTER_NAME);
        //
        given(projectRepository.findOneByUser_IdAndId(USER_ID, PROJECT_ID)).willReturn(project);
        given(counterRepository.findByUser_IdAndProjectAndName(USER_ID, project, COUNTER_NAME)).willReturn(counter);
        given(counterRepository.save(counter)).willThrow(ConstraintViolationException.class);

        counterDAO.update(counter); // should fail
    }

    @Test(expected = ValidationException.class)
    public void shouldHandleDataIntegrityViolationExceptionOnCounterUpdateGracefully() throws NotFoundException {
        User user = new User();
        user.setId(USER_ID);
        //
        Project project = new Project();
        project.setId(PROJECT_ID);
        //
        Counter counter = new Counter();
        counter.setUser(user);
        counter.setProject(project);
        counter.setName(COUNTER_NAME);
        //
        given(projectRepository.findOneByUser_IdAndId(USER_ID, PROJECT_ID)).willReturn(project);
        given(counterRepository.findByUser_IdAndProjectAndName(USER_ID, project, COUNTER_NAME)).willReturn(counter);
        given(counterRepository.save(counter)).willThrow(DataIntegrityViolationException.class);

        counterDAO.update(counter); // should fail
    }

    @Test(expected = ValidationException.class)
    public void shouldHandleTransactionSystemExceptionOnCounterUpdateGracefully() throws NotFoundException {
        User user = new User();
        user.setId(USER_ID);
        //
        Project project = new Project();
        project.setId(PROJECT_ID);
        //
        Counter counter = new Counter();
        counter.setUser(user);
        counter.setProject(project);
        counter.setName(COUNTER_NAME);
        //
        ConstraintViolationException constraintViolationException = new ConstraintViolationException("Counter is not valid!", new HashSet<>());
        RollbackException rollbackException = new RollbackException("RollbackException", constraintViolationException);
        TransactionSystemException transactionSystemException = new TransactionSystemException("Spring TransactionSystemException", rollbackException);
        //
        given(projectRepository.findOneByUser_IdAndId(USER_ID, PROJECT_ID)).willReturn(project);
        given(counterRepository.findByUser_IdAndProjectAndName(USER_ID, project, COUNTER_NAME)).willReturn(counter);
        given(counterRepository.save(counter)).willThrow(transactionSystemException);

        counterDAO.update(counter); // should fail
    }

    @Test
    public void shouldDeleteACounter() throws NotFoundException {
        Project project = new Project();
        //
        Counter counter = new Counter();
        List<Counter> counterAsList = Collections.singletonList(counter);

        //
        given(projectRepository.findOneByUser_IdAndId(USER_ID, PROJECT_ID)).willReturn(project);
        given(counterRepository.findAllByUser_IdAndProjectAndNameIn(USER_ID, project, COUNTER_NAME)).willReturn(counterAsList);

        counterDAO.delete(USER_ID, PROJECT_ID, COUNTER_NAME);

        verify(counterRepository).delete(counterAsList);
    }

    @Test(expected = NotFoundException.class)
    public void shouldFailToDeleteACounterThatDoesNotExist() throws NotFoundException {
        counterDAO.delete(USER_ID, PROJECT_ID, COUNTER_NAME);
    }


    private List<Counter> createCounterList() {
        List<Counter> counters = new LinkedList<>();
        for (int i = 0; i  < AMOUNT_OF_COUNTERS; i++) {
            Counter c = new Counter();
            counters.add(c);
        }
        return counters;
    }

}
