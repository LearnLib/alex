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

package de.learnlib.alex.data.entities.actions.misc;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;

import com.fasterxml.jackson.databind.ObjectMapper;
import de.learnlib.alex.data.entities.ExecuteResult;
import de.learnlib.alex.data.entities.Project;
import de.learnlib.alex.data.entities.Symbol;
import de.learnlib.alex.data.entities.SymbolAction;
import de.learnlib.alex.learning.services.connectors.ConnectorManager;
import de.learnlib.alex.learning.services.connectors.CounterStoreConnector;
import java.io.File;
import java.io.IOException;
import java.net.URISyntaxException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
public class SetCounterActionTest {

    private static final Long PROJECT_ID = 10L;
    private static final String TEST_NAME = "counter";
    private static final String TEST_VALUE = "42";

    private SetCounterAction setAction;

    @BeforeEach
    public void setUp() {
        Project project = new Project();
        project.setId(PROJECT_ID);

        Symbol symbol = new Symbol();
        symbol.setProject(project);

        setAction = new SetCounterAction();
        setAction.setSymbol(symbol);
        setAction.setName(TEST_NAME);
        setAction.setValue(TEST_VALUE);
        setAction.setValueType(SetCounterAction.ValueType.NUMBER);
    }

    @Test
    public void testJSON() throws IOException {
        ObjectMapper mapper = new ObjectMapper();
        String json = mapper.writeValueAsString(setAction);
        SetCounterAction declareAction2 = (SetCounterAction) mapper.readValue(json, SymbolAction.class);

        assertEquals(setAction.getName(), declareAction2.getName());
        assertEquals(setAction.getValue(), declareAction2.getValue());
    }

    @Test
    public void testJSONFile() throws IOException, URISyntaxException {
        ObjectMapper mapper = new ObjectMapper();

        File file = new File(getClass().getResource("/actions/StoreSymbolActions/SetCounterTestData.json").toURI());
        SymbolAction obj = mapper.readValue(file, SymbolAction.class);

        assertTrue(obj instanceof SetCounterAction);
        SetCounterAction objAsAction = (SetCounterAction) obj;
        assertEquals(TEST_NAME, objAsAction.getName());
        assertEquals(TEST_VALUE, objAsAction.getValue());
    }

    @Test
    public void shouldSuccessfulSetTheCounterValue() {
        CounterStoreConnector counters = mock(CounterStoreConnector.class);

        ConnectorManager connector = mock(ConnectorManager.class);
        given(connector.getConnector(CounterStoreConnector.class)).willReturn(counters);

        ExecuteResult result = setAction.execute(connector);

        assertTrue(result.isSuccess());
        verify(counters).set(PROJECT_ID, TEST_NAME, Integer.parseInt(TEST_VALUE));
    }
}
