package de.learnlib.weblearner.entities.WebSymbolActions;

import com.fasterxml.jackson.databind.ObjectMapper;
import de.learnlib.weblearner.entities.ExecuteResult;
import de.learnlib.weblearner.learner.WebSiteConnector;
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
import static org.mockito.Mockito.when;

public class CheckNodeActionTest {

    private CheckNodeAction checkNode;

    @Before
    public void setUp() {
        checkNode = new CheckNodeAction();
        checkNode.setValue("#node");
        checkNode.setUrl("http://example.com");
        checkNode.setRegexp(false);
}

    @Test
    public void testJSON() throws IOException {
        ObjectMapper mapper = new ObjectMapper();
        String json = mapper.writeValueAsString(checkNode);
        CheckNodeAction c2 = mapper.readValue(json, CheckNodeAction.class);

        assertEquals(checkNode.getValue(), c2.getValue());
        assertEquals(checkNode.getUrl(), c2.getUrl());
    }

    @Test
    public void testJSONFile() throws IOException, URISyntaxException {
        ObjectMapper mapper = new ObjectMapper();

        File file = new File(getClass().getResource("/entities/websymbolactions/CheckNodeTestData.json").toURI());
        WebSymbolAction obj = mapper.readValue(file, WebSymbolAction.class);

        assertTrue(obj instanceof CheckNodeAction);
        CheckNodeAction objAsAction = (CheckNodeAction) obj;
        assertEquals("#node", objAsAction.getValue());
        assertEquals("http://example.com", objAsAction.getUrl());
    }

    @Test
    public void shouldReturnOKIfNodeWasFound() {
        WebSiteConnector connector = mock(WebSiteConnector.class);
        WebElement element = mock(WebElement.class);
        given(connector.getElement("#node")).willReturn(element);

        assertEquals(OK, checkNode.execute(connector));
    }

    @Test
    public void shouldReturnFaliedIfNodeWasNotFound() {
        WebSiteConnector connector = mock(WebSiteConnector.class);
        when(connector.getElement("#node")).thenThrow(new NoSuchElementException(""));

        assertEquals(ExecuteResult.FAILED, checkNode.execute(connector));
    }

}
