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

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;
import static org.mockito.BDDMockito.given;

@RunWith(MockitoJUnitRunner.class)
public class CheckAttributeTypeActionTest {

    private static final Long PROJECT_ID = 42L;

    @Mock
    private WebServiceConnector connector;

    private CheckAttributeTypeAction c;

    @Before
    public void setUp() {
        c = new CheckAttributeTypeAction();
        c.setProject(new Project(PROJECT_ID));
        c.setAttribute("awesome_field");
        c.setJsonType(CheckAttributeTypeAction.JsonType.STRING);
    }

    @Test
    public void testJSON() throws IOException {
        ObjectMapper mapper = new ObjectMapper();
        String json = mapper.writeValueAsString(c);
        CheckAttributeTypeAction c2 = mapper.readValue(json, CheckAttributeTypeAction.class);

        assertEquals(c.getAttribute(), c2.getAttribute());
        assertEquals(c.getJsonType(), c2.getJsonType());
    }

    @Test
    public void testJSONFile() throws IOException, URISyntaxException {
        ObjectMapper mapper = new ObjectMapper();

        String path = "/actions/restsymbolactions/CheckAttributeTypeTestData.json";
        File file = new File(getClass().getResource(path).toURI());
        RESTSymbolAction obj = mapper.readValue(file, RESTSymbolAction.class);

        assertTrue(obj instanceof CheckAttributeTypeAction);
        CheckAttributeTypeAction objAsAction = (CheckAttributeTypeAction) obj;
        assertEquals("object.attribute", objAsAction.getAttribute());
        assertEquals(CheckAttributeTypeAction.JsonType.STRING, objAsAction.getJsonType());
    }

    @Test
    public void shouldReturnOkIfAttributeWithRightTypeExists() {
        given(connector.getBody()).willReturn("{\"awesome_field\": \"Lorem Ipsum. Hello World! Fooooobar\"}");

        ExecuteResult result = c.execute(connector);

        assertEquals(ExecuteResult.OK, result);
    }

    @Test
    public void shouldReturnOkIfAttributeWithRightTypeExistsWithComplexStructure() {
        given(connector.getBody()).willReturn("{\"awesome_field\": {\"foo\": \"Fooooobar.\","
                + "\"other\": [\"Lorem Ipsum.\", \"Hello World!\"]}}");
        c.setAttribute("awesome_field.foo");

        ExecuteResult result = c.execute(connector);

        assertEquals(ExecuteResult.OK, result);
    }

    @Test
    public void shouldReturnFailedIfAttributeWithWrongTypeExists() {
        given(connector.getBody()).willReturn("{\"awesome_field\": true}");

        ExecuteResult result = c.execute(connector);

        assertEquals(ExecuteResult.FAILED, result);
    }

    @Test
    public void shouldReturnFailedIfAttributeDoesNotExist() {
        given(connector.getBody()).willReturn("{\"not_so_awesome_field\": \"Lorem Ipsum. Hello World! Fooooobar\"}");

        ExecuteResult result = c.execute(connector);

        assertEquals(ExecuteResult.FAILED, result);
    }

}
