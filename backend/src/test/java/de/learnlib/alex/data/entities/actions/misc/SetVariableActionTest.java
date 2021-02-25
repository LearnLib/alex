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

package de.learnlib.alex.data.entities.actions.misc;

import com.fasterxml.jackson.databind.ObjectMapper;
import de.learnlib.alex.data.entities.ExecuteResult;
import de.learnlib.alex.data.entities.Symbol;
import de.learnlib.alex.data.entities.SymbolAction;
import de.learnlib.alex.learning.services.connectors.ConnectorManager;
import de.learnlib.alex.learning.services.connectors.CounterStoreConnector;
import de.learnlib.alex.learning.services.connectors.VariableStoreConnector;
import de.learnlib.alex.learning.services.connectors.WebSiteConnector;
import org.junit.Before;
import org.junit.Test;

import java.io.File;
import java.io.IOException;
import java.net.URISyntaxException;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;

public class SetVariableActionTest {

    private static final String PROJECT_URL = "http://localhost:8000";

    private static final String TEST_VALUE = "foobar";
    private static final String TEST_NAME = "variable";

    private SetVariableAction setAction;

    @Before
    public void setUp() {
        Symbol symbol = new Symbol();

        setAction = new SetVariableAction();
        setAction.setSymbol(symbol);
        setAction.setName(TEST_NAME);
        setAction.setValue(TEST_VALUE);
    }

    @Test
    public void testJSON() throws IOException {
        ObjectMapper mapper = new ObjectMapper();
        String json = mapper.writeValueAsString(setAction);
        SetVariableAction declareAction2 = (SetVariableAction) mapper.readValue(json, SymbolAction.class);

        assertEquals(setAction.getName(), declareAction2.getName());
        assertEquals(setAction.getValue(), declareAction2.getValue());
    }

    @Test
    public void testJSONFile() throws IOException, URISyntaxException {
        ObjectMapper mapper = new ObjectMapper();

        File file = new File(getClass().getResource("/actions/StoreSymbolActions/SetVariableTestData.json").toURI());
        SymbolAction obj = mapper.readValue(file, SymbolAction.class);

        assertTrue(obj instanceof SetVariableAction);
        SetVariableAction objAsAction = (SetVariableAction) obj;
        assertEquals(TEST_NAME, objAsAction.getName());
        assertEquals(TEST_VALUE, objAsAction.getValue());
    }

    @Test
    public void shouldSuccessfulSetTheVariableValue() {
        VariableStoreConnector variables = mock(VariableStoreConnector.class);
        ConnectorManager connector = mock(ConnectorManager.class);
        given(connector.getConnector(VariableStoreConnector.class)).willReturn(variables);

        ExecuteResult result = setAction.executeAction(connector);

        assertTrue(result.isSuccess());
        verify(variables).set(TEST_NAME, TEST_VALUE);
    }

    @Test
    public void shouldSuccessfulSetTheVariableValueWithCounter() {
        CounterStoreConnector counters = mock(CounterStoreConnector.class);
        given(counters.get("counter")).willReturn(2);

        WebSiteConnector webSiteConnector = mock(WebSiteConnector.class);
        VariableStoreConnector variables = mock(VariableStoreConnector.class);

        ConnectorManager connector = mock(ConnectorManager.class);
        given(connector.getConnector(WebSiteConnector.class)).willReturn(webSiteConnector);
        given(connector.getConnector(CounterStoreConnector.class)).willReturn(counters);
        given(connector.getConnector(VariableStoreConnector.class)).willReturn(variables);

        setAction.setValue(TEST_VALUE + "{{#counter}}");

        ExecuteResult result = setAction.executeAction(connector);

        assertTrue(result.isSuccess());
        verify(variables).set(TEST_NAME, TEST_VALUE + "2");
    }

}
