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

public class ClearActionTest {

    private ClearAction c;

    @Before
    public void setUp() {
        c = new ClearAction();
        c.setNode("#node");
    }

    @Test
    public void testJSON() throws IOException {
        ObjectMapper mapper = new ObjectMapper();
        String json = mapper.writeValueAsString(c);
        ClearAction c2 = mapper.readValue(json, ClearAction.class);

        assertEquals(c.getNode(), c2.getNode());
    }

    @Test
    public void testJSONFile() throws IOException, URISyntaxException {
        ObjectMapper mapper = new ObjectMapper();

        File file = new File(getClass().getResource("/entities/websymbolactions/ClearTestData.json").toURI());
        WebSymbolAction obj = mapper.readValue(file, WebSymbolAction.class);

        assertTrue(obj instanceof ClearAction);
        ClearAction objAsAction = (ClearAction) obj;
        assertEquals("#node", objAsAction.getNode());
    }

    @Test
    public void shouldReturnOKIfNodeCouldBeCleared() {
        WebSiteConnector connector = mock(WebSiteConnector.class);
        WebElement element = mock(WebElement.class);
        given(connector.getElement("#node")).willReturn(element);

        assertEquals(OK, c.execute(connector));
        verify(element).clear();
    }

    @Test
    public void shouldReturnFailedIfNodeCouldNotBeCleared() {
        WebSiteConnector connector = mock(WebSiteConnector.class);
        when(connector.getElement("#node")).thenThrow(new NoSuchElementException(""));

        assertEquals(ExecuteResult.FAILED, c.execute(connector));
    }

}
