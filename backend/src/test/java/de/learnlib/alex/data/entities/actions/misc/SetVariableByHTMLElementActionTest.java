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

import com.fasterxml.jackson.databind.ObjectMapper;
import de.learnlib.alex.data.entities.ExecuteResult;
import de.learnlib.alex.data.entities.Project;
import de.learnlib.alex.data.entities.Symbol;
import de.learnlib.alex.data.entities.SymbolAction;
import de.learnlib.alex.data.entities.WebElementLocator;
import de.learnlib.alex.learning.services.connectors.ConnectorManager;
import de.learnlib.alex.learning.services.connectors.VariableStoreConnector;
import de.learnlib.alex.learning.services.connectors.WebSiteConnector;
import org.junit.Before;
import org.junit.Test;
import org.openqa.selenium.NoSuchElementException;
import org.openqa.selenium.WebElement;

import java.io.File;
import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;

public class SetVariableByHTMLElementActionTest {

    private static final String VARIABLE   = "variable";
    private static final String NODE_NAME  = "foobar";
    private static final String NODE_VALUE = "Hello World";

    private SetVariableByHTMLElementAction setAction;

    private WebElementLocator node;

    @Before
    public void setUp() {
        node = new WebElementLocator();
        node.setSelector(NODE_NAME);
        node.setType(WebElementLocator.Type.CSS);

        Symbol symbol = new Symbol();
        symbol.setProject(new Project(1L));

        setAction = new SetVariableByHTMLElementAction();
        setAction.setSymbol(symbol);
        setAction.setName(VARIABLE);
        setAction.setNode(node);
    }

    @Test
    public void testJSON() throws IOException {
        ObjectMapper mapper = new ObjectMapper();
        String json = mapper.writeValueAsString(setAction);
        SetVariableByHTMLElementAction declareAction2 = mapper.readValue(json, SetVariableByHTMLElementAction.class);

        assertEquals(setAction.getName(), declareAction2.getName());
        assertEquals(setAction.getNode(), declareAction2.getNode());
    }

    @Test
    public void testJSONFile() throws IOException, URISyntaxException {
        ObjectMapper mapper = new ObjectMapper();

        URI uri = getClass().getResource("/actions/StoreSymbolActions/SetVariableByHTMLElementTestData.json").toURI();
        File file = new File(uri);
        SymbolAction obj = mapper.readValue(file, SymbolAction.class);

        assertTrue(obj instanceof SetVariableByHTMLElementAction);
        SetVariableByHTMLElementAction objAsAction = (SetVariableByHTMLElementAction) obj;
        assertEquals(VARIABLE, objAsAction.getName());
        assertEquals(node, objAsAction.getNode());
    }

    @Test
    public void shouldSetTheVariableIfTheNodeExists() {
        ConnectorManager connector = mock(ConnectorManager.class);
        VariableStoreConnector variables = mock(VariableStoreConnector.class);
        given(connector.getConnector(VariableStoreConnector.class)).willReturn(variables);

        WebElement element = mock(WebElement.class);
        given(element.getText()).willReturn(NODE_VALUE);
        WebSiteConnector webSiteConnector = mock(WebSiteConnector.class);
        given(webSiteConnector.getElement(node)).willReturn(element);
        given(connector.getConnector(WebSiteConnector.class)).willReturn(webSiteConnector);

        ExecuteResult result = setAction.executeAction(connector);

        assertTrue(result.isSuccess());
        verify(variables).set(VARIABLE, NODE_VALUE);
    }

    @Test
    public void shouldReturnFailedIfTheNodeDoesNotExists() {
        ConnectorManager connector = mock(ConnectorManager.class);
        VariableStoreConnector variables = mock(VariableStoreConnector.class);
        given(connector.getConnector(VariableStoreConnector.class)).willReturn(variables);

        WebSiteConnector webSiteConnector = mock(WebSiteConnector.class);
        given(webSiteConnector.getElement(node)).willThrow(NoSuchElementException.class);
        given(connector.getConnector(WebSiteConnector.class)).willReturn(webSiteConnector);

        ExecuteResult result = setAction.executeAction(connector);

        assertFalse(result.isSuccess());
        verify(variables, never()).set(eq(VARIABLE), anyString());
    }

}
