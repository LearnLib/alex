package de.learnlib.weblearner.utils;

import org.junit.Test;

import java.util.LinkedList;
import java.util.List;

import static org.junit.Assert.assertEquals;

public class JSONHelpersTest {

    @Test
    public void shouldConnectStringsWithoutAdditionalQuotes() {
        List<String> strings = new LinkedList<>();
        strings.add("{\"name\": \"object1\"}");
        strings.add("{\"name\": \"object2\"}");

        String generatedJSON = JSONHelpers.stringListToJSON(strings);

        String expectedJSON = "[{\"name\": \"object1\"},{\"name\": \"object2\"}]";
        assertEquals(expectedJSON, generatedJSON);
    }

    @Test
    public void shouldConnectAnEmptyListCorrectly() {
        List<String> strings = new LinkedList<>();

        String generatedJSON = JSONHelpers.stringListToJSON(strings);

        String expectedJSON = "[]";
        assertEquals(expectedJSON, generatedJSON);
    }

}
