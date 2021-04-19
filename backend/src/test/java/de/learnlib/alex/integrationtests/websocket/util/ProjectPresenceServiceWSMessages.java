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

import de.learnlib.alex.websocket.entities.WebSocketMessage;
import de.learnlib.alex.websocket.services.enums.ProjectPresenceServiceEnum;
import java.util.List;

public class ProjectPresenceServiceWSMessages extends WSMessages {

    public WebSocketMessage requestStatus(List<Long> projectIds) {
        final var msg = new WebSocketMessage();
        msg.setEntity(ProjectPresenceServiceEnum.PROJECT_PRESENCE_SERVICE.name());
        msg.setType(ProjectPresenceServiceEnum.STATUS_REQUEST.name());
        msg.setContent(createContent(projectIds));
        return msg;
    }

    public WebSocketMessage userEnteredProject(long projectId) {
        final var msg = new WebSocketMessage();
        msg.setEntity(ProjectPresenceServiceEnum.PROJECT_PRESENCE_SERVICE.name());
        msg.setType(ProjectPresenceServiceEnum.USER_ENTERED.name());
        msg.setContent(createContent(projectId));
        return msg;
    }

    public WebSocketMessage userLeftProject(long projectId) {
        final var msg = new WebSocketMessage();
        msg.setEntity(ProjectPresenceServiceEnum.PROJECT_PRESENCE_SERVICE.name());
        msg.setType(ProjectPresenceServiceEnum.USER_LEFT.name());
        msg.setContent(createContent(projectId));
        return msg;
    }

    private String createContent(long projectId) {
        final var content = objectMapper.createObjectNode();
        content.put("projectId", projectId);
        return content.toString();
    }
}
