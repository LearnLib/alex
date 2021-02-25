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

package de.learnlib.alex.integrationtests.websocket.util;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import de.learnlib.alex.websocket.entities.WebSocketMessage;
import de.learnlib.alex.websocket.services.enums.SymbolPresenceServiceEnum;

import java.util.List;

public class SymbolPresenceServiceWSMessages {

    private ObjectMapper objectMapper = new ObjectMapper();

    public WebSocketMessage requestStatus(List<Long> projectIds) {
        final WebSocketMessage msg = new WebSocketMessage();
        msg.setEntity(SymbolPresenceServiceEnum.SYMBOL_PRESENCE_SERVICE.name());
        msg.setType(SymbolPresenceServiceEnum.STATUS_REQUEST.name());

        final ArrayNode projects = objectMapper.createArrayNode();
        final ObjectNode content = objectMapper.createObjectNode();

        projectIds.forEach(projects::add);
        content.set("projectIds", projects);
        msg.setContent(content.toString());

        return msg;
    }

    public WebSocketMessage userEnteredSymbol(long projectId, long symbolId) {
        final WebSocketMessage msg = new WebSocketMessage();
        msg.setEntity(SymbolPresenceServiceEnum.SYMBOL_PRESENCE_SERVICE.name());
        msg.setType(SymbolPresenceServiceEnum.USER_ENTERED.name());

        final ObjectNode content = objectMapper.createObjectNode();

        content.put("projectId", projectId);
        content.put("symbolId", symbolId);
        msg.setContent(content.toString());

        return msg;
    }

    public WebSocketMessage userLeftSymbol(long projectId, long symbolId) {
        final WebSocketMessage msg = new WebSocketMessage();
        msg.setEntity(SymbolPresenceServiceEnum.SYMBOL_PRESENCE_SERVICE.name());
        msg.setType(SymbolPresenceServiceEnum.USER_LEFT.name());

        final ObjectNode content = objectMapper.createObjectNode();

        content.put("projectId", projectId);
        content.put("symbolId", symbolId);
        msg.setContent(content.toString());

        return msg;
    }
}
