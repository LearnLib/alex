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

import de.learnlib.alex.modelchecking.entities.LtsCheckingConfig;
import de.learnlib.alex.modelchecking.entities.ModelCheckingResult;
import de.learnlib.alex.modelchecking.services.ModelCheckerService;
import de.learnlib.alex.security.AuthContext;
import java.util.List;
import javax.ws.rs.core.MediaType;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/rest/projects/{projectId}/modelChecker")
public class ModelCheckerResource {

    private static final Logger LOGGER = LogManager.getLogger();

    private final AuthContext authContext;
    private final ModelCheckerService modelCheckerService;

    @Autowired
    public ModelCheckerResource(AuthContext authContext,
                                ModelCheckerService modelCheckerService) {
        this.authContext = authContext;
        this.modelCheckerService = modelCheckerService;
    }

    @PostMapping(
            value = "/check",
            consumes = MediaType.APPLICATION_JSON,
            produces = MediaType.APPLICATION_JSON
    )
    public ResponseEntity<List<ModelCheckingResult>> check(@PathVariable("projectId") Long projectId,
                                                           @RequestBody LtsCheckingConfig config) {
        LOGGER.traceEntry("enter check(projectId: {})", projectId);
        final var user = authContext.getUser();
        final var results = modelCheckerService.check(user, projectId, config);

        LOGGER.traceExit("leave check()");
        return ResponseEntity.ok(results);
    }
}
