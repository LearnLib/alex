/*
 * Copyright 2015 - 2021 TU Dortmund
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
import de.learnlib.alex.learning.repositories.LearnerResultRepository;
import de.learnlib.alex.learning.repositories.LearnerResultStepRepository;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import javax.persistence.EntityManager;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnitRunner;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.verify;

@RunWith(MockitoJUnitRunner.class)
public class LearnerResultDAOTest {

    private static final long USER_ID = 21L;
    private static final long PROJECT_ID = 42L;
    private static final int RESULTS_AMOUNT = 3;

    @Mock
    private ProjectDAO projectDAO;

    @Mock
    private LearnerResultRepository learnerResultRepository;

    @Mock
    private LearnerResultStepRepository learnerResultStepRepository;

    @Mock
    private LearnerSetupDAO learnerSetupDAO;

    @Mock
    private EntityManager entityManager;

    @Mock
    private LearnerResultStepDAO learnerResultStepDAO;

    private LearnerResultDAO learnerResultDAO;

    @Before
    public void setUp() {
        learnerResultDAO = new LearnerResultDAO(
                projectDAO,
                learnerResultRepository,
                learnerResultStepRepository,
                learnerSetupDAO,
                entityManager,
                learnerResultStepDAO
        );
    }

    @Test
    public void shouldSaveAValidLearnerResult() {
        User user = new User();
        user.setId(USER_ID);

        LearnerResult result = createLearnerResultsList().get(0);

        given(projectDAO.getByID(user, PROJECT_ID)).willReturn(result.getProject());
        given(learnerResultRepository.findHighestTestNo(PROJECT_ID)).willReturn(1L);
        given(learnerResultRepository.save(result)).willReturn(result);

        learnerResultDAO.create(user, result.getProject().getId(), result);

        verify(learnerResultRepository).save(result);
        assertEquals(2L, (long) result.getTestNo());
    }

    @Test
    public void shouldGetAllResultsOfOneProject() {
        User user = new User();

        List<LearnerResult> results = createLearnerResultsList();
        given(learnerResultRepository.findByProject_Id(PROJECT_ID)).willReturn(results);
        List<LearnerResult> resultsFromDAO = learnerResultDAO.getAll(user, PROJECT_ID);

        assertEquals(results.size(), resultsFromDAO.size());
        for (LearnerResult r : resultsFromDAO) {
            assertTrue(results.contains(r));
        }
    }

    @Test
    public void ensureThatGettingAllResultsReturnsAnEmptyListIfNoLearnerResultCouldBeFound() {
        User user = new User();

        given(learnerResultRepository.findByProject_Id(PROJECT_ID))
                .willReturn(Collections.emptyList());

        List<LearnerResult> results = learnerResultDAO.getAll(user, PROJECT_ID);
        assertEquals(results.size(), 0);
    }

    @Test
    public void shouldGetMultipleResults() {
        final var user = new User();

        final var project = new Project();
        project.setId(PROJECT_ID);

        List<LearnerResult> results = createLearnerResultsList();


        List<Long> testNos = Arrays.asList(0L, 1L, 2L);

        given(projectDAO.getByID(user, PROJECT_ID)).willReturn(project);
        given(learnerResultRepository.findByProject_IdAndTestNoIn(PROJECT_ID, testNos)).willReturn(results);

        List<LearnerResult> resultsFromDAO = learnerResultDAO.getAll(user, PROJECT_ID, testNos);

        assertEquals(results.size(), resultsFromDAO.size());
        for (LearnerResult r : resultsFromDAO) {
            assertTrue(results.contains(r));
        }
    }

    @Test(expected = NotFoundException.class)
    public void ensureThatGettingANonExistingResultThrowsAnException() {
        User user = new User();

        given(learnerResultRepository.findOneByProject_IdAndTestNo(PROJECT_ID, 0L))
                .willReturn(null);

        learnerResultDAO.getByTestNo(user, PROJECT_ID, 0L); // should fail
    }

    @Test
    public void shouldDeleteMultipleResults() {
        List<Long> testNos = Arrays.asList(0L, 1L);

        given(learnerResultRepository.deleteByProject_IdAndTestNoIn(PROJECT_ID, testNos)).willReturn(2L);

        learnerResultDAO.deleteByTestNos(new User(USER_ID), PROJECT_ID, testNos);

        verify(learnerResultRepository).deleteByProject_IdAndTestNoIn(PROJECT_ID, testNos);
    }

    private List<LearnerResult> createLearnerResultsList() {
        List<LearnerResult> results = new ArrayList<>();
        for (int i = 0; i < RESULTS_AMOUNT; i++) {
            LearnerResult r = new LearnerResult();
            Project project = new Project(PROJECT_ID);
            Symbol s1 = new Symbol();
            s1.setId(1L);
            s1.setProject(project);
            Symbol s2 = new Symbol();
            s2.setId(2L);
            s2.setProject(project);
            r.setProject(project);
            results.add(r);
        }
        return results;
    }

}
