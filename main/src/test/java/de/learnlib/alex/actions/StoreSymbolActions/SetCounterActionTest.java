package de.learnlib.alex.actions.StoreSymbolActions;

import com.fasterxml.jackson.databind.ObjectMapper;
import de.learnlib.alex.core.entities.ExecuteResult;
import de.learnlib.alex.core.entities.Project;
import de.learnlib.alex.core.entities.SymbolAction;
import de.learnlib.alex.core.learner.connectors.CounterStoreConnector;
import de.learnlib.alex.core.learner.connectors.ConnectorManager;
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

public class SetCounterActionTest {

    private static final Long PROJECT_ID = 10L;
    private static final String TEST_NAME = "counter";
    private static final Integer TEST_VALUE = 42;

    private SetCounterAction setAction;

    @Before
    public void setUp() {
        setAction = new SetCounterAction();
        setAction.setProject(new Project(PROJECT_ID));
        setAction.setName(TEST_NAME);
        setAction.setValue(TEST_VALUE);
    }

    @Test
    public void testJSON() throws IOException {
        ObjectMapper mapper = new ObjectMapper();
        String json = mapper.writeValueAsString(setAction);
        SetCounterAction declareAction2 = (SetCounterAction) mapper.readValue(json, SymbolAction.class);

        assertEquals(setAction.getName(), declareAction2.getName());
        assertEquals(setAction.getValue(), declareAction2.getValue());
    }

    @Test
    public void testJSONFile() throws IOException, URISyntaxException {
        ObjectMapper mapper = new ObjectMapper();

        File file = new File(getClass().getResource("/actions/StoreSymbolActions/SetCounterTestData.json").toURI());
        SymbolAction obj = mapper.readValue(file, SymbolAction.class);

        assertTrue(obj instanceof SetCounterAction);
        SetCounterAction objAsAction = (SetCounterAction) obj;
        assertEquals(TEST_NAME, objAsAction.getName());
        assertEquals(TEST_VALUE, objAsAction.getValue());
    }

    @Test
    public void shouldSuccessfulSetTheCounterValue() {
        CounterStoreConnector counters = mock(CounterStoreConnector.class);
        ConnectorManager connector = mock(ConnectorManager.class);
        given(connector.getConnector(CounterStoreConnector.class)).willReturn(counters);

        ExecuteResult result = setAction.execute(connector);

        assertEquals(ExecuteResult.OK, result);
        verify(counters).set(PROJECT_ID, TEST_NAME, TEST_VALUE);
    }

    @Test
    public void shouldNotFailIfCounterIsNotDeclared() {
        CounterStoreConnector counters = mock(CounterStoreConnector.class);
        ConnectorManager connector = mock(ConnectorManager.class);
        given(connector.getConnector(CounterStoreConnector.class)).willReturn(counters);

        ExecuteResult result = setAction.execute(connector);

        assertEquals(ExecuteResult.OK, result);
        verify(counters).set(PROJECT_ID, TEST_NAME, TEST_VALUE);
    }

}
