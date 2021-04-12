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

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;

import com.fasterxml.jackson.databind.ObjectMapper;
import de.learnlib.alex.data.entities.Project;
import de.learnlib.alex.data.entities.Symbol;
import de.learnlib.alex.data.entities.WebElementLocator;
import java.io.File;
import java.io.IOException;
import java.net.URISyntaxException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.openqa.selenium.NoSuchElementException;
import org.openqa.selenium.WebElement;

@ExtendWith(MockitoExtension.class)
public class ClickActionTest extends WebActionTest {

    private ClickAction c;

    private WebElementLocator node;

    @BeforeEach
    public void setUp() {
        super.setUp();

        Symbol symbol = new Symbol();
        symbol.setProject(new Project(1L));

        node = new WebElementLocator();
        node.setSelector("#node");
        node.setType(WebElementLocator.Type.CSS);

        c = new ClickAction();
        c.setSymbol(symbol);
        c.setNode(node);
        c.setDoubleClick(false);
    }

    @Test
    public void testJSON() throws IOException {
        ObjectMapper mapper = new ObjectMapper();
        String json = mapper.writeValueAsString(c);
        ClickAction c2 = mapper.readValue(json, ClickAction.class);

        assertEquals(c.getNode(), c2.getNode());
        assertEquals(c.isDoubleClick(), c2.isDoubleClick());
    }

    @Test
    public void testJSONWithLongNode() throws IOException {
        c.getNode().setSelector("#superlong > css trace .with-absolute ~no_meaning .at-all > .1234567890 > .1234567890 "
                + "> .1234567890"
                + " > .1234567890 > .1234567890 > .1234567890 > .1234567890 > .1234567890 > .1234567890"
                + " > .1234567890 > .1234567890 > .1234567890");
        ObjectMapper mapper = new ObjectMapper();
        String json = mapper.writeValueAsString(c);
        ClickAction c2 = mapper.readValue(json, ClickAction.class);

        assertEquals(c.getNode(), c2.getNode());
        assertEquals(c.isDoubleClick(), c2.isDoubleClick());
    }

    @Test
    public void testJSONFile() throws IOException, URISyntaxException {
        ObjectMapper mapper = new ObjectMapper();

        File file = new File(getClass().getResource("/actions/websymbolactions/ClickTestData.json").toURI());
        WebSymbolAction obj = mapper.readValue(file, WebSymbolAction.class);

        assertTrue(obj instanceof ClickAction);
        ClickAction objAsAction = (ClickAction) obj;
        assertEquals(node, objAsAction.getNode());
    }

    @Test
    public void shouldReturnOKIfNodeCouldBeClicked() {
        WebElement element = mock(WebElement.class);
        given(webSiteConnector.getElement(node)).willReturn(element);

        assertTrue(c.executeAction(connectors).isSuccess());
        verify(element).click();
    }

    @Test
    public void shouldReturnFailedIfNodeCouldNotBeClicked() {
        given(webSiteConnector.getElement(node)).willThrow(new NoSuchElementException(""));

        assertFalse(c.executeAction(connectors).isSuccess());
    }
}
