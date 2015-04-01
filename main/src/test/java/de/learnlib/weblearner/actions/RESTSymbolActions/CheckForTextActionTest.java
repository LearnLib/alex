package de.learnlib.weblearner.actions.RESTSymbolActions;

import com.fasterxml.jackson.databind.ObjectMapper;
import de.learnlib.weblearner.core.entities.ExecuteResult;
import de.learnlib.weblearner.core.entities.Project;
import de.learnlib.weblearner.core.learner.connectors.WebServiceConnector;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;

import java.io.File;
import java.io.IOException;
import java.net.URISyntaxException;

import static de.learnlib.weblearner.core.entities.ExecuteResult.FAILED;
import static de.learnlib.weblearner.core.entities.ExecuteResult.OK;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;
import static org.mockito.BDDMockito.given;

@RunWith(MockitoJUnitRunner.class)
public class CheckForTextActionTest {

    private static final Long PROJECT_ID = 42L;

    @Mock
    private WebServiceConnector connector;

    private CheckTextRestAction c;

    @Before
    public void setUp() {
        c = new CheckTextRestAction();
        c.setProject(new Project(PROJECT_ID));
        c.setValue("Hello World");
        c.setRegexp(false);
    }

    @Test
    public void testJSON() throws IOException {
        ObjectMapper mapper = new ObjectMapper();
        String json = mapper.writeValueAsString(c);
        CheckTextRestAction c2 = mapper.readValue(json, CheckTextRestAction.class);

        assertEquals(c.getValue(), c2.getValue());
        assertEquals(c.isRegexp(), c2.isRegexp());
    }

    @Test
    public void testJSONFile() throws IOException, URISyntaxException {
        ObjectMapper mapper = new ObjectMapper();

        File file = new File(getClass().getResource("/actions/restsymbolactions/CheckForTextTestData.json").toURI());
        RESTSymbolAction obj = mapper.readValue(file, RESTSymbolAction.class);

        assertTrue(obj instanceof CheckTextRestAction);
        CheckTextRestAction objAsAction = (CheckTextRestAction) obj;
        assertEquals("Lorem Ipsum", objAsAction.getValue());
        assertEquals(true, objAsAction.isRegexp());
    }

    @Test
    public void shouldReturnOkIfBodyContainsTheText() {
        given(connector.getBody()).willReturn("{\"awesome_field\": \"Lorem Ipsum. Hello World! Fooooobar\"}");

        ExecuteResult result = c.execute(connector);

        assertEquals(ExecuteResult.OK, result);
    }

    @Test
    public void shouldReturnFailedIfBodyContainsNotTheText() {
        given(connector.getBody()).willReturn("{\"awesome_field\": \"Lorem Ipsum. Fooooobar\"}");

        ExecuteResult result = c.execute(connector);

        assertEquals(ExecuteResult.FAILED, result);
    }

    @Test
    public void shouldReturnOKIfTextWasFoundWithRegexp() {
        c.setValue("F[oO]+ B[a]+r");
        c.setRegexp(true);
        given(connector.getBody()).willReturn("FoO Baaaaar");

        assertEquals(OK, c.execute(connector));
    }

    @Test
    public void shouldReturnFailedIfTextWasNotFoundWithRegexp() {
        c.setValue("F[oO]+ B[a]+r");
        c.setRegexp(true);
        given(connector.getBody()).willReturn("F BAr");

        assertEquals(FAILED, c.execute(connector));
    }

}
