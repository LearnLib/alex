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
import de.learnlib.alex.common.exceptions.NotFoundException;
import de.learnlib.alex.common.exceptions.RestException;
import de.learnlib.alex.data.dao.ProjectDAO;
import de.learnlib.alex.data.dao.ProjectEnvironmentDAO;
import de.learnlib.alex.data.dao.SymbolDAO;
import de.learnlib.alex.data.entities.ExecuteResult;
import de.learnlib.alex.data.entities.OutputsJob;
import de.learnlib.alex.data.entities.ProjectEnvironment;
import de.learnlib.alex.data.entities.ProjectEnvironmentVariable;
import de.learnlib.alex.data.entities.ProjectUrl;
import de.learnlib.alex.data.entities.Symbol;
import de.learnlib.alex.learning.entities.ReadOutputConfig;
import de.learnlib.alex.learning.services.SULUtilsService;
import de.learnlib.alex.learning.services.LearnerService;
import de.learnlib.alex.security.AuthContext;
import java.time.Duration;
import java.time.Instant;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;
import javax.validation.ValidationException;
import javax.ws.rs.core.MediaType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/rest/projects/{projectId}/environments")
public class ProjectEnvironmentResource {

    private final AuthContext authContext;
    private final ProjectEnvironmentDAO environmentDAO;
    private final ProjectDAO projectDAO;
    private final SymbolDAO symbolDAO;
    private final SULUtilsService sulUtils;
    private final Map<String, OutputsJob> outputsJobMap = new ConcurrentHashMap<>();

    @Autowired
    public ProjectEnvironmentResource(
            AuthContext authContext,
            ProjectEnvironmentDAO environmentDAO,
            @Lazy ProjectDAO projectDAO,
            SymbolDAO symbolDAO,
            SULUtilsService sulUtils
    ) {
        this.authContext = authContext;
        this.environmentDAO = environmentDAO;
        this.projectDAO = projectDAO;
        this.symbolDAO = symbolDAO;
        this.sulUtils = sulUtils;
    }

    @PostMapping(
            value = "/{environmentId}/outputs/jobs",
            produces = MediaType.APPLICATION_JSON,
            consumes = MediaType.APPLICATION_JSON
    )
    public ResponseEntity<OutputsJob> getOutputs(
            @PathVariable("projectId") Long projectId,
            @PathVariable("environmentId") Long environmentId,
            @RequestBody ReadOutputConfig config
    ) {
        final var user = authContext.getUser();
        final var env = environmentDAO.getByID(user, environmentId);

        if (config.getSymbols().isEmpty()) {
            throw new ValidationException("You have to specify at least one symbol.");
        }

        final var project = projectDAO.getByID(user, projectId);

        final var pResetSymbol = config.getPreSymbol();
        if (pResetSymbol == null) {
            throw new NotFoundException("No reset symbol specified!");
        }

        final var resetSymbol = symbolDAO.get(user, projectId, pResetSymbol.getSymbol().getId());
        config.getPreSymbol().setSymbol(resetSymbol);

        final var symbolIds = config.getSymbols().stream()
                .map(ps -> ps.getSymbol().getId())
                .collect(Collectors.toList());
        final var symbols = symbolDAO.getByIds(user, projectId, symbolIds);
        final var symbolMap = new HashMap<Long, Symbol>();
        symbols.forEach(s -> symbolMap.put(s.getId(), s));
        config.getSymbols().forEach(ps -> ps.setSymbol(symbolMap.get(ps.getSymbol().getId())));

        final var job = new OutputsJob();
        job.id = UUID.randomUUID().toString();
        job.statedAt = Instant.now();
        job.projectId = projectId;
        job.environmentId = environmentId;

        outputsJobMap.put(job.id, job);
        new Thread(() -> {
            try {
                final var outputs = sulUtils.getSystemOutputs(user, project, env, config).stream()
                    .map(ExecuteResult::getOutput)
                    .toList();
                job.finishedAt = Instant.now();
                job.success = true;
                job.outputs = outputs;
            } catch (Exception e) {
                job.finishedAt = Instant.now();
                job.message = e.getMessage();
                job.success = false;
            }
        }).start();

        return ResponseEntity.ok(job);
    }

    @GetMapping(
        value = "/{environmentId}/outputs/jobs/{jobId}",
        produces = MediaType.APPLICATION_JSON
    )
    public ResponseEntity<OutputsJob> getOutputs(
        @PathVariable("projectId") Long projectId,
        @PathVariable("environmentId") Long environmentId,
        @PathVariable("jobId") String jobId
    ) {
        final var user = authContext.getUser();
        final var env = environmentDAO.getByID(user, environmentId);
        final var project = projectDAO.getByID(user, projectId);

        if (!outputsJobMap.containsKey(jobId)) {
            throw new RestException(HttpStatus.NOT_FOUND, "The job does not exist (anymore).");
        }

        final var job = outputsJobMap.get(jobId);
        if (!job.projectId.equals(project.getId())) {
            throw new RestException(HttpStatus.FORBIDDEN, "You are not allowed to access the job.");
        }

        return ResponseEntity.ok(job);
    }

    @GetMapping(
            produces = MediaType.APPLICATION_JSON
    )
    public ResponseEntity<List<ProjectEnvironment>> getAll(@PathVariable("projectId") Long projectId) {
        final User user = authContext.getUser();
        final List<ProjectEnvironment> envs = environmentDAO.getAll(user, projectId);
        return ResponseEntity.ok(envs);
    }

    @PostMapping(
            produces = MediaType.APPLICATION_JSON,
            consumes = MediaType.APPLICATION_JSON
    )
    public ResponseEntity<ProjectEnvironment> create(
            @PathVariable("projectId") Long projectId,
            @RequestBody ProjectEnvironment env
    ) {
        final User user = authContext.getUser();
        final ProjectEnvironment createdEnv = environmentDAO.create(user, projectId, env);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdEnv);
    }

    @DeleteMapping(
            value = "/{environmentId}"
    )
    public ResponseEntity<?> delete(
            @PathVariable("projectId") Long projectId,
            @PathVariable("environmentId") Long environmentId
    ) {
        final User user = authContext.getUser();
        environmentDAO.delete(user, projectId, environmentId);
        return ResponseEntity.noContent().build();
    }

    @PutMapping(
            value = "/{environmentId}",
            produces = MediaType.APPLICATION_JSON,
            consumes = MediaType.APPLICATION_JSON
    )
    public ResponseEntity<ProjectEnvironment> update(
            @PathVariable("projectId") Long projectId,
            @PathVariable("environmentId") Long environmentId,
            @RequestBody ProjectEnvironment environment
    ) {
        final User user = authContext.getUser();
        final ProjectEnvironment updatedEnv = environmentDAO.update(user, projectId, environmentId, environment);
        return ResponseEntity.ok(updatedEnv);
    }

    @PostMapping(
            value = "/{environmentId}/urls",
            produces = MediaType.APPLICATION_JSON,
            consumes = MediaType.APPLICATION_JSON
    )
    public ResponseEntity<List<ProjectUrl>> createUrl(
            @PathVariable("projectId") Long projectId,
            @PathVariable("environmentId") Long environmentId,
            @RequestBody ProjectUrl url
    ) {
        final User user = authContext.getUser();
        final List<ProjectUrl> createdUrls = environmentDAO.createUrls(user, projectId, environmentId, url);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdUrls);
    }

    @DeleteMapping(
            value = "/{environmentId}/urls/{urlId}"
    )
    public ResponseEntity<?> deleteUrl(
            @PathVariable("projectId") Long projectId,
            @PathVariable("environmentId") Long environmentId,
            @PathVariable("urlId") Long urlId
    ) {
        final User user = authContext.getUser();
        environmentDAO.deleteUrl(user, projectId, environmentId, urlId);
        return ResponseEntity.noContent().build();
    }

    @PutMapping(
            value = "/{environmentId}/urls/{urlId}",
            produces = MediaType.APPLICATION_JSON,
            consumes = MediaType.APPLICATION_JSON
    )
    public ResponseEntity<List<ProjectUrl>> updateUrl(
            @PathVariable("projectId") Long projectId,
            @PathVariable("environmentId") Long environmentId,
            @PathVariable("urlId") Long urlId,
            @RequestBody ProjectUrl url
    ) {
        final User user = authContext.getUser();
        final List<ProjectUrl> updatedUrls = environmentDAO.updateUrls(user, projectId, environmentId, urlId, url);
        return ResponseEntity.ok(updatedUrls);
    }

    @PostMapping(
            value = "/{environmentId}/variables",
            produces = MediaType.APPLICATION_JSON,
            consumes = MediaType.APPLICATION_JSON
    )
    public ResponseEntity<ProjectEnvironmentVariable> createVariable(
            @PathVariable("projectId") Long projectId,
            @PathVariable("environmentId") Long environmentId,
            @RequestBody ProjectEnvironmentVariable variable
    ) {
        final var user = authContext.getUser();
        final var createdVariable = environmentDAO.createVariable(user, projectId, environmentId, variable);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdVariable);
    }

    @DeleteMapping(
            value = "/{environmentId}/variables/{varId}"
    )
    public ResponseEntity<?> deleteVariable(
            @PathVariable("projectId") Long projectId,
            @PathVariable("environmentId") Long environmentId,
            @PathVariable("varId") Long varId
    ) {
        final User user = authContext.getUser();
        environmentDAO.deleteVariable(user, projectId, environmentId, varId);
        return ResponseEntity.noContent().build();
    }

    @PutMapping(
            value = "/{environmentId}/variables/{varId}",
            produces = MediaType.APPLICATION_JSON,
            consumes = MediaType.APPLICATION_JSON
    )
    public ResponseEntity<ProjectEnvironmentVariable> updateVariable(
            @PathVariable("projectId") Long projectId,
            @PathVariable("environmentId") Long environmentId,
            @PathVariable("varId") Long varId,
            @RequestBody ProjectEnvironmentVariable variable
    ) {
        final var user = authContext.getUser();
        final var updatedVariable = environmentDAO.updateVariable(user, projectId, environmentId, varId, variable);
        return ResponseEntity.ok(updatedVariable);
    }

    @Scheduled(fixedDelay = 300000)
    public void removeOldOutputJobs() {
        final var now = Instant.now();
        new ArrayList<>(outputsJobMap.values()).stream()
            .filter(job -> job.finishedAt != null && now.minus(Duration.ofMinutes(5)).isAfter(job.statedAt))
            .forEach(job -> outputsJobMap.remove(job.id));
    }
}
