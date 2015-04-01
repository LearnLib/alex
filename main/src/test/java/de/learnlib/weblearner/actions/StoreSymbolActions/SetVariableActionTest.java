package de.learnlib.weblearner.actions.StoreSymbolActions;

import com.fasterxml.jackson.databind.ObjectMapper;
import de.learnlib.weblearner.core.entities.ExecuteResult;
import de.learnlib.weblearner.core.entities.SymbolAction;
import de.learnlib.weblearner.core.learner.connectors.ConnectorManager;
import de.learnlib.weblearner.core.learner.connectors.VariableStoreConnector;
import org.junit.Before;
import org.junit.Test;

import java.io.File;
import java.io.IOException;
import java.net.URISyntaxException;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.willThrow;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;

public class SetVariableActionTest {

    private static final String TEST_VALUE = "foobar";
    private static final String TEST_NAME = "variable";

    private SetVariableAction setAction;

    @Before
    public void setUp() {
        setAction = new SetVariableAction();
        setAction.setName(TEST_NAME);
        setAction.setValue(TEST_VALUE);
    }

    @Test
    public void testJSON() throws IOException {
        ObjectMapper mapper = new ObjectMapper();
        String json = mapper.writeValueAsString(setAction);
        SetVariableAction declareAction2 = (SetVariableAction) mapper.readValue(json, SymbolAction.class);

        assertEquals(setAction.getName(), declareAction2.getName());
        assertEquals(setAction.getValue(), declareAction2.getValue());
    }

    @Test
    public void testJSONFile() throws IOException, URISyntaxException {
        ObjectMapper mapper = new ObjectMapper();

        File file = new File(getClass().getResource("/actions/StoreSymbolActions/SetVariableTestData.json").toURI());
        SymbolAction obj = mapper.readValue(file, SymbolAction.class);

        assertTrue(obj instanceof SetVariableAction);
        SetVariableAction objAsAction = (SetVariableAction) obj;
        assertEquals(TEST_NAME, objAsAction.getName());
        assertEquals(TEST_VALUE, objAsAction.getValue());
    }

    @Test
    public void shouldSuccessfulSetTheVariableValue() {
        VariableStoreConnector variables = mock(VariableStoreConnector.class);
        ConnectorManager connector = mock(ConnectorManager.class);
        given(connector.getConnector(VariableStoreConnector.class)).willReturn(variables);

        ExecuteResult result = setAction.execute(connector);

        assertEquals(ExecuteResult.OK, result);
        verify(variables).set(TEST_NAME, TEST_VALUE);
    }

    @Test
    public void shouldFailIfVariableIsNotDeclared() {
        VariableStoreConnector variables = mock(VariableStoreConnector.class);
        willThrow(IllegalStateException.class).given(variables).set(TEST_NAME, TEST_VALUE);
        ConnectorManager connector = mock(ConnectorManager.class);
        given(connector.getConnector(VariableStoreConnector.class)).willReturn(variables);

        ExecuteResult result = setAction.execute(connector);

        assertEquals(ExecuteResult.FAILED, result);
        verify(variables).set(TEST_NAME, TEST_VALUE);
    }

}
