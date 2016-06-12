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
import org.openqa.selenium.NoSuchElementException;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.htmlunit.HtmlUnitDriver;

import java.io.File;
import java.io.IOException;
import java.net.URISyntaxException;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

@RunWith(MockitoJUnitRunner.class)
public class MoveMouseTest {

    @Mock
    private User user;

    @Mock
    private Project project;

    private MoveMouseAction c;

    @Before
    public void setUp() {
        c = new MoveMouseAction();
        c.setUser(user);
        c.setProject(project);
        c.setNode("#node");
        c.setOffsetX(0);
        c.setOffsetY(0);
    }

    @Test
    public void testJSON() throws IOException {
        ObjectMapper mapper = new ObjectMapper();
        String json = mapper.writeValueAsString(c);
        MoveMouseAction c2 = mapper.readValue(json, MoveMouseAction.class);

        assertEquals(c.getNode(), c2.getNode());
        assertEquals(c.getOffsetX(), c2.getOffsetX());
        assertEquals(c.getOffsetY(), c2.getOffsetY());
    }

    @Test
    public void testJSONFile() throws IOException, URISyntaxException {
        ObjectMapper mapper = new ObjectMapper();

        File file = new File(getClass().getResource("/actions/websymbolactions/MoveMouseTestData.json").toURI());
        WebSymbolAction obj = mapper.readValue(file, WebSymbolAction.class);

        assertTrue(obj instanceof MoveMouseAction);
        MoveMouseAction objAsAction = (MoveMouseAction) obj;
        assertEquals("#node", objAsAction.getNode());
        assertEquals(0, objAsAction.getOffsetX());
        assertEquals(0, objAsAction.getOffsetY());
    }


    @Test
    public void shouldReturnOKIfNodeCouldBeFound() {
        // TODO: cannot really test this atm because moveToElement does not like the mocked WebElement
//        WebSiteConnector connector = mock(WebSiteConnector.class);
//        WebElement element = mock(WebElement.class);
//        WebDriver driver = mock(HtmlUnitDriver.class);
//        given(connector.getElement("#node")).willReturn(element);
//        given(connector.getDriver()).willReturn(driver);
//
//        assertEquals(OK, c.execute(connector));
    }

    @Test
    public void shouldReturnFAILEDIfNodeCouldNotBeClicked() {
        WebSiteConnector connector = mock(WebSiteConnector.class);
        WebDriver driver = mock(HtmlUnitDriver.class);
        when(connector.getElement("#node")).thenThrow(new NoSuchElementException(""));
        given(connector.getDriver()).willReturn(driver);

        assertEquals(ExecuteResult.FAILED, c.execute(connector));
    }
}
