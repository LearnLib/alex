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

package de.learnlib.alex.data.entities.actions.WebSymbolActions;

import com.fasterxml.jackson.databind.ObjectMapper;
import de.learnlib.alex.data.entities.Symbol;
import de.learnlib.alex.data.entities.SymbolAction;
import de.learnlib.alex.data.entities.WebElementLocator;
import de.learnlib.alex.learning.services.connectors.WebSiteConnector;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.junit.MockitoJUnitRunner;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

import java.io.File;
import java.io.IOException;
import java.net.URISyntaxException;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.mock;

@RunWith(MockitoJUnitRunner.class)
public class CheckTextWebActionTest {

    private CheckTextWebAction checkText;

    private final WebSiteConnector connector = mock(WebSiteConnector.class);
    private final WebDriver driver = mock(WebDriver.class);

    private final String document = "\n" +
            "<!DOCTYPE html>\n" +
            "<html>\n" +
            "<head>\n" +
            "</head>\n" +
            "<body>\n" +
            "<div id=\"foo\">foo</div>\n"+
            "<div id=\"bar\">bar</div>\n"+
            "</body>\n" +
            "</html>";

    @Before
    public void setUp() {
        Symbol symbol = new Symbol();

        checkText = new CheckTextWebAction();
        checkText.setSymbol(symbol);
        checkText.setValue("Foobar");
        checkText.setRegexp(false);
        checkText.setNode(new WebElementLocator("document", WebElementLocator.Type.CSS));

        given(connector.getDriver()).willReturn(driver);
    }

    @Test
    public void testJSON() throws IOException {
        ObjectMapper mapper = new ObjectMapper();
        String json = mapper.writeValueAsString(checkText);
        CheckTextWebAction c2 = (CheckTextWebAction) mapper.readValue(json, SymbolAction.class);

        assertEquals(checkText.getValue(), c2.getValue());
    }

    @Test
    public void testJSONFile() throws IOException, URISyntaxException {
        ObjectMapper mapper = new ObjectMapper();

        File file = new File(getClass().getResource("/actions/websymbolactions/CheckTextTestData.json").toURI());
        SymbolAction obj = mapper.readValue(file, SymbolAction.class);

        assertTrue(obj instanceof CheckTextWebAction);
        CheckTextWebAction c = (CheckTextWebAction) obj;
        assertEquals("Lorem Ipsum", c.getValue());
    }

    @Test
    public void shouldReturnOKIfTextWasFoundWithoutRegexp() {
        given(driver.getPageSource()).willReturn(checkText.getValue());

        assertTrue(checkText.execute(connector).isSuccess());
    }

    @Test
    public void shouldReturnFaliedIfTextWasNotFoundWithoutRegexp() {
        given(driver.getPageSource()).willReturn("");

        assertFalse(checkText.execute(connector).isSuccess());
    }

    @Test
    public void shouldReturnOKIfTextWasFoundWithRegexp() {
        checkText.setValue("F[oO]+ B[a]+r");
        checkText.setRegexp(true);

        given(driver.getPageSource()).willReturn("FoO Baaaaar");

        assertTrue(checkText.execute(connector).isSuccess());
    }

    @Test
    public void shouldReturnFailedIfTextWasNotFoundWithRegexp() {
        checkText.setValue("F[oO]+ B[a]+r");
        checkText.setRegexp(true);

        given(driver.getPageSource()).willReturn("F BAr");

        assertFalse(checkText.execute(connector).isSuccess());
    }

    @Test
    public void shouldOnlyLookForTextInTheCorrectElement() {
        WebElement fooElement = mock(WebElement.class);
        given(fooElement.getAttribute("innerHTML")).willReturn("foo");

        WebElement barElement = mock(WebElement.class);
        given(barElement.getAttribute("innerHTML")).willReturn("bar");

        given(driver.getPageSource()).willReturn(document);
        given(driver.findElement(By.cssSelector("#foo"))).willReturn(fooElement);
        given(driver.findElement(By.cssSelector("#bar"))).willReturn(barElement);

        checkText.setValue("foo");
        checkText.getNode().setSelector("#foo");

        assertTrue(checkText.execute(connector).isSuccess());

        checkText.getNode().setSelector("#bar");

        assertFalse(checkText.execute(connector).isSuccess());
    }
}
