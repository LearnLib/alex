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
import de.learnlib.alex.data.dao.SymbolParameterDAO;
import de.learnlib.alex.data.entities.SymbolParameter;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.apache.shiro.authz.UnauthorizedException;

import javax.annotation.security.RolesAllowed;
import javax.inject.Inject;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.SecurityContext;
import javax.xml.bind.ValidationException;

/**
 * The resource for symbol parameters.
 */
@Path("/projects/{projectId}/symbols/{symbolId}/parameters")
@RolesAllowed({"REGISTERED"})
public class SymbolParameterResource {

    private static final Logger LOGGER = LogManager.getLogger();

    /** The security context containing the user of the request. */
    @Context
    private SecurityContext securityContext;

    /** The {@link SymbolParameterDAO} to use. */
    @Inject
    private SymbolParameterDAO symbolParameterDAO;

    /**
     * Create a new parameter for a symbol.
     *
     * @param projectId
     *         The id of the project.
     * @param symbolId
     *         The id of the symbol.
     * @param parameter
     *         The parameter to create.
     * @return 201 on success.
     * @throws NotFoundException
     *         If the project or the symbol could not be found.
     */
    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response create(@PathParam("projectId") Long projectId,
                           @PathParam("symbolId") Long symbolId,
                           SymbolParameter parameter) throws NotFoundException {

        final User user = ((UserPrincipal) securityContext.getUserPrincipal()).getUser();
        LOGGER.traceEntry("create({}, {}, {}) for user {}.", projectId, symbolId, parameter, user);

        try {
            final SymbolParameter createdParameter = symbolParameterDAO.create(user, projectId, symbolId, parameter);
            LOGGER.traceExit(createdParameter);
            return Response.status(Response.Status.CREATED).entity(createdParameter).build();
        } catch (UnauthorizedException e) {
            LOGGER.traceExit(e);
            return ResourceErrorHandler.createRESTErrorMessage("SymbolParameterResource.create",
                    Response.Status.UNAUTHORIZED, e);
        } catch (ValidationException e) {
            LOGGER.traceExit(e);
            return ResourceErrorHandler.createRESTErrorMessage("SymbolParameterResource.create",
                    Response.Status.BAD_REQUEST, e);
        }
    }

    /**
     * Deletes a symbol parameter.
     *
     * @param projectId
     *         The id of the project.
     * @param symbolId
     *         The id of the symbol.
     * @param parameterId
     *         The id of the parameter to delete.
     * @return 204 on success.
     * @throws NotFoundException
     *         If the project, the symbol or the parameter could not be found.
     */
    @DELETE
    @Path("/{parameterId}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response delete(@PathParam("projectId") Long projectId,
                           @PathParam("symbolId") Long symbolId,
                           @PathParam("parameterId") Long parameterId) throws NotFoundException {

        final User user = ((UserPrincipal) securityContext.getUserPrincipal()).getUser();
        LOGGER.traceEntry("delete({}, {}, {}) for user {}.", projectId, symbolId, parameterId, user);

        try {
            symbolParameterDAO.delete(user, projectId, symbolId, parameterId);
            LOGGER.traceExit("Parameter {} deleted.", parameterId);
            return Response.noContent().build();
        } catch (UnauthorizedException e) {
            LOGGER.traceExit(e);
            return ResourceErrorHandler.createRESTErrorMessage("SymbolParameterResource.delete",
                    Response.Status.UNAUTHORIZED, e);
        }
    }

    /**
     * Updates a symbol parameter.
     *
     * @param projectId
     *         The id of the project.
     * @param symbolId
     *         The id of the symbol.
     * @param parameterId
     *         The id of the parameter to update.
     * @param parameter
     *         The parameter to update.
     * @return 200 on success.
     * @throws NotFoundException
     *         If the project, the symbol or the parameter could not be found.
     */
    @PUT
    @Path("/{parameterId}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response update(@PathParam("projectId") Long projectId,
                           @PathParam("symbolId") Long symbolId,
                           @PathParam("parameterId") Long parameterId,
                           SymbolParameter parameter) throws NotFoundException {

        final User user = ((UserPrincipal) securityContext.getUserPrincipal()).getUser();
        LOGGER.traceEntry("update({}, {}, {}, {}) for user {}.", projectId, symbolId, parameterId, parameter, user);

        try {
            if (!parameterId.equals(parameter.getId())) {
                throw new ValidationException("The id of the parameter does not match with the one in the URL.");
            }

            final SymbolParameter updatedParameter = symbolParameterDAO.update(user, projectId, symbolId, parameter);
            LOGGER.traceExit(updatedParameter);
            return Response.ok(updatedParameter).build();
        } catch (UnauthorizedException e) {
            LOGGER.traceExit(e);
            return ResourceErrorHandler.createRESTErrorMessage("SymbolParameterResource.create",
                    Response.Status.UNAUTHORIZED, e);
        } catch (ValidationException e) {
            LOGGER.traceExit(e);
            return ResourceErrorHandler.createRESTErrorMessage("SymbolParameterResource.update",
                    Response.Status.BAD_REQUEST, e);
        }
    }
}
