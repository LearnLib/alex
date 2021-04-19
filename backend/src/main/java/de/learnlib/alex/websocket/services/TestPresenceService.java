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
import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import com.fasterxml.jackson.annotation.JsonTypeName;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import de.learnlib.alex.auth.dao.UserDAO;
import de.learnlib.alex.common.exceptions.NotFoundException;
import de.learnlib.alex.data.dao.ProjectDAO;
import de.learnlib.alex.data.entities.Project;
import de.learnlib.alex.data.repositories.ProjectRepository;
import de.learnlib.alex.testing.dao.TestDAO;
import de.learnlib.alex.testing.entities.Test;
import de.learnlib.alex.testing.entities.TestCase;
import de.learnlib.alex.websocket.entities.WebSocketMessage;
import de.learnlib.alex.websocket.services.enums.TestPresenceServiceEnum;
import de.learnlib.alex.websocket.services.enums.WebSocketServiceEnum;
import io.reactivex.rxjava3.disposables.Disposable;
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
import javax.annotation.PreDestroy;
import org.apache.shiro.authz.UnauthorizedException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service class which tracks user presences in tests.
 */
@Service
@Transactional(rollbackFor = Exception.class)
public class TestPresenceService {

    /**
     * To ensure non concurrent access over multiple data structures an explicit lock is used.
     * This lock is 'fair' in a way that it respects the order of waiting threads when granting access.
     */
    private final ReentrantLock lock = new ReentrantLock(true);

    private final ObjectMapper objectMapper;

    private final WebSocketService webSocketService;

    private final TestDAO testDAO;

    private final ProjectDAO projectDAO;

    private final UserDAO userDAO;

    private final ProjectRepository projectRepository;

    /** A map which stores the TestLock objects with the projectId and testId as the keys. */
    private final Map<Long, Map<Long, TestLock>> testLocks;

    /** Shortcut mapping for easier access given the corresponding sessionId. */
    private final Map<String, TestCaseLock> sessionMap;

    /** Shortcut mapping for easier access given the corresponding userId. */
    private final Map<Long, Set<TestCaseLock>> userMap;

    private final Set<Disposable> disposables;

    @Autowired
    public TestPresenceService(WebSocketService webSocketService,
                               TestDAO testDAO,
                               ProjectDAO projectDAO,
                               UserDAO userDAO,
                               ProjectRepository projectRepository,
                               ObjectMapper objectMapper) {
        this.webSocketService = webSocketService;
        this.testDAO = testDAO;
        this.projectDAO = projectDAO;
        this.userDAO = userDAO;
        this.projectRepository = projectRepository;
        this.objectMapper = objectMapper;


        this.disposables = new HashSet<>();
        this.testLocks = new HashMap<>();
        this.sessionMap = new HashMap<>();
        this.userMap = new HashMap<>();

        disposables.add(
                this.webSocketService.register(
                        message -> message.getEntity().equals(TestPresenceServiceEnum.TEST_PRESENCE_SERVICE.name())
                                && message.getType().equals(TestPresenceServiceEnum.USER_ENTERED.name()))
                        .subscribe(this::userEnteredTest)
        );
        disposables.add(
                this.webSocketService.register(
                        message -> message.getEntity().equals(TestPresenceServiceEnum.TEST_PRESENCE_SERVICE.name())
                                && message.getType().equals(TestPresenceServiceEnum.USER_LEFT.name()))
                        .subscribe(this::userLeftTest)
        );
        disposables.add(
                this.webSocketService.register(
                        message -> message.getEntity().equals(TestPresenceServiceEnum.TEST_PRESENCE_SERVICE.name())
                                && message.getType().equals(TestPresenceServiceEnum.STATUS_REQUEST.name()))
                        .subscribe(this::statusRequest)
        );
        disposables.add(
                this.webSocketService.register(
                        message -> message.getEntity().equals(WebSocketServiceEnum.WEBSOCKET_SERVICE_INTERNAL.name())
                                && message.getType().equals(WebSocketServiceEnum.SESSION_DISCONNECT.name()))
                        .subscribe(this::sessionDisconnect)
        );
    }


    public void userEnteredTest(WebSocketMessage message) {
        lock.lock();

        try {
            final ObjectNode content = (ObjectNode) objectMapper.readTree(message.getContent());

            final long userId = message.getUser().getId();
            final long projectId = content.get("projectId").asLong();
            final long testId = content.get("testId").asLong();
            final String sessionId = message.getSessionId();

            /* session already acquired another testLock */
            Optional.ofNullable(sessionMap.get(sessionId))
                    .ifPresent(testLock -> {
                        if (testLock.getTestId() != testId) {
                            releaseTestLock(testLock.getProjectId(), testLock.getTestId(), userId, sessionId);
                        }
                    });

            /* check access */
            final Project project = projectRepository.findById(projectId)
                    .orElseThrow(() -> new NotFoundException("Project with id " + projectId + " not found."));
            projectDAO.checkAccess(message.getUser(), project);

            /* ignore TestSuites */
            if (testDAO.get(userDAO.getByID(userId), projectId, testId) instanceof TestCase) {
                acquireTestLock(projectId, testId, userId, sessionId);
            }

        } catch (IOException e) {
            this.webSocketService.sendError(message.getSessionId(), buildError("Received malformed content.", message));
        } catch (UnauthorizedException | NotFoundException e) {
            this.webSocketService.sendError(message.getSessionId(), buildError(e.getMessage(), message));
        } finally {
            lock.unlock();
        }
    }

    public void userLeftTest(WebSocketMessage message) {
        lock.lock();

        try {
            final ObjectNode content = (ObjectNode) objectMapper.readTree(message.getContent());

            final long userId = message.getUser().getId();
            final long projectId = content.get("projectId").asLong();
            final long testId = content.get("testId").asLong();
            final String sessionId = message.getSessionId();

            /* Ignore TestSuites */
            if (testDAO.get(userDAO.getByID(userId), projectId, testId) instanceof TestCase) {
                releaseTestLock(projectId, testId, userId, sessionId);
            }

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
                    .ifPresent(testCaseLock -> {
                        releaseTestLock(testCaseLock.getProjectId(), testCaseLock.getTestId(), userId, sessionId);
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
            status.setEntity(TestPresenceServiceEnum.TEST_PRESENCE_SERVICE.name());
            status.setType(TestPresenceServiceEnum.STATUS.name());

            final ObjectNode projects = objectMapper.createObjectNode();

            projectIds.forEach(projectId -> {
                final Project project = projectRepository.findById(projectId.asLong())
                        .orElseThrow(() -> new NotFoundException("Project with id " + projectId + " not found."));
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

    public void checkLockStatus(long projectId, long testId, long userId) throws UnauthorizedException {
        lock.lock();

        try {
            Optional.ofNullable(testLocks.get(projectId))
                    .map(projectMap -> projectMap.get(testId))
                    .ifPresent(testLock -> {
                        if ((testLock instanceof TestSuiteLock) || ((TestCaseLock) testLock).lockOwner != userId) {
                            throw new UnauthorizedException("This test is currently locked.");
                        }
                    });
        } finally {
            lock.unlock();
        }
    }

    public void checkLockStatusStrict(long projectId, long testId, long userId) throws UnauthorizedException {
        lock.lock();

        try {
            Optional.ofNullable(testLocks.get(projectId))
                    .map(projectMap -> projectMap.get(testId))
                    .ifPresent(testLock -> {
                        throw new UnauthorizedException("This test is currently locked.");
                    });
        } finally {
            lock.unlock();
        }
    }

    public void releaseUserLocksFromProject(long userId, long projectId) {
        lock.lock();

        try {
            Optional.ofNullable(userMap.get(userId))
                    .map(testCaseLocks -> testCaseLocks.stream()
                            .filter(testCaseLock -> testCaseLock.getProjectId() == projectId)
                            .collect(Collectors.toSet())
                    )
                    .ifPresent(testCaseLocks -> {
                        testCaseLocks.forEach(testCaseLock -> {
                            final Set<String> tmp = new HashSet<>(testCaseLock.lockSessions);
                            tmp.forEach(testCaseLock::removeSession);
                        });
                    });
        } finally {
            lock.unlock();
        }
    }

    public void releaseTestLocksByUser(long userId) {
        lock.lock();

        try {
            Optional.ofNullable(userMap.get(userId))
                    .ifPresent(testCaseLocks -> {
                        final Set<TestCaseLock> tmpTestCaseLocks = new HashSet<>(testCaseLocks);
                        tmpTestCaseLocks.forEach(testCaseLock -> {
                            final Set<String> tmpSessionSet = new HashSet<>(testCaseLock.lockSessions);
                            tmpSessionSet.forEach(sessionId -> {
                                releaseTestLock(testCaseLock.getProjectId(), testCaseLock.getTestId(), userId, sessionId);
                            });
                        });
                    });
        } finally {
            lock.unlock();
        }
    }

    public void releaseTestLocksByProject(long projectId) {
        lock.lock();

        try {
            final AtomicReference<Iterator> it = new AtomicReference<>(sessionMap.entrySet().iterator());
            while (it.get().hasNext()) {
                final Map.Entry e = (Map.Entry) it.get().next();
                if (((TestCaseLock) e.getValue()).getProjectId() == projectId) {
                    it.get().remove();
                }
            }

            userMap.forEach((userId, testCaseLocks) -> {
                it.set(testCaseLocks.iterator());
                while (it.get().hasNext()) {
                    final TestCaseLock l = (TestCaseLock) it.get().next();
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

            testLocks.remove(projectId);

        } finally {
            lock.unlock();
        }
    }

    private void acquireTestLock(long projectId, long testId, long userId, String sessionId) {
        final TestCaseLock testCaseLock = (TestCaseLock) testLocks.computeIfAbsent(projectId, k -> new HashMap<>())
                .computeIfAbsent(testId, k -> new TestCaseLock(projectId, testId));

        if (testCaseLock.addSession(userId, sessionId)) {
            sessionMap.put(sessionId, testCaseLock);
            userMap.computeIfAbsent(userId, k -> new HashSet<>())
                    .add(testCaseLock);

            Test test = testDAO.get(userDAO.getByID(userId), projectId, testId);
            while (test.getParent() != null) {
                test = test.getParent();

                ((TestSuiteLock) testLocks.get(projectId).computeIfAbsent(test.getId(), k -> new TestSuiteLock(projectId, k)))
                        .addSession(userId, sessionId);
            }
            broadcastTestStatus(projectId);
        }
    }

    private void releaseTestLock(long projectId, long testId, long userId, String sessionId) {
        Optional.ofNullable(testLocks.get(projectId))
                .map(m -> m.get(testId))
                .ifPresent(testCaseLock -> {
                    if (((TestCaseLock) testCaseLock).removeSession(sessionId)) {
                        sessionMap.remove(sessionId);

                        if (!((TestCaseLock) testCaseLock).isLocked()) {
                            testLocks.get(projectId).remove(testId);

                            userMap.get(userId).remove(testCaseLock);
                            if (userMap.get(userId).isEmpty()) {
                                userMap.remove(userId);
                            }
                        }

                        Test test = testDAO.get(userDAO.getByID(userId), projectId, testId);
                        while (test.getParent() != null) {

                            test = test.getParent();

                            final TestSuiteLock testSuiteLock = (TestSuiteLock) testLocks.get(projectId).get(test.getId());
                            testSuiteLock.removeSession(userId, sessionId);

                            if (!testSuiteLock.isLocked()) {
                                testLocks.get(projectId).remove(testSuiteLock.getTestId());
                            }
                        }

                        if (testLocks.get(projectId).isEmpty()) {
                            testLocks.remove(projectId);
                        }
                        broadcastTestStatus(projectId);
                    }
                });
    }

    private ObjectNode getProjectStatus(long projectId) {
        final ObjectNode tests = objectMapper.createObjectNode();

        Optional.ofNullable(testLocks.get(projectId))
                .ifPresent(m -> {
                    m.forEach((testId, testLock) -> {
                        tests.set(Long.toString(testId), objectMapper.valueToTree(testLock));
                    });
                });

        return tests;
    }

    private void broadcastTestStatus(long projectId) {
        final WebSocketMessage status = new WebSocketMessage();
        status.setEntity(TestPresenceServiceEnum.TEST_PRESENCE_SERVICE.name());
        status.setType(TestPresenceServiceEnum.STATUS.name());

        final ObjectNode projects = objectMapper.createObjectNode();
        projects.set(Long.toString(projectId), getProjectStatus(projectId));
        status.setContent(projects.toString());

        this.webSocketService.sendToProjectMembers(projectId, status);
        this.webSocketService.sendToProjectOwners(projectId, status);
    }

    private WebSocketMessage buildError(String description, WebSocketMessage message) {
        final WebSocketMessage error = new WebSocketMessage();
        error.setType(TestPresenceServiceEnum.ERROR.name());
        error.setEntity(TestPresenceServiceEnum.TEST_PRESENCE_SERVICE.name());

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
            @JsonSubTypes.Type(name = "case", value = TestCaseLock.class),
            @JsonSubTypes.Type(name = "suite", value = TestSuiteLock.class),
    })
    abstract class TestLock {

        private final long testId;
        private final long projectId;

        TestLock(long projectId, long testId) {
            this.projectId = projectId;
            this.testId = testId;
        }

        public long getProjectId() {
            return projectId;
        }

        public long getTestId() {
            return testId;
        }
    }

    @JsonTypeName("case")
    class TestCaseLock extends TestLock {

        @JsonIgnore
        private long lockOwner;

        @JsonIgnore
        private final Set<String> lockSessions;

        @JsonIgnore
        private final Map<String, Date> timestamps;

        TestCaseLock(long projectId, long testId) {
            super(projectId, testId);

            this.lockSessions = new HashSet<>();
            this.timestamps = new HashMap<>();
        }

        public long getLockOwner() {
            return lockOwner;
        }

        public boolean addSession(long userId, String sessionId) {
            if (lockSessions.isEmpty()) {
                lockOwner = userId;
            } else if (lockOwner != userId) {
                throw new UnauthorizedException("Test is already locked.");
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
            return userDAO.getByID(lockOwner).getUsername();
        }

        @JsonProperty("timestamp")
        public long getOldestTimestampMillis() {
            return timestamps.values().stream().min(Date::compareTo).get().getTime();
        }
    }

    @JsonTypeName("suite")
    class TestSuiteLock extends TestLock {

        @JsonIgnore
        Set<Long> lockOwners;

        @JsonIgnore
        Map<Long, Set<String>> lockSessions;

        TestSuiteLock(long projectId, long testId) {
            super(projectId, testId);
            this.lockOwners = new HashSet<>();
            this.lockSessions = new HashMap<>();
        }

        public Set<Long> getLockOwners() {
            return lockOwners;
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
        public List<String> getLockOwnersNames() {
            return lockOwners.stream()
                    .map(userId -> userDAO.getByID(userId).getUsername())
                    .collect(Collectors.toList());
        }
    }
}
