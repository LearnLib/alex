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

package de.learnlib.alex.data.entities.actions.web;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ser.FilterProvider;
import com.fasterxml.jackson.databind.ser.impl.SimpleBeanPropertyFilter;
import com.fasterxml.jackson.databind.ser.impl.SimpleFilterProvider;
import de.learnlib.alex.auth.entities.User;
import de.learnlib.alex.data.entities.ExecuteResult;
import de.learnlib.alex.data.entities.Project;
import de.learnlib.alex.data.entities.PropertyFilterMixIn;
import de.learnlib.alex.data.entities.Symbol;
import de.learnlib.alex.data.entities.SymbolActionStep;
import de.learnlib.alex.data.entities.SymbolGroup;
import de.learnlib.alex.data.entities.actions.misc.WaitAction;
import de.learnlib.alex.learning.services.connectors.ConnectorManager;
import de.learnlib.alex.learning.services.connectors.CounterStoreConnector;
import de.learnlib.alex.learning.services.connectors.VariableStoreConnector;
import org.json.JSONException;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.junit.MockitoJUnitRunner;
import org.skyscreamer.jsonassert.JSONAssert;

import java.io.File;
import java.io.IOException;
import java.net.URISyntaxException;
import java.util.Arrays;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;

@RunWith(MockitoJUnitRunner.class)
public class WebSymbolTest {

    private static final Long ONE_SECOND = 1000L;

    private Symbol symbol;

    private ObjectMapper mapper;

    @Before
    public void setUp() {
        mapper = new ObjectMapper();

        User user = new User();
        user.setId(42L);

        Project project = new Project();
        project.setId(1L);
        project.setName("Web Symbol Test Project");

        SymbolGroup group = new SymbolGroup();
        group.setId(2L);
        group.setName("Web Symbol Test Project");

        symbol = new Symbol();
        symbol.setProject(project);
        symbol.setGroup(group);
        symbol.setName("WebSymbol");

        WebSymbolAction a1 = new ClickAction();
        a1.setId(1L);
        CheckTextWebAction a2 = new CheckTextWebAction();
        a2.setId(2L);
        a2.setValue("F[oO0]+");
        a2.setRegexp(true);
        WaitAction a3 = new WaitAction();
        a3.setId(3L);
        a3.setDuration(ONE_SECOND);

        final SymbolActionStep step1 = new SymbolActionStep();
        step1.setPosition(0);
        step1.setAction(a1);

        final SymbolActionStep step2 = new SymbolActionStep();
        step2.setPosition(1);
        step2.setAction(a2);

        final SymbolActionStep step3 = new SymbolActionStep();
        step3.setPosition(2);
        step3.setAction(a3);

        symbol.getSteps().addAll(Arrays.asList(step1, step2, step3));
    }

    @Test
    public void ensureThatSerializingAndThenDeserializingChangesNothing() throws IOException {
        String json = mapper.writeValueAsString(symbol);

        Symbol symbolFromMapper = mapper.readValue(json, Symbol.class);
        assertEquals(symbol.getProjectId(), symbolFromMapper.getProjectId());
        assertEquals(symbol.getId(), symbolFromMapper.getId());
        assertEquals(symbol.getName(), symbolFromMapper.getName());
        assertEquals(symbol.getGroupId(), symbolFromMapper.getGroupId());
    }

    @Test
    public void ensureThatSerializingASymbolWithoutProjectDoesNotCrash() throws JsonProcessingException, JSONException {
        String expectedJson = "{\"steps\":" + createActionSteps(symbol.getId()) + ",\"description\":\"\",\"expectedResult\":\"\",\"group\":2,\"id\":null,\"inputs\":[],\"name\":\"WebSymbol\",\"outputs\":[],\"project\":null,\"successOutput\":null}";
        symbol.setProject(null);

        mapper.addMixIn(Object.class, PropertyFilterMixIn.class);

        SimpleBeanPropertyFilter filter = SimpleBeanPropertyFilter.serializeAllExcept("hidden");
        FilterProvider filters = new SimpleFilterProvider().addFilter("filter properties by name", filter);

        String json = mapper.writer(filters).writeValueAsString(symbol);
        JSONAssert.assertEquals(expectedJson, json, true);
    }

    @Test
    public void ensureThatSerializingCreatesTheRightJSON() throws JsonProcessingException, JSONException {
        String expectedJson = "{\"steps\":" + createActionSteps(symbol.getId()) + ",\"description\":\"\",\"expectedResult\":\"\",\"group\":2,\"hidden\":false,\"id\":null,\"inputs\":[],\"name\":\"WebSymbol\",\"outputs\":[],\"project\":1,\"successOutput\":null}";
        String json = mapper.writeValueAsString(symbol);

        JSONAssert.assertEquals(expectedJson, json, true);
    }

    @Test
    public void shouldReadJSONFileCorrectly() throws IOException, URISyntaxException {
        File file = new File(getClass().getResource("/actions/websymbolactions/WebSymbolTestData.json").toURI());
        symbol = mapper.readValue(file, Symbol.class);

        assertEquals("Test Symbol", symbol.getName());

        Class<?>[] expectedActions = {
                CheckNodeAction.class,
                CheckTextWebAction.class,
                ClearAction.class,
                ClickAction.class,
                FillAction.class,
                SubmitAction.class,
                WaitAction.class
        };

        assertEquals(expectedActions.length, symbol.getSteps().size());
        for (int i = 0; i < expectedActions.length; i++) {
            assertTrue(expectedActions[i].isInstance(((SymbolActionStep) symbol.getSteps().get(i)).getAction()));
        }
    }

    @Test
    public void shouldReturnOkIfAllActionsRunSuccessfully() throws Exception {
        ConnectorManager connector = mock(ConnectorManager.class);
        WebSymbolAction action1 = mock(WebSymbolAction.class);
        given(action1.executeAction(connector)).willReturn(new ExecuteResult(true));
        WebSymbolAction action2 = mock(WebSymbolAction.class);
        given(action2.executeAction(connector)).willReturn(new ExecuteResult(true));

        given(connector.getConnector(VariableStoreConnector.class)).willReturn(mock(VariableStoreConnector.class));
        given(connector.getConnector(CounterStoreConnector.class)).willReturn(mock(CounterStoreConnector.class));

        final SymbolActionStep s1 = new SymbolActionStep(action1);
        final SymbolActionStep s2 = new SymbolActionStep(action2);

        symbol = new Symbol();
        symbol.getSteps().addAll(Arrays.asList(s1, s2));

        assertTrue(symbol.execute(connector).isSuccess());
    }

    @Test
    public void shouldReturnFailedIfOneActionFails() throws Exception {
        ConnectorManager connector = mock(ConnectorManager.class);
        WebSymbolAction action1 = mock(WebSymbolAction.class);
        given(action1.executeAction(connector)).willReturn(new ExecuteResult(false));
        WebSymbolAction action2 = mock(WebSymbolAction.class);

        given(connector.getConnector(VariableStoreConnector.class)).willReturn(mock(VariableStoreConnector.class));
        given(connector.getConnector(CounterStoreConnector.class)).willReturn(mock(CounterStoreConnector.class));

        final SymbolActionStep s1 = new SymbolActionStep(action1);
        final SymbolActionStep s2 = new SymbolActionStep(action2);

        symbol = new Symbol();
        symbol.getSteps().addAll(Arrays.asList(s1, s2));

        assertFalse(symbol.execute(connector).isSuccess());
        verify(action2, never()).execute(connector);
    }

    private String createActionSteps(Long symbolId) {
        return "["
                + "{\"id\": null, \"errorOutput\":null, \"negated\":false, \"ignoreFailure\": false, \"position\": 0, \"symbol\": " + symbolId + ", \"disabled\": false, \"type\": \"action\", \"action\": {\"id\": 1,\"type\":\"web_click\",\"node\":null,\"doubleClick\":false}}"
                + ",{\"id\": null, \"errorOutput\":null, \"negated\":false, \"ignoreFailure\": false, \"position\": 1, \"symbol\": " + symbolId + ", \"disabled\": false, \"type\": \"action\", \"action\": {\"id\": 2,\"type\":\"web_checkForText\",\"value\":\"F[oO0]+\",\"regexp\":true,\"node\":{\"selector\":\"document\",\"type\":\"CSS\"}}}"
                + ",{\"id\": null, \"errorOutput\":null, \"negated\":false, \"ignoreFailure\": false, \"position\": 2, \"symbol\": " + symbolId + ", \"disabled\": false, \"type\": \"action\", \"action\": {\"id\": 3,\"type\":\"wait\",\"duration\":1000}}"
                + "]";
    }
}
