package de.learnlib.alex.rest;

import de.learnlib.alex.core.dao.LearnerResultDAO;
import de.learnlib.alex.utils.IdsList;
import de.learnlib.alex.utils.JSONHelpers;
import de.learnlib.alex.utils.ResourceErrorHandler;

import javax.inject.Inject;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.List;
import java.util.NoSuchElementException;

/**
 * REST API to fetch the test results.
 * @resourcePath results
 * @resourceDescription Operations around the test results / hypotheses
 */
@Path("/projects/{project_id}/results")
public class LearnerResultResource {

    /** The {@link de.learnlib.alex.core.dao.LearnerResultDAO} to use. */
    @Inject
    private LearnerResultDAO learnerResultDAO;

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
        try {
            List<String> resultsAsJSON = learnerResultDAO.getAllAsJSON(projectId);
            return Response.status(Response.Status.OK)
                            .header("X-Total-Count", resultsAsJSON.size())
                            .entity(resultsAsJSON.toString())
                    .build();
        } catch (NoSuchElementException e) {
            return ResourceErrorHandler.createRESTErrorMessage("HypothesesResource.getAllFinalResults",
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
    public Response getAllStep(@PathParam("project_id") Long projectId,
                                             @PathParam("test_nos") IdsList testNos) {
        try {
            List<?> result;
            if (testNos.size() == 1) {
                result = learnerResultDAO.getAllAsJSON(projectId, testNos.get(0));
            } else {
                result = learnerResultDAO.getAllAsJson(projectId, testNos);
            }

            return Response.status(Response.Status.OK)
                            .header("X-Total-Count", result.size())
                            .entity(result.toString())
                        .build();
        } catch (NoSuchElementException e) {
            return ResourceErrorHandler.createRESTErrorMessage("HypothesesResource.getAllStep",
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
        try {
            String json = learnerResultDAO.getAsJSON(projectId, testNo);
            return Response.ok(json).build();
        } catch (NoSuchElementException e) {
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
     * @errorResponse   404 not found `de.learnlib.alex.utils.ResourceErrorHandler.RESTError
     */
    @DELETE
    @Path("{test_numbers}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response deleteAResultSet(@PathParam("project_id") Long projectId,
                                     @PathParam("test_numbers") IdsList testNumbers) {
        try {
            Long[] numbersLongArray = testNumbers.toArray(new Long[testNumbers.size()]);
            learnerResultDAO.delete(projectId, numbersLongArray);
            return Response.status(Response.Status.NO_CONTENT).build();

        }  catch (NoSuchElementException e) {
            return ResourceErrorHandler.createRESTErrorMessage("HypothesesResource.deleteAResultSet",
                                                                Response.Status.NOT_FOUND,  e);
        }
    }

}
