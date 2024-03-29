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
import static org.junit.jupiter.api.Assertions.assertTrue;

import com.jayway.jsonpath.JsonPath;
import de.learnlib.alex.integrationtests.resources.AbstractResourceIT;
import de.learnlib.alex.integrationtests.websocket.util.WebSocketUser;
import de.learnlib.alex.websocket.entities.WebSocketMessage;
import de.learnlib.alex.websocket.services.enums.WebSocketServiceEnum;
import java.util.List;
import javax.ws.rs.client.Entity;
import javax.ws.rs.core.HttpHeaders;
import javax.ws.rs.core.MediaType;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

public class WebSocketServiceIT extends AbstractResourceIT {

    private WebSocketUser user1;

    private WebSocketUser user2;

    @BeforeEach
    public void pre() throws Exception {
        user1 = new WebSocketUser("user1", client, port);
        user2 = new WebSocketUser("user2", client, port);
    }

    @AfterEach
    @Override
    public void post() throws Exception {
        List.of(user1, user2).forEach(u -> {
            u.clearMessagesInAllSessions();
            u.forceDisconnectAll();
        });

        super.post();
    }

    @Test
    public void shouldRejectNullEntity() throws Exception {
        final var badMessage = new WebSocketMessage();
        badMessage.setType("SOME_TYPE");
        badMessage.setContent("SOME_CONTENT");

        user1.send("default", badMessage);
        final var response = user1.getNextMessage("default");
        assertEquals("Received malformed WebSocketMessage.", getDescription(response.getContent()));
    }

    @Test
    public void shouldRejectNullType() throws Exception {
        final var badMessage = new WebSocketMessage();
        badMessage.setEntity("SOME_ENTITY");
        badMessage.setContent("SOME_CONTENT");

        final var response = user1.sendAndReceive("default", badMessage);
        assertEquals("Received malformed WebSocketMessage.", getDescription(response.getContent()));
    }

    @Test
    public void shouldCatchSystemReservedEntity() throws Exception {
        final var badMessage = new WebSocketMessage();
        badMessage.setType("SOME_TYPE");
        badMessage.setEntity(WebSocketServiceEnum.WEBSOCKET_SERVICE_INTERNAL.name());
        badMessage.setContent("SOME_CONTENT");

        final var response = user1.sendAndReceive("default", badMessage);
        assertEquals("Received system reserved entity type.", getDescription(response.getContent()));
    }

    @Test
    public void shouldIgnoreForcedDisconnectsWithNonMatchingUserIds() {
        client.target(baseUrl() + "/ws/disconnect").request()
                .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON)
                .header(HttpHeaders.AUTHORIZATION, user1.getJwt())
                .post(Entity.json("{\"sessionId\":\"" + user2.getSessionId("default") + "\"}"));

        assertTrue(user2.getSession("default").isConnected());
        assertTrue(user1.getSession("default").isConnected());
    }

    @Test
    public void shouldPropagateLogoutCheck() throws Exception {
        user1.connectNewSession("otherSession");

        final var message = new WebSocketMessage();
        message.setEntity(WebSocketServiceEnum.WEBSOCKET_SERVICE.name());
        message.setType(WebSocketServiceEnum.LOGOUT.name());
        user1.send("default", message);

        final var response = user1.getNextMessage("otherSession");
        assertEquals(WebSocketServiceEnum.LOGOUT_CHECK.name(), response.getType());
    }

    private String getDescription(String content) {
        return JsonPath.read(content, "$.description");
    }
}
