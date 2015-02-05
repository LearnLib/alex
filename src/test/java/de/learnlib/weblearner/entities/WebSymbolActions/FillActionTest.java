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
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

public class FillActionTest {

    private FillAction f;

    @Before
    public void setUp() {
        f = new FillAction();
        f.setNode("#node");
        f.setUrl("http://example.com");
        f.setGenerator("gen1");
    }

    @Test
    public void testJSON() throws IOException {
        ObjectMapper mapper = new ObjectMapper();
        String json = mapper.writeValueAsString(f);
        FillAction f2 = mapper.readValue(json, FillAction.class);

        assertEquals(f.getNode(), f2.getNode());
        assertEquals(f.getUrl(), f2.getUrl());
    }

    @Test
    public void testJSONFile() throws IOException, URISyntaxException {
        ObjectMapper mapper = new ObjectMapper();

        File file = new File(getClass().getResource("/entities/websymbolactions/FillTestData.json").toURI());
        WebSymbolAction obj = mapper.readValue(file, WebSymbolAction.class);

        assertTrue(obj instanceof FillAction);
        FillAction objAsAction = (FillAction) obj;
        assertEquals("#input", objAsAction.getNode());
        assertEquals("http://example.com", objAsAction.getUrl());
        assertEquals("none", objAsAction.getGenerator());
    }

    @Test
    public void shouldReturnOKIfNodeCouldBeFilled() {
        WebSiteConnector connector = mock(WebSiteConnector.class);
        WebElement element = mock(WebElement.class);
        given(connector.getElement("#node")).willReturn(element);

        assertEquals(OK, f.execute(connector));
        verify(element).sendKeys(f.getGenerator());
    }

    @Test
    public void shouldReturnFaliedIfNodeCouldNotBeFilled() {
        WebSiteConnector connector = mock(WebSiteConnector.class);
        when(connector.getElement("#node")).thenThrow(new NoSuchElementException(""));

        assertEquals(ExecuteResult.FAILED, f.execute(connector));
    }

}
