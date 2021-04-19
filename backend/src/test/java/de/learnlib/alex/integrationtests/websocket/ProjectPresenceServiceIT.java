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

package de.learnlib.alex.integrationtests.websocket;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertNull;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.jayway.jsonpath.JsonPath;
import de.learnlib.alex.integrationtests.resources.AbstractResourceIT;
import de.learnlib.alex.integrationtests.resources.api.ProjectApi;
import de.learnlib.alex.integrationtests.websocket.util.ProjectPresenceServiceWSMessages;
import de.learnlib.alex.integrationtests.websocket.util.WebSocketUser;
import de.learnlib.alex.websocket.entities.WebSocketMessage;
import de.learnlib.alex.websocket.services.enums.ProjectPresenceServiceEnum;
import java.time.Duration;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import javax.ws.rs.core.Response;
import org.awaitility.Awaitility;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

public class ProjectPresenceServiceIT extends AbstractResourceIT {

    private WebSocketUser user1;

    private WebSocketUser user2;

    private WebSocketUser user3;

    private long projectId1;

    private long projectId2;

    private ProjectApi projectApi;

    private ProjectPresenceServiceWSMessages projectPresenceServiceWSMessages;

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

        projectApi = new ProjectApi(client, port);
        projectPresenceServiceWSMessages = new ProjectPresenceServiceWSMessages();

        final Response res1 = projectApi.create("{\"name\":\"project1\",\"url\":\"http://localhost:8080\"}", user1.getJwt());
        projectId1 = Integer.toUnsignedLong(JsonPath.read(res1.readEntity(String.class), "$.id"));
        projectApi.addMembers(projectId1, Collections.singletonList(user2.getUserId()), user1.getJwt());

        final Response res2 = projectApi.create("{\"name\":\"project2\",\"url\":\"http://localhost:8080\"}", user2.getJwt());
        projectId2 = Integer.toUnsignedLong(JsonPath.read(res2.readEntity(String.class), "$.id"));
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
    public void shouldAddUserPresence() throws JsonProcessingException, InterruptedException {
        user1.send("default", projectPresenceServiceWSMessages.userEnteredProject(projectId1));
        final var response = user1.getNextMessage("default");
        JsonPath.read(response.getContent(), "$.['" + projectId1 + "'].userColors.user1");
    }

    @Test
    public void shouldRemoveUserPresence() throws JsonProcessingException, InterruptedException {
        user1.send("default", projectPresenceServiceWSMessages.userEnteredProject(projectId1));
        final var res1 = user1.getNextMessage("default");
        JsonPath.read(res1.getContent(), "$.['" + projectId1 + "'].userColors.user1");

        user1.send("default", projectPresenceServiceWSMessages.userLeftProject(projectId1));
        final var res2 = user1.getNextMessage("default");
        assertEquals("{}", JsonPath.read(res2.getContent(), "$.['" + projectId1 + "']").toString());
    }

    @Test
    public void shouldSupportMultipleUserSessions() throws Exception {
        user1.connectNewSession("otherSession");

        user1.send("default", projectPresenceServiceWSMessages.userEnteredProject(projectId1));
        final var res1 = user1.getNextMessage("default");
        final var color = JsonPath.read(res1.getContent(), "$.['" + projectId1 + "'].userColors.user1");

        user1.send("otherSession", projectPresenceServiceWSMessages.userEnteredProject(projectId1));
        final var res2 = user1.getNextMessage("default");
        assertEquals(color, JsonPath.read(res2.getContent(), "$.['" + projectId1 + "'].userColors.user1"));

        user1.send("default", projectPresenceServiceWSMessages.userLeftProject(projectId1));
        final var res3 = user1.getNextMessage("default");
        assertEquals(color, JsonPath.read(res3.getContent(), "$.['" + projectId1 + "'].userColors.user1"));

        user1.send("otherSession", projectPresenceServiceWSMessages.userLeftProject(projectId1));
        final var res4 = user1.getNextMessage("default");
        assertEquals("{}", JsonPath.read(res4.getContent(), "$.['" + projectId1 + "']").toString());
    }

    @Test
    public void shouldReuseMaximumContrastColorsFirst() throws JsonProcessingException, InterruptedException {
        projectApi.addMembers(projectId1, Collections.singletonList(user3.getUserId()), user1.getJwt());

        user1.send("default", projectPresenceServiceWSMessages.userEnteredProject(projectId1));
        final var res1 = user1.getNextMessage("default");
        final var color1 = JsonPath.read(res1.getContent(), "$.['" + projectId1 + "'].userColors.user1");

        user2.send("default", projectPresenceServiceWSMessages.userEnteredProject(projectId1));
        final var res2 = user1.getNextMessage("default");
        final var color2 = JsonPath.read(res2.getContent(), "$.['" + projectId1 + "'].userColors.user2");
        assertNotEquals(color2, color1);

        user1.send("default", projectPresenceServiceWSMessages.userLeftProject(projectId1));
        user1.getNextMessage("default");

        user3.send("default", projectPresenceServiceWSMessages.userEnteredProject(projectId1));
        final var res3 = user1.getNextMessage("default");
        assertEquals(color1, JsonPath.read(res3.getContent(), "$.['" + projectId1 + "'].userColors.user3"));
    }

    @Test
    public void shouldSwitchUserPresence() throws JsonProcessingException, InterruptedException {
        user2.send("default", projectPresenceServiceWSMessages.userEnteredProject(projectId1));
        final var res1 = user2.getNextMessage("default");
        JsonPath.read(res1.getContent(), "$.['" + projectId1 + "'].userColors.user2");

        user2.send("default", projectPresenceServiceWSMessages.userEnteredProject((projectId2)));
        final var res2 = user2.getNextMessage("default");
        assertEquals("{}", JsonPath.read(res2.getContent(), "$.['" + projectId1 + "']").toString());

        final var res3 = user2.getNextMessage("default");
        JsonPath.read(res3.getContent(), "$.['" + projectId2 + "'].userColors.user2");
    }

    @Test
    public void shouldIgnoreDuplicateEnteredMessage() throws InterruptedException, JsonProcessingException {
        user1.send("default", projectPresenceServiceWSMessages.userEnteredProject(projectId1));
        final var res1 = user1.getNextMessage("default");
        JsonPath.read(res1.getContent(), "$.['" + projectId1 + "'].userColors.user1");

        user1.send("default", projectPresenceServiceWSMessages.userEnteredProject(projectId1));
        final var res2 = user1.getNextMessage("default");
        assertNull(res2);
    }

    @Test
    public void shouldIgnoreDuplicateLeftMessage() throws InterruptedException, JsonProcessingException {
        user1.send("default", projectPresenceServiceWSMessages.userEnteredProject(projectId1));
        final var res1 = user1.getNextMessage("default");
        JsonPath.read(res1.getContent(), "$.['" + projectId1 + "'].userColors.user1");

        user1.send("default", projectPresenceServiceWSMessages.userLeftProject(projectId1));
        final var res2 = user1.getNextMessage("default");
        assertEquals("{}", JsonPath.read(res2.getContent(), "$.['" + projectId1 + "']").toString());

        user1.send("default", projectPresenceServiceWSMessages.userLeftProject(projectId1));
        final var res3 = user1.getNextMessage("default");
        assertNull(res3);
    }

    @Test
    public void shouldCorrectlyAssembleProjectStatus() throws Exception {
        user1.connectNewSession("otherSession");
        user2.connectNewSession("otherSession");

        user1.send("default", projectPresenceServiceWSMessages.userEnteredProject(projectId1));
        user2.send("default", projectPresenceServiceWSMessages.userEnteredProject(projectId1));
        user2.send("otherSession", projectPresenceServiceWSMessages.userEnteredProject(projectId2));

        final var sessions = List.of("default", "otherSession");
        Awaitility.await().atMost(Duration.ofSeconds(5)).until(() ->
                user1.assertNumberOfMessages(sessions, List.of(2, 2))
                        && user2.assertNumberOfMessages(sessions, List.of(3, 3)));

        user1.clearMessagesInAllSessions();
        user2.clearMessagesInAllSessions();

        user2.send("default", projectPresenceServiceWSMessages.requestStatus(Arrays.asList(projectId1, projectId2)));
        final var response = user2.getNextMessage("default");

        JsonPath.read(response.getContent(), "$.['" + projectId1 + "'].userColors.user1");
        JsonPath.read(response.getContent(), "$.['" + projectId1 + "'].userColors.user2");
        JsonPath.read(response.getContent(), "$.['" + projectId2 + "'].userColors.user2");
    }

    @Test
    public void shouldProcessSessionDisconnect() throws Exception {
        user2.send("default", projectPresenceServiceWSMessages.userEnteredProject(projectId1));
        final var res1 = user1.getNextMessage("default");
        JsonPath.read(res1.getContent(), "$.['" + projectId1 + "'].userColors.user2");

        user2.forceDisconnect("default");
        final var res2 = user1.getNextMessage("default");
        assertEquals("{}", JsonPath.read(res2.getContent(), "$.['" + projectId1 + "']").toString());
    }

    @Test
    public void shouldBroadcastUpdatesCorrectly() throws Exception {
        user2.connectNewSession("otherSession");

        user1.send("default", projectPresenceServiceWSMessages.userEnteredProject(projectId1));

        final var res1 = user1.getNextMessage("default");
        JsonPath.read(res1.getContent(), "$.['" + projectId1 + "'].userColors.user1");

        final var res2 = user2.getNextMessage("default");
        JsonPath.read(res2.getContent(), "$.['" + projectId1 + "'].userColors.user1");

        final var res3 = user2.getNextMessage("otherSession");
        JsonPath.read(res3.getContent(), "$.['" + projectId1 + "'].userColors.user1");

        final var res4 = user3.getNextMessage("default");
        assertNull(res4);
    }

    @Test
    public void shouldNotSendProjectStatusToUnauthorizedUser() throws Exception {
        user3.send("default", projectPresenceServiceWSMessages.requestStatus(Collections.singletonList(projectId1)));

        final var response = user3.getNextMessage("default");
        assertEquals("You are not allowed to access the project.", getDescription(response.getContent()));
    }

    @Test
    public void shouldRejectMalformedContentInStatusRequestMessage() throws Exception {
        final var badMessage = new WebSocketMessage();
        badMessage.setEntity(ProjectPresenceServiceEnum.PROJECT_PRESENCE_SERVICE.name());
        badMessage.setType(ProjectPresenceServiceEnum.STATUS_REQUEST.name());
        badMessage.setContent("malformed content");
        user1.send("default", badMessage);

        final var response = user1.getNextMessage("default");
        assertEquals("Received malformed content.", getDescription(response.getContent()));
    }

    @Test
    public void shouldRejectMalformedContentInUserEnteredMessage() throws Exception {
        final var badMessage = new WebSocketMessage();
        badMessage.setEntity(ProjectPresenceServiceEnum.PROJECT_PRESENCE_SERVICE.name());
        badMessage.setType(ProjectPresenceServiceEnum.USER_ENTERED.name());
        badMessage.setContent("malformed content");
        user1.send("default", badMessage);

        final var response = user1.getNextMessage("default");
        assertEquals("Received malformed content.", getDescription(response.getContent()));
    }

    @Test
    public void shouldRejectMalformedContentInUserLeftMessage() throws Exception {
        final var badMessage = new WebSocketMessage();
        badMessage.setEntity(ProjectPresenceServiceEnum.PROJECT_PRESENCE_SERVICE.name());
        badMessage.setType(ProjectPresenceServiceEnum.USER_LEFT.name());
        badMessage.setContent("malformed content");
        user1.send("default", badMessage);

        final var response = user1.getNextMessage("default");
        assertEquals("Received malformed content.", getDescription(response.getContent()));
    }

    @Test
    public void shouldRejectStatusRequestWithNonExistentProject() throws Exception {
        user1.send("default", projectPresenceServiceWSMessages.requestStatus(Collections.singletonList(-1L)));

        final var response = user1.getNextMessage("default");
        assertEquals("Project with id -1 not found.", getDescription(response.getContent()));
    }

    private String getDescription(String content) {
        return JsonPath.read(content, "$.description");
    }
}
