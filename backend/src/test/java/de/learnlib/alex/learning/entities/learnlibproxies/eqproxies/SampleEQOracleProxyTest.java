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

package de.learnlib.alex.learning.entities.learnlibproxies.eqproxies;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.Before;
import org.junit.Test;

import java.util.LinkedList;
import java.util.List;

import static org.junit.Assert.assertEquals;


public class SampleEQOracleProxyTest {

    private SampleEQOracleProxy eqOracle;

    @Before
    public void setUp() {
        List<SampleEQOracleProxy.InputOutputPair> counterExample1 = new LinkedList<>();
        counterExample1.add(new SampleEQOracleProxy.InputOutputPair("input1", "output1"));
        counterExample1.add(new SampleEQOracleProxy.InputOutputPair("input2", "output2"));
        List<SampleEQOracleProxy.InputOutputPair> counterExample2 = new LinkedList<>();
        counterExample2.add(new SampleEQOracleProxy.InputOutputPair("input3", "output3"));
        counterExample2.add(new SampleEQOracleProxy.InputOutputPair("input4", "output4"));

        eqOracle = new SampleEQOracleProxy();
        eqOracle.addCounterExample(counterExample1);
        eqOracle.addCounterExample(counterExample2);
    }

    @Test
    public void shouldCreateCorrectJSON() throws JsonProcessingException {
        ObjectMapper mapper = new ObjectMapper();
        String actualJSON = mapper.writeValueAsString(eqOracle);

        String expectedJSON  = "{\"type\":\"sample\",\"counterExamples\":["
                                    + "[{\"input\":\"input1\",\"output\":\"output1\"},"
                                        + "{\"input\":\"input2\",\"output\":\"output2\"}],"
                                    + "[{\"input\":\"input3\",\"output\":\"output3\"}"
                                        + ",{\"input\":\"input4\",\"output\":\"output4\"}]"
                                + "]}";
        assertEquals(expectedJSON, actualJSON);
    }

    @Test
    public void ensureThatIfTheParametersAreValidNoExceptionWillBeThrown() {
        eqOracle.checkParameters(); // nothing should happen
    }

    @Test(expected = IllegalArgumentException.class)
    public void ensureThatIfTheParametersAreInvalidAnExceptionWillBeThrown() {
        eqOracle.getCounterExamples().clear();

        eqOracle.checkParameters(); // should fail
    }

}
