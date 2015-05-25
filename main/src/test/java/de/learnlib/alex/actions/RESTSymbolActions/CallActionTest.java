package de.learnlib.alex.actions.RESTSymbolActions;

import com.fasterxml.jackson.databind.ObjectMapper;
import de.learnlib.alex.core.entities.ExecuteResult;
import de.learnlib.alex.core.entities.Project;
import de.learnlib.alex.core.entities.SymbolAction;
import de.learnlib.alex.core.learner.connectors.WebServiceConnector;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;

import javax.ws.rs.core.MultivaluedMap;
import java.io.File;
import java.io.IOException;
import java.net.URISyntaxException;
import java.util.HashMap;
import java.util.Set;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;
import static org.mockito.BDDMockito.given;
import static org.mockito.Matchers.any;
import static org.mockito.Matchers.eq;
import static org.mockito.Mockito.verify;

@RunWith(MockitoJUnitRunner.class)
public class CallActionTest {

    public static final String TEST_BASE_URL = "http://example.com/api";
    public static final String TEST_API_PATH = "/test";
    public static final String TEST_API_URL = TEST_BASE_URL + TEST_API_PATH;
    private static final Long PROJECT_ID = 42L;

    @Mock
    private WebServiceConnector connector;

    private CallAction c;

    @Before
    public void setUp() {
        c = new CallAction();
        c.setProject(new Project(PROJECT_ID));
        c.setMethod(CallAction.Method.GET);
        c.setUrl(TEST_API_PATH);
        HashMap<String, String> cookies = new HashMap<>();
        cookies.put("cookie", "Lorem Ipsum");
        c.setCookies(cookies);
        c.setData("{}");
    }

    @Test
    public void testJSON() throws IOException {
        ObjectMapper mapper = new ObjectMapper();
        String json = mapper.writeValueAsString(c);
        CallAction c2 = mapper.readValue(json, CallAction.class);

        assertEquals(c.getMethod(), c2.getMethod());
        assertEquals(c.getUrl(), c2.getUrl());
        assertEquals(c.getData(), c2.getData());
    }

    @Test
    public void testJSONFile() throws IOException, URISyntaxException {
        ObjectMapper mapper = new ObjectMapper();

        File file = new File(getClass().getResource("/actions/restsymbolactions/CallActionTestData.json").toURI());
        SymbolAction obj = mapper.readValue(file, SymbolAction.class);

        assertTrue(obj instanceof CallAction);
        CallAction objAsAction = (CallAction) obj;
        assertEquals(CallAction.Method.GET, objAsAction.getMethod());
        assertEquals(TEST_BASE_URL, objAsAction.getUrl());
        assertEquals(1, objAsAction.getHeaders().size()); // assert header
        assertEquals("Foobar, Bar", objAsAction.getHeaders().get("X-MyHeader"));
        assertEquals(c.getCookies().size(), objAsAction.getCookies().size()); // assert cookies
        assertEquals(c.getCookies().get("cookie"), objAsAction.getCookies().get("cookie"));
        assertEquals("{}", objAsAction.getData());
    }

    @Test
    public void shouldDoAValidGetCall() {
        given(connector.getBaseUrl()).willReturn(TEST_BASE_URL);

        ExecuteResult result = c.execute(connector);

        assertEquals(ExecuteResult.OK, result);
        verify(connector).get(eq(TEST_API_PATH), any(MultivaluedMap.class), any(Set.class));
    }

    @Test
    public void shouldDoAValidPostCall() {
        given(connector.getBaseUrl()).willReturn(TEST_BASE_URL + "/");
        c.setMethod(CallAction.Method.POST);

        ExecuteResult result = c.execute(connector);

        assertEquals(ExecuteResult.OK, result);
        verify(connector).post(eq(TEST_API_PATH), any(MultivaluedMap.class), any(Set.class), eq("{}"));
    }

    @Test
    public void shouldDoAValidPutCall() {
        given(connector.getBaseUrl()).willReturn(TEST_BASE_URL);
        c.setMethod(CallAction.Method.PUT);

        ExecuteResult result = c.execute(connector);

        assertEquals(ExecuteResult.OK, result);
        verify(connector).put(eq(TEST_API_PATH), any(MultivaluedMap.class), any(Set.class), eq("{}"));
    }

    @Test
    public void shouldDoAValidDeleteCall() {
        given(connector.getBaseUrl()).willReturn(TEST_BASE_URL);
        c.setMethod(CallAction.Method.DELETE);

        ExecuteResult result = c.execute(connector);

        assertEquals(ExecuteResult.OK, result);
        verify(connector).delete(eq(TEST_API_PATH), any(MultivaluedMap.class), any(Set.class));
    }

}
