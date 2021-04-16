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

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.lenient;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;

import de.learnlib.alex.data.entities.ExecuteResult;
import de.learnlib.alex.data.entities.Project;
import de.learnlib.alex.data.entities.Symbol;
import de.learnlib.alex.data.entities.WebElementLocator;
import de.learnlib.alex.learning.services.connectors.CounterStoreConnector;
import de.learnlib.alex.learning.services.connectors.VariableStoreConnector;
import java.util.ArrayList;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;

@ExtendWith(MockitoExtension.class)
public class ClickElementByTextActionTest extends WebActionTest {

    private static final String TAG_NAME = "button";

    private static final String TEXT = "test";

    private final WebElement container = mock(WebElement.class);

    private ClickElementByTextAction action;

    @BeforeEach
    public void setUp() {
        super.setUp();

        final Symbol symbol = new Symbol();
        symbol.setProject(new Project(0L));

        action = new ClickElementByTextAction();
        action.setNode(new WebElementLocator("body", WebElementLocator.Type.CSS));
        action.setTagName(TAG_NAME);
        action.setText(TEXT);
        action.setSymbol(symbol);

        lenient().when(connectors.getConnector(VariableStoreConnector.class)).thenReturn(mock(VariableStoreConnector.class));
        lenient().when(connectors.getConnector(CounterStoreConnector.class)).thenReturn(mock(CounterStoreConnector.class));
        lenient().when(webSiteConnector.getElement(action.getNode())).thenReturn(container);
    }

    @Test
    public void shouldFailIfNoElementWithTagNameIsFound() {
        given(container.findElements(By.tagName(TAG_NAME))).willReturn(new ArrayList<>());

        final ExecuteResult result = action.executeAction(connectors);
        assertFalse(result.isSuccess());
    }

    @Test
    public void shouldFailIfElementIsNotEnabled() {
        final WebElement button = mock(WebElement.class);
        given(button.getText()).willReturn(TEXT);

        final List<WebElement> elements = new ArrayList<>();
        elements.add(button);

        given(container.findElements(By.tagName(TAG_NAME))).willReturn(elements);

        final ExecuteResult result = action.executeAction(connectors);
        assertFalse(result.isSuccess());
    }

    @Test
    public void shouldFailIfElementIsNotVisible() {
        final WebElement button = mock(WebElement.class);
        given(button.getText()).willReturn(TEXT);

        final List<WebElement> elements = new ArrayList<>();
        elements.add(button);

        given(button.isDisplayed()).willReturn(false);
        given(container.findElements(By.tagName(TAG_NAME))).willReturn(elements);

        final ExecuteResult result = action.executeAction(connectors);
        assertFalse(result.isSuccess());
    }

    @Test
    public void shouldClickOnTheFirstClickableElement() {
        final WebElement button1 = mock(WebElement.class);
        given(button1.getText()).willReturn(TEXT);

        final WebElement button2 = mock(WebElement.class);
        given(button1.getText()).willReturn(TEXT);

        final List<WebElement> elements = new ArrayList<>();
        elements.add(button1);
        elements.add(button2);

        given(button1.isDisplayed()).willReturn(false);
        given(button2.getText()).willReturn(TEXT);
        given(button2.isDisplayed()).willReturn(true);
        given(button2.isEnabled()).willReturn(true);
        given(container.findElements(By.tagName(TAG_NAME))).willReturn(elements);

        final ExecuteResult result = action.executeAction(connectors);
        assertTrue(result.isSuccess());

        verify(button1, never()).click();
        verify(button2).click();
    }
}
