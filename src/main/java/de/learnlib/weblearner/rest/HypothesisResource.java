package de.learnlib.weblearner.rest;

import de.learnlib.weblearner.dao.LearnerResultDAO;
import de.learnlib.weblearner.utils.JSONHelpers;
import de.learnlib.weblearner.utils.ResourceErrorHandler;

import javax.inject.Inject;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.List;

/**
 * REST API to fetch the test results.
 * @resourcePath results
 * @resourceDescription Operations around the test results / hypotheses
 */
@Path("/projects/{project_id}/results")
public class HypothesisResource {

    /** The {@link de.learnlib.weblearner.dao.LearnerResultDAO} to use. */
    @Inject
    private LearnerResultDAO learnerResultDAO;

    /**
     * Get all final / last results of each test run within one project.
     *
     * @param projectId
     *         The project of the test results.
     * @return A List of all final / lasts test results within one project.
     * @successResponse 200 OK
     * @responseType java.util.List<de.learnlib.weblearner.entities.LearnerResult>
     * @errorResponse   404 not found `de.learnlib.weblearner.utils.ResourceErrorHandler.RESTError
     */
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAllFinalResults(@PathParam("project_id") long projectId) {
        try {
            List<String> resultsAsJSON = learnerResultDAO.getAllAsJSON(projectId);
            String json = JSONHelpers.stringListToJSON(resultsAsJSON);
            return Response.status(Response.Status.OK)
                            .header("X-Total-Count", resultsAsJSON.size())
                            .entity(json)
                    .build();
        } catch (IllegalArgumentException e) {
            return ResourceErrorHandler.createRESTErrorMessage("HypothesesResource.getAllFinalResults",
                                                                Response.Status.NOT_FOUND,
                                                                e);
        }
    }

    /**
     * Get all steps of one test run, i.e. all results that were generated during the run.
     *
     * @param projectId
     *         The project of the test run.
     * @param testNo
     *         The number of the test run.
     * @return A List of all step of one test run.
     * @successResponse 200 OK
     * @responseType java.util.List<de.learnlib.weblearner.entities.LearnerResult>
     * @errorResponse   404 not found `de.learnlib.weblearner.utils.ResourceErrorHandler.RESTError
     */
    @GET
    @Path("{test_no}/complete")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAllOfOneRun(@PathParam("project_id") long projectId,
                                   @PathParam("test_no") long testNo) {
        try {
            List<String> resultsAsJSON = learnerResultDAO.getAllAsJSON(projectId, testNo);
            String json = JSONHelpers.stringListToJSON(resultsAsJSON);
            return Response.status(Response.Status.OK)
                            .header("X-Total-Count", resultsAsJSON.size())
                            .entity(json)
                    .build();
        } catch (IllegalArgumentException e) {
            return ResourceErrorHandler.createRESTErrorMessage("HypothesesResource.getAllOfOneRun",
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
     * @responseType de.learnlib.weblearner.entities.LearnerResult
     * @errorResponse   404 not found `de.learnlib.weblearner.utils.ResourceErrorHandler.RESTError
     */
    @GET
    @Path("{test_no}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getOneFinalResult(@PathParam("project_id") long projectId, @PathParam("test_no") long testNo) {
        try {
            String json = learnerResultDAO.getAsJSON(projectId, testNo);
            return Response.ok(json).build();
        } catch (IllegalArgumentException e) {
            return ResourceErrorHandler.createRESTErrorMessage("HypothesesResource.getOneFinalResult",
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
     * @errorResponse   404 not found `de.learnlib.weblearner.utils.ResourceErrorHandler.RESTError
     */
    @DELETE
    @Path("{test_numbers}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response deleteAResultSet(@PathParam("project_id") long projectId,
                                     @PathParam("test_numbers") String testNumbers) {
        try {
            String[] numbersStringArray = testNumbers.split(",");
            Long[] numbersLongArray = new Long[numbersStringArray.length];
            for (int i = 0; i < numbersStringArray.length; i++) {
                numbersLongArray[i] = Long.valueOf(numbersStringArray[i]);
            }

            learnerResultDAO.delete(projectId, numbersLongArray);
            return Response.status(Response.Status.NO_CONTENT).build();

        } catch (IllegalArgumentException e) {
            return ResourceErrorHandler.createRESTErrorMessage("HypothesesResource.deleteAResultSet",
                                                                Response.Status.NOT_FOUND,  e);
        }
    }

}
