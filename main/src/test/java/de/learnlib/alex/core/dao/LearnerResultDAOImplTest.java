package de.learnlib.alex.core.dao;

import de.learnlib.alex.core.entities.LearnerResult;
import de.learnlib.alex.core.entities.Project;
import de.learnlib.alex.core.entities.User;
import de.learnlib.alex.core.learner.Learner;
import de.learnlib.alex.exceptions.NotFoundException;
import de.learnlib.alex.utils.HibernateUtil;
import net.automatalib.automata.transout.impl.compact.CompactMealy;
import net.automatalib.words.Alphabet;
import net.automatalib.words.impl.SimpleAlphabet;
import org.hibernate.Session;
import org.hibernate.criterion.Projections;
import org.hibernate.criterion.Restrictions;
import org.junit.After;
import org.junit.AfterClass;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;

import javax.validation.ValidationException;
import java.util.LinkedList;
import java.util.List;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;
import static org.mockito.BDDMockito.given;

@RunWith(MockitoJUnitRunner.class)
public class LearnerResultDAOImplTest {

    private static final Long USER_ID = 4L;
    private static final int RESULTS_AMOUNT = 5;

    private static UserDAO userDAO;
    private static ProjectDAO projectDAO;
    private static LearnerResultDAO learnerResultDAO;

    private User user;
    private Project project;
    private LearnerResult learnerResult;

    @Mock
    private Learner learner;

    @BeforeClass
    public static void beforeClass() {
        userDAO = new UserDAOImpl();
        projectDAO = new ProjectDAOImpl();
        learnerResultDAO = new LearnerResultDAOImpl();
    }

    @Before
    public void setUp() {
        user = new User(USER_ID);
        user.setEmail("LearnerResultDAOImplTest@alex-tests.example");
        user.setEncryptedPassword("alex");
        userDAO.create(user);

        ((LearnerResultDAOImpl) learnerResultDAO).setLearner(learner);

        project = new Project();
        project.setName("LearnerResultDAO - Test Project");
        project.setBaseUrl("http://example.com/");
        project.setUser(user);
        projectDAO.create(project);

        learnerResult = new LearnerResult();
        initLearnerResult(learnerResult);
    }

    @After
    public void tearDown() throws NotFoundException {
        userDAO.delete(user.getId());
    }

    @Test
    public void shouldSaveValidLearnResults() throws NotFoundException {
        learnerResultDAO.create(learnerResult);

        assertTrue(learnerResult.getTestNo() > 0);
        assertTrue(learnerResult.getStepNo() == 0);

        String jsonFromDB = learnerResultDAO.getAsJSON(user.getId(), project.getId(), learnerResult.getTestNo(),
                                                       learnerResult.getStepNo());
        String expectedJSON = generateExpectedJSON(learnerResult);

        assertEquals(expectedJSON, jsonFromDB);
    }

    @Test
    public void shouldSaveTwoValidLearnResults() throws NotFoundException {
        learnerResultDAO.create(learnerResult);
        LearnerResult result2 = new LearnerResult();
        initLearnerResult(result2);
        learnerResultDAO.create(result2);

        /* check learnerResult 1 */
        String expectedJSON = generateExpectedJSON(learnerResult);
        assertTrue(learnerResult.getTestNo() > 0);
        assertTrue(learnerResult.getStepNo() == 0L);
        String jsonFromDB = learnerResultDAO.getAsJSON(user.getId(), project.getId(), learnerResult.getTestNo(),
                                                        learnerResult.getStepNo());
        assertEquals(expectedJSON, jsonFromDB);

        /* check learnerResult 2 */
        expectedJSON = generateExpectedJSON(result2);
        assertTrue(result2.getTestNo() > 0);
        assertTrue(result2.getStepNo() == 0);
        jsonFromDB = learnerResultDAO.getAsJSON(user.getId(), project.getId(), result2.getTestNo(), result2.getStepNo());
        assertEquals(expectedJSON, jsonFromDB);

        /* check relations */
        assertFalse(learnerResult.getTestNo().equals(result2.getTestNo()));
    }

    @Test(expected = ValidationException.class)
    public void shouldNotSaveALearnResultsWithoutAProject() {
        learnerResult.setProject(null);

        learnerResultDAO.create(learnerResult); // should fail
    }

    @Test(expected = ValidationException.class)
    public void shouldNotSaveALearnResultsWithAnId() {
        learnerResult.setTestNo(1L);

        learnerResultDAO.create(learnerResult); // should fail
    }

    @Test(expected = ValidationException.class)
    public void shouldNotSaveALearnResultsWithAStepNo() {
        learnerResult.setStepNo(1L);

        learnerResultDAO.create(learnerResult); // should fail
    }

    @Test
    public void shouldGetAllFinalResults() throws NotFoundException {
        List<LearnerResult> results = createLearnerResultsList();
        List<String> resultsInDBAsJSON = learnerResultDAO.getAllAsJSON(user.getId(), project.getId());

        assertEquals(results.size(), resultsInDBAsJSON.size());
        for (int i = 0; i < results.size(); i++) {
            LearnerResult expectedResult = results.get(i);
            expectedResult.setStepNo(0L);
            String expectedJSON = expectedResult.getJSON();
            String actualJSON   = resultsInDBAsJSON.get(i);

            assertEquals(expectedJSON, actualJSON);
        }
    }

    @Test(expected = NotFoundException.class)
    public void ensureThatGettingAllFinalResultsThrowsAnExceptionIfTheProjectIdIsInvalid() throws NotFoundException {
        learnerResultDAO.getAllAsJSON(user.getId(), -1L); // should fail
    }

    @Test
    public void shouldGetAllResultsOfOneRun() throws NotFoundException {
        LearnerResult result = createLearnerResultsList().get(RESULTS_AMOUNT - 1);
        List<String> resultsInDBAsJSON = learnerResultDAO.getAllAsJSON(user.getId(), project.getId(), result.getTestNo());

        assertEquals(RESULTS_AMOUNT, resultsInDBAsJSON.size());
        for (int i = 0; i < resultsInDBAsJSON.size(); i++) {
            String expectedJSON = "{\"configuration\":{"
                                        + "\"algorithm\":\"TTT\",\"comment\":\"\","
                                        + "\"eqOracle\":{\"type\":\"random_word\","
                                            + "\"minLength\":1,\"maxLength\":1,\"maxNoOfTests\":1}"
                                        + ",\"maxAmountOfStepsToLearn\":0,\"resetSymbol\":null,\"symbols\":[]},"
                                    + "\"counterExample\":\"\",\"hypothesis\":{"
                                        + "\"nodes\":[0,1],\"initNode\":0,\"edges\":["
                                            + "{\"from\":0,\"input\":\"0\",\"to\":0,\"output\":\"OK\"},"
                                            + "{\"from\":0,\"input\":\"1\",\"to\":1,\"output\":\"OK\"},"
                                            + "{\"from\":1,\"input\":\"0\",\"to\":1,\"output\":\"OK\"},"
                                            + "{\"from\":1,\"input\":\"1\",\"to\":0,\"output\":\"OK\"}"
                                        + "]},"
                                    + "\"project\":" + project.getId() + ",\"sigma\":[\"0\",\"1\"],"
                                    + "\"statistics\":{"
                                        + "\"duration\":0,\"eqsUsed\":0,\"mqsUsed\":0,"
                                        + "\"startTime\":\"1970-01-01T00:00:00.000+00:00\",\"symbolsUsed\":0"
                                    + "},"
                                    + "\"stepNo\":" + i + ",\"testNo\":" + result.getTestNo() + "}";
            String resultAsJSON = resultsInDBAsJSON.get(i);

            assertEquals(expectedJSON, resultAsJSON);
        }
    }

    @Test(expected = NotFoundException.class)
    public void ensureThatGettingAllResultsThrowsAnExceptionIfTheProjectIdIsInvalid() throws NotFoundException {
        learnerResultDAO.create(learnerResult);
        learnerResultDAO.getAllAsJSON(-1L, learnerResult.getTestNo()); // should fail
    }

    @Test(expected = NotFoundException.class)
    public void ensureThatGettingAllResultsThrowsAnExceptionIfTheResultIdIsInvalid() throws NotFoundException {
        learnerResultDAO.getAllAsJSON(project.getId(), -1L); // should fail
    }

    @Test
    public void shouldGetOneFinalResult() throws NotFoundException {
        learnerResultDAO.create(learnerResult);
        for (int i = 0; i < RESULTS_AMOUNT; i++) {
            learnerResultDAO.update(learnerResult);
        }

        LearnerResult resultInDB = learnerResultDAO.get(project.getId(), learnerResult.getTestNo());
        learnerResult.setStepNo(0L);
        assertEquals(learnerResult, resultInDB);
    }

    @Test(expected = NotFoundException.class)
    public void ensureThatGettingOneFinalResultThrowsAnExceptionIfTheProjectIdIsInvalid() throws NotFoundException {
        learnerResultDAO.create(learnerResult);
        learnerResultDAO.get(-1L, learnerResult.getTestNo()); // should fail
    }

    @Test(expected = NotFoundException.class)
    public void ensureThatGettingOneFinalResultThrowsAnExceptionIfTheResultIdIsInvalid() throws NotFoundException {
        learnerResultDAO.get(project.getId(), -1L); // should fail
    }

    @Test
    public void shouldGetOneFinalResultAsJSON() throws NotFoundException {
        learnerResultDAO.create(learnerResult);
        for (int i = 0; i < RESULTS_AMOUNT; i++) {
            learnerResultDAO.update(learnerResult);
        }

        String jsonInDB = learnerResultDAO.getAsJSON(user.getId(), project.getId(), learnerResult.getTestNo());
        learnerResult.setStepNo(0L);
        assertEquals(learnerResult.getJSON(), jsonInDB);
    }

    @Test(expected = NotFoundException.class)
    public void ensureThatGettingOneFinalResultAsJSONThrowsAnExceptionIfTheProjectIdIsInvalid()
            throws NotFoundException {
        learnerResultDAO.create(learnerResult);
        learnerResultDAO.getAsJSON(user.getId(), -1L, learnerResult.getTestNo()); // should fail
    }

    @Test(expected = NotFoundException.class)
    public void ensureThatGettingOneFinalResultAsJSONThrowsAnExceptionIfTheResultIdIsInvalid()
            throws NotFoundException {
        learnerResultDAO.getAsJSON(user.getId(), project.getId(), -1L); // should fail
    }

    @Test
    public void shouldGetOneResultAsJSON() throws NotFoundException {
        String middleResult = "";
        learnerResultDAO.create(learnerResult);
        for (int i = 0; i < RESULTS_AMOUNT; i++) {
            if (i == (RESULTS_AMOUNT / 2) - 1) {
                learnerResult.setStepNo(2L);
                middleResult = learnerResult.getJSON();
                learnerResult.setStepNo(1L);
            }

            learnerResultDAO.update(learnerResult);
        }

        String jsonInDB = learnerResultDAO.getAsJSON(user.getId(), project.getId(), learnerResult.getTestNo(), RESULTS_AMOUNT / 2L);
        assertEquals(middleResult, jsonInDB);
    }

    @Test(expected = NotFoundException.class)
    public void ensureThatGettingOneResultAsJSONThrowsAnExceptionIfTheProjectIdIsInvalid() throws NotFoundException {
        learnerResultDAO.create(learnerResult);
        learnerResultDAO.getAsJSON(-1L, learnerResult.getTestNo(), 0L); // should fail
    }

    @Test(expected = NotFoundException.class)
    public void ensureThatGettingOneResultAsJSONThrowsAnExceptionIfTheResultIdIsInvalid() throws NotFoundException {
        learnerResultDAO.getAsJSON(project.getId(), -1L, 0L); // should fail
    }

    @Test(expected = NotFoundException.class)
    public void ensureThatGettingOneResultAsJSONThrowsAnExceptionIfTheStepNoIsInvalid() throws NotFoundException {
        learnerResultDAO.create(learnerResult);
        learnerResultDAO.getAsJSON(project.getId(), learnerResult.getTestNo(), -1L); // should fail
    }

    @Test
    public void shouldUpdateValidLearnResults() throws NotFoundException {
        learnerResultDAO.create(learnerResult);
        Long oldId = learnerResult.getTestNo();
        Long oldStepNo = learnerResult.getStepNo();

        learnerResultDAO.update(learnerResult);
        assertEquals(project.getId(), learnerResult.getProject().getId());
        assertEquals(oldId, learnerResult.getTestNo());
        assertEquals(Long.valueOf(oldStepNo + 1L), learnerResult.getStepNo());
    }

    @Test
    public void shouldDeleteAllStepsOfATestRun() throws NotFoundException {
        learnerResultDAO.create(learnerResult);
        for (int i = 0; i < RESULTS_AMOUNT; i++) {
            learnerResultDAO.update(learnerResult);
        }

        learnerResultDAO.delete(user.getId(), project.getId(), learnerResult.getTestNo());

        Session session = HibernateUtil.getSession();
        HibernateUtil.beginTransaction();

        Long resultCounter = (Long) session.createCriteria(LearnerResult.class)
                .add(Restrictions.eq("user.id", user.getId()))
                .add(Restrictions.eq("project.id", project.getId()))
                .add(Restrictions.eq("testNo", learnerResult.getTestNo()))
                .setProjection(Projections.rowCount())
                .uniqueResult();

        HibernateUtil.commitTransaction();

        assertEquals(0L, resultCounter.longValue());
    }

    @Test
    public void shouldDeleteAllStepsOfMultipleTestRun() throws NotFoundException {
        List<LearnerResult> learnerResults = createLearnerResultsList();

        Long[] ids = new Long[learnerResults.size()];
        for (int i = 0; i < ids.length; i++) {
            ids[i] = learnerResults.get(i).getTestNo();
        }

        learnerResultDAO.delete(user.getId(), project.getId(), ids);

        Session session = HibernateUtil.getSession();
        HibernateUtil.beginTransaction();

        Long resultCounter = (Long) session.createCriteria(LearnerResult.class)
                .add(Restrictions.eq("user.id", user.getId()))
                .add(Restrictions.eq("project.id", project.getId()))
                .add(Restrictions.in("testNo", ids))
                .setProjection(Projections.rowCount())
                .uniqueResult();

        HibernateUtil.commitTransaction();

        assertEquals(0L, resultCounter.longValue());
    }

    @Test(expected = NotFoundException.class)
    public void shouldThrowAnExceptionIfTheTestResultToDeleteWasNotFound() throws NotFoundException {
        List<LearnerResult> learnerResults = createLearnerResultsList();

        Long[] ids = new Long[learnerResults.size()];
        for (int i = 0; i < ids.length; i++) {
            ids[i] = learnerResults.get(i).getTestNo();
        }
        ids[ids.length - 1] = -1L;

        learnerResultDAO.delete(user.getId(), project.getId(), ids); // should fail
    }

    @Test(expected = ValidationException.class)
    public void shouldThrowAnExceptionIfTheTestResultToDeleteIsActive() throws NotFoundException {
        learnerResultDAO.create(learnerResult);
        given(learner.isActive()).willReturn(true);
        given(learner.getResult()).willReturn(learnerResult);

        learnerResultDAO.delete(user.getId(), project.getId(), learnerResult.getTestNo()); // should fail
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
        result.setUser(user);
        result.setSigma(sigma);
        result.createHypothesisFrom(hypothesis);
    }

    private String generateExpectedJSON(LearnerResult result) {
        return "{\"configuration\":{\"algorithm\":\"TTT\",\"comment\":\"\",\"eqOracle\":"
                    + "{\"type\":\"random_word\",\"minLength\":1,\"maxLength\":1,\"maxNoOfTests\":1},"
                    + "\"maxAmountOfStepsToLearn\":0,\"resetSymbol\":null,\"symbols\":[]},"
                + "\"counterExample\":\"\",\"hypothesis\":{"
                    + "\"nodes\":[0,1],\"initNode\":0,\"edges\":["
                    + "{\"from\":0,\"input\":\"0\",\"to\":0,\"output\":\"OK\"},"
                    + "{\"from\":0,\"input\":\"1\",\"to\":1,\"output\":\"OK\"},"
                    + "{\"from\":1,\"input\":\"0\",\"to\":1,\"output\":\"OK\"},"
                    + "{\"from\":1,\"input\":\"1\",\"to\":0,\"output\":\"OK\"}"
                + "]},"
                + "\"project\":" + result.getProjectId() + ",\"sigma\":[\"0\",\"1\"],"
                + "\"statistics\":{"
                    + "\"duration\":0,\"eqsUsed\":0,\"mqsUsed\":0"
                    + ",\"startTime\":\"1970-01-01T00:00:00.000+00:00\",\"symbolsUsed\":0"
                + "},"
                + "\"stepNo\":" + result.getStepNo() + ",\"testNo\":" + result.getTestNo() + ",\"user\":" + user.getId() + "}";
    }

    private List<LearnerResult> createLearnerResultsList() throws NotFoundException {
        List<LearnerResult> results = new LinkedList<>();
        for (int i = 0; i < RESULTS_AMOUNT; i++) {
            LearnerResult r = new LearnerResult();
            initLearnerResult(r);
            r.setProject(project);
            r.setUser(user);
            learnerResultDAO.create(r);

            for (int j = 0; j < i; j++) {
                learnerResultDAO.update(r);
            }
            results.add(r);
        }

        return results;
    }

}
