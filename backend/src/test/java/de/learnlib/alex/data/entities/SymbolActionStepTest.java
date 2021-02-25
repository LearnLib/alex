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

import de.learnlib.alex.data.entities.actions.web.ClickAction;
import de.learnlib.alex.learning.services.connectors.ConnectorManager;
import org.junit.Before;
import org.junit.Test;

import static org.junit.Assert.assertEquals;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.mock;

public class SymbolActionStepTest {

    private ConnectorManager connectors;

    private SymbolAction action;

    private SymbolActionStep step;

    @Before
    public void setup() {
        this.connectors = mock(ConnectorManager.class);
        this.action = mock(ClickAction.class);

        final Symbol symbol = new Symbol();
        symbol.setProject(new Project(1L));

        this.step = new SymbolActionStep();
        this.step.setAction(action);
        this.step.setSymbol(symbol);
        this.step.setNegated(false);
    }

    @Test
    public void shouldGetCorrectOutputOnSuccessAndNotNegated() {
        given(action.executeAction(connectors)).willReturn(new ExecuteResult(true));
        final ExecuteResult r1 = step.execute(0, connectors);

        assertEquals(ExecuteResult.DEFAULT_SUCCESS_OUTPUT, r1.getOutput());
    }

    @Test
    public void shouldGetCorrectOutputOnSuccessAndNegated() {
        step.setNegated(true);

        given(action.executeAction(connectors)).willReturn(new ExecuteResult(true));
        final ExecuteResult r1 = step.execute(0, connectors);

        assertEquals(ExecuteResult.DEFAULT_ERROR_OUTPUT + " (1)", r1.getOutput());
    }

    @Test
    public void shouldGetCorrectOutputOnFailureAndNotNegatedAndWithoutCustomMessage() {
        given(action.executeAction(connectors)).willReturn(new ExecuteResult(false));
        final ExecuteResult r1 = step.execute(0, connectors);

        assertEquals(ExecuteResult.DEFAULT_ERROR_OUTPUT + " (1)", r1.getOutput());
    }

    @Test
    public void shouldGetCorrectOutputOnFailureAndNotNegatedAndWithCustomMessage() {
        step.setErrorOutput("button not found");
        given(action.executeAction(connectors)).willReturn(new ExecuteResult(false));
        final ExecuteResult r2 = step.execute(0, connectors);

        assertEquals(ExecuteResult.DEFAULT_ERROR_OUTPUT + " (button not found)", r2.getOutput());
    }

    @Test
    public void shouldGetCorrectOutputOnFailureAndNegatedAndWithoutCustomMessage() {
        step.setNegated(true);

        given(action.executeAction(connectors)).willReturn(new ExecuteResult(false));
        final ExecuteResult r1 = step.execute(0, connectors);

        assertEquals(ExecuteResult.DEFAULT_SUCCESS_OUTPUT, r1.getOutput());
    }

    @Test
    public void shouldGetCorrectOutputOnFailureAndNegatedAndWithCustomMessage() {
        step.setNegated(true);

        step.setErrorOutput("button not found");
        given(action.executeAction(connectors)).willReturn(new ExecuteResult(false));
        final ExecuteResult r1 = step.execute(0, connectors);

        assertEquals(ExecuteResult.DEFAULT_SUCCESS_OUTPUT + " (button not found)", r1.getOutput());
    }

    @Test
    public void shouldCatchGlobalException() {
        given(action.executeAction(connectors)).willThrow(IllegalStateException.class);
        final ExecuteResult r1 = step.execute(0, connectors);
        assertEquals(ExecuteResult.DEFAULT_ERROR_OUTPUT + " (1)", r1.getOutput());
    }
}
