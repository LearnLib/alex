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

package de.learnlib.alex.integrationtests.websocket;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

import com.jayway.jsonpath.JsonPath;
import de.learnlib.alex.integrationtests.resources.AbstractResourceIT;
import de.learnlib.alex.integrationtests.resources.api.ProjectApi;
import de.learnlib.alex.integrationtests.resources.api.TestApi;
import de.learnlib.alex.integrationtests.websocket.util.TestPresenceServiceWSMessages;
import de.learnlib.alex.integrationtests.websocket.util.WebSocketUser;
import de.learnlib.alex.websocket.entities.WebSocketMessage;
import de.learnlib.alex.websocket.services.enums.TestPresenceServiceEnum;
import java.time.Duration;
import java.util.Arrays;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import javax.ws.rs.core.Response;
import org.awaitility.Awaitility;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

public class ATestPresenceServiceIT extends AbstractResourceIT {

    private final Duration defaultWaitTime = Duration.ofSeconds(5);

    private WebSocketUser user1;

    private WebSocketUser user2;

    private WebSocketUser user3;

    private int projectId1;

    private int projectId2;

    private int testSuiteId1;

    private int testSuiteId2;

    private int testSuiteId3;

    private int testId1;

    private int testId2;

    private int testId3;

    private int testId4;

    private TestPresenceServiceWSMessages testPresenceServiceWSMessages;

    /**
     * Scenario:
     *
     * - Three users: user1, user2, user3.
     * - two projects: project1, project2.
     * - user1 is owner of project1.
     * - user2 is owner of project2.
     * - user2 is member of project1.
     * - user3 has no project.
     * - user3 is not a member of any project.
     *
     * @throws Exception If something goes wrong.
     */
    @BeforeEach
    public void pre() throws Exception {
        user1 = new WebSocketUser("user1", client, port);
        user2 = new WebSocketUser("user2", client, port);
        user3 = new WebSocketUser("user3", client, port);

        ProjectApi projectApi = new ProjectApi(client, port);
        TestApi testApi = new TestApi(client, port);

        testPresenceServiceWSMessages = new TestPresenceServiceWSMessages();

        final Response res1 = projectApi.create("{\"name\":\"project1\",\"url\":\"http://localhost:8080\"}", user1.getJwt());
        projectId1 = JsonPath.read(res1.readEntity(String.class), "$.id");

        projectApi.addMembers(Integer.toUnsignedLong(projectId1), Collections.singletonList(user2.getUserId()), user1.getJwt());

        final Response res2 = projectApi.create("{\"name\":\"project2\",\"url\":\"http://localhost:8080\"}", user2.getJwt());
        projectId2 = JsonPath.read(res2.readEntity(String.class), "$.id");

        final Response res3 = testApi.create(projectId1, "{\"name\":\"testSuite1\", \"project\": " + projectId1 + ",\"type\":\"suite\"" + "}", user1.getJwt());
        testSuiteId1 = JsonPath.read(res3.readEntity(String.class), "id");

        final Response res4 = testApi.create(projectId1, "{\"name\":\"testSuite2\", \"project\": " + projectId1 + ", \"parent\": " + testSuiteId1 + ",\"type\":\"suite\"" + "}", user1.getJwt());
        testSuiteId2 = JsonPath.read(res4.readEntity(String.class), "id");

        final Response res5 = testApi.create(projectId2, "{\"name\":\"testSuite3\", \"project\": " + projectId2 + ",\"type\":\"suite\"" + "}", user2.getJwt());
        testSuiteId3 = JsonPath.read(res5.readEntity(String.class), "id");

        final Response res6 = testApi.create(projectId1, "{\"name\":\"test1\", \"project\": " + projectId1 + ", \"parent\": " + testSuiteId1 + ",\"type\":\"case\"" + "}", user1.getJwt());
        testId1 = JsonPath.read(res6.readEntity(String.class), "id");

        final Response res7 = testApi.create(projectId1, "{\"name\":\"test2\", \"project\": " + projectId1 + ", \"parent\": " + testSuiteId1 + ",\"type\":\"case\"" + "}", user1.getJwt());
        testId2 = JsonPath.read(res7.readEntity(String.class), "id");

        final Response res8 = testApi.create(projectId1, "{\"name\":\"test3\", \"project\": " + projectId1 + ", \"parent\": " + testSuiteId2 + ",\"type\":\"case\"" + "}", user1.getJwt());
        testId3 = JsonPath.read(res8.readEntity(String.class), "id");

        final Response res9 = testApi.create(projectId2, "{\"name\":\"test4\", \"project\": " + projectId2 + ", \"parent\": " + testSuiteId3 + ",\"type\":\"case\"" + "}", user2.getJwt());
        testId4 = JsonPath.read(res9.readEntity(String.class), "id");
    }

    @AfterEach
    @Override
    public void post() throws Exception {
        List.of(user1, user2, user3).forEach(u -> {
            u.clearMessagesInAllSessions();
            u.forceDisconnectAll();
        });

        super.post();
    }

    @Test
    public void shouldAddTestLock() throws Exception {
        user1.send("default", testPresenceServiceWSMessages.userEnteredTest(projectId1, testId1));
        final var response = user1.getNextMessage("default");

        assertTrue(getLocks(response.getContent(), projectId1, testSuiteId1).contains("user1"));
        assertEquals("user1", getUsername(response.getContent(), projectId1, testId1));
    }

    @Test
    public void shouldRemoveSymbolLock() throws Exception {
        user1.send("default", testPresenceServiceWSMessages.userEnteredTest(projectId1, testId1));
        final var res1 = user1.getNextMessage("default");
        assertTrue(getLocks(res1.getContent(), projectId1, testSuiteId1).contains("user1"));
        assertEquals("user1", getUsername(res1.getContent(), projectId1, testId1));

        user1.send("default", testPresenceServiceWSMessages.userLeftTest(projectId1, testId1));
        final var res2 = user1.getNextMessage("default");
        assertEquals("{}", JsonPath.read(res2.getContent(), "$.['" + projectId1 + "']").toString());
        assertEquals("{}", JsonPath.read(res2.getContent(), "$.['" + projectId1 + "']").toString());
    }

    @Test
    public void shouldAddSessionToExistingSymbolLock() throws Exception {
        user1.connectNewSession("otherSession");

        user1.send("default", testPresenceServiceWSMessages.userEnteredTest(projectId1, testId1));
        WebSocketMessage response = user1.getNextMessage("default");

        assertTrue(getLocks(response.getContent(), projectId1, testSuiteId1).contains("user1"));
        assertEquals("user1", getUsername(response.getContent(), projectId1, testId1));

        Date oldTimestamp = new Date(getTimestamp(response.getContent(), projectId1, testId1));

        user1.send("otherSession", testPresenceServiceWSMessages.userEnteredTest(projectId1, testId1));
        response = user1.getNextMessage("default");

        assertTrue(getLocks(response.getContent(), projectId1, testSuiteId1).contains("user1"));
        assertEquals("user1", getUsername(response.getContent(), projectId1, testId1));

        user1.send("default", testPresenceServiceWSMessages.userLeftTest(projectId1, testId1));
        response = user1.getNextMessage("default");

        assertTrue(getLocks(response.getContent(), projectId1, testSuiteId1).contains("user1"));
        assertEquals("user1", getUsername(response.getContent(), projectId1, testId1));

        Date newTimestamp = new Date(getTimestamp(response.getContent(), projectId1, testId1));

        assertTrue(oldTimestamp.before(newTimestamp));
    }

    @Test
    public void shouldRemoveSessionFromSymbolLock() throws Exception {
        user1.connectNewSession("otherSession");

        user1.send("default", testPresenceServiceWSMessages.userEnteredTest(projectId1, testId1));
        WebSocketMessage response = user1.getNextMessage("default");

        assertTrue(getLocks(response.getContent(), projectId1, testSuiteId1).contains("user1"));
        assertEquals("user1", getUsername(response.getContent(), projectId1, testId1));

        user1.send("otherSession", testPresenceServiceWSMessages.userEnteredTest(projectId1, testId1));
        response = user1.getNextMessage("default");

        assertTrue(getLocks(response.getContent(), projectId1, testSuiteId1).contains("user1"));
        assertEquals("user1", getUsername(response.getContent(), projectId1, testId1));

        user1.send("default", testPresenceServiceWSMessages.userLeftTest(projectId1, testId1));
        response = user1.getNextMessage("default");

        assertTrue(getLocks(response.getContent(), projectId1, testSuiteId1).contains("user1"));
        assertEquals("user1", getUsername(response.getContent(), projectId1, testId1));

        user1.send("otherSession", testPresenceServiceWSMessages.userLeftTest(projectId1, testId1));
        response = user1.getNextMessage("default");

        assertEquals("{}", getProjectAsString(response.getContent(), projectId1));
    }

    @Test
    public void shouldCorrectlyAssembleProjectStatus() throws Exception {
        user1.connectNewSession("otherSession");
        user2.connectNewSession("otherSession");

        user1.send("default", testPresenceServiceWSMessages.userEnteredTest(projectId1, testId1));
        user1.send("otherSession", testPresenceServiceWSMessages.userEnteredTest(projectId1, testId2));
        user2.send("default", testPresenceServiceWSMessages.userEnteredTest(projectId1, testId3));
        user2.send("otherSession", testPresenceServiceWSMessages.userEnteredTest(projectId2, testId4));

        final var sessions = List.of("default", "otherSession");
        Awaitility.await().atMost(defaultWaitTime).until(() ->
                user1.assertNumberOfMessages(sessions, List.of(3, 3))
                        && user2.assertNumberOfMessages(sessions, List.of(4, 4)));

        user1.clearMessagesInAllSessions();
        user2.clearMessagesInAllSessions();

        user2.send("default", testPresenceServiceWSMessages.requestStatus(Arrays.asList((long) projectId1, (long) projectId2)));
        final var content = user2.getNextMessage("default").getContent();

        assertTrue(getLocks(content, projectId1, testSuiteId1).contains("user1"));
        assertTrue(getLocks(content, projectId1, testSuiteId1).contains("user2"));
        assertTrue(getLocks(content, projectId1, testSuiteId2).contains("user2"));
        assertFalse(getLocks(content, projectId1, testSuiteId2).contains("user1"));
        assertTrue(getLocks(content, projectId2, testSuiteId3).contains("user2"));
        assertFalse(getLocks(content, projectId2, testSuiteId3).contains("user1"));

        assertEquals("user1", getUsername(content, projectId1, testId1));
        assertEquals("user1", getUsername(content, projectId1, testId2));
        assertEquals("user2", getUsername(content, projectId1, testId3));
        assertEquals("user2", getUsername(content, projectId2, testId4));
    }

    @Test
    public void shouldSupportMultipleUserSessions() throws Exception {
        user1.connectNewSession("otherSession");
        user2.connectNewSession("otherSession");

        user1.send("default", testPresenceServiceWSMessages.userEnteredTest(projectId1, testId1));
        user1.send("otherSession", testPresenceServiceWSMessages.userEnteredTest(projectId1, testId2));
        user2.send("default", testPresenceServiceWSMessages.userEnteredTest(projectId1, testId3));
        user2.send("otherSession", testPresenceServiceWSMessages.userEnteredTest(projectId2, testId4));

        final var sessions = List.of("default", "otherSession");
        Awaitility.await().atMost(defaultWaitTime).until(() ->
                user1.assertNumberOfMessages(sessions, List.of(3, 3))
                        && user2.assertNumberOfMessages(sessions, List.of(4, 4)));

        user1.send("default", testPresenceServiceWSMessages.userLeftTest(projectId1, testId1));
        user1.send("otherSession", testPresenceServiceWSMessages.userLeftTest(projectId1, testId2));
        user2.send("default", testPresenceServiceWSMessages.userLeftTest(projectId1, testId3));
        user2.send("otherSession", testPresenceServiceWSMessages.userLeftTest(projectId2, testId4));

        Awaitility.await().atMost(defaultWaitTime).until(() ->
                user1.assertNumberOfMessages(sessions, List.of(6, 6))
                        && user2.assertNumberOfMessages(sessions, List.of(8, 8)));

        user1.clearMessagesInAllSessions();
        user2.clearMessagesInAllSessions();
        user2.send("default", testPresenceServiceWSMessages.requestStatus(Arrays.asList((long) projectId1, (long) projectId2)));
        final var response = user2.getNextMessage("default");

        assertEquals("{}", getProjectAsString(response.getContent(), projectId1));
        assertEquals("{}", getProjectAsString(response.getContent(), projectId2));
    }

    @Test
    public void shouldProcessSessionDisconnect() throws Exception {
        user2.send("default", testPresenceServiceWSMessages.userEnteredTest(projectId1, testId1));

        final var res1 = user1.getNextMessage("default");
        assertTrue(getLocks(res1.getContent(), projectId1, testSuiteId1).contains("user2"));
        assertEquals("user2", getUsername(res1.getContent(), projectId1, testId1));

        user2.forceDisconnect("default");
        final var res2 = user1.getNextMessage("default");
        assertEquals("{}", getProjectAsString(res2.getContent(), projectId1));
    }

    @Test
    public void shouldIgnoreDuplicateEnteredMessage() throws Exception {
        final var res1 = user1.sendAndReceive("default", testPresenceServiceWSMessages.userEnteredTest(projectId1, testId1));
        assertTrue(getLocks(res1.getContent(), projectId1, testSuiteId1).contains("user1"));
        assertEquals("user1", getUsername(res1.getContent(), projectId1, testId1));

        final var res2 = user1.sendAndReceive("default", testPresenceServiceWSMessages.userEnteredTest(projectId1, testId1));
        assertNull(res2);
    }

    @Test
    public void shouldIgnoreDuplicateLeftMessage() throws Exception {
        final var res1 = user1.sendAndReceive("default", testPresenceServiceWSMessages.userEnteredTest(projectId1, testId1));
        assertTrue(getLocks(res1.getContent(), projectId1, testSuiteId1).contains("user1"));
        assertEquals("user1", getUsername(res1.getContent(), projectId1, testId1));

        final var res2 = user1.sendAndReceive("default", testPresenceServiceWSMessages.userLeftTest(projectId1, testId1));
        assertEquals("{}", getProjectAsString(res2.getContent(), projectId1));

        final var res3 = user1.sendAndReceive("default", testPresenceServiceWSMessages.userLeftTest(projectId1, testId1));
        assertNull(res3);
    }

    @Test
    public void shouldSwitchSymbolLock() throws Exception {
        user1.send("default", testPresenceServiceWSMessages.userEnteredTest(projectId1, testId1));

        final var res1 = user1.getNextMessage("default");
        assertTrue(getLocks(res1.getContent(), projectId1, testSuiteId1).contains("user1"));
        assertEquals("user1", getUsername(res1.getContent(), projectId1, testId1));

        user1.send("default", testPresenceServiceWSMessages.userEnteredTest(projectId1, testId2));
        final var res2 = user1.getNextMessage("default");
        assertEquals("{}", getProjectAsString(res2.getContent(), projectId1));
        assertEquals("{}", getProjectAsString(res2.getContent(), projectId1));

        final var res3 = user1.getNextMessage("default");
        assertTrue(getLocks(res3.getContent(), projectId1, testSuiteId1).contains("user1"));
        assertEquals("user1", getUsername(res3.getContent(), projectId1, testId2));
    }

    @Test
    public void shouldBroadcastUpdatesCorrectly() throws Exception {
        user2.connectNewSession("otherSession");

        user1.send("default", testPresenceServiceWSMessages.userEnteredTest(projectId1, testId1));

        final var res1 = user1.getNextMessage("default");
        assertTrue(getLocks(res1.getContent(), projectId1, testSuiteId1).contains("user1"));
        assertEquals("user1", getUsername(res1.getContent(), projectId1, testId1));

        final var res2 = user2.getNextMessage("default");
        assertTrue(getLocks(res2.getContent(), projectId1, testSuiteId1).contains("user1"));
        assertEquals("user1", getUsername(res2.getContent(), projectId1, testId1));

        final var res3 = user2.getNextMessage("otherSession");
        assertTrue(getLocks(res3.getContent(), projectId1, testSuiteId1).contains("user1"));
        assertEquals("user1", getUsername(res3.getContent(), projectId1, testId1));

        final var res4 = user3.getNextMessage("default");
        assertNull(res4);
    }

    @Test
    public void shouldNotSendProjectStatusToUnauthorizedUser() throws Exception {
        final var message = testPresenceServiceWSMessages.requestStatus(Collections.singletonList((long) projectId1));
        final var response = user3.sendAndReceive("default", message);
        assertEquals("You are not allowed to access the project.", getDescription(response.getContent()));
    }

    @Test
    public void shouldRejectMalformedContentInStatusRequestMessage() throws Exception {
        final var badMessage = new WebSocketMessage();
        badMessage.setEntity(TestPresenceServiceEnum.TEST_PRESENCE_SERVICE.name());
        badMessage.setType(TestPresenceServiceEnum.STATUS_REQUEST.name());
        badMessage.setContent("malformed content");

        final var response = user1.sendAndReceive("default", badMessage);
        assertEquals("Received malformed content.", getDescription(response.getContent()));
    }

    @Test
    public void shouldRejectMalformedContentInUserEnteredMessage() throws Exception {
        final var badMessage = new WebSocketMessage();
        badMessage.setEntity(TestPresenceServiceEnum.TEST_PRESENCE_SERVICE.name());
        badMessage.setType(TestPresenceServiceEnum.USER_ENTERED.name());
        badMessage.setContent("malformed content");

        final var response = user1.sendAndReceive("default", badMessage);
        assertEquals("Received malformed content.", getDescription(response.getContent()));
    }

    @Test
    public void shouldRejectMalformedContentInUserLeftMessage() throws Exception {
        final var badMessage = new WebSocketMessage();
        badMessage.setEntity(TestPresenceServiceEnum.TEST_PRESENCE_SERVICE.name());
        badMessage.setType(TestPresenceServiceEnum.USER_LEFT.name());
        badMessage.setContent("malformed content");

        final var response = user1.sendAndReceive("default", badMessage);
        assertEquals("Received malformed content.", getDescription(response.getContent()));
    }

    @Test
    public void shouldRejectStatusRequestWithNonExistentProject() throws Exception {
        final var message = testPresenceServiceWSMessages.requestStatus(Collections.singletonList(-1L));
        final var response = user1.sendAndReceive("default", message);
        assertEquals("Project with id -1 not found.", getDescription(response.getContent()));
    }

    private List<String> getLocks(String content, int projectId, int testId) {
        return JsonPath.read(content, "$.['" + projectId + "'].['" + testId + "'].locks");
    }

    private String getUsername(String content, int projectId, int testId) {
        return JsonPath.read(content, "$.['" + projectId + "'].['" + testId + "'].username");
    }

    private Long getTimestamp(String content, int projectId, int testId) {
        return JsonPath.read(content, "$.['" + projectId + "'].['" + testId + "'].timestamp");
    }

    private String getProjectAsString(String content, int projectId) {
        return JsonPath.read(content, "$.['" + projectId + "']").toString();
    }
    
    private String getDescription(String content) {
        return JsonPath.read(content, "$.description");
    }
}
