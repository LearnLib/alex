package de.learnlib.alex.integrationtests.websocket.util;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import de.learnlib.alex.websocket.entities.WebSocketMessage;
import de.learnlib.alex.websocket.services.enums.TestPresenceServiceEnum;

import java.util.List;

public class TestPresenceServiceWSMessages {

    private ObjectMapper objectMapper = new ObjectMapper();

    public WebSocketMessage requestStatus(List<Long> projectIds) {
        final WebSocketMessage msg = new WebSocketMessage();
        msg.setEntity(TestPresenceServiceEnum.TEST_PRESENCE_SERVICE.name());
        msg.setType(TestPresenceServiceEnum.STATUS_REQUEST.name());

        ArrayNode projects = objectMapper.createArrayNode();
        ObjectNode content = objectMapper.createObjectNode();

        projectIds.forEach(projects::add);
        content.set("projectIds", projects);
        msg.setContent(content.toString());

        return msg;
    }

    public WebSocketMessage userEnteredTest(long projectId, long testId) {
        final WebSocketMessage msg = new WebSocketMessage();
        msg.setEntity(TestPresenceServiceEnum.TEST_PRESENCE_SERVICE.name());
        msg.setType(TestPresenceServiceEnum.USER_ENTERED.name());

        ObjectNode content = objectMapper.createObjectNode();

        content.put("projectId", projectId);
        content.put("testId", testId);
        msg.setContent(content.toString());

        return msg;
    }

    public WebSocketMessage userLeftTest(long projectId, long testId) {
        final WebSocketMessage msg = new WebSocketMessage();
        msg.setEntity(TestPresenceServiceEnum.TEST_PRESENCE_SERVICE.name());
        msg.setType(TestPresenceServiceEnum.USER_LEFT.name());

        ObjectNode content = objectMapper.createObjectNode();

        content.put("projectId", projectId);
        content.put("testId", testId);
        msg.setContent(content.toString());

        return msg;
    }
}
