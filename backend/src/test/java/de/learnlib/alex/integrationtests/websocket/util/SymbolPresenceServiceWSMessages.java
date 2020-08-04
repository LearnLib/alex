package de.learnlib.alex.integrationtests.websocket.util;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import de.learnlib.alex.websocket.entities.WebSocketMessage;
import de.learnlib.alex.websocket.services.enums.ProjectPresenceServiceEnum;
import de.learnlib.alex.websocket.services.enums.SymbolPresenceServiceEnum;

import java.util.List;

public class SymbolPresenceServiceWSMessages {

    private ObjectMapper objectMapper = new ObjectMapper();

    public WebSocketMessage requestStatus(List<Long> projectIds) {
        final WebSocketMessage msg = new WebSocketMessage();
        msg.setEntity(SymbolPresenceServiceEnum.SYMBOL_PRESENCE_SERVICE.name());
        msg.setType(SymbolPresenceServiceEnum.STATUS_REQUEST.name());

        ArrayNode projects = objectMapper.createArrayNode();
        ObjectNode content = objectMapper.createObjectNode();

        projectIds.forEach(projects::add);
        content.set("projectIds", projects);
        msg.setContent(content.toString());

        return msg;
    }

    public WebSocketMessage userEnteredSymbol(long projectId, long symbolId) {
        final WebSocketMessage msg = new WebSocketMessage();
        msg.setEntity(SymbolPresenceServiceEnum.SYMBOL_PRESENCE_SERVICE.name());
        msg.setType(SymbolPresenceServiceEnum.USER_ENTERED.name());

        ObjectNode content = objectMapper.createObjectNode();

        content.put("projectId", projectId);
        content.put("symbolId", symbolId);
        msg.setContent(content.toString());

        return msg;
    }

    public WebSocketMessage userLeftSymbol(long projectId, long symbolId) {
        final WebSocketMessage msg = new WebSocketMessage();
        msg.setEntity(SymbolPresenceServiceEnum.SYMBOL_PRESENCE_SERVICE.name());
        msg.setType(SymbolPresenceServiceEnum.USER_LEFT.name());

        ObjectNode content = objectMapper.createObjectNode();

        content.put("projectId", projectId);
        content.put("symbolId", symbolId);
        msg.setContent(content.toString());

        return msg;
    }
}
