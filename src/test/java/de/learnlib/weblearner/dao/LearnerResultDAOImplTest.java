package de.learnlib.weblearner.dao;

import de.learnlib.weblearner.entities.LearnerResult;
import de.learnlib.weblearner.entities.Project;
import de.learnlib.weblearner.utils.HibernateUtil;
import net.automatalib.automata.transout.impl.compact.CompactMealy;
import net.automatalib.words.Alphabet;
import net.automatalib.words.impl.SimpleAlphabet;
import org.hibernate.Session;
import org.hibernate.criterion.Projections;
import org.hibernate.criterion.Restrictions;
import org.junit.After;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;

import javax.validation.ValidationException;
import java.util.LinkedList;
import java.util.List;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

public class LearnerResultDAOImplTest {

    private static final int RESULTS_AMOUNT = 5;

    private static ProjectDAO projectDAO;
    private static LearnerResultDAO learnerResultDAO;

    private Project project;
    private LearnerResult learnerResult;

    @BeforeClass
    public static void beforeClass() {
        projectDAO = new ProjectDAOImpl();
        learnerResultDAO = new LearnerResultDAOImpl();
    }

    @Before
    public void setUp() {
        project = new Project();
        project.setName("LearnerResultDAO - Test Project");
        project.setBaseUrl("http://example.com/");
        projectDAO.create(project);

        learnerResult = new LearnerResult();
        initLearnerResult(learnerResult);
    }

    @After
    public void tearDown() {
        projectDAO.delete(project.getId());
    }

    @Test
    public void shouldSaveValidLearnResults() {
        learnerResultDAO.create(learnerResult);

        assertTrue(learnerResult.getTestNo() > 0);
        assertTrue(learnerResult.getStepNo() == 1);

        String jsonFromDB = learnerResultDAO.getAsJSON(project.getId(), learnerResult.getTestNo(),
                                                        learnerResult.getStepNo());
        String expectedJSON = generateExpectedJSON(learnerResult);

        assertEquals(expectedJSON, jsonFromDB);
    }

    @Test
    public void shouldSaveTwoValidLearnResults() {
        learnerResultDAO.create(learnerResult);
        LearnerResult result2 = new LearnerResult();
        initLearnerResult(result2);
        learnerResultDAO.create(result2);

        /* check learnerResult 1 */
        String expectedJSON = generateExpectedJSON(learnerResult);
        assertTrue(learnerResult.getTestNo() > 0);
        assertTrue(learnerResult.getStepNo() == 1);
        String jsonFromDB = learnerResultDAO.getAsJSON(project.getId(), learnerResult.getTestNo(),
                                                        learnerResult.getStepNo());
        assertEquals(expectedJSON, jsonFromDB);

        /* check learnerResult 2 */
        expectedJSON = generateExpectedJSON(result2);
        assertTrue(result2.getTestNo() > 0);
        assertTrue(result2.getStepNo() == 1);
        jsonFromDB = learnerResultDAO.getAsJSON(project.getId(), result2.getTestNo(), result2.getStepNo());
        assertEquals(expectedJSON, jsonFromDB);

        /* check relations */
        assertFalse(learnerResult.getTestNo() == result2.getTestNo());
    }

    @Test(expected = ValidationException.class)
    public void shouldNotSaveALearnResultsWithoutAProject() {
        learnerResult.setProject(null);

        learnerResultDAO.create(learnerResult); // should fail
    }

    @Test(expected = ValidationException.class)
    public void shouldNotSaveALearnResultsWithAnId() {
        learnerResult.setTestNo(1);

        learnerResultDAO.create(learnerResult); // should fail
    }

    @Test(expected = ValidationException.class)
    public void shouldNotSaveALearnResultsWithAStepNo() {
        learnerResult.setStepNo(1);

        learnerResultDAO.create(learnerResult); // should fail
    }

    @Test
    public void shouldGetAllFinalResults() {
        List<LearnerResult> results = createLearnerResultsList();
        List<String> resultsInDBAsJSON = learnerResultDAO.getAllAsJSON(project.getId());

        assertEquals(results.size(), resultsInDBAsJSON.size());
        for (LearnerResult x : results) {
            String expectedJSON = x.getJSON();

            int index = resultsInDBAsJSON.indexOf(expectedJSON);
            assertTrue(index > -1);
        }
    }

    @Test(expected = IllegalArgumentException.class)
    public void ensureThatGettingAllFinalResultsThrowsAnExceptionIfTheProjectIdIsInvalid() {
        learnerResultDAO.getAllAsJSON(-1); // should fail
    }

    @Test
    public void shouldGetAllResultsOfOneRun() {
        LearnerResult result = createLearnerResultsList().get(RESULTS_AMOUNT - 1);
        List<String> resultsInDBAsJSON = learnerResultDAO.getAllAsJSON(project.getId(), result.getTestNo());

        assertEquals(RESULTS_AMOUNT, resultsInDBAsJSON.size());
        for (int i = 0; i < resultsInDBAsJSON.size(); i++) {
            String expectedJSON = "{\"amountOfResets\":0,\"configuration\":{"
                                        + "\"algorithm\":\"EXTENSIBLE_LSTAR\",\"eqOracle\":{\"type\":\"random_word\","
                                            + "\"minLength\":1,\"maxLength\":1,\"maxNoOfTests\":1}"
                                        + ",\"maxAmountOfStepsToLearn\":0,\"resetSymbol\":null,\"symbols\":[]},"
                                    + "\"duration\":0,\"hypothesis\":{"
                                        + "\"nodes\":[0,1],\"initNode\":0,\"edges\":["
                                            + "{\"from\":0,\"input\":\"0\",\"to\":0,\"output\":\"OK\"},"
                                            + "{\"from\":0,\"input\":\"1\",\"to\":1,\"output\":\"OK\"},"
                                            + "{\"from\":1,\"input\":\"0\",\"to\":1,\"output\":\"OK\"},"
                                            + "{\"from\":1,\"input\":\"1\",\"to\":0,\"output\":\"OK\"}"
                                        + "]},"
                                    + "\"project\":" + project.getId() + ",\"sigma\":[\"0\",\"1\"],"
                                    + "\"startTime\":\"1970-01-01T00:00:00.000+00:00\",\"stepNo\":" + (i + 1) + ","
                                    + "\"testNo\":" + result.getTestNo() + "}";
            String resultAsJSON = resultsInDBAsJSON.get(i);

            assertEquals(expectedJSON, resultAsJSON);
        }
    }

    @Test(expected = IllegalArgumentException.class)
    public void ensureThatGettingAllResultsThrowsAnExceptionIfTheProjectIdIsInvalid() {
        learnerResultDAO.create(learnerResult);
        learnerResultDAO.getAllAsJSON(-1, learnerResult.getTestNo()); // should fail
    }

    @Test(expected = IllegalArgumentException.class)
    public void ensureThatGettingAllResultsThrowsAnExceptionIfTheResultIdIsInvalid() {
        learnerResultDAO.getAllAsJSON(project.getId(), -1); // should fail
    }

    @Test
    public void shouldGetOneFinalResult() {
        learnerResultDAO.create(learnerResult);
        for (int i = 0; i < RESULTS_AMOUNT; i++) {
            learnerResultDAO.update(learnerResult);
        }

        LearnerResult resultInDB = learnerResultDAO.get(project.getId(), learnerResult.getTestNo());
        assertEquals(learnerResult, resultInDB);
    }

    @Test(expected = IllegalArgumentException.class)
    public void ensureThatGettingOneFinalResultThrowsAnExceptionIfTheProjectIdIsInvalid() {
        learnerResultDAO.create(learnerResult);
        learnerResultDAO.get(-1, learnerResult.getTestNo()); // should fail
    }

    @Test(expected = IllegalArgumentException.class)
    public void ensureThatGettingOneFinalResultThrowsAnExceptionIfTheResultIdIsInvalid() {
        learnerResultDAO.get(project.getId(), -1); // should fail
    }

    @Test
    public void shouldGetOneFinalResultAsJSON() {
        learnerResultDAO.create(learnerResult);
        for (int i = 0; i < RESULTS_AMOUNT; i++) {
            learnerResultDAO.update(learnerResult);
        }

        String jsonInDB = learnerResultDAO.getAsJSON(project.getId(), learnerResult.getTestNo());
        assertEquals(learnerResult.getJSON(), jsonInDB);
    }

    @Test(expected = IllegalArgumentException.class)
    public void ensureThatGettingOneFinalResultAsJSONThrowsAnExceptionIfTheProjectIdIsInvalid() {
    learnerResultDAO.create(learnerResult);
    learnerResultDAO.getAsJSON(-1, learnerResult.getTestNo()); // should fail
}

    @Test(expected = IllegalArgumentException.class)
    public void ensureThatGettingOneFinalResultAsJSONThrowsAnExceptionIfTheResultIdIsInvalid() {
        learnerResultDAO.getAsJSON(project.getId(), -1); // should
    }

    @Test
    public void shouldGetOneResultAsJSON() {
        String middleResult = "";
        learnerResultDAO.create(learnerResult);
        for (int i = 0; i < RESULTS_AMOUNT; i++) {
            if (i == (RESULTS_AMOUNT / 2) - 1) {
                middleResult = learnerResult.getJSON();
            }

            learnerResultDAO.update(learnerResult);
        }

        String jsonInDB = learnerResultDAO.getAsJSON(project.getId(), learnerResult.getTestNo(), RESULTS_AMOUNT / 2);
        assertEquals(middleResult, jsonInDB);
    }

    @Test(expected = IllegalArgumentException.class)
    public void ensureThatGettingOneResultAsJSONThrowsAnExceptionIfTheProjectIdIsInvalid() {
        learnerResultDAO.create(learnerResult);
        learnerResultDAO.getAsJSON(-1, learnerResult.getTestNo(), 0); // should fail
    }

    @Test(expected = IllegalArgumentException.class)
    public void ensureThatGettingOneResultAsJSONThrowsAnExceptionIfTheResultIdIsInvalid() {
        learnerResultDAO.getAsJSON(project.getId(), -1, 0); // should fail
    }

    @Test(expected = IllegalArgumentException.class)
    public void ensureThatGettingOneResultAsJSONThrowsAnExceptionIfTheStepNoIsInvalid() {
        learnerResultDAO.create(learnerResult);
        learnerResultDAO.getAsJSON(project.getId(), learnerResult.getTestNo(), -1); // should fail
    }

    @Test
    public void shouldUpdateValidLearnResults() {
        learnerResultDAO.create(learnerResult);
        long oldId = learnerResult.getTestNo();
        long oldStepNo = learnerResult.getStepNo();

        learnerResultDAO.update(learnerResult);
        assertEquals(project.getId(), learnerResult.getProject().getId());
        assertEquals(oldId, learnerResult.getTestNo());
        assertEquals(oldStepNo + 1, learnerResult.getStepNo());
    }

    @Test
    public void shouldDeleteAllStepsOfATestRun() {
        learnerResultDAO.create(learnerResult);
        for (int i = 0; i < RESULTS_AMOUNT; i++) {
            learnerResultDAO.update(learnerResult);
        }

        learnerResultDAO.delete(project.getId(), learnerResult.getTestNo());

        Session session = HibernateUtil.getSession();
        HibernateUtil.beginTransaction();

        Long resultCounter = (Long) session.createCriteria(LearnerResult.class)
                                            .add(Restrictions.eq("project.id", project.getId()))
                                            .add(Restrictions.eq("testNo", learnerResult.getTestNo()))
                                            .setProjection(Projections.rowCount())
                                            .uniqueResult();

        HibernateUtil.commitTransaction();

        assertEquals(0L, resultCounter.longValue());
    }

    @Test
    public void shouldDeleteAllStepsOfMultipleTestRun() {
        List<LearnerResult> learnerResults = createLearnerResultsList();

        Long[] ids = new Long[learnerResults.size()];
        for (int i = 0; i < ids.length; i++) {
            ids[i] = learnerResults.get(i).getTestNo();
        }

        learnerResultDAO.delete(project.getId(), ids);

        Session session = HibernateUtil.getSession();
        HibernateUtil.beginTransaction();

        Long resultCounter = (Long) session.createCriteria(LearnerResult.class)
                                            .add(Restrictions.eq("project.id", project.getId()))
                                            .add(Restrictions.in("testNo", ids))
                                            .setProjection(Projections.rowCount())
                                            .uniqueResult();

        HibernateUtil.commitTransaction();

        assertEquals(0L, resultCounter.longValue());
    }

    @Test(expected = IllegalArgumentException.class)
    public void shouldThrowAnExceptionIfTheTestResultToDeleteWasNotFound() {
        List<LearnerResult> learnerResults = createLearnerResultsList();

        Long[] ids = new Long[learnerResults.size()];
        for (int i = 0; i < ids.length; i++) {
            ids[i] = learnerResults.get(i).getTestNo();
        }
        ids[ids.length - 1] = -1L;

        learnerResultDAO.delete(project.getId(), ids); // should fail
    }

    private void initLearnerResult(LearnerResult result) {
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

        result.setProject(project);
        result.setSigma(sigma);
        result.createHypothesisFrom(hypothesis);
    }

    private String generateExpectedJSON(LearnerResult result) {
        return "{\"amountOfResets\":0,\"configuration\":{\"algorithm\":\"EXTENSIBLE_LSTAR\",\"eqOracle\":"
                    + "{\"type\":\"random_word\",\"minLength\":1,\"maxLength\":1,\"maxNoOfTests\":1},"
                + "\"maxAmountOfStepsToLearn\":0,\"resetSymbol\":null,\"symbols\":[]},"
                + "\"duration\":0,\"hypothesis\":{"
                    + "\"nodes\":[0,1],\"initNode\":0,\"edges\":["
                    + "{\"from\":0,\"input\":\"0\",\"to\":0,\"output\":\"OK\"},"
                    + "{\"from\":0,\"input\":\"1\",\"to\":1,\"output\":\"OK\"},"
                    + "{\"from\":1,\"input\":\"0\",\"to\":1,\"output\":\"OK\"},"
                    + "{\"from\":1,\"input\":\"1\",\"to\":0,\"output\":\"OK\"}"
                + "]},"
                + "\"project\":" + result.getProjectId() + ",\"sigma\":[\"0\",\"1\"],"
                + "\"startTime\":\"1970-01-01T00:00:00.000+00:00\",\"stepNo\":" + result.getStepNo() + ","
                + "\"testNo\":" + result.getTestNo() + "}";
    }

    private List<LearnerResult> createLearnerResultsList() {
        List<LearnerResult> results = new LinkedList<>();
        for (int i = 0; i < RESULTS_AMOUNT; i++) {
            LearnerResult r = new LearnerResult();
            initLearnerResult(r);
            r.setProject(project);
            learnerResultDAO.create(r);

            for (int j = 0; j < i; j++) {
                learnerResultDAO.update(r);
            }
            results.add(r);
        }

        return results;
    }

}
