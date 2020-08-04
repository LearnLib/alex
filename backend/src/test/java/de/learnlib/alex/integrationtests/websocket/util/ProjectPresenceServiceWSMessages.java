package de.learnlib.alex.integrationtests.websocket.util;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import de.learnlib.alex.websocket.entities.WebSocketMessage;
import de.learnlib.alex.websocket.services.enums.ProjectPresenceServiceEnum;

import java.util.List;

public class ProjectPresenceServiceWSMessages {

    private ObjectMapper objectMapper = new ObjectMapper();

    public WebSocketMessage requestStatus(List<Long> projectIds) {
        final WebSocketMessage msg = new WebSocketMessage();
        msg.setEntity(ProjectPresenceServiceEnum.PROJECT_PRESENCE_SERVICE.name());
        msg.setType(ProjectPresenceServiceEnum.STATUS_REQUEST.name());

        ArrayNode projects = objectMapper.createArrayNode();
        ObjectNode content = objectMapper.createObjectNode();

        projectIds.forEach(projects::add);
        content.set("projectIds", projects);
        msg.setContent(content.toString());

        return msg;
    }

    public WebSocketMessage userEnteredProject(long projectId) {
        final WebSocketMessage msg = new WebSocketMessage();
        msg.setEntity(ProjectPresenceServiceEnum.PROJECT_PRESENCE_SERVICE.name());
        msg.setType(ProjectPresenceServiceEnum.USER_ENTERED.name());

        ObjectNode content = objectMapper.createObjectNode();

        content.put("projectId", projectId);
        msg.setContent(content.toString());

        return msg;
    }

    public WebSocketMessage userLeftProject(long projectId) {
        final WebSocketMessage msg = new WebSocketMessage();
        msg.setEntity(ProjectPresenceServiceEnum.PROJECT_PRESENCE_SERVICE.name());
        msg.setType(ProjectPresenceServiceEnum.USER_LEFT.name());

        ObjectNode content = objectMapper.createObjectNode();

        content.put("projectId", projectId);
        msg.setContent(content.toString());

        return msg;
    }
}
