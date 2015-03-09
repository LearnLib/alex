package de.learnlib.weblearner.entities.WebSymbolActions;

import com.fasterxml.jackson.databind.ObjectMapper;
import de.learnlib.weblearner.entities.ExecuteResult;
import de.learnlib.weblearner.learner.connectors.WebSiteConnector;
import org.junit.Before;
import org.junit.Test;
import org.openqa.selenium.NoSuchElementException;
import org.openqa.selenium.WebElement;

import java.io.File;
import java.io.IOException;
import java.net.URISyntaxException;

import static de.learnlib.weblearner.entities.ExecuteResult.OK;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

public class ClickActionTest {

    private ClickAction c;

    @Before
    public void setUp() {
        c = new ClickAction();
        c.setNode("#node");
    }

    @Test
    public void testJSON() throws IOException {
        ObjectMapper mapper = new ObjectMapper();
        String json = mapper.writeValueAsString(c);
        ClickAction c2 = mapper.readValue(json, ClickAction.class);

        assertEquals(c.getNode(), c2.getNode());
    }

    @Test
    public void testJSONFile() throws IOException, URISyntaxException {
        ObjectMapper mapper = new ObjectMapper();

        File file = new File(getClass().getResource("/entities/websymbolactions/ClickTestData.json").toURI());
        WebSymbolAction obj = mapper.readValue(file, WebSymbolAction.class);

        assertTrue(obj instanceof ClickAction);
        ClickAction objAsAction = (ClickAction) obj;
        assertEquals("#node", objAsAction.getNode());
    }

    @Test
    public void shouldReturnOKIfNodeCouldBeClicked() {
        WebSiteConnector connector = mock(WebSiteConnector.class);
        WebElement element = mock(WebElement.class);
        given(connector.getElement("#node")).willReturn(element);

        assertEquals(OK, c.execute(connector));
        verify(element).click();
    }

    @Test
    public void shouldReturnFaliedIfNodeCouldNotBeClicked() {
        WebSiteConnector connector = mock(WebSiteConnector.class);
        when(connector.getElement("#node")).thenThrow(new NoSuchElementException(""));

        assertEquals(ExecuteResult.FAILED, c.execute(connector));
    }

}
