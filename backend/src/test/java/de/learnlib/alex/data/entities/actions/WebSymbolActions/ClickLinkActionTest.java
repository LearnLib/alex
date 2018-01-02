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

package de.learnlib.alex.data.entities.actions.WebSymbolActions;

import com.fasterxml.jackson.databind.ObjectMapper;
import de.learnlib.alex.data.entities.ExecuteResult;
import de.learnlib.alex.data.entities.Symbol;
import de.learnlib.alex.data.entities.WebElementLocator;
import de.learnlib.alex.learning.services.connectors.WebSiteConnector;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.junit.MockitoJUnitRunner;
import org.openqa.selenium.By;
import org.openqa.selenium.NoSuchElementException;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

import java.io.File;
import java.io.IOException;
import java.net.URISyntaxException;

import static de.learnlib.alex.data.entities.ExecuteResult.OK;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@RunWith(MockitoJUnitRunner.class)
public class ClickLinkActionTest {

    private ClickLinkAction c;

    private final WebSiteConnector connector = mock(WebSiteConnector.class);
    private final WebDriver driver = mock(WebDriver.class);

    @Before
    public void setUp() {
        Symbol symbol = new Symbol();

        c = new ClickLinkAction();
        c.setSymbol(symbol);
        c.setValue("Click Me");
        c.setNode(new WebElementLocator("body", WebElementLocator.Type.CSS));

        given(connector.getDriver()).willReturn(driver);
    }

    @Test
    public void testJSON() throws IOException {
        ObjectMapper mapper = new ObjectMapper();
        String json = mapper.writeValueAsString(c);
        ClickLinkAction c2 = mapper.readValue(json, ClickLinkAction.class);

        assertEquals(c.getValue(), c2.getValue());
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

        given(driver.findElement(c.getNode().getBy())).willReturn(body);
        given(body.findElement(By.linkText(c.getValue()))).willReturn(fooLink);

        assertEquals(OK, c.execute(connector));
        verify(fooLink).click();
    }

    @Test
    public void shouldReturnFailedIfLinkCouldNotBeClicked() {
        WebElement body = mock(WebElement.class);

        given(driver.findElement(c.getNode().getBy())).willReturn(body);

        when(body.findElement(By.linkText("Click Me"))).thenThrow(new NoSuchElementException(""));

        assertEquals(ExecuteResult.FAILED, c.execute(connector));
    }

}
