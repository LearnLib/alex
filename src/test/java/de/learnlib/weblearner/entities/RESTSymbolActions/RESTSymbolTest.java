package de.learnlib.weblearner.entities.RESTSymbolActions;

import de.learnlib.weblearner.entities.ExecuteResult;
import de.learnlib.weblearner.entities.RESTSymbol;
import de.learnlib.weblearner.learner.WebServiceConnector;
import org.junit.Before;
import org.junit.Test;

import static org.junit.Assert.assertEquals;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;

public class RESTSymbolTest {

    private RESTSymbol symbol;
    private RESTSymbolAction action1;
    private RESTSymbolAction action2;

    @Before
    public void setUp() {
        action1 = mock(RESTSymbolAction.class);
        action2 = mock(RESTSymbolAction.class);

        symbol = new RESTSymbol();
        symbol.addAction(action1);
        symbol.addAction(action2);
    }

    @Test
    public void shouldReturnOkIfAllActionsRunSuccessfully() throws Exception {
        WebServiceConnector connector = mock(WebServiceConnector.class);
        given(action1.execute(connector)).willReturn(ExecuteResult.OK);
        given(action2.execute(connector)).willReturn(ExecuteResult.OK);

        String result = symbol.execute(connector);

        assertEquals(ExecuteResult.OK.name(), result);
    }

    @Test
    public void shouldReturnFailedIfOneActionsRunFailed() throws Exception {
        WebServiceConnector connector = mock(WebServiceConnector.class);
        given(action1.execute(connector)).willReturn(ExecuteResult.FAILED);
        given(action2.execute(connector)).willReturn(ExecuteResult.OK);

        String result = symbol.execute(connector);

        assertEquals(ExecuteResult.FAILED.name(), result);
        verify(action2, never()).execute(connector);
    }

    @Test
    public void shouldReturnFailedIfOneActionsThrowsAnException() throws Exception {
        WebServiceConnector connector = mock(WebServiceConnector.class);
        given(action1.execute(connector)).willThrow(IllegalStateException.class);
        given(action2.execute(connector)).willReturn(ExecuteResult.OK);

        String result = symbol.execute(connector);

        assertEquals(ExecuteResult.FAILED.name(), result);
        verify(action2, never()).execute(connector);
    }

}
