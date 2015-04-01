package de.learnlib.weblearner.actions.WebSymbolActions;

import com.fasterxml.jackson.databind.ObjectMapper;
import de.learnlib.weblearner.core.entities.Project;
import de.learnlib.weblearner.core.entities.SymbolAction;
import de.learnlib.weblearner.core.learner.connectors.WebSiteConnector;
import org.junit.Before;
import org.junit.Test;

import java.io.File;
import java.io.IOException;
import java.net.URISyntaxException;

import static de.learnlib.weblearner.core.entities.ExecuteResult.FAILED;
import static de.learnlib.weblearner.core.entities.ExecuteResult.OK;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.mock;

public class CheckTextWebActionTest {

    private static final Long PROJECT_ID = 42L;

    private CheckTextWebAction checkText;

    @Before
    public void setUp() {
        checkText = new CheckTextWebAction();
        checkText.setProject(new Project(PROJECT_ID));
        checkText.setValue("Foobar");
        checkText.setRegexp(false);
    }

    @Test
    public void testJSON() throws IOException {
        ObjectMapper mapper = new ObjectMapper();
        String json = mapper.writeValueAsString(checkText);
        CheckTextWebAction c2 = (CheckTextWebAction) mapper.readValue(json, SymbolAction.class);

        assertEquals(checkText.getValue(), c2.getValue());
    }

    @Test
    public void testJSONFile() throws IOException, URISyntaxException {
        ObjectMapper mapper = new ObjectMapper();

        File file = new File(getClass().getResource("/actions/websymbolactions/CheckTextTestData.json").toURI());
        SymbolAction obj = mapper.readValue(file, SymbolAction.class);

        assertTrue(obj instanceof CheckTextWebAction);
        CheckTextWebAction c = (CheckTextWebAction) obj;
        assertEquals("Lorem Ipsum", c.getValue());
    }

    @Test
    public void shouldReturnOKIfTextWasFoundWithoutRegexp() {
        WebSiteConnector connector = mock(WebSiteConnector.class);
        given(connector.getPageSource()).willReturn(checkText.getValue());

        assertEquals(OK, checkText.execute(connector));
    }

    @Test
    public void shouldReturnFaliedIfTextWasNotFoundWithoutRegexp() {
        WebSiteConnector connector = mock(WebSiteConnector.class);
        given(connector.getPageSource()).willReturn("");

        assertEquals(FAILED, checkText.execute(connector));
    }

    @Test
    public void shouldReturnOKIfTextWasFoundWithRegexp() {
        checkText.setValue("F[oO]+ B[a]+r");
        checkText.setRegexp(true);
        WebSiteConnector connector = mock(WebSiteConnector.class);
        given(connector.getPageSource()).willReturn("FoO Baaaaar");

        assertEquals(OK, checkText.execute(connector));
    }

    @Test
    public void shouldReturnFailedIfTextWasNotFoundWithRegexp() {
        checkText.setValue("F[oO]+ B[a]+r");
        checkText.setRegexp(true);
        WebSiteConnector connector = mock(WebSiteConnector.class);
        given(connector.getPageSource()).willReturn("F BAr");

        assertEquals(FAILED, checkText.execute(connector));
    }

}
