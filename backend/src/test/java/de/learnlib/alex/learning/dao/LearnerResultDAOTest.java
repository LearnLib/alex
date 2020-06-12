/*
 * Copyright 2015 - 2020 TU Dortmund
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

package de.learnlib.alex.learning.dao;

import de.learnlib.alex.auth.entities.User;
import de.learnlib.alex.common.exceptions.NotFoundException;
import de.learnlib.alex.data.dao.ProjectDAO;
import de.learnlib.alex.data.entities.Project;
import de.learnlib.alex.data.entities.Symbol;
import de.learnlib.alex.learning.entities.LearnerResult;
import de.learnlib.alex.learning.entities.learnlibproxies.eqproxies.MealyRandomWordsEQOracleProxy;
import de.learnlib.alex.learning.repositories.LearnerResultRepository;
import de.learnlib.alex.learning.repositories.LearnerResultStepRepository;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnitRunner;

import javax.persistence.EntityManager;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import static org.hamcrest.CoreMatchers.equalTo;
import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertThat;
import static org.junit.Assert.assertTrue;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.verify;

@RunWith(MockitoJUnitRunner.class)
public class LearnerResultDAOTest {

    private static final long USER_ID = 21L;
    private static final long PROJECT_ID = 42L;
    private static final int RESULTS_AMOUNT = 3;
    private static final MealyRandomWordsEQOracleProxy EXAMPLE_EQ_ORACLE =
            new MealyRandomWordsEQOracleProxy(1, 5, 10, 42);

    @Mock
    private ProjectDAO projectDAO;

    @Mock
    private LearnerResultRepository learnerResultRepository;

    @Mock
    private LearnerResultStepRepository learnerResultStepRepository;

    @Mock
    private EntityManager entityManager;

    @Mock
    private LearnerSetupDAO learnerSetupDAO;

    private LearnerResultDAO learnerResultDAO;

    @Before
    public void setUp() {
        learnerResultDAO = new LearnerResultDAO(projectDAO, learnerResultRepository, learnerResultStepRepository,
                entityManager, learnerSetupDAO);
    }

    @Test
    public void shouldSaveAValidLearnerResult() throws Exception {
        User user = new User();
        user.setId(USER_ID);

        Project project = new Project();
        project.setId(PROJECT_ID);

        LearnerResult result = createLearnerResultsList().get(0);
        result.setProject(project);

        given(learnerResultRepository.findHighestTestNo(PROJECT_ID)).willReturn(1L);
        given(learnerResultRepository.saveAndFlush(result)).willReturn(result);

        try {
            learnerResultDAO.create(user, project, result);
        } catch (NotFoundException e) {
            e.printStackTrace();
        }

        verify(learnerResultRepository).saveAndFlush(result);
        assertThat(result.getTestNo(), is(equalTo(2L)));
    }

    @Test
    public void shouldGetAllResultsOfOneProject() throws NotFoundException {
        User user = new User();

        List<LearnerResult> results = createLearnerResultsList();
        given(learnerResultRepository.findByProject_Id(PROJECT_ID)).willReturn(results);
        List<LearnerResult> resultsFromDAO = learnerResultDAO.getAll(user, PROJECT_ID);

        assertThat(results.size(), is(equalTo(resultsFromDAO.size())));
        for (LearnerResult r : resultsFromDAO) {
            assertTrue(results.contains(r));
        }
    }

    @Test
    public void ensureThatGettingAllResultsReturnsAnEmptyListIfNoLearnerResultCouldBeFound() throws NotFoundException {
        User user = new User();

        given(learnerResultRepository.findByProject_Id(PROJECT_ID))
                .willReturn(Collections.emptyList());

        List<LearnerResult> results = learnerResultDAO.getAll(user, PROJECT_ID);
        assertEquals(results.size(), 0);
    }

    @Test
    public void shouldGetMultipleResults() throws NotFoundException {
        User user = new User();

        List<LearnerResult> results = createLearnerResultsList();
        List<Long> testNos = Arrays.asList(0L, 1L, 2L);

        given(learnerResultRepository.findByProject_IdAndTestNoIn(PROJECT_ID, testNos))
                .willReturn(results);

        List<LearnerResult> resultsFromDAO = learnerResultDAO.getAll(user, PROJECT_ID, testNos);

        assertThat(results.size(), is(equalTo(resultsFromDAO.size())));
        for (LearnerResult r : resultsFromDAO) {
            assertTrue(results.contains(r));
        }
    }

    @Test(expected = NotFoundException.class)
    public void ensureThatGettingANonExistingResultThrowsAnException() throws NotFoundException {
        User user = new User();

        given(learnerResultRepository.findOneByProject_IdAndTestNo(PROJECT_ID, 0L))
                .willReturn(null);

        learnerResultDAO.get(user, PROJECT_ID, 0L); // should fail
    }

    @Test
    public void shouldDeleteMultipleResults() throws NotFoundException {
        List<Long> testNos = Arrays.asList(0L, 1L);

        given(learnerResultRepository.deleteByProject_IdAndTestNoIn(PROJECT_ID, testNos)).willReturn(2L);

        learnerResultDAO.deleteAll(new User(USER_ID), PROJECT_ID, testNos);

        verify(learnerResultRepository).deleteByProject_IdAndTestNoIn(PROJECT_ID, testNos);
    }

    private List<LearnerResult> createLearnerResultsList() throws NotFoundException {
        List<LearnerResult> results = new ArrayList<>();
        for (int i = 0; i < RESULTS_AMOUNT; i++) {
            LearnerResult r = new LearnerResult();
            Project project = new Project(1L);
            Symbol s1 = new Symbol();
            s1.setId(1L);
            s1.setProject(project);
            Symbol s2 = new Symbol();
            s2.setId(2L);
            s2.setProject(project);
            results.add(r);
        }
        return results;
    }

}
