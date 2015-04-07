package de.learnlib.alex.actions.RESTSymbolActions;

import com.fasterxml.jackson.databind.ObjectMapper;
import de.learnlib.alex.core.entities.ExecuteResult;
import de.learnlib.alex.core.entities.Project;
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

@RunWith(MockitoJUnitRunner.class)
public class CheckAttributeValueActionTest {

    private static final Long PROJECT_ID = 42L;
    
    @Mock
    private WebServiceConnector connector;

    private CheckAttributeValueAction c;

    @Before
    public void setUp() {
        c = new CheckAttributeValueAction();
        c.setProject(new Project(PROJECT_ID));
        c.setAttribute("awesome_field");
        c.setValue("Hello World!");
        c.setRegexp(false);
    }

    @Test
    public void testJSON() throws IOException {
        ObjectMapper mapper = new ObjectMapper();
        String json = mapper.writeValueAsString(c);
        CheckAttributeValueAction c2 = mapper.readValue(json, CheckAttributeValueAction.class);

        assertEquals(c.getAttribute(), c2.getAttribute());
        assertEquals(c.getValue(), c2.getValue());
        assertEquals(c.isRegexp(), c2.isRegexp());
    }

    @Test
    public void testJSONFile() throws IOException, URISyntaxException {
        ObjectMapper mapper = new ObjectMapper();

        String path = "/actions/restsymbolactions/CheckAttributeValueTestData.json";
        File file = new File(getClass().getResource(path).toURI());
        RESTSymbolAction obj = mapper.readValue(file, RESTSymbolAction.class);

        assertTrue(obj instanceof CheckAttributeValueAction);
        CheckAttributeValueAction objAsAction = (CheckAttributeValueAction) obj;
        assertEquals("object.attribute", objAsAction.getAttribute());
        assertEquals("FooBar Lorem", objAsAction.getValue());
        assertEquals(true, objAsAction.isRegexp());
    }

    @Test
    public void shouldReturnOkIfAttributeWithRightValueExists() {
        given(connector.getBody()).willReturn("{\"awesome_field\": \"Hello World!\"}");

        ExecuteResult result = c.execute(connector);

        assertEquals(ExecuteResult.OK, result);
    }

    @Test
    public void shouldReturnOkIfAttributeWithRightValueExistsWithComplexStructure() {
        given(connector.getBody()).willReturn("{\"awesome_field\": {\"foo\": \"Hello World!\","
                + "\"other\": [\"Lorem Ipsum.\", \"Fooooobar.\"]}}");
        c.setAttribute("awesome_field.foo");

        ExecuteResult result = c.execute(connector);

        assertEquals(ExecuteResult.OK, result);
    }

    @Test
    public void shouldReturnFailedIfAttributeWithWrongValueExists() {
        given(connector.getBody()).willReturn("{\"awesome_field\": \"Lorem Ipsum!\"}");

        ExecuteResult result = c.execute(connector);

        assertEquals(ExecuteResult.FAILED, result);
    }

    @Test
    public void shouldReturnFailedIfAttributeDoesNotExist() {
        given(connector.getBody()).willReturn("{\"not_so_awesome_field\": \"Lorem Ipsum. Hello World! Fooooobar\"}");

        ExecuteResult result = c.execute(connector);

        assertEquals(ExecuteResult.FAILED, result);
    }

    @Test
    public void shouldReturnFailedIfJSONIsEmpty() {
        given(connector.getBody()).willReturn("");

        ExecuteResult result = c.execute(connector);

        assertEquals(ExecuteResult.FAILED, result);
    }

    @Test
    public void shouldReturnOKIfTextWasFoundWithRegexp() {
        c.setValue("F[oO]+ B[a]+r");
        c.setRegexp(true);
        given(connector.getBody()).willReturn("{\"awesome_field\": \"FoO Baaaaar\"}");

        assertEquals(ExecuteResult.OK, c.execute(connector));
    }

    @Test
    public void shouldReturnFailedIfTextWasNotFoundWithRegexp() {
        c.setValue("F[oO]+ B[a]+r");
        c.setRegexp(true);
        given(connector.getBody()).willReturn("{\"awesome_field\": \"F Bar\"}");

        assertEquals(ExecuteResult.FAILED, c.execute(connector));
    }

}
