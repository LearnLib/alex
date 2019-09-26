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
import de.learnlib.alex.common.utils.IdsList;
import de.learnlib.alex.data.dao.ProjectDAO;
import de.learnlib.alex.data.entities.CreateProjectForm;
import de.learnlib.alex.data.entities.Project;
import de.learnlib.alex.data.entities.export.ProjectExportableEntity;
import de.learnlib.alex.data.events.ProjectEvent;
import de.learnlib.alex.data.services.export.ProjectExporter;
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
import java.util.List;

@Path("/projects")
@RolesAllowed({"REGISTERED"})
public class ProjectResource {

    private static final Logger LOGGER = LogManager.getLogger();

    @Context
    private SecurityContext securityContext;

    private ProjectDAO projectDAO;
    private WebhookService webhookService;
    private ProjectExporter projectExporter;

    @Inject
    public ProjectResource(ProjectDAO projectDAO,
                           WebhookService webhookService,
                           ProjectExporter projectExporter) {
        this.projectDAO = projectDAO;
        this.webhookService = webhookService;
        this.projectExporter = projectExporter;
    }

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
    public Response create(CreateProjectForm project) {
        final User user = ((UserPrincipal) securityContext.getUserPrincipal()).getUser();
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
        final User user = ((UserPrincipal) securityContext.getUserPrincipal()).getUser();
        LOGGER.traceEntry("getAll({}) for user {}.", embed, user);

        final List<Project> projects = projectDAO.getAll(user);
        LOGGER.traceExit(projects);
        return Response.ok(projects).build();
    }

    /**
     * Get a specific project.
     *
     * @param projectId
     *         The ID of the project.
     * @return The project or an error message.
     */
    @GET
    @Path("/{projectId}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response get(@PathParam("projectId") long projectId) {
        final User user = ((UserPrincipal) securityContext.getUserPrincipal()).getUser();
        LOGGER.traceEntry("get({}) for user {}.", projectId, user);

        final Project project = projectDAO.getByID(user, projectId);
        return Response.ok(project).build();
    }

    /**
     * Update a specific project.
     *
     * @param projectId
     *         The ID of the project.
     * @param project
     *         The new values
     * @return On success the updated project (enhanced with information from the DB); an error message on failure.
     */
    @PUT
    @Path("/{projectId}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response update(@PathParam("projectId") Long projectId, Project project) {
        final User user = ((UserPrincipal) securityContext.getUserPrincipal()).getUser();
        LOGGER.traceEntry("update({}, {}) for user {}.", projectId, project, user);

        final Project updatedProject = projectDAO.update(user, projectId, project);
        webhookService.fireEvent(user, new ProjectEvent.Updated(updatedProject));
        LOGGER.traceExit(updatedProject);
        return Response.ok(updatedProject).build();
    }

    /**
     * Delete a specific project.
     *
     * @param projectId
     *         The ID of the project.
     * @return On success no content will be returned; an error message on failure.
     */
    @DELETE
    @Path("/{projectId}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response delete(@PathParam("projectId") long projectId) {
        final User user = ((UserPrincipal) securityContext.getUserPrincipal()).getUser();
        LOGGER.traceEntry("delete({}) for user {}.", projectId, user);

        projectDAO.delete(user, projectId);
        webhookService.fireEvent(user, new ProjectEvent.Deleted(projectId));
        LOGGER.traceExit("Project {} deleted", projectId);
        return Response.status(Status.NO_CONTENT).build();
    }

    /**
     * Delete multiple projects at once.
     *
     * @param projectIds
     *         The IDs of the projects to delete.
     * @return 204 No content on success
     */
    @DELETE
    @Path("/batch/{projectIds}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response delete(@PathParam("projectIds") IdsList projectIds) {
        final User user = ((UserPrincipal) securityContext.getUserPrincipal()).getUser();
        LOGGER.traceEntry("delete({}) for user {}.", projectIds, user);

        projectDAO.delete(user, projectIds);
        LOGGER.traceExit("Projects {} deleted", projectIds);
        return Response.status(Status.NO_CONTENT).build();
    }

    /**
     * Export a project as JSON document.
     *
     * @param projectId
     *         The ID of the project to export.
     * @return The exported project.
     * @throws Exception
     *         If something goes wrong.
     */
    @POST
    @Path("/{projectId}/export")
    @Produces(MediaType.APPLICATION_JSON)
    public Response exportProject(@PathParam("projectId") Long projectId) throws Exception {
        final User user = ((UserPrincipal) securityContext.getUserPrincipal()).getUser();
        return Response.status(Status.OK).entity(projectExporter.export(user, projectId)).build();
    }

    /**
     * Import a project, its symbols and tests.
     *
     * @param project
     *         The project to import
     * @return the imported project.
     */
    @POST
    @Path("/import")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response importProject(ProjectExportableEntity project) {
        final User user = ((UserPrincipal) securityContext.getUserPrincipal()).getUser();
        final Project importedProject = projectDAO.importProject(user, project);
        webhookService.fireEvent(user, new ProjectEvent.Created(importedProject));
        return Response.status(Status.OK).entity(importedProject).build();
    }
}
