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

package de.learnlib.alex.learning.entities;

import com.fasterxml.jackson.databind.ObjectMapper;
import de.learnlib.alex.learning.entities.algorithms.AbstractLearningAlgorithm;
import de.learnlib.alex.learning.entities.algorithms.DHC;
import de.learnlib.alex.learning.entities.algorithms.TTT;
import de.learnlib.alex.learning.entities.learnlibproxies.eqproxies.CompleteExplorationEQOracleProxy;
import org.junit.Test;
import org.skyscreamer.jsonassert.JSONAssert;

import java.io.IOException;
import java.net.URISyntaxException;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

public class AbstractLearnerConfigurationTest {

    private static final int EQ_MIN_VALUE = 1;
    private static final int EQ_MAX_VALUE = 1;

    private static final AbstractLearningAlgorithm<String, String> ALGORITHM = new TTT();

    private final String driverConfig = "{\"name\":\"htmlUnit\",\"height\":0,\"implicitlyWait\":0,\"pageLoadTimeout\":10,\"scriptTimeout\":10,\"width\":0}";

    @Test
    public void shouldCreateTheCorrectDefaultJSON() throws Exception {
        String expectedJSON = "{\"algorithm\":{\"name\":\"TTT\"},"
                + "\"comment\":\"\","
                + "\"driverConfig\":" + driverConfig + ","
                + "\"eqOracle\":"
                + "{\"type\":\"random_word\",\"minLength\":" + EQ_MIN_VALUE + ","
                + "\"maxLength\":" + EQ_MAX_VALUE + ",\"seed\":42,\"maxNoOfTests\":1},"
                + "\"maxAmountOfStepsToLearn\":-1,\"project\":null,\"resetSymbol\":null,\"postSymbol\":null,\"symbols\":[],"
                + "\"urls\":[],"
                + "\"useMQCache\":true,\"user\":null}";

        LearnerStartConfiguration configuration = new LearnerStartConfiguration();

        ObjectMapper mapper = new ObjectMapper();
        String json = mapper.writeValueAsString(configuration);

        System.out.println(expectedJSON);
        System.out.println(json);

        JSONAssert.assertEquals(expectedJSON, json, true);
    }

    @Test
    public void shouldCreateTheCorrectJSON() throws Exception {
        String expectedJSON = "{\"algorithm\":{\"name\":\"TTT\"},"
                + "\"comment\":\"test\","
                + "\"driverConfig\":" + driverConfig + ","
                + "\"eqOracle\":{\"type\":\"complete\",\"minDepth\":" + EQ_MIN_VALUE + ",\"maxDepth\":" + EQ_MAX_VALUE + "},"
                + "\"maxAmountOfStepsToLearn\":-1,"
                + "\"project\":null,"
                + "\"resetSymbol\":null,"
                + "\"postSymbol\":null,"
                + "\"symbols\":[],"
                + "\"urls\":[],"
                + "\"useMQCache\":true,"
                + "\"user\":null}";

        LearnerStartConfiguration configuration = new LearnerStartConfiguration();

        configuration.setAlgorithm(ALGORITHM);
        configuration.setEqOracle(new CompleteExplorationEQOracleProxy(EQ_MIN_VALUE, EQ_MAX_VALUE));
        configuration.setComment("test");

        ObjectMapper mapper = new ObjectMapper();
        String json = mapper.writeValueAsString(configuration);

        JSONAssert.assertEquals(expectedJSON, json, true);
    }

    @Test
    public void shouldReadJSONCorrectly() throws IOException, URISyntaxException {
        String json = "{\"symbols\": [{\"symbol\":{\"id\":1}, \"parameterValues\":[]},{\"symbol\":{\"id\":2}, \"parameterValues\":[]}],\"algorithm\":{\"name\":\"DHC\"}, "
                + "\"driverConfig\":" + driverConfig + ","
                + "\"eqOracle\":{\"type\": \"complete\"}}";

        ObjectMapper mapper = new ObjectMapper();

        LearnerStartConfiguration configuration = mapper.readValue(json, LearnerStartConfiguration.class);

        assertEquals(DHC.class, configuration.getAlgorithm().getClass());
        assertTrue(configuration.getEqOracle() instanceof CompleteExplorationEQOracleProxy);
        assertEquals(2, configuration.getSymbols().size());
    }
}
