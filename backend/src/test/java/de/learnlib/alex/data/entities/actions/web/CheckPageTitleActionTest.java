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
import static org.mockito.Mockito.lenient;
import static org.mockito.Mockito.mock;

import com.fasterxml.jackson.databind.ObjectMapper;
import de.learnlib.alex.data.entities.Project;
import de.learnlib.alex.data.entities.Symbol;
import de.learnlib.alex.learning.services.connectors.CounterStoreConnector;
import java.io.File;
import java.io.IOException;
import java.net.URISyntaxException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.openqa.selenium.WebDriver;

@ExtendWith(MockitoExtension.class)
public class CheckPageTitleActionTest extends WebActionTest {

    private static final long PROJECT_ID = 1;

    private static final String TEST_TITLE = "Awesome Title No. {{#title}}";

    private CheckPageTitleAction checkNode;
    private ObjectMapper objectMapper = new ObjectMapper();

    @BeforeEach
    public void setUp() {
        super.setUp();

        Project project = new Project();
        project.setId(PROJECT_ID);

        Symbol symbol = new Symbol();
        symbol.setProject(project);

        checkNode = new CheckPageTitleAction();
        checkNode.setSymbol(symbol);
        checkNode.setTitle(TEST_TITLE);
        checkNode.setRegexp(false);
    }

    @Test
    public void testJSON() throws IOException {
        String json = objectMapper.writeValueAsString(checkNode);
        CheckPageTitleAction c2 = objectMapper.readValue(json, CheckPageTitleAction.class);

        assertEquals(checkNode.getTitle(), c2.getTitle());
        assertEquals(checkNode.isRegexp(), c2.isRegexp());
    }

    @Test
    public void testJSONFile() throws IOException, URISyntaxException {
        File file = new File(getClass().getResource("/actions/websymbolactions/CheckPageTitleTestData.json").toURI());
        WebSymbolAction obj = objectMapper.readValue(file, WebSymbolAction.class);

        assertTrue(obj instanceof CheckPageTitleAction);
        CheckPageTitleAction objAsAction = (CheckPageTitleAction) obj;
        assertEquals(TEST_TITLE, objAsAction.getTitle());
        assertTrue(objAsAction.isRegexp());
    }

    @Test
    public void shouldReturnOKIfTitleWasFoundWithoutRegex() {
        WebDriver driver = mock(WebDriver.class);
        given((webSiteConnector.getDriver())).willReturn(driver);
        given(driver.getTitle()).willReturn("Awesome Title No. 0");

        CounterStoreConnector counterStoreConnector = mock(CounterStoreConnector.class);
        lenient().when(connectors.getConnector(CounterStoreConnector.class)).thenReturn(counterStoreConnector);

        assertTrue(checkNode.executeAction(connectors).isSuccess());
    }

    @Test
    public void shouldReturnFailedIfTitleWasNotFoundWithoutRegex() {
        WebDriver driver = mock(WebDriver.class);
        given((webSiteConnector.getDriver())).willReturn(driver);
        given(driver.getTitle()).willReturn("This is the wrong title");

        CounterStoreConnector counterStoreConnector = mock(CounterStoreConnector.class);
        lenient().when(connectors.getConnector(CounterStoreConnector.class)).thenReturn(counterStoreConnector);

        assertFalse(checkNode.executeAction(connectors).isSuccess());
    }

    @Test
    public void shouldReturnOKIfTitleWasFoundWithRegex() {
        WebDriver driver = mock(WebDriver.class);
        given((webSiteConnector.getDriver())).willReturn(driver);
        given(driver.getTitle()).willReturn("Fo0obar");

        checkNode.setTitle("F[o0]*bar");
        checkNode.setRegexp(true);

        assertTrue(checkNode.executeAction(connectors).isSuccess());
    }

    @Test
    public void shouldReturnFailedIfTitleWasNotFoundWithRegex() {
        WebDriver driver = mock(WebDriver.class);
        given((webSiteConnector.getDriver())).willReturn(driver);
        given(driver.getTitle()).willReturn("This is the wrong title");

        checkNode.setTitle("f[o0]+bar");
        checkNode.setRegexp(true);

        assertFalse(checkNode.executeAction(connectors).isSuccess());
    }

}
