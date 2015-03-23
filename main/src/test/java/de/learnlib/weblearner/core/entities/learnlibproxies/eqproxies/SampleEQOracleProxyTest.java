package de.learnlib.weblearner.core.entities.learnlibproxies.eqproxies;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.Before;
import org.junit.Test;

import java.io.IOException;
import java.util.Arrays;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;


public class SampleEQOracleProxyTest {

    private SampleEQOracleProxy eqOracle;

    @Before
    public void setUp() {
        SampleEQOracleProxy.SampleCounterExample counterExample = new SampleEQOracleProxy.SampleCounterExample();
        counterExample.setInput(Arrays.asList(new String[]{"input1", "input2"}));
        counterExample.setOutput(Arrays.asList(new String[]{"output1", "output2"}));
        eqOracle = new SampleEQOracleProxy();
        eqOracle.addCounterExample(counterExample);
    }

    @Test
    public void shouldCreateCorrectJSON() throws JsonProcessingException {
        ObjectMapper mapper = new ObjectMapper();
        String actualJSON = mapper.writeValueAsString(eqOracle);

        String expectedJSON  = "{\"type\":\"sample\",\"counterExamples\":[{\"input\":[\"input1\",\"input2\"],"
                                                                         + "\"output\":[\"output1\",\"output2\"]}]}";
        assertEquals(expectedJSON, actualJSON);
    }

    @Test
    public void ensureThatIfTheParametersAreValidNoExceptionWillBeThrown() {
        eqOracle.checkParameters(); // nothing should happen
    }

    @Test(expected = IllegalArgumentException.class)
    public void ensureThatIfTheParametersAreInvalidAnExceptionWillBeThrown() {
        SampleEQOracleProxy.SampleCounterExample counterExample = new SampleEQOracleProxy.SampleCounterExample();
        counterExample.setInput(Arrays.asList(new String[]{"input1", "input2"}));
        counterExample.setOutput(Arrays.asList(new String[]{"output1"}));
        eqOracle.addCounterExample(counterExample);

        eqOracle.checkParameters(); // should fail
    }

    @Test
    public void shouldCreateEqOracleWithEmptyInputAndOutputFromJSON() throws IOException {
        String json = "{ \"type\": \"sample\", \"counterExamples\": [{ \"input\": [], \"output\": [] }] }";

        ObjectMapper mapper = new ObjectMapper();
        AbstractEquivalenceOracleProxy eqOracle = mapper.readValue(json, AbstractEquivalenceOracleProxy.class);
        assertTrue(eqOracle instanceof SampleEQOracleProxy);
        SampleEQOracleProxy sampleEQOracle = (SampleEQOracleProxy) eqOracle;
        assertEquals(1, sampleEQOracle.getCounterExamples().size());
        assertEquals(0, sampleEQOracle.getCounterExamples().get(0).getInput().size());
        assertEquals(0, sampleEQOracle.getCounterExamples().get(0).getOutput().size());
    }
}
