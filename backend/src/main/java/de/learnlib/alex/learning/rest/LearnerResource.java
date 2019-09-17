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
import de.learnlib.alex.auth.security.UserPrincipal;
import de.learnlib.alex.common.exceptions.NotFoundException;
import de.learnlib.alex.common.utils.LoggerMarkers;
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
import de.learnlib.alex.learning.services.Learner;
import de.learnlib.alex.webhooks.services.WebhookService;
import net.automatalib.automata.transducers.impl.compact.CompactMealy;
import net.automatalib.words.Alphabet;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import javax.annotation.security.RolesAllowed;
import javax.inject.Inject;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;
import javax.ws.rs.core.SecurityContext;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * REST API to manage the learning.
 */
@Path("/learner")
@RolesAllowed({"REGISTERED"})
public class LearnerResource {

    private static final Logger LOGGER = LogManager.getLogger();

    /** The {@link ProjectDAO} to use. */
    @Inject
    private ProjectDAO projectDAO;

    /** The {@link SymbolDAO} to use. */
    @Inject
    private SymbolDAO symbolDAO;

    /** The {@link LearnerResultDAO} to use. */
    @Inject
    private LearnerResultDAO learnerResultDAO;

    /** The {@link LearnerResultStepRepository} to use. */
    @Inject
    private LearnerResultStepRepository learnerResultStepRepository;

    /** The {@link LearnerResultRepository} to use. */
    @Inject
    private LearnerResultRepository learnerResultRepository;

    /** The {@link Learner learner} to use. */
    @Inject
    private Learner learner;

    /** The security context containing the user of the request. */
    @Context
    private SecurityContext securityContext;

    /** The {@link WebhookService} to use. */
    @Inject
    private WebhookService webhookService;

    /**
     * Start the learning.
     *
     * @param projectId
     *         The project to learn.
     * @param configuration
     *         The configuration to customize the learning.
     * @return The status of the current learn process.
     */
    @POST
    @Path("/{projectId}/start")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response start(@PathParam("projectId") long projectId, LearnerStartConfiguration configuration) {
        User user = ((UserPrincipal) securityContext.getUserPrincipal()).getUser();
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

            final Project project = projectDAO.getByID(user, projectId, ProjectDAO.EmbeddableFields.ALL);

            learner.start(user, project, configuration);
            LearnerStatus status = learner.getStatus(projectId);

            LOGGER.traceExit(status);
            webhookService.fireEvent(user, new LearnerEvent.Started(configuration));
            return Response.ok(status).build();
        } catch (IllegalStateException e) {
            LOGGER.traceExit(e);
            return ResourceErrorHandler.createRESTErrorMessage("LearnerResource.start", Status.NOT_MODIFIED, e);
        } catch (IllegalArgumentException e) {
            LOGGER.traceExit(e);
            return ResourceErrorHandler.createRESTErrorMessage("LearnerResource.start", Status.BAD_REQUEST, e);
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
    @POST
    @Path("/{projectId}/resume/{testNo}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response resume(@PathParam("projectId") long projectId,
                           @PathParam("testNo") long testNo,
                           LearnerResumeConfiguration configuration) {
        User user = ((UserPrincipal) securityContext.getUserPrincipal()).getUser();
        LOGGER.traceEntry("resume({}, {}, {}) for user {}.", projectId, testNo, configuration, user);

        try {
            configuration.setTestNo(testNo);
            configuration.checkConfiguration();
            Project project = projectDAO.getByID(user, projectId); // check if project exists
            LearnerResult result = learnerResultDAO.get(user, projectId, testNo, true);

            if (result == null) {
                throw new NotFoundException("No last result to resume found!");
            }

            if (result.getProjectId() != projectId || result.getTestNo() != testNo) {
                LOGGER.info(LoggerMarkers.LEARNER, "could not resume the learner of another project or with an wrong test run.");
                throw new IllegalArgumentException("The given project id or test no does not match with the latest learn result!");
            }

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
                result.setHypothesis(result.getSteps().get(configuration.getStepNo() - 1).getHypothesis());
                result.getStatistics().setEqsUsed(result.getSteps().size());

                // since we allow alphabets to grow, set the alphabet to the one of the latest hypothesis
                LearnerResultStep latestStep = result.getSteps().get(result.getSteps().size() - 1);
                Alphabet<String> alphabet = latestStep.getHypothesis().createAlphabet();

                result.getSymbols().removeIf(s -> !alphabet.contains(s.getComputedName()));

                // add the new alphabet symbols to the config.
                if (configuration.getSymbolsToAdd().size() > 0) {
                    Map<Long, Symbol> symbolMap = new HashMap<>();
                    symbolDAO.getByIds(user, projectId, configuration.getSymbolIds())
                            .forEach(s -> symbolMap.put(s.getId(), s));
                    configuration.getSymbolsToAdd().forEach(ps -> ps.setSymbol(symbolMap.get(ps.getSymbol().getId())));
                }

                learnerResultRepository.saveAndFlush(result);
            }

            configuration.setUserId(user.getId());

            learner.resume(user, project, result, configuration);
            LearnerStatus status = learner.getStatus(projectId);
            LOGGER.traceExit(status);

            webhookService.fireEvent(user, new LearnerEvent.Resumed(configuration));
            return Response.ok(status).build();
        } catch (IllegalStateException e) {
            LOGGER.info(LoggerMarkers.LEARNER, "tried to restart the learning while the learner is running.");
            LOGGER.traceExit(e);
            LearnerStatus status = learner.getStatus(projectId);
            return Response.status(Status.NOT_MODIFIED).entity(status).build();
        } catch (IllegalArgumentException e) {
            LOGGER.traceExit(e);
            return ResourceErrorHandler.createRESTErrorMessage("LearnerResource.resume", Status.BAD_REQUEST, e);
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
    @GET
    @Path("/{projectId}/stop")
    @Produces(MediaType.APPLICATION_JSON)
    public Response stop(@PathParam("projectId") long projectId) {
        User user = ((UserPrincipal) securityContext.getUserPrincipal()).getUser();
        LOGGER.traceEntry("stop() for user {}.", user);

        projectDAO.getByID(user, projectId); // access check

        if (learner.isActive(projectId)) {
            learner.stop(projectId);
        } else {
            LOGGER.info(LoggerMarkers.LEARNER, "tried to stop the learning again.");
        }
        LearnerStatus status = learner.getStatus(projectId);

        LOGGER.traceExit(status);
        return Response.ok(status).build();
    }

    /**
     * Get the parameters & (temporary) results of the learning.
     *
     * @param projectId
     *         The project to get the Status of.
     * @return The information of the learning
     */
    @GET
    @Path("/{projectId}/status")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getStatus(@PathParam("projectId") long projectId) {
        User user = ((UserPrincipal) securityContext.getUserPrincipal()).getUser();
        LOGGER.traceEntry("getStatus() for user {}.", user);

        LearnerStatus status = learner.getStatus(projectId);

        LOGGER.traceExit(status);
        return Response.ok(status).build();
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
    @POST
    @Path("/{projectId}/outputs")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response readOutput(@PathParam("projectId") Long projectId, ReadOutputConfig outputConfig) {
        User user = ((UserPrincipal) securityContext.getUserPrincipal()).getUser();
        LOGGER.traceEntry("readOutput({}, {}) for user {}.", projectId, outputConfig, user);

        try {
            if (outputConfig.getSymbols().getSymbols().isEmpty()) {
                final Exception e = new Exception("You have to specify at least one symbol.");
                return ResourceErrorHandler.createRESTErrorMessage("LearnerResource.readOutput", Status.BAD_REQUEST, e);
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

            List<ExecuteResult> outputs = learner.readOutputs(user, project, outputConfig);

            LOGGER.traceExit(outputs);
            return Response.ok(outputs).build();
        } catch (LearnerException e) {
            LOGGER.traceExit(e);
            return ResourceErrorHandler.createRESTErrorMessage("LearnerResource.readOutput", Status.BAD_REQUEST, e);
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
    @POST
    @Path("/compare/separatingWord")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response separatingWord(List<CompactMealyMachineProxy> mealyMachineProxies) {
        User user = ((UserPrincipal) securityContext.getUserPrincipal()).getUser();
        LOGGER.traceEntry("calculate separating word for models ({}) and user {}.", mealyMachineProxies, user);

        try {
            if (mealyMachineProxies.size() != 2) {
                throw new IllegalArgumentException("You need to specify exactly two hypotheses!");
            }

            final SeparatingWord diff = learner.separatingWord(mealyMachineProxies.get(0), mealyMachineProxies.get(1));

            LOGGER.traceExit(diff);
            return Response.ok(diff).build();
        } catch (IllegalArgumentException e) {
            return ResourceErrorHandler.createRESTErrorMessage("LearnerResource.separatingWord", Status.BAD_REQUEST, e);
        }
    }

    /**
     * Calculates the difference tree of two hypotheses.
     *
     * @param mealyMachineProxies
     *         A List of two (!) hypotheses, which will be compared.
     * @return The difference tree
     */
    @POST
    @Path("/compare/differenceTree")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response differenceTree(List<CompactMealyMachineProxy> mealyMachineProxies) {
        final User user = ((UserPrincipal) securityContext.getUserPrincipal()).getUser();
        LOGGER.traceEntry("calculate the difference tree for models ({}) and user {}.", mealyMachineProxies, user);

        try {
            if (mealyMachineProxies.size() != 2) {
                throw new IllegalArgumentException("You need to specify exactly two hypotheses!");
            }

            final CompactMealy<String, String> diffTree =
                    learner.differenceTree(mealyMachineProxies.get(0), mealyMachineProxies.get(1));

            LOGGER.traceExit(diffTree);
            return Response.ok(CompactMealyMachineProxy.createFrom(diffTree, diffTree.getInputAlphabet())).build();
        } catch (IllegalArgumentException e) {
            return ResourceErrorHandler.createRESTErrorMessage("LearnerResource.differenceTree", Status.BAD_REQUEST, e);
        }
    }
}
