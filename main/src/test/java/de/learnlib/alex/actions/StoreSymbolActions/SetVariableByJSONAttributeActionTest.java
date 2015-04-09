package de.learnlib.alex.actions.StoreSymbolActions;

import com.fasterxml.jackson.databind.ObjectMapper;
import de.learnlib.alex.core.entities.SymbolAction;
import org.junit.Before;
import org.junit.Test;

import java.io.File;
import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

public class SetVariableByJSONAttributeActionTest {

    private SetVariableByJSONAttributeAction setAction;

    @Before
    public void setUp() {
        setAction = new SetVariableByJSONAttributeAction();
        setAction.setName("variable");
    }

    @Test
    public void testJSON() throws IOException {
        ObjectMapper mapper = new ObjectMapper();
        String json = mapper.writeValueAsString(setAction);
        SetVariableByJSONAttributeAction action2 = mapper.readValue(json, SetVariableByJSONAttributeAction.class);

        assertEquals(setAction.getName(), action2.getName());
        assertEquals(setAction.getValue(), action2.getValue());
    }

    @Test
    public void testJSONFile() throws IOException, URISyntaxException {
        ObjectMapper mapper = new ObjectMapper();

        URI uri = getClass().getResource("/actions/StoreSymbolActions/SetVariableByJSONAttributeTestData.json").toURI();
        File file = new File(uri);
        SymbolAction obj = mapper.readValue(file, SymbolAction.class);

        assertTrue(obj instanceof SetVariableByJSONAttributeAction);
        SetVariableByJSONAttributeAction objAsAction = (SetVariableByJSONAttributeAction) obj;
        assertEquals("variable", objAsAction.getName());
        assertEquals("foobar", objAsAction.getValue());
    }

}
