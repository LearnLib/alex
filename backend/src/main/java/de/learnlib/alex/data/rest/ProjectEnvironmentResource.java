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
import de.learnlib.alex.data.dao.ProjectEnvironmentDAO;
import de.learnlib.alex.data.entities.ProjectEnvironment;
import de.learnlib.alex.data.entities.ProjectEnvironmentVariable;
import de.learnlib.alex.data.entities.ProjectUrl;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import javax.inject.Inject;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.SecurityContext;
import java.util.List;

@Path("/projects/{projectId}/environments")
public class ProjectEnvironmentResource {

    private static final Logger LOGGER = LogManager.getLogger();

    @Context
    private SecurityContext securityContext;

    private ProjectEnvironmentDAO environmentDAO;

    @Inject
    public ProjectEnvironmentResource(ProjectEnvironmentDAO environmentDAO) {
        this.environmentDAO = environmentDAO;
    }

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAll(@PathParam("projectId") Long projectId) {
        final User user = ((UserPrincipal) securityContext.getUserPrincipal()).getUser();
        LOGGER.traceEntry("enter getAll(projectId: {}) for user {}.", projectId, user);

        final List<ProjectEnvironment> envs = environmentDAO.getAll(user, projectId);

        LOGGER.traceEntry("leave getAll(projectId: {}) for user {}.", projectId, user);
        return Response.status(Response.Status.OK).entity(envs).build();
    }

    @POST
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    public Response create(@PathParam("projectId") Long projectId, ProjectEnvironment env) {
        final User user = ((UserPrincipal) securityContext.getUserPrincipal()).getUser();
        final ProjectEnvironment createdEnv = environmentDAO.create(user, projectId, env);
        return Response.status(Response.Status.CREATED).entity(createdEnv).build();
    }

    @DELETE
    @Path("/{environmentId}")
    public Response delete(@PathParam("projectId") Long projectId, @PathParam("environmentId") Long environmentId) {
        final User user = ((UserPrincipal) securityContext.getUserPrincipal()).getUser();
        environmentDAO.delete(user, projectId, environmentId);
        return Response.status(Response.Status.NO_CONTENT).build();
    }

    @PUT
    @Path("/{environmentId}")
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    public Response update(@PathParam("projectId") Long projectId, @PathParam("environmentId") Long environmentId, ProjectEnvironment environment) {
        final User user = ((UserPrincipal) securityContext.getUserPrincipal()).getUser();
        final ProjectEnvironment updatedEnv = environmentDAO.update(user, projectId, environmentId, environment);
        return Response.status(Response.Status.OK).entity(updatedEnv).build();
    }

    @POST
    @Path("/{environmentId}/urls")
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    public Response createUrl(@PathParam("projectId") Long projectId,
                              @PathParam("environmentId") Long environmentId,
                              ProjectUrl url) {
        final User user = ((UserPrincipal) securityContext.getUserPrincipal()).getUser();
        final List<ProjectUrl> createdUrls = environmentDAO.createUrls(user, projectId, environmentId, url);
        return Response.status(Response.Status.CREATED).entity(createdUrls).build();
    }

    @DELETE
    @Path("/{environmentId}/urls/{urlId}")
    public Response deleteUrl(@PathParam("projectId") Long projectId,
                           @PathParam("environmentId") Long environmentId,
                           @PathParam("urlId") Long urlId) {
        final User user = ((UserPrincipal) securityContext.getUserPrincipal()).getUser();
        environmentDAO.deleteUrl(user, projectId, environmentId, urlId);
        return Response.status(Response.Status.NO_CONTENT).build();
    }

    @PUT
    @Path("/{environmentId}/urls/{urlId}")
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    public Response updateUrl(@PathParam("projectId") Long projectId,
                              @PathParam("environmentId") Long environmentId,
                              @PathParam("urlId") Long urlId,
                              ProjectUrl url) {
        final User user = ((UserPrincipal) securityContext.getUserPrincipal()).getUser();
        final List<ProjectUrl> updatedUrls = environmentDAO.updateUrls(user, projectId, environmentId, urlId, url);
        return Response.status(Response.Status.OK).entity(updatedUrls).build();
    }

    @POST
    @Path("/{environmentId}/variables")
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    public Response createVariable(@PathParam("projectId") Long projectId,
                              @PathParam("environmentId") Long environmentId,
                              ProjectEnvironmentVariable variable) {
        final User user = ((UserPrincipal) securityContext.getUserPrincipal()).getUser();
        final ProjectEnvironmentVariable createdVariable = environmentDAO.createVariable(user, projectId, environmentId, variable);
        return Response.status(Response.Status.CREATED).entity(createdVariable).build();
    }

    @DELETE
    @Path("/{environmentId}/variables/{varId}")
    public Response deleteVariable(@PathParam("projectId") Long projectId,
                              @PathParam("environmentId") Long environmentId,
                              @PathParam("varId") Long varId) {
        final User user = ((UserPrincipal) securityContext.getUserPrincipal()).getUser();
        environmentDAO.deleteVariable(user, projectId, environmentId, varId);
        return Response.status(Response.Status.NO_CONTENT).build();
    }

    @PUT
    @Path("/{environmentId}/variables/{varId}")
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    public Response updateUrl(@PathParam("projectId") Long projectId,
                              @PathParam("environmentId") Long environmentId,
                              @PathParam("varId") Long varId,
                              ProjectEnvironmentVariable variable) {
        final User user = ((UserPrincipal) securityContext.getUserPrincipal()).getUser();
        final ProjectEnvironmentVariable updatedVariable = environmentDAO.updateVariable(user, projectId, environmentId, varId, variable);
        return Response.status(Response.Status.OK).entity(updatedVariable).build();
    }
}
