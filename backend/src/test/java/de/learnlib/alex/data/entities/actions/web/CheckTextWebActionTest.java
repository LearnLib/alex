/*
 * Copyright 2015 - 2020 TU Dortmund
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
import de.learnlib.alex.data.entities.Project;
import de.learnlib.alex.data.entities.Symbol;
import de.learnlib.alex.data.entities.SymbolAction;
import de.learnlib.alex.data.entities.WebElementLocator;
import de.learnlib.alex.learning.services.connectors.CounterStoreConnector;
import de.learnlib.alex.learning.services.connectors.VariableStoreConnector;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.junit.MockitoJUnitRunner;
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
public class CheckTextWebActionTest extends WebActionTest {

    private CheckTextWebAction checkText;

    private ObjectMapper mapper;

    @Before
    public void setUp() {
        super.setUp();
        mapper = new ObjectMapper();

        Symbol symbol = new Symbol();
        symbol.setProject(new Project(1L));

        checkText = new CheckTextWebAction();
        checkText.setSymbol(symbol);
        checkText.setValue("Foobar");
        checkText.setRegexp(false);
        checkText.setNode(new WebElementLocator("document", WebElementLocator.Type.CSS));

        given(connectors.getConnector(VariableStoreConnector.class)).willReturn(mock(VariableStoreConnector.class));
        given(connectors.getConnector(CounterStoreConnector.class)).willReturn(mock(CounterStoreConnector.class));
        given(webSiteConnector.getDriver()).willReturn(mock(WebDriver.class));
    }

    @Test
    public void testJSON() throws IOException {
        String json = mapper.writeValueAsString(checkText);
        CheckTextWebAction c2 = (CheckTextWebAction) mapper.readValue(json, SymbolAction.class);

        assertEquals(checkText.getValue(), c2.getValue());
    }

    @Test
    public void testJSONFile() throws IOException, URISyntaxException {
        File file = new File(getClass().getResource("/actions/websymbolactions/CheckTextTestData.json").toURI());
        SymbolAction obj = mapper.readValue(file, SymbolAction.class);

        assertTrue(obj instanceof CheckTextWebAction);
        CheckTextWebAction c = (CheckTextWebAction) obj;
        assertEquals("Lorem Ipsum", c.getValue());
    }

    @Test
    public void shouldEncodeHtmlCharsInValue() {
        given(webSiteConnector.getDriver().getPageSource()).willReturn(createHtmlDoc("<div>this is a $&amp; test</div>"));
        checkText.setValue("this is a $& test");

        assertTrue(checkText.executeAction(connectors).isSuccess());
    }

    @Test
    public void shouldReturnOKIfTextWasFoundWithoutRegexp() {
        given(webSiteConnector.getDriver().getPageSource()).willReturn(checkText.getValue());

        assertTrue(checkText.executeAction(connectors).isSuccess());
    }

    @Test
    public void shouldReturnFailedIfTextWasNotFoundWithoutRegexp() {
        given(webSiteConnector.getDriver().getPageSource()).willReturn("");

        assertFalse(checkText.executeAction(connectors).isSuccess());
    }

    @Test
    public void shouldReturnOKIfTextWasFoundWithRegexp() {
        checkText.setValue("F[oO]+ B[a]+r");
        checkText.setRegexp(true);

        given(webSiteConnector.getDriver().getPageSource()).willReturn("FoO Baaaaar");

        assertTrue(checkText.executeAction(connectors).isSuccess());
    }

    @Test
    public void shouldReturnFailedIfTextWasNotFoundWithRegexp() {
        checkText.setValue("F[oO]+ B[a]+r");
        checkText.setRegexp(true);

        given(webSiteConnector.getDriver().getPageSource()).willReturn("F BAr");

        assertFalse(checkText.executeAction(connectors).isSuccess());
    }

    @Test
    public void shouldOnlyLookForTextInTheCorrectElement() {
        WebElement fooElement = mock(WebElement.class);
        given(fooElement.getAttribute("innerHTML")).willReturn("foo");

        WebElement barElement = mock(WebElement.class);
        given(barElement.getAttribute("innerHTML")).willReturn("bar");

        checkText.setValue("foo");
        checkText.getNode().setSelector("#foo");

        given(webSiteConnector.getElement(checkText.getNode())).willReturn(fooElement);

        assertTrue(checkText.executeAction(connectors).isSuccess());

        checkText.getNode().setSelector("#bar");

        given(webSiteConnector.getElement(checkText.getNode())).willReturn(barElement);

        assertFalse(checkText.executeAction(connectors).isSuccess());
    }

    private String createHtmlDoc(String content) {
        return "<!doctype html><html><head></head><body>" + content + "</body></html>";
    }
}
