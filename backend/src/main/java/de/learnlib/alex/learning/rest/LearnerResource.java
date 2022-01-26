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

package de.learnlib.alex.learning.rest;

import de.learnlib.alex.auth.entities.User;
import de.learnlib.alex.data.dao.ProjectDAO;
import de.learnlib.alex.data.entities.Project;
import de.learnlib.alex.learning.entities.LearnerResult;
import de.learnlib.alex.learning.entities.LearnerResumeConfiguration;
import de.learnlib.alex.learning.entities.LearnerStartConfiguration;
import de.learnlib.alex.learning.entities.LearnerStatus;
import de.learnlib.alex.learning.entities.SeparatingWord;
import de.learnlib.alex.learning.entities.learnlibproxies.CompactMealyMachineProxy;
import de.learnlib.alex.learning.events.LearnerEvent;
import de.learnlib.alex.learning.services.LearnerService;
import de.learnlib.alex.security.AuthContext;
import de.learnlib.alex.webhooks.services.WebhookService;
import java.util.List;
import javax.ws.rs.core.MediaType;
import net.automatalib.automata.transducers.impl.compact.CompactMealy;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * REST API to manage the learning.
 */
@RestController
@Transactional(rollbackFor = Exception.class)
@RequestMapping("/rest/projects/{projectId}/learner")
public class LearnerResource {

    private final AuthContext authContext;
    private final ProjectDAO projectDAO;
    private final LearnerService learnerService;
    private final WebhookService webhookService;

    @Autowired
    public LearnerResource(AuthContext authContext,
                           ProjectDAO projectDAO,
                           LearnerService learnerService,
                           WebhookService webhookService
    ) {
        this.authContext = authContext;
        this.projectDAO = projectDAO;
        this.learnerService = learnerService;
        this.webhookService = webhookService;
    }

    /**
     * Start the learning.
     *
     * @param projectId
     *         The project to learn.
     * @param startConfiguration
     *         The learner setup.
     * @return The status of the current learn process.
     */
    @PostMapping(
            value = "/start",
            consumes = MediaType.APPLICATION_JSON,
            produces = MediaType.APPLICATION_JSON
    )
    public ResponseEntity<LearnerResult> start(@PathVariable("projectId") Long projectId,
                                               @RequestBody LearnerStartConfiguration startConfiguration) {
        final User user = authContext.getUser();

        if (startConfiguration.getSetup().getSymbols().contains(startConfiguration.getSetup().getPreSymbol())) {
            throw new IllegalArgumentException("The reset may not be a part of the input alphabet");
        }

        final Project project = projectDAO.getByID(user, projectId);
        final LearnerResult learnerResult = learnerService.start(user, project, startConfiguration);

        webhookService.fireEvent(user, new LearnerEvent.Started(learnerResult));
        return ResponseEntity.ok(learnerResult);
    }

    /**
     * Resume the learning. The project id and the test no must be the same as the very last started learn process. The
     * server must not be restarted
     *
     * @param projectId
     *         The project to learn.
     * @param testNo
     *         The number of the test run which should be resumed.
     * @param configuration
     *         The configuration to specify the settings for the next learning steps.
     * @return The status of the current learn process.
     */
    @PostMapping(
            value = "/{testNo}/resume",
            consumes = MediaType.APPLICATION_JSON,
            produces = MediaType.APPLICATION_JSON
    )
    public ResponseEntity<LearnerResult> resume(@PathVariable("projectId") Long projectId,
                                                @PathVariable("testNo") Long testNo,
                                                @RequestBody LearnerResumeConfiguration configuration) {
        final var user = authContext.getUser();
        final var result = learnerService.resume(user, projectId, testNo, configuration);
        webhookService.fireEvent(user, new LearnerEvent.Resumed(result));
        return ResponseEntity.ok(result);
    }

    /**
     * Stop the learning after the current step. This does not stop the learning immediately! This will always return
     * OK, even if there is nothing to stop. To see if there is currently a learning process, the status like '/active'
     * will be returned.
     *
     * @param projectId
     *         The project to stop.
     * @return The status of the current learn process.
     */
    @GetMapping(
            value = "/{testNo}/stop"
    )
    public ResponseEntity<String> stop(@PathVariable("projectId") Long projectId, @PathVariable("testNo") Long testNo) {
        final var user = authContext.getUser();
        learnerService.abort(user, projectId, testNo);
        return ResponseEntity.ok().build();
    }

    /**
     * Get the parameters & (temporary) results of the learning.
     *
     * @param projectId
     *         The project to get the Status of.
     * @return The information of the learning
     */
    @GetMapping(
            value = "/status",
            produces = MediaType.APPLICATION_JSON
    )
    public ResponseEntity<LearnerStatus> getStatus(@PathVariable("projectId") Long projectId) {
        final var user = authContext.getUser();
        final var status = learnerService.getStatus(user, projectId);
        return ResponseEntity.ok(status);
    }

    /**
     * Test if two hypotheses are equal or not. If a difference was found the separating word will be returned.
     * Otherwise, i.e. the hypotheses are equal.
     *
     * @param mealyMachineProxies
     *         A List of two (!) hypotheses, which will be compared.
     * @return '{"separatingWord": "separating word, if any"}'
     */
    @PostMapping(
            value = "/compare/separatingWord",
            consumes = MediaType.APPLICATION_JSON,
            produces = MediaType.APPLICATION_JSON
    )
    public ResponseEntity<SeparatingWord> separatingWord(
            @PathVariable("projectId") Long projectId,
            @RequestBody List<CompactMealyMachineProxy> mealyMachineProxies
    ) {
        if (mealyMachineProxies.size() != 2) {
            throw new IllegalArgumentException("You need to specify exactly two hypotheses!");
        }

        final var diff = learnerService.separatingWord(mealyMachineProxies.get(0), mealyMachineProxies.get(1));
        return ResponseEntity.ok(diff);
    }

    /**
     * Calculates the difference tree of two hypotheses.
     *
     * @param mealyMachineProxies
     *         A List of two (!) hypotheses, which will be compared.
     * @return The difference tree
     */
    @PostMapping(
            value = "/compare/differenceTree",
            consumes = MediaType.APPLICATION_JSON,
            produces = MediaType.APPLICATION_JSON
    )
    public ResponseEntity<CompactMealyMachineProxy> differenceTree(
            @PathVariable("projectId") Long projectId,
            @RequestBody List<CompactMealyMachineProxy> mealyMachineProxies
    ) {
        if (mealyMachineProxies.size() != 2) {
            throw new IllegalArgumentException("You need to specify exactly two hypotheses!");
        }

        final CompactMealy<String, String> diffTree = learnerService.differenceTree(
                mealyMachineProxies.get(0),
                mealyMachineProxies.get(1)
        );

        return ResponseEntity.ok(CompactMealyMachineProxy.createFrom(diffTree, diffTree.getInputAlphabet()));
    }
}

