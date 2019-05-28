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

package de.learnlib.alex.data.entities;

import de.learnlib.alex.learning.services.connectors.ConnectorManager;
import org.junit.Before;
import org.junit.Test;

import static org.junit.Assert.assertEquals;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.mock;

public class SymbolPSymbolStepTest {

    private ConnectorManager connectors;

    private SymbolPSymbolStep step;

    private ParameterizedSymbol pSymbol;

    @Before
    public void setup() {
        this.connectors = mock(ConnectorManager.class);
        this.pSymbol = mock(ParameterizedSymbol.class);

        final Symbol symbol = new Symbol();
        symbol.setProject(new Project(1L));

        this.step = new SymbolPSymbolStep();
        this.step.setSymbol(symbol);
        this.step.setPSymbol(pSymbol);
    }

    @Test
    public void shouldGetCorrectOutputOnSuccessAndNotNegatedAndWithoutCustomMessage() {
        given(pSymbol.execute(connectors)).willReturn(new ExecuteResult(true));
        final ExecuteResult r1 = step.execute(0, connectors);

        assertEquals(ExecuteResult.DEFAULT_SUCCESS_OUTPUT, r1.getOutput());
    }

    @Test
    public void shouldGetCorrectOutputOnSuccessAndNotNegatedAndWithCustomMessage() {
        given(pSymbol.execute(connectors)).willReturn(new ExecuteResult(true, "login successful"));
        final ExecuteResult r1 = step.execute(0, connectors);

        assertEquals(ExecuteResult.DEFAULT_SUCCESS_OUTPUT + " (login successful)", r1.getOutput());
    }

    @Test
    public void shouldGetCorrectOutputOnSuccessAndNegatedAndWithoutCustomMessage() {
        step.setNegated(true);

        given(pSymbol.execute(connectors)).willReturn(new ExecuteResult(true));
        final ExecuteResult r1 = step.execute(0, connectors);

        assertEquals(ExecuteResult.DEFAULT_ERROR_OUTPUT + " (1)", r1.getOutput());
    }

    @Test
    public void shouldGetCorrectOutputOnSuccessAndNegatedAndWithCustomMessage() {
        step.setNegated(true);

        given(pSymbol.execute(connectors)).willReturn(new ExecuteResult(true, "login successful"));
        final ExecuteResult r1 = step.execute(0, connectors);

        assertEquals(ExecuteResult.DEFAULT_ERROR_OUTPUT + " (login successful)", r1.getOutput());
    }

    @Test
    public void shouldGetCorrectOutputOnFailureAndNotNegated() {
        given(pSymbol.execute(connectors)).willReturn(new ExecuteResult(false));
        final ExecuteResult r1 = step.execute(0, connectors);

        assertEquals(ExecuteResult.DEFAULT_ERROR_OUTPUT + " (1)", r1.getOutput());
    }

    @Test
    public void shouldGetCorrectOutputOnFailureAndNegated() {
        step.setNegated(true);

        given(pSymbol.execute(connectors)).willReturn(new ExecuteResult(false));
        final ExecuteResult r1 = step.execute(0, connectors);

        assertEquals(ExecuteResult.DEFAULT_SUCCESS_OUTPUT, r1.getOutput());
    }

    @Test
    public void shouldCatchGlobalException() {
        given(pSymbol.execute(connectors)).willThrow(IllegalStateException.class);
        final ExecuteResult r1 = step.execute(0, connectors);
        assertEquals(ExecuteResult.DEFAULT_ERROR_OUTPUT + " (1)", r1.getOutput());
    }
}
