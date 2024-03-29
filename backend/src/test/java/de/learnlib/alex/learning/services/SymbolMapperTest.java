/*
 * Copyright 2015 - 2022 TU Dortmund
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

package de.learnlib.alex.learning.services;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import de.learnlib.alex.data.entities.ExecuteResult;
import de.learnlib.alex.data.entities.ParameterizedSymbol;
import de.learnlib.alex.data.entities.Symbol;
import de.learnlib.alex.data.entities.SymbolInputParameter;
import de.learnlib.alex.data.entities.SymbolParameter;
import de.learnlib.alex.data.entities.SymbolParameterValue;
import java.util.Arrays;
import java.util.Collections;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

public class SymbolMapperTest {

    private ParameterizedSymbol ps1;

    private ParameterizedSymbol ps2;

    private SymbolMapper sm;

    @BeforeEach
    public void before() {
        final Symbol s1 = new Symbol();
        s1.setName("s1");
        s1.setId(1L);

        this.ps1 = new ParameterizedSymbol();
        this.ps1.setSymbol(s1);

        final Symbol s2 = new Symbol();
        s2.setName("s2");
        s2.setId(2L);

        final SymbolInputParameter input = new SymbolInputParameter();
        input.setName("in");
        input.setSymbol(s2);
        input.setParameterType(SymbolParameter.ParameterType.STRING);
        s2.setInputs(Collections.singletonList(input));

        this.ps2 = new ParameterizedSymbol();
        this.ps2.setSymbol(s2);

        final SymbolParameterValue value = new SymbolParameterValue();
        value.setParameter(input);
        value.setValue("test");
        ps2.setParameterValues(Collections.singletonList(value));

        this.sm = new SymbolMapper(Arrays.asList(ps1, ps2));
    }

    @Test
    public void shouldBeForkable() {
        assertTrue(sm.canFork());
    }

    @Test
    public void shouldMapInputStringToCorrectSymbol() {
        assertEquals(ps1, sm.mapInput("s1"));
        assertEquals(ps2, sm.mapInput("s2 <test>"));
    }

    @Test
    public void shouldMapOutputCorrectly() {
        final ExecuteResult result = new ExecuteResult();
        result.setSuccess(true);
        result.setMessage("ok");

        assertEquals("Ok (ok)", sm.mapOutput(result));
    }
}
