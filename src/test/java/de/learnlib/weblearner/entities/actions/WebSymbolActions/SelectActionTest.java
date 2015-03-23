package de.learnlib.weblearner.entities.actions.WebSymbolActions;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.Before;
import org.junit.Test;

import java.io.File;
import java.io.IOException;
import java.net.URISyntaxException;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

public class SelectActionTest {

    private SelectAction s;

    @Before
    public void setUp() {
        s = new SelectAction();
        s.setNode("#node");
        s.setValue("Lorem Ipsum");
    }

    @Test
    public void testJSON() throws IOException {
        ObjectMapper mapper = new ObjectMapper();
        String json = mapper.writeValueAsString(s);
        SelectAction f2 = mapper.readValue(json, SelectAction.class);

        assertEquals(s.getNode(), f2.getNode());
    }

    @Test
    public void testJSONFile() throws IOException, URISyntaxException {
        ObjectMapper mapper = new ObjectMapper();

        File file = new File(getClass().getResource("/entities/websymbolactions/SelectTestData.json").toURI());
        WebSymbolAction obj = mapper.readValue(file, WebSymbolAction.class);

        assertTrue(obj instanceof SelectAction);
        SelectAction objAsAction = (SelectAction) obj;
        assertEquals("#input", objAsAction.getNode());
        assertEquals("Lorem Ipsum", objAsAction.getValue());
    }

}
