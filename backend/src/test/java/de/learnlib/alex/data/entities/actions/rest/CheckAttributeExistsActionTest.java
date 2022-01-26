/*
 * Copyright 2015 - 2022 TU Dortmund
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

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.BDDMockito.given;

import com.fasterxml.jackson.databind.ObjectMapper;
import de.learnlib.alex.data.entities.ExecuteResult;
import de.learnlib.alex.data.entities.Symbol;
import java.io.File;
import java.io.IOException;
import java.net.URISyntaxException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
public class CheckAttributeExistsActionTest extends RestActionTest {

    @Mock
    private Symbol symbol;

    private CheckAttributeExistsAction c;

    @BeforeEach
    public void setUp() {
        super.setUp();

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
        given(webServiceConnector.getBody()).willReturn("{\"awesome_field\": \"Lorem Ipsum. Hello World! Fooooobar\"}");

        ExecuteResult result = c.executeAction(connectors);

        assertTrue(result.isSuccess());
    }

    @Test
    public void shouldReturnOkIfAttributeExistsWithComplexStructure() {
        given(webServiceConnector.getBody()).willReturn("{\"awesome_field\": {\"foo\": \"Fooooobar.\","
                + "\"other\": [\"Lorem Ipsum.\", \"Hello World!\"]}}");
        c.setAttribute("awesome_field.foo");

        ExecuteResult result = c.executeAction(connectors);

        assertTrue(result.isSuccess());
    }

    @Test
    public void shouldReturnFailedIfAttributeDoesNotExists() {
        given(webServiceConnector.getBody()).willReturn("{\"not_so_awesome_field\": \"Lorem Ipsum. Hello World! Fooooobar\"}");

        ExecuteResult result = c.executeAction(connectors);

        assertFalse(result.isSuccess());
    }

}
