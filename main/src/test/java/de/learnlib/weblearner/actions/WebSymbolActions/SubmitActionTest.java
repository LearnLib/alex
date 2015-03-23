package de.learnlib.weblearner.actions.WebSymbolActions;

import com.fasterxml.jackson.databind.ObjectMapper;
import de.learnlib.weblearner.core.entities.ExecuteResult;
import de.learnlib.weblearner.core.learner.connectors.WebSiteConnector;
import org.junit.Before;
import org.junit.Test;
import org.openqa.selenium.NoSuchElementException;
import org.openqa.selenium.WebElement;

import java.io.File;
import java.io.IOException;
import java.net.URISyntaxException;

import static de.learnlib.weblearner.core.entities.ExecuteResult.OK;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

public class SubmitActionTest {

    private SubmitAction s;

    @Before
    public void setUp() {
        s = new SubmitAction();
        s.setNode("#node");
    }

    @Test
    public void testJSON() throws IOException {
        ObjectMapper mapper = new ObjectMapper();
        String json = mapper.writeValueAsString(s);
        SubmitAction s2 = mapper.readValue(json, SubmitAction.class);

        assertEquals(s.getNode(), s2.getNode());
    }

    @Test
    public void testJSONFile() throws IOException, URISyntaxException {
        ObjectMapper mapper = new ObjectMapper();

        File file = new File(getClass().getResource("/entities/websymbolactions/SubmitTestData.json").toURI());
        WebSymbolAction obj = mapper.readValue(file, WebSymbolAction.class);

        assertTrue(obj instanceof SubmitAction);
        SubmitAction objAsAction = (SubmitAction) obj;
        assertEquals("#node", objAsAction.getNode());
    }

    @Test
    public void shouldReturnOKIfNodeCouldBeSubmited() {
        WebSiteConnector connector = mock(WebSiteConnector.class);
        WebElement element = mock(WebElement.class);
        given(connector.getElement("#node")).willReturn(element);

        assertEquals(OK, s.execute(connector));
        verify(element).submit();
    }

    @Test
    public void shouldReturnFaliedIfNodeCouldNotBeSubmited() {
        WebSiteConnector connector = mock(WebSiteConnector.class);
        when(connector.getElement("#node")).thenThrow(new NoSuchElementException(""));

        assertEquals(ExecuteResult.FAILED, s.execute(connector));
    }
}
