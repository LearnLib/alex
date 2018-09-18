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

package de.learnlib.alex.testing.rest;

import de.learnlib.alex.auth.entities.User;
import de.learnlib.alex.auth.security.UserPrincipal;
import de.learnlib.alex.common.exceptions.NotFoundException;
import de.learnlib.alex.data.dao.ProjectDAO;
import de.learnlib.alex.data.entities.Project;
import de.learnlib.alex.testing.dao.TestExecutionConfigDAO;
import de.learnlib.alex.testing.entities.TestExecutionConfig;
import de.learnlib.alex.testing.entities.TestStatus;
import de.learnlib.alex.testing.services.TestService;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.apache.shiro.authz.UnauthorizedException;

import javax.annotation.security.RolesAllowed;
import javax.inject.Inject;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.SecurityContext;
import java.util.List;

/** Endpoints for handling test configs. */
@Path("/projects/{projectId}/testConfigs")
@RolesAllowed({"REGISTERED"})
public class TestExecutionConfigResource {

    private static final Logger LOGGER = LogManager.getLogger();

    /** The injected DAO for test configs. */
    @Inject
    private TestExecutionConfigDAO testExecutionConfigDAO;

    /** The injected DAO for projects. */
    @Inject
    private ProjectDAO projectDAO;

    /** The injected service for executing tests. */
    @Inject
    private TestService testService;

    /** The security context containing the user of the request. */
    @Context
    private SecurityContext securityContext;

    /**
     * Get all test configs in a project.
     *
     * @param projectId
     *         The id of the project.
     * @return 200 and the created project on success.
     * @throws NotFoundException
     *         If one of the entities could not be found.
     * @throws UnauthorizedException
     *         If the user has not access to one of the entities.
     */
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAll(@PathParam("projectId") Long projectId) throws NotFoundException, UnauthorizedException {
        final User user = ((UserPrincipal) securityContext.getUserPrincipal()).getUser();
        LOGGER.traceEntry("getAll({}) for user {}.", projectId, user);

        final List<TestExecutionConfig> configs = testExecutionConfigDAO.getAll(user, projectId);

        LOGGER.traceExit(configs);
        return Response.ok(configs).build();
    }

    /**
     * Create a test config.
     *
     * @param projectId
     *         The id of the project.
     * @param config
     *         The config to create
     * @return 201 and the created test config on success.
     * @throws NotFoundException
     *         If one of the entities could not be found.
     * @throws UnauthorizedException
     *         If the user has not access to one of the entities.
     */
    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response create(@PathParam("projectId") Long projectId, TestExecutionConfig config)
            throws NotFoundException, UnauthorizedException {
        final User user = ((UserPrincipal) securityContext.getUserPrincipal()).getUser();
        LOGGER.traceEntry("create({}) for user {}.", projectId, user);

        final TestExecutionConfig createdConfig = testExecutionConfigDAO.create(user, projectId, config);

        LOGGER.traceExit(createdConfig);
        return Response.status(Response.Status.CREATED).entity(createdConfig).build();
    }

    /**
     * Delete a test config.
     *
     * @param projectId
     *         The id of the project.
     * @param configId
     *         The id of the test config to delete.
     * @return 204 on success.
     * @throws NotFoundException
     *         If one of the entities could not be found.
     * @throws UnauthorizedException
     *         If the user has not access to one of the entities.
     */
    @DELETE
    @Path("/{configId}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response delete(@PathParam("projectId") Long projectId, @PathParam("configId") Long configId)
            throws NotFoundException, UnauthorizedException {
        final User user = ((UserPrincipal) securityContext.getUserPrincipal()).getUser();
        LOGGER.traceEntry("delete({}) for user {}.", projectId, user);

        testExecutionConfigDAO.delete(user, projectId, configId);

        LOGGER.traceExit("Config with id " + configId + " deleted.");
        return Response.noContent().build();
    }

    /**
     * Execute the tests as defined in a test configuration.
     *
     * @param projectId
     *         The ID of the project.
     * @param configId
     *         The ID of the config.
     * @return The test status.
     * @throws NotFoundException
     *         If one of the entities could not be found.
     * @throws UnauthorizedException
     *         If the user has no access to one of the entities.
     */
    @POST
    @Path("/{configId}/execute")
    @Produces(MediaType.APPLICATION_JSON)
    public Response execute(@PathParam("projectId") Long projectId, @PathParam("configId") Long configId)
            throws NotFoundException, UnauthorizedException {
        final User user = ((UserPrincipal) securityContext.getUserPrincipal()).getUser();
        LOGGER.traceEntry("execute({}) for user {}.", projectId, user);

        final TestExecutionConfig config = testExecutionConfigDAO.get(user, projectId, configId);
        final Project project = projectDAO.getByID(user.getId(), projectId);
        final TestStatus status = testService.start(user, project, config);

        LOGGER.traceExit("Config with id " + configId + " deleted.");
        return Response.ok(status).build();
    }
}
