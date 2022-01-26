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

package de.learnlib.alex.data.entities.actions.web;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.fasterxml.jackson.databind.ObjectMapper;
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
public class SubmitActionTest extends WebActionTest {

    private SubmitAction s;

    private WebElementLocator node;

    @BeforeEach
    public void setUp() {
        super.setUp();

        Symbol symbol = new Symbol();

        node = new WebElementLocator();
        node.setSelector("#node");
        node.setType(WebElementLocator.Type.CSS);

        s = new SubmitAction();
        s.setSymbol(symbol);
        s.setNode(node);
    }

    @Test
    public void testJSON() throws IOException {
        ObjectMapper mapper = new ObjectMapper();
        String json = mapper.writeValueAsString(s);
        SubmitAction s2 = mapper.readValue(json, SubmitAction.class);

        assertEquals(s.getNode(), s2.getNode());
    }

    @Test
    public void testJSONFile() throws IOException, URISyntaxException {
        ObjectMapper mapper = new ObjectMapper();

        File file = new File(getClass().getResource("/actions/websymbolactions/SubmitTestData.json").toURI());
        WebSymbolAction obj = mapper.readValue(file, WebSymbolAction.class);

        assertTrue(obj instanceof SubmitAction);
        SubmitAction objAsAction = (SubmitAction) obj;
        assertEquals(node, objAsAction.getNode());
    }

    @Test
    public void shouldReturnOKIfNodeCouldBeSubmitted() {
        WebElement element = mock(WebElement.class);
        given(webSiteConnector.getElement(node)).willReturn(element);

        assertTrue(s.executeAction(connectors).isSuccess());
        verify(element).submit();
    }

    @Test
    public void shouldReturnFailedIfNodeCouldNotBeSubmitted() {
        when(webSiteConnector.getElement(node)).thenThrow(new NoSuchElementException(""));

        assertFalse(s.executeAction(connectors).isSuccess());
    }
}
