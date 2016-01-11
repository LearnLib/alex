/*
 * Copyright 2016 TU Dortmund
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
        SetVariableByHTMLElementAction declareAction2 = mapper.readValue(json, SetVariableByHTMLElementAction.class);

        assertEquals(setAction.getName(), declareAction2.getName());
        assertEquals(setAction.getValue(), declareAction2.getValue());
    }

    @Test
    public void testJSONFile() throws IOException, URISyntaxException {
        ObjectMapper mapper = new ObjectMapper();

        URI uri = getClass().getResource("/actions/StoreSymbolActions/SetVariableByHTMLElementTestData.json").toURI();
        File file = new File(uri);
        SymbolAction obj = mapper.readValue(file, SymbolAction.class);

        assertTrue(obj instanceof SetVariableByHTMLElementAction);
        SetVariableByHTMLElementAction objAsAction = (SetVariableByHTMLElementAction) obj;
        assertEquals("variable", objAsAction.getName());
        assertEquals("foobar", objAsAction.getValue());
    }

}
