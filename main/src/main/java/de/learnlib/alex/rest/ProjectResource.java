package de.learnlib.alex.rest;

import de.learnlib.alex.core.dao.ProjectDAO;
import de.learnlib.alex.core.entities.Project;
import de.learnlib.alex.core.entities.User;
import de.learnlib.alex.exceptions.NotFoundException;
import de.learnlib.alex.security.UnauthorizedException;
import de.learnlib.alex.security.UserPrincipal;
import de.learnlib.alex.utils.ResourceErrorHandler;
import de.learnlib.alex.utils.ResponseHelper;
import org.eclipse.jetty.server.UserIdentity;

import javax.annotation.security.RolesAllowed;
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
import javax.ws.rs.core.*;
import javax.ws.rs.core.Response.Status;
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

    /** The security context containing the user of the request */
    @Context
    SecurityContext securityContext;

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
    @RolesAllowed({"REGISTERED"})
    public Response create(Project project) {
        User user = ((UserPrincipal) securityContext.getUserPrincipal()).getUser();
        project.setUser(user);

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
     *         this parameter. Valid values are: 'symbols', 'groups', 'default_group' & 'test_results'.
     *         You can request multiple by just put a ',' between them.
     * @return All projects in a list.
     * @responseType java.util.List<de.learnlib.alex.core.entities.Project>
     * @successResponse 200 OK
     */
    @GET
    @RolesAllowed({"REGISTERED"})
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAll(@QueryParam("embed") String embed) {
        User user = ((UserPrincipal) securityContext.getUserPrincipal()).getUser();

        ProjectDAO.EmbeddableFields[] embeddableFields;
        try {
            embeddableFields = parseEmbeddableFields(embed);
        } catch (IllegalArgumentException e) {
            return ResourceErrorHandler.createRESTErrorMessage("ProjectResource.get", Status.BAD_REQUEST, e);
        }

        List<Project> projects = projectDAO.getAll(user, embeddableFields);
        return ResponseHelper.renderList(projects, Status.OK);
    }

    /**
     * Get a specific project.
     *
     * @param id
     *            The ID of the project.
     * @param embed
     *         By default no related objects are included in the project. However you can ask to include them with
     *         this parameter. Valid values are: 'symbols', 'groups', 'default_group' & 'test_results'.
     *         You can request multiple by just put a ',' between them.
     * @return The project or an error message.
     * @responseType de.learnlib.alex.core.entities.Project
     * @successResponse 200 OK
     * @errorResponse   404 not found `de.learnlib.alex.utils.ResourceErrorHandler.RESTError
     */
    @GET
    @Path("/{id}")
    @RolesAllowed({"REGISTERED"})
    @Produces(MediaType.APPLICATION_JSON)
    public Response get(@PathParam("id") long id, @QueryParam("embed") String embed) {
        User user = ((UserPrincipal) securityContext.getUserPrincipal()).getUser();

        ProjectDAO.EmbeddableFields[] embeddableFields;
        try {
            embeddableFields = parseEmbeddableFields(embed);
            Project project = projectDAO.getByID(id, embeddableFields);

            if (project.getUser().equals(user)) {
                return Response.ok(project).build();
            } else {
                throw new UnauthorizedException("You are not allowed to view this project");
            }
        } catch (IllegalArgumentException e) {
            return ResourceErrorHandler.createRESTErrorMessage("ProjectResource.get", Status.BAD_REQUEST, e);
        } catch (NotFoundException e) {
            return ResourceErrorHandler.createRESTErrorMessage("ProjectResource.get", Status.NOT_FOUND, null);
        } catch (UnauthorizedException e) {
            return ResourceErrorHandler.createRESTErrorMessage("ProjectResource.get", Status.UNAUTHORIZED, e);
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
    @RolesAllowed({"REGISTERED"})
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response update(@PathParam("id") long id, Project project) {
        User user = ((UserPrincipal) securityContext.getUserPrincipal()).getUser();

        if (id != project.getId()) {
            return Response.status(Status.BAD_REQUEST).build();
        } else {
            try {
                if(user.equals(project.getUser())) {
                    projectDAO.update(project);
                    return Response.ok(project).build();
                } else {
                    throw new UnauthorizedException("You are not allowed to update this project");
                }
            } catch (NotFoundException e) {
                return ResourceErrorHandler.createRESTErrorMessage("ProjectResource.update", Status.NOT_FOUND, e);
            } catch (ValidationException e) {
                return ResourceErrorHandler.createRESTErrorMessage("ProjectResource.update", Status.BAD_REQUEST, e);
            } catch (UnauthorizedException e) {
                return ResourceErrorHandler.createRESTErrorMessage("ProjectResource.update", Status.UNAUTHORIZED, e);
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
    @RolesAllowed({"REGISTERED"})
    public Response delete(@PathParam("id") long id) {
        User user = ((UserPrincipal) securityContext.getUserPrincipal()).getUser();

        try {
            Project project = projectDAO.getByID(id);
            if (project.getUser().equals(user)) {
                projectDAO.delete(id);
                return Response.status(Status.NO_CONTENT).build();
            } else {
                throw new UnauthorizedException("You are not allowed to delete this project");
            }
        } catch (NotFoundException e) {
            return ResourceErrorHandler.createRESTErrorMessage("ProjectResource.delete", Status.NOT_FOUND, e);
        } catch (UnauthorizedException e) {
            return ResourceErrorHandler.createRESTErrorMessage("ProjectResource.delete", Status.UNAUTHORIZED, e);
        }
    }

    private ProjectDAO.EmbeddableFields[] parseEmbeddableFields(String embed) throws IllegalArgumentException {
        if (embed == null) {
            return new ProjectDAO.EmbeddableFields[0];
        }

        String[] fields = embed.split(",");

        ProjectDAO.EmbeddableFields[] embedFields = new ProjectDAO.EmbeddableFields[fields.length];
        for (int i = 0; i < fields.length; i++) {
            embedFields[i] = ProjectDAO.EmbeddableFields.fromString(fields[i]);
        }

        return embedFields;
    }

}
