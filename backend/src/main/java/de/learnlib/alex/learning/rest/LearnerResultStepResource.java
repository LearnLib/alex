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

package de.learnlib.alex.learning.rest;

import de.learnlib.alex.learning.dao.LearnerResultStepDAO;
import de.learnlib.alex.security.AuthContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.ValidationException;
import javax.ws.rs.core.MediaType;
import java.util.List;

@RestController
@RequestMapping("/rest/projects/{projectId}/results/{resultId}/steps")
@Transactional(rollbackFor = Exception.class)
public class LearnerResultStepResource {

    private final AuthContext authContext;
    private final LearnerResultStepDAO learnerResultStepDAO;

    @Autowired
    public LearnerResultStepResource(
            AuthContext authContext,
            LearnerResultStepDAO learnerResultStepDAO
    ) {
        this.authContext = authContext;
        this.learnerResultStepDAO = learnerResultStepDAO;
    }

    @PostMapping(
            value = "/{stepId}/hypothesis/outputs",
            consumes = MediaType.APPLICATION_JSON,
            produces = MediaType.APPLICATION_JSON
    )
    public ResponseEntity<?> getHypothesisOutputs(
            @PathVariable("projectId") Long projectId,
            @PathVariable("resultId") Long resultId,
            @PathVariable("stepId") Long stepId,
            @RequestBody List<String> input
    ) {
        final var user = authContext.getUser();
        final var step = learnerResultStepDAO.getById(user, projectId, resultId, stepId);

        if (!step.getResult().getId().equals(resultId)) {
            throw new ValidationException("The provided result ids do not match");
        }

        final var alphabet = step.getHypothesis().createAlphabet();
        final var hypothesis = step.getHypothesis().createMealyMachine(alphabet);
        final var output = hypothesis.computeOutput(input).asList();

        return ResponseEntity.ok(output);
    }

}

