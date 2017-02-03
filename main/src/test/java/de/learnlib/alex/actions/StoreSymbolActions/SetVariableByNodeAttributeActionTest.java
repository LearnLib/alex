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

package de.learnlib.alex.actions.StoreSymbolActions;

import com.fasterxml.jackson.databind.ObjectMapper;
import de.learnlib.alex.core.entities.ExecuteResult;
import de.learnlib.alex.core.entities.SymbolAction;
import de.learnlib.alex.core.entities.WebElementLocator;
import de.learnlib.alex.core.learner.connectors.ConnectorManager;
import de.learnlib.alex.core.learner.connectors.VariableStoreConnector;
import de.learnlib.alex.core.learner.connectors.WebSiteConnector;
import org.junit.Before;
import org.junit.Test;
import org.openqa.selenium.NoSuchElementException;
import org.openqa.selenium.WebElement;

import java.io.File;
import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;
import static org.mockito.BDDMockito.given;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;

public class SetVariableByNodeAttributeActionTest {

    private static final String VARIABLE  = "variable";
    private static final String NODE      = "node";
    private static final String ATTRIBUTE_NAME  = "attribute";
    private static final String ATTRIBUTE_VALUE = "foobar";

    private SetVariableByNodeAttributeAction setAction;

    private WebElementLocator node;

    @Before
    public void setUp() {
        node = new WebElementLocator();
        node.setSelector(NODE);
        node.setType(WebElementLocator.Type.CSS);

        setAction = new SetVariableByNodeAttributeAction();
        setAction.setName(VARIABLE);
        setAction.setNode(node);
        setAction.setAttribute(ATTRIBUTE_NAME);
    }

    @Test
    public void testJSON() throws IOException {
        ObjectMapper mapper = new ObjectMapper();
        String json = mapper.writeValueAsString(setAction);
        SetVariableByNodeAttributeAction declareAction2;
        declareAction2 = mapper.readValue(json, SetVariableByNodeAttributeAction.class);

        assertEquals(setAction.getName(), declareAction2.getName());
        assertEquals(setAction.getNode(), declareAction2.getNode());
        assertEquals(setAction.getAttribute(), declareAction2.getAttribute());
    }

    @Test
    public void testJSONFile() throws IOException, URISyntaxException {
        ObjectMapper mapper = new ObjectMapper();

        URI uri = getClass().getResource("/actions/StoreSymbolActions/SetVariableByNodeAttributeTestData.json").toURI();
        File file = new File(uri);
        SymbolAction obj = mapper.readValue(file, SymbolAction.class);

        assertTrue(obj instanceof SetVariableByNodeAttributeAction);
        SetVariableByNodeAttributeAction objAsAction = (SetVariableByNodeAttributeAction) obj;
        assertEquals(VARIABLE, objAsAction.getName());
        assertEquals(node, objAsAction.getNode());
        assertEquals(ATTRIBUTE_NAME, objAsAction.getAttribute());
    }

    @Test
    public void shouldSetTheVariableIfTheNodeAndAttributeExists() {
        ConnectorManager connector = mock(ConnectorManager.class);
        VariableStoreConnector variables = mock(VariableStoreConnector.class);
        given(connector.getConnector(VariableStoreConnector.class)).willReturn(variables);

        WebElement element = mock(WebElement.class);
        given(element.getAttribute(ATTRIBUTE_NAME)).willReturn(ATTRIBUTE_VALUE);
        WebSiteConnector webSiteConnector = mock(WebSiteConnector.class);
        given(webSiteConnector.getElement(node)).willReturn(element);
        given(connector.getConnector(WebSiteConnector.class)).willReturn(webSiteConnector);

        ExecuteResult result = setAction.execute(connector);

        assertEquals(ExecuteResult.OK, result);
        verify(variables).set(VARIABLE, ATTRIBUTE_VALUE);
    }

    @Test
    public void shouldReturnFailedIfTheNodeDoesNotExists() {
        ConnectorManager connector = mock(ConnectorManager.class);
        VariableStoreConnector variables = mock(VariableStoreConnector.class);
        given(connector.getConnector(VariableStoreConnector.class)).willReturn(variables);

        WebSiteConnector webSiteConnector = mock(WebSiteConnector.class);
        given(webSiteConnector.getElement(node)).willThrow(NoSuchElementException.class);
        given(connector.getConnector(WebSiteConnector.class)).willReturn(webSiteConnector);

        ExecuteResult result = setAction.execute(connector);

        assertEquals(ExecuteResult.FAILED, result);
        verify(variables, never()).set(eq(VARIABLE), anyString());
    }

}
