package de.learnlib.alex.core.entities;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import de.learnlib.alex.core.entities.learnlibproxies.eqproxies.CompleteExplorationEQOracleProxy;
import de.learnlib.alex.core.learner.connectors.WebSiteConnector;
import org.junit.Test;

import java.io.IOException;
import java.net.URISyntaxException;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

public class LearnerConfigurationTest {

    private static final int EQ_MIN_VALUE = 1;
    private static final int EQ_MAX_VALUE = 1;

    @Test
    public void shouldCreateTheCorrectDefaultJSON() throws JsonProcessingException {
        String expectedJSON = "{\"algorithm\":\"TTT\",\"browser\":\"htmlunitdriver\",\"comment\":\"\",\"eqOracle\":"
                                    + "{\"type\":\"random_word\",\"minLength\":" + EQ_MIN_VALUE + ","
                                + "\"maxLength\":" + EQ_MAX_VALUE + ",\"maxNoOfTests\":1},"
                                + "\"maxAmountOfStepsToLearn\":0,\"resetSymbol\":null,\"symbols\":[]}";

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
                                + "\"maxAmountOfStepsToLearn\":0,\"resetSymbol\":null,\"symbols\":[]}";

        LearnerConfiguration configuration = new LearnerConfiguration();
        configuration.setAlgorithm(LearnAlgorithms.DHC);
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

        ObjectMapper mapper = new ObjectMapper();
        LearnerConfiguration configuration = mapper.readValue(json, LearnerConfiguration.class);

        assertEquals(LearnAlgorithms.DHC, configuration.getAlgorithm());
        assertEquals(WebSiteConnector.WebBrowser.FIREFOX, configuration.getBrowser());
        assertTrue(configuration.getEqOracle() instanceof CompleteExplorationEQOracleProxy);
        assertEquals(2, configuration.getSymbolsAsIdRevisionPairs().size());
        assertEquals(Long.valueOf(1L), configuration.getSymbolsAsIdRevisionPairs().get(0).getId());
        assertEquals(Long.valueOf(1L), configuration.getSymbolsAsIdRevisionPairs().get(0).getRevision());
    }
}
