package de.learnlib.weblearner.entities.actions.RESTSymbolActions;

import com.fasterxml.jackson.databind.ObjectMapper;
import de.learnlib.weblearner.entities.ExecuteResult;
import de.learnlib.weblearner.learner.connectors.WebServiceConnector;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;

import javax.ws.rs.core.Response;
import java.io.File;
import java.io.IOException;
import java.net.URISyntaxException;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;
import static org.mockito.BDDMockito.given;

@RunWith(MockitoJUnitRunner.class)
public class CheckStatusActionTest {

    @Mock
    private WebServiceConnector connector;

    private CheckStatusAction c;

    @Before
    public void setUp() {
        c = new CheckStatusAction();
        c.setStatus(Response.Status.OK.getStatusCode());
    }

    @Test
    public void testJSON() throws IOException {
        ObjectMapper mapper = new ObjectMapper();
        String json = mapper.writeValueAsString(c);
        CheckStatusAction c2 = mapper.readValue(json, CheckStatusAction.class);

        assertEquals(c.getStatus(), c2.getStatus());
    }

    @Test
    public void testJSONFile() throws IOException, URISyntaxException {
        ObjectMapper mapper = new ObjectMapper();

        File file = new File(getClass().getResource("/entities/restsymbolactions/CheckStatusTestData.json").toURI());
        RESTSymbolAction obj = mapper.readValue(file, RESTSymbolAction.class);

        assertTrue(obj instanceof CheckStatusAction);
        CheckStatusAction objAsAction = (CheckStatusAction) obj;
        assertEquals(Response.Status.OK.getStatusCode(), objAsAction.getStatus());
    }

    @Test
    public void shouldAcceptCorrectStatus() {
        given(connector.getStatus()).willReturn(Response.Status.OK.getStatusCode());

        ExecuteResult result = c.execute(connector);

        assertEquals(ExecuteResult.OK, result);
    }

    @Test
    public void shouldFailOnWrongStatus() {
        given(connector.getStatus()).willReturn(Response.Status.BAD_REQUEST.getStatusCode());

        ExecuteResult result = c.execute(connector);

        assertEquals(ExecuteResult.FAILED, result);
    }

}
