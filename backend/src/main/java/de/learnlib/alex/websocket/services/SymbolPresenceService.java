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

package de.learnlib.alex.websocket.services;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import com.fasterxml.jackson.annotation.JsonTypeName;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import de.learnlib.alex.auth.dao.UserDAO;
import de.learnlib.alex.common.exceptions.NotFoundException;
import de.learnlib.alex.data.dao.ProjectDAO;
import de.learnlib.alex.data.dao.SymbolDAO;
import de.learnlib.alex.data.entities.Project;
import de.learnlib.alex.data.entities.SymbolGroup;
import de.learnlib.alex.data.repositories.ProjectRepository;
import de.learnlib.alex.data.repositories.SymbolGroupRepository;
import de.learnlib.alex.websocket.entities.WebSocketMessage;
import de.learnlib.alex.websocket.services.enums.SymbolPresenceServiceEnum;
import de.learnlib.alex.websocket.services.enums.WebSocketServiceEnum;
import io.reactivex.rxjava3.disposables.Disposable;
import org.apache.shiro.authz.UnauthorizedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.PreDestroy;
import java.io.IOException;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.concurrent.atomic.AtomicReference;
import java.util.concurrent.locks.ReentrantLock;
import java.util.stream.Collectors;

/**
 * Service class which tracks user presences in tests.
 */
@Service
@Transactional
public class SymbolPresenceService {

    /**
     * To ensure non concurrent access over multiple data structures an explicit lock is used.
     * This lock is 'fair' in a way that it respects the order of waiting threads when granting access.
     */
    private final ReentrantLock lock = new ReentrantLock(true);

    private final ObjectMapper objectMapper;

    private final WebSocketService webSocketService;

    private final SymbolDAO symbolDAO;

    private final ProjectDAO projectDAO;

    private final UserDAO userDAO;

    private final ProjectRepository projectRepository;

    private final SymbolGroupRepository symbolGroupRepository;

    /** A map which stores the SymbolLock objects with the projectId and symbolId as the keys */
    private final Map<Long, Map<Long, SymbolLock>> symbolLocks;

    /** A map which stores the SymbolGroupLock objects with the projectId and symbolGroupId as the keys */
    private final Map<Long, Map<Long, SymbolGroupLock>> symbolGroupLocks;

    /** Shortcut mapping for easier access given the corresponding sessionId.*/
    private final Map<String, SymbolLock> sessionMap;

    /** Shortcut mapping for easier access given the corresponding userId.*/
    private final Map<Long, Set<SymbolLock>> userMap;

    private final Set<Disposable> disposables;

    public SymbolPresenceService(WebSocketService webSocketService,
                                 SymbolDAO symbolDAO,
                                 ProjectDAO projectDAO,
                                 UserDAO userDAO,
                                 ProjectRepository projectRepository,
                                 SymbolGroupRepository symbolGroupRepository,
                                 ObjectMapper objectMapper) {
        this.webSocketService = webSocketService;
        this.symbolDAO = symbolDAO;
        this.projectDAO = projectDAO;
        this.userDAO = userDAO;
        this.projectRepository = projectRepository;
        this.symbolGroupRepository = symbolGroupRepository;
        this.objectMapper = objectMapper;

        this.disposables = new HashSet<>();
        this.symbolLocks = new HashMap<>();
        this.symbolGroupLocks = new HashMap<>();
        this.sessionMap = new HashMap<>();
        this.userMap = new HashMap<>();

        disposables.add(
                this.webSocketService.register(
                        message -> message.getEntity().equals(SymbolPresenceServiceEnum.SYMBOL_PRESENCE_SERVICE.name())
                                && message.getType().equals(SymbolPresenceServiceEnum.USER_ENTERED.name()))
                        .subscribe(this::userEnteredSymbol)
        );
        disposables.add(
                this.webSocketService.register(
                        message -> message.getEntity().equals(SymbolPresenceServiceEnum.SYMBOL_PRESENCE_SERVICE.name())
                                && message.getType().equals(SymbolPresenceServiceEnum.USER_LEFT.name()))
                        .subscribe(this::userLeftSymbol)
        );
        disposables.add(
                this.webSocketService.register(
                        message -> message.getEntity().equals(SymbolPresenceServiceEnum.SYMBOL_PRESENCE_SERVICE.name())
                                && message.getType().equals(SymbolPresenceServiceEnum.STATUS_REQUEST.name()))
                        .subscribe(this::statusRequest)
        );
        disposables.add(
                this.webSocketService.register(
                        message -> message.getEntity().equals(WebSocketServiceEnum.WEBSOCKET_SERVICE_INTERNAL.name())
                                && message.getType().equals(WebSocketServiceEnum.SESSION_DISCONNECT.name()))
                        .subscribe(this::sessionDisconnect)
        );
    }

    public void userEnteredSymbol(WebSocketMessage message) {
        lock.lock();

        try {
            final ObjectNode content = (ObjectNode) objectMapper.readTree(message.getContent());

            final long userId = message.getUser().getId();
            final long projectId = content.get("projectId").asLong();
            final long symbolId = content.get("symbolId").asLong();
            final String sessionId = message.getSessionId();

            /* session already acquired another symbolLock */
            Optional.ofNullable(sessionMap.get(sessionId))
                    .ifPresent(symbolLock -> {
                        if (symbolLock.getSymbolId() != symbolId)
                        releaseSymbolLock(symbolLock.getProjectId(), symbolLock.getSymbolId(), userId, sessionId);
                    });

            /* check access */
            final Project project = projectRepository.findById(projectId).orElseThrow(() -> new NotFoundException("Project with id " + projectId + " not found."));
            projectDAO.checkAccess(message.getUser(), project);

            acquireSymbolLock(projectId, symbolId, userId, sessionId);

        } catch (IOException e) {
            this.webSocketService.sendError(message.getSessionId(), buildError("Received malformed content.", message));
        } catch (UnauthorizedException | NotFoundException e) {
            this.webSocketService.sendError(message.getSessionId(), buildError(e.getMessage(), message));
        } finally {
            lock.unlock();
        }
    }

    public void userLeftSymbol(WebSocketMessage message) {
        lock.lock();

        try {
            ObjectNode content = (ObjectNode) objectMapper.readTree(message.getContent());

            final long userId = message.getUser().getId();
            final long projectId = content.get("projectId").asLong();
            final long symbolId = content.get("symbolId").asLong();
            final String sessionId = message.getSessionId();

            releaseSymbolLock(projectId, symbolId, userId, sessionId);

        } catch (IOException e) {
            this.webSocketService.sendError(message.getSessionId(), buildError("Received malformed content.", message));
        } catch (UnauthorizedException | NotFoundException e) {
            this.webSocketService.sendError(message.getSessionId(), buildError(e.getMessage(), message));
        } finally {
            lock.unlock();
        }
    }

    public void sessionDisconnect(WebSocketMessage message) {
        lock.lock();

        try {
            final long userId = message.getUser().getId();
            final String sessionId = message.getSessionId();

            Optional.ofNullable(sessionMap.get(sessionId))
                    .ifPresent(symbolLock -> {
                        releaseSymbolLock(symbolLock.getProjectId(), symbolLock.getSymbolId(), userId, sessionId);
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
            status.setEntity(SymbolPresenceServiceEnum.SYMBOL_PRESENCE_SERVICE.name());
            status.setType(SymbolPresenceServiceEnum.STATUS.name());

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

    public void checkSymbolLockStatus(long projectId, long symbolId, long userId) {
        lock.lock();

        try {
            Optional.ofNullable(symbolLocks.get(projectId))
                    .map(projectMap -> projectMap.get(symbolId))
                    .ifPresent(symbolLock -> {
                        if (symbolLock.lockOwner != userId) {
                            throw new UnauthorizedException("This symbol is currently locked.");
                        }
                    });
        } finally {
            lock.unlock();
        }
    }

    public void checkSymbolLockStatusStrict(long projectId, long symbolId, long userId) {
        lock.lock();

        try {
            Optional.ofNullable(symbolLocks.get(projectId))
                    .map(projectMap -> projectMap.get(symbolId))
                    .ifPresent(symbolLock -> {
                        throw new UnauthorizedException("This symbol is currently locked.");
                    });
        } finally {
            lock.unlock();
        }
    }

    public void checkGroupLockStatus(long projectId, long groupId) {
        lock.lock();

        try {
            Optional.ofNullable(symbolLocks.get(projectId))
                    .map(projectMap -> projectMap.get(groupId))
                    .ifPresent(l -> {
                        throw new UnauthorizedException("This symbolgroup is currently locked.");
                    });
        } finally {
            lock.unlock();
        }
    }

    public void releaseUserLocksFromProject(long userId, long projectId) {
        lock.lock();

        try {
            Optional.ofNullable(userMap.get(userId))
                    .map(userSymbolLocks -> userSymbolLocks.stream().filter(symbolLock -> symbolLock.getProjectId() == projectId).collect(Collectors.toSet()))
                    .ifPresent(userSymbolLocks -> {
                        userSymbolLocks.forEach(symbolLock -> {
                            final Set<String> tmp = new HashSet<>(symbolLock.lockSessions);
                            tmp.forEach(symbolLock::removeSession);
                        });
                    });
        } finally {
            lock.unlock();
        }
    }

    public void releaseSymbolLocksByUser(long userId) {
        lock.lock();

        try {
            Optional.ofNullable(userMap.get(userId))
                    .ifPresent(symbolLocks -> {
                        final Set<SymbolLock> tmpSymbolLocks = new HashSet<>(symbolLocks);
                        tmpSymbolLocks.forEach(symbolLock -> {
                            final Set<String> tmpSessionSet = new HashSet<>(symbolLock.lockSessions);
                            tmpSessionSet.forEach(sessionId -> {
                                releaseSymbolLock(symbolLock.getProjectId(), symbolLock.getSymbolId(), userId, sessionId);
                            });
                        });
                    });
        } finally {
            lock.unlock();
        }
    }

    public void releaseSymbolLocksByProject(long projectId) {
        lock.lock();

        try {
            final AtomicReference<Iterator> it = new AtomicReference<>(sessionMap.entrySet().iterator());
            while (it.get().hasNext()) {
                final Map.Entry e = (Map.Entry) it.get().next();
                if (((SymbolLock) e.getValue()).getProjectId() == projectId) {
                    it.get().remove();
                }
            }

            userMap.forEach((userId, symbolLocks) -> {
                it.set(symbolLocks.iterator());
                while (it.get().hasNext()) {
                    SymbolLock l = (SymbolLock) it.get().next();
                    if (l.getProjectId() == projectId) {
                        it.get().remove();
                    }
                }
            });

            it.set(userMap.entrySet().iterator());
            while (it.get().hasNext()) {
                final Map.Entry e = (Map.Entry) it.get().next();
                if (((HashSet) e.getValue()).isEmpty()) {
                    it.get().remove();
                }
            }

            symbolLocks.remove(projectId);
            symbolGroupLocks.remove(projectId);

        } finally {
            lock.unlock();
        }
    }

    private void acquireSymbolLock(long projectId, long symbolId, long userId, String sessionId) {
        SymbolLock symbolLock = symbolLocks.computeIfAbsent(projectId, k -> new HashMap<>())
                .computeIfAbsent(symbolId, k -> new SymbolLock(projectId, symbolId));

        if (symbolLock.addSession(userId, sessionId)) {
            sessionMap.put(sessionId, symbolLock);
            userMap.computeIfAbsent(userId, k -> new HashSet<>())
                    .add(symbolLock);

            SymbolGroup symbolGroup = symbolDAO.get(userDAO.getById(userId), projectId, symbolId).getGroup();
            while (symbolGroup != null) {
                symbolGroupLocks.computeIfAbsent(projectId, k -> new HashMap<>())
                                .computeIfAbsent(symbolGroup.getId(), k -> new SymbolGroupLock(projectId, k))
                                .addSession(userId, sessionId);

                symbolGroup = symbolGroup.getParent();
            }
            broadcastSymbolStatus(projectId);
        }
    }

    private void releaseSymbolLock(long projectId, long symbolId, long userId, String sessionId) {
        Optional.ofNullable(symbolLocks.get(projectId))
                .map(m -> m.get(symbolId))
                .ifPresent(symbolLock -> {
                    if (symbolLock.removeSession(sessionId)) {
                        sessionMap.remove(sessionId);

                        if (!symbolLock.isLocked()) {
                            symbolLocks.get(projectId).remove(symbolId);

                            userMap.get(userId).remove(symbolLock);
                            if (userMap.get(userId).isEmpty()) {
                                userMap.remove(userId);
                            }
                        }

                        SymbolGroup symbolGroup = symbolDAO.get(userDAO.getById(userId), projectId, symbolId).getGroup();
                        while (symbolGroup != null) {

                            final SymbolGroupLock symbolGroupLock = symbolGroupLocks.get(projectId).get(symbolGroup.getId());
                            symbolGroupLock.removeSession(userId, sessionId);

                            if (!symbolGroupLock.isLocked()) {
                                symbolGroupLocks.get(projectId).remove(symbolGroupLock.getSymbolGroupId());
                            }

                            symbolGroup = symbolGroup.getParent();

                        }

                        if (symbolLocks.get(projectId).isEmpty()) {
                            symbolLocks.remove(projectId);
                        }

                        if (symbolGroupLocks.get(projectId).isEmpty()) {
                            symbolGroupLocks.remove(projectId);
                        }
                        broadcastSymbolStatus(projectId);
                    }
                });
    }

    private ObjectNode getProjectStatus(long projectId) {
        final ObjectNode status = objectMapper.createObjectNode();
        final ObjectNode symbolsNode = objectMapper.createObjectNode();
        final ObjectNode symbolGroupsNode = objectMapper.createObjectNode();

        Optional.ofNullable(symbolLocks.get(projectId))
                .ifPresent(m -> {
                    m.forEach((symbolId, symbolLock) -> {
                        symbolsNode.set(Long.toString(symbolId), objectMapper.valueToTree(symbolLock));
                    });
                });
        Optional.ofNullable(symbolGroupLocks.get(projectId))
                .ifPresent(m -> {
                    m.forEach((symbolGroupId, symbolGroupLock) -> {
                        symbolGroupsNode.set(Long.toString(symbolGroupId), objectMapper.valueToTree(symbolGroupLock));
                    });
                });
        status.set("symbols", symbolsNode);
        status.set("groups", symbolGroupsNode);

        return status;
    }

    private void broadcastSymbolStatus(long projectId) {
        final WebSocketMessage status = new WebSocketMessage();
        status.setEntity(SymbolPresenceServiceEnum.SYMBOL_PRESENCE_SERVICE.name());
        status.setType(SymbolPresenceServiceEnum.STATUS.name());

        final ObjectNode projects = objectMapper.createObjectNode();
        projects.set(Long.toString(projectId), getProjectStatus(projectId));
        status.setContent(projects.toString());

        this.webSocketService.sendToProjectMembers(projectId, status);
        this.webSocketService.sendToProjectOwners(projectId, status);
    }

    private WebSocketMessage buildError(String description, WebSocketMessage message) {
        final WebSocketMessage error = new WebSocketMessage();
        error.setType(SymbolPresenceServiceEnum.ERROR.name());
        error.setEntity(SymbolPresenceServiceEnum.SYMBOL_PRESENCE_SERVICE.name());

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

    @JsonTypeInfo(use = JsonTypeInfo.Id.NAME, property = "type")
    @JsonSubTypes({
            @JsonSubTypes.Type(name = "symbol", value = SymbolLock.class),
            @JsonSubTypes.Type(name = "group", value = SymbolGroupLock.class),
    })
    abstract class AbstractSymbolLock {

        private final long projectId;

        AbstractSymbolLock(long projectId) {
            this.projectId = projectId;
        }

        public long getProjectId() {
            return projectId;
        }
    }

    @JsonTypeName("symbol")
    class SymbolLock extends AbstractSymbolLock {

        private final long symbolId;

        @JsonIgnore
        private long lockOwner;

        @JsonIgnore
        private final Set<String> lockSessions;

        @JsonIgnore
        private final Map<String, Date> timestamps;

        SymbolLock(long projectId, long symbolId) {
            super(projectId);
            this.symbolId = symbolId;

            this.lockSessions = new HashSet<>();
            this.timestamps = new HashMap<>();
        }

        public long getLockOwner() {
            return lockOwner;
        }

        public long getSymbolId() {
            return symbolId;
        }

        public boolean addSession(long userId, String sessionId) {
            if (lockSessions.isEmpty()) {
                lockOwner = userId;
            } else if (lockOwner != userId) {
                throw new UnauthorizedException("Symbol is already locked.");
            }
            if (lockSessions.add(sessionId)) {
                timestamps.put(sessionId, new Date());
                return true;
            }
            return false;
        }

        public boolean removeSession(String sessionId) {
            if (lockSessions.remove(sessionId)) {
                timestamps.remove(sessionId);

                if (lockSessions.isEmpty()) {
                    lockOwner = -1;
                }
                return true;
            }
            return false;
        }

        @JsonIgnore
        public boolean isLocked() {
            return lockOwner != -1;
        }

        @JsonProperty("username")
        public String getUsername() {
            return userDAO.getById(lockOwner).getUsername();
        }

        @JsonProperty("timestamp")
        public long getOldestTimestampMillis() {
            return timestamps.values().stream().min(Date::compareTo).get().getTime();
        }
    }

    @JsonTypeName("group")
    class SymbolGroupLock extends AbstractSymbolLock {

        private final long symbolGroupId;

        @JsonIgnore
        private final Set<Long> lockOwners;

        @JsonIgnore
        private final Map<Long, Set<String>> lockSessions;

        SymbolGroupLock(long projectId, long symbolId) {
            super(projectId);
            this.symbolGroupId = symbolId;

            this.lockOwners = new HashSet<>();
            this.lockSessions = new HashMap<>();
        }

        public Set<Long> getLockOwners() {
            return lockOwners;
        }

        public long getSymbolGroupId() {
            return symbolGroupId;
        }

        public boolean addSession(long userId, String sessionId) {
            lockSessions.computeIfAbsent(userId, k -> {
                lockOwners.add(userId);
                return new HashSet<>();
            });

            return lockSessions.get(userId).add(sessionId);
        }

        public boolean removeSession(long userId, String sessionId) {
            AtomicBoolean result = new AtomicBoolean(false);
            Optional.ofNullable(lockSessions.get(userId))
                    .ifPresent(sessionSet -> {
                        if (sessionSet.remove(sessionId)) {
                            if (sessionSet.isEmpty()) {
                                lockOwners.remove(userId);
                                lockSessions.remove(userId);
                            }
                            result.set(true);
                        }
                    });

            return result.get();
        }

        @JsonIgnore
        public boolean isLocked() {
            return !lockOwners.isEmpty();
        }

        @JsonProperty("locks")
        public List getLockOwnersNames() {
            return lockOwners.stream().map(userId -> userDAO.getById(userId).getUsername()).collect(Collectors.toList());
        }
    }
}
