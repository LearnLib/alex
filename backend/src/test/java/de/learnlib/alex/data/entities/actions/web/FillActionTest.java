/*
 * Copyright 2015 - 2019 TU Dortmund
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
import org.openqa.selenium.WebElement;

import java.io.File;
import java.io.IOException;
import java.net.URISyntaxException;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@RunWith(MockitoJUnitRunner.class)
public class FillActionTest extends WebActionTest {

    private FillAction f;

    private WebElementLocator node;

    @Before
    public void setUp() {
        super.setUp();

        Symbol symbol = new Symbol();

        node = new WebElementLocator();
        node.setSelector("#node");
        node.setType(WebElementLocator.Type.CSS);

        f = new FillAction();
        f.setSymbol(symbol);
        f.setNode(node);
        f.setValue("Lorem Ipsum");
    }

    @Test
    public void testJSON() throws IOException {
        ObjectMapper mapper = new ObjectMapper();
        String json = mapper.writeValueAsString(f);
        FillAction f2 = mapper.readValue(json, FillAction.class);

        assertEquals(f.getNode(), f2.getNode());
    }

    @Test
    public void testJSONFile() throws IOException, URISyntaxException {
        ObjectMapper mapper = new ObjectMapper();

        File file = new File(getClass().getResource("/actions/websymbolactions/FillTestData.json").toURI());
        WebSymbolAction obj = mapper.readValue(file, WebSymbolAction.class);

        assertTrue(obj instanceof FillAction);
        FillAction objAsAction = (FillAction) obj;
        assertEquals("#input", objAsAction.getNode().getSelector());
        assertEquals("Lorem Ipsum", objAsAction.getValue());
    }

    @Test
    public void shouldReturnOKIfNodeCouldBeFilled() {
        WebElement element = mock(WebElement.class);
        given(webSiteConnector.getElement(node)).willReturn(element);

        assertTrue(f.executeAction(connectors).isSuccess());
        verify(element).sendKeys(f.getValue());
    }

    @Test
    public void shouldReturnFailedIfNodeCouldNotBeFilled() {
        when(webSiteConnector.getElement(node)).thenThrow(new NoSuchElementException(""));

        assertFalse(f.executeAction(connectors).isSuccess());
    }

}
