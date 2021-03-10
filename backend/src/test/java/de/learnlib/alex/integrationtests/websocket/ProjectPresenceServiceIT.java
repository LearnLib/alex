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

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNull;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.jayway.jsonpath.JsonPath;
import de.learnlib.alex.integrationtests.resources.AbstractResourceIT;
import de.learnlib.alex.integrationtests.resources.api.ProjectApi;
import de.learnlib.alex.integrationtests.websocket.util.ProjectPresenceServiceWSMessages;
import de.learnlib.alex.integrationtests.websocket.util.WebSocketUser;
import de.learnlib.alex.websocket.entities.WebSocketMessage;
import de.learnlib.alex.websocket.services.enums.ProjectPresenceServiceEnum;
import java.io.IOException;
import java.net.URISyntaxException;
import java.util.Arrays;
import java.util.Collections;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.TimeoutException;
import javax.ws.rs.core.Response;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;

public class ProjectPresenceServiceIT extends AbstractResourceIT {

    private WebSocketUser user1;

    private WebSocketUser user2;

    private WebSocketUser user3;

    private long projectId1;

    private long projectId2;

    private ProjectApi projectApi;

    private ProjectPresenceServiceWSMessages projectPresenceServiceWSMessages;

    @Before
    public void pre() throws InterruptedException, ExecutionException, TimeoutException, URISyntaxException, IOException {
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

    @After
    @Override
    public void post() throws Exception {
        user1.forceDisconnectAll();
        user2.forceDisconnectAll();
        user3.forceDisconnectAll();

        super.post();
    }

    @Test
    public void shouldAddUserPresence() throws JsonProcessingException, InterruptedException {
        user1.send("default", projectPresenceServiceWSMessages.userEnteredProject(projectId1));
        WebSocketMessage response = user1.getNextMessage("default");
        JsonPath.read(response.getContent(), "$.['" + projectId1 + "'].userColors.user1");
    }

    @Test
    public void shouldRemoveUserPresence() throws JsonProcessingException, InterruptedException {
        user1.send("default", projectPresenceServiceWSMessages.userEnteredProject(projectId1));
        WebSocketMessage response = user1.getNextMessage("default");
        JsonPath.read(response.getContent(), "$.['" + projectId1 + "'].userColors.user1");

        user1.send("default", projectPresenceServiceWSMessages.userLeftProject(projectId1));
        response = user1.getNextMessage("default");
        assertEquals("{}", JsonPath.read(response.getContent(), "$.['" + projectId1 + "']").toString());
    }

    @Test
    public void shouldSupportMultipleUserSessions() throws InterruptedException, ExecutionException, TimeoutException, IOException, URISyntaxException {
        user1.connectNewSession("otherSession");

        user1.send("default", projectPresenceServiceWSMessages.userEnteredProject(projectId1));
        WebSocketMessage response = user1.getNextMessage("default");
        String color = JsonPath.read(response.getContent(), "$.['" + projectId1 + "'].userColors.user1");

        user1.send("otherSession", projectPresenceServiceWSMessages.userEnteredProject(projectId1));
        response = user1.getNextMessage("default");
        assertEquals(color, JsonPath.read(response.getContent(), "$.['" + projectId1 + "'].userColors.user1"));

        user1.send("default", projectPresenceServiceWSMessages.userLeftProject(projectId1));
        response = user1.getNextMessage("default");
        assertEquals(color, JsonPath.read(response.getContent(), "$.['" + projectId1 + "'].userColors.user1"));

        user1.send("otherSession", projectPresenceServiceWSMessages.userLeftProject(projectId1));
        response = user1.getNextMessage("default");
        assertEquals("{}", JsonPath.read(response.getContent(), "$.['" + projectId1 + "']").toString());
    }

    @Test
    public void shouldReuseMaximumContrastColorsFirst() throws JsonProcessingException, InterruptedException {
        projectApi.addMembers(projectId1, Collections.singletonList(user3.getUserId()), user1.getJwt());

        user1.send("default", projectPresenceServiceWSMessages.userEnteredProject(projectId1));
        WebSocketMessage response = user1.getNextMessage("default");
        String color1 = JsonPath.read(response.getContent(), "$.['" + projectId1 + "'].userColors.user1");

        user2.send("default", projectPresenceServiceWSMessages.userEnteredProject(projectId1));
        response = user1.getNextMessage("default");
        String color2 = JsonPath.read(response.getContent(), "$.['" + projectId1 + "'].userColors.user2");

        assertFalse(color2.equals(color1));

        user1.send("default", projectPresenceServiceWSMessages.userLeftProject(projectId1));
        response = user1.getNextMessage("default");

        user3.send("default", projectPresenceServiceWSMessages.userEnteredProject(projectId1));
        response = user1.getNextMessage("default");
        assertEquals(color1, JsonPath.read(response.getContent(), "$.['" + projectId1 + "'].userColors.user3"));
    }

    @Test
    public void shouldSwitchUserPresence() throws JsonProcessingException, InterruptedException {
        user2.send("default", projectPresenceServiceWSMessages.userEnteredProject(projectId1));
        WebSocketMessage response = user2.getNextMessage("default");
        JsonPath.read(response.getContent(), "$.['" + projectId1 + "'].userColors.user2");

        user2.send("default", projectPresenceServiceWSMessages.userEnteredProject((projectId2)));
        response = user2.getNextMessage("default");
        assertEquals("{}", JsonPath.read(response.getContent(), "$.['" + projectId1 + "']").toString());

        response = user2.getNextMessage("default");
        JsonPath.read(response.getContent(), "$.['" + projectId2 + "'].userColors.user2");
    }

    @Test
    public void shouldIgnoreDuplicateEnteredMessage() throws InterruptedException, JsonProcessingException {
        user1.send("default", projectPresenceServiceWSMessages.userEnteredProject(projectId1));
        WebSocketMessage response = user1.getNextMessage("default");
        JsonPath.read(response.getContent(), "$.['" + projectId1 + "'].userColors.user1");

        user1.send("default", projectPresenceServiceWSMessages.userEnteredProject(projectId1));
        response = user1.getNextMessage("default");
        assertNull(response);
    }

    @Test
    public void shouldIgnoreDuplicateLeftMessage() throws InterruptedException, JsonProcessingException {
        user1.send("default", projectPresenceServiceWSMessages.userEnteredProject(projectId1));
        WebSocketMessage response = user1.getNextMessage("default");
        JsonPath.read(response.getContent(), "$.['" + projectId1 + "'].userColors.user1");

        user1.send("default", projectPresenceServiceWSMessages.userLeftProject(projectId1));
        response = user1.getNextMessage("default");
        assertEquals("{}", JsonPath.read(response.getContent(), "$.['" + projectId1 + "']").toString());

        user1.send("default", projectPresenceServiceWSMessages.userLeftProject(projectId1));
        response = user1.getNextMessage("default");
        assertNull(response);
    }

    @Test
    public void shouldCorrectlyAssembleProjectStatus() throws Exception {
        user2.connectNewSession("otherSession");

        user1.send("default", projectPresenceServiceWSMessages.userEnteredProject(projectId1));
        user2.send("default", projectPresenceServiceWSMessages.userEnteredProject(projectId1));
        user2.send("otherSession", projectPresenceServiceWSMessages.userEnteredProject(projectId2));

        user2.clearMessages("default");

        user2.send("default", projectPresenceServiceWSMessages.requestStatus(Arrays.asList(projectId1, projectId2)));
        final WebSocketMessage response = user2.getNextMessage("default");
        JsonPath.read(response.getContent(), "$.['" + projectId1 + "'].userColors.user1");
        JsonPath.read(response.getContent(), "$.['" + projectId1 + "'].userColors.user2");
        JsonPath.read(response.getContent(), "$.['" + projectId2 + "'].userColors.user2");
    }

    @Test
    public void shouldProcessSessionDisconnect() throws Exception {
        user2.send("default", projectPresenceServiceWSMessages.userEnteredProject(projectId1));

        WebSocketMessage response = user1.getNextMessage("default");
        JsonPath.read(response.getContent(), "$.['" + projectId1 + "'].userColors.user2");

        user2.forceDisconnect("default");
        response = user1.getNextMessage("default");
        assertEquals("{}", JsonPath.read(response.getContent(), "$.['" + projectId1 + "']").toString());
    }

    @Test
    public void shouldBroadcastUpdatesCorrectly() throws Exception {
        user2.connectNewSession("otherSession");

        user1.send("default", projectPresenceServiceWSMessages.userEnteredProject(projectId1));

        WebSocketMessage response = user1.getNextMessage("default");
        JsonPath.read(response.getContent(), "$.['" + projectId1 + "'].userColors.user1");

        response = user2.getNextMessage("default");
        JsonPath.read(response.getContent(), "$.['" + projectId1 + "'].userColors.user1");

        response = user2.getNextMessage("otherSession");
        JsonPath.read(response.getContent(), "$.['" + projectId1 + "'].userColors.user1");

        response = user3.getNextMessage("default");
        assertNull(response);
    }

    @Test
    public void shouldNotSendProjectStatusToUnauthorizedUser() throws Exception {
        user3.send("default", projectPresenceServiceWSMessages.requestStatus(Collections.singletonList(projectId1)));

        final WebSocketMessage response = user3.getNextMessage("default");
        assertEquals("You are not allowed to access the project.", JsonPath.read(response.getContent(), "$.description"));
    }

    @Test
    public void shouldRejectMalformedContentInStatusRequestMessage() throws Exception {
        final WebSocketMessage badMessage = new WebSocketMessage();
        badMessage.setEntity(ProjectPresenceServiceEnum.PROJECT_PRESENCE_SERVICE.name());
        badMessage.setType(ProjectPresenceServiceEnum.STATUS_REQUEST.name());
        badMessage.setContent("malformed content");
        user1.send("default", badMessage);

        final WebSocketMessage response = user1.getNextMessage("default");
        assertEquals("Received malformed content.", JsonPath.read(response.getContent(), "$.description"));
    }

    @Test
    public void shouldRejectMalformedContentInUserEnteredMessage() throws Exception {
        final WebSocketMessage badMessage = new WebSocketMessage();
        badMessage.setEntity(ProjectPresenceServiceEnum.PROJECT_PRESENCE_SERVICE.name());
        badMessage.setType(ProjectPresenceServiceEnum.USER_ENTERED.name());
        badMessage.setContent("malformed content");
        user1.send("default", badMessage);

        final WebSocketMessage response = user1.getNextMessage("default");
        assertEquals("Received malformed content.", JsonPath.read(response.getContent(), "$.description"));
    }

    @Test
    public void shouldRejectMalformedContentInUserLeftMessage() throws Exception {
        final WebSocketMessage badMessage = new WebSocketMessage();
        badMessage.setEntity(ProjectPresenceServiceEnum.PROJECT_PRESENCE_SERVICE.name());
        badMessage.setType(ProjectPresenceServiceEnum.USER_LEFT.name());
        badMessage.setContent("malformed content");
        user1.send("default", badMessage);

        final WebSocketMessage response = user1.getNextMessage("default");
        assertEquals("Received malformed content.", JsonPath.read(response.getContent(), "$.description"));
    }

    @Test
    public void shouldRejectStatusRequestWithNonExistentProject() throws Exception {
        user1.send("default", projectPresenceServiceWSMessages.requestStatus(Collections.singletonList(-1L)));

        final WebSocketMessage response = user1.getNextMessage("default");
        assertEquals("Project with id -1 not found.", JsonPath.read(response.getContent(), "$.description"));
    }
}
