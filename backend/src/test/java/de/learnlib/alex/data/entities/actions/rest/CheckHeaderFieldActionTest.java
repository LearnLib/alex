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

import javax.ws.rs.core.MultivaluedHashMap;
import java.io.File;
import java.io.IOException;
import java.net.URISyntaxException;
import java.util.LinkedList;
import java.util.List;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.mock;

@RunWith(MockitoJUnitRunner.class)
public class CheckHeaderFieldActionTest extends RestActionTest {

    @Mock
    private Symbol symbol;

    private CheckHeaderFieldAction c;

    @Before
    public void setUp() {
        super.setUp();

        c = new CheckHeaderFieldAction();
        c.setSymbol(symbol);
        c.setKey("Accept");
        c.setValue("text/html");
        c.setRegexp(false);
    }

    @Test
    public void testJSON() throws IOException {
        ObjectMapper mapper = new ObjectMapper();
        String json = mapper.writeValueAsString(c);
        CheckHeaderFieldAction c2 = mapper.readValue(json, CheckHeaderFieldAction.class);

        assertEquals(c.getKey(), c2.getKey());
        assertEquals(c.getValue(), c2.getValue());
        assertEquals(c.isRegexp(), c2.isRegexp());
    }

    @Test
    public void testJSONFile() throws IOException, URISyntaxException {
        ObjectMapper mapper = new ObjectMapper();

        String path = "/actions/restsymbolactions/CheckHeaderFieldTestData.json";
        File file = new File(getClass().getResource(path).toURI());
        RESTSymbolAction obj = mapper.readValue(file, RESTSymbolAction.class);

        assertTrue(obj instanceof CheckHeaderFieldAction);
        CheckHeaderFieldAction objAsAction = (CheckHeaderFieldAction) obj;
        assertEquals("Key", objAsAction.getKey());
        assertEquals("Value", objAsAction.getValue());
        assertEquals(true, objAsAction.isRegexp());
    }

    @Test
    public void shouldReturnOkIfHeaderFieldWithTheValueExists() {
        MultivaluedHashMap<String, Object> headers = createHeaders("text/html", "application/xhtml+xml");
        given(webServiceConnector.getHeaders()).willReturn(headers);

        ExecuteResult result = c.executeAction(connectors);

        assertTrue(result.isSuccess());
    }

    @Test
    public void shouldReturnFailedIfHeaderFieldWithoutValue() {
        MultivaluedHashMap<String, Object> headers = createHeaders("application/xhtml+xml");
        given(webServiceConnector.getHeaders()).willReturn(headers);

        ExecuteResult result = c.executeAction(connectors);

        assertFalse(result.isSuccess());
    }

    @Test
    public void shouldReturnFailedIfHeaderFieldDoesNotExists() {
        MultivaluedHashMap<String, Object> headers = mock(MultivaluedHashMap.class);
        given(webServiceConnector.getHeaders()).willReturn(headers);

        ExecuteResult result = c.executeAction(connectors);
        assertFalse(result.isSuccess());
    }

    @Test
    public void shouldReturnOKIfTextWasFoundWithRegexp() {
        c.setValue("F[oO]+ B[a]+r");
        c.setRegexp(true);
        MultivaluedHashMap<String, Object> headers = createHeaders("text/html", "FoO Baaaaar", "application/xhtml+xml");
        given(webServiceConnector.getHeaders()).willReturn(headers);

        assertTrue(c.executeAction(connectors).isSuccess());
    }

    @Test
    public void shouldReturnFailedIfTextWasNotFoundWithRegexp() {
        c.setValue("F[oO]+ B[a]+r");
        c.setRegexp(true);
        MultivaluedHashMap<String, Object> headers = createHeaders("text/html", "F BAr", "application/xhtml+xml");
        given(webServiceConnector.getHeaders()).willReturn(headers);

        assertFalse(c.executeAction(connectors).isSuccess());
    }

    private MultivaluedHashMap<String, Object> createHeaders(String... data) {
        MultivaluedHashMap<String, Object> headers = mock(MultivaluedHashMap.class);
        List<Object> values = new LinkedList<>();
        for (String d : data) {
            values.add(d);
        }
        given(headers.get("Accept")).willReturn(values);
        return headers;
    }

}
