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
import de.learnlib.alex.learning.entities.LearnerResultStep;
import de.learnlib.alex.learning.repositories.LearnerResultStepRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class LearnerResultStepDAO {

    @Autowired
    private ProjectDAO projectDAO;

    @Autowired
    private LearnerResultDAO learnerResultDAO;

    @Autowired
    private LearnerResultStepRepository learnerResultStepRepository;

    public LearnerResultStep getById(User user, Long projectId, Long stepId) {
        final var project = projectDAO.getByID(user, projectId);
        final var step = learnerResultStepRepository.getOne(stepId);
        checkAccess(user, project, step);
        return step;
    }

    private void checkAccess(User user, Project project, LearnerResultStep step) {
        if (step == null) {
            throw new NotFoundException("The step could not be found.");
        }

        learnerResultDAO.checkAccess(user, project, step.getResult());
    }
}
