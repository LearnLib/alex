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
import de.learnlib.alex.common.utils.IdsList;
import de.learnlib.alex.data.dao.ProjectDAO;
import de.learnlib.alex.data.dao.SymbolDAO;
import de.learnlib.alex.data.entities.Symbol;
import de.learnlib.alex.data.entities.SymbolVisibilityLevel;
import de.learnlib.alex.data.events.SymbolEvent;
import de.learnlib.alex.webhooks.services.WebhookService;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import javax.annotation.security.RolesAllowed;
import javax.inject.Inject;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
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
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Objects;
import java.util.Set;

/**
 * REST API to manage the symbols.
 */
@Path("/projects/{project_id}/symbols")
@RolesAllowed({"REGISTERED"})
public class SymbolResource {

    private static final Logger LOGGER = LogManager.getLogger();

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

    /** The {@link WebhookService} to use. */
    @Inject
    private WebhookService webhookService;

    /**
     * Create a new Symbol.
     *
     * @param projectId
     *         The ID of the project the symbol should belong to.
     * @param symbol
     *         The symbol to add.
     * @return On success the added symbol (enhanced with information from the DB); An error message on failure.
     * @throws NotFoundException
     *         If the related Project or Group could not be found.
     */
    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response createSymbol(@PathParam("project_id") Long projectId, Symbol symbol) throws NotFoundException {
        User user = ((UserPrincipal) securityContext.getUserPrincipal()).getUser();
        LOGGER.traceEntry("createSymbol({}, {}) for user {}.", projectId, symbol, user);

        final Symbol createdSymbol = symbolDAO.create(user, projectId, symbol);
        LOGGER.traceExit(createdSymbol);
        webhookService.fireEvent(user, new SymbolEvent.Created(createdSymbol));
        return Response.status(Status.CREATED).entity(createdSymbol).build();
    }

    /**
     * Create a bunch of new Symbols.
     *
     * @param projectId
     *         The ID of the project the symbol should belong to.
     * @param symbols
     *         The symbols to add.
     * @return On success the added symbols (enhanced with information from the DB); An error message on failure.
     * @throws NotFoundException
     *         If the related Projects or Groups could not be found.
     */
    @POST
    @Path("/batch")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response createSymbols(@PathParam("project_id") Long projectId, List<Symbol> symbols)
            throws NotFoundException {
        User user = ((UserPrincipal) securityContext.getUserPrincipal()).getUser();
        LOGGER.traceEntry("createSymbols({}, {}) for user {}.", projectId, symbols, user);

        final List<Symbol> createdSymbols = symbolDAO.create(user, projectId, symbols);
        LOGGER.traceExit(createdSymbols);
        webhookService.fireEvent(user, new SymbolEvent.CreatedMany(createdSymbols));
        return Response.status(Status.CREATED).entity(createdSymbols).build();
    }

    /**
     * Get all the Symbols of a specific Project.
     *
     * @param projectId
     *         The ID of the project.
     * @param visibilityLevel
     *         Specify the visibility level of the symbols you want to get. Valid values are: 'all'/ 'unknown',
     *         'visible', 'hidden'. Optional.
     * @return A list of all Symbols belonging to the project. This list can be empty.
     * @throws NotFoundException
     *         If the project could not be found.
     */
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAll(@PathParam("project_id") Long projectId,
                           @QueryParam("visibility") @DefaultValue("VISIBLE") SymbolVisibilityLevel visibilityLevel)
            throws NotFoundException {
        User user = ((UserPrincipal) securityContext.getUserPrincipal()).getUser();
        LOGGER.traceEntry("getAll({}, {}) for user {}.", projectId, visibilityLevel, user);

        final List<Symbol> symbols = symbolDAO.getAll(user, projectId, visibilityLevel);

        LOGGER.traceExit(symbols);
        return Response.ok(symbols).build();
    }

    /**
     * Get Symbols by a list of ids.
     *
     * @param projectId
     *         The ID of the project
     * @param ids
     *         The non empty list of ids.
     * @return A list of the symbols whose ids were given
     * @throws NotFoundException
     *         If the requested Symbols or the related Projects or Groups could not be found.
     */
    @GET
    @Path("/batch/{ids}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getByIds(@PathParam("project_id") Long projectId, @PathParam("ids") IdsList ids)
            throws NotFoundException {
        User user = ((UserPrincipal) securityContext.getUserPrincipal()).getUser();
        LOGGER.traceEntry("getByIds({}, {}) for user {}.", projectId, ids, user);

        final List<Symbol> symbols = symbolDAO.getByIds(user, projectId, ids);

        LOGGER.traceExit(symbols);
        return Response.ok(symbols).build();
    }

    /**
     * Get a Symbol by its ID.
     *
     * @param projectId
     *         The ID of the project.
     * @param id
     *         The ID of the symbol.
     * @return A Symbol matching the projectID & ID or a not found response.
     * @throws NotFoundException
     *         If the requested Symbol or the related Project or Group could not be found.
     */
    @GET
    @Path("/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response get(@PathParam("project_id") Long projectId, @PathParam("id") Long id) throws NotFoundException {
        User user = ((UserPrincipal) securityContext.getUserPrincipal()).getUser();
        LOGGER.traceEntry("get({}, {})  for user {}.", projectId, id, user);

        final Symbol symbol = symbolDAO.get(user, projectId, id);

        LOGGER.traceExit(symbol);
        return Response.ok(symbol).build();
    }

    /**
     * Update a Symbol.
     *
     * @param projectId
     *         The ID of the project.
     * @param id
     *         The ID of the symbol.
     * @param symbol
     *         The new symbol data.
     * @return On success the updated symbol (maybe enhanced with information from the DB); An error message on failure.
     * @throws NotFoundException
     *         If the given Symbol or the related Project or Groups could not be found.
     */
    @PUT
    @Path("/{id}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response update(@PathParam("project_id") Long projectId, @PathParam("id") Long id, Symbol symbol)
            throws NotFoundException {
        User user = ((UserPrincipal) securityContext.getUserPrincipal()).getUser();
        LOGGER.traceEntry("update({}, {}, {}) for user {}.", projectId, id, symbol, user);

        if (symbolDoesNotMatchURLParameter(symbol, projectId, id)) {
            LOGGER.traceExit();
            return Response.status(Status.BAD_REQUEST).build();
        }

        symbol.setProjectId(projectId);
        symbol.setId(id);

        final Symbol updatedSymbol = symbolDAO.update(user, projectId, symbol);

        LOGGER.traceExit(updatedSymbol);
        webhookService.fireEvent(user, new SymbolEvent.Updated(updatedSymbol));
        return Response.ok(updatedSymbol).build();
    }

    /**
     * Update a bunch of Symbols.
     *
     * @param projectId
     *         The ID of the project.
     * @param ids
     *         The IDs of the symbols.
     * @param symbols
     *         The new symbol data.
     * @return On success the updated symbol (maybe enhanced with information from the DB); An error message on failure.
     * @throws NotFoundException
     *         If the given Symbols or the related Projects or Groups could not be found.
     */
    @PUT
    @Path("/batch/{ids}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response batchUpdate(@PathParam("project_id") Long projectId,
                                @PathParam("ids") IdsList ids,
                                List<Symbol> symbols) throws NotFoundException {
        User user = ((UserPrincipal) securityContext.getUserPrincipal()).getUser();
        LOGGER.traceEntry("batchUpdate({}, {}, {}) for user {}.", projectId, ids, symbols, user);

        final Set idsSet = new HashSet<>(ids);
        for (Symbol symbol : symbols) {
            if (!idsSet.contains(symbol.getId())
                    || !Objects.equals(projectId, symbol.getProjectId())) {
                LOGGER.traceExit();
                return Response.status(Status.BAD_REQUEST).build();
            }
        }

        final List<Symbol> updatedSymbols = symbolDAO.update(user, projectId, symbols);

        LOGGER.traceExit(updatedSymbols);
        webhookService.fireEvent(user, new SymbolEvent.UpdatedMany(updatedSymbols));
        return Response.ok(updatedSymbols).build();
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
     * @throws NotFoundException
     *         If the requested Symbols or the related Project or Groups could not be found.
     */
    @PUT
    @Path("/{symbol_id}/moveTo/{group_id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response moveSymbolToAnotherGroup(@PathParam("project_id") Long projectId,
                                             @PathParam("symbol_id") Long symbolId,
                                             @PathParam("group_id") Long groupId)
            throws NotFoundException {
        User user = ((UserPrincipal) securityContext.getUserPrincipal()).getUser();
        LOGGER.traceEntry("moveSymbolToAnotherGroup({}, {}, {}) for user {}.", projectId, symbolId, groupId, user);

        final Symbol movedSymbol = symbolDAO.move(user, projectId, symbolId, groupId);

        LOGGER.traceExit(movedSymbol);
        webhookService.fireEvent(user, new SymbolEvent.Updated(movedSymbol));
        return Response.ok(movedSymbol).build();
    }

    private boolean symbolDoesNotMatchURLParameter(Symbol symbol, Long projectId, Long id) {
        if (symbol.getId() != null
                && symbol.getId() != 0
                && !Objects.equals(id, symbol.getId())) {
            return true;
        }

        if (symbol.getProjectId() != null
                && symbol.getProjectId() != 0L
                && !Objects.equals(projectId, symbol.getProjectId())) {
            return true;
        }

        return false;
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
     * @throws NotFoundException
     *         If the requested Symbols or the related Project or Groups could not be found.
     */
    @PUT
    @Path("/batch/{symbol_ids}/moveTo/{group_id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response moveSymbolToAnotherGroup(@PathParam("project_id") Long projectId,
                                             @PathParam("symbol_ids") IdsList symbolIds,
                                             @PathParam("group_id") Long groupId)
            throws NotFoundException {
        User user = ((UserPrincipal) securityContext.getUserPrincipal()).getUser();
        LOGGER.traceEntry("moveSymbolToAnotherGroup({}, {}, {}) for user {}.", projectId, symbolIds, groupId, user);

        final List<Symbol> movedSymbols = symbolDAO.move(user, projectId, symbolIds, groupId);

        LOGGER.traceExit(movedSymbols);

        webhookService.fireEvent(user, new SymbolEvent.UpdatedMany(movedSymbols));
        return Response.ok(movedSymbols).build();
    }

    /**
     * Mark one symbol as hidden.
     *
     * @param projectId
     *         The ID of the project.
     * @param id
     *         The ID of the symbol to hide.
     * @return On success no content will be returned; an error message on failure.
     * @throws NotFoundException
     *         If the requested Symbol or the related Project or Group could not be found.
     */
    @POST
    @Path("/{id}/hide")
    @Produces(MediaType.APPLICATION_JSON)
    public Response hide(@PathParam("project_id") Long projectId, @PathParam("id") Long id) throws NotFoundException {
        User user = ((UserPrincipal) securityContext.getUserPrincipal()).getUser();
        LOGGER.traceEntry("hide({}, {}) for user {}.", projectId, id, user);

        final Symbol archivedSymbol = symbolDAO.hide(user, projectId, Collections.singletonList(id)).get(0);

        LOGGER.traceExit(archivedSymbol);
        webhookService.fireEvent(user, new SymbolEvent.Updated(archivedSymbol));
        return Response.ok(archivedSymbol).build();
    }

    /**
     * Permanently delete a symbol.
     *
     * @param projectId
     *         The ID of the project.
     * @param symbolId
     *         The ID of the symbol.
     * @return 204 No content if the symbol could be deleted.
     * @throws NotFoundException
     *         If the symbol or the project could not be found.
     */
    @DELETE
    @Path("/{symbol_id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response delete(@PathParam("project_id") Long projectId, @PathParam("symbol_id") Long symbolId)
            throws NotFoundException {
        User user = ((UserPrincipal) securityContext.getUserPrincipal()).getUser();
        LOGGER.traceEntry("delete symbol ({}, {}) for user {}.", projectId, symbolId, user);

        symbolDAO.delete(user, projectId, symbolId);
        LOGGER.traceExit("deleted symbol {}", symbolId);
        return Response.noContent().build();
    }

    /**
     * Mark a bunch of symbols as hidden.
     *
     * @param projectId
     *         The ID of the project.
     * @param ids
     *         The IDs of the symbols to hide.
     * @return On success no content will be returned; an error message on failure.
     * @throws NotFoundException
     *         If the requested Symbols or the related Project or Groups could not be found.
     */
    @POST
    @Path("/batch/{ids}/hide")
    @Produces(MediaType.APPLICATION_JSON)
    public Response hide(@PathParam("project_id") long projectId, @PathParam("ids") IdsList ids)
            throws NotFoundException {
        User user = ((UserPrincipal) securityContext.getUserPrincipal()).getUser();
        LOGGER.traceEntry("hide({}, {}) for user {}.", projectId, ids, user);

        final List<Symbol> archivedSymbols = symbolDAO.hide(user, projectId, ids);

        LOGGER.traceExit(archivedSymbols);
        webhookService.fireEvent(user, new SymbolEvent.UpdatedMany(archivedSymbols));
        return Response.ok(archivedSymbols).build();
    }

    /**
     * Remove the hidden flag from a symbol.
     *
     * @param projectId
     *         The ID of the project.
     * @param id
     *         The ID of the symbol to show.
     * @return On success no content will be returned; an error message on failure.
     * @throws NotFoundException
     *         If the requested Symbol or the related Project or Group could not be found.
     */
    @POST
    @Path("/{id}/show")
    @Produces(MediaType.APPLICATION_JSON)
    public Response show(@PathParam("project_id") long projectId, @PathParam("id") Long id) throws NotFoundException {
        User user = ((UserPrincipal) securityContext.getUserPrincipal()).getUser();
        LOGGER.traceEntry("show({}, {}) for user {}.", projectId, id, user);

        symbolDAO.show(user, projectId, Collections.singletonList(id));
        Symbol symbol = symbolDAO.get(user, projectId, id);

        LOGGER.traceExit(symbol);

        webhookService.fireEvent(user, new SymbolEvent.Updated(symbol));
        return Response.ok(symbol).build();
    }

    /**
     * Remove the hidden flag from a bunch of symbols.
     *
     * @param projectId
     *         The ID of the project.
     * @param ids
     *         The IDs of the symbols to show.
     * @return On success no content will be returned; an error message on failure.
     * @throws NotFoundException
     *         If the requested Symbols or the related Project or Groups could not be found.
     */
    @POST
    @Path("/batch/{ids}/show")
    @Produces(MediaType.APPLICATION_JSON)
    public Response show(@PathParam("project_id") long projectId, @PathParam("ids") IdsList ids)
            throws NotFoundException {
        User user = ((UserPrincipal) securityContext.getUserPrincipal()).getUser();
        LOGGER.traceEntry("show({}, {}) for user {}.", projectId, ids, user);

        symbolDAO.show(user, projectId, ids);
        List<Symbol> symbols = symbolDAO.getByIds(user, projectId, SymbolVisibilityLevel.ALL, ids);

        LOGGER.traceExit(symbols);

        webhookService.fireEvent(user, new SymbolEvent.UpdatedMany(symbols));
        return Response.ok(symbols).build();
    }

}
