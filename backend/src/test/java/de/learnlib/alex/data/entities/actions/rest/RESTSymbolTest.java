/*
 * Copyright 2015 - 2020 TU Dortmund
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

package de.learnlib.alex.data.entities.actions.rest;

import de.learnlib.alex.data.entities.ExecuteResult;
import de.learnlib.alex.data.entities.Symbol;
import de.learnlib.alex.data.entities.SymbolActionStep;
import de.learnlib.alex.learning.services.connectors.ConnectorManager;
import de.learnlib.alex.learning.services.connectors.CounterStoreConnector;
import de.learnlib.alex.learning.services.connectors.VariableStoreConnector;
import org.junit.Before;
import org.junit.Test;

import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;

public class RESTSymbolTest {

    private Symbol symbol;
    private RESTSymbolAction action1;
    private RESTSymbolAction action2;

    private ConnectorManager connectors;

    @Before
    public void setUp() {
        action1 = mock(RESTSymbolAction.class);
        action2 = mock(RESTSymbolAction.class);

        final SymbolActionStep step1 = new SymbolActionStep();
        step1.setAction(action1);

        final SymbolActionStep step2 = new SymbolActionStep();
        step2.setAction(action2);

        symbol = new Symbol();
        symbol.getSteps().add(step1);
        symbol.getSteps().add(step2);

        connectors = mock(ConnectorManager.class);
        given(connectors.getConnector(VariableStoreConnector.class)).willReturn(mock(VariableStoreConnector.class));
        given(connectors.getConnector(CounterStoreConnector.class)).willReturn(mock(CounterStoreConnector.class));
    }

    @Test
    public void shouldReturnOkIfAllActionsRunSuccessfully() throws Exception {
        given(action1.executeAction(connectors)).willReturn(new ExecuteResult(true));
        given(action2.executeAction(connectors)).willReturn(new ExecuteResult(true));

        ExecuteResult result = symbol.execute(connectors);
        assertTrue(result.isSuccess());
    }

    @Test
    public void shouldReturnFailedIfOneActionsRunFailed() throws Exception {
        given(action1.executeAction(connectors)).willReturn(new ExecuteResult(false));
        given(action2.executeAction(connectors)).willReturn(new ExecuteResult(true));

        ExecuteResult result = symbol.execute(connectors);

        assertFalse(result.isSuccess());
        verify(action2, never()).executeAction(connectors);
    }

}
