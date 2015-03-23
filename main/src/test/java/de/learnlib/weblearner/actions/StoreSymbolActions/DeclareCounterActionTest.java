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

public class DeclareCounterActionTest {

    private static final String TEST_NAME = "counter";

    private DeclareCounterAction declareAction;

    @Before
    public void setUp() {
        declareAction = new DeclareCounterAction();
        declareAction.setName(TEST_NAME);
    }

    @Test
    public void testJSON() throws IOException {
        ObjectMapper mapper = new ObjectMapper();
        String json = mapper.writeValueAsString(declareAction);
        DeclareCounterAction declareAction2 = (DeclareCounterAction) mapper.readValue(json, SymbolAction.class);

        assertEquals(declareAction.getName(), declareAction2.getName());
    }

    @Test
    public void testJSONFile() throws IOException, URISyntaxException {
        ObjectMapper mapper = new ObjectMapper();

        File file = new File(getClass().getResource("/entities/StoreSymbolActions/DeclareCounterTestData.json").toURI());
        SymbolAction obj = mapper.readValue(file, SymbolAction.class);

        assertTrue(obj instanceof DeclareCounterAction);
        DeclareCounterAction objAsAction = (DeclareCounterAction) obj;
        assertEquals(TEST_NAME, objAsAction.getName());
    }

    @Test
    public void shouldSuccessfulDeclareANewCounter() {
        CounterStoreConnector counters = mock(CounterStoreConnector.class);
        MultiConnector connector = mock(MultiConnector.class);
        given(connector.getConnector(CounterStoreConnector.class)).willReturn(counters);

        ExecuteResult result = declareAction.execute(connector);

        assertEquals(ExecuteResult.OK, result);
        verify(counters).declare(TEST_NAME);
    }

    @Test
    public void shouldFailIfNameIsAlreadyUsed() {
        CounterStoreConnector counters = mock(CounterStoreConnector.class);
        willThrow(IllegalArgumentException.class).given(counters).declare(TEST_NAME);
        MultiConnector connector = mock(MultiConnector.class);
        given(connector.getConnector(CounterStoreConnector.class)).willReturn(counters);

        ExecuteResult result = declareAction.execute(connector);

        assertEquals(ExecuteResult.FAILED, result);
        verify(counters).declare(TEST_NAME);
    }

}
