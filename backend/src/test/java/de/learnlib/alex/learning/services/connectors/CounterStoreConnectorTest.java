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

package de.learnlib.alex.learning.services.connectors;

import de.learnlib.alex.auth.entities.User;
import de.learnlib.alex.data.dao.CounterDAO;
import de.learnlib.alex.data.entities.Counter;
import de.learnlib.alex.data.entities.Project;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.junit.MockitoJUnitRunner;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.mockito.Mockito.mock;

@RunWith(MockitoJUnitRunner.class)
public class CounterStoreConnectorTest {

    private static final Long PROJECT_ID = 10L;
    private static final String COUNTER_NAME = "counter";
    private static final Integer COUNTER_VALUE = 42;

    private CounterStoreConnector connector;

    @Before
    public void setUp() {
        connector = new CounterStoreConnector(mock(CounterDAO.class), mock(User.class), mock(Project.class), new ArrayList<>());
    }

    @Test
    public void shouldInitializeTheInternalStoreCorrectly() {
        Counter c1 = new Counter();
        c1.setName("c1");
        c1.setValue(3);

        Counter c2 = new Counter();
        c2.setName("c2");
        c1.setValue(4);

        List<Counter> counters = new ArrayList<>(Arrays.asList(c1, c2));

        CounterStoreConnector connector = new CounterStoreConnector(mock(CounterDAO.class), mock(User.class), mock(Project.class), counters);

        assertEquals(connector.get(c1.getName()), c1.getValue());
        assertEquals(connector.get(c2.getName()), c2.getValue());
    }

    @Test
    public void shouldSetTheCounterValue() {
        connector.set(PROJECT_ID, COUNTER_NAME, COUNTER_VALUE);
        assertNotNull(connector.get(COUNTER_NAME));
        assertEquals(connector.get(COUNTER_NAME), COUNTER_VALUE);
    }

    @Test
    public void shouldIncrementTheCounterValue() {
        connector.set(PROJECT_ID, COUNTER_NAME, COUNTER_VALUE);
        connector.incrementBy(PROJECT_ID, COUNTER_NAME, 5);
        assertEquals(connector.get(COUNTER_NAME), new Integer(COUNTER_VALUE + 5));
    }

    @Test(expected = IllegalStateException.class)
    public void shouldFailToIncrementTheCounterIfNotDefined() {
        connector.incrementBy(PROJECT_ID, COUNTER_NAME, 5);
    }

    @Test(expected = IllegalStateException.class)
    public void shouldFailToGetTheCounterIfNotDefined() {
        connector.get(COUNTER_NAME);
    }

    @Test
    public void shouldPersistNewlyCreatedCounters() {
        // TODO
    }

    @Test
    public void shouldUpdateExistingCounters() {
        // TODO
    }
}
