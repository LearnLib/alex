package de.learnlib.weblearner.entities;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import de.learnlib.weblearner.entities.learnlibproxies.eqproxies.CompleteExplorationEQOracleProxy;
import net.automatalib.automata.transout.impl.compact.CompactMealy;
import net.automatalib.words.Alphabet;
import net.automatalib.words.impl.SimpleAlphabet;
import org.junit.Test;

import java.lang.reflect.Method;
import java.util.Date;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.mock;

public class LearnerResultTest {

    private static final long PROJECT_ID = 3;
    private static final long ID = 3;
    private static final long STEP_NO = 3;
    private static final Date TEST_DATE = new Date(0);
    private static final long TEST_DURATION = 9001;
    public static final int TEST_RESET_AMOUNT = 123;
    private static final String EXPECTED_JSON = "{\"amountOfResets\":0,\"configuration\":{"
                                                    + "\"algorithm\":\"EXTENSIBLE_LSTAR\",\"eqOracle\":"
                                                    + "{\"type\":\"random_word\",\"minLength\":1,\"maxLength\":1,"
                                                    + "\"maxNoOfTests\":1},\"maxAmountOfStepsToLearn\":0,"
                                                    + "\"symbols\":[]},"
                                                + "\"duration\":" + TEST_DURATION + ",\"hypothesis\":{"
                                                    + "\"nodes\":[0,1],\"initNode\":0,\"edges\":["
                                                        + "{\"from\":0,\"input\":\"0\",\"to\":0,\"output\":\"OK\"},"
                                                        + "{\"from\":0,\"input\":\"1\",\"to\":1,\"output\":\"OK\"},"
                                                        + "{\"from\":1,\"input\":\"0\",\"to\":1,\"output\":\"OK\"},"
                                                        + "{\"from\":1,\"input\":\"1\",\"to\":0,\"output\":\"OK\"}"
                                                + "]},\"project\":" + PROJECT_ID + ",\"sigma\":[\"0\",\"1\"],"
                                                + "\"startTime\":\"1970-01-01T00:00:00.000+00:00\","
                                                + "\"stepNo\":" + STEP_NO + ",\"testNo\":" + ID + "}";

    @Test
    public void shouldCreateTheCorrectJSON() throws JsonProcessingException {
        Alphabet<String> sigma = new SimpleAlphabet<>();
        sigma.add("0");
        sigma.add("1");

        CompactMealy<String, String> hypothesis = new CompactMealy<>(sigma);
        int state0 = hypothesis.addInitialState();
        int state1 = hypothesis.addState();

        hypothesis.addTransition(state0, "0", state0, "OK");
        hypothesis.addTransition(state0, "1", state1, "OK");
        hypothesis.addTransition(state1, "1", state0, "OK");
        hypothesis.addTransition(state1, "0", state1, "OK");

        Project project = mock(Project.class);
        given(project.getId()).willReturn(PROJECT_ID);

        LearnerResult result = new LearnerResult();
        result.setProject(project);
        result.setTestNo(ID);
        result.setStepNo(STEP_NO);
        result.setStartTime(TEST_DATE);
        result.setDuration(TEST_DURATION);
        result.setSigma(sigma);
        result.createHypothesisFrom(hypothesis);

        ObjectMapper mapper = new ObjectMapper();
        String json = mapper.writeValueAsString(result);

        assertEquals(EXPECTED_JSON, json);
    }

    @Test
    public void shouldReadAndParseJSONCorrectly() throws Exception {
        String json = "{\"amountOfResets\": " + TEST_RESET_AMOUNT + ", \"configuration\":{"
                            + "\"algorithm\":\"DHC\", \"eqOracle\": {\"type\": \"complete\"},"
                            + "\"maxAmountOfStepsToLearn\":0,\"symbols\":[]},"
                        + "\"duration\": " + TEST_DURATION + ", \"hypothesis\": {"
                            + "\"nodes\": [0, 1], \"edges\": ["
                                + "{\"from\": 0, \"input\": 1, \"to\": 0, \"output\": \"OK\"},"
                                + "{\"from\": 0, \"input\": 2, \"to\": 1, \"output\": \"OK\"}"
                        + "]},"
                        + "\"testNo\":" + ID + ",\"project\":" + PROJECT_ID + ","
                        + "\"sigma\":[\"0\",\"1\"],\"stepNo\":" + STEP_NO + ","
                        + "\"startTime\": \"1970-01-01T00:00:00.000+00:00\"}";

        LearnerResult result = new LearnerResult();
        Method method = LearnerResult.class.getDeclaredMethod("setJSON", String.class);
        method.setAccessible(true);
        method.invoke(result, json);

        assertEquals(PROJECT_ID, result.getProjectId());
        assertEquals(ID, result.getTestNo());
        assertEquals(STEP_NO, result.getStepNo());
        assertEquals(TEST_DATE, result.getStartTime());
        assertEquals(TEST_DURATION, result.getDuration());
        assertEquals(TEST_RESET_AMOUNT, result.getAmountOfResets());
        assertEquals(LearnAlgorithms.DHC, result.getConfiguration().getAlgorithm());
        assertTrue(result.getConfiguration().getEqOracle() instanceof CompleteExplorationEQOracleProxy);
        assertEquals(2, result.getSigma().size());
        assertEquals(2, result.getHypothesis().getNodes().size());
        assertEquals(2, result.getHypothesis().getEdges().size());
    }

}
