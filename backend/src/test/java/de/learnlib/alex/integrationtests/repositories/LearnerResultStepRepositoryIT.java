/*
 * Copyright 2015 - 2022 TU Dortmund
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

import static de.learnlib.alex.integrationtests.repositories.LearnerResultRepositoryIT.createLearnerResult;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;

import de.learnlib.alex.auth.entities.User;
import de.learnlib.alex.data.entities.Project;
import de.learnlib.alex.learning.entities.LearnerResult;
import de.learnlib.alex.learning.entities.LearnerResultStep;
import de.learnlib.alex.learning.repositories.LearnerResultRepository;
import de.learnlib.alex.learning.repositories.LearnerResultStepRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;

public class LearnerResultStepRepositoryIT extends AbstractRepositoryIT {

    @Autowired
    private LearnerResultRepository learnerResultRepository;

    @Autowired
    private LearnerResultStepRepository learnerResultStepRepository;

    private Project project;

    @BeforeEach
    public void before() {
        User user = createUser("alex@test.example");
        user = userRepository.save(user);

        Project project = createProject(user, "Test Project 1");
        this.project = projectRepository.save(project);
    }

    @Test
    public void shouldSaveAValidLearnerResultStep() {
        LearnerResult result = createLearnerResult(project, 0L);
        learnerResultRepository.save(result);

        LearnerResultStep step = createLearnerResultStep(result, 0L);
        learnerResultStepRepository.save(step);

        assertNotNull(result.getId());
    }

    @Test
    public void shouldFailToSaveALearnerResultStepWithoutALearnerResult() {
        LearnerResult result = createLearnerResult(project, 0L);
        learnerResultRepository.save(result);

        LearnerResultStep step = createLearnerResultStep(null, 0L);
        assertThrows(DataIntegrityViolationException.class, () -> learnerResultStepRepository.save(step));
    }

    @Test
    public void shouldFailToSaveALearnerResultStepWithoutAStepNo() {
        LearnerResult result = createLearnerResult(project, 0L);
        learnerResultRepository.save(result);

        LearnerResultStep step = createLearnerResultStep(result, null);
        assertThrows(DataIntegrityViolationException.class, () -> learnerResultStepRepository.save(step));
    }

    @Test
    public void shouldFailToSaveALearnerResultStepWithADuplicateStepNo() {
        LearnerResult result = createLearnerResult(project, 0L);
        learnerResultRepository.save(result);

        LearnerResultStep step1 = createLearnerResultStep(result, 0L);
        learnerResultStepRepository.save(step1);
        LearnerResultStep step2 = createLearnerResultStep(result, 0L);
        assertThrows(DataIntegrityViolationException.class, () -> learnerResultStepRepository.save(step2));
    }

    @Test
    public void shouldSaveLearnerResultsWithADuplicateStepNoInDifferentLearnerResults() {
        LearnerResult result1 = createLearnerResult(project, 0L);
        learnerResultRepository.save(result1);
        LearnerResult result2 = createLearnerResult(project, 1L);
        result2 = learnerResultRepository.save(result2);

        LearnerResultStep step1 = createLearnerResultStep(result1, 0L);
        learnerResultStepRepository.save(step1);
        LearnerResultStep step2 = createLearnerResultStep(result2, 0L);

        learnerResultStepRepository.save(step2);

        assertNotNull(result2.getId());
    }

    private LearnerResultStep createLearnerResultStep(LearnerResult result, Long stepNo) {
        LearnerResultStep step = new LearnerResultStep();
        step.setResult(result);
        step.setStepNo(stepNo);
        return step;
    }
}
