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
import de.learnlib.alex.learning.services.connectors.ConnectorManager;
import de.learnlib.alex.learning.services.connectors.WebSiteConnector;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.mockito.Mockito;
import org.openqa.selenium.Alert;
import org.openqa.selenium.NoAlertPresentException;
import org.openqa.selenium.WebDriver;

public class AlertAcceptDismissActionTest {

    private AlertAcceptDismissAction action;

    private ConnectorManager connectors;

    private WebDriver.TargetLocator targetLocator;

    @Before
    public void before() {
        final WebSiteConnector webSiteConnector = Mockito.mock(WebSiteConnector.class);

        this.connectors = Mockito.mock(ConnectorManager.class);
        Mockito.when(connectors.getConnector(WebSiteConnector.class)).thenReturn(webSiteConnector);

        final WebDriver wd = Mockito.mock(WebDriver.class);
        Mockito.when(webSiteConnector.getDriver()).thenReturn(wd);

        this.targetLocator = Mockito.mock(WebDriver.TargetLocator.class);
        Mockito.when(wd.switchTo()).thenReturn(this.targetLocator);

        this.action = new AlertAcceptDismissAction();
    }

    @Test
    public void shouldFailIfNoAlertIsPresent() {
        Mockito.when(targetLocator.alert()).thenThrow(new NoAlertPresentException());

        final ExecuteResult result = action.execute(connectors);
        Assert.assertFalse(result.isSuccess());
    }

    @Test
    public void shouldSucceedIfAlertIsPresent() {
        final Alert alert = Mockito.mock(Alert.class);
        Mockito.when(targetLocator.alert()).thenReturn(alert);

        action.setAction(AlertAcceptDismissAction.Action.ACCEPT);
        final ExecuteResult res1 = action.execute(connectors);
        Assert.assertTrue(res1.isSuccess());
        Mockito.verify(alert, Mockito.times(1)).accept();

        action.setAction(AlertAcceptDismissAction.Action.DISMISS);
        final ExecuteResult res2 = action.execute(connectors);
        Assert.assertTrue(res2.isSuccess());
        Mockito.verify(alert, Mockito.times(1)).dismiss();
    }

}
