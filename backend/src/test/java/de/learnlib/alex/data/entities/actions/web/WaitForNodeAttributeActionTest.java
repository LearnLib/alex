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

import de.learnlib.alex.data.entities.ExecuteResult;
import de.learnlib.alex.data.entities.Project;
import de.learnlib.alex.data.entities.Symbol;
import de.learnlib.alex.data.entities.WebElementLocator;
import de.learnlib.alex.learning.services.connectors.ConnectorManager;
import de.learnlib.alex.learning.services.connectors.WebSiteConnector;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.mockito.Mockito;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

public class WaitForNodeAttributeActionTest {

    private WaitForNodeAttributeAction action;

    private ConnectorManager connectors;

    private WebSiteConnector webSiteConnector;

    private WebElement el;

    @Before
    public void before() {
        this.webSiteConnector = Mockito.mock(WebSiteConnector.class);

        this.connectors = Mockito.mock(ConnectorManager.class);
        Mockito.when(this.connectors.getConnector(WebSiteConnector.class)).thenReturn(this.webSiteConnector);

        final Project project = new Project(1L);
        final Symbol symbol = new Symbol();
        symbol.setId(1L);
        symbol.setProject(project);

        this.action = new WaitForNodeAttributeAction();
        this.action.setSymbol(symbol);
        this.action.setNode(new WebElementLocator());
        this.action.setAttribute("id");
        this.action.setMaxWaitTime(0);

        this.el = Mockito.mock(WebElement.class);
        Mockito.when(this.webSiteConnector.getElement(Mockito.any(WebElementLocator.class))).thenReturn(this.el);
        Mockito.when(this.webSiteConnector.getDriver()).thenReturn(Mockito.mock(WebDriver.class));
    }

    @Test
    public void shouldWaitUntilAttributeIsValue() {
        Mockito.when(el.getAttribute("id")).thenReturn("test");
        action.setWaitCriterion(WaitForNodeAttributeAction.WaitCriterion.IS);
        action.setValue("test");
        final ExecuteResult result = action.executeAction(connectors);
        Assert.assertTrue(result.isSuccess());
    }

    @Test
    public void shouldWaitUntilAttributeContainsValue() {
        Mockito.when(el.getAttribute("id")).thenReturn("1test2");
        action.setWaitCriterion(WaitForNodeAttributeAction.WaitCriterion.CONTAINS);
        action.setValue("test");
        final ExecuteResult result = action.executeAction(connectors);
        Assert.assertTrue(result.isSuccess());
    }

    @Test
    public void shouldFailOnNegativeWaitTime() {
        action.setMaxWaitTime(-1L);
        final ExecuteResult result = action.executeAction(connectors);
        Assert.assertFalse(result.isSuccess());
    }

    @Test
    public void shouldFailOnTimeout() {
        Mockito.when(el.getAttribute("id")).thenReturn("someId");
        action.setWaitCriterion(WaitForNodeAttributeAction.WaitCriterion.IS);
        action.setValue("test");
        final ExecuteResult result1 = action.executeAction(connectors);
        Assert.assertFalse(result1.isSuccess());

        action.setWaitCriterion(WaitForNodeAttributeAction.WaitCriterion.CONTAINS);
        action.setValue("test");
        final ExecuteResult result2 = action.executeAction(connectors);
        Assert.assertFalse(result2.isSuccess());
    }
}
