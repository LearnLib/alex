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

package de.learnlib.alex.data.entities.actions.WebSymbolActions;

import com.fasterxml.jackson.databind.ObjectMapper;
import de.learnlib.alex.data.entities.ExecuteResult;
import de.learnlib.alex.learning.services.connectors.WebSiteConnector;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.runners.MockitoJUnitRunner;
import org.openqa.selenium.WebDriver;

import java.io.File;
import java.io.IOException;
import java.net.URISyntaxException;

import static de.learnlib.alex.data.entities.ExecuteResult.FAILED;
import static de.learnlib.alex.data.entities.ExecuteResult.OK;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.mock;

@RunWith(MockitoJUnitRunner.class)
public class WaitForTitleActionTest {

    private static final int ONE_MINUTE = 60;

    private WaitForTitleAction action;

    @Before
    public void setUp() {
        action = new WaitForTitleAction();
        action.setValue("Title");
        action.setWaitCriterion(WaitForTitleAction.WaitCriterion.CONTAINS);
        action.setMaxWaitTime(ONE_MINUTE);
    }

    @Test
    public void testJSON() throws IOException {
        ObjectMapper mapper = new ObjectMapper();
        String json = mapper.writeValueAsString(action);
        WaitForTitleAction action2 = mapper.readValue(json, WaitForTitleAction.class);

        assertEquals(action.getValue(), action2.getValue());
        assertEquals(action.getWaitCriterion(), action2.getWaitCriterion());
        assertEquals(action.getMaxWaitTime(), action2.getMaxWaitTime());
    }

    @Test
    public void testJSONFile() throws IOException, URISyntaxException {
        ObjectMapper mapper = new ObjectMapper();

        File file = new File(getClass().getResource("/actions/websymbolactions/WaitForTitleTestData.json").toURI());
        WebSymbolAction obj = mapper.readValue(file, WebSymbolAction.class);

        assertTrue(obj instanceof WaitForTitleAction);
        WaitForTitleAction objAsAction = (WaitForTitleAction) obj;
        assertEquals("#node", objAsAction.getValue());
        assertEquals(WaitForTitleAction.WaitCriterion.CONTAINS, objAsAction.getWaitCriterion());
        assertEquals(ONE_MINUTE, objAsAction.getMaxWaitTime());
    }

    @Test
    public void shouldWaitUntilTheTitleIsTheExpectedValue() {
        WebSiteConnector webSiteConnector = mock(WebSiteConnector.class);
        WebDriver driver = mock(WebDriver.class);
        given(webSiteConnector.getDriver()).willReturn(driver);
        given(driver.getTitle()).willReturn(action.getValue());
        action.setWaitCriterion(WaitForTitleAction.WaitCriterion.IS);
        action.setMaxWaitTime(ONE_MINUTE);

        ExecuteResult result = action.execute(webSiteConnector);

        assertEquals(OK, result);
    }

    @Test
    public void shouldWaitUntilTheTitleContainsTheExpectedValue() {
        WebSiteConnector webSiteConnector = mock(WebSiteConnector.class);
        WebDriver driver = mock(WebDriver.class);
        given(webSiteConnector.getDriver()).willReturn(driver);
        given(driver.getTitle()).willReturn(action.getValue() + " - extra stuff that should not matter!");
        action.setWaitCriterion(WaitForTitleAction.WaitCriterion.CONTAINS);
        action.setMaxWaitTime(ONE_MINUTE);

        ExecuteResult result = action.execute(webSiteConnector);

        assertEquals(OK, result);
    }

    @Test
    public void shouldFailOnTimeout() {
        WebSiteConnector webSiteConnector = mock(WebSiteConnector.class);
        WebDriver driver = mock(WebDriver.class);
        given(webSiteConnector.getDriver()).willReturn(driver);
        action.setWaitCriterion(WaitForTitleAction.WaitCriterion.IS);
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
