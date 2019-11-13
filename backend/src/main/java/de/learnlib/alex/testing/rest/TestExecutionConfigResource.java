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

package de.learnlib.alex.testing.rest;

import de.learnlib.alex.auth.entities.User;
import de.learnlib.alex.auth.security.UserPrincipal;
import de.learnlib.alex.testing.dao.TestExecutionConfigDAO;
import de.learnlib.alex.testing.entities.TestExecutionConfig;
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

    @Context
    private SecurityContext securityContext;

    private final TestExecutionConfigDAO testExecutionConfigDAO;

    @Inject
    public TestExecutionConfigResource(TestExecutionConfigDAO testExecutionConfigDAO) {
        this.testExecutionConfigDAO = testExecutionConfigDAO;
    }

    /**
     * Get all test configs in a project.
     *
     * @param projectId
     *         The id of the project.
     * @return 200 and the created project on success.
     */
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAll(@PathParam("projectId") Long projectId) {
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
     */
    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response create(@PathParam("projectId") Long projectId, TestExecutionConfig config) {
        final User user = ((UserPrincipal) securityContext.getUserPrincipal()).getUser();
        LOGGER.traceEntry("create({}) for user {}.", projectId, user);

        final TestExecutionConfig createdConfig = testExecutionConfigDAO.create(user, projectId, config);

        LOGGER.traceExit(createdConfig);
        return Response.status(Response.Status.CREATED).entity(createdConfig).build();
    }

    @PUT
    @Path("/{configId}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response update(@PathParam("projectId") Long projectId,
                           @PathParam("configId") Long configId,
                           TestExecutionConfig config) {
        final User user = ((UserPrincipal) securityContext.getUserPrincipal()).getUser();
        LOGGER.traceEntry("update({}) for user {}.", projectId, user);

        final TestExecutionConfig updatedConfig = testExecutionConfigDAO.update(user, projectId, configId, config);

        LOGGER.traceExit(updatedConfig);
        return Response.status(Response.Status.OK).entity(updatedConfig).build();
    }

    /**
     * Delete a test config.
     *
     * @param projectId
     *         The id of the project.
     * @param configId
     *         The id of the test config to delete.
     * @return 204 on success.
     */
    @DELETE
    @Path("/{configId}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response delete(@PathParam("projectId") Long projectId, @PathParam("configId") Long configId) {
        final User user = ((UserPrincipal) securityContext.getUserPrincipal()).getUser();
        LOGGER.traceEntry("delete({}) for user {}.", projectId, user);

        testExecutionConfigDAO.delete(user, projectId, configId);

        LOGGER.traceExit("Config with id " + configId + " deleted.");
        return Response.noContent().build();
    }
}
