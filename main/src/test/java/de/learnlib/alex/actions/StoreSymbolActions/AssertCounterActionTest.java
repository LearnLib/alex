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

package de.learnlib.alex.actions.StoreSymbolActions;

import com.fasterxml.jackson.databind.ObjectMapper;
import de.learnlib.alex.core.entities.ExecuteResult;
import de.learnlib.alex.core.entities.Project;
import de.learnlib.alex.core.entities.SymbolAction;
import de.learnlib.alex.core.entities.User;
import de.learnlib.alex.core.learner.connectors.ConnectorManager;
import de.learnlib.alex.core.learner.connectors.CounterStoreConnector;
import de.learnlib.alex.core.learner.connectors.WebSiteConnector;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;

import java.io.File;
import java.io.IOException;
import java.net.URISyntaxException;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.mock;

@RunWith(MockitoJUnitRunner.class)
public class AssertCounterActionTest {

    private static final String TEST_NAME = "counter";
    private static final Integer TEST_VALUE = 42;
    private static final String PROJECT_URL = "http://localhost:8000";

    @Mock
    private User user;

    @Mock
    private Project project;

    private AssertCounterAction assertAction;

    @Before
    public void setUp() {
        assertAction = new AssertCounterAction();
        assertAction.setUser(user);
        assertAction.setProject(project);
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

        WebSiteConnector webSiteConnector = mock(WebSiteConnector.class);
        given(webSiteConnector.getBaseUrl()).willReturn(PROJECT_URL);

        ConnectorManager connector = mock(ConnectorManager.class);
        given(connector.getConnector(CounterStoreConnector.class)).willReturn(counters);
        given(connector.getConnector(WebSiteConnector.class)).willReturn(webSiteConnector);

        assertAction.setOperator(AssertCounterAction.Operator.LESS_THAN);

        // <
        given(counters.get(PROJECT_URL, TEST_NAME)).willReturn(TEST_VALUE - 1);
        ExecuteResult result = assertAction.execute(connector);
        assertEquals("LESS fails on <", ExecuteResult.OK, result);

        // ==
        given(counters.get(PROJECT_URL, TEST_NAME)).willReturn(TEST_VALUE);
        result = assertAction.execute(connector);
        assertEquals("LESS fails on ==", ExecuteResult.FAILED, result);

        // >
        given(counters.get(PROJECT_URL, TEST_NAME)).willReturn(TEST_VALUE + 1);
        result = assertAction.execute(connector);
        assertEquals("LESS fails on >", ExecuteResult.FAILED, result);
    }

    @Test
    public void ensureThatLessOrEqualsWorks() {
        CounterStoreConnector counters = mock(CounterStoreConnector.class);

        WebSiteConnector webSiteConnector = mock(WebSiteConnector.class);
        given(webSiteConnector.getBaseUrl()).willReturn(PROJECT_URL);

        ConnectorManager connector = mock(ConnectorManager.class);
        given(connector.getConnector(CounterStoreConnector.class)).willReturn(counters);
        given(connector.getConnector(WebSiteConnector.class)).willReturn(webSiteConnector);

        assertAction.setOperator(AssertCounterAction.Operator.LESS_OR_EQUAL);

        // <
        given(counters.get(PROJECT_URL, TEST_NAME)).willReturn(TEST_VALUE - 1);
        ExecuteResult result = assertAction.execute(connector);
        assertEquals("LESS_OR_EQUAL fails on <", ExecuteResult.OK, result);

        // ==
        given(counters.get(PROJECT_URL, TEST_NAME)).willReturn(TEST_VALUE);
        result = assertAction.execute(connector);
        assertEquals("LESS_OR_EQUAL fails on ==", ExecuteResult.OK, result);

        // >
        given(counters.get(PROJECT_URL, TEST_NAME)).willReturn(TEST_VALUE + 1);
        result = assertAction.execute(connector);
        assertEquals("LESS_OR_EQUAL fails on >", ExecuteResult.FAILED, result);
    }

    @Test
    public void ensureThatEqualsWorks() {
        CounterStoreConnector counters = mock(CounterStoreConnector.class);

        WebSiteConnector webSiteConnector = mock(WebSiteConnector.class);
        given(webSiteConnector.getBaseUrl()).willReturn(PROJECT_URL);

        ConnectorManager connector = mock(ConnectorManager.class);
        given(connector.getConnector(CounterStoreConnector.class)).willReturn(counters);
        given(connector.getConnector(WebSiteConnector.class)).willReturn(webSiteConnector);

        assertAction.setOperator(AssertCounterAction.Operator.EQUAL);

        // <
        given(counters.get(PROJECT_URL, TEST_NAME)).willReturn(TEST_VALUE - 1);
        ExecuteResult result = assertAction.execute(connector);
        assertEquals("EQUALS fails on <", ExecuteResult.FAILED, result);

        // ==
        given(counters.get(PROJECT_URL, TEST_NAME)).willReturn(TEST_VALUE);
        result = assertAction.execute(connector);
        assertEquals("EQUALS fails on ==", ExecuteResult.OK, result);

        // >
        given(counters.get(PROJECT_URL, TEST_NAME)).willReturn(TEST_VALUE + 1);
        result = assertAction.execute(connector);
        assertEquals("EQUALS fails on >", ExecuteResult.FAILED, result);
    }

    @Test
    public void ensureThatGreaterOrEqualsWorks() {
        CounterStoreConnector counters = mock(CounterStoreConnector.class);

        WebSiteConnector webSiteConnector = mock(WebSiteConnector.class);
        given(webSiteConnector.getBaseUrl()).willReturn(PROJECT_URL);

        ConnectorManager connector = mock(ConnectorManager.class);
        given(connector.getConnector(CounterStoreConnector.class)).willReturn(counters);
        given(connector.getConnector(WebSiteConnector.class)).willReturn(webSiteConnector);

        assertAction.setOperator(AssertCounterAction.Operator.GREATER_OR_EQUAL);

        // <
        given(counters.get(PROJECT_URL, TEST_NAME)).willReturn(TEST_VALUE - 1);
        ExecuteResult result = assertAction.execute(connector);
        assertEquals("GREATER_OR_EQUAL fails on <", ExecuteResult.FAILED, result);

        // ==
        given(counters.get(PROJECT_URL, TEST_NAME)).willReturn(TEST_VALUE);
        result = assertAction.execute(connector);
        assertEquals("GREATER_OR_EQUAL fails on ==", ExecuteResult.OK, result);

        // >
        given(counters.get(PROJECT_URL, TEST_NAME)).willReturn(TEST_VALUE + 1);
        result = assertAction.execute(connector);
        assertEquals("GREATER_OR_EQUAL fails on >", ExecuteResult.OK, result);
    }

    @Test
    public void ensureThatGreaterWorks() {
        CounterStoreConnector counters = mock(CounterStoreConnector.class);

        WebSiteConnector webSiteConnector = mock(WebSiteConnector.class);
        given(webSiteConnector.getBaseUrl()).willReturn(PROJECT_URL);

        ConnectorManager connector = mock(ConnectorManager.class);
        given(connector.getConnector(CounterStoreConnector.class)).willReturn(counters);
        given(connector.getConnector(WebSiteConnector.class)).willReturn(webSiteConnector);

        assertAction.setOperator(AssertCounterAction.Operator.GREATER_THAN);

        // <
        given(counters.get(PROJECT_URL, TEST_NAME)).willReturn(TEST_VALUE - 1);
        ExecuteResult result = assertAction.execute(connector);
        assertEquals("GREATER fails on <", ExecuteResult.FAILED, result);

        // ==
        given(counters.get(PROJECT_URL, TEST_NAME)).willReturn(TEST_VALUE);
        result = assertAction.execute(connector);
        assertEquals("GREATER fails on ==", ExecuteResult.FAILED, result);

        // >
        given(counters.get(PROJECT_URL, TEST_NAME)).willReturn(TEST_VALUE + 1);
        result = assertAction.execute(connector);
        assertEquals("GREATER fails on >", ExecuteResult.OK, result);
    }

}
