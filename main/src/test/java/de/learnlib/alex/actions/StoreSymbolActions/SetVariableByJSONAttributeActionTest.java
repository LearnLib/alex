package de.learnlib.alex.actions.StoreSymbolActions;

import com.fasterxml.jackson.databind.ObjectMapper;
import de.learnlib.alex.core.entities.ExecuteResult;
import de.learnlib.alex.core.entities.SymbolAction;
import de.learnlib.alex.core.learner.connectors.ConnectorManager;
import de.learnlib.alex.core.learner.connectors.VariableStoreConnector;
import de.learnlib.alex.core.learner.connectors.WebServiceConnector;
import org.junit.Before;
import org.junit.Test;

import java.io.File;
import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;
import static org.mockito.BDDMockito.given;
import static org.mockito.Matchers.anyString;
import static org.mockito.Matchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;

public class SetVariableByJSONAttributeActionTest {

    private SetVariableByJSONAttributeAction setAction;

    @Before
    public void setUp() {
        setAction = new SetVariableByJSONAttributeAction();
        setAction.setName("variable");
        setAction.setValue("foo");
    }

    @Test
    public void testJSON() throws IOException {
        ObjectMapper mapper = new ObjectMapper();
        String json = mapper.writeValueAsString(setAction);
        SetVariableByJSONAttributeAction action2 = mapper.readValue(json, SetVariableByJSONAttributeAction.class);

        assertEquals(setAction.getName(), action2.getName());
        assertEquals(setAction.getValue(), action2.getValue());
    }

    @Test
    public void testJSONFile() throws IOException, URISyntaxException {
        ObjectMapper mapper = new ObjectMapper();

        URI uri = getClass().getResource("/actions/StoreSymbolActions/SetVariableByJSONAttributeTestData.json").toURI();
        File file = new File(uri);
        SymbolAction obj = mapper.readValue(file, SymbolAction.class);

        assertTrue(obj instanceof SetVariableByJSONAttributeAction);
        SetVariableByJSONAttributeAction objAsAction = (SetVariableByJSONAttributeAction) obj;
        assertEquals("variable", objAsAction.getName());
        assertEquals("foobar", objAsAction.getValue());
    }

    @Test
    public void shouldSetTheRightValue() {
        VariableStoreConnector storeConnector = mock(VariableStoreConnector.class);
        WebServiceConnector webServiceConnector = mock(WebServiceConnector.class);
        given(webServiceConnector.getBody()).willReturn("{\"foo\": \"bar\"}");
        ConnectorManager connectors = mock(ConnectorManager.class);
        given(connectors.getConnector(VariableStoreConnector.class)).willReturn(storeConnector);
        given((connectors.getConnector(WebServiceConnector.class))).willReturn(webServiceConnector);

        ExecuteResult result = setAction.execute(connectors);

        assertEquals(ExecuteResult.OK, result);
        verify(storeConnector).set("variable", "bar");
    }

    @Test
    public void shouldSetNotihingIfThePropertyDoesNotExists() {
        VariableStoreConnector storeConnector = mock(VariableStoreConnector.class);
        WebServiceConnector webServiceConnector = mock(WebServiceConnector.class);
        given(webServiceConnector.getBody()).willReturn("{\"nope\": \"bar\"}");
        ConnectorManager connectors = mock(ConnectorManager.class);
        given(connectors.getConnector(VariableStoreConnector.class)).willReturn(storeConnector);
        given((connectors.getConnector(WebServiceConnector.class))).willReturn(webServiceConnector);

        ExecuteResult result = setAction.execute(connectors);

        assertEquals(ExecuteResult.FAILED, result);
        verify(storeConnector, never()).set(eq("variable"), anyString());
    }

}
