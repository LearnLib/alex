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

package de.learnlib.alex.websocket;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

/**
 * To ensure that this authentication configuration is ordered ahead of Spring's Security,
 * it is marked with @Order(Ordered.HIGHEST_PRECEDENCE + 99) as suggested by the spring boot documentation.
 */
@Configuration
@Order(Ordered.HIGHEST_PRECEDENCE + 99)
public class WebSocketSecurityConfig implements WebSocketMessageBrokerConfigurer {

    private final WebSocketAuthChannelInterceptor webSocketAuthChannelInterceptor;

    @Autowired
    public WebSocketSecurityConfig(WebSocketAuthChannelInterceptor webSocketAuthChannelInterceptor) {
        this.webSocketAuthChannelInterceptor = webSocketAuthChannelInterceptor;
    }

    @Override
    public void configureClientInboundChannel(ChannelRegistration registration) {
        registration.interceptors(webSocketAuthChannelInterceptor);
    }

}
