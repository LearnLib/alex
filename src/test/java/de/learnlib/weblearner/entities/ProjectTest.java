package de.learnlib.weblearner.entities;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.Test;

import java.io.File;
import java.io.IOException;
import java.net.URISyntaxException;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNotSame;
import static org.junit.Assert.assertSame;
import static org.junit.Assert.assertTrue;

public class ProjectTest {

    public static final String LOREM_IPSUM = "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, "
            + "sed diam nonumy eirmod tempor invidunt ut labore";

    @Test
    public void ensureThatSerializingAndThenDeserializingChangesNothing() throws IOException {
        Project p = new Project();
        p.setName("Test Project");

        ObjectMapper mapper = new ObjectMapper();
        String json = mapper.writeValueAsString(p);
        Project p2 = mapper.readValue(json, Project.class);

        assertEquals(p.getName(), p2.getName());
        assertTrue(p2.getSymbols() != null);
    }

    @Test
    public void shouldBeAbleToDeserializeTheTestData() throws URISyntaxException, IOException {
        ObjectMapper mapper = new ObjectMapper();

        File file = new File(getClass().getResource("/entities/ProjectTestData.json").toURI());
        Project p = mapper.readValue(file, Project.class);

        assertEquals("Test Project", p.getName());
        assertEquals("http://example.com", p.getBaseUrl());
        assertEquals(null, p.getResetSymbol(WebSymbol.class)); //TODO
        assertEquals(LOREM_IPSUM, p.getDescription());
        assertTrue(p.getSymbols() != null);
        assertEquals(1, p.getSymbolsSize());
    }

    @Test
    public void ensureThatEqualsAndHashAreWorking() {
        Project p1 = new Project();
        p1.setId(0);
        p1.setName("Test Project");

        Project p2 = new Project();
        p2.setId(1);
        p2.setName("Test Project");

        assertTrue(p1.equals(p1));
        assertFalse(p1.equals(null));
        assertFalse(p1.equals("FooBar"));
        assertFalse(p1.equals(p2));

        assertSame(p1.hashCode(), p1.hashCode());
        assertNotSame(p1.hashCode(), p2.hashCode());
    }

}
