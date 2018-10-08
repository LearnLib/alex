/*
 * Copyright 2018 TU Dortmund
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package de.learnlib.alex.data.rest;

import de.learnlib.alex.auth.entities.User;
import de.learnlib.alex.auth.security.UserPrincipal;
import de.learnlib.alex.common.exceptions.NotFoundException;
import de.learnlib.alex.common.utils.ResourceErrorHandler;
import de.learnlib.alex.common.utils.ResponseHelper;
import de.learnlib.alex.data.dao.ProjectDAO;
import de.learnlib.alex.data.entities.Project;
import de.learnlib.alex.data.events.ProjectEvent;
import de.learnlib.alex.webhooks.services.WebhookService;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.apache.shiro.authz.UnauthorizedException;

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
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;
import javax.ws.rs.core.SecurityContext;
import javax.ws.rs.core.UriInfo;
import java.util.List;
import java.util.Objects;

/**
 * REST API to manage the projects.
 */
@Path("/projects")
@RolesAllowed({"REGISTERED"})
public class ProjectResource {

    private static final Logger LOGGER = LogManager.getLogger();

    /** Context information about the URI. */
    @Context
    private UriInfo uri;

    /** The {@link ProjectDAO} to use. */
    @Inject
    private ProjectDAO projectDAO;

    /** The security context containing the user of the request. */
    @Context
    private SecurityContext securityContext;

    /** The {@link WebhookService} to use. */
    @Inject
    private WebhookService webhookService;

    /**
     * Create a new Project.
     *
     * @param project
     *            The project to create.
     * @return On success the added project (enhanced with information from the DB); an error message on failure.
     */
    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response create(Project project) {
        User user = ((UserPrincipal) securityContext.getUserPrincipal()).getUser();
        LOGGER.traceEntry("create({}) for user {}.", project, user);
        Response response;

        // make sure that if an user for a project is given, it the correct user id.
        if (project.getUser() != null && !user.equals(project.getUser())) {
            ValidationException e = new ValidationException("The given user id does not belong to the current user!");
            LOGGER.catching(e);
            response = ResourceErrorHandler.createRESTErrorMessage("ProjectResource.create", Status.FORBIDDEN, e);
            return LOGGER.traceExit(response);
        }

        project.setUser(user);

        try {
            final Project createdProject = projectDAO.create(project);
            webhookService.fireEvent(user, new ProjectEvent.Created(createdProject));
            response = Response.status(Status.CREATED).entity(createdProject).build();
        } catch (ValidationException e) {
            LOGGER.catching(e);
            response = ResourceErrorHandler.createRESTErrorMessage("ProjectResource.create", Status.BAD_REQUEST, e);
        }
        return LOGGER.traceExit(response);
    }

    /**
     * Get a list of all the projects owned by the user of the request.
     *
     * @param embed
     *         By default no related objects are included in the projects. However you can ask to include them with
     *         this parameter. Valid values are: 'symbols', 'groups', 'default_group', 'test_results' & 'counters'.
     *         You can request multiple by just put a ',' between them.
     * @return All projects in a list. This list can be empty.
     */
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAll(@QueryParam("embed") String embed) {
        User user = ((UserPrincipal) securityContext.getUserPrincipal()).getUser();
        LOGGER.traceEntry("getAll({}) for user {}.", embed, user);

        ProjectDAO.EmbeddableFields[] embeddableFields;
        try {
            embeddableFields = parseEmbeddableFields(embed);
        } catch (IllegalArgumentException e) {
            LOGGER.traceExit(e);
            return ResourceErrorHandler.createRESTErrorMessage("ProjectResource.get", Status.BAD_REQUEST, e);
        }

        List<Project> projects = projectDAO.getAll(user, embeddableFields);

        LOGGER.traceExit(projects);
        return ResponseHelper.renderList(projects, Status.OK);
    }

    /**
     * Get a specific project.
     *
     * @param projectId
     *            The ID of the project.
     * @param embed
     *         By default no related objects are included in the project. However you can ask to include them with
     *         this parameter. Valid values are: 'symbols', 'groups', 'default_group', 'test_results' & 'counters'.
     *         You can request multiple by just put a ',' between them.
     * @return The project or an error message.
     * @throws NotFoundException If the requested Project could not be found.
     */
    @GET
    @Path("/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response get(@PathParam("id") long projectId, @QueryParam("embed") String embed) throws NotFoundException {
        User user = ((UserPrincipal) securityContext.getUserPrincipal()).getUser();
        LOGGER.traceEntry("get({}, {}) for user {}.", projectId, embed, user);

        ProjectDAO.EmbeddableFields[] embeddableFields;
        try {
            embeddableFields = parseEmbeddableFields(embed);
            Project project = projectDAO.getByID(user.getId(), projectId, embeddableFields);

            if (project.getUser().equals(user)) {
                LOGGER.traceExit(project);
                return Response.ok(project).build();
            } else {
                throw new UnauthorizedException("You are not allowed to view this project");
            }
        } catch (IllegalArgumentException e) {
            LOGGER.traceExit(e);
            return ResourceErrorHandler.createRESTErrorMessage("ProjectResource.get", Status.BAD_REQUEST, e);
        } catch (UnauthorizedException e) {
            LOGGER.traceExit(e);
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
     * @throws NotFoundException If the given Project could not be found.
     */
    @PUT
    @Path("/{id}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response update(@PathParam("id") long id, Project project) throws NotFoundException {
        User user = ((UserPrincipal) securityContext.getUserPrincipal()).getUser();
        LOGGER.traceEntry("update({}, {}) for user {}.", id, project, user);

        if (id != project.getId()) {
            LOGGER.traceExit("Wrong Project ID");
            return Response.status(Status.BAD_REQUEST).build();
        } else {
            try {
                final Project updatedProject = projectDAO.update(user, project);
                webhookService.fireEvent(user, new ProjectEvent.Updated(updatedProject));
                LOGGER.traceExit(updatedProject);
                return Response.ok(updatedProject).build();
            } catch (ValidationException e) {
                LOGGER.traceExit(e);
                return ResourceErrorHandler.createRESTErrorMessage("ProjectResource.update", Status.BAD_REQUEST, e);
            } catch (UnauthorizedException e) {
                LOGGER.traceExit(e);
                return ResourceErrorHandler.createRESTErrorMessage("ProjectResource.update", Status.UNAUTHORIZED, e);
            }
        }
    }

    /**
     * Delete a specific project.
     *
     * @param projectId
     *            The ID of the project.
     * @return On success no content will be returned; an error message on failure.
     * @throws NotFoundException If the given Project could not be found.
     */
    @DELETE
    @Path("/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response delete(@PathParam("id") long projectId) throws NotFoundException {
        User user = ((UserPrincipal) securityContext.getUserPrincipal()).getUser();
        LOGGER.traceEntry("delete({}) for user {}.", projectId, user);

        try {
            Project project = projectDAO.getByID(user.getId(), projectId);

            if ((project.getUser() != null && !user.equals(project.getUser()))
                    || (project.getUser().getId() != 0 && !Objects.equals(project.getUser().getId(), user.getId()))) {
                throw new UnauthorizedException("You are not allowed to delete this project");
            }

            project.setUser(user);
            projectDAO.delete(user, projectId);
            webhookService.fireEvent(user, new ProjectEvent.Deleted(project.getId()));
            LOGGER.traceExit("Project {} deleted", projectId);
            return Response.status(Status.NO_CONTENT).build();
        } catch (UnauthorizedException e) {
            LOGGER.traceExit(e);
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
