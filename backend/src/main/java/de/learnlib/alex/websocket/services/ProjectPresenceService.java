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

package de.learnlib.alex.websocket.services;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import de.learnlib.alex.auth.dao.UserDAO;
import de.learnlib.alex.common.exceptions.NotFoundException;
import de.learnlib.alex.data.dao.ProjectDAO;
import de.learnlib.alex.data.entities.Project;
import de.learnlib.alex.data.repositories.ProjectRepository;
import de.learnlib.alex.websocket.entities.WebSocketMessage;
import de.learnlib.alex.websocket.services.enums.ProjectPresenceServiceEnum;
import de.learnlib.alex.websocket.services.enums.WebSocketServiceEnum;
import io.reactivex.rxjava3.disposables.Disposable;
import org.apache.shiro.authz.UnauthorizedException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.PreDestroy;
import java.awt.*;
import java.io.IOException;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.concurrent.atomic.AtomicReference;
import java.util.concurrent.locks.ReentrantLock;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

/**
 * Service class which tracks user presences in projects.
 */
@Service
@Transactional(rollbackFor = Exception.class)
public class ProjectPresenceService {

    /**
     * To ensure non concurrent access over multiple data structures an explicit lock is used.
     * This lock is 'fair' in a way that it respects the order of waiting threads when granting access.
     */
    private final ReentrantLock lock = new ReentrantLock(true);

    private final ObjectMapper objectMapper;

    private final WebSocketService webSocketService;

    private final ProjectDAO projectDAO;

    private final ProjectRepository projectRepository;

    private final UserDAO userDAO;

    /** A map which stores the ProjectPresenceStatus objects with the projectId as the key */
    private final Map<Long, ProjectPresenceStatus> projectPresences;

    /** Shortcut mapping for easier access given the corresponding sessionId.*/
    private final Map<String, ProjectPresenceStatus> sessionMap;

    /** Shortcut mapping for easier access given the corresponding userId.*/
    private final Map<Long, Set<ProjectPresenceStatus>> userMap;

    private final Set<Disposable> disposables;

    @Autowired
    public ProjectPresenceService(WebSocketService webSocketService,
                                  ProjectDAO projectDAO,
                                  ProjectRepository projectRepository,
                                  UserDAO userDAO,
                                  ObjectMapper objectMapper) {
        this.webSocketService = webSocketService;
        this.projectDAO = projectDAO;
        this.projectRepository = projectRepository;
        this.userDAO = userDAO;
        this.objectMapper = objectMapper;

        this.disposables = new HashSet<>();
        this.projectPresences = new HashMap<>();
        this.sessionMap = new HashMap<>();
        this.userMap = new HashMap<>();

        disposables.add(
                this.webSocketService.register(
                        message -> message.getEntity().equals(ProjectPresenceServiceEnum.PROJECT_PRESENCE_SERVICE.name())
                                && message.getType().equals(ProjectPresenceServiceEnum.USER_ENTERED.name()))
                        .subscribe(this::userEnteredProject)
        );
        disposables.add(
                this.webSocketService.register(
                        message -> message.getEntity().equals(ProjectPresenceServiceEnum.PROJECT_PRESENCE_SERVICE.name())
                                && message.getType().equals(ProjectPresenceServiceEnum.USER_LEFT.name()))
                        .subscribe(this::userLeftProject)
        );
        disposables.add(
                this.webSocketService.register(
                        message -> message.getEntity().equals(WebSocketServiceEnum.WEBSOCKET_SERVICE_INTERNAL.name())
                                && message.getType().equals(WebSocketServiceEnum.SESSION_DISCONNECT.name()))
                        .subscribe(this::sessionDisconnect)
        );
        disposables.add(
                this.webSocketService.register(
                        message -> message.getEntity().equals(ProjectPresenceServiceEnum.PROJECT_PRESENCE_SERVICE.name())
                                && message.getType().equals(ProjectPresenceServiceEnum.STATUS_REQUEST.name()))
                        .subscribe(this::statusRequest)
        );
    }

    public void userEnteredProject(WebSocketMessage message) {
        lock.lock();

        try {
            final ObjectNode content = (ObjectNode) objectMapper.readTree(message.getContent());

            final long userId = message.getUser().getId();
            final long projectId = content.get("projectId").asLong();
            final String sessionId = message.getSessionId();

            /* session already was used in another project */
            Optional.ofNullable(sessionMap.get(sessionId))
                    .ifPresent(projectPresenceStatus -> {
                        if (projectPresenceStatus.getProjectId() != projectId) {
                            removeSessionFromProject(projectPresenceStatus.getProjectId(), userId, sessionId);
                        }
                    });

            /* check access */
            final Project project = projectRepository.findById(projectId).orElseThrow(() -> new NotFoundException("Project not found."));
            projectDAO.checkAccess(message.getUser(), project);

            addSessionToProject(projectId, userId, sessionId);
        } catch (IOException e) {
            this.webSocketService.sendError(message.getSessionId(), buildError("Received malformed content.", message));
        } catch (UnauthorizedException | NotFoundException e) {
            this.webSocketService.sendError(message.getSessionId(), buildError(e.getMessage(), message));
        } finally {
            lock.unlock();
        }
    }

    public void userLeftProject(WebSocketMessage message) {
        lock.lock();

        try {
            final ObjectNode content = (ObjectNode) objectMapper.readTree(message.getContent());

            final long userId = message.getUser().getId();
            final long projectId = content.get("projectId").asLong();
            final String sessionId = message.getSessionId();

            removeSessionFromProject(projectId, userId, sessionId);
        } catch (IOException e) {
            this.webSocketService.sendError(message.getSessionId(), buildError("Received malformed content.", message));
        } catch (UnauthorizedException | NotFoundException e) {
            this.webSocketService.sendError(message.getSessionId(), buildError(e.getMessage(), message));
        } finally {
            lock.unlock();
        }
    }

    private void sessionDisconnect(WebSocketMessage message) {
        lock.lock();

        try {
            final long userId = message.getUser().getId();
            final String sessionId = message.getSessionId();

            Optional.ofNullable(sessionMap.get(sessionId))
                    .ifPresent(projectPresenceStatus -> {
                        removeSessionFromProject(projectPresenceStatus.getProjectId(), userId, sessionId);
                    });
        } finally {
            lock.unlock();
        }
    }

    public void statusRequest(WebSocketMessage message) {
        lock.lock();

        try {
            final JsonNode projectIds = objectMapper.readTree(message.getContent()).get("projectIds");

            final WebSocketMessage status = new WebSocketMessage();
            status.setEntity(ProjectPresenceServiceEnum.PROJECT_PRESENCE_SERVICE.name());
            status.setType(ProjectPresenceServiceEnum.STATUS.name());

            final ObjectNode projects = objectMapper.createObjectNode();

            projectIds.forEach(projectId -> {
                final Project project = projectRepository.findById(projectId.asLong()).orElseThrow(() -> new NotFoundException("Project with id " + projectId + " not found."));
                projectDAO.checkAccess(message.getUser(), project);

                projects.set(projectId.asText(), getProjectStatus(projectId.asLong()));
            });

            status.setContent(projects.toString());
            this.webSocketService.sendToSession(message.getSessionId(), status);
        } catch (IOException e) {
            this.webSocketService.sendError(message.getSessionId(), buildError("Received malformed content.", message));
        } catch (UnauthorizedException | NotFoundException e) {
            this.webSocketService.sendError(message.getSessionId(), buildError(e.getMessage(), message));
        } finally {
            lock.unlock();
        }
    }

    private void addSessionToProject(long projectId, long userId, String sessionId) {
        final ProjectPresenceStatus projectPresenceStatus = projectPresences.computeIfAbsent(projectId, k -> new ProjectPresenceStatus(projectId));

        if (projectPresenceStatus.addSession(userId, sessionId)) {
            sessionMap.put(sessionId, projectPresenceStatus);
            userMap.computeIfAbsent(userId, k -> new HashSet<>())
                    .add(projectPresenceStatus);

            broadcastProjectStatus(projectId);
        }
    }

    private void removeSessionFromProject(long projectId, long userId, String sessionId) {
        Optional.ofNullable(projectPresences.get(projectId))
                .ifPresent(projectPresenceStatus -> {
                    if (projectPresenceStatus.removeSession(userId, sessionId)) {
                        sessionMap.remove(sessionId);

                        if (!projectPresenceStatus.isInUse()) {
                            projectPresences.remove(projectId);

                            userMap.get(userId).remove(projectPresenceStatus);
                            if (userMap.get(userId).isEmpty()) {
                                userMap.remove(userId);
                            }
                        }

                        broadcastProjectStatus(projectId);
                    }
                });
    }

    private void broadcastProjectStatus(long projectId) {
        final WebSocketMessage status = new WebSocketMessage();
        status.setEntity(ProjectPresenceServiceEnum.PROJECT_PRESENCE_SERVICE.name());
        status.setType(ProjectPresenceServiceEnum.STATUS.name());

        final ObjectNode projects = objectMapper.createObjectNode();
        projects.set(Long.toString(projectId), getProjectStatus(projectId));
        status.setContent(projects.toString());

        this.webSocketService.sendToProjectMembers(projectId, status);
        this.webSocketService.sendToProjectOwners(projectId, status);
    }

    private ObjectNode getProjectStatus(long projectId) {
        final AtomicReference<ObjectNode> status = new AtomicReference<>(objectMapper.createObjectNode());
        Optional.ofNullable(projectPresences.get(projectId))
                .ifPresent(projectPresenceStatus -> {
                    status.set(objectMapper.valueToTree(projectPresenceStatus));
                });

        return status.get();
    }

    public void removeProjectFromPresenceMap(Long projectId) {
        lock.lock();

        try {
            Optional.ofNullable(projectPresences.get(projectId))
                    .ifPresent(projectPresenceStatus -> {
                        // remove shortcuts
                        projectPresenceStatus.userSessions.forEach((userId, sessionIds) -> {
                            userMap.get(userId).remove(projectPresenceStatus);
                            if (userMap.get(userId).isEmpty()) {
                                userMap.remove(userId);
                            }
                            sessionIds.forEach(sessionMap::remove);
                        });
                        // remove projectPresenceStatus
                        projectPresences.remove(projectId);
                    });
        } finally {
            lock.unlock();
        }
    }

    public void removeUserFromProjectPresence(Long userId, Long projectId) {
        lock.lock();

        try {
            Optional.ofNullable(projectPresences.get(projectId))
                    .map(projectPresenceStatus -> projectPresenceStatus.userSessions)
                    .map(longSetMap -> longSetMap.get(userId))
                    .ifPresent(sessionIds -> {
                        final Set<String> tmp = new HashSet<>(sessionIds);
                        tmp.forEach(sessionId -> {
                            projectPresences.get(projectId).removeSession(userId, sessionId);
                        });
                    });

            broadcastProjectStatus(projectId);
        } finally {
            lock.unlock();
        }
    }

    private WebSocketMessage buildError(String description, WebSocketMessage message) {
        final WebSocketMessage error = new WebSocketMessage();
        error.setType(ProjectPresenceServiceEnum.ERROR.name());
        error.setEntity(ProjectPresenceServiceEnum.PROJECT_PRESENCE_SERVICE.name());

        final ObjectNode errorNode = objectMapper.createObjectNode();
        errorNode.put("description", description);
        errorNode.put("message", message.getContent());

        error.setContent(errorNode.toString());

        return error;
    }

    @PreDestroy
    private void cleanUp() {
        disposables.forEach(Disposable::dispose);
    }

    class ProjectPresenceStatus {

        private final long projectId;

        ProjectPresenceStatus(long projectId) {
            this.projectId = projectId;
            this.userColors = new HashMap<>();
            this.userSessions = new HashMap<>();
        }

        public long getProjectId() {
            return projectId;
        }

        @JsonIgnore
        Map<Long, Integer> userColors;

        @JsonIgnore
        Map<Long, Set<String>> userSessions;

        public boolean addSession(long userId, String sessionId) {
            userSessions.computeIfAbsent(userId, k -> {
                userColors.put(userId, nextColor());
                return new HashSet<>();
            });

            return userSessions.get(userId).add(sessionId);
        }

        public boolean removeSession(long userId, String sessionId) {
            AtomicBoolean result = new AtomicBoolean(false);
            Optional.ofNullable(userSessions.get(userId))
                    .ifPresent(sessionSet -> {
                        if (sessionSet.remove(sessionId)) {
                            if (sessionSet.isEmpty()) {
                                userColors.remove(userId);
                                userSessions.remove(userId);
                            }
                            result.set(true);
                        }
                    });
            return result.get();
        }

        @JsonIgnore
        public boolean isInUse() {
            return !userColors.isEmpty();
        }

        @JsonProperty("userColors")
        public Map<String, String> getUserColors() {
            return userColors.entrySet().stream().collect(Collectors.toMap(k -> userDAO.getByID(k.getKey()).getUsername(), v -> computeRGBColor(v.getValue())));
        }

        private int nextColor() {
            Set<Integer> colorsInUse = new HashSet<>(userColors.values());
            colorsInUse.add(0);

            Set<Integer> missingColors = IntStream.rangeClosed(Collections.min(colorsInUse), Collections.max(colorsInUse)).boxed().collect(Collectors.toSet());
            missingColors.removeAll(colorsInUse);

            return missingColors.stream()
                    .findFirst()
                    .orElse(Collections.max(colorsInUse) + 1);
        }

        private String computeRGBColor(int colorCode) {
            float h = 0.5f;
            float golden_ratio_a = 0.618033988749895f;

            for(int i = 1; i < colorCode; i++) {
                h += golden_ratio_a;
                h %= 1;
            }

            Color color = Color.getHSBColor(h, 0.5f, 0.99f);
            String rgbColor = Integer.toHexString(color.getRed()) + Integer.toHexString(color.getGreen()) + Integer.toHexString(color.getBlue());

            return rgbColor.toUpperCase();
        }
    }
}
