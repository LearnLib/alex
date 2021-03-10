/*
 * Copyright 2015 - 2021 TU Dortmund
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

package de.learnlib.alex.data.entities.actions.rest;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;
import static org.mockito.BDDMockito.given;

import com.fasterxml.jackson.databind.ObjectMapper;
import de.learnlib.alex.data.entities.ExecuteResult;
import de.learnlib.alex.data.entities.Symbol;
import java.io.File;
import java.io.IOException;
import java.net.URISyntaxException;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnitRunner;

@RunWith(MockitoJUnitRunner.class)
public class CheckAttributeTypeActionTest extends RestActionTest {

    @Mock
    private Symbol symbol;

    private CheckAttributeTypeAction c;

    @Before
    public void setUp() {
        super.setUp();

        c = new CheckAttributeTypeAction();
        c.setSymbol(symbol);
        c.setAttribute("awesome_field");
        c.setJsonType(CheckAttributeTypeAction.JsonType.STRING);
    }

    @Test
    public void testJSON() throws IOException {
        ObjectMapper mapper = new ObjectMapper();
        String json = mapper.writeValueAsString(c);
        CheckAttributeTypeAction c2 = mapper.readValue(json, CheckAttributeTypeAction.class);

        assertEquals(c.getAttribute(), c2.getAttribute());
        assertEquals(c.getJsonType(), c2.getJsonType());
    }

    @Test
    public void testJSONFile() throws IOException, URISyntaxException {
        ObjectMapper mapper = new ObjectMapper();

        String path = "/actions/restsymbolactions/CheckAttributeTypeTestData.json";
        File file = new File(getClass().getResource(path).toURI());
        RESTSymbolAction obj = mapper.readValue(file, RESTSymbolAction.class);

        assertTrue(obj instanceof CheckAttributeTypeAction);
        CheckAttributeTypeAction objAsAction = (CheckAttributeTypeAction) obj;
        assertEquals("object.attribute", objAsAction.getAttribute());
        assertEquals(CheckAttributeTypeAction.JsonType.STRING, objAsAction.getJsonType());
    }

    @Test
    public void shouldReturnOkIfAttributeWithRightTypeExists() {
        given(webServiceConnector.getBody()).willReturn("{\"awesome_field\": \"Lorem Ipsum. Hello World! Fooooobar\"}");

        ExecuteResult result = c.executeAction(connectors);
        assertTrue(result.isSuccess());
    }

    @Test
    public void shouldReturnOkIfAttributeWithRightTypeExistsWithComplexStructure() {
        given(webServiceConnector.getBody()).willReturn("{\"awesome_field\": {\"foo\": \"Fooooobar.\","
                + "\"other\": [\"Lorem Ipsum.\", \"Hello World!\"]}}");
        c.setAttribute("awesome_field.foo");

        ExecuteResult result = c.executeAction(connectors);
        assertTrue(result.isSuccess());
    }

    @Test
    public void shouldReturnFailedIfAttributeWithWrongTypeExists() {
        given(webServiceConnector.getBody()).willReturn("{\"awesome_field\": true}");

        ExecuteResult result = c.executeAction(connectors);
        assertFalse(result.isSuccess());
    }

    @Test
    public void shouldReturnFailedIfAttributeDoesNotExist() {
        given(webServiceConnector.getBody()).willReturn("{\"not_so_awesome_field\": \"Lorem Ipsum. Hello World! Fooooobar\"}");

        ExecuteResult result = c.executeAction(connectors);
        assertFalse(result.isSuccess());
    }

}
