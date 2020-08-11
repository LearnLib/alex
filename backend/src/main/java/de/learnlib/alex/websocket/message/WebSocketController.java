/*
 * Copyright 2015 - 2020 TU Dortmund
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

package de.learnlib.alex.websocket.message;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.jayway.jsonpath.JsonPath;
import de.learnlib.alex.security.AuthContext;
import de.learnlib.alex.websocket.entities.WebSocketMessage;
import de.learnlib.alex.websocket.services.WebSocketService;
import de.learnlib.alex.websocket.services.enums.WebSocketServiceEnum;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpAttributesContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseStatus;

import javax.ws.rs.core.MediaType;
import java.io.IOException;
import java.security.Principal;

@Controller
public class WebSocketController {

    private final WebSocketService webSocketService;

    private final AuthContext authContext;

    private final ObjectMapper objectMapper;

    @Autowired
    public WebSocketController(WebSocketService webSocketService, AuthContext authContext, ObjectMapper objectMapper) {
        this.webSocketService = webSocketService;
        this.authContext = authContext;
        this.objectMapper = objectMapper;
    }

    @MessageMapping("/send/event")
    public void onIncomingEvent(@Payload String event, Principal userPrincipal) {
        WebSocketMessage msg;

        try {
            msg = objectMapper.readValue(event, WebSocketMessage.class);
            if (msg.getEntity() == null || msg.getType() == null) {
                throw new IOException();
            }
            webSocketService.processIncomingMessage(msg, userPrincipal);
        } catch (IOException e) {
            final WebSocketMessage error = new WebSocketMessage();
            error.setEntity(WebSocketServiceEnum.WEBSOCKET_SERVICE.name());
            error.setType(WebSocketServiceEnum.ERROR.name());

            final ObjectNode content = objectMapper.createObjectNode();
            content.put("description", "Received malformed WebSocketMessage.");
            content.put("message", event);
            error.setContent(content.toString());

            this.webSocketService.sendError(SimpAttributesContextHolder.currentAttributes().getSessionId(), error);
        }
    }

    @ResponseStatus(code = HttpStatus.NO_CONTENT)
    @PostMapping(
            value = "/rest/ws/disconnect",
            consumes = MediaType.APPLICATION_JSON
    )
    public void onDisconnect(@RequestBody String data) {
        final String sessionId = JsonPath.read(data, "$.sessionId");
        final long userId = this.webSocketService.getUserIdBySessionId(sessionId);

        if (authContext.getUser().getId() == userId) {
            this.webSocketService.closeSession(sessionId);
        }
    }

}
