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

package de.learnlib.alex.data.entities.actions.misc;

import com.fasterxml.jackson.databind.ObjectMapper;
import de.learnlib.alex.data.entities.actions.misc.WaitAction;
import de.learnlib.alex.data.entities.actions.web.WebSymbolAction;
import de.learnlib.alex.learning.services.connectors.WebSiteConnector;
import org.junit.Before;
import org.junit.Test;

import java.io.File;
import java.io.IOException;
import java.net.URISyntaxException;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;
import static org.mockito.Mockito.mock;

public class WaitActionTest {

    private static final Long ONE_SECOND = 1000L;

    private WaitAction w;

    @Before
    public void setUp() {
        w = new WaitAction();
        w.setDuration(ONE_SECOND);
    }

    @Test
    public void testJSON() throws IOException {
        ObjectMapper mapper = new ObjectMapper();
        String json = mapper.writeValueAsString(w);
        WaitAction w2 = mapper.readValue(json, WaitAction.class);

        assertEquals(w.getDuration(), w2.getDuration());
    }

    @Test
    public void testJSONFile() throws IOException, URISyntaxException {
        ObjectMapper mapper = new ObjectMapper();

        File file = new File(getClass().getResource("/actions/WaitTestData.json").toURI());
        WebSymbolAction obj = mapper.readValue(file, WebSymbolAction.class);

        assertTrue(obj instanceof WaitAction);
        WaitAction objAsAction = (WaitAction) obj;
        assertEquals(ONE_SECOND, objAsAction.getDuration());
    }

    @Test
    public void shouldReturnOKIfTimeIsUp() {
        WebSiteConnector connector = mock(WebSiteConnector.class);
        assertTrue(w.execute(connector).isSuccess());
    }

}
