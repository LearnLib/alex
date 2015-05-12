package de.learnlib.alex.rest;

import de.learnlib.alex.core.dao.CounterDAO;
import de.learnlib.alex.core.entities.Counter;
import de.learnlib.alex.exceptions.NotFoundException;
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

/**
 * Resource to read and delete Counters.
 * @resourcePath counters
 * @resourceDescription Operations around counters
 */
@Path("/projects/{project_id}/counters")
public class CounterResource {

    /** The CounterDAO to use. */
    @Inject
    private  CounterDAO counterDAO;

    /**
     * Get all counters of a project.
     *
     * @param projectId
     *         The Project ID.
     * @return A List of the counters within the project.
     * @responseType java.util.List<de.learnlib.alex.core.entities.Counter>
     * @successResponse 200 OK
     */
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAllCounters(@PathParam("project_id") Long projectId) {
        try {
            List<Counter> counters = counterDAO.getAll(projectId);
            return Response.ok(counters).header("X-Total-Count", counters.size()).build();
        } catch (NotFoundException e) {
            return ResourceErrorHandler.createRESTErrorMessage("CounterResource.getAll",
                                                               Response.Status.NOT_FOUND,
                                                               e);
        }
    }

    /**
     * Delete one counter.
     *
     * @param projectId
     *         The Project ID.
     * @param name
     *         The name of the counter to remove.
     * @return Nothing if everything went OK.
     * @successResponse 204 OK & no content
     */
    @DELETE
    @Path("/{counter_name}")
    public Response deleteCounter(@PathParam("project_id") Long projectId, @PathParam("counter_name") String name) {
        try {
            counterDAO.delete(projectId, name);
            return Response.status(Response.Status.NO_CONTENT).build();
        } catch (NotFoundException e) {
            return ResourceErrorHandler.createRESTErrorMessage("CounterResource.deleteCounter",
                                                               Response.Status.NOT_FOUND,
                                                               e);
        }

    }

}
