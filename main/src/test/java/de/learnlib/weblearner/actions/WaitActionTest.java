package de.learnlib.weblearner.actions;

import com.fasterxml.jackson.databind.ObjectMapper;
import de.learnlib.weblearner.core.entities.ExecuteResult;
import de.learnlib.weblearner.actions.WebSymbolActions.WebSymbolAction;
import de.learnlib.weblearner.core.learner.connectors.WebSiteConnector;
import org.junit.Before;
import org.junit.Test;

import java.io.File;
import java.io.IOException;
import java.net.URISyntaxException;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;
import static org.mockito.Mockito.mock;

public class WaitActionTest {

    private static final int ONE_SECOND = 100;

    private WaitAction w;

    @Before
    public void setUp() {
        w = new WaitAction();
        w.setDuration(ONE_SECOND);
    }

    @Test
    public void testJSON() throws IOException {
        ObjectMapper mapper = new ObjectMapper();
        String json = mapper.writeValueAsString(w);
        WaitAction w2 = mapper.readValue(json, WaitAction.class);

        assertEquals(w.getDuration(), w2.getDuration());
    }

    @Test
    public void testJSONFile() throws IOException, URISyntaxException {
        ObjectMapper mapper = new ObjectMapper();

        File file = new File(getClass().getResource("/actions/WaitTestData.json").toURI());
        WebSymbolAction obj = mapper.readValue(file, WebSymbolAction.class);

        assertTrue(obj instanceof WaitAction);
        WaitAction objAsAction = (WaitAction) obj;
        assertEquals(ONE_SECOND, objAsAction.getDuration());
    }

    @Test
    public void shouldReturnOKIfTimeIsUp() {
        WebSiteConnector connector = mock(WebSiteConnector.class);

        assertEquals(ExecuteResult.OK, w.execute(connector));
    }

}
