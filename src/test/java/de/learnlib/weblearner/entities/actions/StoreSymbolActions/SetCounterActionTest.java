package de.learnlib.weblearner.entities.actions.StoreSymbolActions;

import com.fasterxml.jackson.databind.ObjectMapper;
import de.learnlib.weblearner.entities.ExecuteResult;
import de.learnlib.weblearner.entities.SymbolAction;
import de.learnlib.weblearner.learner.connectors.CounterStoreConnector;
import de.learnlib.weblearner.learner.connectors.MultiConnector;
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

    private static final String TEST_NAME = "counter";
    private static final Integer TEST_VALUE = 42;

    private SetCounterAction setAction;

    @Before
    public void setUp() {
        setAction = new SetCounterAction();
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

        File file = new File(getClass().getResource("/entities/StoreSymbolActions/SetCounterTestData.json").toURI());
        SymbolAction obj = mapper.readValue(file, SymbolAction.class);

        assertTrue(obj instanceof SetCounterAction);
        SetCounterAction objAsAction = (SetCounterAction) obj;
        assertEquals(TEST_NAME, objAsAction.getName());
        assertEquals(TEST_VALUE, objAsAction.getValue());
    }

    @Test
    public void shouldSuccessfulSetTheCounterValue() {
        CounterStoreConnector counters = mock(CounterStoreConnector.class);
        MultiConnector connector = mock(MultiConnector.class);
        given(connector.getConnector(CounterStoreConnector.class)).willReturn(counters);

        ExecuteResult result = setAction.execute(connector);

        assertEquals(ExecuteResult.OK, result);
        verify(counters).set(TEST_NAME, TEST_VALUE);
    }

    @Test
    public void shouldFailIfCounterIsNotDeclared() {
        CounterStoreConnector counters = mock(CounterStoreConnector.class);
        willThrow(IllegalStateException.class).given(counters).set(TEST_NAME, TEST_VALUE);
        MultiConnector connector = mock(MultiConnector.class);
        given(connector.getConnector(CounterStoreConnector.class)).willReturn(counters);

        ExecuteResult result = setAction.execute(connector);

        assertEquals(ExecuteResult.FAILED, result);
        verify(counters).set(TEST_NAME, TEST_VALUE);
    }

}
