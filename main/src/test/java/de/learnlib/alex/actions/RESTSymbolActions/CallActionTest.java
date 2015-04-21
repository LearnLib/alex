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

import java.io.File;
import java.io.IOException;
import java.net.URISyntaxException;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;
import static org.mockito.BDDMockito.given;
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
        assertEquals("{}", objAsAction.getData());
    }

    @Test
    public void shouldDoAValidGetCall() {
        given(connector.getBaseUrl()).willReturn(TEST_BASE_URL);

        ExecuteResult result = c.execute(connector);

        assertEquals(ExecuteResult.OK, result);
        verify(connector).get(TEST_API_PATH);
    }

    @Test
    public void shouldDoAValidPostCall() {
        given(connector.getBaseUrl()).willReturn(TEST_BASE_URL + "/");
        c.setMethod(CallAction.Method.POST);

        ExecuteResult result = c.execute(connector);

        assertEquals(ExecuteResult.OK, result);
        verify(connector).post(TEST_API_PATH, "{}");
    }

    @Test
    public void shouldDoAValidPutCall() {
        given(connector.getBaseUrl()).willReturn(TEST_BASE_URL);
        c.setMethod(CallAction.Method.PUT);

        ExecuteResult result = c.execute(connector);

        assertEquals(ExecuteResult.OK, result);
        verify(connector).put(TEST_API_PATH, "{}");
    }

    @Test
    public void shouldDoAValidDeleteCall() {
        given(connector.getBaseUrl()).willReturn(TEST_BASE_URL);
        c.setMethod(CallAction.Method.DELETE);

        ExecuteResult result = c.execute(connector);

        assertEquals(ExecuteResult.OK, result);
        verify(connector).delete(TEST_API_PATH);
    }

}
