package de.learnlib.alex.websocket.services;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import de.learnlib.alex.auth.dao.UserDAO;
import de.learnlib.alex.common.exceptions.NotFoundException;
import de.learnlib.alex.data.dao.ProjectDAO;
import de.learnlib.alex.data.entities.Project;
import de.learnlib.alex.data.repositories.ProjectRepository;
import de.learnlib.alex.websocket.entities.WebSocketMessage;
import io.reactivex.rxjava3.disposables.Disposable;
import org.apache.shiro.authz.UnauthorizedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


import javax.annotation.PreDestroy;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.concurrent.atomic.AtomicLong;
import java.util.concurrent.locks.ReentrantLock;

@Service
@Transactional
public class ProjectPresenceService {

    private final ReentrantLock lock = new ReentrantLock(true);

    private final String serviceName = "ProjectPresenceService";

    private WebSocketBaseService webSocketBaseService;

    private ProjectDAO projectDAO;

    private ProjectRepository projectRepository;

    private final UserDAO userDAO;

    /* projectId -> <userId, colorCode> */
    private Map<Long, Map<Long, Integer>> userColors;

    private final String[] colorRange = { /* "F2F3F4", */ /* "222222", */ "F3C300", "875692", "F38400",
                                "A1CAF1", "BE0032", "C2B280", "848482", "008856",
                                "E68FAC", "0067A5", "F99379", "604E97", "F6A600",
                                "B3446C", "DCD300", "882D17", "8DB600", "654522",
                                "E25822", "2B3D26" };

    /* projectId -> colorCount */
    private Map<Long, List<Integer>> colorCount;

    /* projectId -> <userId, sessions> */
    private Map<Long, Map<Long, Set<String>>> sessions;

    private Set<Disposable> disposables;

    public ProjectPresenceService(WebSocketBaseService webSocketBaseService,
                                  ProjectDAO projectDAO,
                                  ProjectRepository projectRepository,
                                  UserDAO userDAO) {
        this.webSocketBaseService = webSocketBaseService;
        this.projectDAO = projectDAO;
        this.projectRepository = projectRepository;
        this.userDAO = userDAO;

        this.userColors = new HashMap<>();
        this.colorCount = new HashMap<>();
        this.sessions = new HashMap<>();
        this.disposables = new HashSet<>();

        disposables.add(
                this.webSocketBaseService.register(
                        message -> message.getEntity().equals("ProjectPresenceService")
                                && message.getType().equals("User Entered"))
                        .subscribe(this::userEnteredProject)
        );
        disposables.add(
                this.webSocketBaseService.register(
                        message -> message.getEntity().equals("ProjectPresenceService")
                                && message.getType().equals("User Left"))
                        .subscribe(this::userLeftProject)
        );
        disposables.add(
                this.webSocketBaseService.register(
                        message -> message.getEntity().equals("System")
                                && message.getType().equals("Session Disconnect"))
                        .subscribe(this::sessionDisconnect)
        );
        disposables.add(
                this.webSocketBaseService.register(
                        message -> message.getEntity().equals("ProjectPresenceService")
                                && message.getType().equals("Status Request"))
                        .subscribe(this::statusRequest)
        );
    }

    @SuppressWarnings("Duplicates")
    public void userEnteredProject(WebSocketMessage message) {
        lock.lock();

        try {
            ObjectMapper mapper = new ObjectMapper();
            ObjectNode content = (ObjectNode) mapper.readTree(message.getContent());

            long userId = message.getUser().getId();
            long projectId = content.get("projectId").asLong();
            String sessionId = message.getSessionId();

            AtomicLong oldProjectId = new AtomicLong(-1);
            sessions.forEach((p, m) -> {
                Optional.ofNullable(m.get(userId))
                        .ifPresent(sessionSet -> {
                            if (sessionSet.contains(sessionId) && p != projectId) {
                                oldProjectId.set(p);
                            }
                        });
            });

            if (oldProjectId.get() != -1) {
                removeSessionFromProject(oldProjectId.get(), userId, sessionId);
            }

            Project project = projectRepository.findById(projectId).orElseThrow(() -> new NotFoundException("Project not found."));

            projectDAO.checkAccess(message.getUser(), project);

            userColors.computeIfAbsent(projectId, k -> new HashMap<>())
                      .computeIfAbsent(userId, k -> this.nextColor(projectId));

            sessions.computeIfAbsent(projectId, k -> new HashMap<Long, Set<String>>())
                    .computeIfAbsent(userId, k -> new HashSet<>())
                    .add(sessionId);

            broadcastProjectStatus(projectId);

            /* DEBUG */
            printUserColors();
            printColorCount();
            printSessions();

        } catch (IOException e) {
            this.webSocketBaseService.sendError(message.getSessionId(), buildError("Received malformed content.", message));
            e.printStackTrace();
        } catch (UnauthorizedException | NotFoundException e) {
            this.webSocketBaseService.sendError(message.getSessionId(), buildError(e.getMessage(), message));
        } finally {
            lock.unlock();
        }
    }

    @SuppressWarnings("Duplicates")
    public void userLeftProject(WebSocketMessage message) {
        lock.lock();

        try {
            ObjectMapper mapper = new ObjectMapper();
            ObjectNode content = (ObjectNode) mapper.readTree(message.getContent());

            long userId = message.getUser().getId();
            long projectId = content.get("projectId").asLong();
            String sessionId = message.getSessionId();

            if (removeSessionFromProject(projectId, userId,sessionId)) {
                broadcastProjectStatus(projectId);
            }

            /* DEBUG */
            printUserColors();
            printColorCount();
            printSessions();

        } catch (IOException e) {
            this.webSocketBaseService.sendError(message.getSessionId(), buildError("Received malformed content.", message));
            e.printStackTrace();
        } catch (UnauthorizedException | NotFoundException e) {
            this.webSocketBaseService.sendError(message.getSessionId(), buildError(e.getMessage(), message));
        } finally {
            lock.unlock();
        }
    }

    @SuppressWarnings("Duplicates")
    private void sessionDisconnect(WebSocketMessage message) {
        lock.lock();

        try {
            long userId = message.getUser().getId();
            String sessionId = message.getSessionId();

            for (Map.Entry<Long, Map<Long, Set<String>>> entry : new ArrayList<>(sessions.entrySet())) {
                Long projectId = entry.getKey();
                Map<Long, Set<String>> m = entry.getValue();
                Optional.ofNullable(m.get(userId))
                        .ifPresent(l -> {
                            boolean removed = l.remove(sessionId);

                            if (l.isEmpty()) {
                                sessions.get(projectId).remove(userId);

                                int colorCode = userColors.get(projectId).get(userId);
                                colorCount.get(projectId).set(colorCode, colorCount.get(projectId).get(colorCode) - 1);

                                userColors.get(projectId).remove(userId);

                                if (sessions.get(projectId).isEmpty()) {
                                    sessions.remove(projectId);
                                    colorCount.remove(projectId);
                                    userColors.remove(projectId);
                                }
                            }

                            if (removed) broadcastProjectStatus(projectId);
                        });
            }
        } finally {
            lock.unlock();
        }

        /* DEBUG */
        printUserColors();
        printColorCount();
        printSessions();
    }

    @SuppressWarnings("Duplicates")
    public void statusRequest(WebSocketMessage message) {
        lock.lock();

        try {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode projectIds = mapper.readTree(message.getContent()).get("projectIds");

            WebSocketMessage status = new WebSocketMessage();
            status.setEntity(serviceName);
            status.setType("Status");

            ArrayNode projects = mapper.createArrayNode();

            projectIds.forEach(projectId -> {
                Project project = projectRepository.findById(projectId.asLong()).orElseThrow(() -> new NotFoundException("Project with id " + projectId + " not found."));
                projectDAO.checkAccess(message.getUser(), project);

                projects.add(getProjectStatus(projectId.asLong()));
            });

            status.setContent(projects.toString());
            this.webSocketBaseService.sendToSession(message.getSessionId(), status);

//            /* DEBUG */
//            printUserColors();
//            printColorCount();
//            printSessions();

        } catch (IOException e) {
            this.webSocketBaseService.sendError(message.getSessionId(), buildError("Received malformed content.", message));
            e.printStackTrace();
        } catch (UnauthorizedException | NotFoundException e) {
            this.webSocketBaseService.sendError(message.getSessionId(), buildError(e.getMessage(), message));
        } finally {
            lock.unlock();
        }
    }

    @SuppressWarnings("Duplicates")
    private boolean removeSessionFromProject(long projectId, long userId, String sessionId) {
        AtomicBoolean removed = new AtomicBoolean(false);
        Optional.ofNullable(sessions.get(projectId))
                .map(m -> m.get(userId))
                .ifPresent(l -> {
                    removed.set(l.remove(sessionId));

                    if (l.isEmpty()) {
                        sessions.get(projectId).remove(userId);

                        int colorCode = userColors.get(projectId).get(userId);
                        colorCount.get(projectId).set(colorCode, colorCount.get(projectId).get(colorCode) - 1);

                        userColors.get(projectId).remove(userId);

                        if(sessions.get(projectId).isEmpty()) {
                            sessions.remove(projectId);
                            colorCount.remove(projectId);
                            userColors.remove(projectId);
                        }
                    }
                });
        return removed.get();
    }

    @SuppressWarnings("Duplicates")
    private void broadcastProjectStatus(long projectId) {
        WebSocketMessage status = new WebSocketMessage();
        status.setEntity(serviceName);
        status.setType("Status");

        ObjectMapper mapper = new ObjectMapper();
        ArrayNode projects = mapper.createArrayNode();
        projects.add(getProjectStatus(projectId));
        status.setContent(projects.toString());

        this.webSocketBaseService.sendToProjectMembers(projectId, status);
        this.webSocketBaseService.sendToProjectOwners(projectId, status);
    }

    private ObjectNode getProjectStatus(long projectId) {
        ObjectMapper mapper = new ObjectMapper();

        ObjectNode status = mapper.createObjectNode();
        status.put("projectId", projectId);

        ObjectNode colors = mapper.createObjectNode();

        if (userColors.containsKey(projectId)) {
            userColors.get(projectId).forEach((userId, colorCode) -> {
                colors.put(userDAO.getById(userId).getUsername(), colorRange[colorCode]);
            });
        }

        status.set("colors", colors);

        return status;
    }

    private int nextColor(long projectId) {
        int colorCode = colorCount.computeIfAbsent(projectId, k -> new ArrayList<>(Collections.nCopies(colorRange.length, 0)))
                                  .indexOf(Collections.min(colorCount.get(projectId)));
        colorCount.get(projectId).set(colorCode, colorCount.get(projectId).get(colorCode) + 1);
        return colorCode;
    }

    @SuppressWarnings("Duplicates")
    private WebSocketMessage buildError(String description, WebSocketMessage message) {
        ObjectMapper om = new ObjectMapper();

        WebSocketMessage error = new WebSocketMessage();
        error.setType("Error");
        error.setEntity("ProjectPresenceService");

        ObjectNode errorNode = om.createObjectNode();
        errorNode.put("description", description);
        errorNode.put("message", message.getContent());

        error.setContent(errorNode.toString());

        return error;
    }

    @PreDestroy
    private void cleanUp() {
        disposables.forEach(Disposable::dispose);
    }

    private void printUserColors() {
        System.out.println("\n--- User Colors BEGIN ---");
        userColors.forEach((aLong, longIntegerMap) -> {
            System.out.println("ProjectID: " + aLong);
            longIntegerMap.forEach((aLong1, integer) -> {
                System.out.println("    " + "UserId: " + aLong1 + " Color: " + integer);
            });
        });
        System.out.println("--- User Colors END ---\n");
    }

    private void printColorCount() {
        System.out.println("\n--- Color Count BEGIN ---");
        colorCount.forEach((aLong, integers) -> {
            System.out.println("ProjectID: " + aLong);
            integers.forEach(integer -> {
                System.out.print(integer + "  ");
            });
        });
        System.out.println("--- Color Count End ---\n");
    }

    private void printSessions() {
        System.out.println("\n--- Sessions BEGIN ---");
        sessions.forEach((aLong, longSetMap) -> {
            System.out.println("ProjectID: " + aLong);
            longSetMap.forEach((aLong1, strings) -> {
                System.out.println("    UserID: " + aLong1);
                strings.forEach(s -> {
                    System.out.print(s + ", ");
                });
            });
        });
        System.out.println("--- Sessions END ---\n");
    }

}
