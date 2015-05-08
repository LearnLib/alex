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
import static org.mockito.BDDMockito.given;
import static org.mockito.Matchers.any;
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
    public void shouldCreateTheContextCorrectly() {
        given(resetSymbol.execute(any(ConnectorManager.class))).willReturn(ExecuteResult.OK);
        Connector connector1 = mock(VariableStoreConnector.class);
        handler.addConnector(connector1);
        Connector connector2 = mock(CounterStoreConnector.class);
        handler.addConnector(connector2);

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

        handler.createContext(); // should fail
    }

    @Test(expected = LearnerException.class)
    public void shouldThrowAnExceptionIfTheResetSymbolExecutionCrashed() {
        given(resetSymbol.execute(any(ConnectorManager.class))).willThrow(Exception.class);

        handler.createContext(); // should fail
    }

}
