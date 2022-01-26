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

package de.learnlib.alex.websocket;

import de.learnlib.alex.websocket.services.WebSocketService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Lazy;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketTransportRegistration;
import org.springframework.web.socket.handler.WebSocketHandlerDecorator;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        config.enableSimpleBroker("/queue");
        config.setApplicationDestinationPrefixes("/app");
        config.setPreservePublishOrder(true);
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/rest/ws/stomp").setAllowedOriginPatterns("*").withSockJS();
    }

    @Override
    public void configureWebSocketTransport(WebSocketTransportRegistration registry) {
        registry.addDecoratorFactory(webSocketHandler -> customWebSocketHandlerDecorator(webSocketHandler));
    }

    @Bean
    public WebSocketHandlerDecorator customWebSocketHandlerDecorator(WebSocketHandler webSocketHandler) {
        return new CustomWebSocketHandlerDecoratorImpl(webSocketHandler);
    }

    class CustomWebSocketHandlerDecoratorImpl extends WebSocketHandlerDecorator {

        @Autowired
        @Lazy
        private WebSocketService webSocketService;

        public CustomWebSocketHandlerDecoratorImpl(WebSocketHandler delegate) {
            super(delegate);
        }

        @Override
        public void afterConnectionEstablished(final WebSocketSession session) throws Exception {
            this.webSocketService.addWebSocketSession(session);
            super.afterConnectionEstablished(session);
        }

        @Override
        public void afterConnectionClosed(WebSocketSession session, CloseStatus closeStatus) throws Exception {
            this.webSocketService.removeWebSocketSession(session.getId());
            super.afterConnectionClosed(session, closeStatus);
        }
    }
}
