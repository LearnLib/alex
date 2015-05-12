package de.learnlib.alex.rest;

import de.learnlib.alex.core.dao.LearnerResultDAO;
import de.learnlib.alex.core.dao.ProjectDAO;
import de.learnlib.alex.core.dao.SymbolDAO;
import de.learnlib.alex.core.entities.IdRevisionPair;
import de.learnlib.alex.core.entities.LearnerConfiguration;
import de.learnlib.alex.core.entities.LearnerResult;
import de.learnlib.alex.core.entities.LearnerResumeConfiguration;
import de.learnlib.alex.core.entities.LearnerStatus;
import de.learnlib.alex.core.entities.Project;
import de.learnlib.alex.core.entities.Symbol;
import de.learnlib.alex.core.entities.SymbolSet;
import de.learnlib.alex.core.learner.Learner;
import de.learnlib.alex.exceptions.NotFoundException;
import de.learnlib.alex.utils.ResourceErrorHandler;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import javax.inject.Inject;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;
import java.util.LinkedList;
import java.util.List;

/**
 * REST API to manage the learning.
 * @resourcePath learner
 * @resourceDescription Operations about the learning
 */
@Path("/learner/")
public class LearnerResource {

    /** Use the logger for the server part. */
    private static final Logger LOGGER = LogManager.getLogger("server");

    /** The {@link ProjectDAO} to use. */
    @Inject
    private ProjectDAO projectDAO;

    /** The {@link SymbolDAO} to use. */
    @Inject
    private SymbolDAO symbolDAO;

    @Inject
    private LearnerResultDAO learnerResultDAO;

    /** The {@link Learner learner} to use. */
    @Inject
    private Learner learner;

    /**
     * Start the learning.
     *
     * @param projectId
     *         The project to learn.
     * @param configuration
     *         The configuration to customize the learning.
     * @return The status of the current learn process.
     * @successResponse 200 OK
     * @responseType de.learnlib.alex.core.entities.LearnerStatus
     * @errorResponse   400 bad request `de.learnlib.alex.utils.ResourceErrorHandler.RESTError
     * @errorResponse   404 not found   `de.learnlib.alex.utils.ResourceErrorHandler.RESTError
     */
    @POST
    @Path("/start/{project_id}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response start(@PathParam("project_id") long projectId, LearnerConfiguration configuration) {
        LearnerStatus status = new LearnerStatus(learner);
        try {
            Project project = projectDAO.getByID(projectId, ProjectDAO.EmbeddableFields.ALL);

            try {
                Symbol resetSymbol = symbolDAO.get(projectId, configuration.getResetSymbolAsIdRevisionPair());
                configuration.setResetSymbol(resetSymbol);
            } catch (NotFoundException e) { // Extra exception to emphasize that this is the reset symbol.
                throw new NotFoundException("Could not find the reset symbol!", e);
            }

            List<Symbol> symbols = symbolDAO.getAll(projectId, configuration.getSymbolsAsIdRevisionPairs());
            configuration.setSymbols(symbols);

            learner.start(project, configuration);
            return Response.ok(status).build();
        } catch (IllegalStateException e) {
            LOGGER.info("tried to start the learning again.");
            return Response.status(Status.NOT_MODIFIED).entity(status).build();
        } catch (IllegalArgumentException e) {
            return ResourceErrorHandler.createRESTErrorMessage("LearnerResource.start", Status.BAD_REQUEST, e);
        } catch (NotFoundException e) {
            return ResourceErrorHandler.createRESTErrorMessage("LearnerResource.start", Status.NOT_FOUND, e);
        }
    }

    /**
     * Resume the learning.
     * The project id and the test no must be the same as the very last started learn process.
     * The server must not be restarted
     *
     * @param projectId
     *         The project to learn.
     * @param testRunNo
     *         The number of the test run which should be resumed.
     * @param configuration
     *         The configuration to specify the settings for the next learning steps.
     * @return The status of the current learn process.
     * @successResponse 200 OK
     * @responseType de.learnlib.alex.core.entities.LearnerStatus
     */
    @POST
    @Path("/resume/{project_id}/{test_run}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response resume(@PathParam("project_id") long projectId, @PathParam("test_run") long testRunNo,
                           LearnerResumeConfiguration configuration) {
        LearnerStatus status = new LearnerStatus(learner);
        try {
            LearnerResult lastResult = learner.getResult();
            if (lastResult.getProjectId() != projectId || lastResult.getTestNo() != testRunNo) {
                LOGGER.info("could not resume the learner of another project or with an wrong test run.");
                return Response.status(Status.NOT_MODIFIED).entity(status).build();
            }

            learner.resume(configuration);
            return Response.ok(status).build();
        } catch (IllegalStateException e) {
            LOGGER.info("tried to restart the learning while the learner is running.");
            return Response.status(Status.NOT_MODIFIED).entity(status).build();
        } catch (IllegalArgumentException e) {
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
    @POST
    @Path("/stop")
    @Produces(MediaType.APPLICATION_JSON)
    public Response stop() {
        LearnerStatus status = new LearnerStatus(learner);
        if (learner.isActive()) {
            learner.stop(); // Hammer Time
        } else {
            LOGGER.info("tried to stop the learning again.");
        }
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
        LearnerStatus status = new LearnerStatus(learner);
        return Response.ok(status).build();
    }

    /**
     * Get the parameters & (temporary) results of the learning.
     *
     * @return The information of the learning
     * @successResponse 200 OK
     * @responseType    de.learnlib.alex.core.entities.LearnerResult
     * @errorResponse   404 not found `de.learnlib.alex.utils.ResourceErrorHandler.RESTError
     */
    @GET
    @Path("/status")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getResult() {
        LearnerResult resultInThread = learner.getResult();
        if (resultInThread == null) {
            IllegalStateException e = new IllegalStateException("No result was learned in this instance of ALEX.");
            return ResourceErrorHandler.createRESTErrorMessage("LearnerResource.status", Status.NOT_FOUND, e);
        }

        try {
            learnerResultDAO.get(resultInThread.getProjectId(), resultInThread.getTestNo());
        } catch (NotFoundException nfe) {
            IllegalArgumentException e = new IllegalArgumentException("The last learned result was deleted.");
            return ResourceErrorHandler.createRESTErrorMessage("LearnerResource.status", Status.NOT_FOUND, e);
        }

        return Response.ok(resultInThread).build();
    }

    /**
     * Get the output of a (possible) counter example.
     * This output is generated by executing the symbols on the SUL.
     *
     * @param projectId
     *         The project id the counter example takes place in.
     * @param symbolSet
     *         The symbol/ input set which will be executed.
     * @return The observed output of the given input set.
     */
    @POST
    @Path("/outputs/{project_id}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response readOutput(@PathParam("project_id") Long projectId, SymbolSet symbolSet) {
        try {
            Project project = projectDAO.getByID(projectId);
            System.out.println("$$$ project: " + project);

            IdRevisionPair resetSymbolAsIdRevisionPair = symbolSet.getResetSymbolAsIdRevisionPair();
            if (resetSymbolAsIdRevisionPair == null) {
                throw new NotFoundException("No reset symbol specified!");
            }
            Symbol resetSymbol = symbolDAO.get(projectId, resetSymbolAsIdRevisionPair);
            symbolSet.setResetSymbol(resetSymbol);
            System.out.println("$$$ reset symbol: " + resetSymbol);

            List<Symbol> symbols = loadSymbols(projectId, symbolSet.getSymbolsAsIdRevisionPairs());
            symbolSet.setSymbols(symbols);
            System.out.println("$$$ symbols: " + symbols);

            List<String> results = learner.readOutputs(project, resetSymbol, symbols);

            return Response.ok(results).build();
        } catch (NotFoundException e) {
            return ResourceErrorHandler.createRESTErrorMessage("LearnerResource.readOutput", Status.NOT_FOUND, e);
        }
    }

    // load all from SymbolDAO always orders the Symbols by ID
    private List<Symbol> loadSymbols(Long projectId, List<IdRevisionPair> idRevisionPairs) throws NotFoundException {
        List<Symbol> symbols = new LinkedList<>();

        for (IdRevisionPair pair : idRevisionPairs) {
            Symbol symbol = symbolDAO.get(projectId, pair);
            symbols.add(symbol);
        }

        return symbols;
    }

}
