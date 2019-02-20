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

package de.learnlib.alex.data.entities.actions.misc;

import com.fasterxml.jackson.databind.ObjectMapper;
import de.learnlib.alex.data.entities.ExecuteResult;
import de.learnlib.alex.data.entities.SymbolAction;
import de.learnlib.alex.learning.services.connectors.ConnectorManager;
import de.learnlib.alex.learning.services.connectors.CounterStoreConnector;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.junit.MockitoJUnitRunner;

import java.io.File;
import java.io.IOException;
import java.net.URISyntaxException;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.mock;

@RunWith(MockitoJUnitRunner.class)
public class AssertCounterActionTest {

    private static final String  TEST_NAME = "counter";
    private static final Integer TEST_VALUE = 42;

    private AssertCounterAction assertAction;

    @Before
    public void setUp() {
        assertAction = new AssertCounterAction();
        assertAction.setName(TEST_NAME);
        assertAction.setValue(TEST_VALUE);
        assertAction.setOperator(AssertCounterAction.Operator.EQUAL);
    }

    @Test
    public void testJSON() throws IOException {
        ObjectMapper mapper = new ObjectMapper();
        String json = mapper.writeValueAsString(assertAction);
        AssertCounterAction assertAction2 = (AssertCounterAction) mapper.readValue(json, SymbolAction.class);

        assertEquals(assertAction.getName(), assertAction2.getName());
        assertEquals(assertAction.getValue(), assertAction2.getValue());
        assertEquals(assertAction.getOperator(), assertAction2.getOperator());
    }

    @Test
    public void testJSONFile() throws IOException, URISyntaxException {
        ObjectMapper mapper = new ObjectMapper();

        File file = new File(getClass().getResource("/actions/StoreSymbolActions/AssertCounterTestData.json").toURI());
        SymbolAction obj = mapper.readValue(file, SymbolAction.class);

        assertTrue(obj instanceof AssertCounterAction);
        AssertCounterAction objAsAction = (AssertCounterAction) obj;
        assertEquals(TEST_NAME, objAsAction.getName());
        assertEquals(TEST_VALUE, objAsAction.getValue());
        assertEquals(AssertCounterAction.Operator.EQUAL, objAsAction.getOperator());
    }

    @Test
    public void ensureThatLessWorks() {
        CounterStoreConnector counters = mock(CounterStoreConnector.class);

        ConnectorManager connector = mock(ConnectorManager.class);
        given(connector.getConnector(CounterStoreConnector.class)).willReturn(counters);

        assertAction.setOperator(AssertCounterAction.Operator.LESS_THAN);

        // <
        given(counters.get(TEST_NAME)).willReturn(TEST_VALUE - 1);
        ExecuteResult result = assertAction.execute(connector);
        assertTrue("LESS fails on <", result.isSuccess());

        // ==
        given(counters.get(TEST_NAME)).willReturn(TEST_VALUE);
        result = assertAction.execute(connector);
        assertFalse("LESS fails on ==", result.isSuccess());

        // >
        given(counters.get(TEST_NAME)).willReturn(TEST_VALUE + 1);
        result = assertAction.execute(connector);
        assertFalse("LESS fails on >", result.isSuccess());
    }

    @Test
    public void ensureThatLessOrEqualsWorks() {
        CounterStoreConnector counters = mock(CounterStoreConnector.class);

        ConnectorManager connector = mock(ConnectorManager.class);
        given(connector.getConnector(CounterStoreConnector.class)).willReturn(counters);

        assertAction.setOperator(AssertCounterAction.Operator.LESS_OR_EQUAL);

        // <
        given(counters.get(TEST_NAME)).willReturn(TEST_VALUE - 1);
        ExecuteResult result = assertAction.execute(connector);
        assertTrue("LESS_OR_EQUAL fails on <", result.isSuccess());

        // ==
        given(counters.get(TEST_NAME)).willReturn(TEST_VALUE);
        result = assertAction.execute(connector);
        assertTrue("LESS_OR_EQUAL fails on ==", result.isSuccess());

        // >
        given(counters.get(TEST_NAME)).willReturn(TEST_VALUE + 1);
        result = assertAction.execute(connector);
        assertFalse("LESS_OR_EQUAL fails on >", result.isSuccess());
    }

    @Test
    public void ensureThatEqualsWorks() {
        CounterStoreConnector counters = mock(CounterStoreConnector.class);

        ConnectorManager connector = mock(ConnectorManager.class);
        given(connector.getConnector(CounterStoreConnector.class)).willReturn(counters);

        assertAction.setOperator(AssertCounterAction.Operator.EQUAL);

        // <
        given(counters.get(TEST_NAME)).willReturn(TEST_VALUE - 1);
        ExecuteResult result = assertAction.execute(connector);
        assertFalse("EQUALS fails on <", result.isSuccess());

        // ==
        given(counters.get(TEST_NAME)).willReturn(TEST_VALUE);
        result = assertAction.execute(connector);
        assertTrue("EQUALS fails on ==", result.isSuccess());

        // >
        given(counters.get(TEST_NAME)).willReturn(TEST_VALUE + 1);
        result = assertAction.execute(connector);
        assertFalse("EQUALS fails on >", result.isSuccess());
    }

    @Test
    public void ensureThatGreaterOrEqualsWorks() {
        CounterStoreConnector counters = mock(CounterStoreConnector.class);

        ConnectorManager connector = mock(ConnectorManager.class);
        given(connector.getConnector(CounterStoreConnector.class)).willReturn(counters);

        assertAction.setOperator(AssertCounterAction.Operator.GREATER_OR_EQUAL);

        // <
        given(counters.get(TEST_NAME)).willReturn(TEST_VALUE - 1);
        ExecuteResult result = assertAction.execute(connector);
        assertFalse("GREATER_OR_EQUAL fails on <", result.isSuccess());

        // ==
        given(counters.get(TEST_NAME)).willReturn(TEST_VALUE);
        result = assertAction.execute(connector);
        assertTrue("GREATER_OR_EQUAL fails on ==", result.isSuccess());

        // >
        given(counters.get(TEST_NAME)).willReturn(TEST_VALUE + 1);
        result = assertAction.execute(connector);
        assertTrue("GREATER_OR_EQUAL fails on >", result.isSuccess());
    }

    @Test
    public void ensureThatGreaterWorks() {
        CounterStoreConnector counters = mock(CounterStoreConnector.class);

        ConnectorManager connector = mock(ConnectorManager.class);
        given(connector.getConnector(CounterStoreConnector.class)).willReturn(counters);

        assertAction.setOperator(AssertCounterAction.Operator.GREATER_THAN);

        // <
        given(counters.get(TEST_NAME)).willReturn(TEST_VALUE - 1);
        ExecuteResult result = assertAction.execute(connector);
        assertFalse("GREATER fails on <", result.isSuccess());

        // ==
        given(counters.get(TEST_NAME)).willReturn(TEST_VALUE);
        result = assertAction.execute(connector);
        assertFalse("GREATER fails on ==", result.isSuccess());

        // >
        given(counters.get(TEST_NAME)).willReturn(TEST_VALUE + 1);
        result = assertAction.execute(connector);
        assertTrue("GREATER fails on >", result.isSuccess());
    }

}
