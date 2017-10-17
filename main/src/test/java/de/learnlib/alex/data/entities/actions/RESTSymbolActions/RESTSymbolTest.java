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

package de.learnlib.alex.data.entities.actions.RESTSymbolActions;

import de.learnlib.alex.data.entities.Symbol;
import de.learnlib.alex.learning.entities.ExecuteResult;
import de.learnlib.alex.learning.services.connectors.ConnectorManager;
import org.junit.Before;
import org.junit.Test;

import static org.junit.Assert.assertEquals;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;

public class RESTSymbolTest {

    private Symbol symbol;
    private RESTSymbolAction action1;
    private RESTSymbolAction action2;

    @Before
    public void setUp() {
        action1 = mock(RESTSymbolAction.class);
        action2 = mock(RESTSymbolAction.class);

        symbol = new Symbol();
        symbol.addAction(action1);
        symbol.addAction(action2);
    }

    @Test
    public void shouldReturnOkIfAllActionsRunSuccessfully() throws Exception {
        ConnectorManager connector = mock(ConnectorManager.class);
        given(action1.executeAction(connector)).willReturn(ExecuteResult.OK);
        given(action2.executeAction(connector)).willReturn(ExecuteResult.OK);

        ExecuteResult result = symbol.execute(connector);

        assertEquals(ExecuteResult.OK, result);
    }

    @Test
    public void shouldReturnFailedIfOneActionsRunFailed() throws Exception {
        ConnectorManager connector = mock(ConnectorManager.class);
        given(action1.executeAction(connector)).willReturn(ExecuteResult.FAILED);
        given(action2.executeAction(connector)).willReturn(ExecuteResult.OK);

        ExecuteResult result = symbol.execute(connector);

        assertEquals(ExecuteResult.FAILED, result);
        verify(action2, never()).executeAction(connector);
    }

    @Test
    public void shouldReturnFailedIfOneActionsThrowsAnException() throws Exception {
        ConnectorManager connector = mock(ConnectorManager.class);
        given(action1.executeAction(connector)).willThrow(IllegalStateException.class);
        given(action2.executeAction(connector)).willReturn(ExecuteResult.OK);

        ExecuteResult result = symbol.execute(connector);

        assertEquals(ExecuteResult.FAILED, result);
        verify(action2, never()).executeAction(connector);
    }

}
