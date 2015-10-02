package de.learnlib.alex.actions.WebSymbolActions;

import com.fasterxml.jackson.databind.ObjectMapper;
import de.learnlib.alex.core.entities.ExecuteResult;
import de.learnlib.alex.core.entities.Project;
import de.learnlib.alex.core.entities.User;
import de.learnlib.alex.core.learner.connectors.WebSiteConnector;
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
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;

@RunWith(MockitoJUnitRunner.class)
public class GotoActionTest {

    @Mock
    private User user;

    @Mock
    private Project project;

    private static final String FAKE_URL = "http://example.com";

    private GotoAction g;

    @Before
    public void setUp() {
        g = new GotoAction();
        g.setUser(user);
        g.setProject(project);
        g.setUrl(FAKE_URL);
    }

    @Test
    public void testJSON() throws IOException {
        ObjectMapper mapper = new ObjectMapper();
        String json = mapper.writeValueAsString(g);
        GotoAction c2 = mapper.readValue(json, GotoAction.class);

        assertEquals(g.getUrl(), c2.getUrl());
    }

    @Test
    public void testJSONFile() throws IOException, URISyntaxException {
        ObjectMapper mapper = new ObjectMapper();

        File file = new File(getClass().getResource("/actions/websymbolactions/GotoTestData.json").toURI());
        WebSymbolAction obj = mapper.readValue(file, WebSymbolAction.class);

        assertTrue(obj instanceof GotoAction);
        GotoAction objAsAction = (GotoAction) obj;
        assertEquals("http://example.com", objAsAction.getUrl());
    }

    @Test
    public void shouldReturnOKIfNodeCouldBeClicked() {
        WebSiteConnector connector = mock(WebSiteConnector.class);

        assertEquals(ExecuteResult.OK, g.execute(connector));
        verify(connector).get(FAKE_URL);
    }

}
