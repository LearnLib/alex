package de.learnlib.alex.actions;

import com.fasterxml.jackson.databind.ObjectMapper;
import de.learnlib.alex.core.entities.ExecuteResult;
import de.learnlib.alex.core.entities.IdRevisionPair;
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
        given(symbol.getRevision()).willReturn(1L);

        action = new ExecuteSymbolAction();
        action.setSymbolToExecute(symbol);
    }

    @Test
    public void testJSON() throws IOException {
        ObjectMapper mapper = new ObjectMapper();
        String json = mapper.writeValueAsString(action);
        json = json.replace(",\"symbolToExecuteName\":null", "");

        ExecuteSymbolAction action2 = mapper.readValue(json, ExecuteSymbolAction.class);

        assertEquals(new IdRevisionPair(1L, 1L), action2.getSymbolToExecuteAsIdRevisionPair());
    }

    @Test
    public void testJSONFile() throws IOException, URISyntaxException {
        ObjectMapper mapper = new ObjectMapper();

        File file = new File(getClass().getResource("/actions/ExecuteSymbolTestData.json").toURI());
        SymbolAction obj = mapper.readValue(file, SymbolAction.class);

        assertTrue(obj instanceof ExecuteSymbolAction);
        ExecuteSymbolAction objAsAction = (ExecuteSymbolAction) obj;
        IdRevisionPair symbolToExecuteAsIdRevisionPair = objAsAction.getSymbolToExecuteAsIdRevisionPair();
        assertEquals(new IdRevisionPair(1L, 1L), symbolToExecuteAsIdRevisionPair);
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
