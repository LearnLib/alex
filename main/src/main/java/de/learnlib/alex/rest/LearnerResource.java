/*
 * Copyright 2016 TU Dortmund
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

package de.learnlib.alex.rest;

import de.learnlib.alex.core.dao.LearnerResultDAO;
import de.learnlib.alex.core.dao.ProjectDAO;
import de.learnlib.alex.core.dao.SymbolDAO;
import de.learnlib.alex.core.entities.LearnerConfiguration;
import de.learnlib.alex.core.entities.LearnerResult;
import de.learnlib.alex.core.entities.LearnerResumeConfiguration;
import de.learnlib.alex.core.entities.LearnerStatus;
import de.learnlib.alex.core.entities.Project;
import de.learnlib.alex.core.entities.ReadOutputConfig;
import de.learnlib.alex.core.entities.Symbol;
import de.learnlib.alex.core.entities.User;
import de.learnlib.alex.core.entities.learnlibproxies.CompactMealyMachineProxy;
import de.learnlib.alex.core.learner.Learner;
import de.learnlib.alex.core.repositories.LearnerResultRepository;
import de.learnlib.alex.core.repositories.LearnerResultStepRepository;
import de.learnlib.alex.exceptions.LearnerException;
import de.learnlib.alex.exceptions.NotFoundException;
import de.learnlib.alex.security.UserPrincipal;
import de.learnlib.alex.utils.ResourceErrorHandler;
import de.learnlib.alex.utils.ResponseHelper;
import net.automatalib.words.Alphabet;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.apache.logging.log4j.Marker;
import org.apache.logging.log4j.MarkerManager;

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
import java.util.LinkedList;
import java.util.List;

/**
 * REST API to manage the learning.
 *
 * @resourcePath learner
 * @resourceDescription Operations about the learning
 */
@Path("/learner/")
@RolesAllowed({"REGISTERED"})
public class LearnerResource {

    private static final Logger LOGGER = LogManager.getLogger();

    private static final Marker LEARNER_MARKER = MarkerManager.getMarker("LEARNER");
    private static final Marker REST_MARKER = MarkerManager.getMarker("REST");
    private static final Marker RESOURCE_MARKER = MarkerManager.getMarker("LEARNER_RESOURCE")
            .setParents(LEARNER_MARKER, REST_MARKER);

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

    /**
     * Start the learning.
     *
     * @param projectId     The project to learn.
     * @param configuration The configuration to customize the learning.
     * @return The status of the current learn process.
     * @throws NotFoundException If the related Project could not be found.
     * @successResponse 200 OK
     * @responseType de.learnlib.alex.core.entities.LearnerStatus
     * @errorResponse 302 not modified `de.learnlib.alex.utils.ResourceErrorHandler.RESTError
     * @errorResponse 400 bad request  `de.learnlib.alex.utils.ResourceErrorHandler.RESTError
     * @errorResponse 404 not found    `de.learnlib.alex.utils.ResourceErrorHandler.RESTError
     */
    @POST
    @Path("/start/{project_id}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response start(@PathParam("project_id") long projectId, LearnerConfiguration configuration)
            throws NotFoundException {
        User user = ((UserPrincipal) securityContext.getUserPrincipal()).getUser();
        LOGGER.traceEntry("start({}, {}) for user {}.", projectId, configuration, user);

        try {
            if ((configuration.getUserId() != null && !user.getId().equals(configuration.getUserId()))
                    || (configuration.getProjectId() != null && !configuration.getProjectId().equals(projectId))) {
                throw new IllegalArgumentException("If an user or a project is provided in the configuration, "
                        + "they must match the parameters in the path!");
            }

            if (configuration.getSymbolsAsIds().contains(configuration.getResetSymbolAsId())) {
                throw new IllegalArgumentException("The reset may not be a part of the input alphabet");
            }

            Project project = projectDAO.getByID(user.getId(), projectId, ProjectDAO.EmbeddableFields.ALL);

            learner.start(user, project, configuration);
            LearnerStatus status = learner.getStatus(user);

            LOGGER.traceExit(status);
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
     * Resume the learning.
     * The project id and the test no must be the same as the very last started learn process.
     * The server must not be restarted
     *
     * @param projectId     The project to learn.
     * @param testNo     The number of the test run which should be resumed.
     * @param configuration The configuration to specify the settings for the next learning steps.
     * @return The status of the current learn process.
     * @throws NotFoundException If the previous learn job or the related Project could not be found.
     * @successResponse 200 OK
     * @responseType de.learnlib.alex.core.entities.LearnerStatus
     * @errorResponse 302 not modified `de.learnlib.alex.utils.ResourceErrorHandler.RESTError
     * @errorResponse 400 bad request  `de.learnlib.alex.utils.ResourceErrorHandler.RESTError
     * @errorResponse 404 not found    `de.learnlib.alex.utils.ResourceErrorHandler.RESTError
     */
    @POST
    @Path("/resume/{project_id}/{test_no}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response resume(@PathParam("project_id") long projectId,
                           @PathParam("test_no") long testNo,
                           LearnerResumeConfiguration configuration)
            throws NotFoundException {
        User user = ((UserPrincipal) securityContext.getUserPrincipal()).getUser();
        LOGGER.traceEntry("resume({}, {}, {}) for user {}.", projectId, testNo, configuration, user);

        try {
            Project project = projectDAO.getByID(user.getId(), projectId); // check if project exists
            LearnerResult result = learnerResultDAO.get(user.getId(), projectId, testNo, true);

            if (result == null) {
                throw new NotFoundException("No last result to resume found!");
            }

            if (result.getProjectId() != projectId || result.getTestNo() != testNo) {
                LOGGER.info(RESOURCE_MARKER,
                        "could not resume the learner of another project or with an wrong test run.");
                throw new IllegalArgumentException("The given project id or test no does not match "
                        + "with the latest learn result!");
            }

            if (configuration.getStepNo() < 0 || configuration.getStepNo() > result.getSteps().size()) {
                throw new IllegalArgumentException("The step number is not valid.");
            }

            // remove all steps after the one where learning should be continued from
            if (result.getSteps().size() > 1) {
                result.getSteps().stream()
                        .filter(step -> step.getStepNo() > configuration.getStepNo())
                        .forEach(learnerResultStepRepository::delete);
                learnerResultStepRepository.flush();
                result = learnerResultDAO.get(user.getId(), projectId, testNo, true);
                result.setHypothesis(result.getSteps().get(result.getSteps().size() - 1).getHypothesis());
                result.getStatistics().setEqsUsed(result.getSteps().size());
                learnerResultRepository.saveAndFlush(result);
            }

            learner.resume(user, project, result, configuration);
            LearnerStatus status = learner.getStatus(user);

            LOGGER.traceExit(status);
            return Response.ok(status).build();
        } catch (IllegalStateException e) {
            LOGGER.info(RESOURCE_MARKER, "tried to restart the learning while the learner is running.");
            LOGGER.traceExit(e);
            LearnerStatus status = learner.getStatus(user);
            return Response.status(Status.NOT_MODIFIED).entity(status).build();
        } catch (IllegalArgumentException e) {
            LOGGER.traceExit(e);
            return ResourceErrorHandler.createRESTErrorMessage("LearnerResource.resume", Status.BAD_REQUEST, e);
        }
    }

    /**
     * Stop the learning after the current step.
     * This does not stop the learning immediately!
     * This will always return OK, even if there is nothing to stop.
     * To see if there is currently a learning process, the status like '/active' will be returned.
     *
     * @return The status of the current learn process.
     * @successResponse 200 OK
     * @responseType de.learnlib.alex.core.entities.LearnerStatus
     */
    @GET
    @Path("/stop")
    @Produces(MediaType.APPLICATION_JSON)
    public Response stop() {
        User user = ((UserPrincipal) securityContext.getUserPrincipal()).getUser();
        LOGGER.traceEntry("stop() for user {}.", user);

        if (learner.isActive(user)) {
            learner.stop(user); // Hammer Time
        } else {
            LOGGER.info(RESOURCE_MARKER, "tried to stop the learning again.");
        }
        LearnerStatus status = learner.getStatus(user);

        LOGGER.traceExit(status);
        return Response.ok(status).build();
    }

    /**
     * Is the learner active?
     *
     * @return The status of the current learn process.
     * @successResponse 200 OK
     * @responseType de.learnlib.alex.core.entities.LearnerStatus
     */
    @GET
    @Path("/active")
    @Produces(MediaType.APPLICATION_JSON)
    public Response isActive() {
        User user = ((UserPrincipal) securityContext.getUserPrincipal()).getUser();
        LOGGER.traceEntry("isActive() for user {}.", user);

        LearnerStatus status = learner.getStatus(user);

        LOGGER.traceExit(status);
        return Response.ok(status).build();
    }

    /**
     * Get the parameters & (temporary) results of the learning.
     *
     * @return The information of the learning
     * @throws NotFoundException If the previous learn job or the related Project could not be found.
     * @successResponse 200 OK
     * @responseType de.learnlib.alex.core.entities.LearnerResult
     * @errorResponse 404 not found `de.learnlib.alex.utils.ResourceErrorHandler.RESTError
     */
    @GET
    @Path("/status")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getResult() throws NotFoundException {
        User user = ((UserPrincipal) securityContext.getUserPrincipal()).getUser();
        LOGGER.traceEntry("getResult() for user {}.", user);

        LearnerResult resultInThread = learner.getResult(user);
        if (resultInThread == null) {
            throw new NotFoundException("No result was learned in this instance of ALEX.");
        }

        learnerResultDAO.get(resultInThread.getUserId(), resultInThread.getProjectId(),
                resultInThread.getTestNo(), false);

        LOGGER.traceExit(resultInThread);
        return Response.ok(resultInThread).build();
    }

    /**
     * Get the output of a (possible) counterexample.
     * This output is generated by executing the symbols on the SUL.
     *
     * @param projectId The project id the counter example takes place in.
     * @param outputConfig The output config.
     * @return The observed output of the given input set.
     * @throws NotFoundException If the related Project could not be found.
     * @successResponse 200 OK
     * @responseType java.util.List<String>
     * @errorResponse 400 bad request `de.learnlib.alex.utils.ResourceErrorHandler.RESTError
     * @errorResponse 404 not found   `de.learnlib.alex.utils.ResourceErrorHandler.RESTError
     */
    @POST
    @Path("/outputs/{project_id}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response readOutput(@PathParam("project_id") Long projectId, ReadOutputConfig outputConfig)
            throws NotFoundException {

        User user = ((UserPrincipal) securityContext.getUserPrincipal()).getUser();
        LOGGER.traceEntry("readOutput({}, {}) for user {}.", projectId, outputConfig, user);

        try {
            Project project = projectDAO.getByID(user.getId(), projectId);

            Long resetSymbolAsId = outputConfig.getSymbols().getResetSymbolAsId();
            if (resetSymbolAsId == null) {
                throw new NotFoundException("No reset symbol specified!");
            }

            Symbol resetSymbol = symbolDAO.get(user, projectId, resetSymbolAsId);
            List<Symbol> symbols = loadSymbols(user, projectId, outputConfig.getSymbols().getSymbolsAsIds());

            List<String> outputs = learner.readOutputs(user, project, resetSymbol, symbols, outputConfig.getBrowser());

            LOGGER.traceExit(outputs);
            return ResponseHelper.renderList(outputs, Status.OK);
        } catch (LearnerException e) {
            LOGGER.traceExit(e);
            return ResourceErrorHandler.createRESTErrorMessage("LearnerResource.readOutput", Status.BAD_REQUEST, e);
        }
    }

    /**
     * Get the outputs of a word when executed to the SUL.
     *
     * @param projectId
     *          The id of the project.
     * @param readOutputConfig
     *          The config that is used to query the SUL.
     * @return
     *          A response with the output of the word.
     * @throws NotFoundException
     *          If a symbol could not be found.
     */
    @POST
    @Path("/words/{project_id}/outputs")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response readWordOutput(@PathParam("project_id") Long projectId, ReadOutputConfig readOutputConfig)
            throws NotFoundException {
        User user = ((UserPrincipal) securityContext.getUserPrincipal()).getUser();
        LOGGER.traceEntry("readOutput({}, {}) in browser {} for user {}.", projectId, readOutputConfig.getSymbols(),
                readOutputConfig.getBrowser(), user);

        try {
            Project project = projectDAO.getByID(user.getId(), projectId);

            Long resetSymbolAsId = readOutputConfig.getSymbols().getResetSymbolAsId();
            if (resetSymbolAsId == null) {
                throw new NotFoundException("No reset symbol specified!");
            }

            Symbol resetSymbol = symbolDAO.get(user, projectId, resetSymbolAsId);
            List<Symbol> symbols = loadSymbols(user, projectId, readOutputConfig.getSymbols().getSymbolsAsIds());

            Symbol dummyResetSymbol = new Symbol();
            ArrayList<Symbol> s = new ArrayList<>();
            s.add(resetSymbol);
            s.addAll(symbols);
            List<String> results = learner.readOutputs(user, project, dummyResetSymbol, s, readOutputConfig);

            LOGGER.traceExit(results);
            return ResponseHelper.renderList(results, Status.OK);
        } catch (LearnerException e) {
            LOGGER.traceExit(e);
            return ResourceErrorHandler.createRESTErrorMessage("LearnerResource.readOutput", Status.BAD_REQUEST, e);
        }
    }

    // load all from SymbolDAO always orders the Symbols by ID
    private List<Symbol> loadSymbols(User user, Long projectId, List<Long> ids) throws NotFoundException {
        List<Symbol> symbols = new LinkedList<>();
        for (Long id : ids) {
            Symbol symbol = symbolDAO.get(user, projectId, id);
            symbols.add(symbol);
        }
        return symbols;
    }

    /**
     * Test if two hypotheses are equal or not.
     * If a difference was found the separating word will be returned.
     * Otherwise, i.e. the hypotheses are equal.
     *
     * @param mealyMachineProxies A List of two (!) hypotheses, which will be compared.
     * @return '{"separatingWord": "separating word, if any"}'
     */
    @POST
    @Path("/compare")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response compareTwoUploaded(List<CompactMealyMachineProxy> mealyMachineProxies) {
        User user = ((UserPrincipal) securityContext.getUserPrincipal()).getUser();
        LOGGER.traceEntry("compareTwoUploaded({}) for user {}.", mealyMachineProxies, user);

        if (mealyMachineProxies.size() != 2) {
            IllegalArgumentException e = new IllegalArgumentException("You need to specify exactly two hypotheses!");
            return ResourceErrorHandler.createRESTErrorMessage("LearnerResource.readOutput", Status.BAD_REQUEST, e);
        }

        // make sure both hypotheses consist of the same alphabet
        Alphabet<String> sigmaA = mealyMachineProxies.get(0).createAlphabet();
        Alphabet<String> sigmaB = mealyMachineProxies.get(1).createAlphabet();

        if (sigmaA.size() != sigmaB.size() || !sigmaA.containsAll(sigmaB)) {
            IllegalArgumentException e = new IllegalArgumentException("The alphabets of the hypotheses are not "
                                                                              + "identical!");
            return ResourceErrorHandler.createRESTErrorMessage("LearnerResource.readOutput", Status.BAD_REQUEST, e);
        }

        String separatingWord = learner.compare(mealyMachineProxies.get(0), mealyMachineProxies.get(1));

        LOGGER.traceExit(separatingWord);
        return Response.ok("{\"separatingWord\": \"" + separatingWord + "\"}").build();
    }
}
