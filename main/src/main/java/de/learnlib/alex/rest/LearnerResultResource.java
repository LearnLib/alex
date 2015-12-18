package de.learnlib.alex.rest;

import de.learnlib.alex.core.dao.LearnerResultDAO;
import de.learnlib.alex.core.entities.LearnerResult;
import de.learnlib.alex.core.entities.User;
import de.learnlib.alex.exceptions.NotFoundException;
import de.learnlib.alex.security.UserPrincipal;
import de.learnlib.alex.utils.IdsList;
import de.learnlib.alex.utils.ResourceErrorHandler;
import de.learnlib.alex.utils.ResponseHelper;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import javax.inject.Inject;
import javax.validation.ValidationException;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.SecurityContext;
import java.util.List;

/**
 * REST API to fetch the test results.
 * @resourcePath results
 * @resourceDescription Operations around the test results / hypotheses
 */
@Path("/projects/{project_id}/results")
public class LearnerResultResource {

    /** Use the logger for the server part. */
    private static final Logger LOGGER = LogManager.getLogger("server");

    /** The {@link de.learnlib.alex.core.dao.LearnerResultDAO} to use. */
    @Inject
    private LearnerResultDAO learnerResultDAO;

    /** The security context containing the user of the request. */
    @Context
    private SecurityContext securityContext;

    /**
     * Get all final / last results of each test run within one project.
     *
     * @param projectId
     *         The project of the test results.
     * @return A List of all final / lasts test results within one project.
     * @successResponse 200 OK
     * @responseType    java.util.List<de.learnlib.alex.core.entities.LearnerResult>
     * @errorResponse   404 not found `de.learnlib.alex.utils.ResourceErrorHandler.RESTError
     */
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAllFinalResults(@PathParam("project_id") long projectId) {
        User user = ((UserPrincipal) securityContext.getUserPrincipal()).getUser();
        LOGGER.trace("LearnerResultResource.getAllFinalResults(" + projectId + ") for user " + user + ".");

        try {
            List<LearnerResult> results = learnerResultDAO.getAll(user.getId(), projectId);
            return ResponseHelper.renderList(results, Response.Status.OK);
        } catch (NotFoundException e) {
            return ResourceErrorHandler.createRESTErrorMessage("LearnerResultResource.getAllFinalResults",
                                                                Response.Status.NOT_FOUND, e);
        }
    }

    /**
     * Get all steps of test runs, i.e. all results that were generated during the run.
     *
     * @param projectId
     *         The project of the test runs.
     * @param testNos
     *         The number(s) of the test run(s).
     * @return A List of all step of possible multiple test runs.
     * @successResponse 200 OK
     * @responseType    java.util.List<de.learnlib.alex.core.entities.LearnerResult>
     * @errorResponse   404 not found `de.learnlib.alex.utils.ResourceErrorHandler.RESTError
     */
    @GET
    @Path("{test_nos}/complete")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAllSteps(@PathParam("project_id") Long projectId,
                                @PathParam("test_nos") IdsList testNos) {
        User user = ((UserPrincipal) securityContext.getUserPrincipal()).getUser();
        LOGGER.trace("LearnerResultResource.getAllSteps(" + projectId + ", " + testNos + ") for user " + user + ".");

        try {
            if (testNos.size() == 1) {
                List<LearnerResult> result = learnerResultDAO.getAll(user.getId(), projectId, testNos.get(0));
                return ResponseHelper.renderList(result, Response.Status.OK);
            } else {
                List<List<LearnerResult>> result = learnerResultDAO.getAll(user.getId(), projectId, testNos);
                return ResponseHelper.renderList(result, Response.Status.OK);
            }
        } catch (NotFoundException e) {
            return ResourceErrorHandler.createRESTErrorMessage("LearnerResultResource.getAllSteps",
                                                               Response.Status.NOT_FOUND,  e);
        }
    }

    /**
     * Get the final / latest result of one test run.
     *
     * @param projectId
     *         The project of the test run.
     * @param testNo
     *         The number of the test run.
     * @return The final / latest result of one test run.
     * @successResponse 200 OK
     * @responseType de.learnlib.alex.core.entities.LearnerResult
     * @errorResponse   404 not found `de.learnlib.alex.utils.ResourceErrorHandler.RESTError
     */
    @GET
    @Path("{test_no}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getOneFinalResult(@PathParam("project_id") long projectId, @PathParam("test_no") long testNo) {
        User user = ((UserPrincipal) securityContext.getUserPrincipal()).getUser();
        LOGGER.trace("LearnerResultResource.getOneFinalResult(" + projectId + ", " + testNo + ") "
                     + "for user " + user + ".");

        try {
            LearnerResult json = learnerResultDAO.get(user.getId(), projectId, testNo);
            return Response.ok(json).build();
        } catch (NotFoundException e) {
            return ResourceErrorHandler.createRESTErrorMessage("LearnerResultResource.getOneFinalResult",
                                                               Response.Status.NOT_FOUND,  e);
        }
    }

    /**
     * Delete all results of one test run.
     *
     * @param projectId
     *         The project of the test run.
     * @param testNumbers
     *         The numbers of the results to delete as a comma (',') separated list.
     * @return On success no content will be returned; an error message on failure.
     * @successResponse 204 OK & no content
     * @errorResponse   404 not found `de.learnlib.alex.utils.ResourceErrorHandler.RESTError
     *                  403 forbidden `de.learnlib.alex.utils.ResourceErrorHandler.RESTError
     */
    @DELETE
    @Path("{test_numbers}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response deleteResultSet(@PathParam("project_id") Long projectId,
                                    @PathParam("test_numbers") IdsList testNumbers) {
        User user = ((UserPrincipal) securityContext.getUserPrincipal()).getUser();
        LOGGER.trace("LearnerResultResource.deleteResultSet(" + projectId + ", " + testNumbers + ") "
                     + "for user " + user + ".");

        try {
            Long[] numbersLongArray = testNumbers.toArray(new Long[testNumbers.size()]);
            learnerResultDAO.delete(user, projectId, numbersLongArray);
            return Response.status(Response.Status.NO_CONTENT).build();

        }  catch (NotFoundException e) {
            return ResourceErrorHandler.createRESTErrorMessage("LearnerResultResource.deleteResultSet",
                                                                Response.Status.NOT_FOUND,  e);
        } catch (ValidationException e) {
            return ResourceErrorHandler.createRESTErrorMessage("LearnerResultResource.deleteResultSet",
                                                                Response.Status.BAD_REQUEST, e);
        }
    }

}
