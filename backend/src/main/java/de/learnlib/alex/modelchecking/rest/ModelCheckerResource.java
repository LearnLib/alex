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
import de.learnlib.alex.modelchecking.entities.LtsCheckingConfig;
import de.learnlib.alex.modelchecking.entities.LtsCheckingResult;
import de.learnlib.alex.modelchecking.services.ModelCheckerService;
import de.learnlib.alex.security.AuthContext;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.ws.rs.core.MediaType;
import java.util.List;

@RestController
@RequestMapping("/rest/projects/{projectId}/modelChecker")
public class ModelCheckerResource {

    private static final Logger LOGGER = LogManager.getLogger();

    private AuthContext authContext;
    private ModelCheckerService modelCheckerService;

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
    public ResponseEntity<List<LtsCheckingResult>> check(@PathVariable("projectId") Long projectId,
                                                         @RequestBody LtsCheckingConfig config) {
        LOGGER.traceEntry("enter check(projectId: {})", projectId);
        final User user = authContext.getUser();
        final List<LtsCheckingResult> results = modelCheckerService.check(user, projectId, config);

        LOGGER.traceExit("leave check()");
        return ResponseEntity.ok(results);
    }
}
