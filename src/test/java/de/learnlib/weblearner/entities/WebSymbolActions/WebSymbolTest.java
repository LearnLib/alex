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
import de.learnlib.weblearner.entities.SymbolGroup;
import de.learnlib.weblearner.learner.MultiConnector;
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

    private Symbol symbol;

    @Before
    public void setUp() {
        Project project = new Project();
        project.setId(1);
        project.setName("Web Symbol Test Project");

        SymbolGroup group = new SymbolGroup();
        group.setId(2L);
        group.setName("Web Symbol Test Project");

        symbol = new Symbol();
        symbol.setProject(project);
        symbol.setGroup(group);
        symbol.setName("WebSymbol");
        symbol.setAbbreviation("symb");

        WebSymbolAction a1 = new ClickAction();
        symbol.addAction(a1);
        CheckTextWebAction a2 = new CheckTextWebAction();
        a2.setValue("F[oO0]+");
        a2.setRegexp(true);
        symbol.addAction(a2);
        WebSymbolAction a3 = new WaitAction();
        symbol.addAction(a3);
    }

    @Test(expected = IllegalArgumentException.class)
    public void shouldAddingSymbolBidirectional() {
        symbol.addAction(null);
    }

    @Test
    public void shouldFailOnAddingNullSymbol() {
        WebSymbolAction a1 = mock(WebSymbolAction.class);
        symbol.addAction(a1);
    }

    @Test
    public void ensureThatSerializingAndThenDeserializingChangesNothing() throws IOException {
        ObjectMapper mapper = new ObjectMapper();
        String json = mapper.writeValueAsString(symbol);

        Symbol symbolFromMapper = mapper.readValue(json, Symbol.class);
        assertEquals(symbol.getProject(), symbolFromMapper.getProject());
        assertEquals(symbol.getId(), symbolFromMapper.getId());
        assertEquals(symbol.getRevision(), symbolFromMapper.getRevision());
        assertEquals(symbol.getAbbreviation(), symbolFromMapper.getAbbreviation());
        assertEquals(symbol.getName(), symbolFromMapper.getName());
        assertEquals(symbol.getGroup().getGroupId(), symbolFromMapper.getGroup().getGroupId());
        assertEquals(symbol.getGroup().getId(), symbolFromMapper.getGroup().getId());
        assertEquals(symbol.getGroup().getProject(), symbolFromMapper.getGroup().getProject());
        assertEquals(symbol.getGroup(), symbolFromMapper.getGroup());
    }

    @Test
    public void ensureThatSerializingASymbolWithoutProjectDoesNotCrash() throws JsonProcessingException {
        String expectedJson = "{\"abbreviation\":\"symb\",\"actions\":["
                    + "{\"type\":\"click\",\"node\":null,\"url\":null},"
                    + "{\"type\":\"checkText\",\"value\":\"F[oO0]+\",\"url\":null,\"regexp\":true},"
                    + "{\"type\":\"wait\",\"duration\":0}"
                + "],\"group\":2,\"id\":0,\"name\":\"WebSymbol\",\"project\":0,\"revision\":0}";
        symbol.setProject(null);

        ObjectMapper mapper = new ObjectMapper();
        mapper.addMixInAnnotations(Object.class, PropertyFilterMixIn.class);

        SimpleBeanPropertyFilter filter = SimpleBeanPropertyFilter.serializeAllExcept("hidden");
        FilterProvider filters = new SimpleFilterProvider().addFilter("filter properties by name", filter);

        String json = mapper.writer(filters).writeValueAsString(symbol);

        assertEquals(expectedJson, json);
    }

    @Test
    public void ensureThatSerializingCreatesTheRightJSON() throws JsonProcessingException {
        String expectedJson = "{\"abbreviation\":\"symb\",\"actions\":["
                                    + "{\"type\":\"click\",\"node\":null,\"url\":null},"
                                    + "{\"type\":\"checkText\",\"value\":\"F[oO0]+\",\"url\":null,\"regexp\":true},"
                                    + "{\"type\":\"wait\",\"duration\":0}"
                                + "],\"group\":2,\"hidden\":false,\"id\":0,\"name\":\"WebSymbol\",\"project\":1,"
                                + "\"revision\":0}";
        ObjectMapper mapper = new ObjectMapper();
        String json = mapper.writeValueAsString(symbol);

        assertEquals(expectedJson, json);
    }

    @Test
    public void shouldReadJSONFileCorrectly() throws IOException, URISyntaxException {
        ObjectMapper mapper = new ObjectMapper();
        File file = new File(getClass().getResource("/entities/websymbolactions/WebSymbolTestData.json").toURI());
        symbol = mapper.readValue(file, Symbol.class);

        assertEquals("Test Symbol", symbol.getName());
        assertEquals("test_symb", symbol.getAbbreviation());

        Class<?>[] expectedActions = {
                CheckNodeAction.class,
                CheckTextWebAction.class,
                ClearAction.class,
                ClickAction.class,
                FillAction.class,
                SubmitAction.class,
                WaitAction.class
        };

        assertEquals(expectedActions.length, symbol.getActions().size());
        for (int i = 0; i < expectedActions.length; i++) {
            assertTrue(expectedActions[i].isInstance(symbol.getActions().get(i)));
        }
    }

    @Test
    public void shouldReturnOkIfAllActionsRunSuccessfully() throws Exception {
        MultiConnector connector = mock(MultiConnector.class);
        WebSymbolAction action1 = mock(WebSymbolAction.class);
        given(action1.execute(connector)).willReturn(ExecuteResult.OK);
        WebSymbolAction action2 = mock(WebSymbolAction.class);
        given(action2.execute(connector)).willReturn(ExecuteResult.OK);

        Symbol symbol = new Symbol();
        symbol.addAction(action1);
        symbol.addAction(action2);

        assertEquals(ExecuteResult.OK.toString(), symbol.execute(connector));
    }

    @Test
    public void shouldReturnFailedIfOneActionsRunFailed() throws Exception {
        MultiConnector connector = mock(MultiConnector.class);
        WebSymbolAction action1 = mock(WebSymbolAction.class);
        given(action1.execute(connector)).willReturn(ExecuteResult.FAILED);
        WebSymbolAction action2 = mock(WebSymbolAction.class);
        given(action2.execute(connector)).willReturn(ExecuteResult.OK);

        Symbol symbol = new Symbol();
        symbol.addAction(action1);
        symbol.addAction(action2);

        assertEquals(ExecuteResult.FAILED.toString(), symbol.execute(connector));
        verify(action2, never()).execute(connector);
    }

}
