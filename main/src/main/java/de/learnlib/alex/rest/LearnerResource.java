package de.learnlib.alex.rest;

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
     */
    @POST
    @Path("/start/{project_id}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response start(@PathParam("project_id") long projectId, LearnerConfiguration configuration) {
        LearnerStatus status = new LearnerStatus(learner);
        try {
            Project project = projectDAO.getByID(projectId, "all");
            //TODO(alex.s): add get(projectID, pair) to SymbolDAO
            if (configuration.getResetSymbolAsIdRevisionPair() == null) {
                throw new IllegalArgumentException("No reset symbol specified!");
            }
            List<Symbol> symbols = symbolDAO.getAll(projectId, configuration.getSymbolsAsIdRevisionPairs());
            configuration.setSymbols(symbols);

            Symbol resetSymbol = symbolDAO.get(projectId,
                                               configuration.getResetSymbolAsIdRevisionPair().getId(),
                                               configuration.getResetSymbolAsIdRevisionPair().getRevision());
            if (resetSymbol == null) {
                throw new IllegalArgumentException("No reset symbol found!");
            }
            configuration.setResetSymbol(resetSymbol);

            learner.start(project, configuration);
            return Response.ok(status).build();
        } catch (IllegalStateException e) {
            LOGGER.info("tried to start the learning again.");
            return Response.status(Status.NOT_MODIFIED).entity(status).build();
        } catch (IllegalArgumentException e) {
            return ResourceErrorHandler.createRESTErrorMessage("LearnerResource.start", Status.BAD_REQUEST, e);
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
     *
     * @return The status of the current learn process.
     * @successResponse 200 OK
     * @responseType de.learnlib.alex.core.entities.LearnerStatus
     */
    @GET
    @Path("/stop")
    @Produces(MediaType.APPLICATION_JSON)
    public Response stop() {
        LearnerStatus status = new LearnerStatus(learner);
        if (learner.isActive()) {
            learner.stop(); // Hammer Time
            return Response.ok(status).build();
        } else {
            LOGGER.info("tried to stop the learning again.");
            return Response.status(Status.NOT_MODIFIED).entity(status).build();
        }
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
     * @responseType de.learnlib.alex.core.entities.LearnerResult
     */
    @GET
    @Path("/status")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getResult() {
        return Response.ok(learner.getResult()).build();
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
        Project project = projectDAO.getByID(projectId);

        Symbol resetSymbol = symbolDAO.get(projectId, symbolSet.getResetSymbolAsIdRevisionPair());
        symbolSet.setResetSymbol(resetSymbol);

        List<Symbol> symbols = loadSymbols(projectId, symbolSet.getSymbolsAsIdRevisionPairs());
        symbolSet.setSymbols(symbols);

        List<String> results = learner.readOutputs(project, resetSymbol, symbols);

        return Response.ok(results).build();
    }

    // load all from SymbolDAO always orders the Symbols by ID
    private List<Symbol> loadSymbols(Long projectId, List<IdRevisionPair> idRevisionPairs) {
        List<Symbol> symbols = new LinkedList<>();

        idRevisionPairs.forEach(pair -> {
            Symbol symbol = symbolDAO.get(projectId, pair);
            symbols.add(symbol);
        });

        return symbols;
    }

}
