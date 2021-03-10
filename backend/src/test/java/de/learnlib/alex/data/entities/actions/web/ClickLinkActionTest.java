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

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;
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
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.junit.MockitoJUnitRunner;
import org.openqa.selenium.By;
import org.openqa.selenium.NoSuchElementException;
import org.openqa.selenium.WebElement;

@RunWith(MockitoJUnitRunner.class)
public class ClickLinkActionTest extends WebActionTest {

    private ClickLinkAction action;

    @Before
    public void setUp() {
        super.setUp();

        Symbol symbol = new Symbol();

        action = new ClickLinkAction();
        action.setSymbol(symbol);
        action.setValue("Click Me");
        action.setNode(new WebElementLocator("body", WebElementLocator.Type.CSS));
    }

    @Test
    public void testJSON() throws IOException {
        ObjectMapper mapper = new ObjectMapper();
        String json = mapper.writeValueAsString(action);
        ClickLinkAction c2 = mapper.readValue(json, ClickLinkAction.class);

        assertEquals(action.getValue(), c2.getValue());
    }

    @Test
    public void testJSONFile() throws IOException, URISyntaxException {
        ObjectMapper mapper = new ObjectMapper();

        File file = new File(getClass().getResource("/actions/websymbolactions/ClickLinkTestData.json").toURI());
        WebSymbolAction obj = mapper.readValue(file, WebSymbolAction.class);

        assertTrue(obj instanceof ClickLinkAction);
        ClickLinkAction objAsAction = (ClickLinkAction) obj;
        assertEquals("Click Me", objAsAction.getValue());
    }

    @Test
    public void shouldReturnOKIfLinkCouldBeClicked() {
        WebElement body = mock(WebElement.class);
        WebElement fooLink = mock(WebElement.class);

        given(webSiteConnector.getElement(action.getNode())).willReturn(body);
        given(body.findElement(By.linkText(action.getValue()))).willReturn(fooLink);

        assertTrue(action.executeAction(connectors).isSuccess());
        verify(fooLink).click();
    }

    @Test
    public void shouldReturnFailedIfLinkCouldNotBeClicked() {
        WebElement body = mock(WebElement.class);

        given(webSiteConnector.getElement(action.getNode())).willReturn(body);

        when(body.findElement(By.linkText("Click Me"))).thenThrow(new NoSuchElementException(""));

        assertFalse(action.executeAction(connectors).isSuccess());
    }

}
