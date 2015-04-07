package de.learnlib.alex.core.entities;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import de.learnlib.alex.core.entities.learnlibproxies.eqproxies.CompleteExplorationEQOracleProxy;
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

    private static final Long PROJECT_ID = 3L;
    private static final Long ID = 3L;
    private static final Long STEP_NO = 3L;
    private static final Date TEST_DATE = new Date(0);
    private static final long TEST_DURATION = 9001;
    public static final int TEST_RESET_AMOUNT = 123;
    private static final String EXPECTED_JSON = "{\"configuration\":{"
                                                    + "\"algorithm\":\"TTT\",\"eqOracle\":"
                                                    + "{\"type\":\"random_word\",\"minLength\":1,\"maxLength\":1,"
                                                    + "\"maxNoOfTests\":1},\"maxAmountOfStepsToLearn\":0,"
                                                    + "\"resetSymbol\":null,\"symbols\":[]},"
                                                + "\"counterExample\":\"\",\"hypothesis\":{"
                                                    + "\"nodes\":[0,1],\"initNode\":0,\"edges\":["
                                                        + "{\"from\":0,\"input\":\"0\",\"to\":0,\"output\":\"OK\"},"
                                                        + "{\"from\":0,\"input\":\"1\",\"to\":1,\"output\":\"OK\"},"
                                                        + "{\"from\":1,\"input\":\"0\",\"to\":1,\"output\":\"OK\"},"
                                                        + "{\"from\":1,\"input\":\"1\",\"to\":0,\"output\":\"OK\"}"
                                                + "]},"
                                                + "\"project\":" + PROJECT_ID + ",\"sigma\":[\"0\",\"1\"],"
                                                + "\"statistics\":{"
                                                    + "\"duration\":" + TEST_DURATION + ",\"eqsUsed\":0,\"mqsUsed\":0,"
                                                    + "\"startTime\":\"1970-01-01T00:00:00.000+00:00\""
                                                    + ",\"symbolsUsed\":0"
                                                + "},"
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

        LearnerResult.Statistics statistics = new LearnerResult.Statistics();
        statistics.setStartTime(TEST_DATE);
        statistics.setDuration(TEST_DURATION);

        LearnerResult result = new LearnerResult();
        result.setProject(project);
        result.setTestNo(ID);
        result.setStepNo(STEP_NO);
        result.setStatistics(statistics);
        result.setSigma(sigma);
        result.createHypothesisFrom(hypothesis);

        ObjectMapper mapper = new ObjectMapper();
        String json = mapper.writeValueAsString(result);

        assertEquals(EXPECTED_JSON, json);
    }

    @Test
    public void shouldReadAndParseJSONCorrectly() throws Exception {
        String json = "{\"configuration\":{"
                            + "\"algorithm\":\"DHC\", \"eqOracle\": {\"type\": \"complete\"},"
                            + "\"maxAmountOfStepsToLearn\":0,\"symbols\":[]},"
                        + "\"hypothesis\": {"
                            + "\"nodes\": [0, 1], \"edges\": ["
                                + "{\"from\": 0, \"input\": 1, \"to\": 0, \"output\": \"OK\"},"
                                + "{\"from\": 0, \"input\": 2, \"to\": 1, \"output\": \"OK\"}"
                        + "]},"
                        + "\"testNo\":" + ID + ",\"project\":" + PROJECT_ID + ","
                        + "\"sigma\":[\"0\",\"1\"],\"stepNo\":" + STEP_NO + ", \"statistics\": {"
                            + "\"eqsUsed\":123, \"duration\": " + TEST_DURATION + ", \"mqsUsed\":0,"
                            + "\"startTime\": \"1970-01-01T00:00:00.000+00:00\",\"symbolsUsed\":0}"
                        +"}";

        LearnerResult resultFromJSON = new LearnerResult();
        Method method = LearnerResult.class.getDeclaredMethod("setJSON", String.class);
        method.setAccessible(true);
        method.invoke(resultFromJSON, json);

        LearnerResult.Statistics statistics = new LearnerResult.Statistics();
        statistics.setEqsUsed(123);
        statistics.setStartTime(TEST_DATE);
        statistics.setDuration(TEST_DURATION);

        assertEquals(PROJECT_ID, resultFromJSON.getProjectId());
        assertEquals(ID, resultFromJSON.getTestNo());
        assertEquals(STEP_NO, resultFromJSON.getStepNo());
        assertEquals(statistics.getDuration(), resultFromJSON.getStatistics().getDuration());
        assertEquals(statistics.getStartTime(), resultFromJSON.getStatistics().getStartTime());
        assertEquals(statistics.getEqsUsed(), resultFromJSON.getStatistics().getEqsUsed());
        assertEquals(LearnAlgorithms.DHC, resultFromJSON.getConfiguration().getAlgorithm());
        assertTrue(resultFromJSON.getConfiguration().getEqOracle() instanceof CompleteExplorationEQOracleProxy);
        assertEquals(2, resultFromJSON.getSigma().size());
        assertEquals(2, resultFromJSON.getHypothesis().getNodes().size());
        assertEquals(2, resultFromJSON.getHypothesis().getEdges().size());
    }

}
