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

package de.learnlib.alex.data.entities.actions.misc;

import de.learnlib.alex.data.entities.ExecuteResult;
import de.learnlib.alex.data.entities.Project;
import de.learnlib.alex.data.entities.Symbol;
import de.learnlib.alex.data.entities.WebElementLocator;
import de.learnlib.alex.learning.services.connectors.ConnectorManager;
import de.learnlib.alex.learning.services.connectors.VariableStoreConnector;
import de.learnlib.alex.learning.services.connectors.WebSiteConnector;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.mockito.Mockito;
import org.openqa.selenium.NoSuchElementException;
import org.openqa.selenium.WebElement;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class SetVariableByNodeCountActionTest {

    private SetVariableByNodeCountAction action;

    private ConnectorManager connectors;

    private WebSiteConnector webSiteConnector;

    private VariableStoreConnector variableStore;

    private List<WebElement> elements;

    @Before
    public void before() {
        this.webSiteConnector = Mockito.mock(WebSiteConnector.class);
        this.variableStore = new VariableStoreConnector();

        this.connectors = Mockito.mock(ConnectorManager.class);
        Mockito.when(connectors.getConnector(WebSiteConnector.class)).thenReturn(this.webSiteConnector);
        Mockito.when(connectors.getConnector(VariableStoreConnector.class)).thenReturn(this.variableStore);

        final Project project = new Project(1L);

        final Symbol symbol = new Symbol();
        symbol.setId(1L);
        symbol.setProject(project);

        this.action = new SetVariableByNodeCountAction();
        this.action.setName("var");
        this.action.setNode(new WebElementLocator(".el", WebElementLocator.Type.CSS));
        this.action.setSymbol(symbol);

        this.elements = Arrays.asList(Mockito.mock(WebElement.class), Mockito.mock(WebElement.class));
    }

    @Test
    public void shouldStoreAmountOfNodes() {
        Mockito.when(webSiteConnector.getElements(Mockito.any(WebElementLocator.class))).thenReturn(elements);

        final ExecuteResult result = action.executeAction(connectors);

        Assert.assertTrue(result.isSuccess());
        Assert.assertEquals(String.valueOf(elements.size()), variableStore.get("var"));
    }

    @Test
    public void shouldStoreZeroIfNoElementsCouldBeFound() {
        Mockito.when(webSiteConnector.getElements(Mockito.any(WebElementLocator.class))).thenReturn(new ArrayList<>());

        final ExecuteResult result = action.executeAction(connectors);

        Assert.assertTrue(result.isSuccess());
        Assert.assertEquals(String.valueOf(0), variableStore.get("var"));
    }

    @Test
    public void shouldStoreZeroIfExceptionOccurs() {
        Mockito.when(webSiteConnector.getElements(Mockito.any(WebElementLocator.class))).thenThrow(new NoSuchElementException(""));

        final ExecuteResult result = action.executeAction(connectors);

        Assert.assertTrue(result.isSuccess());
        Assert.assertEquals(String.valueOf(0), variableStore.get("var"));
    }

}
