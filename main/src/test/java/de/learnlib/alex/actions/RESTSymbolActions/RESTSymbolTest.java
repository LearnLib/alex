package de.learnlib.alex.actions.RESTSymbolActions;

import de.learnlib.alex.core.entities.ExecuteResult;
import de.learnlib.alex.core.entities.Symbol;
import de.learnlib.alex.core.learner.connectors.ConnectorManager;
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

        String result = symbol.execute(connector);

        assertEquals(ExecuteResult.OK.name(), result);
    }

    @Test
    public void shouldReturnFailedIfOneActionsRunFailed() throws Exception {
        ConnectorManager connector = mock(ConnectorManager.class);
        given(action1.executeAction(connector)).willReturn(ExecuteResult.FAILED);
        given(action2.executeAction(connector)).willReturn(ExecuteResult.OK);

        String result = symbol.execute(connector);

        assertEquals(ExecuteResult.FAILED.name(), result);
        verify(action2, never()).executeAction(connector);
    }

    @Test
    public void shouldReturnFailedIfOneActionsThrowsAnException() throws Exception {
        ConnectorManager connector = mock(ConnectorManager.class);
        given(action1.executeAction(connector)).willThrow(IllegalStateException.class);
        given(action2.executeAction(connector)).willReturn(ExecuteResult.OK);

        String result = symbol.execute(connector);

        assertEquals(ExecuteResult.FAILED.name(), result);
        verify(action2, never()).executeAction(connector);
    }

}
