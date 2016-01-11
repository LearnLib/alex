/*
 * Copyright 2016 TU Dortmund
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

package de.learnlib.alex.rest;

import de.learnlib.alex.core.dao.ProjectDAO;
import de.learnlib.alex.core.dao.SymbolDAO;
import de.learnlib.alex.core.entities.Project;
import de.learnlib.alex.core.entities.Symbol;
import de.learnlib.alex.core.entities.SymbolVisibilityLevel;
import de.learnlib.alex.core.entities.User;
import de.learnlib.alex.exceptions.NotFoundException;
import de.learnlib.alex.security.UserPrincipal;
import de.learnlib.alex.utils.IdRevisionPairList;
import de.learnlib.alex.utils.IdsList;
import de.learnlib.alex.utils.ResourceErrorHandler;
import de.learnlib.alex.utils.ResponseHelper;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.apache.shiro.authz.UnauthorizedException;

import javax.annotation.security.RolesAllowed;
import javax.inject.Inject;
import javax.validation.ValidationException;
import javax.ws.rs.Consumes;
import javax.ws.rs.DefaultValue;
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
import java.util.HashSet;
import java.util.LinkedList;
import java.util.List;
import java.util.Objects;
import java.util.Set;

/**
 * REST API to manage the symbols.
 * @resourcePath symbols
 * @resourceDescription Operations about symbols
 */
@Path("/projects/{project_id}/symbols")
@RolesAllowed({"REGISTERED"})
public class SymbolResource {

    /** Use the logger for the server part. */
    private static final Logger LOGGER = LogManager.getLogger("server");

    /** Context information about the URI. */
    @Context
    private UriInfo uri;

    /** The {@link SymbolDAO} to use. */
    @Inject
    private SymbolDAO symbolDAO;

    /** The security context containing the user of the request. */
    @Context
    private SecurityContext securityContext;

    /** The {@link ProjectDAO} to use. */
    @Inject
    private ProjectDAO projectDAO;

    /**
     * Create a new Symbol.
     *
     * @param projectId
     *            The ID of the project the symbol should belong to.
     * @param symbol
     *            The symbol to add.
     * @return On success the added symbol (enhanced with information from the DB); An error message on failure.
     * @responseType de.learnlib.alex.core.entities.Symbol
     * @successResponse 201 created
     * @errorResponse   400 bad request `de.learnlib.alex.utils.ResourceErrorHandler.RESTError
     */
    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response createSymbol(@PathParam("project_id") Long projectId, Symbol symbol) {
        User user = ((UserPrincipal) securityContext.getUserPrincipal()).getUser();
        LOGGER.trace("SymbolResource.createSymbol(" + projectId + ", " + symbol + ") for user " + user + ".");

        try {
            checkSymbolBeforeCreation(projectId, symbol); // can throw an IllegalArgumentException

            Project project = projectDAO.getByID(user.getId(), projectId);
            if (project.getUser().equals(user)) {
                symbol.setUser(user);
                symbolDAO.create(symbol);

                String symbolURL = uri.getBaseUri() + "projects/" + symbol.getProjectId()
                                        + "/symbols/" + symbol.getId();
                return Response.status(Status.CREATED).header("Location", symbolURL).entity(symbol).build();
            } else {
                throw new UnauthorizedException("The user may not create a symbol in this project");
            }
        } catch (IllegalArgumentException e) {
            return ResourceErrorHandler.createRESTErrorMessage("SymbolResource.createSymbol", Status.BAD_REQUEST, e);
        } catch (ValidationException e) {
            return ResourceErrorHandler.createRESTErrorMessage("SymbolResource.createSymbol", Status.BAD_REQUEST, e);
        } catch (NotFoundException e) {
            return ResourceErrorHandler.createRESTErrorMessage("SymbolResource.createSymbol", Status.NOT_FOUND, e);
        } catch (UnauthorizedException e) {
            return ResourceErrorHandler.createRESTErrorMessage("SymbolResource.createSymbol", Status.UNAUTHORIZED, e);
        }
    }

    /**
     * Create a bunch of new Symbols.
     *
     * @param projectId
     *            The ID of the project the symbol should belong to.
     * @param symbols
     *            The symbols to add.
     * @return On success the added symbols (enhanced with information from the DB); An error message on failure.
     * @responseType java.util.List<de.learnlib.alex.core.entities.Symbol>
     * @successResponse 201 created
     * @errorResponse   400 bad request `de.learnlib.alex.utils.ResourceErrorHandler.RESTError
     */
    @POST
    @Path("/batch")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response batchCreateSymbols(@PathParam("project_id") Long projectId, List<Symbol> symbols) {
        User user = ((UserPrincipal) securityContext.getUserPrincipal()).getUser();
        LOGGER.trace("SymbolResource.batchCreateSymbols(" + projectId + ", " + symbols + ") for user " + user + ".");

        try {
            Project project = projectDAO.getByID(user.getId(), projectId);
            if (project.getUser().equals(user)) {
                for (Symbol symbol : symbols) {
                    checkSymbolBeforeCreation(projectId, symbol); // can throw an IllegalArgumentException
                    symbol.setUser(user);
                }
                symbolDAO.create(symbols);

                return ResponseHelper.renderList(symbols, Status.CREATED);
            } else {
                throw new UnauthorizedException("The user may not create the symbols in this project");
            }
        } catch (IllegalArgumentException e) {
            return ResourceErrorHandler.createRESTErrorMessage("SymbolResource.batchCreateSymbols",
                                                               Status.BAD_REQUEST, e);
        } catch (ValidationException e) {
            return ResourceErrorHandler.createRESTErrorMessage("SymbolResource.batchCreateSymbols",
                                                               Status.BAD_REQUEST, e);
        } catch (NotFoundException e) {
            return ResourceErrorHandler.createRESTErrorMessage("SymbolResource.createSymbol", Status.NOT_FOUND, e);
        } catch (UnauthorizedException e) {
            return ResourceErrorHandler.createRESTErrorMessage("SymbolResource.createSymbol", Status.UNAUTHORIZED, e);
        }
    }

    private void checkSymbolBeforeCreation(Long projectId, Symbol symbol) {
        if (symbol.getProjectId() == 0L) {
            symbol.setProjectId(projectId);
        } else if (!Objects.equals(symbol.getProjectId(), projectId)) {
            throw new IllegalArgumentException("The symbol should not have a project"
                        + " or at least the project id should be the one provided via the get parameter");
        }
    }

    /**
     * Get all the Symbols of a specific Project.
     *
     * @param projectId
     *         The ID of the project.
     * @param visibilityLevel
     *         Specify the visibility level of the symbols you want to get.
     *         Valid values are: 'all'/ 'unknown', 'visible', 'hidden'.
     *         Optional.
     * @return A list of all Symbols belonging to the project.
     * @responseType java.util.List<de.learnlib.alex.core.entities.Symbol>
     * @successResponse 200 OK
     */
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAll(@PathParam("project_id") Long projectId,
                           @QueryParam("visibility") @DefaultValue("VISIBLE") SymbolVisibilityLevel visibilityLevel) {
        User user = ((UserPrincipal) securityContext.getUserPrincipal()).getUser();
        LOGGER.trace("SymbolResource.getAll(" + projectId + ", " + visibilityLevel + ") for user " + user + ".");

        List<Symbol> symbols;
        try {
            symbols = symbolDAO.getAllWithLatestRevision(user, projectId, visibilityLevel);
        } catch (NotFoundException e) {
            symbols = new LinkedList<>();
        }

        return ResponseHelper.renderList(symbols, Status.OK);
    }

    /**
     * Get Symbols by a list of id/revision pairs.
     *
     * @param projectId
     *          The ID of the project
     * @param idRevisionPairs
     *          The non empty list of id revision pairs.
     *          Pattern: id_1:rev_1,...,id_n,rev_n
     * @return A list of the symbols whose id:revision pairs were given
     * @responseType java.util.List<de.learnlib.alex.core.entities.Symbol>
     * @successResponse 200 OK
     * @errorResponse   404 not found `de.learnlib.alex.utils.ResourceErrorHandler.RESTError
     */
    @GET
    @Path("/batch/{idRevisionPairs}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getByIdRevisionPairs(@PathParam("project_id") Long projectId,
                                         @PathParam("idRevisionPairs") IdRevisionPairList idRevisionPairs) {
        User user = ((UserPrincipal) securityContext.getUserPrincipal()).getUser();
        LOGGER.trace("SymbolResource.getByIdRevisionPairs(" + projectId + ", " + idRevisionPairs + ") "
                     + "for user " + user + ".");

        try {
            List<Symbol> symbols = symbolDAO.getAll(user, projectId, idRevisionPairs);
            return ResponseHelper.renderList(symbols, Status.OK);
        } catch (NotFoundException e) {
            return ResourceErrorHandler.createRESTErrorMessage("SymbolResource.getByIdRevisionPairs",
                    Status.NOT_FOUND,
                    null);
        }
    }


    /**
     * Get a Symbol by its ID.
     * This returns only the latest revision of the symbol.
     * 
     * @param projectId
     *            The ID of the project.
     * @param id
     *            The ID of the symbol.
     * @return A Symbol matching the projectID & ID or a not found response.
     * @responseType de.learnlib.alex.core.entities.Symbol
     * @successResponse 200 OK
     * @errorResponse   404 not found `de.learnlib.alex.utils.ResourceErrorHandler.RESTError
     */
    @GET
    @Path("/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response get(@PathParam("project_id") Long projectId, @PathParam("id") Long id) {
        User user = ((UserPrincipal) securityContext.getUserPrincipal()).getUser();
        LOGGER.trace("SymbolResource.get(" + projectId + ", " + id + ")  for user " + user + ".");

        try {
            Symbol symbol = symbolDAO.getWithLatestRevision(user, projectId, id);
            return Response.ok(symbol).build();
        } catch (NotFoundException e) {
            return ResourceErrorHandler.createRESTErrorMessage("SymbolResource.get", Status.NOT_FOUND, null);
        }
    }

    /**
     * Get a Symbol by its ID.
     * This returns all revisions of a symbol
     *
     * @param projectId
     *            The ID of the project.
     * @param id
     *            The ID of the symbol.
     * @return A Symbol matching the projectID & ID or a not found response.
     * @responseType    java.util.List<de.learnlib.alex.core.entities.Symbol>
     * @successResponse 200 OK
     * @errorResponse   404 not found `de.learnlib.alex.utils.ResourceErrorHandler.RESTError
     */
    @GET
    @Path("/{id}/complete")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getComplete(@PathParam("project_id") Long projectId, @PathParam("id") Long id) {
        User user = ((UserPrincipal) securityContext.getUserPrincipal()).getUser();
        LOGGER.trace("SymbolResource.getComplete(" + projectId + ", " + id + ")  for user " + user + ".");

        try {
            List<Symbol> symbols = symbolDAO.getWithAllRevisions(user, projectId, id);
            return ResponseHelper.renderList(symbols, Status.OK);
        } catch (NotFoundException e) {
            return ResourceErrorHandler.createRESTErrorMessage("SymbolResource.getComplete", Status.NOT_FOUND, null);
        }
    }

    /**
     * Get a Symbol by its ID & revision.
     * 
     * @param projectId
     *            The ID of the project.
     * @param id
     *            The ID of the symbol.
     * @param revision
     *            The revision of the symbol.
     * @return A Symbol matching the projectID, ID & revision or a not found response.
     * @responseType de.learnlib.alex.core.entities.Symbol
     * @successResponse 200 OK
     * @errorResponse   404 not found `de.learnlib.alex.utils.ResourceErrorHandler.RESTError
     */
    @GET
    @Path("/{id}:{revision}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getWithRevision(@PathParam("project_id") Long projectId,
                                    @PathParam("id") Long id,
                                    @PathParam("revision") long revision) {
        User user = ((UserPrincipal) securityContext.getUserPrincipal()).getUser();
        LOGGER.trace("SymbolResource.getWithRevision(" + projectId + ", " + id + ", " + revision + ") "
                     + "for user " + user + ".");

        try {
            Symbol symbol = symbolDAO.get(user, projectId, id, revision);
            return Response.ok(symbol).build();
        } catch (NotFoundException e) {
            return ResourceErrorHandler.createRESTErrorMessage("SymbolResource.getWithRevision",
                                                               Status.NOT_FOUND,
                                                               null);
        }
    }

    /**
     * Update a Symbol.
     * 
     * @param projectId
     *            The ID of the project.
     * @param id
     *            The ID of the symbol.
     * @param symbol
     *            The new symbol data.
     * @return On success the updated symbol (maybe enhanced with information from the DB); An error message on failure.
     * @responseType de.learnlib.alex.core.entities.Symbol
     * @successResponse 200 OK
     * @errorResponse   400 bad request `de.learnlib.alex.utils.ResourceErrorHandler.RESTError
     * @errorResponse   404 not found `de.learnlib.alex.utils.ResourceErrorHandler.RESTError
     */
    @PUT
    @Path("/{id}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response update(@PathParam("project_id") Long projectId, @PathParam("id") Long id, Symbol symbol) {
        User user = ((UserPrincipal) securityContext.getUserPrincipal()).getUser();
        LOGGER.trace("SymbolResource.update(" + projectId + ", " + id + ", " + symbol + ") for user " + user + ".");

        if (!Objects.equals(id, symbol.getId())
                || !Objects.equals(projectId, symbol.getProjectId())
                || !symbol.getUser().equals(user)) {
            return  Response.status(Status.BAD_REQUEST).build();
        }

        try {
            symbolDAO.update(symbol);
            return Response.ok(symbol).build();
        } catch (NotFoundException e) {
            return ResourceErrorHandler.createRESTErrorMessage("SymbolResource.update", Status.NOT_FOUND, e);
        } catch (ValidationException e) {
            return ResourceErrorHandler.createRESTErrorMessage("SymbolResource.update", Status.BAD_REQUEST, e);
        }
    }

    /**
     * Update a bunch of Symbols.
     *
     * @param projectId
     *            The ID of the project.
     * @param ids
     *            The IDs of the symbols.
     * @param symbols
     *            The new symbol data.
     * @return On success the updated symbol (maybe enhanced with information from the DB); An error message on failure.
     * @responseType de.learnlib.alex.core.entities.Symbol
     * @successResponse 200 OK
     * @errorResponse   400 bad request `de.learnlib.alex.utils.ResourceErrorHandler.RESTError
     * @errorResponse   404 not found `de.learnlib.alex.utils.ResourceErrorHandler.RESTError
     */
    @PUT
    @Path("/batch/{ids}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response batchUpdate(@PathParam("project_id") Long projectId,
                                @PathParam("ids") IdsList ids,
                                List<Symbol> symbols) {
        User user = ((UserPrincipal) securityContext.getUserPrincipal()).getUser();
        LOGGER.trace("SymbolResource.batchUpdate(" + projectId + ", " + ids + ", " + symbols + ") "
                     + "for user " + user + ".");

        Set idsSet = new HashSet<>(ids);
        for (Symbol symbol : symbols) {
            if (!idsSet.contains(symbol.getId())
                    || !Objects.equals(projectId, symbol.getProjectId())
                    || !symbol.getUserId().equals(user.getId())) {
                return Response.status(Status.BAD_REQUEST).build();
            }
        }
        try {
            symbolDAO.update(symbols);
            return ResponseHelper.renderList(symbols, Status.OK);
        } catch (NotFoundException e) {
            return ResourceErrorHandler.createRESTErrorMessage("SymbolResource.batchUpdate", Status.NOT_FOUND, e);
        } catch (ValidationException e) {
            return ResourceErrorHandler.createRESTErrorMessage("SymbolResource.batchUpdate", Status.BAD_REQUEST, e);
        }
    }

    /**
     * Move a Symbol to a new group.
     *
     * @param projectId
     *         The ID of the project.
     * @param symbolId
     *         The ID of the symbol.
     * @param groupId
     *         The ID of the new group.
     * @return On success the moved symbol (enhanced with information from the DB); An error message on failure.
     */
    @PUT
    @Path("/{symbol_id}/moveTo/{group_id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response moveSymbolToAnotherGroup(@PathParam("project_id") Long projectId,
                                             @PathParam("symbol_id") Long symbolId,
                                             @PathParam("group_id") Long groupId) {
        User user = ((UserPrincipal) securityContext.getUserPrincipal()).getUser();
        LOGGER.trace("SymbolResource.moveSymbolToAnotherGroup(" + projectId + ", " + symbolId + ", " + groupId + ") "
                     + "for user " + user + ".");

        try {
            Symbol symbol = symbolDAO.getWithLatestRevision(user, projectId, symbolId);
            symbolDAO.move(symbol, groupId);
            return Response.ok(symbol).build();
        } catch (NotFoundException e) {
            return ResourceErrorHandler.createRESTErrorMessage("SymbolResource.moveSymbolToAnotherGroup",
                                                               Status.NOT_FOUND, e);
        }
    }

    /**
     * Move a bunch of Symbols to a new group.
     *
     * @param projectId
     *         The ID of the project.
     * @param symbolIds
     *         The ID of the symbols.
     * @param groupId
     *         The ID of the new group.
     * @return On success the moved symbols (enhanced with information from the DB); An error message on failure.
     */
    @PUT
    @Path("/batch/{symbol_ids}/moveTo/{group_id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response moveSymbolToAnotherGroup(@PathParam("project_id") Long projectId,
                                             @PathParam("symbol_ids") IdsList symbolIds,
                                             @PathParam("group_id") Long groupId) {
        User user = ((UserPrincipal) securityContext.getUserPrincipal()).getUser();
        LOGGER.trace("SymbolResource.moveSymbolToAnotherGroup(" + projectId + ", " + symbolIds + ", " + groupId + ") "
                     + "for user " + user + ".");

        try {
            List<Symbol> symbols = symbolDAO.getByIdsWithLatestRevision(user, projectId,
                                                                        symbolIds.toArray(new Long[symbolIds.size()]));
            symbolDAO.move(symbols, groupId);

            return Response.ok(symbols).build();
        } catch (NotFoundException e) {
            return ResourceErrorHandler.createRESTErrorMessage("SymbolResource.moveSymbolToAnotherGroup",
                                                               Status.NOT_FOUND, e);
        }
    }

    /**
     * Mark one symbol as hidden.
     * 
     * @param projectId
     *            The ID of the project.
     * @param id
     *            The ID of the symbol to hide.
     * @return On success no content will be returned; an error message on failure.
     * @successResponse 204 OK & no content
     * @errorResponse   404 not found `de.learnlib.alex.utils.ResourceErrorHandler.RESTError
     */
    @POST
    @Path("/{id}/hide")
    @Produces(MediaType.APPLICATION_JSON)
    public Response hide(@PathParam("project_id") Long projectId, @PathParam("id") Long id) {
        User user = ((UserPrincipal) securityContext.getUserPrincipal()).getUser();
        LOGGER.trace("SymbolResource.hide(" + projectId + ", " + id + ") for user " + user + ".");

        try {
            Symbol s = symbolDAO.getWithLatestRevision(user, projectId, id);
            if (s.getUser().equals(user)) {
                symbolDAO.hide(user.getId(), projectId, id);
                Symbol symbol = symbolDAO.getWithLatestRevision(user, projectId, id);
                return Response.ok(symbol).build();
            } else {
                throw new UnauthorizedException("The symbol does not belong to the user");
            }
        } catch (NotFoundException e) {
            return ResourceErrorHandler.createRESTErrorMessage("SymbolResource.hide", Status.NOT_FOUND, e);
        } catch (UnauthorizedException e) {
            return ResourceErrorHandler.createRESTErrorMessage("SymbolResource.hide", Status.UNAUTHORIZED, e);
        }
    }

    /**
     * Mark a bunch of symbols as hidden.
     *
     * @param projectId
     *            The ID of the project.
     * @param ids
     *            The IDs of the symbols to hide.
     * @return On success no content will be returned; an error message on failure.
     * @successResponse 204 OK & no content
     * @errorResponse   404 not found `de.learnlib.alex.utils.ResourceErrorHandler.RESTError
     */
    @POST
    @Path("/batch/{ids}/hide")
    @Produces(MediaType.APPLICATION_JSON)
    public Response hide(@PathParam("project_id") long projectId, @PathParam("ids") IdsList ids) {
        User user = ((UserPrincipal) securityContext.getUserPrincipal()).getUser();
        LOGGER.trace("SymbolResource.hide(" + projectId + ", " + ids + ") for user " + user + ".");

        try {
            Long[] idsArray = ids.toArray(new Long[ids.size()]);
            List<Symbol> symbols = symbolDAO.getByIdsWithLatestRevision(user, projectId, idsArray);
            symbolDAO.hide(user.getId(), projectId, idsArray);
            return ResponseHelper.renderList(symbols, Status.OK);
        } catch (NotFoundException e) {
            return ResourceErrorHandler.createRESTErrorMessage("SymbolResource.hide", Status.NOT_FOUND, e);
        }
    }

    /**
     * Remove the hidden flag from a symbol.
     *
     * @param projectId
     *            The ID of the project.
     * @param id
     *            The ID of the symbol to show.
     * @return On success no content will be returned; an error message on failure.
     * @successResponse 204 OK & no content
     * @errorResponse   404 not found `de.learnlib.alex.utils.ResourceErrorHandler.RESTError
     */
    @POST
    @Path("/{id}/show")
    @Produces(MediaType.APPLICATION_JSON)
    public Response show(@PathParam("project_id") long projectId, @PathParam("id") Long id) {
        User user = ((UserPrincipal) securityContext.getUserPrincipal()).getUser();
        LOGGER.trace("SymbolResource.show(" + projectId + ", " + id + ") for user " + user + ".");

        try {
            symbolDAO.show(user.getId(), projectId, id);
            Symbol symbol = symbolDAO.getWithLatestRevision(user, projectId, id);
            return Response.ok(symbol).build();
        } catch (NotFoundException e) {
            return ResourceErrorHandler.createRESTErrorMessage("SymbolResource.show", Status.NOT_FOUND, e);
        }
    }

    /**
     * Remove the hidden flag from a bunch of symbols.
     *
     * @param projectId
     *            The ID of the project.
     * @param ids
     *            The IDs of the symbols to show.
     * @return On success no content will be returned; an error message on failure.
     * @successResponse 204 OK & no content
     * @errorResponse   404 not found `de.learnlib.alex.utils.ResourceErrorHandler.RESTError
     */
    @POST
    @Path("/batch/{ids}/show")
    @Produces(MediaType.APPLICATION_JSON)
    public Response show(@PathParam("project_id") long projectId, @PathParam("ids") IdsList ids) {
        User user = ((UserPrincipal) securityContext.getUserPrincipal()).getUser();
        LOGGER.trace("SymbolResource.show(" + projectId + ", " + ids + ") for user " + user + ".");

        try {
            Long[] idsArray = ids.toArray(new Long[ids.size()]);
            symbolDAO.show(user.getId(), projectId, idsArray);
            List<Symbol> symbols = symbolDAO.getByIdsWithLatestRevision(user, projectId, idsArray);

            return ResponseHelper.renderList(symbols, Status.OK);
        } catch (NotFoundException e) {
            return ResourceErrorHandler.createRESTErrorMessage("SymbolResource.show", Status.NOT_FOUND, e);
        }
    }

}
