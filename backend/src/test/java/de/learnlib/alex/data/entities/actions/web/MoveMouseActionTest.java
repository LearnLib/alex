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
import de.learnlib.alex.data.entities.WebElementLocator;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.junit.MockitoJUnitRunner;
import org.openqa.selenium.NoSuchElementException;
import org.openqa.selenium.WebDriver;

import java.io.File;
import java.io.IOException;
import java.net.URISyntaxException;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

@RunWith(MockitoJUnitRunner.class)
public class MoveMouseActionTest extends WebActionTest {

    private MoveMouseAction c;

    private WebElementLocator node;

    @Before
    public void setUp() {
        super.setUp();

        Symbol symbol = new Symbol();

        node = new WebElementLocator();
        node.setSelector("#node");
        node.setType(WebElementLocator.Type.CSS);

        c = new MoveMouseAction();
        c.setSymbol(symbol);
        c.setNode(node);
        c.setOffsetX(0);
        c.setOffsetY(0);
    }

    @Test
    public void testJSON() throws IOException {
        ObjectMapper mapper = new ObjectMapper();
        String json = mapper.writeValueAsString(c);
        MoveMouseAction c2 = mapper.readValue(json, MoveMouseAction.class);

        assertEquals(c.getNode(), c2.getNode());
        assertEquals(c.getOffsetX(), c2.getOffsetX());
        assertEquals(c.getOffsetY(), c2.getOffsetY());
    }

    @Test
    public void testJSONFile() throws IOException, URISyntaxException {
        ObjectMapper mapper = new ObjectMapper();

        File file = new File(getClass().getResource("/actions/websymbolactions/MoveMouseTestData.json").toURI());
        WebSymbolAction obj = mapper.readValue(file, WebSymbolAction.class);

        assertTrue(obj instanceof MoveMouseAction);
        MoveMouseAction objAsAction = (MoveMouseAction) obj;
        assertEquals(node, objAsAction.getNode());
        assertEquals(0, objAsAction.getOffsetX());
        assertEquals(0, objAsAction.getOffsetY());
    }

    @Test
    public void shouldReturnFAILEDIfNodeCouldNotBeClicked() {
        when(webSiteConnector.getDriver()).thenReturn(mock(WebDriver.class));
        when(webSiteConnector.getElement(node)).thenThrow(new NoSuchElementException(""));

        assertFalse(c.executeAction(connectors).isSuccess());
    }
}
