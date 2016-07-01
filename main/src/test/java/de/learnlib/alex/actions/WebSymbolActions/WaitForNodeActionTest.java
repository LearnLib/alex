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

package de.learnlib.alex.actions.WebSymbolActions;

import com.fasterxml.jackson.databind.ObjectMapper;
import de.learnlib.alex.core.entities.ExecuteResult;
import de.learnlib.alex.core.entities.Project;
import de.learnlib.alex.core.entities.User;
import de.learnlib.alex.core.learner.connectors.WebSiteConnector;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;
import org.openqa.selenium.By;
import org.openqa.selenium.StaleElementReferenceException;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

import java.io.File;
import java.io.IOException;
import java.net.URISyntaxException;

import static de.learnlib.alex.core.entities.ExecuteResult.FAILED;
import static de.learnlib.alex.core.entities.ExecuteResult.OK;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.mock;

@RunWith(MockitoJUnitRunner.class)
public class WaitForNodeActionTest {

    private static final int ONE_MINUTE = 60;

    @Mock
    private User user;

    @Mock
    private Project project;

    private WaitForNodeAction action;

    @Before
    public void setUp() {
        action = new WaitForNodeAction();
        action.setUser(user);
        action.setProject(project);
        action.setNode("#node");
        action.setWaitCriterion(WaitForNodeAction.WaitCriterion.VISIBLE);
        action.setMaxWaitTime(ONE_MINUTE);
    }

    @Test
    public void testJSON() throws IOException {
        ObjectMapper mapper = new ObjectMapper();
        String json = mapper.writeValueAsString(action);
        WaitForNodeAction action2 = mapper.readValue(json, WaitForNodeAction.class);

        assertEquals(action.getNode(), action2.getNode());
        assertEquals(action.getWaitCriterion(), action2.getWaitCriterion());
        assertEquals(action.getMaxWaitTime(), action2.getMaxWaitTime());
    }

    @Test
    public void testJSONFile() throws IOException, URISyntaxException {
        ObjectMapper mapper = new ObjectMapper();

        File file = new File(getClass().getResource("/actions/websymbolactions/WaitForNodeTestData.json").toURI());
        WebSymbolAction obj = mapper.readValue(file, WebSymbolAction.class);

        assertTrue(obj instanceof WaitForNodeAction);
        WaitForNodeAction objAsAction = (WaitForNodeAction) obj;
        assertEquals("#node", objAsAction.getNode());
        assertEquals(WaitForNodeAction.WaitCriterion.ADDED, objAsAction.getWaitCriterion());
        assertEquals(ONE_MINUTE, objAsAction.getMaxWaitTime());
    }

    @Test
    public void shouldWaitUntilTheElementIsVisible() {
        WebSiteConnector webSiteConnector = mock(WebSiteConnector.class);
        WebDriver driver = mock(WebDriver.class);
        given(webSiteConnector.getDriver()).willReturn(driver);
        WebElement element = mock(WebElement.class);
        given(webSiteConnector.getElement("#node")).willReturn(element);
        given(element.isDisplayed()).willReturn(true);
        action.setWaitCriterion(WaitForNodeAction.WaitCriterion.VISIBLE);
        action.setMaxWaitTime(ONE_MINUTE);

        ExecuteResult result = action.execute(webSiteConnector);

        assertEquals(OK, result);
    }

    @Test
    public void shouldWaitUntilTheElementIsInvisible() {
        WebSiteConnector webSiteConnector = mock(WebSiteConnector.class);
        WebDriver driver = mock(WebDriver.class);
        given(webSiteConnector.getDriver()).willReturn(driver);
        WebElement element = mock(WebElement.class);
        given(driver.findElement(By.cssSelector("#node"))).willReturn(element);
        given(element.isDisplayed()).willReturn(false);
        action.setWaitCriterion(WaitForNodeAction.WaitCriterion.INVISIBLE);
        action.setMaxWaitTime(ONE_MINUTE);

        ExecuteResult result = action.execute(webSiteConnector);

        assertEquals(OK, result);
    }

    @Test
    public void shouldWaitUntilTheElementIsAdded() {
        WebSiteConnector webSiteConnector = mock(WebSiteConnector.class);
        WebDriver driver = mock(WebDriver.class);
        given(webSiteConnector.getDriver()).willReturn(driver);
        WebElement element = mock(WebElement.class);
        given(driver.findElement(By.cssSelector("#node"))).willReturn(element);
        action.setWaitCriterion(WaitForNodeAction.WaitCriterion.ADDED);
        action.setMaxWaitTime(ONE_MINUTE);

        ExecuteResult result = action.execute(webSiteConnector);

        assertEquals(OK, result);
    }

    @Test
    public void shouldWaitUntilTheElementIsRemoved() {
        WebSiteConnector webSiteConnector = mock(WebSiteConnector.class);
        WebDriver driver = mock(WebDriver.class);
        given(webSiteConnector.getDriver()).willReturn(driver);
        WebElement element = mock(WebElement.class);
        given(webSiteConnector.getElement("#node")).willReturn(element);
        given(element.isEnabled()).willThrow(StaleElementReferenceException.class);
        action.setWaitCriterion(WaitForNodeAction.WaitCriterion.REMOVED);
        action.setMaxWaitTime(ONE_MINUTE);

        ExecuteResult result = action.execute(webSiteConnector);

        assertEquals(OK, result);
    }

    @Test
    public void shouldFailOnTimeout() {
        WebSiteConnector webSiteConnector = mock(WebSiteConnector.class);
        WebDriver driver = mock(WebDriver.class);
        given(webSiteConnector.getDriver()).willReturn(driver);
        WebElement element = mock(WebElement.class);
        given(webSiteConnector.getElement("#node")).willReturn(element);
        action.setWaitCriterion(WaitForNodeAction.WaitCriterion.VISIBLE);
        action.setMaxWaitTime(0); // don't really wait to keep the test speed high

        ExecuteResult result = action.execute(webSiteConnector);

        assertEquals(FAILED, result);
    }

    @Test
    public void shouldFailIfMaxTimeToWaitIsNegative() {
        WebSiteConnector webSiteConnector = mock(WebSiteConnector.class);
        action.setMaxWaitTime(-1);

        ExecuteResult result = action.execute(webSiteConnector);

        assertEquals(FAILED, result);
    }

}
