/*
 * Copyright 2015 - 2019 TU Dortmund
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
import de.learnlib.alex.common.utils.ResourceErrorHandler;
import de.learnlib.alex.data.dao.ProjectDAO;
import de.learnlib.alex.data.entities.Project;
import de.learnlib.alex.data.events.ProjectEvent;
import de.learnlib.alex.webhooks.services.WebhookService;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import javax.annotation.security.RolesAllowed;
import javax.inject.Inject;
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
     *         The project to create.
     * @return On success the added project (enhanced with information from the DB); an error message on failure.
     */
    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response create(Project project) {
        User user = ((UserPrincipal) securityContext.getUserPrincipal()).getUser();
        LOGGER.traceEntry("create({}) for user {}.", project, user);

        final Project createdProject = projectDAO.create(user, project);
        webhookService.fireEvent(user, new ProjectEvent.Created(createdProject));
        LOGGER.traceExit(createdProject);
        return Response.status(Status.CREATED).entity(createdProject).build();
    }

    /**
     * Get a list of all the projects owned by the user of the request.
     *
     * @param embed
     *         By default no related objects are included in the projects. However you can ask to include them with this
     *         parameter. Valid values are: 'symbols', 'groups', 'default_group', 'test_results' & 'counters'. You can
     *         request multiple by just put a ',' between them.
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

        final List<Project> projects = projectDAO.getAll(user, embeddableFields);
        LOGGER.traceExit(projects);
        return Response.ok(projects).build();
    }

    /**
     * Get a specific project.
     *
     * @param projectId
     *         The ID of the project.
     * @param embed
     *         By default no related objects are included in the project. However you can ask to include them with this
     *         parameter. Valid values are: 'symbols', 'groups', 'default_group', 'test_results' & 'counters'. You can
     *         request multiple by just put a ',' between them.
     * @return The project or an error message.
     */
    @GET
    @Path("/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response get(@PathParam("id") long projectId, @QueryParam("embed") String embed) {
        User user = ((UserPrincipal) securityContext.getUserPrincipal()).getUser();
        LOGGER.traceEntry("get({}, {}) for user {}.", projectId, embed, user);

        ProjectDAO.EmbeddableFields[] embeddableFields;
        try {
            embeddableFields = parseEmbeddableFields(embed);
            final Project project = projectDAO.getByID(user.getId(), projectId, embeddableFields);
            LOGGER.traceExit(project);
            return Response.ok(project).build();
        } catch (IllegalArgumentException e) {
            LOGGER.traceExit(e);
            return ResourceErrorHandler.createRESTErrorMessage("ProjectResource.get", Status.BAD_REQUEST, e);
        }
    }

    /**
     * Update a specific project.
     *
     * @param id
     *         The ID of the project.
     * @param project
     *         The new values
     * @return On success the updated project (enhanced with information from the DB); an error message on failure.
     */
    @PUT
    @Path("/{id}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response update(@PathParam("id") long id, Project project) {
        User user = ((UserPrincipal) securityContext.getUserPrincipal()).getUser();
        LOGGER.traceEntry("update({}, {}) for user {}.", id, project, user);

        if (id != project.getId()) {
            LOGGER.traceExit("Wrong Project ID");
            return Response.status(Status.BAD_REQUEST).build();
        } else {
            final Project updatedProject = projectDAO.update(user, project);
            webhookService.fireEvent(user, new ProjectEvent.Updated(updatedProject));
            LOGGER.traceExit(updatedProject);
            return Response.ok(updatedProject).build();
        }
    }

    /**
     * Delete a specific project.
     *
     * @param projectId
     *         The ID of the project.
     * @return On success no content will be returned; an error message on failure.
     */
    @DELETE
    @Path("/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response delete(@PathParam("id") long projectId) {
        User user = ((UserPrincipal) securityContext.getUserPrincipal()).getUser();
        LOGGER.traceEntry("delete({}) for user {}.", projectId, user);

        final Project project = projectDAO.getByID(user.getId(), projectId);
        projectDAO.delete(user, projectId);
        webhookService.fireEvent(user, new ProjectEvent.Deleted(project.getId()));
        LOGGER.traceExit("Project {} deleted", projectId);
        return Response.status(Status.NO_CONTENT).build();
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
