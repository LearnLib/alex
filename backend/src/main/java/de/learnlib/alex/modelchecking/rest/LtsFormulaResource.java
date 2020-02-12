/*
 * Copyright 2015 - 2020 TU Dortmund
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

package de.learnlib.alex.modelchecking.rest;

import de.learnlib.alex.auth.entities.User;
import de.learnlib.alex.common.utils.RESTError;
import de.learnlib.alex.modelchecking.dao.LtsFormulaDAO;
import de.learnlib.alex.modelchecking.entities.LtsCheckingConfig;
import de.learnlib.alex.modelchecking.entities.LtsCheckingResult;
import de.learnlib.alex.modelchecking.entities.LtsFormula;
import de.learnlib.alex.modelchecking.events.ModelCheckerEvent;
import de.learnlib.alex.modelchecking.services.LtsCheckingService;
import de.learnlib.alex.security.AuthContext;
import de.learnlib.alex.webhooks.services.WebhookService;
import net.automatalib.exception.ModelCheckingException;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
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
import org.springframework.web.bind.annotation.RestController;

import javax.ws.rs.core.MediaType;
import java.util.List;

/** The lts formula endpoints for the REST API. */
@RestController
@RequestMapping("/rest/projects/{projectId}/ltsFormulas")
public class LtsFormulaResource {

    private static final Logger LOGGER = LogManager.getLogger();

    /** The security context containing the user of the request. */
    private AuthContext authContext;
    private LtsFormulaDAO ltsFormulaDAO;
    private LtsCheckingService ltsCheckingService;
    private WebhookService webhookService;

    @Autowired
    public LtsFormulaResource(AuthContext authContext,
                              LtsFormulaDAO ltsFormulaDAO,
                              LtsCheckingService ltsCheckingService,
                              WebhookService webhookService) {
        this.authContext = authContext;
        this.ltsFormulaDAO = ltsFormulaDAO;
        this.ltsCheckingService = ltsCheckingService;
        this.webhookService = webhookService;
    }

    /**
     * Get all lts formulas in a project.
     *
     * @param projectId
     *         The ID of the project.
     * @return Status 200 and the list of formulas.
     */
    @GetMapping(
            produces = MediaType.APPLICATION_JSON
    )
    public ResponseEntity getAll(@PathVariable("projectId") Long projectId) {
        LOGGER.traceEntry("enter getAll(projectId: {})", projectId);
        final User user = authContext.getUser();
        final List<LtsFormula> formulas = ltsFormulaDAO.getAll(user, projectId);

        LOGGER.traceExit("leave getAll() with formulas: {}", formulas);
        return ResponseEntity.ok(formulas);
    }

    /**
     * Create a new formula.
     *
     * @param projectId
     *         The ID of the project.
     * @param formula
     *         The formula to create.
     * @return Status 201 and the created formula.
     */
    @PostMapping(
            consumes = MediaType.APPLICATION_JSON,
            produces = MediaType.APPLICATION_JSON
    )
    public ResponseEntity create(@PathVariable("projectId") Long projectId, @RequestBody LtsFormula formula) {
        LOGGER.traceEntry("enter create(projectId: {}, formula: {})", projectId, formula);
        final User user = authContext.getUser();
        final LtsFormula createdFormula = ltsFormulaDAO.create(user, projectId, formula);

        webhookService.fireEvent(user, new ModelCheckerEvent.Created(createdFormula));
        LOGGER.traceExit("create create() with formula: {}", createdFormula);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdFormula);
    }

    /**
     * Updates an existing formula.
     *
     * @param projectId
     *         The ID of the project.
     * @param formulaId
     *         The ID of the formula to update.
     * @param formula
     *         The updated formula object.
     * @return Status 200 and the updated formula.
     */
    @PutMapping(
            value = "/{formulaId}",
            consumes = MediaType.APPLICATION_JSON,
            produces = MediaType.APPLICATION_JSON
    )
    public ResponseEntity update(@PathVariable("projectId") Long projectId,
                                 @PathVariable("formulaId") Long formulaId,
                                 @RequestBody LtsFormula formula) {
        LOGGER.traceEntry("enter update(projectId: {}, formulaId: {})", projectId, formulaId);
        final User user = authContext.getUser();
        final LtsFormula updatedFormula = ltsFormulaDAO.update(user, projectId, formula);

        webhookService.fireEvent(user, new ModelCheckerEvent.Updated(updatedFormula));
        LOGGER.traceExit("leave update() with formula: {}", updatedFormula);
        return ResponseEntity.ok(updatedFormula);
    }

    /**
     * Delete a formula.
     *
     * @param projectId
     *         The ID of the project.
     * @param formulaId
     *         The ID of the formula to delete.
     * @return Status 204 on success.
     */
    @DeleteMapping(
            value = "/{formulaId}",
            produces = MediaType.APPLICATION_JSON
    )
    public ResponseEntity delete(@PathVariable("projectId") Long projectId, @PathVariable("formulaId") Long formulaId) {
        LOGGER.traceEntry("enter delete(projectId: {}, formulaId: {})", projectId, formulaId);
        final User user = authContext.getUser();
        ltsFormulaDAO.delete(user, projectId, formulaId);

        webhookService.fireEvent(user, new ModelCheckerEvent.Deleted(formulaId));
        LOGGER.traceExit("leave delete()");
        return ResponseEntity.noContent().build();
    }

    /**
     * Delete multiple formulas at once.
     *
     * @param projectId
     *         The ID of the project.
     * @param formulaIds
     *         The IDs of the formulas to delete.
     * @return Status 204 on success.
     */
    @DeleteMapping(
            value = "/batch/{formulaIds}",
            produces = MediaType.APPLICATION_JSON
    )
    public ResponseEntity delete(@PathVariable("projectId") Long projectId, @PathVariable("formulaIds") List<Long> formulaIds) {
        LOGGER.traceEntry("enter delete(projectId: {}, formulaIds: {})", projectId, formulaIds);
        final User user = authContext.getUser();
        ltsFormulaDAO.delete(user, projectId, formulaIds);

        webhookService.fireEvent(user, new ModelCheckerEvent.DeletedMany(formulaIds));
        LOGGER.traceExit("leave delete()");
        return ResponseEntity.noContent().build();
    }

    /**
     * Check formulas against a learned model.
     *
     * @param projectId
     *         The ID of the project.
     * @param config
     *         The configuration.
     * @return A map of counterexamples.
     */
    @PostMapping(
            value = "/check",
            consumes = MediaType.APPLICATION_JSON,
            produces = MediaType.APPLICATION_JSON
    )
    public ResponseEntity check(@PathVariable("projectId") Long projectId, @RequestBody LtsCheckingConfig config) {
        LOGGER.traceEntry("enter check(projectId: {})", projectId);
        final User user = authContext.getUser();

        config.validate();

        try {
            final List<LtsCheckingResult> results = ltsCheckingService.check(user, projectId, config);
            webhookService.fireEvent(user, new ModelCheckerEvent.CheckedMany(results));
            LOGGER.traceExit("leave check() with {}", results);
            return ResponseEntity.ok(results);
        } catch (ModelCheckingException e) {
            return ResponseEntity.badRequest().body(new RESTError(HttpStatus.BAD_REQUEST, e));
        }
    }

}
