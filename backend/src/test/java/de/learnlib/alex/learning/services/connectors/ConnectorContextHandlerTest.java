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

package de.learnlib.alex.learning.services.connectors;

import de.learnlib.alex.data.entities.ExecuteResult;
import de.learnlib.alex.data.entities.ParameterizedSymbol;
import de.learnlib.alex.data.entities.Symbol;
import de.learnlib.alex.learning.exceptions.LearnerException;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnitRunner;

import static org.junit.Assert.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;

@RunWith(MockitoJUnitRunner.class)
public class ConnectorContextHandlerTest {

    private ConnectorContextHandler handler;

    @Mock
    private ParameterizedSymbol resetSymbol;

    @Before
    public void setUp() {
        Symbol symbol = new Symbol();
        symbol.setId(1L);
        given(resetSymbol.getSymbol()).willReturn(symbol);
    }

    @Test
    public void shouldCreateTheContextCorrectly() {
        given(resetSymbol.execute(any(ConnectorManager.class))).willReturn(new ExecuteResult(true));

        ConnectorManager connectorManager = new ConnectorManager();
        VariableStoreConnector connector1 = mock(VariableStoreConnector.class);
        CounterStoreConnector connector2 = mock(CounterStoreConnector.class);
        connectorManager.addConnector(connector1);
        connectorManager.addConnector(connector2);

        handler = new ConnectorContextHandler(connectorManager, resetSymbol, null);

        assertEquals(connector1, connectorManager.getConnector(connector1.getClass()));
        assertEquals(connector2, connectorManager.getConnector(connector2.getClass()));

        handler.createContext();
        verify(connector1).reset();
        verify(connector2).reset();
        verify(resetSymbol).execute(any(ConnectorManager.class));
    }

    @Test(expected = LearnerException.class)
    public void shouldThrowAnExceptionIfTheResetSymbolExecutionFailed() {
        given(resetSymbol.execute(any(ConnectorManager.class))).willReturn(new ExecuteResult(false));

        handler = new ConnectorContextHandler(createConnectorManager(), resetSymbol, null);
        handler.createContext(); // should fail
    }

    private ConnectorManager createConnectorManager() {
        ConnectorManager connectorManager = new ConnectorManager();
        Connector connector1 = mock(VariableStoreConnector.class);
        Connector connector2 = mock(CounterStoreConnector.class);
        connectorManager.addConnector(connector1);
        connectorManager.addConnector(connector2);
        return connectorManager;
    }
}
