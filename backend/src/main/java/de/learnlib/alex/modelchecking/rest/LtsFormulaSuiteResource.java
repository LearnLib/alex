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
import de.learnlib.alex.modelchecking.dao.LtsFormulaSuiteDAO;
import de.learnlib.alex.modelchecking.entities.LtsFormulaSuite;
import de.learnlib.alex.security.AuthContext;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
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
@Transactional(rollbackFor = Exception.class)
@RequestMapping("/rest/projects/{projectId}/ltsFormulaSuites")
public class LtsFormulaSuiteResource {

    private static final Logger LOGGER = LogManager.getLogger();

    private final AuthContext authContext;
    private final LtsFormulaSuiteDAO ltsFormulaSuiteDAO;

    @Autowired
    public LtsFormulaSuiteResource(AuthContext authContext,
                                   LtsFormulaSuiteDAO ltsFormulaSuiteDAO) {
        this.authContext = authContext;
        this.ltsFormulaSuiteDAO = ltsFormulaSuiteDAO;
    }

    @GetMapping(
            produces = MediaType.APPLICATION_JSON
    )
    public ResponseEntity<List<LtsFormulaSuite>> getAll(@PathVariable("projectId") Long projectId) {
        LOGGER.traceEntry("enter getAll(projectId: {})", projectId);
        final User user = authContext.getUser();
        final List<LtsFormulaSuite> suites = ltsFormulaSuiteDAO.getAll(user, projectId);

        LOGGER.traceExit("leave getAll()");
        return ResponseEntity.ok(suites);
    }

    @GetMapping(
            value = "/{suiteId}",
            produces = MediaType.APPLICATION_JSON
    )
    public ResponseEntity<LtsFormulaSuite> get(@PathVariable("projectId") Long projectId,
                                               @PathVariable("suiteId") Long suiteId) {
        LOGGER.traceEntry("enter get(projectId: {})", projectId);
        final User user = authContext.getUser();
        final LtsFormulaSuite suite = ltsFormulaSuiteDAO.get(user, projectId, suiteId);

        LOGGER.traceExit("leave get()");
        return ResponseEntity.ok(suite);
    }

    @PostMapping(
            consumes = MediaType.APPLICATION_JSON,
            produces = MediaType.APPLICATION_JSON
    )
    public ResponseEntity<LtsFormulaSuite> create(@PathVariable("projectId") Long projectId,
                                                  @RequestBody LtsFormulaSuite suite) {
        LOGGER.traceEntry("enter create(projectId: {})", projectId);
        final User user = authContext.getUser();
        final LtsFormulaSuite createdSuite = ltsFormulaSuiteDAO.create(user, projectId, suite);

        LOGGER.traceExit("leave create()");
        return ResponseEntity.status(HttpStatus.CREATED).body(createdSuite);
    }

    @PutMapping(
            value = "/{suiteId}",
            consumes = MediaType.APPLICATION_JSON,
            produces = MediaType.APPLICATION_JSON
    )
    public ResponseEntity<LtsFormulaSuite> update(@PathVariable("projectId") Long projectId,
                                                  @PathVariable("suiteId") Long suiteId,
                                                  @RequestBody LtsFormulaSuite suite) {
        LOGGER.traceEntry("enter update(projectId: {})", projectId);
        final User user = authContext.getUser();
        final LtsFormulaSuite updatedSuite = ltsFormulaSuiteDAO.update(user, projectId, suiteId, suite);

        LOGGER.traceExit("leave update()");
        return ResponseEntity.ok(updatedSuite);
    }

    @DeleteMapping(
            value = "/{suiteId}",
            produces = MediaType.APPLICATION_JSON
    )
    public ResponseEntity<String> delete(@PathVariable("projectId") Long projectId,
                                         @PathVariable("suiteId") Long suiteId) {
        LOGGER.traceEntry("enter delete(projectId: {})", projectId);
        final User user = authContext.getUser();
        ltsFormulaSuiteDAO.delete(user, projectId, suiteId);

        LOGGER.traceExit("leave delete()");
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping(
            value = "/batch/{suiteIds}",
            produces = MediaType.APPLICATION_JSON
    )
    public ResponseEntity<String> delete(@PathVariable("projectId") Long projectId,
                                         @PathVariable("suiteIds") List<Long> suiteIds) {
        LOGGER.traceEntry("enter delete(projectId: {})", projectId);
        final User user = authContext.getUser();
        ltsFormulaSuiteDAO.delete(user, projectId, suiteIds);

        LOGGER.traceExit("leave delete()");
        return ResponseEntity.noContent().build();
    }
}
