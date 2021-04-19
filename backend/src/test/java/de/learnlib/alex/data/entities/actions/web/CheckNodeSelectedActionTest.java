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
import static org.mockito.Mockito.mock;

import de.learnlib.alex.data.entities.Symbol;
import de.learnlib.alex.data.entities.WebElementLocator;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.openqa.selenium.NoSuchElementException;
import org.openqa.selenium.WebElement;

@ExtendWith(MockitoExtension.class)
public class CheckNodeSelectedActionTest extends WebActionTest {

    private CheckNodeSelectedAction action;

    private WebElementLocator node;

    @BeforeEach
    public void setUp() {
        super.setUp();

        Symbol symbol = new Symbol();

        node = new WebElementLocator();
        node.setSelector("#node");
        node.setType(WebElementLocator.Type.CSS);

        action = new CheckNodeSelectedAction();
        action.setSymbol(symbol);
        action.setNode(node);
    }

    @Test
    public void shouldReturnOkIfNodeWasFoundAndSelected() {
        WebElement element = mock(WebElement.class);
        given(element.isSelected()).willReturn(true);
        given(webSiteConnector.getElement(node)).willReturn(element);

        assertTrue(action.executeAction(connectors).isSuccess());
    }

    @Test
    public void shouldReturnFailedIfNodeWasFoundAndNotSelected() {
        WebElement element = mock(WebElement.class);
        given(element.isSelected()).willReturn(false);
        given(webSiteConnector.getElement(node)).willReturn(element);

        assertFalse(action.executeAction(connectors).isSuccess());
    }

    @Test
    public void shouldReturnFailedIfNodeWasNotFound() {
        given(webSiteConnector.getElement(node)).willThrow(new NoSuchElementException(""));

        assertFalse(action.executeAction(connectors).isSuccess());
    }
}
