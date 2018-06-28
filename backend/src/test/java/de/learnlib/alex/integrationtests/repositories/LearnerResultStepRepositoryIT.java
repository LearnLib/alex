/*
 * Copyright 2018 TU Dortmund
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

package de.learnlib.alex.integrationtests.repositories;

import de.learnlib.alex.auth.entities.User;
import de.learnlib.alex.auth.repositories.UserRepository;
import de.learnlib.alex.data.entities.Project;
import de.learnlib.alex.data.repositories.ProjectRepository;
import de.learnlib.alex.learning.entities.LearnerResult;
import de.learnlib.alex.learning.entities.LearnerResultStep;
import de.learnlib.alex.learning.repositories.LearnerResultRepository;
import de.learnlib.alex.learning.repositories.LearnerResultStepRepository;
import org.junit.After;
import org.junit.Ignore;
import org.junit.Test;
import org.springframework.dao.DataIntegrityViolationException;

import javax.inject.Inject;

import static de.learnlib.alex.integrationtests.repositories.LearnerResultRepositoryIT.createLearnerResult;
import static org.junit.Assert.assertNotNull;

@Ignore
public class LearnerResultStepRepositoryIT extends AbstractRepositoryIT {

    @Inject
    private UserRepository userRepository;

    @Inject
    private ProjectRepository projectRepository;

    @Inject
    private LearnerResultRepository learnerResultRepository;

    @Inject
    private LearnerResultStepRepository learnerResultStepRepository;

    @After
    public void tearDown() {
        // deleting the user should (!) also deleteMany all projects, groups, symbols, ... related to that user.
        userRepository.deleteAll();
    }

    @Test
    public void shouldSaveAValidLearnerResultStep() {
        User user = createUser("alex@test.example");
        user = userRepository.save(user);
        //
        Project project = createProject(user, "Test Project");
        project = projectRepository.save(project);
        //
        LearnerResult result = createLearnerResult(user, project, 0L);
        learnerResultRepository.save(result);
        //
        LearnerResultStep step = createLearnerResultStep(user, project, result, 0L);

        learnerResultStepRepository.save(step);

        assertNotNull(result.getUUID());
    }

    @Test(expected = DataIntegrityViolationException.class)
    public void shouldFailToSaveALearnerResultStepWithoutAnUser() {
        User user = createUser("alex@test.example");
        user = userRepository.save(user);
        //
        Project project = createProject(user, "Test Project");
        project = projectRepository.save(project);
        //
        LearnerResult result = createLearnerResult(user, project, 0L);
        learnerResultRepository.save(result);
        //
        LearnerResultStep step = createLearnerResultStep(null, project, result, 0L);

        learnerResultStepRepository.save(step); // should fail
    }

    @Test(expected = DataIntegrityViolationException.class)
    public void shouldFailToSaveALearnerResultStepWithoutAProject() {
        User user = createUser("alex@test.example");
        user = userRepository.save(user);
        //
        Project project = createProject(user, "Test Project");
        project = projectRepository.save(project);
        //
        LearnerResult result = createLearnerResult(user, project, 0L);
        learnerResultRepository.save(result);
        //
        LearnerResultStep step = createLearnerResultStep(user, null, result, 0L);

        learnerResultStepRepository.save(step); // should fail
    }

    @Test(expected = DataIntegrityViolationException.class)
    public void shouldFailToSaveALearnerResultStepWithoutALearnerResult() {
        User user = createUser("alex@test.example");
        user = userRepository.save(user);
        //
        Project project = createProject(user, "Test Project");
        project = projectRepository.save(project);
        //
        LearnerResult result = createLearnerResult(user, project, 0L);
        learnerResultRepository.save(result);
        //
        LearnerResultStep step = createLearnerResultStep(user, project, null, 0L);

        learnerResultStepRepository.save(step); // should fail
    }

    @Test(expected = DataIntegrityViolationException.class)
    public void shouldFailToSaveALearnerResultStepWithoutAStepNo() {
        User user = createUser("alex@test.example");
        user = userRepository.save(user);
        //
        Project project = createProject(user, "Test Project");
        project = projectRepository.save(project);
        //
        LearnerResult result = createLearnerResult(user, project, 0L);
        learnerResultRepository.save(result);
        //
        LearnerResultStep step = createLearnerResultStep(user, project, result, null);

        learnerResultStepRepository.save(step); // should fail
    }

    @Test(expected = DataIntegrityViolationException.class)
    public void shouldFailToSaveALearnerResultStepWithADuplicateStepNo() {
        User user = createUser("alex@test.example");
        user = userRepository.save(user);
        //
        Project project = createProject(user, "Test Project");
        project = projectRepository.save(project);
        //
        LearnerResult result = createLearnerResult(user, project, 0L);
        learnerResultRepository.save(result);
        //
        LearnerResultStep step1 = createLearnerResultStep(user, project, result, 0L);
        learnerResultStepRepository.save(step1);
        LearnerResultStep step2 = createLearnerResultStep(user, project, result, 0L);

        learnerResultStepRepository.save(step2); // should fail
    }

    @Test
    public void shouldSaveLearnerResultsWithADuplicateStepNoInDifferentLearnerResults() {
        User user = createUser("alex@test.example");
        user = userRepository.save(user);
        //
        Project project = createProject(user, "Test Project");
        project = projectRepository.save(project);
        //
        LearnerResult result1 = createLearnerResult(user, project, 0L);
        learnerResultRepository.save(result1);
        LearnerResult result2 = createLearnerResult(user, project, 1L);
        result2 = learnerResultRepository.save(result2);
        //
        LearnerResultStep step1 = createLearnerResultStep(user, project, result1, 0L);
        learnerResultStepRepository.save(step1);
        LearnerResultStep step2 = createLearnerResultStep(user, project, result2, 0L);

        learnerResultStepRepository.save(step2);

        assertNotNull(result2.getUUID());
    }

    /*
    @Test
    public void shouldFetchAllLearnerResultsOfAProject() {
        User user = createUser("alex@test.example");
        user = userRepository.save(user);
        //
        Project project = create(user, "Test Project");
        project = projectRepository.save(project);
        //
        LearnerResult result1 = createLearnerResult(user, project, 0L);
        learnerResultRepository.save(result1);
        LearnerResult result2 = createLearnerResult(user, project, 1L);
        learnerResultRepository.save(result2);

        List<LearnerResult> results = learnerResultRepository.findByProject_IdOrderByTestNoAsc(user, project);

        assertThat(results.size(), is(equalTo(2)));
        assertThat(results, hasItem(equalTo(result1)));
        assertThat(results, hasItem(equalTo(result2)));
    }

    @Test
    public void shouldFetchLearnerResultsOfAProjectByTheirTestNo() {
        User user = createUser("alex@test.example");
        user = userRepository.save(user);
        //
        Project project = create(user, "Test Project");
        project = projectRepository.save(project);
        //
        LearnerResult result1 = createLearnerResult(user, project, 0L);
        learnerResultRepository.save(result1);
        LearnerResult result2 = createLearnerResult(user, project, 1L);
        learnerResultRepository.save(result2);
        LearnerResult result3 = createLearnerResult(user, project, 2L);
        learnerResultRepository.save(result3);

        List<LearnerResult> results = learnerResultRepository
                .findByProject_IdAndTestNoIn(user, project, 0L, 2L);

        assertThat(results.size(), is(equalTo(2)));
        assertThat(results, hasItem(equalTo(result1)));
        assertThat(results, not(hasItem(equalTo(result2))));
        assertThat(results, hasItem(equalTo(result3)));
    }

    @Test
    public void shouldFetchHighestTestNo() {
        User user = createUser("alex@test.example");
        user = userRepository.save(user);
        //
        Project project = create(user, "Test Project");
        project = projectRepository.save(project);
        //
        LearnerResult result1 = createLearnerResult(user, project, 0L);
        learnerResultRepository.save(result1);
        LearnerResult result2 = createLearnerResult(user, project, 1L);
        learnerResultRepository.save(result2);

        Long highestTestNo = learnerResultRepository.findHighestTestNo(user, project);

        assertThat(highestTestNo, is(equalTo(1L)));
    }

    @Test
    public void shouldDeleteALearnerResult() {
        User user = createUser("alex@test.example");
        user = userRepository.save(user);
        //
        Project project = create(user, "Test Project");
        project = projectRepository.save(project);
        //
        LearnerResult result = createLearnerResult(user, project, 0L);
        learnerResultRepository.save(result);

        Long deleteReturnValue = learnerResultRepository.deleteByProject_IdAndTestNoIn(user, project, 0L);

        assertThat(deleteReturnValue, is(equalTo(1L)));
        assertThat(learnerResultRepository.count(), is(equalTo(0L)));
    }

    @Test
    public void shouldNotDeleteAnNonExistingLearnerResult() {
        User user = createUser("alex@test.example");
        user = userRepository.save(user);
        //
        Project project = create(user, "Test Project");
        project = projectRepository.save(project);

        Long deleteReturnValue = learnerResultRepository.deleteByProject_IdAndTestNoIn(user, project, -1L);

        assertThat(deleteReturnValue, is(equalTo(0L)));
    }
    */


    private LearnerResultStep createLearnerResultStep(User user, Project project, LearnerResult result, Long stepNo) {
        LearnerResultStep step = new LearnerResultStep();
        step.setResult(result);
        step.setStepNo(stepNo);
        return step;
    }

}
