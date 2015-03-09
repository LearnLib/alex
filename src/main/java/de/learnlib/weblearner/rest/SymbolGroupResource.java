package de.learnlib.weblearner.rest;

import de.learnlib.weblearner.dao.SymbolDAO;
import de.learnlib.weblearner.dao.SymbolGroupDAO;
import de.learnlib.weblearner.entities.Symbol;
import de.learnlib.weblearner.entities.SymbolGroup;
import de.learnlib.weblearner.utils.ResourceErrorHandler;

import javax.inject.Inject;
import javax.validation.ValidationException;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.UriInfo;
import java.util.LinkedList;
import java.util.List;
import java.util.NoSuchElementException;

/**
 * REST API to manage groups.
 * @resourcePath groups
 * @resourceDescription Operations for groups
 */
@Path("/projects/{project_id}/groups")
public class SymbolGroupResource {

    /** Context information about the URI. */
    @Context
    private UriInfo uri;

    @Inject
    private SymbolGroupDAO symbolGroupDAO;

    @Inject
    private SymbolDAO symbolDAO;

    /**
     * Create a new group.
     *
     * @param projectId
     *         The ID of the project.
     * @param group
     *         The group to create.
     * @return On success the added group (enhanced with information from the DB); an error message on failure.
     * @responseType de.learnlib.weblearner.entities.SymbolGroup
     * @successResponse 201 created
     * @errorResponse 400 bad request `de.learnlib.weblearner.utils.ResourceErrorHandler.RESTError
     */
    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response createGroup(@PathParam("project_id") long projectId, SymbolGroup group) {
        try {
            group.setProjectId(projectId);
            symbolGroupDAO.create(group);

            String groupURL = uri.getBaseUri() + "projects/" + group.getProjectId() + "/groups/" + group.getId();
            return Response.status(Response.Status.CREATED).header("Location", groupURL).entity(group).build();
        } catch (ValidationException e) {
            return ResourceErrorHandler.createRESTErrorMessage("SymbolGroupResource.create",
                                                               Response.Status.BAD_REQUEST, e);
        }
    }

    /**
     * Get a list of all groups within on projects.
     *
     * @param projectId
     *         The ID of the project.
     * @return All groups in a list. If the project contains no groups the list will be empty.
     * @responseType java.util.List<de.learnlib.weblearner.entities.SymbolGroup>
     * @successResponse 200 OK
     * @errorResponse   404 not found `de.learnlib.weblearner.utils.ResourceErrorHandler.RESTError
     */
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAll(@PathParam("project_id") long projectId, @QueryParam("embed") String embed) {
        try {
            String[] fields = null;
            if (embed != null) {
                fields = embed.split(",");
            }
            List<SymbolGroup> groups = symbolGroupDAO.getAll(projectId, fields);
            return Response.ok(groups).build();
        } catch (NoSuchElementException e) {
            return ResourceErrorHandler.createRESTErrorMessage("SymbolGroupResource.getAll",
                                                               Response.Status.NOT_FOUND, e);
        }
    }

    /**
     * Get a one group.
     *
     * @param projectId
     *         The ID of the project.
     * @param id
     *            The ID of the group within the project.
     * @return The project or an error message.
     * @responseType de.learnlib.weblearner.entities.SymbolGroup
     * @successResponse 200 OK
     * @errorResponse   404 not found `de.learnlib.weblearner.utils.ResourceErrorHandler.RESTError
     */
    @GET
    @Path("/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response get(@PathParam("project_id") long projectId,
                        @PathParam("id") Long id,
                        @QueryParam("embed") String embed) {
        try {
            String[] fields = null;
            if (embed != null) {
                fields = embed.split(",");
            }
            SymbolGroup group = symbolGroupDAO.get(projectId, id, fields);
            return Response.ok(group).build();
        } catch (NoSuchElementException e) {
            return ResourceErrorHandler.createRESTErrorMessage("SymbolGroupResource.get", Response.Status.NOT_FOUND, e);
        }
    }

    /**
     * Not implemented yet.
     * Returns just dummy values.
     *
     * @param projectId
     *         The ID of the project.
     * @param id
     *         The ID of the group within the project.
     * @return The list of symbols within one group.
     */
    @GET
    @Path("/{id}/symbols")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getSymbols(@PathParam("project_id") long projectId, @PathParam("id") Long id) {
        List<Symbol> symbols = symbolDAO.getAllWithLatestRevision(projectId, id);

        return Response.ok(symbols).build();
    }

    /**
     * Update a group.
     *
     * @param projectId
     *         The ID of the project.
     * @param id
     *         The ID of the group within the project.
     * @param group
     *         The new values
     * @return On success the updated group (enhanced with information from the DB); an error message on failure.
     * @responseType de.learnlib.weblearner.entities.SymbolGroup
     * @successResponse 200 OK
     * @errorResponse 400 bad request `de.learnlib.weblearner.utils.ResourceErrorHandler.RESTError
     * @errorResponse 404 not found   `de.learnlib.weblearner.utils.ResourceErrorHandler.RESTError
     */
    @PUT
    @Path("/{id}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response update(@PathParam("project_id") long projectId, @PathParam("id") Long id, SymbolGroup group) {
        try {
            symbolGroupDAO.update(group);
            return Response.ok(group).build();
        } catch (NoSuchElementException e) {
            return ResourceErrorHandler.createRESTErrorMessage("SymbolGroupResource.update",
                                                               Response.Status.NOT_FOUND, e);
        } catch (ValidationException e) {
            return ResourceErrorHandler.createRESTErrorMessage("SymbolGroupResource.update",
                                                               Response.Status.BAD_REQUEST, e);
        }
    }

    /**
     * Delete a group.
     *
     * @param projectId
     *         The ID of the project.
     * @param id
     *         The ID of the group within the project.
     * @return On success no content will be returned; an error message on failure.
     * @successResponse 204 OK & no content
     * @errorResponse   404 not found `de.learnlib.weblearner.utils.ResourceErrorHandler.RESTError
     */
    @DELETE
    @Path("/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response deleteAResultSet(@PathParam("project_id") long projectId,  @PathParam("id") Long id) {
        try {
            symbolGroupDAO.delete(projectId, id);
            return Response.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResourceErrorHandler.createRESTErrorMessage("SymbolGroupResource.update",
                                                               Response.Status.BAD_REQUEST, e);
        }
    }
}
