/*
 * Copyright 2015 - 2022 TU Dortmund
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
import de.learnlib.alex.data.dao.SymbolDAO;
import de.learnlib.alex.data.entities.Symbol;
import de.learnlib.alex.data.entities.SymbolUsageResult;
import de.learnlib.alex.data.entities.export.ExportableEntity;
import de.learnlib.alex.data.entities.export.SymbolsExportConfig;
import de.learnlib.alex.data.events.SymbolEvent;
import de.learnlib.alex.data.services.SymbolUsageService;
import de.learnlib.alex.data.services.export.SymbolsExporter;
import de.learnlib.alex.security.AuthContext;
import de.learnlib.alex.webhooks.services.WebhookService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.ws.rs.core.MediaType;
import java.util.Collections;
import java.util.List;

/**
 * REST API to manage the symbols.
 */
@RestController
@RequestMapping("/rest/projects/{projectId}/symbols")
public class SymbolResource {

    private final AuthContext authContext;
    private final WebhookService webhookService;
    private final SymbolDAO symbolDAO;
    private final SymbolUsageService symbolUsageService;
    private final SymbolsExporter symbolExporter;

    @Autowired
    public SymbolResource(AuthContext authContext,
                          WebhookService webhookService,
                          SymbolDAO symbolDAO,
                          SymbolUsageService symbolUsageService,
                          SymbolsExporter symbolExporter) {
        this.authContext = authContext;
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
    @PostMapping(
            consumes = MediaType.APPLICATION_JSON,
            produces = MediaType.APPLICATION_JSON
    )
    public ResponseEntity createSymbol(@PathVariable("projectId") Long projectId, @RequestBody Symbol symbol) {
        final User user = authContext.getUser();
        final Symbol createdSymbol = symbolDAO.create(user, projectId, symbol);
        webhookService.fireEvent(user, new SymbolEvent.Created(createdSymbol));
        return ResponseEntity.status(HttpStatus.CREATED).body(createdSymbol);
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
    @PostMapping(
            value = "/batch",
            consumes = MediaType.APPLICATION_JSON,
            produces = MediaType.APPLICATION_JSON
    )
    public ResponseEntity createSymbols(@PathVariable("projectId") Long projectId, @RequestBody List<Symbol> symbols) {
        final User user = authContext.getUser();
        final List<Symbol> createdSymbols = symbolDAO.create(user, projectId, symbols);
        webhookService.fireEvent(user, new SymbolEvent.CreatedMany(createdSymbols));
        return ResponseEntity.status(HttpStatus.CREATED).body(createdSymbols);
    }

    /**
     * Get all the Symbols of a specific Project.
     *
     * @param projectId
     *         The ID of the project.
     * @return A list of all Symbols belonging to the project. This list can be empty.
     */
    @GetMapping(
            produces = MediaType.APPLICATION_JSON
    )
    public ResponseEntity<List<Symbol>> getAll(
            @PathVariable("projectId") Long projectId,
            @RequestParam(value = "hidden", defaultValue = "false") Boolean hidden
    ) {
        final var user = authContext.getUser();
        final var symbols = symbolDAO.getAll(user, projectId, hidden);
        return ResponseEntity.ok(symbols);
    }

    /**
     * Get Symbols by a list of ids.
     *
     * @param projectId
     *         The ID of the project
     * @param symbolIds
     *         The non-empty list of symbol ids.
     * @return A list of the symbols whose ids were given
     */
    @GetMapping(
            value = "/batch/{symbolIds}",
            produces = MediaType.APPLICATION_JSON
    )
    public ResponseEntity getByIds(@PathVariable("projectId") Long projectId, @PathVariable("symbolIds") List<Long> symbolIds) {
        final User user = authContext.getUser();
        final List<Symbol> symbols = symbolDAO.getByIds(user, projectId, symbolIds);
        return ResponseEntity.ok(symbols);
    }

    /**
     * Get a Symbol by its ID.
     *
     * @param projectId
     *         The ID of the project.
     * @param symbolId
     *         The ID of the symbol.
     * @return A Symbol matching the projectID & ID or a not found ResponseEntity.
     */
    @GetMapping(
            value = "/{symbolId}",
            produces = MediaType.APPLICATION_JSON
    )
    public ResponseEntity get(@PathVariable("projectId") Long projectId, @PathVariable("symbolId") Long symbolId) {
        final User user = authContext.getUser();
        final Symbol symbol = symbolDAO.get(user, projectId, symbolId);
        return ResponseEntity.ok(symbol);
    }

    @GetMapping(
            value = "/{symbolId}/usages",
            produces = MediaType.APPLICATION_JSON
    )
    public ResponseEntity getUsages(@PathVariable("projectId") Long projectId, @PathVariable("symbolId") Long symbolId) {
        final User user = authContext.getUser();
        final SymbolUsageResult result = symbolUsageService.findUsages(user, projectId, symbolId);
        return ResponseEntity.ok(result);
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
    @PutMapping(
            value = "/{symbolId}",
            consumes = MediaType.APPLICATION_JSON,
            produces = MediaType.APPLICATION_JSON
    )
    public ResponseEntity update(@PathVariable("projectId") Long projectId,
                                 @PathVariable("symbolId") Long symbolId,
                                 @RequestBody Symbol symbol) {
        final User user = authContext.getUser();
        final Symbol updatedSymbol = symbolDAO.update(user, projectId, symbol);
        webhookService.fireEvent(user, new SymbolEvent.Updated(updatedSymbol));
        return ResponseEntity.ok(updatedSymbol);
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
    @PutMapping(
            value = "/{symbolId}/moveTo/{groupId}",
            produces = MediaType.APPLICATION_JSON
    )
    public ResponseEntity moveSymbolToGroup(@PathVariable("projectId") Long projectId,
                                            @PathVariable("symbolId") Long symbolId,
                                            @PathVariable("groupId") Long groupId) {
        final User user = authContext.getUser();
        final Symbol movedSymbol = symbolDAO.move(user, projectId, symbolId, groupId);
        webhookService.fireEvent(user, new SymbolEvent.Updated(movedSymbol));
        return ResponseEntity.ok(movedSymbol);
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
    @PutMapping(
            value = "/batch/{symbolIds}/moveTo/{groupId}",
            produces = MediaType.APPLICATION_JSON
    )
    public ResponseEntity moveSymbolsToGroup(@PathVariable("projectId") Long projectId,
                                             @PathVariable("symbolIds") List<Long> symbolIds,
                                             @PathVariable("groupId") Long groupId) {
        final User user = authContext.getUser();
        final List<Symbol> movedSymbols = symbolDAO.move(user, projectId, symbolIds, groupId);
        webhookService.fireEvent(user, new SymbolEvent.UpdatedMany(movedSymbols));
        return ResponseEntity.ok(movedSymbols);
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
    @PostMapping(
            value = "/{symbolId}/hide",
            produces = MediaType.APPLICATION_JSON
    )
    public ResponseEntity hide(@PathVariable("projectId") Long projectId, @PathVariable("symbolId") Long symbolId) {
        final User user = authContext.getUser();
        final Symbol archivedSymbol = symbolDAO.hide(user, projectId, Collections.singletonList(symbolId)).get(0);
        webhookService.fireEvent(user, new SymbolEvent.Updated(archivedSymbol));
        return ResponseEntity.ok(archivedSymbol);
    }

    /**
     * Mark a bunch of symbols as hidden.
     *
     * @param projectId
     *         The ID of the project.
     * @param symbolIds
     *         The IDs of the symbols to hide.
     * @return On success no content will be returned; an error message on failure..
     */
    @PostMapping(
            value = "/batch/{symbolIds}/hide",
            produces = MediaType.APPLICATION_JSON
    )
    public ResponseEntity hide(@PathVariable("projectId") Long projectId, @PathVariable("symbolIds") List<Long> symbolIds) {
        final User user = authContext.getUser();
        final List<Symbol> archivedSymbols = symbolDAO.hide(user, projectId, symbolIds);
        webhookService.fireEvent(user, new SymbolEvent.UpdatedMany(archivedSymbols));
        return ResponseEntity.ok(archivedSymbols);
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
    @DeleteMapping(
            value = "/{symbolId}",
            produces = MediaType.APPLICATION_JSON
    )
    public ResponseEntity delete(@PathVariable("projectId") Long projectId, @PathVariable("symbolId") Long symbolId) {
        final User user = authContext.getUser();
        symbolDAO.delete(user, projectId, symbolId);
        webhookService.fireEvent(user, new SymbolEvent.Deleted(symbolId));
        return ResponseEntity.noContent().build();
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
    @DeleteMapping(
            value = "/batch/{symbolIds}",
            produces = MediaType.APPLICATION_JSON
    )
    public ResponseEntity delete(@PathVariable("projectId") Long projectId, @PathVariable("symbolIds") List<Long> symbolIds) {
        final User user = authContext.getUser();
        symbolDAO.delete(user, projectId, symbolIds);
        webhookService.fireEvent(user, new SymbolEvent.DeletedMany(symbolIds));
        return ResponseEntity.noContent().build();
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
    @PostMapping(
            value = "/{symbolId}/show",
            produces = MediaType.APPLICATION_JSON
    )
    public ResponseEntity show(@PathVariable("projectId") Long projectId, @PathVariable("symbolId") Long symbolId) {
        final User user = authContext.getUser();
        symbolDAO.show(user, projectId, Collections.singletonList(symbolId));
        final Symbol symbol = symbolDAO.get(user, projectId, symbolId);
        webhookService.fireEvent(user, new SymbolEvent.Updated(symbol));
        return ResponseEntity.ok(symbol);
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
    @PostMapping(
            value = "/batch/{symbolIds}/show",
            produces = MediaType.APPLICATION_JSON
    )
    public ResponseEntity show(@PathVariable("projectId") Long projectId, @PathVariable("symbolIds") List<Long> symbolIds) {
        final User user = authContext.getUser();
        symbolDAO.show(user, projectId, symbolIds);
        final List<Symbol> symbols = symbolDAO.getByIds(user, projectId, symbolIds);
        webhookService.fireEvent(user, new SymbolEvent.UpdatedMany(symbols));
        return ResponseEntity.ok(symbols);
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
    @PostMapping(
            value = "/export",
            produces = MediaType.APPLICATION_JSON
    )
    public ResponseEntity export(@PathVariable("projectId") Long projectId,
                                 @RequestBody SymbolsExportConfig config) throws Exception {
        final User user = authContext.getUser();
        final ExportableEntity symbols = symbolExporter.export(user, projectId, config);
        return ResponseEntity.ok(symbols);
    }
}
