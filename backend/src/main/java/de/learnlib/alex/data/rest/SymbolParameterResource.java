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

import de.learnlib.alex.data.dao.SymbolParameterDAO;
import de.learnlib.alex.data.entities.SymbolParameter;
import de.learnlib.alex.security.AuthContext;
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

/**
 * The resource for symbol parameters.
 */
@RestController
@RequestMapping("/rest/projects/{projectId}/symbols/{symbolId}/parameters")
public class SymbolParameterResource {

    private final AuthContext authContext;
    private final SymbolParameterDAO symbolParameterDAO;

    @Autowired
    public SymbolParameterResource(AuthContext authContext,
                                   SymbolParameterDAO symbolParameterDAO) {
        this.authContext = authContext;
        this.symbolParameterDAO = symbolParameterDAO;
    }

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
     */
    @PostMapping(
            consumes = MediaType.APPLICATION_JSON,
            produces = MediaType.APPLICATION_JSON
    )
    public ResponseEntity<SymbolParameter> create(
            @PathVariable("projectId") Long projectId,
            @PathVariable("symbolId") Long symbolId,
            @RequestBody SymbolParameter parameter
    ) {
        final var user = authContext.getUser();
        final var createdParameter = symbolParameterDAO.create(user, projectId, symbolId, parameter);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdParameter);
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
     */
    @DeleteMapping(
            value = "/{parameterId}",
            produces = MediaType.APPLICATION_JSON
    )
    public ResponseEntity<?> delete(
            @PathVariable("projectId") Long projectId,
            @PathVariable("symbolId") Long symbolId,
            @PathVariable("parameterId") Long parameterId
    ) {
        final var user = authContext.getUser();
        symbolParameterDAO.delete(user, projectId, symbolId, parameterId);
        return ResponseEntity.noContent().build();
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
     */
    @PutMapping(
            value = "/{parameterId}",
            consumes = MediaType.APPLICATION_JSON,
            produces = MediaType.APPLICATION_JSON
    )
    public ResponseEntity<SymbolParameter> update(
            @PathVariable("projectId") Long projectId,
            @PathVariable("symbolId") Long symbolId,
            @PathVariable("parameterId") Long parameterId,
            @RequestBody SymbolParameter parameter
    ) {
        final var user = authContext.getUser();
        final var updatedParameter = symbolParameterDAO.update(user, projectId, symbolId, parameterId, parameter);
        return ResponseEntity.ok(updatedParameter);
    }
}
