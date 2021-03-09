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

package de.learnlib.alex.data.entities.actions.web;

import com.fasterxml.jackson.databind.ObjectMapper;
import de.learnlib.alex.data.entities.Symbol;
import de.learnlib.alex.data.entities.actions.Credentials;
import java.io.File;
import java.io.IOException;
import java.net.URISyntaxException;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.junit.MockitoJUnitRunner;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.BDDMockito.willThrow;
import static org.mockito.Mockito.verify;

@RunWith(MockitoJUnitRunner.class)
public class GotoActionTest extends WebActionTest {

    private static final String BASE_URL = "Base";
    private static final String FAKE_URL = "http://example.com";

    private GotoAction g;

    @Before
    public void setUp() {
        super.setUp();

        Symbol symbol = new Symbol();

        g = new GotoAction();
        g.setSymbol(symbol);
        g.setUrl(FAKE_URL);
        g.setBaseUrl(BASE_URL);
    }

    @Test
    public void testJSON() throws IOException {
        ObjectMapper mapper = new ObjectMapper();
        String json = mapper.writeValueAsString(g);
        GotoAction c2 = mapper.readValue(json, GotoAction.class);

        assertEquals(g.getUrl(), c2.getUrl());
    }

    @Test
    public void testJSONFile() throws IOException, URISyntaxException {
        ObjectMapper mapper = new ObjectMapper();

        File file = new File(getClass().getResource("/actions/websymbolactions/GotoTestData.json").toURI());
        WebSymbolAction obj = mapper.readValue(file, WebSymbolAction.class);

        assertTrue(obj instanceof GotoAction);
        GotoAction objAsAction = (GotoAction) obj;
        assertEquals("http://example.com", objAsAction.getUrl());
    }

    @Test
    public void shouldReturnOKIfTheUrlCouldBeFound() throws Exception {
        assertTrue(g.executeAction(connectors).isSuccess());
        verify(webSiteConnector).get(eq(BASE_URL), eq(FAKE_URL), any(Credentials.class));
    }

    @Test
    public void shouldReturnFailedIfTheUrlCouldNotBeFound() throws Exception {
        willThrow(Exception.class).given(webSiteConnector).get(eq(BASE_URL), eq(FAKE_URL), any(Credentials.class));
        assertFalse(g.executeAction(connectors).isSuccess());
    }

}
