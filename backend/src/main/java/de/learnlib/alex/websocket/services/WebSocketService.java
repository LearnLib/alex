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

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import de.learnlib.alex.auth.entities.User;
import de.learnlib.alex.data.entities.Project;
import de.learnlib.alex.data.repositories.ProjectRepository;
import de.learnlib.alex.websocket.entities.WebSocketMessage;
import de.learnlib.alex.websocket.services.enums.WebSocketServiceEnum;
import io.reactivex.rxjava3.subjects.PublishSubject;
import java.io.IOException;
import java.security.Principal;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.concurrent.atomic.AtomicLong;
import java.util.concurrent.locks.ReentrantLock;
import java.util.function.Predicate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpAttributesContextHolder;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessageType;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.messaging.SessionConnectEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

@Service
@Transactional(rollbackFor = Exception.class)
public class WebSocketService {

    private final ReentrantLock lock = new ReentrantLock(true);

    private final ProjectRepository projectRepository;

    private final SimpMessagingTemplate simpMessagingTemplate;

    private final ObjectMapper objectMapper;

    private final Map<Predicate<WebSocketMessage>, PublishSubject<WebSocketMessage>> serviceSubjects;

    /* userId -> WebSocketSessions Username */
    private final Map<Long, String> activeUsers;

    /* Stores the sessionIds of active connections per user */
    private final Map<Long, Set<String>> userSessionIds;

    /* sessionId -> WebSocketSession */
    private final Map<String, WebSocketSession> webSocketSessions;

    @Autowired
    public WebSocketService(SimpMessagingTemplate simpMessagingTemplate,
                            ProjectRepository projectRepository,
                            ObjectMapper objectMapper) {
        this.simpMessagingTemplate = simpMessagingTemplate;
        this.projectRepository = projectRepository;
        this.objectMapper = objectMapper;

        this.activeUsers = new HashMap<>();
        this.userSessionIds = new HashMap<>();
        this.serviceSubjects = new HashMap<>();
        this.webSocketSessions = new HashMap<>();
    }

    public void processIncomingMessage(WebSocketMessage msg, Principal userPrincipal) {
        lock.lock();

        try {
            msg.setUser((User) ((UsernamePasswordAuthenticationToken) userPrincipal).getPrincipal());
            msg.setSessionId(SimpAttributesContextHolder.currentAttributes().getSessionId());

            if (msg.getEntity().equals(WebSocketServiceEnum.WEBSOCKET_SERVICE.name()) && msg.getType().equals(WebSocketServiceEnum.LOGOUT.name())) {
                final WebSocketMessage message = new WebSocketMessage();
                message.setEntity(WebSocketServiceEnum.WEBSOCKET_SERVICE.name());
                message.setType(WebSocketServiceEnum.LOGOUT_CHECK.name());

                this.sendToUser(msg.getUser().getId(), message);
                closeSession(msg.getSessionId());
            }

            if (msg.getEntity().equals(WebSocketServiceEnum.WEBSOCKET_SERVICE.name()) && msg.getType().equals(WebSocketServiceEnum.REQUEST_SESSION_ID.name())) {
                final WebSocketMessage message = new WebSocketMessage();
                message.setEntity(WebSocketServiceEnum.WEBSOCKET_SERVICE.name());
                message.setType(WebSocketServiceEnum.SESSION_ID.name());

                final ObjectNode content = objectMapper.createObjectNode();
                content.put("sessionId", msg.getSessionId());
                message.setContent(content.toString());

                this.sendToSession(msg.getSessionId(), message);
            }

            if (!msg.getEntity().equals(WebSocketServiceEnum.WEBSOCKET_SERVICE_INTERNAL.name())) {
                publishMessage(msg);
            } else {
                final WebSocketMessage message = new WebSocketMessage();
                message.setEntity(WebSocketServiceEnum.WEBSOCKET_SERVICE.name());
                message.setType(WebSocketServiceEnum.ERROR.name());

                final ObjectNode content = objectMapper.createObjectNode();
                content.put("description", "Received system reserved entity type.");
                content.put("message", objectMapper.writeValueAsString(msg));
                message.setContent(content.toString());

                this.sendError(msg.getSessionId(), message);
            }
        } catch (JsonProcessingException e) {
            //Ignore
        } finally {
            lock.unlock();
        }
    }

    @EventListener
    public void onSessionConnectEvent(SessionConnectEvent event) {
        lock.lock();

        try {
            UsernamePasswordAuthenticationToken authToken = (UsernamePasswordAuthenticationToken) event.getUser();
            if (((User) authToken.getPrincipal()).getId() != null) {
                long userId = ((User) authToken.getPrincipal()).getId();

                WebSocketMessage msg;

                if (userSessionIds.get(userId) == null) {
                    msg = new WebSocketMessage();
                    msg.setEntity(WebSocketServiceEnum.WEBSOCKET_SERVICE_INTERNAL.name());
                    msg.setType(WebSocketServiceEnum.USER_CONNECT.name());
                    msg.setUser((User) authToken.getPrincipal());
                    msg.setSessionId(SimpAttributesContextHolder.currentAttributes().getSessionId());
                    publishMessage(msg);
                }

                if (userSessionIds.get(userId) == null || !userSessionIds.get(userId).contains(SimpAttributesContextHolder.currentAttributes().getSessionId())) {
                    msg = new WebSocketMessage();
                    msg.setEntity(WebSocketServiceEnum.WEBSOCKET_SERVICE_INTERNAL.name());
                    msg.setType(WebSocketServiceEnum.SESSION_CONNECT.name());
                    msg.setUser((User) authToken.getPrincipal());
                    msg.setSessionId(SimpAttributesContextHolder.currentAttributes().getSessionId());
                    publishMessage(msg);
                }

                activeUsers.putIfAbsent(userId, authToken.getName());
                userSessionIds.putIfAbsent(userId, new HashSet<>());
                userSessionIds.get(userId).add(SimpAttributesContextHolder.currentAttributes().getSessionId());
            }
        } finally {
            lock.unlock();
        }
    }

    @EventListener
    public void onSessionDisconnectEvent(SessionDisconnectEvent event) {
        lock.lock();

        try {
            User user = (User) ((UsernamePasswordAuthenticationToken) event.getUser()).getPrincipal();
            if (user.getId() != null) {
                long userId = user.getId();

                WebSocketMessage msg;

                if (userSessionIds.get(userId) != null && userSessionIds.get(userId).contains(SimpAttributesContextHolder.currentAttributes().getSessionId())) {
                    msg = new WebSocketMessage();
                    msg.setEntity(WebSocketServiceEnum.WEBSOCKET_SERVICE_INTERNAL.name());
                    msg.setType(WebSocketServiceEnum.SESSION_DISCONNECT.name());
                    msg.setUser(user);
                    msg.setSessionId(SimpAttributesContextHolder.currentAttributes().getSessionId());
                    publishMessage(msg);

                    if (userSessionIds.get(userId).size() == 1) {
                        msg = new WebSocketMessage();
                        msg.setEntity(WebSocketServiceEnum.WEBSOCKET_SERVICE_INTERNAL.name());
                        msg.setType(WebSocketServiceEnum.USER_DISCONNECT.name());
                        msg.setUser(user);
                        msg.setSessionId(SimpAttributesContextHolder.currentAttributes().getSessionId());
                        publishMessage(msg);

                        activeUsers.remove(userId);
                        userSessionIds.remove(userId);
                    }

                    Optional.ofNullable(userSessionIds.get(userId))
                            .ifPresent(sessionSet -> {
                                sessionSet.remove(SimpAttributesContextHolder.currentAttributes().getSessionId());
                            });
                }
            }
        } finally {
            lock.unlock();
        }
    }

    public void sendToSession(String sessionId, WebSocketMessage message) {
        final SimpMessageHeaderAccessor headerAccessor = SimpMessageHeaderAccessor.create(SimpMessageType.MESSAGE);
        headerAccessor.setSessionId(sessionId);
        headerAccessor.setLeaveMutable(true);

        simpMessagingTemplate.convertAndSendToUser(sessionId, "/queue", message, headerAccessor.getMessageHeaders());
    }

    public void addWebSocketSession(WebSocketSession session) {
        lock.lock();

        try {
            webSocketSessions.put(session.getId(), session);
        } finally {
            lock.unlock();
        }
    }

    public void removeWebSocketSession(String sessionId) {
        lock.lock();

        try {
            webSocketSessions.remove(sessionId);
        } finally {
            lock.unlock();
        }
    }

    public void sendToUser(Long userId, WebSocketMessage message) {
        Optional.ofNullable(activeUsers.get(userId))
                .ifPresent(userString -> {
                    this.userSessionIds.get(userId).forEach(sessionId -> this.sendToSession(sessionId, message));
                });
    }

    public void sendToAll(WebSocketMessage message) {
        simpMessagingTemplate.convertAndSend(message);
    }

    public void sendToProjectMembers(Long projectId, WebSocketMessage message) {
        final Optional<Project> optProject = projectRepository.findById(projectId);

        final Project project;
        if (optProject.isPresent()) {
            project = optProject.get();
        } else {
            throw new RuntimeException("Cannot find Project.");
        }

        project.getMembers().forEach(member -> {
            this.sendToUser(member.getId(), message);
        });
    }

    public void sendToProjectOwners(Long projectId, WebSocketMessage message) {
        final Optional<Project> optProject = projectRepository.findById(projectId);

        final Project project;
        if (optProject.isPresent()) {
            project = optProject.get();
        } else {
            throw new RuntimeException("Cannot find Project.");
        }

        project.getOwners().forEach(owner -> {
            this.sendToUser(owner.getId(), message);
        });
    }

    public void sendError(String sessionId, WebSocketMessage error) {
        final SimpMessageHeaderAccessor headerAccessor = SimpMessageHeaderAccessor.create(SimpMessageType.MESSAGE);
        headerAccessor.setSessionId(sessionId);
        headerAccessor.setLeaveMutable(true);

        simpMessagingTemplate.convertAndSendToUser(sessionId, "/queue/error", error, headerAccessor.getMessageHeaders());

    }

    public PublishSubject<WebSocketMessage> register(Predicate<WebSocketMessage> filter) {
        final PublishSubject<WebSocketMessage> subject = PublishSubject.create();

        serviceSubjects.put(filter, subject);

        return subject;
    }

    public void closeSession(String sessionId) {
        Optional.ofNullable(this.webSocketSessions.get(sessionId))
                .ifPresent(webSocketSession -> {
                    try {
                        webSocketSession.close();
                    } catch (IOException ignored) {
                    }
                });
    }

    public void closeAllUserSessions(long userId) {
        Optional.ofNullable(activeUsers.get(userId))
                .ifPresent(simpUsername -> {
                    webSocketSessions.forEach((sessionId, session) -> {
                        if (session.getPrincipal().getName().equals(simpUsername)) {
                            try {
                                session.close();
                            } catch (IOException ignored) {
                            }
                        }
                    });
                });
    }

    public long getUserIdBySessionId(String sessionId) {
        final AtomicLong result = new AtomicLong(-1L);
        userSessionIds.forEach((userId, sessionSet) -> {
            if (sessionSet.contains(sessionId)) {
                result.set(userId);
            }
        });
        return result.get();
    }

    private void publishMessage(WebSocketMessage msg) {
        serviceSubjects.forEach((p, s) -> {
            if (p.test(msg)) {
                s.onNext(msg);
            }
        });
    }
}
