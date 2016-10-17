/*
 * Copyright 2016 TU Dortmund
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

package de.learnlib.alex.core.entities;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import de.learnlib.alex.core.entities.learnlibproxies.eqproxies.CompleteExplorationEQOracleProxy;
import de.learnlib.alex.core.learner.connectors.WebBrowser;
import org.junit.Test;

import java.io.IOException;
import java.net.URISyntaxException;
import java.util.LinkedList;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

public class LearnerConfigurationTest {

    private static final int EQ_MIN_VALUE = 1;
    private static final int EQ_MAX_VALUE = 1;

    private static final Algorithm ALGORITHM = new Algorithm("DHC", "");

    @Test
    public void shouldCreateTheCorrectDefaultJSON() throws JsonProcessingException {
        String expectedJSON = "{\"algorithm\":\"TTT\",\"browser\":\"htmlunitdriver\",\"comment\":\"\",\"eqOracle\":"
                                    + "{\"type\":\"random_word\",\"minLength\":" + EQ_MIN_VALUE + ","
                                + "\"maxLength\":" + EQ_MAX_VALUE + ",\"seed\":42,\"maxNoOfTests\":1},"
                                + "\"maxAmountOfStepsToLearn\":-1,\"project\":null,\"resetSymbol\":null,\"symbols\":[],"
                                + "\"user\":null}";

        LearnerConfiguration configuration = new LearnerConfiguration();

        ObjectMapper mapper = new ObjectMapper();
        String json = mapper.writeValueAsString(configuration);

        assertEquals(expectedJSON, json);
    }

    @Test
    public void shouldCreateTheCorrectJSON() throws JsonProcessingException {
        String expectedJSON = "{\"algorithm\":\"DHC\",\"browser\":\"htmlunitdriver\",\"comment\":\"test\",\"eqOracle\":"
                                + "{\"type\":\"complete\",\"minDepth\":" + EQ_MIN_VALUE + ","
                                    + "\"maxDepth\":" + EQ_MAX_VALUE + "},"
                                + "\"maxAmountOfStepsToLearn\":-1,\"project\":null,\"resetSymbol\":null,\"symbols\":[],"
                                + "\"user\":null}";

        LearnerConfiguration configuration = new LearnerConfiguration();

        configuration.setAlgorithm(ALGORITHM);
        configuration.setEqOracle(new CompleteExplorationEQOracleProxy(EQ_MIN_VALUE, EQ_MAX_VALUE));
        configuration.setComment("test");

        ObjectMapper mapper = new ObjectMapper();
        String json = mapper.writeValueAsString(configuration);

        assertEquals(expectedJSON, json);
    }

    @Test
    public void shouldReadJSONCorrectly() throws IOException, URISyntaxException {
        String json = "{\"symbols\": ["
                            + "{\"id\": 1, \"revision\": 1},"
                            + "{\"id\": 2, \"revision\": 4}"
                        + "],\"algorithm\":\"DHC\", \"browser\": \"firefox\", \"eqOracle\": {\"type\": \"complete\"}}";
        //
        ObjectMapper mapper = new ObjectMapper();

        LearnerConfiguration configuration = mapper.readValue(json, LearnerConfiguration.class);

        assertEquals(ALGORITHM, configuration.getAlgorithm());
        assertEquals(WebBrowser.FIREFOX, configuration.getBrowser());
        assertTrue(configuration.getEqOracle() instanceof CompleteExplorationEQOracleProxy);
        assertEquals(2, configuration.getSymbolsAsIdRevisionPairs().size());
        LinkedList<IdRevisionPair> idRevisionPairs = new LinkedList<>(configuration.getSymbolsAsIdRevisionPairs());
        assertEquals(Long.valueOf(1L), idRevisionPairs.get(0).getId());
        assertEquals(Long.valueOf(1L), idRevisionPairs.get(0).getRevision());
    }
}
