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

package de.learnlib.alex.core.learner.connectors;

import de.learnlib.alex.core.entities.ExecuteResult;
import de.learnlib.alex.core.entities.Symbol;
import de.learnlib.alex.exceptions.LearnerException;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;

import static org.junit.Assert.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;

@RunWith(MockitoJUnitRunner.class)
public class ConnectorContextHandlerTest {

    private ConnectorContextHandler handler;

    @Mock
    private Symbol resetSymbol;

    @Before
    public void setUp() {
        handler = new ConnectorContextHandler();
        handler.setResetSymbol(resetSymbol);
    }

    @Test
    public void shouldCreateTheContextCorrectly() throws Exception {
        given(resetSymbol.execute(any(ConnectorManager.class))).willReturn(ExecuteResult.OK);

        ConnectorManager connectorManager = new ConnectorManager();
        Connector connector1 = mock(VariableStoreConnector.class);
        Connector connector2 = mock(CounterStoreConnector.class);
        connectorManager.addConnector(connector1);
        connectorManager.addConnector(connector2);
        handler.addConnectorManager(connectorManager);
        ConnectorManager context = handler.createContext();

        assertEquals(connector1, context.getConnector(connector1.getClass()));
        assertEquals(connector2, context.getConnector(connector2.getClass()));
        verify(connector1).reset();
        verify(connector2).reset();
        verify(resetSymbol).execute(any(ConnectorManager.class));
    }

    @Test(expected = LearnerException.class)
    public void shouldThrowAnExceptionIfTheResetSymbolExecutionFailed() {
        given(resetSymbol.execute(any(ConnectorManager.class))).willReturn(ExecuteResult.FAILED);

        handler.addConnectorManager(createConnectorManager());
        handler.createContext(); // should fail
    }

//    @Test(expected = LearnerException.class)
//    public void shouldThrowAnExceptionIfTheResetSymbolExecutionCrashed() {
//        given(resetSymbol.execute(any(ConnectorManager.class))).willThrow(Exception.class);
//
//        handler.createContext(); // should fail
//    }

    @Test
    public void shouldHaveTheCorrectAmountOfMaxConcurrentQueries() {
        handler.addConnectorManager(createConnectorManager());
        handler.addConnectorManager(createConnectorManager());
        assertEquals(handler.getMaxConcurrentQueries(), 2);
    }

    private ConnectorManager createConnectorManager() {
        ConnectorManager connectorManager = new ConnectorManager();
        Connector connector1 = mock(VariableStoreConnector.class);
        Connector connector2 = mock(CounterStoreConnector.class);
        connectorManager.addConnector(connector1);
        connectorManager.addConnector(connector2);
        return  connectorManager;
    }
}
