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

package de.learnlib.alex.data.entities.actions.rest;

import com.fasterxml.jackson.databind.ObjectMapper;
import de.learnlib.alex.data.entities.ExecuteResult;
import de.learnlib.alex.data.entities.Symbol;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnitRunner;

import java.io.File;
import java.io.IOException;
import java.net.URISyntaxException;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;
import static org.mockito.BDDMockito.given;

@RunWith(MockitoJUnitRunner.class)
public class CheckAttributeValueActionTest extends RestActionTest {

    @Mock
    private Symbol symbol;

    private CheckAttributeValueAction c;

    @Before
    public void setUp() {
        super.setUp();

        c = new CheckAttributeValueAction();
        c.setSymbol(symbol);
        c.setAttribute("awesome_field");
        c.setValue("Hello World!");
        c.setRegexp(false);
    }

    @Test
    public void testJSON() throws IOException {
        ObjectMapper mapper = new ObjectMapper();
        String json = mapper.writeValueAsString(c);
        CheckAttributeValueAction c2 = mapper.readValue(json, CheckAttributeValueAction.class);

        assertEquals(c.getAttribute(), c2.getAttribute());
        assertEquals(c.getValue(), c2.getValue());
        assertEquals(c.isRegexp(), c2.isRegexp());
    }

    @Test
    public void testJSONFile() throws IOException, URISyntaxException {
        ObjectMapper mapper = new ObjectMapper();

        String path = "/actions/restsymbolactions/CheckAttributeValueTestData.json";
        File file = new File(getClass().getResource(path).toURI());
        RESTSymbolAction obj = mapper.readValue(file, RESTSymbolAction.class);

        assertTrue(obj instanceof CheckAttributeValueAction);
        CheckAttributeValueAction objAsAction = (CheckAttributeValueAction) obj;
        assertEquals("object.attribute", objAsAction.getAttribute());
        assertEquals("FooBar Lorem", objAsAction.getValue());
        assertEquals(true, objAsAction.isRegexp());
    }

    @Test
    public void shouldReturnOkIfPathExistsOnJsonArray() throws Exception {
        CheckAttributeValueAction action = new CheckAttributeValueAction();
        action.setSymbol(symbol);
        action.setAttribute("[0].id");
        action.setValue("0");
        action.setRegexp(false);

        given(webServiceConnector.getBody()).willReturn("[{\"id\": 0}]");

        ExecuteResult result = action.executeAction(connectors);
        assertTrue(result.isSuccess());
    }

    @Test
    public void shouldReturnNullIfThePathIsInvalidOnJsonArray() throws Exception {
        CheckAttributeValueAction action = new CheckAttributeValueAction();
        action.setSymbol(symbol);
        action.setAttribute("[0].id");
        action.setValue("0");
        action.setRegexp(false);

        given(webServiceConnector.getBody()).willReturn("[{\"id\": 6}]");

        ExecuteResult result = action.executeAction(connectors);
        assertFalse(result.isSuccess());
    }

    @Test
    public void shouldReturnOkIfAttributeWithRightValueExists() {
        given(webServiceConnector.getBody()).willReturn("{\"awesome_field\": \"Hello World!\"}");

        ExecuteResult result = c.executeAction(connectors);
        assertTrue(result.isSuccess());
    }

    @Test
    public void shouldReturnOkIfAttributeWithRightValueExistsWithComplexStructure() {
        given(webServiceConnector.getBody()).willReturn("{\"awesome_field\": {\"foo\": \"Hello World!\","
                + "\"other\": [\"Lorem Ipsum.\", \"Fooooobar.\"]}}");
        c.setAttribute("awesome_field.foo");

        ExecuteResult result = c.executeAction(connectors);
        assertTrue(result.isSuccess());
    }

    @Test
    public void shouldReturnFailedIfAttributeWithWrongValueExists() {
        given(webServiceConnector.getBody()).willReturn("{\"awesome_field\": \"Lorem Ipsum!\"}");

        ExecuteResult result = c.executeAction(connectors);
        assertFalse(result.isSuccess());
    }

    @Test
    public void shouldReturnFailedIfAttributeDoesNotExist() {
        given(webServiceConnector.getBody()).willReturn("{\"not_so_awesome_field\": \"Lorem Ipsum. Hello World! Fooooobar\"}");

        ExecuteResult result = c.executeAction(connectors);
        assertFalse(result.isSuccess());
    }

    @Test
    public void shouldReturnFailedIfJSONIsEmpty() {
        given(webServiceConnector.getBody()).willReturn("");

        ExecuteResult result = c.executeAction(connectors);
        assertFalse(result.isSuccess());
    }

    @Test
    public void shouldReturnOKIfTextWasFoundWithRegexp() {
        c.setValue("F[oO]+ B[a]+r");
        c.setRegexp(true);
        given(webServiceConnector.getBody()).willReturn("{\"awesome_field\": \"FoO Baaaaar\"}");

        assertTrue(c.executeAction(connectors).isSuccess());
    }

    @Test
    public void shouldReturnFailedIfTextWasNotFoundWithRegexp() {
        c.setValue("F[oO]+ B[a]+r");
        c.setRegexp(true);
        given(webServiceConnector.getBody()).willReturn("{\"awesome_field\": \"F Bar\"}");

        assertFalse(c.executeAction(connectors).isSuccess());
    }

}
