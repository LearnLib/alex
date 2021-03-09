/*
 * Copyright 2015 - 2021 TU Dortmund
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
import de.learnlib.alex.modelchecking.dao.LtsFormulaDAO;
import de.learnlib.alex.modelchecking.entities.LtsFormula;
import de.learnlib.alex.modelchecking.entities.LtsFormulaSuite;
import de.learnlib.alex.modelchecking.events.ModelCheckerEvent;
import de.learnlib.alex.security.AuthContext;
import de.learnlib.alex.webhooks.services.WebhookService;
import java.util.Collections;
import java.util.List;
import javax.ws.rs.core.MediaType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/rest/projects/{projectId}/ltsFormulaSuites/{suiteId}/ltsFormulas")
public class LtsFormulaResource {

    private final AuthContext authContext;
    private final LtsFormulaDAO ltsFormulaDAO;
    private final WebhookService webhookService;

    @Autowired
    public LtsFormulaResource(AuthContext authContext,
                              LtsFormulaDAO ltsFormulaDAO,
                              WebhookService webhookService) {
        this.authContext = authContext;
        this.ltsFormulaDAO = ltsFormulaDAO;
        this.webhookService = webhookService;
    }

    @PostMapping(
            consumes = MediaType.APPLICATION_JSON,
            produces = MediaType.APPLICATION_JSON
    )
    public ResponseEntity<LtsFormula> create(@PathVariable("projectId") Long projectId,
                                             @PathVariable("suiteId") Long suiteId,
                                             @RequestBody LtsFormula formula) {
        final User user = authContext.getUser();
        final LtsFormula createdFormula = ltsFormulaDAO.create(user, projectId, suiteId, formula);
        webhookService.fireEvent(user, new ModelCheckerEvent.Created(createdFormula));
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
    public ResponseEntity<LtsFormula> update(@PathVariable("projectId") Long projectId,
                                             @PathVariable("suiteId") Long suiteId,
                                             @PathVariable("formulaId") Long formulaId,
                                             @RequestBody LtsFormula formula) {
        final User user = authContext.getUser();
        final LtsFormula updatedFormula = ltsFormulaDAO.update(user, projectId, suiteId, formula);
        webhookService.fireEvent(user, new ModelCheckerEvent.Updated(updatedFormula));
        return ResponseEntity.ok(updatedFormula);
    }

    @PutMapping(
            value = "/batch/{formulaIds}/suite",
            consumes = MediaType.APPLICATION_JSON,
            produces = MediaType.APPLICATION_JSON
    )
    public ResponseEntity<List<LtsFormula>> updateSuite(@PathVariable("projectId") Long projectId,
                                                        @PathVariable("suiteId") Long suiteId,
                                                        @PathVariable("formulaIds") List<Long> formulaIds,
                                                        @RequestBody LtsFormulaSuite suite) {
        final User user = authContext.getUser();
        final List<LtsFormula> updatedFormulas = ltsFormulaDAO.updateParent(user, projectId, suiteId, formulaIds, suite);
        return ResponseEntity.ok(updatedFormulas);
    }

    @PutMapping(
            value = "/{formulaId}/suite",
            consumes = MediaType.APPLICATION_JSON,
            produces = MediaType.APPLICATION_JSON
    )
    public ResponseEntity<LtsFormula> updateSuite(@PathVariable("projectId") Long projectId,
                                                  @PathVariable("suiteId") Long suiteId,
                                                  @PathVariable("formulaId") Long formulaId,
                                                  @RequestBody LtsFormulaSuite suite) {
        final User user = authContext.getUser();
        final List<LtsFormula> updatedFormulas = ltsFormulaDAO.updateParent(user, projectId, suiteId, Collections.singletonList(formulaId), suite);
        return ResponseEntity.ok(updatedFormulas.get(0));
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
    public ResponseEntity<String> delete(@PathVariable("projectId") Long projectId,
                                         @PathVariable("suiteId") Long suiteId,
                                         @PathVariable("formulaId") Long formulaId) {
        final User user = authContext.getUser();
        ltsFormulaDAO.delete(user, projectId, suiteId, formulaId);
        webhookService.fireEvent(user, new ModelCheckerEvent.Deleted(formulaId));
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
    public ResponseEntity<String> delete(@PathVariable("projectId") Long projectId,
                                         @PathVariable("suiteId") Long suiteId,
                                         @PathVariable("formulaIds") List<Long> formulaIds) {
        final User user = authContext.getUser();
        ltsFormulaDAO.delete(user, projectId, suiteId, formulaIds);
        webhookService.fireEvent(user, new ModelCheckerEvent.DeletedMany(formulaIds));
        return ResponseEntity.noContent().build();
    }
}
