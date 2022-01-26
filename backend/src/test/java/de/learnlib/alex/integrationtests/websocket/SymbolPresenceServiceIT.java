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
import de.learnlib.alex.integrationtests.resources.api.SymbolApi;
import de.learnlib.alex.integrationtests.resources.api.SymbolGroupApi;
import de.learnlib.alex.integrationtests.websocket.util.SymbolPresenceServiceWSMessages;
import de.learnlib.alex.integrationtests.websocket.util.WebSocketUser;
import de.learnlib.alex.websocket.entities.WebSocketMessage;
import de.learnlib.alex.websocket.services.enums.SymbolPresenceServiceEnum;
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

public class SymbolPresenceServiceIT extends AbstractResourceIT {

    private final Duration defaultWaitTime = Duration.ofSeconds(5);

    private WebSocketUser user1;

    private WebSocketUser user2;

    private WebSocketUser user3;

    private int projectId1;

    private int projectId2;

    private int symbolGroupId1;

    private int symbolGroupId2;

    private int symbolGroupId3;

    private int symbolId1;

    private int symbolId2;

    private int symbolId3;

    private int symbolId4;

    private SymbolPresenceServiceWSMessages symbolPresenceServiceWSMessages;

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

        final var projectApi = new ProjectApi(client, port);
        final var symbolGroupApi = new SymbolGroupApi(client, port);
        final var symbolApi = new SymbolApi(client, port);

        symbolPresenceServiceWSMessages = new SymbolPresenceServiceWSMessages();

        final Response res1 = projectApi.create("{\"name\":\"project1\",\"url\":\"http://localhost:8080\"}", user1.getJwt());
        projectId1 = JsonPath.read(res1.readEntity(String.class), "$.id");

        projectApi.addMembers(Integer.toUnsignedLong(projectId1), Collections.singletonList(user2.getUserId()), user1.getJwt());

        final Response res2 = projectApi.create("{\"name\":\"project2\",\"url\":\"http://localhost:8080\"}", user2.getJwt());
        projectId2 = JsonPath.read(res2.readEntity(String.class), "$.id");

        final Response res3 = symbolGroupApi.create(projectId1, "{\"name\":\"group1\", \"project\": " + projectId1 + "}", user1.getJwt());
        symbolGroupId1 = JsonPath.read(res3.readEntity(String.class), "id");

        final Response res4 = symbolGroupApi.create(projectId1, "{\"name\":\"group2\", \"project\": " + projectId1 + ", \"parent\": " + symbolGroupId1 + "}", user1.getJwt());
        symbolGroupId2 = JsonPath.read(res4.readEntity(String.class), "id");

        final Response res5 = symbolGroupApi.create(projectId2, "{\"name\":\"group3\", \"project\": " + projectId2 + "}", user2.getJwt());
        symbolGroupId3 = JsonPath.read(res5.readEntity(String.class), "id");

        final Response res6 = symbolApi.create(projectId1, "{\"name\":\"symbol1\", \"project\": " + projectId1 + ", \"group\": " + symbolGroupId1 + "}", user1.getJwt());
        symbolId1 = JsonPath.read(res6.readEntity(String.class), "id");

        final Response res7 = symbolApi.create(projectId1, "{\"name\":\"symbol2\", \"project\": " + projectId1 + ", \"group\": " + symbolGroupId1 + "}", user1.getJwt());
        symbolId2 = JsonPath.read(res7.readEntity(String.class), "id");

        final Response res8 = symbolApi.create(projectId1, "{\"name\":\"symbol3\", \"project\": " + projectId1 + ", \"group\": " + symbolGroupId2 + "}", user1.getJwt());
        symbolId3 = JsonPath.read(res8.readEntity(String.class), "id");

        final Response res9 = symbolApi.create(projectId2, "{\"name\":\"symbol4\", \"project\": " + projectId2 + ", \"group\": " + symbolGroupId3 + "}", user2.getJwt());
        symbolId4 = JsonPath.read(res9.readEntity(String.class), "id");
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
    public void shouldAddSymbolLock() throws Exception {
        user1.send("default", symbolPresenceServiceWSMessages.userEnteredSymbol(projectId1, symbolId1));
        final WebSocketMessage response = user1.getNextMessage("default");

        final var content = response.getContent();
        assertTrue(getLocks(content, projectId1, symbolGroupId1).contains("user1"));
        assertEquals("user1", getUsername(content, projectId1, symbolId1));
    }

    @Test
    public void shouldRemoveSymbolLock() throws Exception {
        user1.send("default", symbolPresenceServiceWSMessages.userEnteredSymbol(projectId1, symbolId1));
        WebSocketMessage response = user1.getNextMessage("default");

        assertTrue(getLocks(response.getContent(), projectId1, symbolGroupId1).contains("user1"));
        assertEquals("user1", getUsername(response.getContent(), projectId1, symbolId1));

        user1.send("default", symbolPresenceServiceWSMessages.userLeftSymbol(projectId1, symbolId1));
        response = user1.getNextMessage("default");

        assertEquals("{}", getSymbolsAsString(response.getContent(), projectId1));
        assertEquals("{}", getGroupsAsString(response.getContent(), projectId1));
    }

    @Test
    public void shouldAddSessionToExistingSymbolLock() throws Exception {
        user1.connectNewSession("otherSession");

        user1.send("default", symbolPresenceServiceWSMessages.userEnteredSymbol(projectId1, symbolId1));
        WebSocketMessage response = user1.getNextMessage("default");

        assertTrue(getLocks(response.getContent(), projectId1, symbolGroupId1).contains("user1"));
        assertEquals("user1", getUsername(response.getContent(), projectId1, symbolId1));

        Date oldTimestamp = new Date(getTimestamp(response.getContent(), projectId1, symbolId1));

        user1.send("otherSession", symbolPresenceServiceWSMessages.userEnteredSymbol(projectId1, symbolId1));
        response = user1.getNextMessage("default");

        assertTrue(getLocks(response.getContent(), projectId1, symbolGroupId1).contains("user1"));
        assertEquals("user1", getUsername(response.getContent(), projectId1, symbolId1));

        user1.send("default", symbolPresenceServiceWSMessages.userLeftSymbol(projectId1, symbolId1));
        response = user1.getNextMessage("default");

        assertTrue(getLocks(response.getContent(), projectId1, symbolGroupId1).contains("user1"));
        assertEquals("user1", getUsername(response.getContent(), projectId1, symbolId1));

        Date newTimestamp = new Date(getTimestamp(response.getContent(), projectId1, symbolId1));

        assertTrue(oldTimestamp.before(newTimestamp));
    }

    @Test
    public void shouldRemoveSessionFromSymbolLock() throws Exception {
        user1.connectNewSession("otherSession");

        user1.send("default", symbolPresenceServiceWSMessages.userEnteredSymbol(projectId1, symbolId1));
        WebSocketMessage response = user1.getNextMessage("default");

        assertTrue(getLocks(response.getContent(), projectId1, symbolGroupId1).contains("user1"));
        assertEquals("user1", getUsername(response.getContent(), projectId1, symbolId1));

        user1.send("otherSession", symbolPresenceServiceWSMessages.userEnteredSymbol(projectId1, symbolId1));
        response = user1.getNextMessage("default");

        assertTrue(getLocks(response.getContent(), projectId1, symbolGroupId1).contains("user1"));
        assertEquals("user1", getUsername(response.getContent(), projectId1, symbolId1));

        user1.send("default", symbolPresenceServiceWSMessages.userLeftSymbol(projectId1, symbolId1));
        response = user1.getNextMessage("default");

        assertTrue(getLocks(response.getContent(), projectId1, symbolGroupId1).contains("user1"));
        assertEquals("user1", getUsername(response.getContent(), projectId1, symbolId1));

        user1.send("otherSession", symbolPresenceServiceWSMessages.userLeftSymbol(projectId1, symbolId1));
        response = user1.getNextMessage("default");

        assertEquals("{}", getSymbolsAsString(response.getContent(), projectId1));
        assertEquals("{}", getGroupsAsString(response.getContent(), projectId1));
    }

    @Test
    public void shouldCorrectlyAssembleProjectStatus() throws Exception {
        user1.connectNewSession("otherSession");
        user2.connectNewSession("otherSession");

        user1.send("default", symbolPresenceServiceWSMessages.userEnteredSymbol(projectId1, symbolId1));
        user1.send("otherSession", symbolPresenceServiceWSMessages.userEnteredSymbol(projectId1, symbolId2));
        user2.send("default", symbolPresenceServiceWSMessages.userEnteredSymbol(projectId1, symbolId3));
        user2.send("otherSession", symbolPresenceServiceWSMessages.userEnteredSymbol(projectId2, symbolId4));

        final var sessions = List.of("default", "otherSession");
        Awaitility.await().atMost(defaultWaitTime).until(() ->
                user1.assertNumberOfMessages(sessions, List.of(3, 3))
                        && user2.assertNumberOfMessages(sessions, List.of(4, 4)));

        user1.clearMessagesInAllSessions();
        user2.clearMessagesInAllSessions();

        user2.send("default", symbolPresenceServiceWSMessages.requestStatus(Arrays.asList((long) projectId1, (long) projectId2)));
        final var content = user2.getNextMessage("default").getContent();

        assertTrue(getLocks(content, projectId1, symbolGroupId1).contains("user1"));
        assertTrue(getLocks(content, projectId1, symbolGroupId1).contains("user2"));
        assertTrue(getLocks(content, projectId1, symbolGroupId2).contains("user2"));
        assertFalse(getLocks(content, projectId1, symbolGroupId2).contains("user1"));
        assertTrue(getLocks(content, projectId2, symbolGroupId3).contains("user2"));
        assertFalse(getLocks(content, projectId2, symbolGroupId3).contains("user1"));

        assertEquals("user1", getUsername(content, projectId1, symbolId1));
        assertEquals("user1", getUsername(content, projectId1, symbolId2));
        assertEquals("user2", getUsername(content, projectId1, symbolId3));
        assertEquals("user2", getUsername(content, projectId2, symbolId4));
    }

    @Test
    public void shouldSupportMultipleUserSessions() throws Exception {
        user1.connectNewSession("otherSession");
        user2.connectNewSession("otherSession");

        user1.send("default", symbolPresenceServiceWSMessages.userEnteredSymbol(projectId1, symbolId1));
        user1.send("otherSession", symbolPresenceServiceWSMessages.userEnteredSymbol(projectId1, symbolId2));
        user2.send("default", symbolPresenceServiceWSMessages.userEnteredSymbol(projectId1, symbolId3));
        user2.send("otherSession", symbolPresenceServiceWSMessages.userEnteredSymbol(projectId2, symbolId4));

        final var sessions = List.of("default", "otherSession");
        Awaitility.await().atMost(defaultWaitTime).until(() ->
                user1.assertNumberOfMessages(sessions, List.of(3, 3))
                        && user2.assertNumberOfMessages(sessions, List.of(4, 4)));

        user1.send("default", symbolPresenceServiceWSMessages.userLeftSymbol(projectId1, symbolId1));
        user1.send("otherSession", symbolPresenceServiceWSMessages.userLeftSymbol(projectId1, symbolId2));
        user2.send("default", symbolPresenceServiceWSMessages.userLeftSymbol(projectId1, symbolId3));
        user2.send("otherSession", symbolPresenceServiceWSMessages.userLeftSymbol(projectId2, symbolId4));

        Awaitility.await().atMost(defaultWaitTime).until(() ->
                user1.assertNumberOfMessages(sessions, List.of(6, 6))
                        && user2.assertNumberOfMessages(sessions, List.of(8, 8)));

        user1.clearMessagesInAllSessions();
        user2.clearMessagesInAllSessions();

        user2.send("default", symbolPresenceServiceWSMessages.requestStatus(Arrays.asList((long) projectId1, (long) projectId2)));
        final WebSocketMessage response = user2.getNextMessage("default");

        assertEquals("{}", getGroupsAsString(response.getContent(), projectId1));
        assertEquals("{}", getSymbolsAsString(response.getContent(), projectId1));
        assertEquals("{}", JsonPath.read(response.getContent(), "$.['" + projectId2 + "'].groups").toString());
        assertEquals("{}", JsonPath.read(response.getContent(), "$.['" + projectId2 + "'].symbols").toString());
    }

    @Test
    public void shouldProcessSessionDisconnect() throws Exception {
        user2.send("default", symbolPresenceServiceWSMessages.userEnteredSymbol(projectId1, symbolId1));

        WebSocketMessage response = user1.getNextMessage("default");
        assertTrue(getLocks(response.getContent(), projectId1, symbolGroupId1).contains("user2"));
        assertEquals("user2", getUsername(response.getContent(), projectId1, symbolId1));

        user2.forceDisconnect("default");
        response = user1.getNextMessage("default");
        assertEquals("{}", getSymbolsAsString(response.getContent(), projectId1));
        assertEquals("{}", getGroupsAsString(response.getContent(), projectId1));
    }

    @Test
    public void shouldIgnoreDuplicateEnteredMessage() throws Exception {
        user1.send("default", symbolPresenceServiceWSMessages.userEnteredSymbol(projectId1, symbolId1));

        WebSocketMessage response = user1.getNextMessage("default");
        assertTrue(getLocks(response.getContent(), projectId1, symbolGroupId1).contains("user1"));
        assertEquals("user1", getUsername(response.getContent(), projectId1, symbolId1));

        user1.send("default", symbolPresenceServiceWSMessages.userEnteredSymbol(projectId1, symbolId1));
        response = user1.getNextMessage("default");
        assertNull(response);
    }

    @Test
    public void shouldIgnoreDuplicateLeftMessage() throws Exception {
        user1.send("default", symbolPresenceServiceWSMessages.userEnteredSymbol(projectId1, symbolId1));

        WebSocketMessage response = user1.getNextMessage("default");
        assertTrue(getLocks(response.getContent(), projectId1, symbolGroupId1).contains("user1"));
        assertEquals("user1", getUsername(response.getContent(), projectId1, symbolId1));

        user1.send("default", symbolPresenceServiceWSMessages.userLeftSymbol(projectId1, symbolId1));
        response = user1.getNextMessage("default");
        assertEquals("{}", getSymbolsAsString(response.getContent(), projectId1));
        assertEquals("{}", getGroupsAsString(response.getContent(), projectId1));

        user1.send("default", symbolPresenceServiceWSMessages.userLeftSymbol(projectId1, symbolId1));
        response = user1.getNextMessage("default");
        assertNull(response);
    }

    @Test
    public void shouldSwitchSymbolLock() throws Exception {
        user1.send("default", symbolPresenceServiceWSMessages.userEnteredSymbol(projectId1, symbolId1));

        WebSocketMessage response = user1.getNextMessage("default");
        assertTrue(getLocks(response.getContent(), projectId1, symbolGroupId1).contains("user1"));
        assertEquals("user1", getUsername(response.getContent(), projectId1, symbolId1));

        user1.send("default", symbolPresenceServiceWSMessages.userEnteredSymbol(projectId1, symbolId2));
        response = user1.getNextMessage("default");
        assertEquals("{}", getSymbolsAsString(response.getContent(), projectId1));
        assertEquals("{}", getGroupsAsString(response.getContent(), projectId1));

        response = user1.getNextMessage("default");
        assertTrue(getLocks(response.getContent(), projectId1, symbolGroupId1).contains("user1"));
        assertEquals("user1", getUsername(response.getContent(), projectId1, symbolId2));
    }

    @Test
    public void shouldBroadcastUpdatesCorrectly() throws Exception {
        user2.connectNewSession("otherSession");

        user1.send("default", symbolPresenceServiceWSMessages.userEnteredSymbol(projectId1, symbolId1));

        final var res1 = user1.getNextMessage("default");
        assertTrue(getLocks(res1.getContent(), projectId1, symbolGroupId1).contains("user1"));
        assertEquals("user1", getUsername(res1.getContent(), projectId1, symbolId1));

        final var res2 = user2.getNextMessage("default");
        assertTrue(getLocks(res2.getContent(), projectId1, symbolGroupId1).contains("user1"));
        assertEquals("user1", getUsername(res2.getContent(), projectId1, symbolId1));

        final var res3 = user2.getNextMessage("otherSession");
        assertTrue(getLocks(res3.getContent(), projectId1, symbolGroupId1).contains("user1"));
        assertEquals("user1", getUsername(res3.getContent(), projectId1, symbolId1));

        final var res4 = user3.getNextMessage("default");
        assertNull(res4);
    }

    @Test
    public void shouldNotSendProjectStatusToUnauthorizedUser() throws Exception {
        user3.send("default", symbolPresenceServiceWSMessages.requestStatus(Collections.singletonList((long) projectId1)));

        final var response = user3.getNextMessage("default");
        assertEquals("You are not allowed to access the project.", JsonPath.read(response.getContent(), "$.description"));
    }

    @Test
    public void shouldRejectMalformedContentInStatusRequestMessage() throws Exception {
        final WebSocketMessage badMessage = new WebSocketMessage();
        badMessage.setEntity(SymbolPresenceServiceEnum.SYMBOL_PRESENCE_SERVICE.name());
        badMessage.setType(SymbolPresenceServiceEnum.STATUS_REQUEST.name());
        badMessage.setContent("malformed content");
        user1.send("default", badMessage);

        final WebSocketMessage response = user1.getNextMessage("default");
        assertEquals("Received malformed content.", JsonPath.read(response.getContent(), "$.description"));
    }

    @Test
    public void shouldRejectMalformedContentInUserEnteredMessage() throws Exception {
        final WebSocketMessage badMessage = new WebSocketMessage();
        badMessage.setEntity(SymbolPresenceServiceEnum.SYMBOL_PRESENCE_SERVICE.name());
        badMessage.setType(SymbolPresenceServiceEnum.USER_ENTERED.name());
        badMessage.setContent("malformed content");
        user1.send("default", badMessage);

        final WebSocketMessage response = user1.getNextMessage("default");
        assertEquals("Received malformed content.", JsonPath.read(response.getContent(), "$.description"));
    }

    @Test
    public void shouldRejectMalformedContentInUserLeftMessage() throws Exception {
        final WebSocketMessage badMessage = new WebSocketMessage();
        badMessage.setEntity(SymbolPresenceServiceEnum.SYMBOL_PRESENCE_SERVICE.name());
        badMessage.setType(SymbolPresenceServiceEnum.USER_LEFT.name());
        badMessage.setContent("malformed content");
        user1.send("default", badMessage);

        final WebSocketMessage response = user1.getNextMessage("default");
        assertEquals("Received malformed content.", JsonPath.read(response.getContent(), "$.description"));
    }

    @Test
    public void shouldRejectStatusRequestWithNonExistentProject() throws Exception {
        user1.send("default", symbolPresenceServiceWSMessages.requestStatus(Collections.singletonList(-1L)));

        final WebSocketMessage response = user1.getNextMessage("default");
        assertEquals("Project with id -1 not found.", JsonPath.read(response.getContent(), "$.description"));
    }

    private List<String> getLocks(String content, int projectId, int symbolGroupId) {
        return JsonPath.read(content, "$.['" + projectId + "'].groups.['" + symbolGroupId + "'].locks");
    }

    private String getUsername(String content, int projectId, int symbolId) {
        return JsonPath.read(content, "$.['" + projectId + "'].symbols.['" + symbolId + "'].username");
    }

    private String getGroupsAsString(String content, int projectId) {
        return JsonPath.read(content, "$.['" + projectId + "'].groups").toString();
    }

    private String getSymbolsAsString(String content, int projectId) {
        return JsonPath.read(content, "$.['" + projectId + "'].symbols").toString();
    }

    private Long getTimestamp(String content, int projectId, int symbolId) {
        return JsonPath.read(content, "$.['" + projectId + "'].symbols.['" + symbolId + "'].timestamp");
    }
}
