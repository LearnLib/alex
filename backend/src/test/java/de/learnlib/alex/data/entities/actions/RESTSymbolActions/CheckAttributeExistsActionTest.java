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

package de.learnlib.alex.data.entities.actions.RESTSymbolActions;

import com.fasterxml.jackson.databind.ObjectMapper;
import de.learnlib.alex.data.entities.ExecuteResult;
import de.learnlib.alex.data.entities.Symbol;
import de.learnlib.alex.learning.services.connectors.WebServiceConnector;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;

import java.io.File;
import java.io.IOException;
import java.net.URISyntaxException;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;
import static org.mockito.BDDMockito.given;

@RunWith(MockitoJUnitRunner.class)
public class CheckAttributeExistsActionTest {

    @Mock
    private WebServiceConnector connector;

    @Mock
    private Symbol symbol;

    private CheckAttributeExistsAction c;

    @Before
    public void setUp() {
        c = new CheckAttributeExistsAction();
        c.setSymbol(symbol);
        c.setAttribute("awesome_field");
    }

    @Test
    public void testJSON() throws IOException {
        ObjectMapper mapper = new ObjectMapper();
        String json = mapper.writeValueAsString(c);
        CheckAttributeExistsAction c2 = mapper.readValue(json, CheckAttributeExistsAction.class);

        assertEquals(c.getAttribute(), c2.getAttribute());
    }

    @Test
    public void testJSONFile() throws IOException, URISyntaxException {
        ObjectMapper mapper = new ObjectMapper();

        String path = "/actions/restsymbolactions/CheckAttributeExistsTestData.json";
        File file = new File(getClass().getResource(path).toURI());
        RESTSymbolAction obj = mapper.readValue(file, RESTSymbolAction.class);

        assertTrue(obj instanceof CheckAttributeExistsAction);
        CheckAttributeExistsAction objAsAction = (CheckAttributeExistsAction) obj;
        assertEquals("object.attribute", objAsAction.getAttribute());
    }

    @Test
    public void shouldReturnOkIfAttributeExists() {
        given(connector.getBody()).willReturn("{\"awesome_field\": \"Lorem Ipsum. Hello World! Fooooobar\"}");

        ExecuteResult result = c.execute(connector);

        assertEquals(ExecuteResult.OK, result);
    }

    @Test
    public void shouldReturnOkIfAttributeExistsWithComplexStructure() {
        given(connector.getBody()).willReturn("{\"awesome_field\": {\"foo\": \"Fooooobar.\","
                                                                 + "\"other\": [\"Lorem Ipsum.\", \"Hello World!\"]}}");
        c.setAttribute("awesome_field.foo");

        ExecuteResult result = c.execute(connector);

        assertEquals(ExecuteResult.OK, result);
    }

    @Test
    public void shouldReturnFailedIfAttributeDoesNotExists() {
        given(connector.getBody()).willReturn("{\"not_so_awesome_field\": \"Lorem Ipsum. Hello World! Fooooobar\"}");

        ExecuteResult result = c.execute(connector);

        assertEquals(ExecuteResult.FAILED, result);
    }

}
