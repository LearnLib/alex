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

package de.learnlib.alex.actions;

import com.fasterxml.jackson.databind.ObjectMapper;
import de.learnlib.alex.core.entities.ExecuteResult;
import de.learnlib.alex.core.entities.Symbol;
import de.learnlib.alex.core.entities.SymbolAction;
import de.learnlib.alex.core.learner.connectors.ConnectorManager;
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
public class ExecuteSymbolActionTest {

    @Mock
    private Symbol symbol;

    private ExecuteSymbolAction action;

    @Before
    public void setUp() throws Exception {
        given(symbol.getId()).willReturn(1L);

        action = new ExecuteSymbolAction();
        action.setSymbolToExecute(symbol);
    }

    @Test
    public void testJSON() throws IOException {
        ObjectMapper mapper = new ObjectMapper();
        String json = mapper.writeValueAsString(action);
        json = json.replace(",\"symbolToExecuteName\":null", "");

        ExecuteSymbolAction action2 = mapper.readValue(json, ExecuteSymbolAction.class);

        assertTrue(1L == action2.getSymbolToExecuteAsId());
    }

    @Test
    public void testJSONFile() throws IOException, URISyntaxException {
        ObjectMapper mapper = new ObjectMapper();

        File file = new File(getClass().getResource("/actions/ExecuteSymbolTestData.json").toURI());
        SymbolAction obj = mapper.readValue(file, SymbolAction.class);

        assertTrue(obj instanceof ExecuteSymbolAction);
        ExecuteSymbolAction objAsAction = (ExecuteSymbolAction) obj;
        Long symbolToExecuteAsId = objAsAction.getSymbolToExecuteAsId();
        assertTrue(1L == symbolToExecuteAsId);
    }

    @Test
    public void shouldReturnOKIfSymbolWasExecutedSuccessful() {
        ConnectorManager connectors = mock(ConnectorManager.class);
        given(symbol.execute(connectors)).willReturn(ExecuteResult.OK);

        assertEquals(ExecuteResult.OK, action.execute(connectors));
    }

    @Test
    public void shouldReturnFailedIfSymbolExecutionFailed() {
        ConnectorManager connectors = mock(ConnectorManager.class);
        given(symbol.execute(connectors)).willReturn(ExecuteResult.FAILED);

        assertEquals(ExecuteResult.FAILED, action.execute(connectors));
    }

    @Test
    public void shouldReturnFailedIfSymbolWasNoSet() {
        action.setSymbolToExecute(null);
        ConnectorManager connectors = mock(ConnectorManager.class);

        assertEquals(ExecuteResult.FAILED, action.execute(connectors));
    }

}
