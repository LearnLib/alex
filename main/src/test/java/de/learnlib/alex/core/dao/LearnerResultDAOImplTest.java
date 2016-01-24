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

package de.learnlib.alex.core.dao;

import com.fasterxml.jackson.core.JsonProcessingException;
import de.learnlib.alex.core.entities.LearnerResult;
import de.learnlib.alex.core.entities.Project;
import de.learnlib.alex.core.entities.User;
import de.learnlib.alex.core.entities.learnlibproxies.AlphabetProxy;
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
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Ignore;
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

        LearnerResult resultFromDB = learnerResultDAO.get(user.getId(), project.getId(), learnerResult.getTestNo())
                                        .get(0);

        assertEquality(learnerResult, resultFromDB);
    }

    @Test
    public void shouldSaveTwoValidLearnResults() throws NotFoundException {
        learnerResultDAO.create(learnerResult);
        LearnerResult result2 = new LearnerResult();
        initLearnerResult(result2);
        learnerResultDAO.create(result2);

        /* check learnerResult 1 */
        assertTrue(learnerResult.getTestNo() > 0);
        LearnerResult resultFromDB = learnerResultDAO.get(user.getId(), project.getId(), learnerResult.getTestNo())
                                        .get(0);
        assertEquality(learnerResult, resultFromDB);

        /* check learnerResult 2 */
        assertTrue(result2.getTestNo() > 0);
        resultFromDB = learnerResultDAO.get(user.getId(), project.getId(), result2.getTestNo()).get(0);
        assertEquality(result2, resultFromDB);

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

    @Test
    public void shouldGetAllFinalResults() throws NotFoundException, JsonProcessingException {
        List<LearnerResult> expectedResults = createLearnerResultsList();
        List<LearnerResult> resultsFromDB   = learnerResultDAO.getAll(user.getId(), project.getId());

        assertEquals(expectedResults.size(), resultsFromDB.size());
        for (int i = 0; i < expectedResults.size(); i++) {
            LearnerResult expectedResult = expectedResults.get(i);
            LearnerResult resultFromDB = resultsFromDB.get(i);

            assertEquality(expectedResult, resultFromDB);
        }
    }

    @Test(expected = NotFoundException.class)
    public void ensureThatGettingAllFinalResultsThrowsAnExceptionIfTheProjectIdIsInvalid() throws NotFoundException {
        learnerResultDAO.getAll(user.getId(), -1L); // should fail
    }


    /*@Test
    public void shouldGetAllResultsOfOneRun() throws NotFoundException {
        LearnerResult expectedResult = createLearnerResultsList().get(RESULTS_AMOUNT - 1);
        List<LearnerResult> resultsFromDB = learnerResultDAO.get(user.getId(), project.getId(),
                                                                 expectedResult.getTestNo());

        assertEquals(RESULTS_AMOUNT, resultsFromDB.size());
        for (int i = 0; i < resultsFromDB.size(); i++) {
            LearnerResult resultFromDB = resultsFromDB.get(i);

            assertEquality(expectedResult, resultFromDB);
        }
    }*/
    // TODO: Check the step creation

    // TODO: Check the step persistence

    @Test(expected = NotFoundException.class)
    public void ensureThatGettingAllResultsThrowsAnExceptionIfTheProjectIdIsInvalid() throws NotFoundException {
        learnerResultDAO.create(learnerResult);
        learnerResultDAO.getAll(-1L, learnerResult.getTestNo()); // should fail
    }

    @Test(expected = NotFoundException.class)
    public void ensureThatGettingAllResultsThrowsAnExceptionIfTheResultIdIsInvalid() throws NotFoundException {
        learnerResultDAO.getAll(project.getId(), -1L); // should fail
    }

    @Test
    @Ignore
    public void shouldGetOneFinalResult() throws NotFoundException {
        learnerResultDAO.create(learnerResult);

        List<LearnerResult> resultInDB = learnerResultDAO.get(user.getId(), project.getId(), learnerResult.getTestNo());
        assertEquals(learnerResult, resultInDB);
    }

    @Test(expected = NotFoundException.class)
    public void ensureThatGettingOneFinalResultThrowsAnExceptionIfTheProjectIdIsInvalid() throws NotFoundException {
        learnerResultDAO.create(learnerResult);
        learnerResultDAO.get(user.getId(), -1L, learnerResult.getTestNo()); // should fail
    }

    @Test(expected = NotFoundException.class)
    public void ensureThatGettingOneFinalResultThrowsAnExceptionIfTheResultIdIsInvalid() throws NotFoundException {
        learnerResultDAO.get(user.getId(), project.getId(), -1L); // should fail
    }

    @Test
    @Ignore
    public void shouldGetOneResult() throws NotFoundException, JsonProcessingException {
        learnerResultDAO.create(learnerResult);
        List<LearnerResult> resultFromDB = learnerResultDAO.get(user.getId(), project.getId(),
                                                                learnerResult.getTestNo());

//        assertEquality(learnerResult, resultFromDB);
    }

    @Test(expected = NotFoundException.class)
    public void ensureThatGettingOneResultThrowsAnExceptionIfTheProjectIdIsInvalid() throws NotFoundException {
        learnerResultDAO.create(learnerResult);
        learnerResultDAO.get(-1L, learnerResult.getTestNo(), 0L); // should fail
    }

    @Test(expected = NotFoundException.class)
    public void ensureThatGettingOneResultThrowsAnExceptionIfTheResultIdIsInvalid() throws NotFoundException {
        learnerResultDAO.get(project.getId(), -1L, 0L); // should fail
    }

    @Test(expected = NotFoundException.class)
    public void ensureThatGettingOneResultThrowsAnExceptionIfTheStepNoIsInvalid() throws NotFoundException {
        learnerResultDAO.create(learnerResult);
        learnerResultDAO.get(project.getId(), learnerResult.getTestNo(), -1L); // should fail
    }

    /*@Test
    public void shouldUpdateValidLearnResults() throws NotFoundException {
        learnerResultDAO.create(learnerResult);
        Long oldId = learnerResult.getTestNo();

        learnerResultDAO.update(learnerResult);
        assertEquals(project.getId(), learnerResult.getProject().getId());
        assertEquals(oldId, learnerResult.getTestNo());
    }*/

    /*@Test
    public void shouldDeleteAllStepsOfATestRun() throws NotFoundException {
        learnerResultDAO.create(learnerResult);
        for (int i = 0; i < RESULTS_AMOUNT; i++) {
            learnerResultDAO.update(learnerResult);
        }

        learnerResultDAO.delete(user, project.getId(), learnerResult.getTestNo());

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
    }*/

    @Test
    public void shouldDeleteAllStepsOfMultipleTestRun() throws NotFoundException {
        List<LearnerResult> learnerResults = createLearnerResultsList();

        Long[] ids = new Long[learnerResults.size()];
        for (int i = 0; i < ids.length; i++) {
            ids[i] = learnerResults.get(i).getTestNo();
        }

        learnerResultDAO.delete(user, project.getId(), ids);

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

        learnerResultDAO.delete(user, project.getId(), ids); // should fail
    }

    @Test(expected = ValidationException.class)
    public void shouldThrowAnExceptionIfTheTestResultToDeleteIsActive() throws NotFoundException {
        learnerResultDAO.create(learnerResult);
        given(learner.isActive(user)).willReturn(true);
        given(learner.getResult(user)).willReturn(learnerResult);

        learnerResultDAO.delete(user, project.getId(), learnerResult.getTestNo()); // should fail
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
        result.setSigma(AlphabetProxy.createFrom(sigma));
        result.createHypothesisFrom(hypothesis);
    }

    private void assertEquality(LearnerResult lr1, LearnerResult lr2) {
        assertTrue(lr1.equals(lr2));
        assertEquals(lr1.getSigma(), lr2.getSigma());
        // TODO: assertEquals(lr1.getHypothesis(), lr2.getHypothesis());
//        assertEquals(lr1.getCounterExample(), lr2.getCounterExample());
        // TODO: assertEquals(lr1.getStatistics(), lr2.getStatistics());
        // TODO: assertEquals(lr1.getConfiguration(), lr2.getConfiguration());
    }

    private List<LearnerResult> createLearnerResultsList() throws NotFoundException {
        List<LearnerResult> results = new LinkedList<>();
        for (int i = 0; i < RESULTS_AMOUNT; i++) {
            LearnerResult r = new LearnerResult();
            initLearnerResult(r);
            r.setProject(project);
            r.setUser(user);
            learnerResultDAO.create(r);

            results.add(r);
        }

        return results;
    }

}
