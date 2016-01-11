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
import org.openqa.selenium.WebElement;

import java.io.File;
import java.io.IOException;
import java.net.URISyntaxException;

import static de.learnlib.alex.core.entities.ExecuteResult.OK;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@RunWith(MockitoJUnitRunner.class)
public class ClickActionTest {

    @Mock
    private User user;

    @Mock
    private Project project;

    private ClickAction c;

    @Before
    public void setUp() {
        c = new ClickAction();
        c.setUser(user);
        c.setProject(project);
        c.setNode("#node");
    }

    @Test
    public void testJSON() throws IOException {
        ObjectMapper mapper = new ObjectMapper();
        String json = mapper.writeValueAsString(c);
        ClickAction c2 = mapper.readValue(json, ClickAction.class);

        assertEquals(c.getNode(), c2.getNode());
    }

    @Test
    public void testJSONWithLongNode() throws IOException {
        c.setNode("#superlong > css trace .with-absolute ~no_meaning .at-all > .1234567890 > .1234567890 > .1234567890"
                          + " > .1234567890 > .1234567890 > .1234567890 > .1234567890 > .1234567890 > .1234567890"
                          + " > .1234567890 > .1234567890 > .1234567890");
        ObjectMapper mapper = new ObjectMapper();
        String json = mapper.writeValueAsString(c);
        ClickAction c2 = mapper.readValue(json, ClickAction.class);

        assertEquals(c.getNode(), c2.getNode());
    }

    @Test
    public void testJSONFile() throws IOException, URISyntaxException {
        ObjectMapper mapper = new ObjectMapper();

        File file = new File(getClass().getResource("/actions/websymbolactions/ClickTestData.json").toURI());
        WebSymbolAction obj = mapper.readValue(file, WebSymbolAction.class);

        assertTrue(obj instanceof ClickAction);
        ClickAction objAsAction = (ClickAction) obj;
        assertEquals("#node", objAsAction.getNode());
    }

    @Test
    public void shouldReturnOKIfNodeCouldBeClicked() {
        WebSiteConnector connector = mock(WebSiteConnector.class);
        WebElement element = mock(WebElement.class);
        given(connector.getElement("#node")).willReturn(element);

        assertEquals(OK, c.execute(connector));
        verify(element).click();
    }

    @Test
    public void shouldReturnFaliedIfNodeCouldNotBeClicked() {
        WebSiteConnector connector = mock(WebSiteConnector.class);
        when(connector.getElement("#node")).thenThrow(new NoSuchElementException(""));

        assertEquals(ExecuteResult.FAILED, c.execute(connector));
    }

}
