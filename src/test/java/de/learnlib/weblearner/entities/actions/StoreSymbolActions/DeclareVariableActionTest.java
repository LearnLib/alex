package de.learnlib.weblearner.entities.actions.StoreSymbolActions;

import com.fasterxml.jackson.databind.ObjectMapper;
import de.learnlib.weblearner.entities.ExecuteResult;
import de.learnlib.weblearner.entities.SymbolAction;
import de.learnlib.weblearner.learner.connectors.MultiConnector;
import de.learnlib.weblearner.learner.connectors.VariableStoreConnector;
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

public class DeclareVariableActionTest {

    private static final String TEST_NAME = "variable";

    private DeclareVariableAction declareAction;

    @Before
    public void setUp() {
        declareAction = new DeclareVariableAction();
        declareAction.setName(TEST_NAME);
    }

    @Test
    public void testJSON() throws IOException {
        ObjectMapper mapper = new ObjectMapper();
        String json = mapper.writeValueAsString(declareAction);
        DeclareVariableAction declareAction2 = (DeclareVariableAction) mapper.readValue(json, SymbolAction.class);

        assertEquals(declareAction.getName(), declareAction2.getName());
    }

    @Test
    public void testJSONFile() throws IOException, URISyntaxException {
        ObjectMapper mapper = new ObjectMapper();

        File file = new File(getClass().getResource("/entities/StoreSymbolActions/DeclareVariableTestData.json").toURI());
        SymbolAction obj = mapper.readValue(file, SymbolAction.class);

        assertTrue(obj instanceof DeclareVariableAction);
        DeclareVariableAction objAsAction = (DeclareVariableAction) obj;
        assertEquals(TEST_NAME, objAsAction.getName());
    }

    @Test
    public void shouldSuccessfulDeclareANewCounter() {
        VariableStoreConnector variables = mock(VariableStoreConnector.class);
        MultiConnector connector = mock(MultiConnector.class);
        given(connector.getConnector(VariableStoreConnector.class)).willReturn(variables);

        ExecuteResult result = declareAction.execute(connector);

        assertEquals(ExecuteResult.OK, result);
        verify(variables).declare(TEST_NAME);
    }

    @Test
    public void shouldFailIfNameIsAlreadyUsed() {
        VariableStoreConnector variables = mock(VariableStoreConnector.class);
        willThrow(IllegalArgumentException.class).given(variables).declare(TEST_NAME);
        MultiConnector connector = mock(MultiConnector.class);
        given(connector.getConnector(VariableStoreConnector.class)).willReturn(variables);

        ExecuteResult result = declareAction.execute(connector);

        assertEquals(ExecuteResult.FAILED, result);
        verify(variables).declare(TEST_NAME);
    }

}
