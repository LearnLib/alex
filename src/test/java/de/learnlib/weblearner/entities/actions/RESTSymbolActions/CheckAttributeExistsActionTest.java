package de.learnlib.weblearner.entities.actions.RESTSymbolActions;

import com.fasterxml.jackson.databind.ObjectMapper;
import de.learnlib.weblearner.entities.ExecuteResult;
import de.learnlib.weblearner.learner.connectors.WebServiceConnector;
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
public class CheckAttributeExistsActionTest {

    @Mock
    private WebServiceConnector connector;

    private CheckAttributeExistsAction c;

    @Before
    public void setUp() {
        c = new CheckAttributeExistsAction();
        c.setAttribute("awesome_field");
    }

    @Test
    public void testJSON() throws IOException {
        ObjectMapper mapper = new ObjectMapper();
        String json = mapper.writeValueAsString(c);
        CheckAttributeExistsAction c2 = mapper.readValue(json, CheckAttributeExistsAction.class);

        assertEquals(c.getAttribute(), c2.getAttribute());
    }

    @Test
    public void testJSONFile() throws IOException, URISyntaxException {
        ObjectMapper mapper = new ObjectMapper();

        String path = "/entities/restsymbolactions/CheckAttributeExistsTestData.json";
        File file = new File(getClass().getResource(path).toURI());
        RESTSymbolAction obj = mapper.readValue(file, RESTSymbolAction.class);

        assertTrue(obj instanceof CheckAttributeExistsAction);
        CheckAttributeExistsAction objAsAction = (CheckAttributeExistsAction) obj;
        assertEquals("object.attribute", objAsAction.getAttribute());
    }

    @Test
    public void shouldReturnOkIfAttributeExists() {
        given(connector.getBody()).willReturn("{\"awesome_field\": \"Lorem Ipsum. Hello World! Fooooobar\"}");

        ExecuteResult result = c.execute(connector);

        assertEquals(ExecuteResult.OK, result);
    }

    @Test
    public void shouldReturnOkIfAttributeExistsWithComplexStructure() {
        given(connector.getBody()).willReturn("{\"awesome_field\": {\"foo\": \"Fooooobar.\","
                                                                 + "\"other\": [\"Lorem Ipsum.\", \"Hello World!\"]}}");
        c.setAttribute("awesome_field.foo");

        ExecuteResult result = c.execute(connector);

        assertEquals(ExecuteResult.OK, result);
    }

    @Test
    public void shouldReturnFailedIfAttributeDoesNotExists() {
        given(connector.getBody()).willReturn("{\"not_so_awesome_field\": \"Lorem Ipsum. Hello World! Fooooobar\"}");

        ExecuteResult result = c.execute(connector);

        assertEquals(ExecuteResult.FAILED, result);
    }

}
