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

package de.learnlib.alex.core.learner.connectors;

import de.learnlib.alex.core.dao.CounterDAOImpl;
import de.learnlib.alex.core.entities.Counter;
import de.learnlib.alex.core.entities.Project;
import de.learnlib.alex.core.entities.User;
import de.learnlib.alex.exceptions.NotFoundException;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;

import java.util.Collections;

import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.verify;

@RunWith(MockitoJUnitRunner.class)
public class CounterStoreConnectorTest {

    private static final Long USER_ID = 3L;
    private static final Long PROJECT_ID = 10L;
    private static final String PROJECT_URL = "http://localhost:8000";
    private static final String COUNTER_NAME = "counter";
    private static final Integer COUNTER_VALUE = 42;

    @Mock
    private CounterDAOImpl counterDAO;

    @Mock
    private Counter counter;

    private CounterStoreConnector connector;

    @Before
    public void setUp() {
        connector = new CounterStoreConnector(counterDAO);
    }

    @Test
    public void shouldCorrectlyCreateACounter() throws NotFoundException {
//         given(counterDAO.get(USER_ID, PROJECT_ID, PROJECT_URL, COUNTER_NAME)).willThrow(NotFoundException.class);
//
//         connector.set(USER_ID, PROJECT_ID, PROJECT_URL, COUNTER_NAME, COUNTER_VALUE);
//
//         verify(counterDAO).create(any(Counter.class));
    }

    @Test
    public void shouldCorrectlyUpdateACounter() throws NotFoundException {
        given(counter.getName()).willReturn(COUNTER_NAME);
        given(counterDAO.getAll(USER_ID, PROJECT_ID)).willReturn(Collections.singletonList(counter));

        Project project = new Project();
        project.setId(PROJECT_ID);
        project.setUser(new User(USER_ID));
        connector.registerUrl(PROJECT_URL, project);
        connector.set(USER_ID, PROJECT_ID, PROJECT_URL, COUNTER_NAME, COUNTER_VALUE);

        verify(counter).setValue(COUNTER_VALUE);
    }

    @Test
    public void shouldIncrementACounter() throws NotFoundException {
        given(counter.getName()).willReturn(COUNTER_NAME);
        given(counter.getValue()).willReturn(COUNTER_VALUE);
        given(counterDAO.getAll(USER_ID, PROJECT_ID)).willReturn(Collections.singletonList(counter));

        Project project = new Project();
        project.setId(PROJECT_ID);
        project.setUser(new User(USER_ID));
        connector.registerUrl(PROJECT_URL, project);

        connector.increment(USER_ID, PROJECT_ID, PROJECT_URL, COUNTER_NAME);

        verify(counter).setValue(COUNTER_VALUE + 1);
    }

}
