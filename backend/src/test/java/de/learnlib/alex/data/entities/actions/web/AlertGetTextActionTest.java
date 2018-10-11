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

package de.learnlib.alex.data.entities.actions.web;

import de.learnlib.alex.data.entities.ExecuteResult;
import de.learnlib.alex.data.entities.Project;
import de.learnlib.alex.data.entities.Symbol;
import de.learnlib.alex.learning.services.connectors.ConnectorManager;
import de.learnlib.alex.learning.services.connectors.VariableStoreConnector;
import de.learnlib.alex.learning.services.connectors.WebSiteConnector;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.mockito.Mockito;
import org.openqa.selenium.Alert;
import org.openqa.selenium.NoAlertPresentException;
import org.openqa.selenium.WebDriver;

public class AlertGetTextActionTest {

    private static final String VARIABLE_NAME = "var";

    private AlertGetTextAction action;

    private ConnectorManager connectors;

    private WebSiteConnector webSiteConnector;

    private VariableStoreConnector variableStore;

    private WebDriver.TargetLocator targetLocator;

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

        this.action = new AlertGetTextAction();
        this.action.setVariableName(VARIABLE_NAME);
        this.action.setSymbol(symbol);

        this.targetLocator = Mockito.mock(WebDriver.TargetLocator.class);

        final WebDriver wd = Mockito.mock(WebDriver.class);
        Mockito.when(wd.switchTo()).thenReturn(this.targetLocator);
        Mockito.when(this.webSiteConnector.getDriver()).thenReturn(wd);
    }

    @Test
    public void shouldStoreTextInVariableAndSucceed() {
        final Alert alert = Mockito.mock(Alert.class);
        Mockito.when(targetLocator.alert()).thenReturn(alert);
        Mockito.when(alert.getText()).thenReturn("test");

        final ExecuteResult result = action.executeAction(connectors);
        Assert.assertTrue(result.isSuccess());
        Assert.assertEquals("test", variableStore.get(VARIABLE_NAME));
    }

    @Test(expected = IllegalStateException.class)
    public void shouldFailWhenNoAlertIsPresent() {
        Mockito.when(targetLocator.alert()).thenThrow(new NoAlertPresentException());

        final ExecuteResult result = action.executeAction(connectors);
        Assert.assertFalse(result.isSuccess());
        variableStore.get(VARIABLE_NAME);
    }

}
