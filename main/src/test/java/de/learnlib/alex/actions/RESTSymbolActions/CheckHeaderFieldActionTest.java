package de.learnlib.alex.actions.RESTSymbolActions;

import com.fasterxml.jackson.databind.ObjectMapper;
import de.learnlib.alex.core.entities.ExecuteResult;
import de.learnlib.alex.core.entities.Project;
import de.learnlib.alex.core.entities.User;
import de.learnlib.alex.core.learner.connectors.WebServiceConnector;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;

import javax.ws.rs.core.MultivaluedHashMap;
import java.io.File;
import java.io.IOException;
import java.net.URISyntaxException;
import java.util.LinkedList;
import java.util.List;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.mock;

@RunWith(MockitoJUnitRunner.class)
public class CheckHeaderFieldActionTest {

    @Mock
    private WebServiceConnector connector;

    @Mock
    private User user;

    @Mock
    private Project project;

    private CheckHeaderFieldAction c;

    @Before
    public void setUp() {
        c = new CheckHeaderFieldAction();
        c.setUser(user);
        c.setProject(project);
        c.setKey("Accept");
        c.setValue("text/html");
        c.setRegexp(false);
    }

    @Test
    public void testJSON() throws IOException {
        ObjectMapper mapper = new ObjectMapper();
        String json = mapper.writeValueAsString(c);
        CheckHeaderFieldAction c2 = mapper.readValue(json, CheckHeaderFieldAction.class);

        assertEquals(c.getKey(), c2.getKey());
        assertEquals(c.getValue(), c2.getValue());
        assertEquals(c.isRegexp(), c2.isRegexp());
    }

    @Test
    public void testJSONFile() throws IOException, URISyntaxException {
        ObjectMapper mapper = new ObjectMapper();

        String path = "/actions/restsymbolactions/CheckHeaderFieldTestData.json";
        File file = new File(getClass().getResource(path).toURI());
        RESTSymbolAction obj = mapper.readValue(file, RESTSymbolAction.class);

        assertTrue(obj instanceof CheckHeaderFieldAction);
        CheckHeaderFieldAction objAsAction = (CheckHeaderFieldAction) obj;
        assertEquals("Key", objAsAction.getKey());
        assertEquals("Value", objAsAction.getValue());
        assertEquals(true, objAsAction.isRegexp());
    }

    @Test
    public void shouldReturnOkIfHeaderFieldWithTheValueExists() {
        MultivaluedHashMap<String, Object> headers = createHeaders("text/html", "application/xhtml+xml");
        given(connector.getHeaders()).willReturn(headers);

        ExecuteResult result = c.execute(connector);

        assertEquals(ExecuteResult.OK, result);
    }

    @Test
    public void shouldReturnFailedIfHeaderFieldWithoutValue() {
        MultivaluedHashMap<String, Object> headers = createHeaders("application/xhtml+xml");
        given(connector.getHeaders()).willReturn(headers);

        ExecuteResult result = c.execute(connector);

        assertEquals(ExecuteResult.FAILED, result);
    }

    @Test
    public void shouldReturnFailedIfHeaderFieldDoesNotExists() {
        MultivaluedHashMap<String, Object> headers = mock(MultivaluedHashMap.class);
        given(connector.getHeaders()).willReturn(headers);
        ExecuteResult result = c.execute(connector);

        assertEquals(ExecuteResult.FAILED, result);
    }

    @Test
    public void shouldReturnOKIfTextWasFoundWithRegexp() {
        c.setValue("F[oO]+ B[a]+r");
        c.setRegexp(true);
        MultivaluedHashMap<String, Object> headers = createHeaders("text/html", "FoO Baaaaar", "application/xhtml+xml");
        given(connector.getHeaders()).willReturn(headers);

        assertEquals(ExecuteResult.OK, c.execute(connector));
    }

    @Test
    public void shouldReturnFailedIfTextWasNotFoundWithRegexp() {
        c.setValue("F[oO]+ B[a]+r");
        c.setRegexp(true);
        MultivaluedHashMap<String, Object> headers = createHeaders("text/html", "F BAr", "application/xhtml+xml");
        given(connector.getHeaders()).willReturn(headers);

        assertEquals(ExecuteResult.FAILED, c.execute(connector));
    }

    private MultivaluedHashMap<String, Object> createHeaders(String... data) {
        MultivaluedHashMap<String, Object> headers = mock(MultivaluedHashMap.class);
        List<Object> values = new LinkedList<>();
        for (String d : data) {
            values.add(d);
        }
        given(headers.get("Accept")).willReturn(values);
        return headers;
    }

}
