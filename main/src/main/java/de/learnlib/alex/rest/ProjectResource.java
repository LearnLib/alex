package de.learnlib.alex.rest;

import de.learnlib.alex.core.dao.ProjectDAO;
import de.learnlib.alex.core.entities.Project;
import de.learnlib.alex.utils.ResourceErrorHandler;

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
import javax.ws.rs.core.Response.Status;
import javax.ws.rs.core.UriInfo;
import java.util.List;

/**
 * REST API to manage the projects.
 * @resourceDescription Operations about projects
 */
@Path("/projects")
public class ProjectResource {

    /** Context information about the URI. */
    @Context
    private UriInfo uri;

    /** The {@link ProjectDAO} to use. */
    @Inject
    private ProjectDAO projectDAO;

    /**
     * Create a new Project.
     * 
     * @param project
     *            The project to create.
     * @return On success the added project (enhanced with information from the DB); an error message on failure.
     * @responseType    de.learnlib.alex.core.entities.Project
     * @successResponse 201 created
     * @errorResponse   400 bad request `de.learnlib.alex.utils.ResourceErrorHandler.RESTError
     */
    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response create(Project project) {
        try {
            projectDAO.create(project);
            String projectURL = uri.getBaseUri() + "projects/" + project.getId();
            return Response.status(Status.CREATED).header("Location", projectURL).entity(project).build();
        } catch (ValidationException e) {
            return ResourceErrorHandler.createRESTErrorMessage("ProjectResource.create", Status.BAD_REQUEST, e);
        }
    }

    /**
     * Get a list of all the projects.
     *
     * @param embed
     *         By default no related objects are included in the projects. However you can ask to include them with
     *         this parameter. Valid values are: 'symbols', 'resetSymbols' & 'testResults'.
     *         You can request multiple by just put a ',' between them.
     * @return All projects in a list.
     * @responseType java.util.List<de.learnlib.alex.core.entities.Project>
     * @successResponse 200 OK
     */
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAll(@QueryParam("embed") String embed) {
        String[] fields = null;
        if (embed != null) {
            fields = embed.split(",");
        }
        List<Project> projects = projectDAO.getAll(fields);

        return Response.status(Status.OK).header("X-Total-Count", projects.size()).entity(projects).build();
    }

    /**
     * Get a specific project.
     * 
     * @param id
     *            The ID of the project.
     * @param embed
     *         By default no related objects are included in the project. However you can ask to include them with
     *         this parameter. Valid values are: 'symbols', 'resetSymbols' & 'testResults'.
     *         You can request multiple by just put a ',' between them.
     * @return The project or an error message.
     * @responseType de.learnlib.alex.core.entities.Project
     * @successResponse 200 OK
     * @errorResponse   404 not found `de.learnlib.alex.utils.ResourceErrorHandler.RESTError
     */
    @GET
    @Path("/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response get(@PathParam("id") long id, @QueryParam("embed") String embed) {
        String[] fields = null;
        if (embed != null) {
            fields = embed.split(",");
        }
        Project project = projectDAO.getByID(id, fields);

        if (project == null) {
            return ResourceErrorHandler.createRESTErrorMessage("ProjectResource.get", Status.NOT_FOUND, null);
        } else {
            return Response.ok(project).build();
        }
    }

    /**
     * Update a specific project.
     * 
     * @param id
     *            The ID of the project.
     * @param project
     *            The new values
     * @return On success the updated project (enhanced with information from the DB); an error message on failure.
     * @responseType de.learnlib.alex.core.entities.Project
     * @successResponse 200 OK
     * @errorResponse   400 bad request `de.learnlib.alex.utils.ResourceErrorHandler.RESTError
     * @errorResponse   404 not found `de.learnlib.alex.utils.ResourceErrorHandler.RESTError
     */
    @PUT
    @Path("/{id}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response update(@PathParam("id") long id, Project project) {
        if (id != project.getId()) {
            return Response.status(Status.BAD_REQUEST).build();
        } else {
            try {
                projectDAO.update(project);
                return Response.ok(project).build();
            } catch (IllegalArgumentException e) {
                return ResourceErrorHandler.createRESTErrorMessage("ProjectResource.update", Status.NOT_FOUND, e);
            } catch (ValidationException e) {
                return ResourceErrorHandler.createRESTErrorMessage("ProjectResource.update", Status.BAD_REQUEST, e);
            }
        }
    }

    /**
     * Delete a specific project.
     * 
     * @param id
     *            The ID of the project.
     * @return On success no content will be returned; an error message on failure.
     * @successResponse 204 OK & no content
     * @errorResponse   404 not found `de.learnlib.alex.utils.ResourceErrorHandler.RESTError
     */
    @DELETE
    @Path("/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response delete(@PathParam("id") long id) {
        try {
            projectDAO.delete(id);
            return Response.status(Status.NO_CONTENT).build();
        } catch (IllegalArgumentException e) {
            return ResourceErrorHandler.createRESTErrorMessage("ProjectResource.delete", Status.NOT_FOUND, e);
        }
    }

}
