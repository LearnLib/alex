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

package de.learnlib.alex.data.entities;

import de.learnlib.alex.data.entities.actions.web.CheckTextWebAction;
import de.learnlib.alex.learning.services.connectors.ConnectorManager;
import de.learnlib.alex.learning.services.connectors.CounterStoreConnector;
import de.learnlib.alex.learning.services.connectors.VariableStoreConnector;
import de.learnlib.alex.learning.services.connectors.WebSiteConnector;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.junit.MockitoJUnitRunner;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.mock;

@RunWith(MockitoJUnitRunner.class)
public class SymbolTest {

    private static final Long PROJECT_ID = 1L;

    private WebSiteConnector webSiteConnector;
    private ConnectorManager connectorManager;

    private Symbol symbol;

    private CheckTextWebAction a1;

    @Before
    public void setUp() {
        a1 = new CheckTextWebAction();
        a1.setIgnoreFailure(false);
        a1.setRegexp(false);
        a1.setValue("test");

        symbol = new Symbol();
        symbol.getSteps().add(new SymbolActionStep(a1));
        symbol.setProject(new Project(PROJECT_ID));
        a1.setSymbol(symbol);

        connectorManager = mock(ConnectorManager.class);
        webSiteConnector = mock(WebSiteConnector.class);

        given(connectorManager.getConnector(WebSiteConnector.class)).willReturn(webSiteConnector);
        given(connectorManager.getConnector(VariableStoreConnector.class)).willReturn(mock(VariableStoreConnector.class));
        given(connectorManager.getConnector(CounterStoreConnector.class)).willReturn(mock(CounterStoreConnector.class));
    }

    @Test
    public void itShouldReturnOkOnSuccessAndNoCustomOutput() {
        given(webSiteConnector.getPageSource()).willReturn("test");

        ExecuteResult result = symbol.execute(connectorManager);

        assertTrue(result.isSuccess());
        assertEquals(result.getOutput(), ExecuteResult.DEFAULT_SUCCESS_OUTPUT);
    }

    @Test
    public void itShouldReturnACustomOutputOnSuccess() {
        String output = "Ok (success)";

        given(webSiteConnector.getPageSource()).willReturn("test");

        symbol.setSuccessOutput("success");
        ExecuteResult result = symbol.execute(connectorManager);

        assertTrue(result.isSuccess());
        assertEquals(output, result.getOutput());
    }

    @Test
    public void itShouldReturnFailedOnErrorAndNoCustomOutput() {
        // let the first action fail
        given(webSiteConnector.getPageSource()).willReturn("something");

        ExecuteResult result = symbol.execute(connectorManager);

        assertFalse(result.isSuccess());
        assertEquals(ExecuteResult.DEFAULT_ERROR_OUTPUT + " (1)", result.getOutput() );
    }

    @Test
    public void itShouldReturnCustomOutputOnError() {
        String output = "Failed (textNotFound)";
        a1.setErrorOutput("textNotFound");

        // let the first action fail
        given(webSiteConnector.getPageSource()).willReturn("something");

        ExecuteResult result = symbol.execute(connectorManager);

        assertFalse(result.isSuccess());
        assertEquals(output, result.getOutput());
    }
}
