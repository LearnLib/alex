/*
 * Copyright 2015 - 2019 TU Dortmund
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
import de.learnlib.alex.common.exceptions.NotFoundException;
import de.learnlib.alex.common.utils.ResourceErrorHandler;
import de.learnlib.alex.data.dao.ProjectDAO;
import de.learnlib.alex.data.dao.SymbolDAO;
import de.learnlib.alex.data.entities.ExecuteResult;
import de.learnlib.alex.data.entities.ParameterizedSymbol;
import de.learnlib.alex.data.entities.Project;
import de.learnlib.alex.data.entities.Symbol;
import de.learnlib.alex.learning.dao.LearnerResultDAO;
import de.learnlib.alex.learning.entities.LearnerResult;
import de.learnlib.alex.learning.entities.LearnerResultStep;
import de.learnlib.alex.learning.entities.LearnerResumeConfiguration;
import de.learnlib.alex.learning.entities.LearnerStartConfiguration;
import de.learnlib.alex.learning.entities.LearnerStatus;
import de.learnlib.alex.learning.entities.ReadOutputConfig;
import de.learnlib.alex.learning.entities.SeparatingWord;
import de.learnlib.alex.learning.entities.learnlibproxies.CompactMealyMachineProxy;
import de.learnlib.alex.learning.events.LearnerEvent;
import de.learnlib.alex.learning.exceptions.LearnerException;
import de.learnlib.alex.learning.repositories.LearnerResultRepository;
import de.learnlib.alex.learning.repositories.LearnerResultStepRepository;
import de.learnlib.alex.learning.services.LearnerService;
import de.learnlib.alex.security.AuthContext;
import de.learnlib.alex.webhooks.services.WebhookService;
import net.automatalib.automata.transducers.impl.compact.CompactMealy;
import net.automatalib.words.Alphabet;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.ws.rs.core.MediaType;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * REST API to manage the learning.
 */
@RestController
@RequestMapping("/rest/projects/{projectId}/learner")
@Transactional
public class LearnerResource {

    private static final Logger LOGGER = LogManager.getLogger();

    /** The security context containing the user of the request. */
    private AuthContext authContext;
    private ProjectDAO projectDAO;
    private SymbolDAO symbolDAO;
    private LearnerResultDAO learnerResultDAO;
    private LearnerResultStepRepository learnerResultStepRepository;
    private LearnerResultRepository learnerResultRepository;
    private LearnerService learnerService;
    private WebhookService webhookService;

    @Autowired
    public LearnerResource(AuthContext authContext,
                           ProjectDAO projectDAO,
                           SymbolDAO symbolDAO,
                           LearnerResultDAO learnerResultDAO,
                           LearnerResultStepRepository learnerResultStepRepository,
                           LearnerResultRepository learnerResultRepository,
                           LearnerService learnerService,
                           WebhookService webhookService) {
        this.authContext = authContext;
        this.projectDAO = projectDAO;
        this.symbolDAO = symbolDAO;
        this.learnerResultDAO = learnerResultDAO;
        this.learnerResultStepRepository = learnerResultStepRepository;
        this.learnerResultRepository = learnerResultRepository;
        this.learnerService = learnerService;
        this.webhookService = webhookService;
    }

    /**
     * Start the learning.
     *
     * @param projectId
     *         The project to learn.
     * @param configuration
     *         The configuration to customize the learning.
     * @return The status of the current learn process.
     */
    @PostMapping(
            value = "/start",
            consumes = MediaType.APPLICATION_JSON,
            produces = MediaType.APPLICATION_JSON
    )
    public ResponseEntity start(@PathVariable("projectId") Long projectId,
                                @RequestBody LearnerStartConfiguration configuration) {
        User user = authContext.getUser();
        LOGGER.traceEntry("start({}, {}) for user {}.", projectId, configuration, user);

        try {
            if ((configuration.getUserId() != null && !user.getId().equals(configuration.getUserId()))
                    || (configuration.getProjectId() != null && !configuration.getProjectId().equals(projectId))) {
                throw new IllegalArgumentException("If an user or a project is provided in the configuration, "
                        + "they must match the parameters in the path!");
            }

            configuration.setProjectId(projectId);

            if (configuration.getSymbols().contains(configuration.getResetSymbol())) {
                throw new IllegalArgumentException("The reset may not be a part of the input alphabet");
            }

            final Project project = projectDAO.getByID(user, projectId);

            final LearnerResult learnerResult = learnerService.start(user, project, configuration);

            LOGGER.traceExit(learnerResult);
            webhookService.fireEvent(user, new LearnerEvent.Started(learnerResult));
            return ResponseEntity.ok(learnerResult);
        } catch (IllegalStateException e) {
            LOGGER.traceExit(e);
            return ResourceErrorHandler.createRESTErrorMessage("LearnerResource.start", HttpStatus.NOT_MODIFIED, e);
        } catch (IllegalArgumentException e) {
            LOGGER.traceExit(e);
            return ResourceErrorHandler.createRESTErrorMessage("LearnerResource.start", HttpStatus.BAD_REQUEST, e);
        }
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
    public ResponseEntity resume(@PathVariable("projectId") Long projectId,
                                 @PathVariable("testNo") Long testNo,
                                 @RequestBody LearnerResumeConfiguration configuration) {
        final User user = authContext.getUser();
        LOGGER.traceEntry("resume({}, {}, {}) for user {}.", projectId, testNo, configuration, user);

        try {
            configuration.setTestNo(testNo);
            configuration.setUserId(user.getId());
            configuration.checkConfiguration();
            LearnerResult result = learnerResultDAO.get(user, projectId, testNo, true);

            if (configuration.getStepNo() > result.getSteps().size()) {
                throw new IllegalArgumentException("The step number is not valid.");
            }

            // remove all steps after the one where the learning process should be continued from
            if (result.getSteps().size() > 0) {
                result.getSteps().stream()
                        .filter(s -> s.getStepNo() > configuration.getStepNo())
                        .forEach(learnerResultStepRepository::delete);
                learnerResultStepRepository.flush();

                result = learnerResultDAO.get(user, projectId, testNo, true);
                result.getStatistics().setEqsUsed(result.getSteps().size());

                // since we allow alphabets to grow, set the alphabet to the one of the latest hypothesis
                LearnerResultStep latestStep = result.getSteps().get(result.getSteps().size() - 1);
                Alphabet<String> alphabet = latestStep.getHypothesis().createAlphabet();

                result.getSymbols().removeIf(s -> !alphabet.contains(s.getAliasOrComputedName()));

                // add the new alphabet symbols to the config.
                if (configuration.getSymbolsToAdd().size() > 0) {
                    Map<Long, Symbol> symbolMap = new HashMap<>();
                    symbolDAO.getByIds(user, projectId, configuration.getSymbolIds())
                            .forEach(s -> symbolMap.put(s.getId(), s));
                    configuration.getSymbolsToAdd().forEach(ps -> ps.setSymbol(symbolMap.get(ps.getSymbol().getId())));
                }

                result.setStatus(LearnerResult.Status.PENDING);
                learnerResultRepository.saveAndFlush(result);
            }

            learnerService.resume(user, result.getProject(), result, configuration);
            webhookService.fireEvent(user, new LearnerEvent.Resumed(result));
            return ResponseEntity.ok(result);
        } catch (IllegalArgumentException e) {
            LOGGER.traceExit(e);
            return ResourceErrorHandler.createRESTErrorMessage("LearnerResource.resume", HttpStatus.BAD_REQUEST, e);
        }
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
    public ResponseEntity stop(@PathVariable("projectId") Long projectId, @PathVariable("testNo") Long testNo) {
        User user = authContext.getUser();
        LOGGER.traceEntry("stop() for user {}.", user);
        projectDAO.getByID(user, projectId); // access check
        learnerService.stop(projectId, testNo);
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
    public ResponseEntity getStatus(@PathVariable("projectId") Long projectId) {
        User user = authContext.getUser();
        LOGGER.traceEntry("getStatus() for user {}.", user);

        LearnerStatus status = learnerService.getStatus(projectId);

        LOGGER.traceExit(status);
        return ResponseEntity.ok(status);
    }

    /**
     * Get the output of a (possible) counterexample. This output is generated by executing the symbols on the SUL.
     *
     * @param projectId
     *         The project id the counter example takes place in.
     * @param outputConfig
     *         The output config.
     * @return The observed output of the given input set.
     */
    @PostMapping(
            value = "/outputs",
            consumes = MediaType.APPLICATION_JSON,
            produces = MediaType.APPLICATION_JSON
    )
    public ResponseEntity readOutput(@PathVariable("projectId") Long projectId,
                                     @RequestBody ReadOutputConfig outputConfig) {
        User user = authContext.getUser();
        LOGGER.traceEntry("readOutput({}, {}) for user {}.", projectId, outputConfig, user);

        try {
            if (outputConfig.getSymbols().getSymbols().isEmpty()) {
                final Exception e = new Exception("You have to specify at least one symbol.");
                return ResourceErrorHandler.createRESTErrorMessage("LearnerResource.readOutput", HttpStatus.BAD_REQUEST, e);
            }

            Project project = projectDAO.getByID(user, projectId);

            final ParameterizedSymbol pResetSymbol = outputConfig.getSymbols().getResetSymbol();
            if (pResetSymbol == null) {
                throw new NotFoundException("No reset symbol specified!");
            }

            final Symbol resetSymbol = symbolDAO.get(user, projectId, pResetSymbol.getSymbol().getId());
            outputConfig.getSymbols().getResetSymbol().setSymbol(resetSymbol);

            final List<Symbol> symbols = loadSymbols(user, projectId, outputConfig.getSymbols().getSymbolIds());
            final Map<Long, Symbol> symbolMap = new HashMap<>();
            symbols.forEach(s -> symbolMap.put(s.getId(), s));
            outputConfig.getSymbols().getSymbols().forEach(ps -> ps.setSymbol(symbolMap.get(ps.getSymbol().getId())));

            List<ExecuteResult> outputs = learnerService.readOutputs(user, project, outputConfig);

            LOGGER.traceExit(outputs);
            return ResponseEntity.ok(outputs);
        } catch (LearnerException e) {
            LOGGER.traceExit(e);
            return ResourceErrorHandler.createRESTErrorMessage("LearnerResource.readOutput", HttpStatus.BAD_REQUEST, e);
        }
    }

    // load all from SymbolDAO always orders the Symbols by ID
    private List<Symbol> loadSymbols(User user, Long projectId, List<Long> ids) throws NotFoundException {
        List<Symbol> symbols = new ArrayList<>();
        for (Long id : ids) {
            Symbol symbol = symbolDAO.get(user, projectId, id);
            symbols.add(symbol);
        }
        return symbols;
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
    public ResponseEntity separatingWord(@PathVariable("projectId") Long projectId,
                                         @RequestBody List<CompactMealyMachineProxy> mealyMachineProxies) {
        User user = authContext.getUser();
        LOGGER.traceEntry("calculate separating word for models ({}) and user {}.", mealyMachineProxies, user);

        try {
            if (mealyMachineProxies.size() != 2) {
                throw new IllegalArgumentException("You need to specify exactly two hypotheses!");
            }

            final SeparatingWord diff = learnerService.separatingWord(mealyMachineProxies.get(0), mealyMachineProxies.get(1));

            LOGGER.traceExit(diff);
            return ResponseEntity.ok(diff);
        } catch (IllegalArgumentException e) {
            return ResourceErrorHandler.createRESTErrorMessage("LearnerResource.separatingWord", HttpStatus.BAD_REQUEST, e);
        }
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
    public ResponseEntity differenceTree(@PathVariable("projectId") Long projectId,
                                         @RequestBody List<CompactMealyMachineProxy> mealyMachineProxies) {
        final User user = authContext.getUser();
        LOGGER.traceEntry("calculate the difference tree for models ({}) and user {}.", mealyMachineProxies, user);

        try {
            if (mealyMachineProxies.size() != 2) {
                throw new IllegalArgumentException("You need to specify exactly two hypotheses!");
            }

            final CompactMealy<String, String> diffTree =
                    learnerService.differenceTree(mealyMachineProxies.get(0), mealyMachineProxies.get(1));

            LOGGER.traceExit(diffTree);
            return ResponseEntity.ok(CompactMealyMachineProxy.createFrom(diffTree, diffTree.getInputAlphabet()));
        } catch (IllegalArgumentException e) {
            return ResourceErrorHandler.createRESTErrorMessage("LearnerResource.differenceTree", HttpStatus.BAD_REQUEST, e);
        }
    }
}
