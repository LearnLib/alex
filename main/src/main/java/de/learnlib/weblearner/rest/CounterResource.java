package de.learnlib.weblearner.rest;

import de.learnlib.weblearner.core.dao.CounterDAO;
import de.learnlib.weblearner.core.entities.Counter;

import javax.inject.Inject;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.List;

@Path("/projects/{project_id}/counters")
public class CounterResource {

    @Inject
    private  CounterDAO counterDAO;

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAllCounters(@PathParam("project_id") Long projectId) {
        List<Counter> counters = counterDAO.getAll(projectId);
        return Response.ok(counters).build();
    }

    @DELETE
    @Path("/{counter_name}")
    public Response deleteCounter(@PathParam("project_id") Long projectId, @PathParam("counter_name") String name) {
        counterDAO.delete(projectId, name);
        return Response.status(Response.Status.NO_CONTENT).build();
    }

}
