package de.learnlib.weblearner.entities.WebSymbolActions;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ser.FilterProvider;
import com.fasterxml.jackson.databind.ser.impl.SimpleBeanPropertyFilter;
import com.fasterxml.jackson.databind.ser.impl.SimpleFilterProvider;
import de.learnlib.weblearner.entities.ExecuteResult;
import de.learnlib.weblearner.entities.Project;
import de.learnlib.weblearner.entities.PropertyFilterMixIn;
import de.learnlib.weblearner.entities.Symbol;
import de.learnlib.weblearner.entities.WebSymbol;
import de.learnlib.weblearner.learner.WebSiteConnector;
import org.junit.Before;
import org.junit.Test;

import java.io.File;
import java.io.IOException;
import java.net.URISyntaxException;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;

public class WebSymbolTest {

    private WebSymbol symb;

    @Before
    public void setUp() {
        Project project = new Project();
        project.setId(1);
        project.setName("Web Symbol Test Project");

        symb = new WebSymbol();
        symb.setName("WebSymbol");
        symb.setProject(project);
        symb.setAbbreviation("symb");

        WebSymbolAction a1 = new ClickAction();
        symb.addAction(a1);
        CheckTextWebAction a2 = new CheckTextWebAction();
        a2.setValue("F[oO0]+");
        a2.setRegexp(true);
        symb.addAction(a2);
        WebSymbolAction a3 = new WaitAction();
        symb.addAction(a3);
    }

    @Test(expected = IllegalArgumentException.class)
    public void shouldAddingSymbolBidirectional() {
        symb.addAction(null);
    }

    @Test
    public void shouldFailOnAddingNullSymbol() {
        WebSymbolAction a1 = mock(WebSymbolAction.class);
        symb.addAction(a1);
    }

    @Test
    public void ensureThatSerializingAndThenDeserializingChangesNothing() throws IOException {
        ObjectMapper mapper = new ObjectMapper();
        String json = mapper.writeValueAsString(symb);

        Symbol symb2 = mapper.readValue(json, WebSymbol.class);
        assertEquals(symb.getId(), symb2.getId());
        assertEquals(symb.getRevision(), symb2.getRevision());
        assertEquals(symb.getName(), symb2.getName());
        assertEquals(symb.getProject(), symb2.getProject());
        assertEquals(symb.getAbbreviation(), symb2.getAbbreviation());
    }

    @Test
    public void ensureThatSerializingASymbolWithoutProjectDoesNotCrash() throws JsonProcessingException {
        String expectedJson = "{\"type\":\"web\",\"abbreviation\":\"symb\",\"actions\":["
                    + "{\"type\":\"click\",\"node\":null,\"url\":null},"
                    + "{\"type\":\"checkText\",\"value\":\"F[oO0]+\",\"url\":null,\"regexp\":true},"
                    + "{\"type\":\"wait\",\"duration\":0}"
                + "],\"id\":0,\"name\":\"WebSymbol\",\"project\":0,\"resetSymbol\":false,\"revision\":0}";
        symb.setProject(null);

        ObjectMapper mapper = new ObjectMapper();
        mapper.addMixInAnnotations(Object.class, PropertyFilterMixIn.class);

        SimpleBeanPropertyFilter filter = SimpleBeanPropertyFilter.serializeAllExcept("hidden");
        FilterProvider filters = new SimpleFilterProvider().addFilter("filter properties by name", filter);

        String json = mapper.writer(filters).writeValueAsString(symb);

        assertEquals(expectedJson, json);
    }

    @Test
    public void ensureThatSerializingCreatesTheRightJSON() throws JsonProcessingException {
        String expectedJson = "{\"type\":\"web\",\"abbreviation\":\"symb\",\"actions\":["
                                    + "{\"type\":\"click\",\"node\":null,\"url\":null},"
                                    + "{\"type\":\"checkText\",\"value\":\"F[oO0]+\",\"url\":null,\"regexp\":true},"
                                    + "{\"type\":\"wait\",\"duration\":0}"
                                + "],\"hidden\":false,\"id\":0,\"name\":\"WebSymbol\",\"project\":1,"
                                + "\"resetSymbol\":false,\"revision\":0}";
        ObjectMapper mapper = new ObjectMapper();
        String json = mapper.writeValueAsString(symb);

        assertEquals(expectedJson, json);
    }

    @Test
    public void shouldReadJSONFileCorrectly() throws IOException, URISyntaxException {
        ObjectMapper mapper = new ObjectMapper();
        File file = new File(getClass().getResource("/entities/websymbolactions/WebSymbolTestData.json").toURI());
        symb = mapper.readValue(file, WebSymbol.class);

        assertEquals("Test Symbol", symb.getName());
        assertEquals("test_symb", symb.getAbbreviation());

        Class<?>[] expectedActions = {
                CheckNodeAction.class,
                CheckTextWebAction.class,
                ClearAction.class,
                ClickAction.class,
                FillAction.class,
                SubmitAction.class,
                WaitAction.class
        };

        assertEquals(expectedActions.length, symb.getActions().size());
        for (int i = 0; i < expectedActions.length; i++) {
            assertTrue(expectedActions[i].isInstance(symb.getActions().get(i)));
        }
    }

    @Test
    public void shouldReturnOkIfAllActionsRunSuccessfully() throws Exception {
        WebSiteConnector connector = mock(WebSiteConnector.class);

        WebSymbolAction action1 = mock(WebSymbolAction.class);
        given(action1.execute(connector)).willReturn(ExecuteResult.OK);
        WebSymbolAction action2 = mock(WebSymbolAction.class);
        given(action2.execute(connector)).willReturn(ExecuteResult.OK);

        WebSymbol symbol = new WebSymbol();
        symbol.addAction(action1);
        symbol.addAction(action2);

        assertEquals(ExecuteResult.OK.toString(), symbol.execute(connector));
    }

    @Test
    public void shouldReturnFailedIfOneActionsRunFailed() throws Exception {
        WebSiteConnector connector = mock(WebSiteConnector.class);

        WebSymbolAction action1 = mock(WebSymbolAction.class);
        given(action1.execute(connector)).willReturn(ExecuteResult.FAILED);
        WebSymbolAction action2 = mock(WebSymbolAction.class);
        given(action2.execute(connector)).willReturn(ExecuteResult.OK);

        WebSymbol symbol = new WebSymbol();
        symbol.addAction(action1);
        symbol.addAction(action2);

        assertEquals(ExecuteResult.FAILED.toString(), symbol.execute(connector));
        verify(action2, never()).execute(connector);
    }

}
