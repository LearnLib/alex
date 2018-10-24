/*
 * Copyright 2018 TU Dortmund
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package de.learnlib.alex.data.entities;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.Test;

import java.io.File;
import java.io.IOException;
import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.List;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertNotSame;
import static org.junit.Assert.assertSame;
import static org.junit.Assert.assertTrue;

public class ProjectTest {

    public static final String LOREM_IPSUM = "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, "
            + "sed diam nonumy eirmod tempor invidunt ut labore";

    public static Project readProject(String json) throws IOException {
        json = json.replaceAll(",\"symbolAmount\":[ ]?[0-9]+", "");
        ObjectMapper mapper = new ObjectMapper();
        return mapper.readValue(json, Project.class);
    }

    public static List<Project> readProjectList(String json) throws IOException {
        List<Project> projects = new ArrayList<>();

        json = json.substring(1, json.length() - 1);
        json = json.replace("},{", "};{");
        for (String s : json.split(";")) {
            Project nextProject = ProjectTest.readProject(s.trim());
            projects.add(nextProject);
        }

        return projects;
    }

    @Test
    public void ensureThatSerializingAndThenDeserializingChangesNothing() throws IOException {
        ObjectMapper mapper = new ObjectMapper();

        Project p = new Project();
        p.setName("Test Project");

        String json = mapper.writeValueAsString(p);
        Project p2 = readProject(json);

        assertEquals(p.getName(), p2.getName());
        assertTrue(p2.getSymbols() != null);
    }

    @Test
    public void shouldBeAbleToDeserializeTheTestData() throws URISyntaxException, IOException {
        ObjectMapper mapper = new ObjectMapper();

        File file = new File(getClass().getResource("/core/entities/ProjectTestData.json").toURI());
        Project p = mapper.readValue(file, Project.class);

        assertEquals("Test Project", p.getName());
        assertEquals("http://example.com", p.getDefaultUrl().getUrl());
        assertEquals(LOREM_IPSUM, p.getDescription());
        assertNotNull(p.getSymbols());
        // symbols are not included in the Project directly, instead they're parts of groups now
        assertEquals(0, p.getSymbols().size());
    }

    @Test
    public void ensureThatEqualsAndHashAreWorking() {
        Project p1 = new Project();
        p1.setId(0L);
        p1.setName("Test Project");

        Project p2 = new Project();
        p2.setId(1L);
        p2.setName("Test Project");

        assertTrue(p1.equals(p1));
        assertFalse(p1.equals(null));
        assertFalse(p1.equals("FooBar"));
        assertFalse(p1.equals(p2));

        assertSame(p1.hashCode(), p1.hashCode());
        assertNotSame(p1.hashCode(), p2.hashCode());
    }

}
