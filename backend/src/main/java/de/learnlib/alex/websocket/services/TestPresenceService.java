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
import de.learnlib.alex.testing.dao.TestDAO;
import de.learnlib.alex.testing.entities.Test;
import de.learnlib.alex.testing.entities.TestCase;
import de.learnlib.alex.testing.repositories.TestRepository;
import de.learnlib.alex.websocket.entities.WebSocketMessage;
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
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.concurrent.atomic.AtomicLong;
import java.util.concurrent.locks.ReentrantLock;

@Service
@Transactional
public class TestPresenceService {

    private final ReentrantLock lock = new ReentrantLock(true);

    private WebSocketBaseService webSocketBaseService;

    private UserDAO userDAO;

    private TestDAO testDAO;

    private TestRepository testRepository;

    private ProjectDAO projectDAO;

    private ProjectRepository projectRepository;

    /* projectId -> <testId -> userId> */
    private Map<Long, Map<Long, Long>> accessedTests;

    /* userId -> <projectId -> <testId -> List<sessionIds>>> */
    private Map<Long, Map<Long, Map<Long, HashSet<String>>>> sessions;

    /* sessionId -> timestamp */
    private Map<String, Date> timestamps;

    private Set<Disposable> disposables;

    public TestPresenceService(WebSocketBaseService webSocketBaseService,
                               UserDAO userDAO,
                               TestDAO testDAO,
                               TestRepository testRepository,
                               ProjectDAO projectDAO,
                               ProjectRepository projectRepository) {
        this.webSocketBaseService = webSocketBaseService;
        this.userDAO = userDAO;
        this.testDAO = testDAO;
        this.testRepository = testRepository;
        this.projectDAO = projectDAO;
        this.projectRepository = projectRepository;

        this.accessedTests = new HashMap<>();
        this.sessions = new HashMap<>();
        this.timestamps = new HashMap<>();
        this.disposables = new HashSet<>();

        disposables.add(
                this.webSocketBaseService.register(
                        message -> message.getEntity().equals("TestPresenceService")
                                && message.getType().equals("User Entered"))
                        .subscribe(this::userEnteredTest)
        );
        disposables.add(
                this.webSocketBaseService.register(
                        message -> message.getEntity().equals("TestPresenceService")
                                && message.getType().equals("User Left"))
                        .subscribe(this::userLeftTest)
        );
        disposables.add(
                this.webSocketBaseService.register(
                        message -> message.getEntity().equals("TestPresenceService")
                                && message.getType().equals("Status Request"))
                        .subscribe(this::statusRequest)
        );
        disposables.add(
                this.webSocketBaseService.register(
                        message -> message.getEntity().equals("System")
                                && message.getType().equals("Session Disconnect"))
                        .subscribe(this::sessionDisconnect)
        );
    }

    @SuppressWarnings("Duplicates")
    public void userEnteredTest(WebSocketMessage message) {
        lock.lock();

        try {
            ObjectMapper om = new ObjectMapper();
            ObjectNode content = (ObjectNode) om.readTree(message.getContent());

            long userId = message.getUser().getId();
            long projectId = content.get("projectId").asLong();
            long testId = content.get("testId").asLong();
            String sessionId = message.getSessionId();

            AtomicLong oldProjectId = new AtomicLong(-1);
            AtomicLong oldTestId = new AtomicLong(-1);
            sessions.forEach((u, projectMap) -> {
                projectMap.forEach((p, testMap) -> {
                    testMap.forEach((t, sessionSet) -> {
                        if (sessionSet.contains(sessionId)) {
                            oldProjectId.set(p);
                            oldTestId.set(t);
                        }
                    });
                });
            });

            if (oldProjectId.get() != -1) {
                removeSessionFromTest(oldProjectId.get(), oldTestId.get(), userId, sessionId);
                broadcastTestStatus(projectId);
            }

            /* check access */
            Project project = projectRepository.findById(projectId).orElseThrow(() -> new NotFoundException("Project not found."));
            projectDAO.checkAccess(message.getUser(), project);

            System.out.print(testDAO.get(userDAO.getById(userId), projectId, testId));
            if (testDAO.get(userDAO.getById(userId), projectId, testId) instanceof TestCase) {

                Optional.ofNullable(accessedTests.get(projectId))
                        .map(m -> m.get(testId))
                        .ifPresent(u -> {
                            if (u != userId) throw new UnauthorizedException("Test is already locked.");
                        });

                accessedTests.computeIfAbsent(projectId, k -> new HashMap<>())
                             .put(testId, userId);

                sessions.computeIfAbsent(userId, k -> new HashMap<>())
                        .computeIfAbsent(projectId, k -> new HashMap<>())
                        .computeIfAbsent(testId, k -> new HashSet<>())
                        .add(sessionId);

                timestamps.computeIfAbsent(sessionId, k -> new Date());

                broadcastTestStatus(projectId);


            }

            /* DEBUG */
            printTests();
            printSessions();
            printTimestamps();

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
    private void userLeftTest(WebSocketMessage message) {
        lock.lock();

        try {
            ObjectMapper om = new ObjectMapper();
            ObjectNode content = (ObjectNode) om.readTree(message.getContent());

            long userId = message.getUser().getId();
            long projectId = content.get("projectId").asLong();
            long testId = content.get("testId").asLong();
            String sessionId = message.getSessionId();

            if (removeSessionFromTest(projectId, testId, userId, sessionId)) broadcastTestStatus(projectId);

            /* DEBUG */
            printTests();
            printSessions();
            printTimestamps();

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
            long userId  = message.getUser().getId();
            String sessionId = message.getSessionId();

            AtomicLong aProjectId = new AtomicLong(-1);
            AtomicLong aTestId = new AtomicLong(-1);

            Optional.ofNullable(sessions.get(userId))
                    .ifPresent(projectMap -> {
                        projectMap.forEach((p, testMap) -> {
                            testMap.forEach((t, sessionSet) -> {
                                if (sessionSet.contains(sessionId)) {
                                    aProjectId.set(p);
                                    aTestId.set(t);
                                }
                            });
                        });
                    });

            if (aProjectId.get() != -1) {
                long projectId = aProjectId.get();
                long testId = aTestId.get();

                Set sessionSet = sessions.get(userId).get(projectId).get(testId);
                sessionSet.remove(sessionId);
                timestamps.remove(sessionId);

                if (sessionSet.isEmpty()) {
                    sessions.get(userId).get(projectId).remove(testId);
                    accessedTests.get(projectId).remove(testId);

                    if (sessions.get(userId).get(projectId).isEmpty()) {
                        sessions.get(userId).remove(projectId);
                        if (sessions.get(userId).isEmpty()) {
                            sessions.remove(userId);
                        }
                    }
                    if (accessedTests.get(projectId).isEmpty()) {
                        accessedTests.remove(projectId);
                    }
                }
                broadcastTestStatus(projectId);
            }

            /* DEBUG */
            printTests();
            printSessions();
            printTimestamps();
        } finally {
            lock.unlock();
        }
    }

    @SuppressWarnings("Duplicates")
    public void statusRequest(WebSocketMessage message) {
        lock.lock();

        try {
            ObjectMapper om = new ObjectMapper();
            JsonNode projectIds = om.readTree(message.getContent()).get("projectIds");

            WebSocketMessage status = new WebSocketMessage();
            status.setEntity("TestPresenceService");
            status.setType("Status");

            ObjectNode projects = om.createObjectNode();

            projectIds.forEach(projectId -> {
                Project project = projectRepository.findById(projectId.asLong()).orElseThrow(() -> new NotFoundException("Project not found."));
                projectDAO.checkAccess(message.getUser(), project);

                projects.set(projectId.asText(), getProjectStatus(projectId.asLong()));
            });

            status.setContent(projects.toString());
            this.webSocketBaseService.sendToSession(message.getSessionId(), status);
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
    private boolean removeSessionFromTest(long projectId, long testId, long userId, String sessionId) {
        AtomicBoolean removed = new AtomicBoolean(false);
        Optional.ofNullable(sessions.get(userId))
                .map(m -> m.get(projectId))
                .map(m -> m.get(testId))
                .ifPresent(sessionSet -> {
                    removed.set(sessionSet.remove(sessionId));
                    timestamps.remove(sessionId);

                    if (sessionSet.isEmpty()) {
                        sessions.get(userId).get(projectId).remove(testId);
                        accessedTests.get(projectId).remove(testId);

                        if (sessions.get(userId).get(projectId).isEmpty()) {
                            sessions.get(userId).remove(projectId);
                            if (sessions.get(userId).isEmpty()) {
                                sessions.remove(userId);
                            }
                        }
                        if (accessedTests.get(projectId).isEmpty()) {
                            accessedTests.remove(projectId);
                        }
                    }
                });
        return removed.get();
    }

    @SuppressWarnings("Duplicates")
    private void broadcastTestStatus(long projectId) {
        WebSocketMessage status = new WebSocketMessage();
        status.setEntity("TestPresenceService");
        status.setType("Status");

        ObjectMapper om = new ObjectMapper();
        ObjectNode projects = om.createObjectNode();
        projects.set(Long.toString(projectId), getProjectStatus(projectId));
        status.setContent(projects.toString());

        this.webSocketBaseService.sendToProjectMembers(projectId, status);
        this.webSocketBaseService.sendToProjectOwners(projectId, status);
    }

    private ObjectNode getProjectStatus(long projectId) {
        ObjectMapper om = new ObjectMapper();

        ObjectNode tests = om.createObjectNode();
        Optional.ofNullable(accessedTests.get(projectId))
                .ifPresent(m -> {
                    m.forEach((testId, userId) -> {

                        /* test got deleted */
                        Test test = testRepository.findById(testId).get();
                        while (test != null) {
                            ObjectNode testNode;
                            if ((testNode = (ObjectNode) tests.get(test.getId().toString())) == null) {
                                testNode = om.createObjectNode();
                            }

                            if (test instanceof TestCase) {
                                if (!testNode.has("type")) {
                                    testNode.put("type", "case");
                                }
                                testNode.put("timestamp", sessions.get(userId).get(projectId).get(test.getId()).stream().map(s -> timestamps.get(s)).min(Date::compareTo).get().getTime());
                                testNode.put("username", userDAO.getById(userId).getUsername());
                            } else {
                                if (!testNode.has("type")) {
                                    testNode.put("type", "suite");
                                }
                                if (!testNode.has("locks")) {
                                    testNode.set("locks", om.createArrayNode());
                                }
                                String username = userDAO.getById(userId).getUsername();
                                Iterator it = ((ArrayNode) testNode.get("locks")).elements();
                                boolean contains = false;
                                while(it.hasNext()) {
                                    String s = ((JsonNode)it.next()).textValue();
                                    contains = s.equals(username);
                                }
                                if(!contains) ((ArrayNode) testNode.get("locks")).add(userDAO.getById(userId).getUsername());
                            }

                            tests.set(test.getId().toString(), testNode);

                            test = test.getParent();
                        }
                    });
                });

        return tests;
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

    private void printTests() {
        System.out.println("\n--- BEGIN Tests ---");
        accessedTests.forEach((aLong, longLongMap) -> {
            System.out.println("ProjectID: " + aLong);
            longLongMap.forEach((aLong1, aLong2) -> {
                System.out.println("    " + aLong1 + " -> " + aLong2);
            });
        });
        System.out.println("--- END Tests ---\n");
    }

    private void printSessions() {
        System.out.println("\n--- BEGIN Sessions ---");
        sessions.forEach((aLong, longMapMap) -> {
            System.out.println("UserID: " + aLong);
            longMapMap.forEach((aLong1, longHashSetMap) -> {
                System.out.println("    ProjectID: " + aLong1);
                longHashSetMap.forEach((aLong2, strings) ->  {
                    System.out.println("        UserID: " + aLong2);
                    strings.forEach(s -> {
                        System.out.println("            " + s);
                    });
                });
            });
        });
        System.out.println("--- END Sessions ---\n");
    }

    private void printTimestamps() {
        System.out.println("\n--- BEGIN Timestamps ---");
        timestamps.forEach((s, date) -> {
            System.out.println(s + " -> " + date.getTime());
        });
        System.out.println("--- END Timestamps ---\n");
    }
}
