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
import de.learnlib.alex.data.entities.SymbolAction;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnitRunner;

import java.io.File;
import java.io.IOException;
import java.net.URISyntaxException;
import java.util.HashMap;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anySet;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;

@RunWith(MockitoJUnitRunner.class)
public class CallActionTest extends RestActionTest {

    private static final String TEST_BASE_URL = "http://example.com/api";
    private static final String TEST_API_PATH = "/test";

    @Mock
    private Symbol symbol;

    private CallAction c;

    @Before
    public void setUp() {
        super.setUp();

        c = new CallAction();
        c.setSymbol(symbol);
        c.setMethod(CallAction.Method.GET);
        c.setUrl(TEST_API_PATH);
        HashMap<String, String> cookies = new HashMap<>();
        cookies.put("cookie", "Lorem Ipsum");
        c.setCookies(cookies);
        c.setData("{}");
    }

    @Test
    public void testJSON() throws IOException {
        ObjectMapper mapper = new ObjectMapper();
        String json = mapper.writeValueAsString(c);
        CallAction c2 = mapper.readValue(json, CallAction.class);

        assertEquals(c.getMethod(), c2.getMethod());
        assertEquals(c.getUrl(), c2.getUrl());
        assertEquals(c.getData(), c2.getData());
    }

    @Test
    public void testJSONFile() throws IOException, URISyntaxException {
        ObjectMapper mapper = new ObjectMapper();

        File file = new File(getClass().getResource("/actions/restsymbolactions/CallActionTestData.json").toURI());
        SymbolAction obj = mapper.readValue(file, SymbolAction.class);

        assertTrue(obj instanceof CallAction);
        CallAction objAsAction = (CallAction) obj;
        assertEquals(CallAction.Method.GET, objAsAction.getMethod());
        assertEquals(TEST_BASE_URL, objAsAction.getUrl());
        assertEquals(1, objAsAction.getHeaders().size()); // assert header
        assertEquals("Foobar, Bar", objAsAction.getHeaders().get("X-MyHeader"));
        assertEquals(c.getCookies().size(), objAsAction.getCookies().size()); // assert cookies
        assertEquals(c.getCookies().get("cookie"), objAsAction.getCookies().get("cookie"));
        assertEquals("{}", objAsAction.getData());
    }

    @Test
    public void shouldDoAValidGetCall() {
        ExecuteResult result = c.executeAction(connectors);

        assertTrue(result.isSuccess());
        verify(webServiceConnector).get(eq(TEST_API_PATH), any(), anySet());
    }

    @Test
    public void shouldDoAValidPostCall() {
        c.setMethod(CallAction.Method.POST);

        ExecuteResult result = c.executeAction(connectors);

        assertTrue(result.isSuccess());
        verify(webServiceConnector).post(eq(TEST_API_PATH), any(), anySet(), eq("{}"));
    }

    @Test
    public void shouldDoAValidPutCall() {
        c.setMethod(CallAction.Method.PUT);

        ExecuteResult result = c.executeAction(connectors);

        assertTrue(result.isSuccess());
        verify(webServiceConnector).put(eq(TEST_API_PATH), any(), anySet(), eq("{}"));
    }

    @Test
    public void shouldDoAValidDeleteCall() {
        c.setMethod(CallAction.Method.DELETE);

        ExecuteResult result = c.executeAction(connectors);

        assertTrue(result.isSuccess());
        verify(webServiceConnector).delete(eq(TEST_API_PATH), any(), anySet());
    }

}
