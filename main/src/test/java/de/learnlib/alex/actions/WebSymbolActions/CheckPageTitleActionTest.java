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
import de.learnlib.alex.core.entities.Project;
import de.learnlib.alex.core.entities.User;
import de.learnlib.alex.core.learner.connectors.ConnectorManager;
import de.learnlib.alex.core.learner.connectors.CounterStoreConnector;
import de.learnlib.alex.core.learner.connectors.WebSiteConnector;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;
import org.openqa.selenium.WebDriver;

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
public class CheckPageTitleActionTest {

    private static final long USER_ID = 1;
    private static final long PROJECT_ID = 1;

    private static final String TEST_TITLE = "Awesome Title No. {{#title}}";

    @Mock
    private User user;

    @Mock
    private Project project;

    private CheckPageTitleAction checkNode;


    @Before
    public void setUp() {
        given(user.getId()).willReturn(USER_ID);
        given(project.getId()).willReturn(PROJECT_ID);

        checkNode = new CheckPageTitleAction();
        checkNode.setUser(user);
        checkNode.setProject(project);
        checkNode.setTitle(TEST_TITLE);
        checkNode.setRegexp(false);
}

    @Test
    public void testJSON() throws IOException {
        ObjectMapper mapper = new ObjectMapper();
        String json = mapper.writeValueAsString(checkNode);
        CheckPageTitleAction c2 = mapper.readValue(json, CheckPageTitleAction.class);

        assertEquals(checkNode.getTitle(), c2.getTitle());
        assertEquals(checkNode.isRegexp(), c2.isRegexp());
    }

    @Test
    public void testJSONFile() throws IOException, URISyntaxException {
        ObjectMapper mapper = new ObjectMapper();

        File file = new File(getClass().getResource("/actions/websymbolactions/CheckPageTitleTestData.json").toURI());
        WebSymbolAction obj = mapper.readValue(file, WebSymbolAction.class);

        assertTrue(obj instanceof CheckPageTitleAction);
        CheckPageTitleAction objAsAction = (CheckPageTitleAction) obj;
        assertEquals(TEST_TITLE, objAsAction.getTitle());
        assertTrue(objAsAction.isRegexp());
    }

    @Test
    public void shouldReturnOKIfTitleWasFoundWithoutRegex() {
        ConnectorManager connectors = mock(ConnectorManager.class);
        WebSiteConnector webSiteConnector = mock(WebSiteConnector.class);
        given(connectors.getConnector(WebSiteConnector.class)).willReturn(webSiteConnector);
        WebDriver driver = mock(WebDriver.class);
        given((webSiteConnector.getDriver())).willReturn(driver);
        given(driver.getTitle()).willReturn("Awesome Title No. 1");

        CounterStoreConnector counterStoreConnector = mock(CounterStoreConnector.class);
        given(connectors.getConnector(CounterStoreConnector.class)).willReturn(counterStoreConnector);
        given(counterStoreConnector.get(USER_ID, PROJECT_ID, "title")).willReturn(1);

        assertEquals(OK, checkNode.executeAction(connectors));
    }

    @Test
    public void shouldReturnFailedIfTitleWasNotFoundWithoutRegex() {
        ConnectorManager connectors = mock(ConnectorManager.class);
        WebSiteConnector webSiteConnector = mock(WebSiteConnector.class);
        given(connectors.getConnector(WebSiteConnector.class)).willReturn(webSiteConnector);
        WebDriver driver = mock(WebDriver.class);
        given((webSiteConnector.getDriver())).willReturn(driver);
        given(driver.getTitle()).willReturn("This is the wrong title");

        CounterStoreConnector counterStoreConnector = mock(CounterStoreConnector.class);
        given(connectors.getConnector(CounterStoreConnector.class)).willReturn(counterStoreConnector);
        given(counterStoreConnector.get(USER_ID, PROJECT_ID, "title")).willReturn(1);

        assertEquals(FAILED, checkNode.executeAction(connectors));
    }

    @Test
    public void shouldReturnOKIfTitleWasFoundWithRegex() {
        ConnectorManager connectors = mock(ConnectorManager.class);
        WebSiteConnector webSiteConnector = mock(WebSiteConnector.class);
        given(connectors.getConnector(WebSiteConnector.class)).willReturn(webSiteConnector);
        WebDriver driver = mock(WebDriver.class);
        given((webSiteConnector.getDriver())).willReturn(driver);
        given(driver.getTitle()).willReturn("Fo0obar");

        checkNode.setTitle("F[o0]*bar");
        checkNode.setRegexp(true);

        assertEquals(OK, checkNode.executeAction(connectors));
    }

    @Test
    public void shouldReturnFailedIfTitleWasNotFoundWithRegex() {
        ConnectorManager connectors = mock(ConnectorManager.class);
        WebSiteConnector webSiteConnector = mock(WebSiteConnector.class);
        given(connectors.getConnector(WebSiteConnector.class)).willReturn(webSiteConnector);
        WebDriver driver = mock(WebDriver.class);
        given((webSiteConnector.getDriver())).willReturn(driver);
        given(driver.getTitle()).willReturn("This is the wrong title");

        CounterStoreConnector counterStoreConnector = mock(CounterStoreConnector.class);
        given(connectors.getConnector(CounterStoreConnector.class)).willReturn(counterStoreConnector);
        given(counterStoreConnector.get(USER_ID, PROJECT_ID, "title")).willReturn(1);

        checkNode.setTitle("f[o0]+bar");
        checkNode.setRegexp(true);

        assertEquals(FAILED, checkNode.executeAction(connectors));
    }

}
