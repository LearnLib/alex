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

package de.learnlib.alex.core.learner;

import de.learnlib.alex.core.learner.connectors.WebServiceConnector;
import org.junit.Before;
import org.junit.Test;

import javax.ws.rs.client.Entity;
import javax.ws.rs.client.Invocation;
import javax.ws.rs.client.WebTarget;
import javax.ws.rs.core.Cookie;
import javax.ws.rs.core.Response;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;

import static org.junit.Assert.assertEquals;
import static org.mockito.BDDMockito.given;
import static org.mockito.Matchers.any;
import static org.mockito.Matchers.anyString;
import static org.mockito.Mockito.atLeast;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;

public class WebServiceConnectorTest {

    private static final String FAKE_URL = "http://example.com/";
    private static final String RESET_URL = "/";
    private static final int OK_STATUS = 200;
    private static final String FAKE_MESSAGE = "{}";

    private Map<String, String> requestHeaders;
    private HashSet<Cookie> cookies;

    private Invocation.Builder builder;
    private WebServiceConnector connector;

    @Before
    public void setUp() {
        requestHeaders = new HashMap<>();
        requestHeaders.put("X-MyHeader", "Foobar");
        cookies = new HashSet<>();
        cookies.add(mock(Cookie.class));

        builder = mock(Invocation.Builder.class);
        WebTarget target = createWebTarget();
        connector = new WebServiceConnector(target, FAKE_URL, RESET_URL);
    }

    @Test
    public void shouldGetASiteAndRememberTheResponse() {
        connector.get("/", requestHeaders, cookies);

        verify(builder, atLeast(1)).get();
        assertEquals(OK_STATUS, connector.getStatus());
        assertEquals(null, connector.getHeaders());
        assertEquals("{}", connector.getBody());
    }

    @Test
    public void shouldPostToASiteAndRememberTheResponse() {
        connector.post("/", requestHeaders, cookies, FAKE_MESSAGE);

        verify(builder).post(Entity.json(FAKE_MESSAGE));
        assertEquals(OK_STATUS, connector.getStatus());
        assertEquals(null, connector.getHeaders());
        assertEquals(FAKE_MESSAGE, connector.getBody());
    }

    @Test
    public void shouldPutToASiteAndRememberTheResponse() {
        connector.put("/", requestHeaders, cookies, FAKE_MESSAGE);

        verify(builder).put(Entity.json(FAKE_MESSAGE));
        assertEquals(OK_STATUS, connector.getStatus());
        assertEquals(null, connector.getHeaders());
        assertEquals(FAKE_MESSAGE, connector.getBody());
    }


    @Test
    public void shouldDeleteToASiteAndRememberTheResponse() {
        connector.delete("/", requestHeaders, cookies);

        verify(builder).delete();
        assertEquals(OK_STATUS, connector.getStatus());
        assertEquals(null, connector.getHeaders());
        assertEquals(FAKE_MESSAGE, connector.getBody());
    }

    @Test(expected = IllegalStateException.class)
    public void shouldThrowAnExceptionWhenThereIsNoStatus() {
        connector.getStatus();
    }

    @Test(expected = IllegalStateException.class)
    public void shouldThrowAnExceptionWhenThereIsNoHead() {
        connector.getHeaders();
    }

    @Test(expected = IllegalStateException.class)
    public void shouldThrowAnExceptionWhenThereIsNoBody() {
        connector.getBody();
    }

    private WebTarget createWebTarget() {
        Response response = createResponse();
        Invocation.Builder headerBuilder = mock(Invocation.Builder.class);
        Invocation.Builder cookieBuilder = mock(Invocation.Builder.class);
        WebTarget subTarget = mock(WebTarget.class);
        WebTarget target = mock(WebTarget.class);

        given(builder.get()).willReturn(response);
        given(builder.post(Entity.json(FAKE_MESSAGE))).willReturn(response);
        given(builder.put(Entity.json(FAKE_MESSAGE))).willReturn(response);
        given(builder.delete()).willReturn(response);

        given(cookieBuilder.cookie(any(Cookie.class))).willReturn(builder);
        given(headerBuilder.header(anyString(), anyString())).willReturn(cookieBuilder);
        given(subTarget.request()).willReturn(headerBuilder);
        given(target.path(FAKE_URL)).willReturn(subTarget);
        given(target.path("/")).willReturn(subTarget);

        return target;
    }

    private Response createResponse() {
        Response response = mock(Response.class);
        given(response.getStatus()).willReturn(OK_STATUS);
        given(response.getHeaders()).willReturn(null);
        given(response.readEntity(String.class)).willReturn("{}");

        return response;
    }

}
