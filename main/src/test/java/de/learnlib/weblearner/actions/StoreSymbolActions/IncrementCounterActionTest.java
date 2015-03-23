package de.learnlib.weblearner.actions.StoreSymbolActions;

import com.fasterxml.jackson.databind.ObjectMapper;
import de.learnlib.weblearner.core.entities.ExecuteResult;
import de.learnlib.weblearner.core.entities.SymbolAction;
import de.learnlib.weblearner.core.learner.connectors.CounterStoreConnector;
import de.learnlib.weblearner.core.learner.connectors.MultiConnector;
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

public class IncrementCounterActionTest {

    private static final String TEST_NAME = "counter";

    private IncrementCounterAction incrementAction;

    @Before
    public void setUp() {
        incrementAction = new IncrementCounterAction();
        incrementAction.setName(TEST_NAME);
    }

    @Test
    public void testJSON() throws IOException {
        ObjectMapper mapper = new ObjectMapper();
        String json = mapper.writeValueAsString(incrementAction);
        IncrementCounterAction declareAction2 = (IncrementCounterAction) mapper.readValue(json, SymbolAction.class);

        assertEquals(incrementAction.getName(), declareAction2.getName());
    }

    @Test
    public void testJSONFile() throws IOException, URISyntaxException {
        ObjectMapper mapper = new ObjectMapper();

        File file = new File(getClass().getResource("/entities/StoreSymbolActions/IncrementCounterTestData.json").toURI());
        SymbolAction obj = mapper.readValue(file, SymbolAction.class);

        assertTrue(obj instanceof IncrementCounterAction);
        IncrementCounterAction objAsAction = (IncrementCounterAction) obj;
        assertEquals(TEST_NAME, objAsAction.getName());
    }

    @Test
    public void shouldSuccessfulIncrementCounter() {
        CounterStoreConnector counters = mock(CounterStoreConnector.class);
        MultiConnector connector = mock(MultiConnector.class);
        given(connector.getConnector(CounterStoreConnector.class)).willReturn(counters);

        ExecuteResult result = incrementAction.execute(connector);

        assertEquals(ExecuteResult.OK, result);
        verify(counters).increment(TEST_NAME);
    }

    @Test
    public void shouldFailIncrementingIfCounterIsNotDeclared() {
        CounterStoreConnector counters = mock(CounterStoreConnector.class);
        willThrow(IllegalStateException.class).given(counters).increment(TEST_NAME);
        MultiConnector connector = mock(MultiConnector.class);
        given(connector.getConnector(CounterStoreConnector.class)).willReturn(counters);

        ExecuteResult result = incrementAction.execute(connector);

        assertEquals(ExecuteResult.FAILED, result);
        verify(counters).increment(TEST_NAME);
    }

}
