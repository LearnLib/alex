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
import de.learnlib.alex.learning.entities.LearnerResult;
import de.learnlib.alex.learning.entities.LearnerResultStep;
import de.learnlib.alex.learning.repositories.LearnerResultRepository;
import de.learnlib.alex.learning.repositories.LearnerResultStepRepository;
import org.apache.shiro.authz.UnauthorizedException;
import org.hibernate.Hibernate;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(rollbackFor = Exception.class)
public class LearnerResultStepDAO {

    private final ProjectDAO projectDAO;
    private final LearnerResultDAO learnerResultDAO;
    private final LearnerResultRepository learnerResultRepository;
    private final LearnerResultStepRepository learnerResultStepRepository;

    public LearnerResultStepDAO(
            ProjectDAO projectDAO,
            @Lazy LearnerResultDAO learnerResultDAO,
            LearnerResultRepository learnerResultRepository,
            LearnerResultStepRepository learnerResultStepRepository
    ) {
        this.projectDAO = projectDAO;
        this.learnerResultDAO = learnerResultDAO;
        this.learnerResultStepRepository = learnerResultStepRepository;
        this.learnerResultRepository = learnerResultRepository;
    }

    public LearnerResultStep getById(User user, Long projectId, Long resultId, Long stepId) {
        final var project = projectDAO.getByID(user, projectId);
        final var result = learnerResultRepository.findById(resultId).orElse(null);
        final var step = learnerResultStepRepository.getOne(stepId);
        checkAccess(user, project, result, step);
        loadLazyRelations(step);
        return step;
    }

    public LearnerResultStep update(Long stepId, LearnerResultStep step) {
        final var stepToUpdate = learnerResultStepRepository.findById(stepId)
                .orElseThrow(() -> new NotFoundException("The step could not be found."));

        stepToUpdate.setStatistics(step.getStatistics());
        stepToUpdate.setCounterExample(step.getCounterExample());
        stepToUpdate.setState(step.getState());
        stepToUpdate.setAlgorithmInformation(step.getAlgorithmInformation());
        stepToUpdate.setErrorText(step.getErrorText());
        stepToUpdate.setEqOracle(step.getEqOracle());
        stepToUpdate.setModelCheckingResults(step.getModelCheckingResults());

        final var updatedStep = learnerResultStepRepository.save(stepToUpdate);
        loadLazyRelations(updatedStep);

        return updatedStep;
    }

    public void loadLazyRelations(LearnerResultStep step) {
        Hibernate.initialize(step.getModelCheckingResults());
        step.getModelCheckingResults().forEach(r -> Hibernate.initialize(r.getFormula()));
    }

    private void checkAccess(User user, Project project, LearnerResult result, LearnerResultStep step) {
        learnerResultDAO.checkAccess(user, project, result);

        if (step == null) {
            throw new NotFoundException("The step could not be found.");
        }

        if (!step.getResult().getId().equals(result.getId())) {
            throw new UnauthorizedException("You are not allowed to access the learner step.");
        }
    }
}
