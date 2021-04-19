/*
 * Copyright 2015 - 2021 TU Dortmund
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

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.lenient;
import static org.mockito.Mockito.mock;

import de.learnlib.alex.data.entities.actions.web.CheckTextWebAction;
import de.learnlib.alex.learning.services.connectors.ConnectorManager;
import de.learnlib.alex.learning.services.connectors.CounterStoreConnector;
import de.learnlib.alex.learning.services.connectors.VariableStoreConnector;
import de.learnlib.alex.learning.services.connectors.WebSiteConnector;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.openqa.selenium.WebDriver;

@ExtendWith(MockitoExtension.class)
public class SymbolTest {

    private static final Long PROJECT_ID = 1L;

    private WebSiteConnector webSiteConnector;
    private ConnectorManager connectorManager;

    private Symbol symbol;

    private CheckTextWebAction a1;

    private SymbolActionStep actionStep;
    private SymbolPSymbolStep symbolStep;

    private ParameterizedSymbol pSymbol;

    @BeforeEach
    public void setUp() {
        symbol = new Symbol();
        symbol.setProject(new Project(PROJECT_ID));

        a1 = new CheckTextWebAction();
        a1.setRegexp(false);
        a1.setValue("test");
        a1.setSymbol(symbol);

        actionStep = new SymbolActionStep(a1);
        actionStep.setSymbol(symbol);

        final Symbol s = new Symbol();
        s.setProject(new Project(PROJECT_ID));
        s.getSteps().add(new SymbolActionStep(a1));

        pSymbol = new ParameterizedSymbol();
        pSymbol.setSymbol(s);

        symbolStep = new SymbolPSymbolStep();
        symbolStep.setSymbol(symbol);
        symbolStep.setPSymbol(pSymbol);

        symbol.getSteps().add(actionStep);
        symbol.getSteps().add(symbolStep);

        connectorManager = mock(ConnectorManager.class);
        webSiteConnector = mock(WebSiteConnector.class);

        lenient().when(connectorManager.getConnector(WebSiteConnector.class)).thenReturn(webSiteConnector);
        lenient().when(connectorManager.getConnector(VariableStoreConnector.class)).thenReturn(mock(VariableStoreConnector.class));
        lenient().when(connectorManager.getConnector(CounterStoreConnector.class)).thenReturn(mock(CounterStoreConnector.class));
        given(webSiteConnector.getDriver()).willReturn(mock(WebDriver.class));
    }

    @Test
    public void shouldReturnOkOnSuccessAndNoCustomOutput() {
        given(webSiteConnector.getDriver().getPageSource()).willReturn("test");

        ExecuteResult result = symbol.execute(connectorManager);

        assertTrue(result.isSuccess());
        assertEquals(result.getOutput(), ExecuteResult.DEFAULT_SUCCESS_OUTPUT);
    }

    @Test
    public void shouldReturnACustomOutputOnSuccess() {
        given(webSiteConnector.getDriver().getPageSource()).willReturn("test");

        symbol.setSuccessOutput("success");
        ExecuteResult result = symbol.execute(connectorManager);

        assertTrue(result.isSuccess());
        assertEquals(ExecuteResult.DEFAULT_SUCCESS_OUTPUT + " (success)", result.getOutput());
    }

    @Test
    public void shouldReturnFailedOnErrorAndNoCustomOutput() {
        given(webSiteConnector.getDriver().getPageSource()).willReturn("something");

        ExecuteResult result = symbol.execute(connectorManager);

        assertFalse(result.isSuccess());
        assertEquals(ExecuteResult.DEFAULT_ERROR_OUTPUT + " (1)", result.getOutput());
    }

    @Test
    public void shouldReturnFailedOnErrorAndCustomOutput() {
        actionStep.setErrorOutput("not found");
        given(webSiteConnector.getDriver().getPageSource()).willReturn("something");

        ExecuteResult result = symbol.execute(connectorManager);

        assertFalse(result.isSuccess());
        assertEquals(ExecuteResult.DEFAULT_ERROR_OUTPUT + " (not found)", result.getOutput());
    }
}
