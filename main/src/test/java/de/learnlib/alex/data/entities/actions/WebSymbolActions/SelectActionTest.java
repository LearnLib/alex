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
import de.learnlib.alex.auth.entities.User;
import de.learnlib.alex.data.entities.Project;
import de.learnlib.alex.data.entities.WebElementLocator;
import de.learnlib.alex.learning.entities.ExecuteResult;
import de.learnlib.alex.learning.services.connectors.WebSiteConnector;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;
import org.openqa.selenium.By;
import org.openqa.selenium.NoSuchElementException;
import org.openqa.selenium.WebElement;

import java.io.File;
import java.io.IOException;
import java.net.URISyntaxException;
import java.util.LinkedList;
import java.util.List;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;

@RunWith(MockitoJUnitRunner.class)
public class SelectActionTest {

    private static final long USER_ID = 1;
    private static final long PROJECT_ID = 1;

    @Mock
    private User user;

    @Mock
    private Project project;

    private SelectAction s;

    private WebElementLocator node;

    @Before
    public void setUp() {
        given(user.getId()).willReturn(USER_ID);
        given(project.getId()).willReturn(PROJECT_ID);

        node = new WebElementLocator();
        node.setSelector("#node");
        node.setType(WebElementLocator.Type.CSS);

        s = new SelectAction();
        s.setUser(user);
        s.setProject(project);
        s.setNode(node);
        s.setValue("Lorem Ipsum");
        s.setSelectBy(SelectAction.SelectByType.TEXT);
    }

    @Test
    public void testJSON() throws IOException {
        ObjectMapper mapper = new ObjectMapper();
        String json = mapper.writeValueAsString(s);
        SelectAction f2 = mapper.readValue(json, SelectAction.class);

        assertEquals(s.getNode(), f2.getNode());
        assertEquals(s.getValue(), f2.getValue());
        assertEquals(s.getSelectBy(), f2.getSelectBy());
    }

    @Test
    public void testJSONFile() throws IOException, URISyntaxException {
        ObjectMapper mapper = new ObjectMapper();

        File file = new File(getClass().getResource("/actions/websymbolactions/SelectTestData.json").toURI());
        WebSymbolAction obj = mapper.readValue(file, WebSymbolAction.class);

        assertTrue(obj instanceof SelectAction);
        SelectAction objAsAction = (SelectAction) obj;
        assertEquals(node, objAsAction.getNode());
        assertEquals("Lorem Ipsum", objAsAction.getValue());
        assertEquals(SelectAction.SelectByType.TEXT, objAsAction.getSelectBy());
    }

    @Test
    public void shouldReturnOkIfValueWasSelectedByValue() {
        WebSiteConnector webSiteConnector = mock(WebSiteConnector.class);
        WebElement selectElement = mock(WebElement.class);
        given(webSiteConnector.getElement(node)).willReturn(selectElement);
        given(selectElement.getTagName()).willReturn("select");
        WebElement itemElement = mock(WebElement.class);
        List<WebElement> itemElements = new LinkedList<>();
        itemElements.add(itemElement);
        given(selectElement.findElements(By.xpath(".//option[@value = \"Lorem Ipsum\"]")))
                .willReturn(itemElements);
        s.setSelectBy(SelectAction.SelectByType.VALUE);

        ExecuteResult result = s.execute(webSiteConnector);

        assertEquals(ExecuteResult.OK, result);
        verify(itemElement).click();
    }

    @Test
    public void shouldReturnOkIfValueWasSelectedByText() {
        WebSiteConnector webSiteConnector = mock(WebSiteConnector.class);
        WebElement selectElement = mock(WebElement.class);
        given(webSiteConnector.getElement(node)).willReturn(selectElement);
        given(selectElement.getTagName()).willReturn("select");
        WebElement itemElement = mock(WebElement.class);
        List<WebElement> itemElements = new LinkedList<>();
        itemElements.add(itemElement);
        given(selectElement.findElements(By.xpath(".//option[normalize-space(.) = \"Lorem Ipsum\"]")))
                .willReturn(itemElements);
        s.setSelectBy(SelectAction.SelectByType.TEXT);

        ExecuteResult result = s.execute(webSiteConnector);

        assertEquals(ExecuteResult.OK, result);
        verify(itemElement).click();
    }

    @Test
    public void shouldReturnOkIfValueWasSelectedByIndex() {
        WebSiteConnector webSiteConnector = mock(WebSiteConnector.class);
        WebElement selectElement = mock(WebElement.class);
        given(webSiteConnector.getElement(node)).willReturn(selectElement);
        given(selectElement.getTagName()).willReturn("select");
        List<WebElement> itemElements = new LinkedList<>();
        given(selectElement.findElements(By.tagName("option"))).willReturn(itemElements);
        WebElement itemElement = mock(WebElement.class);
        itemElements.add(itemElement);
        given(itemElement.getAttribute("index")).willReturn("0");
        s.setValue("0");
        s.setSelectBy(SelectAction.SelectByType.INDEX);

        ExecuteResult result = s.execute(webSiteConnector);

        assertEquals(ExecuteResult.OK, result);
        verify(itemElement).click();
    }

    @Test
    public void shouldReturnFailedIfValueIsNotAnIndexNumber() {
        WebSiteConnector webSiteConnector = mock(WebSiteConnector.class);
        WebElement selectElement = mock(WebElement.class);
        given(webSiteConnector.getElement(node)).willReturn(selectElement);
        given(selectElement.getTagName()).willReturn("select");
        s.setValue("definite not a number");
        s.setSelectBy(SelectAction.SelectByType.INDEX);

        ExecuteResult result = s.execute(webSiteConnector);

        assertEquals(ExecuteResult.FAILED, result);
    }

    @Test
    public void shouldReturnFailedIfTheNodeCouldNotBeFound() {
        WebSiteConnector webSiteConnector = mock(WebSiteConnector.class);
        given(webSiteConnector.getElement(node)).willThrow(NoSuchElementException.class);

        ExecuteResult result = s.execute(webSiteConnector);

        assertEquals(ExecuteResult.FAILED, result);
    }

}
