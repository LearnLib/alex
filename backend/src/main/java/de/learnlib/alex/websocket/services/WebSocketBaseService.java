package de.learnlib.alex.websocket.services;

import de.learnlib.alex.auth.entities.User;
import de.learnlib.alex.data.entities.Project;
import de.learnlib.alex.data.repositories.ProjectRepository;
import de.learnlib.alex.websocket.entities.WebSocketMessage;
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
import org.springframework.web.socket.messaging.SessionConnectedEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import java.security.Principal;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.locks.ReentrantLock;
import java.util.function.Predicate;

@Service
@Transactional
public class WebSocketBaseService {

    private final ReentrantLock lock = new ReentrantLock(true);

    /* userId -> WebSocketSessions Username */
    private Map<Long, String> activeUsers;

    /* Stores the number of active connections per user */
    private Map<Long, Integer> connectionCount;

    private SimpMessagingTemplate simpMessagingTemplate;

    private ProjectRepository projectRepository;

    private Map<Predicate<WebSocketMessage>, PublishSubject<WebSocketMessage>> serviceSubjects;

    private SimpUserRegistry simpUserRegistry;

    @Autowired
    public WebSocketBaseService(SimpMessagingTemplate simpMessagingTemplate,
                                ProjectRepository projectRepository,
                                SimpUserRegistry simpUserRegistry) {
        this.simpMessagingTemplate = simpMessagingTemplate;
        this.projectRepository = projectRepository;
        this.simpUserRegistry = simpUserRegistry;

        activeUsers = new HashMap<>();
        connectionCount = new HashMap<>();
        serviceSubjects = new HashMap<>();
    }

    public void processIncomingMessage(WebSocketMessage msg, Principal userPrincipal) {
        lock.lock();

        try {
            msg.setUser((User) ((UsernamePasswordAuthenticationToken) userPrincipal).getPrincipal());
            msg.setSessionId(SimpAttributesContextHolder.currentAttributes().getSessionId());

            if (msg.getEntity().equals("AppStoreService") && msg.getType().equals("Logout")) {
                WebSocketMessage message = new WebSocketMessage();
                message.setEntity("WebSocketService");
                message.setType("Logout");
                this.sendToUser(msg.getUser().getId(), message);
            }

            publishMessage(msg);
        } finally {
            lock.unlock();
        }
    }

    @EventListener
    public void onSessionConnectedEvent(SessionConnectedEvent event) {
        lock.lock();

        try {
            UsernamePasswordAuthenticationToken authToken = (UsernamePasswordAuthenticationToken) event.getUser();
            long userId = ((User) authToken.getPrincipal()).getId();

            activeUsers.putIfAbsent(userId, authToken.getName());
            connectionCount.put(userId, connectionCount.getOrDefault(userId, 0) + 1);

            WebSocketMessage msg;

            if (connectionCount.get(userId) == 1) {
                msg = new WebSocketMessage();
                msg.setEntity("System");
                msg.setType("User Connect");
                msg.setUser((User) authToken.getPrincipal());
                msg.setSessionId(SimpAttributesContextHolder.currentAttributes().getSessionId());
                publishMessage(msg);
            }

            msg = new WebSocketMessage();
            msg.setEntity("System");
            msg.setType("Session Connect");
            msg.setUser((User) authToken.getPrincipal());
            msg.setSessionId(SimpAttributesContextHolder.currentAttributes().getSessionId());
            publishMessage(msg);

            printActiveUsers();
        } finally {
            lock.unlock();
        }
    }

    @EventListener
    public void onSessionDisconnectEvent(SessionDisconnectEvent event) throws InterruptedException {
        lock.lock();

        try {
            UsernamePasswordAuthenticationToken authToken = (UsernamePasswordAuthenticationToken) event.getUser();
            if (((User) authToken.getPrincipal()).getId() != null) {
                long userId = ((User) authToken.getPrincipal()).getId();

                connectionCount.put(userId, connectionCount.getOrDefault(userId, 1) - 1);

                /* Remove user from activeUsers if there is none connection for the user */
                if (connectionCount.get(userId) == 0) {
                    activeUsers.remove(userId);
                    connectionCount.remove(userId);
                }

                WebSocketMessage msg;

                msg = new WebSocketMessage();
                msg.setEntity("System");
                msg.setType("Session Disconnect");
                msg.setUser((User) authToken.getPrincipal());
                msg.setSessionId(SimpAttributesContextHolder.currentAttributes().getSessionId());
                publishMessage(msg);

                if (!activeUsers.containsKey(userId)) {
                    msg = new WebSocketMessage();
                    msg.setEntity("System");
                    msg.setType("User Disconnect");
                    msg.setUser((User) authToken.getPrincipal());
                    msg.setSessionId(SimpAttributesContextHolder.currentAttributes().getSessionId());
                    publishMessage(msg);
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
    }

    public void sendToUser(Long userId, WebSocketMessage message) {
        simpMessagingTemplate.convertAndSendToUser(activeUsers.get(userId), "/queue", message);
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
            if (activeUsers.containsKey(member.getId())) {
                simpMessagingTemplate.convertAndSendToUser(activeUsers.get(member.getId()), "/queue", message);
            }
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

        simpMessagingTemplate.convertAndSendToUser(SimpAttributesContextHolder.currentAttributes().getSessionId(), "/queue/error", error, headerAccessor.getMessageHeaders());

    }

    public PublishSubject<WebSocketMessage> register(Predicate<WebSocketMessage> filter) {
        PublishSubject<WebSocketMessage> subject = PublishSubject.create();

        serviceSubjects.put(filter, subject);

        return subject;
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

    /* DEBUG */
    private void printSimpUserSessions(String userName) {
        System.out.println("\n--- User: " + userName + " Sessions BEGIN ---");
        simpUserRegistry.getUser(userName).getSessions().forEach((s) -> {
            System.out.println(s.getId());
        });

        System.out.println("--- Sessions END ---\n");
    }
}
