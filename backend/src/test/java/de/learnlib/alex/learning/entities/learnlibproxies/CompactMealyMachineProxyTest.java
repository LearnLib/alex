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

package de.learnlib.alex.learning.entities.learnlibproxies;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;

import com.fasterxml.jackson.databind.ObjectMapper;
import net.automatalib.automata.transducers.impl.compact.CompactMealy;
import net.automatalib.util.automata.Automata;
import net.automatalib.words.Alphabet;
import net.automatalib.words.impl.Alphabets;
import org.junit.jupiter.api.Test;
import org.skyscreamer.jsonassert.JSONAssert;

public class CompactMealyMachineProxyTest {

    private final Alphabet<String> alphabet = Alphabets.fromArray("a", "b");

    @Test
    public void shouldSerializeCorrectly() throws Exception {
        final CompactMealy<String, String> mealy = createMealy();
        final CompactMealyMachineProxy mealyProxy = CompactMealyMachineProxy.createFrom(mealy, alphabet);

        final ObjectMapper om = new ObjectMapper();
        final String mealyString = om.writeValueAsString(mealyProxy);
        final String expectedMealyString = "{\"nodes\":[0,1]"
                + ",\"initNode\":0"
                + ",\"edges\":["
                + " {\"from\":0,\"input\":\"a\",\"to\":0,\"output\":\"1\"}"
                + ",{\"from\":0,\"input\":\"b\",\"to\":1,\"output\":\"2\"}"
                + ",{\"from\":1,\"input\":\"a\",\"to\":1,\"output\":\"1\"}"
                + ",{\"from\":1,\"input\":\"b\",\"to\":0,\"output\":\"2\"}]}";

        JSONAssert.assertEquals(expectedMealyString, mealyString, true);
    }

    @Test
    public void shouldGetCorrectInputAlphabet() {
        final CompactMealy<String, String> mealy = createMealy();
        final CompactMealyMachineProxy mealyProxy = CompactMealyMachineProxy.createFrom(mealy, alphabet);
        final Alphabet<String> alph = mealyProxy.createAlphabet();
        assertEquals(alphabet, alph);
    }

    @Test
    public void shouldCreateCorrectCompactMealyFromProxy() {
        final CompactMealy<String, String> mealy = createMealy();
        final CompactMealyMachineProxy mealyProxy = CompactMealyMachineProxy.createFrom(mealy, alphabet);

        final Alphabet<String> alph = mealyProxy.createAlphabet();
        final CompactMealy<String, String> mealy1 = mealyProxy.createMealyMachine(alph);

        assertNull(Automata.findSeparatingWord(mealy1, mealy, alph));
    }

    private CompactMealy<String, String> createMealy() {
        final CompactMealy<String, String> mealy = new CompactMealy<>(alphabet);
        final int s0 = mealy.addState();
        final int s1 = mealy.addState();
        mealy.setInitialState(s0);
        mealy.setTransition(s0, "a", s0, "1");
        mealy.setTransition(s1, "b", s0, "2");
        mealy.setTransition(s1, "a", s1, "1");
        mealy.setTransition(s0, "b", s1, "2");
        return mealy;
    }
}
