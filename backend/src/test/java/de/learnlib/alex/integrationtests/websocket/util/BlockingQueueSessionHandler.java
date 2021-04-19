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

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import de.learnlib.alex.websocket.entities.WebSocketMessage;
import de.learnlib.alex.websocket.services.enums.WebSocketServiceEnum;
import java.lang.reflect.Type;
import java.util.concurrent.BlockingQueue;
import javax.annotation.Nonnull;
import org.springframework.messaging.simp.stomp.StompHeaders;
import org.springframework.messaging.simp.stomp.StompSession;
import org.springframework.messaging.simp.stomp.StompSessionHandlerAdapter;

class BlockingQueueSessionHandler extends StompSessionHandlerAdapter {

    private final BlockingQueue<WebSocketMessage> queue;

    private final ObjectMapper objectMapper = new ObjectMapper();

    public BlockingQueueSessionHandler(BlockingQueue<WebSocketMessage> queue) {
        this.queue = queue;
    }

    @Override
    public void afterConnected(StompSession session, @Nonnull StompHeaders connectedHeaders) {
        session.subscribe("/user/queue", this);
        session.subscribe("/user/queue/error", this);

        final WebSocketMessage msg = new WebSocketMessage();
        msg.setEntity(WebSocketServiceEnum.WEBSOCKET_SERVICE.name());
        msg.setType(WebSocketServiceEnum.REQUEST_SESSION_ID.name());

        try {
            session.send("/app/send/event", objectMapper.writeValueAsString(msg));
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }
    }

    @Override
    public Type getPayloadType(StompHeaders headers) {
        return WebSocketMessage.class;
    }

    @Override
    public void handleFrame(StompHeaders headers, Object payload) {
        queue.offer((WebSocketMessage) payload);
    }
}
