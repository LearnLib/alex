/*
 * Copyright 2015 - 2020 TU Dortmund
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

import org.junit.Test;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNull;

public class ParameterizedSymbolTest {

    @Test
    public void shouldCloneAParameterizedSymbol() {
        final ParameterizedSymbol ps = createDefaultPSymbol();
        final ParameterizedSymbol copy = ps.copy();

        assertNull(copy.getId());
        assertEquals(ps.getSymbol(), copy.getSymbol());
        copy.getParameterValues().forEach(pv -> assertNull(pv.getId()));
    }

    @Test
    public void shouldGetTheComputedName() {
        final ParameterizedSymbol ps = createDefaultPSymbol();
        assertEquals("s1 <v1, v2>", ps.getAliasOrComputedName());
    }

    @Test
    public void shouldIgnoreNullParametersInComputedName() {
        final SymbolInputParameter privateParam1 = new SymbolInputParameter();
        privateParam1.setName("privateString");
        privateParam1.setParameterType(SymbolParameter.ParameterType.STRING);

        final SymbolInputParameter privateParam2 = new SymbolInputParameter();
        privateParam2.setName("privateCounter");
        privateParam2.setParameterType(SymbolParameter.ParameterType.COUNTER);

        final SymbolParameterValue value1 = new SymbolParameterValue();
        value1.setValue(null);
        value1.setParameter(privateParam1);

        final SymbolParameterValue value2 = new SymbolParameterValue();
        value2.setValue(null);
        value2.setParameter(privateParam2);

        final ParameterizedSymbol ps = createDefaultPSymbol();
        ps.getParameterValues().addAll(Arrays.asList(value1, value2));

        assertEquals("s1 <v1, v2>", ps.getAliasOrComputedName());
    }

    @Test
    public void shouldNotDisplayArrowsInComputedNameIfParameterValuesAreEmpty() {
        final ParameterizedSymbol ps = createDefaultPSymbol();
        ps.setParameterValues(new ArrayList<>());

        assertEquals("s1", ps.getAliasOrComputedName());
    }

    private ParameterizedSymbol createDefaultPSymbol() {
        final Symbol symbol = new Symbol();
        symbol.setName("s1");
        symbol.setId(0L);

        final SymbolInputParameter parameter1 = new SymbolInputParameter();
        parameter1.setSymbol(symbol);
        parameter1.setId(0L);
        parameter1.setName("input1");
        parameter1.setParameterType(SymbolParameter.ParameterType.STRING);

        final SymbolInputParameter parameter2 = new SymbolInputParameter();
        parameter2.setSymbol(symbol);
        parameter2.setId(1L);
        parameter2.setName("input2");
        parameter2.setParameterType(SymbolParameter.ParameterType.COUNTER);

        final List<SymbolParameterValue> values = new ArrayList<>();

        final SymbolParameterValue v1 = new SymbolParameterValue();
        v1.setValue("v1");
        v1.setId(1L);
        v1.setParameter(parameter1);
        values.add(v1);

        final SymbolParameterValue v2 = new SymbolParameterValue();
        v2.setValue("v2");
        v2.setId(2L);
        v2.setParameter(parameter2);
        values.add(v2);

        final ParameterizedSymbol ps = new ParameterizedSymbol();
        ps.setId(0L);
        ps.setSymbol(symbol);
        ps.setParameterValues(values);

        return ps;
    }
}
