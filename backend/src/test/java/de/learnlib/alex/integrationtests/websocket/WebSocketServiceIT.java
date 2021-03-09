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
import de.learnlib.alex.integrationtests.websocket.util.WebSocketUser;
import de.learnlib.alex.websocket.entities.WebSocketMessage;
import de.learnlib.alex.websocket.services.enums.WebSocketServiceEnum;
import javax.ws.rs.client.Entity;
import javax.ws.rs.core.HttpHeaders;
import javax.ws.rs.core.MediaType;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

public class WebSocketServiceIT extends AbstractResourceIT {

    private WebSocketUser user1;

    private WebSocketUser user2;

    @Before
    public void pre() throws Exception {
        user1 = new WebSocketUser("user1", client, port);
        user2 = new WebSocketUser("user2", client, port);
    }

    @After
    @Override
    public void post() throws Exception {
        user1.forceDisconnectAll();
        user2.forceDisconnectAll();

        super.post();
    }

    @Test
    public void shouldRejectNullEntity() throws Exception {
        final WebSocketMessage badMessage = new WebSocketMessage();
        badMessage.setType("SOME_TYPE");
        badMessage.setContent("SOME_CONTENT");

        user1.send("default", badMessage);
        final WebSocketMessage response = user1.getNextMessage("default");
        assertEquals("Received malformed WebSocketMessage.", JsonPath.read(response.getContent(), "$.description"));
    }

    @Test
    public void shouldRejectNullType() throws Exception {
        final WebSocketMessage badMessage = new WebSocketMessage();
        badMessage.setEntity("SOME_ENTITY");
        badMessage.setContent("SOME_CONTENT");

        user1.send("default", badMessage);
        final WebSocketMessage response = user1.getNextMessage("default");
        assertEquals("Received malformed WebSocketMessage.", JsonPath.read(response.getContent(), "$.description"));
    }

    @Test
    public void shouldCatchSystemReservedEntity() throws Exception {
        final WebSocketMessage badMessage = new WebSocketMessage();

        badMessage.setType("SOME_TYPE");

        badMessage.setEntity(WebSocketServiceEnum.WEBSOCKET_SERVICE_INTERNAL.name());
        badMessage.setContent("SOME_CONTENT");

        user1.send("default", badMessage);
        final WebSocketMessage response = user1.getNextMessage("default");
        assertEquals("Received system reserved entity type.", JsonPath.read(response.getContent(), "$.description"));
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

        WebSocketMessage message = new WebSocketMessage();
        message.setEntity(WebSocketServiceEnum.WEBSOCKET_SERVICE.name());
        message.setType(WebSocketServiceEnum.LOGOUT.name());

        user1.send("default", message);

        message = user1.getNextMessage("otherSession");
        assertEquals(WebSocketServiceEnum.LOGOUT_CHECK.name(), message.getType());
    }
}
