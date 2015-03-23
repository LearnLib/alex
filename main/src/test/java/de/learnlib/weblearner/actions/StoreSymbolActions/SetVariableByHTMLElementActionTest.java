package de.learnlib.weblearner.actions.StoreSymbolActions;

import com.fasterxml.jackson.databind.ObjectMapper;
import de.learnlib.weblearner.core.entities.SymbolAction;
import org.junit.Before;
import org.junit.Test;

import java.io.File;
import java.io.IOException;
import java.net.URISyntaxException;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

public class SetVariableByHTMLElementActionTest {

    private SetVariableByHTMLElementAction setAction;

    @Before
    public void setUp() {
        setAction = new SetVariableByHTMLElementAction();
        setAction.setName("variable");
    }

    @Test
    public void testJSON() throws IOException {
        ObjectMapper mapper = new ObjectMapper();
        String json = mapper.writeValueAsString(setAction);
        SetVariableByHTMLElementAction declareAction2 = (SetVariableByHTMLElementAction) mapper.readValue(json, SymbolAction.class);

        assertEquals(setAction.getName(), declareAction2.getName());
        assertEquals(setAction.getValue(), declareAction2.getValue());
    }

    @Test
    public void testJSONFile() throws IOException, URISyntaxException {
        ObjectMapper mapper = new ObjectMapper();

        File file = new File(getClass().getResource("/entities/StoreSymbolActions/SetVariableByHTMLElementTestData.json").toURI());
        SymbolAction obj = mapper.readValue(file, SymbolAction.class);

        assertTrue(obj instanceof SetVariableByHTMLElementAction);
        SetVariableByHTMLElementAction objAsAction = (SetVariableByHTMLElementAction) obj;
        assertEquals("variable", objAsAction.getName());
        assertEquals("foobar", objAsAction.getValue());
    }

}
