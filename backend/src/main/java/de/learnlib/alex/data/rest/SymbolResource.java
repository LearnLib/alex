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
import de.learnlib.alex.data.dao.SymbolDAO;
import de.learnlib.alex.data.entities.Symbol;
import de.learnlib.alex.data.entities.SymbolUsageResult;
import de.learnlib.alex.data.entities.export.ExportableEntity;
import de.learnlib.alex.data.entities.export.SymbolsExportConfig;
import de.learnlib.alex.data.events.SymbolEvent;
import de.learnlib.alex.data.services.SymbolUsageService;
import de.learnlib.alex.data.services.export.SymbolsExporter;
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
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;
import javax.ws.rs.core.SecurityContext;
import java.util.Collections;
import java.util.List;

/**
 * REST API to manage the symbols.
 */
@Path("/projects/{projectId}/symbols")
@RolesAllowed({"REGISTERED"})
public class SymbolResource {

    private static final Logger LOGGER = LogManager.getLogger();

    /** The security context containing the user of the request. */
    @Context
    private SecurityContext securityContext;

    private WebhookService webhookService;
    private SymbolDAO symbolDAO;
    private SymbolUsageService symbolUsageService;
    private SymbolsExporter symbolExporter;

    @Inject
    public SymbolResource(WebhookService webhookService,
                          SymbolDAO symbolDAO,
                          SymbolUsageService symbolUsageService,
                          SymbolsExporter symbolExporter) {
        this.webhookService = webhookService;
        this.symbolDAO = symbolDAO;
        this.symbolUsageService = symbolUsageService;
        this.symbolExporter = symbolExporter;
    }

    /**
     * Create a new Symbol.
     *
     * @param projectId
     *         The ID of the project the symbol should belong to.
     * @param symbol
     *         The symbol to add.
     * @return On success the added symbol (enhanced with information from the DB); An error message on failure.
     */
    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response createSymbol(@PathParam("projectId") Long projectId, Symbol symbol) {
        final User user = ((UserPrincipal) securityContext.getUserPrincipal()).getUser();
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
     */
    @POST
    @Path("/batch")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response createSymbols(@PathParam("projectId") Long projectId, List<Symbol> symbols) {
        final User user = ((UserPrincipal) securityContext.getUserPrincipal()).getUser();
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
     * @return A list of all Symbols belonging to the project. This list can be empty.
     */
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAll(@PathParam("projectId") Long projectId) {
        final User user = ((UserPrincipal) securityContext.getUserPrincipal()).getUser();
        LOGGER.traceEntry("getAll({}, {}) for user {}.", projectId, user);

        final List<Symbol> symbols = symbolDAO.getAll(user, projectId);

        LOGGER.traceExit(symbols);
        return Response.ok(symbols).build();
    }

    /**
     * Get Symbols by a list of ids.
     *
     * @param projectId
     *         The ID of the project
     * @param symbolIds
     *         The non empty list of symbol ids.
     * @return A list of the symbols whose ids were given
     */
    @GET
    @Path("/batch/{symbolIds}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getByIds(@PathParam("projectId") Long projectId, @PathParam("symbolIds") IdsList symbolIds) {
        final User user = ((UserPrincipal) securityContext.getUserPrincipal()).getUser();
        LOGGER.traceEntry("getByIds({}, {}) for user {}.", projectId, symbolIds, user);

        final List<Symbol> symbols = symbolDAO.getByIds(user, projectId, symbolIds);

        LOGGER.traceExit(symbols);
        return Response.ok(symbols).build();
    }

    /**
     * Get a Symbol by its ID.
     *
     * @param projectId
     *         The ID of the project.
     * @param symbolId
     *         The ID of the symbol.
     * @return A Symbol matching the projectID & ID or a not found response.
     */
    @GET
    @Path("/{symbolId}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response get(@PathParam("projectId") Long projectId, @PathParam("symbolId") Long symbolId) {
        final User user = ((UserPrincipal) securityContext.getUserPrincipal()).getUser();
        LOGGER.traceEntry("get({}, {})  for user {}.", projectId, symbolId, user);

        final Symbol symbol = symbolDAO.get(user, projectId, symbolId);

        LOGGER.traceExit(symbol);
        return Response.ok(symbol).build();
    }

    @GET
    @Path("/{symbolId}/usages")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getUsages(@PathParam("projectId") Long projectId, @PathParam("symbolId") Long symbolId) {
        final User user = ((UserPrincipal) securityContext.getUserPrincipal()).getUser();
        LOGGER.traceEntry("getUsages({}, {})  for user {}.", projectId, symbolId, user);

        final SymbolUsageResult result = symbolUsageService.findUsages(user, projectId, symbolId);

        LOGGER.traceExit();
        return Response.ok(result).build();
    }

    /**
     * Update a Symbol.
     *
     * @param projectId
     *         The ID of the project.
     * @param symbolId
     *         The ID of the symbol.
     * @param symbol
     *         The new symbol data.
     * @return On success the updated symbol (maybe enhanced with information from the DB); An error message on failure.
     */
    @PUT
    @Path("/{symbolId}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response update(@PathParam("projectId") Long projectId, @PathParam("symbolId") Long symbolId, Symbol symbol) {
        final User user = ((UserPrincipal) securityContext.getUserPrincipal()).getUser();
        LOGGER.traceEntry("update({}, {}, {}) for user {}.", projectId, symbolId, symbol, user);

        final Symbol updatedSymbol = symbolDAO.update(user, projectId, symbol);

        LOGGER.traceExit(updatedSymbol);
        webhookService.fireEvent(user, new SymbolEvent.Updated(updatedSymbol));
        return Response.ok(updatedSymbol).build();
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
    @Path("/{symbolId}/moveTo/{groupId}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response moveSymbolToGroup(@PathParam("projectId") Long projectId,
                                      @PathParam("symbolId") Long symbolId,
                                      @PathParam("groupId") Long groupId) {
        final User user = ((UserPrincipal) securityContext.getUserPrincipal()).getUser();
        LOGGER.traceEntry("moveSymbolToAnotherGroup({}, {}, {}) for user {}.", projectId, symbolId, groupId, user);

        final Symbol movedSymbol = symbolDAO.move(user, projectId, symbolId, groupId);

        LOGGER.traceExit(movedSymbol);
        webhookService.fireEvent(user, new SymbolEvent.Updated(movedSymbol));
        return Response.ok(movedSymbol).build();
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
    @Path("/batch/{symbolIds}/moveTo/{groupId}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response moveSymbolsToGroup(@PathParam("projectId") Long projectId,
                                       @PathParam("symbolIds") IdsList symbolIds,
                                       @PathParam("groupId") Long groupId) {
        final User user = ((UserPrincipal) securityContext.getUserPrincipal()).getUser();
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
     * @param symbolId
     *         The ID of the symbol to hide.
     * @return On success no content will be returned; an error message on failure.
     */
    @POST
    @Path("/{symbolId}/hide")
    @Produces(MediaType.APPLICATION_JSON)
    public Response hide(@PathParam("projectId") Long projectId, @PathParam("symbolId") Long symbolId) {
        final User user = ((UserPrincipal) securityContext.getUserPrincipal()).getUser();
        LOGGER.traceEntry("hide({}, {}) for user {}.", projectId, symbolId, user);

        final Symbol archivedSymbol = symbolDAO.hide(user, projectId, Collections.singletonList(symbolId)).get(0);

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
     */
    @DELETE
    @Path("/{symbolId}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response delete(@PathParam("projectId") Long projectId, @PathParam("symbolId") Long symbolId) {
        final User user = ((UserPrincipal) securityContext.getUserPrincipal()).getUser();
        LOGGER.traceEntry("delete symbol ({}, {}) for user {}.", projectId, symbolId, user);

        symbolDAO.delete(user, projectId, symbolId);
        LOGGER.traceExit("deleted symbol {}", symbolId);
        webhookService.fireEvent(user, new SymbolEvent.Deleted(symbolId));
        return Response.noContent().build();
    }

    /**
     * Permanently delete multiple symbols at once.
     *
     * @param projectId
     *         The ID of the project.
     * @param symbolIds
     *         The IDs of the symbols to delete.
     * @return 204 on success.
     */
    @DELETE
    @Path("/batch/{symbolIds}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response delete(@PathParam("projectId") Long projectId, @PathParam("symbolIds") IdsList symbolIds) {
        final User user = ((UserPrincipal) securityContext.getUserPrincipal()).getUser();
        LOGGER.traceEntry("delete symbols ({}, {}) for user {}.", projectId, symbolIds, user);

        symbolDAO.delete(user, projectId, symbolIds);
        LOGGER.traceExit("deleted symbols {}", symbolIds);
        webhookService.fireEvent(user, new SymbolEvent.DeletedMany(symbolIds));
        return Response.noContent().build();
    }

    /**
     * Mark a bunch of symbols as hidden.
     *
     * @param projectId
     *         The ID of the project.
     * @param ids
     *         The IDs of the symbols to hide.
     * @return On success no content will be returned; an error message on failure..
     */
    @POST
    @Path("/batch/{ids}/hide")
    @Produces(MediaType.APPLICATION_JSON)
    public Response hide(@PathParam("projectId") long projectId, @PathParam("ids") IdsList ids) {
        final User user = ((UserPrincipal) securityContext.getUserPrincipal()).getUser();
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
     * @param symbolId
     *         The ID of the symbol to show.
     * @return On success no content will be returned; an error message on failure.
     */
    @POST
    @Path("/{symbolId}/show")
    @Produces(MediaType.APPLICATION_JSON)
    public Response show(@PathParam("projectId") long projectId, @PathParam("symbolId") Long symbolId) {
        final User user = ((UserPrincipal) securityContext.getUserPrincipal()).getUser();
        LOGGER.traceEntry("show({}, {}) for user {}.", projectId, symbolId, user);

        symbolDAO.show(user, projectId, Collections.singletonList(symbolId));
        final Symbol symbol = symbolDAO.get(user, projectId, symbolId);

        LOGGER.traceExit(symbol);
        webhookService.fireEvent(user, new SymbolEvent.Updated(symbol));
        return Response.ok(symbol).build();
    }

    /**
     * Remove the hidden flag from a bunch of symbols.
     *
     * @param projectId
     *         The ID of the project.
     * @param symbolIds
     *         The IDs of the symbols to show.
     * @return On success no content will be returned; an error message on failure.
     */
    @POST
    @Path("/batch/{symbolIds}/show")
    @Produces(MediaType.APPLICATION_JSON)
    public Response show(@PathParam("projectId") long projectId, @PathParam("symbolIds") IdsList symbolIds) {
        final User user = ((UserPrincipal) securityContext.getUserPrincipal()).getUser();
        LOGGER.traceEntry("show({}, {}) for user {}.", projectId, symbolIds, user);

        symbolDAO.show(user, projectId, symbolIds);
        final List<Symbol> symbols = symbolDAO.getByIds(user, projectId, symbolIds);

        LOGGER.traceExit(symbols);
        webhookService.fireEvent(user, new SymbolEvent.UpdatedMany(symbols));
        return Response.ok(symbols).build();
    }

    /**
     * Export symbols as JSON document.
     *
     * @param projectId
     *         The ID of the project.
     * @param config
     *         The configuration for the export.
     * @return The JSON document that contains the symbols.
     * @throws Exception
     *         If something goes wrong.
     */
    @POST
    @Path("/export")
    @Produces(MediaType.APPLICATION_JSON)
    public Response export(@PathParam("projectId") long projectId, SymbolsExportConfig config) throws Exception {
        final User user = ((UserPrincipal) securityContext.getUserPrincipal()).getUser();
        final ExportableEntity symbols = symbolExporter.export(user, projectId, config);
        return Response.ok(symbols).build();
    }
}
