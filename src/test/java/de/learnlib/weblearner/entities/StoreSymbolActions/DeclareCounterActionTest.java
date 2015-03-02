package de.learnlib.weblearner.entities.StoreSymbolActions;

import com.fasterxml.jackson.databind.ObjectMapper;
import de.learnlib.weblearner.entities.SymbolAction;
import org.junit.Before;
import org.junit.Test;

import java.io.File;
import java.io.IOException;
import java.net.URISyntaxException;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

public class DeclareCounterActionTest {

    private DeclareCounterAction declareAction;

    @Before
    public void setUp() {
        declareAction = new DeclareCounterAction();
        declareAction.setName("counter");
    }

    @Test
    public void testJSON() throws IOException {
        ObjectMapper mapper = new ObjectMapper();
        String json = mapper.writeValueAsString(declareAction);
        DeclareCounterAction declareAction2 = mapper.readValue(json, DeclareCounterAction.class);

        assertEquals(declareAction.getName(), declareAction2.getName());
    }

    @Test
    public void testJSONFile() throws IOException, URISyntaxException {
        ObjectMapper mapper = new ObjectMapper();

        File file = new File(getClass().getResource("/entities/StoreSymbolActions/DeclareCounterTestData.json").toURI());
        SymbolAction obj = mapper.readValue(file, SymbolAction.class);

        assertTrue(obj instanceof DeclareCounterAction);
        DeclareCounterAction objAsAction = (DeclareCounterAction) obj;
        assertEquals("counter", objAsAction.getName());
    }

}
