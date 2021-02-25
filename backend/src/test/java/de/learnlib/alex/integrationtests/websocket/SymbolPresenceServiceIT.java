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

import com.jayway.jsonpath.JsonPath;
import de.learnlib.alex.integrationtests.resources.AbstractResourceIT;
import de.learnlib.alex.integrationtests.resources.api.ProjectApi;
import de.learnlib.alex.integrationtests.resources.api.SymbolApi;
import de.learnlib.alex.integrationtests.resources.api.SymbolGroupApi;
import de.learnlib.alex.integrationtests.websocket.util.SymbolPresenceServiceWSMessages;
import de.learnlib.alex.integrationtests.websocket.util.WebSocketUser;
import de.learnlib.alex.websocket.entities.WebSocketMessage;
import de.learnlib.alex.websocket.services.enums.SymbolPresenceServiceEnum;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;

import javax.ws.rs.core.Response;
import java.util.Arrays;
import java.util.Collections;
import java.util.Date;
import java.util.List;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNull;
import static org.junit.Assert.assertTrue;

public class SymbolPresenceServiceIT extends AbstractResourceIT {

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

    @Before
    public void pre() throws Exception {
        user1 = new WebSocketUser("user1", client, port);
        user2 = new WebSocketUser("user2", client, port);
        user3 = new WebSocketUser("user3", client, port);

        ProjectApi projectApi = new ProjectApi(client, port);
        SymbolGroupApi symbolGroupApi = new SymbolGroupApi(client, port);
        SymbolApi symbolApi = new SymbolApi(client, port);

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

    @After
    @Override
    public void post() throws Exception {
        user1.forceDisconnectAll();
        user2.forceDisconnectAll();
        user3.forceDisconnectAll();

        super.post();
    }

    @Test
    public void shouldAddSymbolLock() throws Exception {
        user1.send("default", symbolPresenceServiceWSMessages.userEnteredSymbol(projectId1, symbolId1));
        final WebSocketMessage response = user1.getNextMessage("default");

        assertTrue(((List) JsonPath.read(response.getContent(), "$.['" + projectId1 + "'].groups.['" + symbolGroupId1 + "'].locks")).contains("user1"));
        assertEquals("user1", JsonPath.read(response.getContent(), "$.['" + projectId1 + "'].symbols.['" + symbolId1 + "'].username"));
    }

    @Test
    public void shouldRemoveSymbolLock() throws Exception {
        user1.send("default", symbolPresenceServiceWSMessages.userEnteredSymbol(projectId1, symbolId1));
        WebSocketMessage response = user1.getNextMessage("default");

        assertTrue(((List) JsonPath.read(response.getContent(), "$.['" + projectId1 + "'].groups.['" + symbolGroupId1 + "'].locks")).contains("user1"));
        assertEquals("user1", JsonPath.read(response.getContent(), "$.['" + projectId1 + "'].symbols.['" + symbolId1 + "'].username"));

        user1.send("default", symbolPresenceServiceWSMessages.userLeftSymbol(projectId1, symbolId1));
        response = user1.getNextMessage("default");

        assertEquals("{}", JsonPath.read(response.getContent(), "$.['" + projectId1 + "'].symbols").toString());
        assertEquals("{}", JsonPath.read(response.getContent(), "$.['" + projectId1 + "'].groups").toString());
    }

    @Test
    public void shouldAddSessionToExistingSymbolLock() throws Exception {
        user1.connectNewSession("otherSession");

        user1.send("default", symbolPresenceServiceWSMessages.userEnteredSymbol(projectId1, symbolId1));
        WebSocketMessage response = user1.getNextMessage("default");

        assertTrue(((List) JsonPath.read(response.getContent(), "$.['" + projectId1 + "'].groups.['" + symbolGroupId1 + "'].locks")).contains("user1"));
        assertEquals("user1", JsonPath.read(response.getContent(), "$.['" + projectId1 + "'].symbols.['" + symbolId1 + "'].username"));

        Date oldTimestamp = new Date((long) JsonPath.read(response.getContent(), "$.['" + projectId1 + "'].symbols.['" + symbolId1 + "'].timestamp"));

        user1.send("otherSession", symbolPresenceServiceWSMessages.userEnteredSymbol(projectId1, symbolId1));
        response = user1.getNextMessage("default");

        assertTrue(((List) JsonPath.read(response.getContent(), "$.['" + projectId1 + "'].groups.['" + symbolGroupId1 + "'].locks")).contains("user1"));
        assertEquals("user1", JsonPath.read(response.getContent(), "$.['" + projectId1 + "'].symbols.['" + symbolId1 + "'].username"));

        user1.send("default", symbolPresenceServiceWSMessages.userLeftSymbol(projectId1, symbolId1));
        response = user1.getNextMessage("default");

        assertTrue(((List) JsonPath.read(response.getContent(), "$.['" + projectId1 + "'].groups.['" + symbolGroupId1 + "'].locks")).contains("user1"));
        assertEquals("user1", JsonPath.read(response.getContent(), "$.['" + projectId1 + "'].symbols.['" + symbolId1 + "'].username"));

        Date newTimestamp = new Date((long) JsonPath.read(response.getContent(), "$.['" + projectId1 + "'].symbols.['" + symbolId1 + "'].timestamp"));

        assertTrue(oldTimestamp.before(newTimestamp));
    }

    @Test
    public void shouldRemoveSessionFromSymbolLock() throws Exception {
        user1.connectNewSession("otherSession");

        user1.send("default", symbolPresenceServiceWSMessages.userEnteredSymbol(projectId1, symbolId1));
        WebSocketMessage response = user1.getNextMessage("default");

        assertTrue(((List) JsonPath.read(response.getContent(), "$.['" + projectId1 + "'].groups.['" + symbolGroupId1 + "'].locks")).contains("user1"));
        assertEquals("user1", JsonPath.read(response.getContent(), "$.['" + projectId1 + "'].symbols.['" + symbolId1 + "'].username"));

        user1.send("otherSession", symbolPresenceServiceWSMessages.userEnteredSymbol(projectId1, symbolId1));
        response = user1.getNextMessage("default");

        assertTrue(((List) JsonPath.read(response.getContent(), "$.['" + projectId1 + "'].groups.['" + symbolGroupId1 + "'].locks")).contains("user1"));
        assertEquals("user1", JsonPath.read(response.getContent(), "$.['" + projectId1 + "'].symbols.['" + symbolId1 + "'].username"));

        user1.send("default", symbolPresenceServiceWSMessages.userLeftSymbol(projectId1, symbolId1));
        response = user1.getNextMessage("default");

        assertTrue(((List) JsonPath.read(response.getContent(), "$.['" + projectId1 + "'].groups.['" + symbolGroupId1 + "'].locks")).contains("user1"));
        assertEquals("user1", JsonPath.read(response.getContent(), "$.['" + projectId1 + "'].symbols.['" + symbolId1 + "'].username"));

        user1.send("otherSession", symbolPresenceServiceWSMessages.userLeftSymbol(projectId1, symbolId1));
        response = user1.getNextMessage("default");

        assertEquals("{}", JsonPath.read(response.getContent(), "$.['" + projectId1 + "'].symbols").toString());
        assertEquals("{}", JsonPath.read(response.getContent(), "$.['" + projectId1 + "'].groups").toString());
    }

    @Test
    public void shouldCorrectlyAssembleProjectStatus() throws Exception {
        user1.connectNewSession("otherSession");
        user2.connectNewSession("otherSession");

        user1.send("default", symbolPresenceServiceWSMessages.userEnteredSymbol(projectId1, symbolId1));
        user1.send("otherSession", symbolPresenceServiceWSMessages.userEnteredSymbol(projectId1, symbolId2));
        user2.send("default", symbolPresenceServiceWSMessages.userEnteredSymbol(projectId1, symbolId3));
        user2.send("otherSession", symbolPresenceServiceWSMessages.userEnteredSymbol(projectId2, symbolId4));

        user2.clearMessages("default");

        user2.send("default", symbolPresenceServiceWSMessages.requestStatus(Arrays.asList((long) projectId1, (long) projectId2)));
        final WebSocketMessage response = user2.getNextMessage("default");

        assertTrue(((List) JsonPath.read(response.getContent(), "$.['" + projectId1 + "'].groups.['" + symbolGroupId1 + "'].locks")).contains("user1"));
        assertTrue(((List) JsonPath.read(response.getContent(), "$.['" + projectId1 + "'].groups.['" + symbolGroupId1 + "'].locks")).contains("user2"));
        assertTrue(((List) JsonPath.read(response.getContent(), "$.['" + projectId1 + "'].groups.['" + symbolGroupId2 + "'].locks")).contains("user2"));
        assertFalse(((List) JsonPath.read(response.getContent(), "$.['" + projectId1 + "'].groups.['" + symbolGroupId2 + "'].locks")).contains("user1"));
        assertTrue(((List) JsonPath.read(response.getContent(), "$.['" + projectId2 + "'].groups.['" + symbolGroupId3 + "'].locks")).contains("user2"));
        assertFalse(((List) JsonPath.read(response.getContent(), "$.['" + projectId2 + "'].groups.['" + symbolGroupId3 + "'].locks")).contains("user1"));

        assertEquals("user1", JsonPath.read(response.getContent(), "$.['" + projectId1 + "'].symbols.['" + symbolId1 + "'].username"));
        assertEquals("user1", JsonPath.read(response.getContent(), "$.['" + projectId1 + "'].symbols.['" + symbolId2 + "'].username"));
        assertEquals("user2", JsonPath.read(response.getContent(), "$.['" + projectId1 + "'].symbols.['" + symbolId3 + "'].username"));
        assertEquals("user2", JsonPath.read(response.getContent(), "$.['" + projectId2 + "'].symbols.['" + symbolId4 + "'].username"));
    }

    @Test
    public void shouldSupportMultipleUserSessions() throws Exception {
        user1.connectNewSession("otherSession");
        user2.connectNewSession("otherSession");

        user1.send("default", symbolPresenceServiceWSMessages.userEnteredSymbol(projectId1, symbolId1));
        user1.send("otherSession", symbolPresenceServiceWSMessages.userEnteredSymbol(projectId1, symbolId2));
        user2.send("default", symbolPresenceServiceWSMessages.userEnteredSymbol(projectId1, symbolId3));
        user2.send("otherSession", symbolPresenceServiceWSMessages.userEnteredSymbol(projectId2, symbolId4));

        user1.send("default", symbolPresenceServiceWSMessages.userLeftSymbol(projectId1, symbolId1));
        user1.send("otherSession", symbolPresenceServiceWSMessages.userLeftSymbol(projectId1, symbolId2));
        user2.send("default", symbolPresenceServiceWSMessages.userLeftSymbol(projectId1, symbolId3));
        user2.send("otherSession", symbolPresenceServiceWSMessages.userLeftSymbol(projectId2, symbolId4));

        user2.clearMessages("default");
        user2.send("default", symbolPresenceServiceWSMessages.requestStatus(Arrays.asList((long) projectId1, (long) projectId2)));
        final WebSocketMessage response = user2.getNextMessage("default");

        assertEquals("{}", JsonPath.read(response.getContent(), "$.['" + projectId1 + "'].groups").toString());
        assertEquals("{}", JsonPath.read(response.getContent(), "$.['" + projectId1 + "'].symbols").toString());
        assertEquals("{}", JsonPath.read(response.getContent(), "$.['" + projectId2 + "'].groups").toString());
        assertEquals("{}", JsonPath.read(response.getContent(), "$.['" + projectId2 + "'].symbols").toString());
    }

    @Test
    public void shouldProcessSessionDisconnect() throws Exception {
        user2.send("default", symbolPresenceServiceWSMessages.userEnteredSymbol(projectId1, symbolId1));

        WebSocketMessage response = user1.getNextMessage("default");
        assertTrue(((List) JsonPath.read(response.getContent(), "$.['" + projectId1 + "'].groups.['" + symbolGroupId1 + "'].locks")).contains("user2"));
        assertEquals("user2", JsonPath.read(response.getContent(), "$.['" + projectId1 + "'].symbols.['" + symbolId1 + "'].username"));

        user2.forceDisconnect("default");
        response = user1.getNextMessage("default");
        assertEquals("{}", JsonPath.read(response.getContent(), "$.['" + projectId1 + "'].symbols").toString());
        assertEquals("{}", JsonPath.read(response.getContent(), "$.['" + projectId1 + "'].groups").toString());
    }

    @Test
    public void shouldIgnoreDuplicateEnteredMessage() throws Exception {
        user1.send("default", symbolPresenceServiceWSMessages.userEnteredSymbol(projectId1, symbolId1));

        WebSocketMessage response = user1.getNextMessage("default");
        assertTrue(((List) JsonPath.read(response.getContent(), "$.['" + projectId1 + "'].groups.['" + symbolGroupId1 + "'].locks")).contains("user1"));
        assertEquals("user1", JsonPath.read(response.getContent(), "$.['" + projectId1 + "'].symbols.['" + symbolId1 + "'].username"));

        user1.send("default", symbolPresenceServiceWSMessages.userEnteredSymbol(projectId1, symbolId1));
        response = user1.getNextMessage("default");
        assertNull(response);
    }

    @Test
    public void shouldIgnoreDuplicateLeftMessage() throws Exception {
        user1.send("default", symbolPresenceServiceWSMessages.userEnteredSymbol(projectId1, symbolId1));

        WebSocketMessage response = user1.getNextMessage("default");
        assertTrue(((List) JsonPath.read(response.getContent(), "$.['" + projectId1 + "'].groups.['" + symbolGroupId1 + "'].locks")).contains("user1"));
        assertEquals("user1", JsonPath.read(response.getContent(), "$.['" + projectId1 + "'].symbols.['" + symbolId1 + "'].username"));

        user1.send("default", symbolPresenceServiceWSMessages.userLeftSymbol(projectId1, symbolId1));
        response = user1.getNextMessage("default");
        assertEquals("{}", JsonPath.read(response.getContent(), "$.['" + projectId1 + "'].symbols").toString());
        assertEquals("{}", JsonPath.read(response.getContent(), "$.['" + projectId1 + "'].groups").toString());

        user1.send("default", symbolPresenceServiceWSMessages.userLeftSymbol(projectId1, symbolId1));
        response = user1.getNextMessage("default");
        assertNull(response);
    }

    @Test
    public void shouldSwitchSymbolLock() throws Exception {
        user1.send("default", symbolPresenceServiceWSMessages.userEnteredSymbol(projectId1, symbolId1));

        WebSocketMessage response = user1.getNextMessage("default");
        assertTrue(((List) JsonPath.read(response.getContent(), "$.['" + projectId1 + "'].groups.['" + symbolGroupId1 + "'].locks")).contains("user1"));
        assertEquals("user1", JsonPath.read(response.getContent(), "$.['" + projectId1 + "'].symbols.['" + symbolId1 + "'].username"));

        user1.send("default", symbolPresenceServiceWSMessages.userEnteredSymbol(projectId1, symbolId2));
        response = user1.getNextMessage("default");
        assertEquals("{}", JsonPath.read(response.getContent(), "$.['" + projectId1 + "'].symbols").toString());
        assertEquals("{}", JsonPath.read(response.getContent(), "$.['" + projectId1 + "'].groups").toString());

        response = user1.getNextMessage("default");
        assertTrue(((List) JsonPath.read(response.getContent(), "$.['" + projectId1 + "'].groups.['" + symbolGroupId1 + "'].locks")).contains("user1"));
        assertEquals("user1", JsonPath.read(response.getContent(), "$.['" + projectId1 + "'].symbols.['" + symbolId2 + "'].username"));
    }

    @Test
    public void shouldBroadcastUpdatesCorrectly() throws Exception {
        user2.connectNewSession("otherSession");

        user1.send("default", symbolPresenceServiceWSMessages.userEnteredSymbol(projectId1, symbolId1));

        WebSocketMessage response = user1.getNextMessage("default");
        assertTrue(((List) JsonPath.read(response.getContent(), "$.['" + projectId1 + "'].groups.['" + symbolGroupId1 + "'].locks")).contains("user1"));
        assertEquals("user1", JsonPath.read(response.getContent(), "$.['" + projectId1 + "'].symbols.['" + symbolId1 + "'].username"));

        response = user2.getNextMessage("default");
        assertTrue(((List) JsonPath.read(response.getContent(), "$.['" + projectId1 + "'].groups.['" + symbolGroupId1 + "'].locks")).contains("user1"));
        assertEquals("user1", JsonPath.read(response.getContent(), "$.['" + projectId1 + "'].symbols.['" + symbolId1 + "'].username"));

        response = user2.getNextMessage("otherSession");
        assertTrue(((List) JsonPath.read(response.getContent(), "$.['" + projectId1 + "'].groups.['" + symbolGroupId1 + "'].locks")).contains("user1"));
        assertEquals("user1", JsonPath.read(response.getContent(), "$.['" + projectId1 + "'].symbols.['" + symbolId1 + "'].username"));

        response = user3.getNextMessage("default");
        assertNull(response);
    }

    @Test
    public void shouldNotSendProjectStatusToUnauthorizedUser() throws Exception {
        user3.send("default", symbolPresenceServiceWSMessages.requestStatus(Collections.singletonList((long) projectId1)));

        final WebSocketMessage response = user3.getNextMessage("default");
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
}
