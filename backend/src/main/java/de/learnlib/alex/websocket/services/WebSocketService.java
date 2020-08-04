package de.learnlib.alex.websocket.services;

import de.learnlib.alex.auth.entities.User;
import de.learnlib.alex.data.entities.Project;
import de.learnlib.alex.data.repositories.ProjectRepository;
import de.learnlib.alex.websocket.entities.WebSocketMessage;
import de.learnlib.alex.websocket.services.enums.WebSocketServiceEnum;
import io.reactivex.rxjava3.subjects.PublishSubject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpAttributesContextHolder;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessageType;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.user.SimpUserRegistry;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.messaging.SessionConnectEvent;
import org.springframework.web.socket.messaging.SessionConnectedEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

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

@Service
@Transactional
public class WebSocketService {

    private final ReentrantLock lock = new ReentrantLock(true);

    private ProjectRepository projectRepository;

    private SimpMessagingTemplate simpMessagingTemplate;

    private Map<Predicate<WebSocketMessage>, PublishSubject<WebSocketMessage>> serviceSubjects;

    /* userId -> WebSocketSessions Username */
    private Map<Long, String> activeUsers;

    /* Stores the sessionIds of active connections per user */
    private Map<Long, Set<String>> userSessionIds;

    /* sessionId -> WebSocketSession */
    private Map<String, WebSocketSession> webSocketSessions;

    @Autowired
    public WebSocketService(SimpMessagingTemplate simpMessagingTemplate,
                            ProjectRepository projectRepository) {
        this.simpMessagingTemplate = simpMessagingTemplate;
        this.projectRepository = projectRepository;

        activeUsers = new HashMap<>();
        userSessionIds = new HashMap<>();
        serviceSubjects = new HashMap<>();
        this.webSocketSessions = new HashMap<>();
    }

    public void processIncomingMessage(WebSocketMessage msg, Principal userPrincipal) {
        lock.lock();
        try {
            msg.setUser((User) ((UsernamePasswordAuthenticationToken) userPrincipal).getPrincipal());
            msg.setSessionId(SimpAttributesContextHolder.currentAttributes().getSessionId());

            if (msg.getEntity().equals(WebSocketServiceEnum.WEBSOCKET_SERVICE.name()) && msg.getType().equals(WebSocketServiceEnum.LOGOUT.name())) {
                WebSocketMessage message = new WebSocketMessage();
                message.setEntity(WebSocketServiceEnum.WEBSOCKET_SERVICE.name());
                message.setType(WebSocketServiceEnum.LOGOUT_CHECK.name());

                this.sendToUser(msg.getUser().getId(), message);
                closeSession(msg.getSessionId());
            }

            if (msg.getEntity().equals(WebSocketServiceEnum.WEBSOCKET_SERVICE.name()) && msg.getType().equals(WebSocketServiceEnum.REQUEST_SESSION_ID.name())) {
                WebSocketMessage message = new WebSocketMessage();
                message.setEntity(WebSocketServiceEnum.WEBSOCKET_SERVICE.name());
                message.setType(WebSocketServiceEnum.SESSION_ID.name());
                message.setContent("{ \"sessionId\": \"" + msg.getSessionId() + "\" }");
                this.sendToSession(msg.getSessionId(), message);
            }

            if (!msg.getEntity().equals(WebSocketServiceEnum.WEBSOCKET_SERVICE_INTERNAL.name())) {
                publishMessage(msg);
            } else {
                WebSocketMessage message = new WebSocketMessage();
                message.setEntity(WebSocketServiceEnum.WEBSOCKET_SERVICE.name());
                message.setType(WebSocketServiceEnum.ERROR.name());
                message.setContent("Received system reserved entity type.");
                this.sendError(msg.getSessionId(), message);
            }
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

                printUserSessionIds();
                activeUsers.putIfAbsent(userId, authToken.getName());
                userSessionIds.putIfAbsent(userId, new HashSet<>());
                userSessionIds.get(userId).add(SimpAttributesContextHolder.currentAttributes().getSessionId());
                printUserSessionIds();

                printActiveUsers();
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
                System.out.println("\n\nDISCONNECT\n\n<");
                long userId = user.getId();

                System.out.println(userId);
                System.out.println(SimpAttributesContextHolder.currentAttributes().getSessionId());
                printUserSessionIds();
                WebSocketMessage msg;

                if (userSessionIds.get(userId) != null && userSessionIds.get(userId).contains(SimpAttributesContextHolder.currentAttributes().getSessionId())) {
                    msg = new WebSocketMessage();
                    msg.setEntity(WebSocketServiceEnum.WEBSOCKET_SERVICE_INTERNAL.name());
                    msg.setType(WebSocketServiceEnum.SESSION_DISCONNECT.name());
                    msg.setUser(user);
                    msg.setSessionId(SimpAttributesContextHolder.currentAttributes().getSessionId());
                    publishMessage(msg);
                    System.out.println("SESSION DC PUBLISHED!");

                    if (userSessionIds.get(userId).size() == 1) {
                        msg = new WebSocketMessage();
                        msg.setEntity(WebSocketServiceEnum.WEBSOCKET_SERVICE_INTERNAL.name());
                        msg.setType(WebSocketServiceEnum.USER_DISCONNECT.name());
                        msg.setUser(user);
                        msg.setSessionId(SimpAttributesContextHolder.currentAttributes().getSessionId());
                        publishMessage(msg);
                        System.out.println("USER DC PUBLISHED!");

                        activeUsers.remove(userId);
                        userSessionIds.remove(userId);
                    }

                    Optional.ofNullable(userSessionIds.get(userId))
                            .ifPresent(sessionSet -> {
                                sessionSet.remove(SimpAttributesContextHolder.currentAttributes().getSessionId());
                            });
                }

                printActiveUsers();
            }
        } finally {
            lock.unlock();
        }
    }

    public void sendToSession(String sessionId, WebSocketMessage message) {
        SimpMessageHeaderAccessor headerAccessor = SimpMessageHeaderAccessor.create(SimpMessageType.MESSAGE);
        headerAccessor.setSessionId(sessionId);
        headerAccessor.setLeaveMutable(true);

        simpMessagingTemplate.convertAndSendToUser(sessionId, "/queue", message, headerAccessor.getMessageHeaders());
        System.out.println(message.getType() + " " + message.getEntity() + " " + message.getContent());
        System.out.println(sessionId);
    }

    public void addWebSocketSession(WebSocketSession session) {
        lock.lock();
        try {
            webSocketSessions.put(session.getId(), session);
        } finally {
            lock.unlock();
        }
        printWebSocketSessions();
    }

    public void removeWebSocketSession(String sessionId) {
        lock.lock();
        try {
            webSocketSessions.remove(sessionId);
        } finally {
            lock.unlock();
        }
        printWebSocketSessions();
    }

    public void sendToUser(Long userId, WebSocketMessage message) {
        Optional.ofNullable(activeUsers.get(userId))
                .ifPresent(userString -> simpMessagingTemplate.convertAndSendToUser(userString, "/queue", message));
    }

    public void sendToAll(WebSocketMessage message) {
        simpMessagingTemplate.convertAndSend(message);
    }

    @SuppressWarnings("Duplicates")
    public void sendToProjectMembers(Long projectId, WebSocketMessage message) {
        Optional<Project> optProject = projectRepository.findById(projectId);

        final Project project;
        if (optProject.isPresent()) {
            project = optProject.get();
        } else {
            throw new RuntimeException("Cannot find Project.");
        }

        project.getMembers().forEach(member -> {
            Optional.ofNullable(activeUsers.get(member.getId()))
                    .ifPresent(userName -> simpMessagingTemplate.convertAndSendToUser(userName, "/queue", message));
        });
    }

    @SuppressWarnings("Duplicates")
    public void sendToProjectOwners(Long projectId, WebSocketMessage message) {
        Optional<Project> optProject = projectRepository.findById(projectId);

        final Project project;
        if (optProject.isPresent()) {
            project = optProject.get();
        } else {
            throw new RuntimeException("Cannot find Project.");
        }

        project.getOwners().forEach(owner -> {
            if (activeUsers.containsKey(owner.getId())) {
                simpMessagingTemplate.convertAndSendToUser(activeUsers.get(owner.getId()), "/queue", message);
            }
        });
    }

    public void sendError(String sessionId, WebSocketMessage error) {
        SimpMessageHeaderAccessor headerAccessor = SimpMessageHeaderAccessor.create(SimpMessageType.MESSAGE);
        headerAccessor.setSessionId(sessionId);
        headerAccessor.setLeaveMutable(true);

        simpMessagingTemplate.convertAndSendToUser(sessionId, "/queue/error", error, headerAccessor.getMessageHeaders());

    }

    public PublishSubject<WebSocketMessage> register(Predicate<WebSocketMessage> filter) {
        PublishSubject<WebSocketMessage> subject = PublishSubject.create();

        serviceSubjects.put(filter, subject);

        return subject;
    }

    public void closeSession(String sessionId) {
        Optional.ofNullable(this.webSocketSessions.get(sessionId))
                .ifPresent(webSocketSession -> {
                    try {
                        webSocketSession.close();
                    } catch (IOException e) {
                        // Ignore
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
                            } catch (IOException e) {
                                // Ignore
                            }
                        }
                    });
                });
    }

    public long getUserIdBySessionId(String sessionId) {
        AtomicLong result = new AtomicLong(-1L);
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

    /* DEBUG */
    private void printActiveUsers() {
        System.out.println("\n--- ACTIVE USERS BEGIN ---");
        activeUsers.forEach((aLong, s) -> {
            System.out.println(aLong + " --> " + s);
        });

        System.out.println("--- ACTIVE USERS END ---\n");
    }

    private void printWebSocketSessions() {
        System.out.println("\n--- WebSocketSessions BEGIN ---");
        webSocketSessions.forEach((s, session) -> {
            System.out.println("    " + s);
        });
        System.out.println("\n--- WebSocketSessions END ---");
    }

    private void printUserSessionIds() {
        System.out.println("\n--- UserSessionIds BEGIN ---");
        userSessionIds.forEach((aLong, strings) -> {
            System.out.println(aLong + " -> ");
            strings.forEach(s -> System.out.println("    " +s));
        });
        System.out.println("\n--- UserSessionIds END ---");
    }
}
