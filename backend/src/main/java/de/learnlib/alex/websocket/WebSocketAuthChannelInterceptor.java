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

import de.learnlib.alex.security.AuthenticationProvider;
import org.apache.shiro.authz.UnauthorizedException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Component;

/**
 * Custom ChannelInterceptor that tries to authenticate a newly established
 * Websocket connection over Stomp on the Stomp Connect Frame.
 */
@Component
public class WebSocketAuthChannelInterceptor implements ChannelInterceptor {

    private final AuthenticationProvider authenticationProvider;

    @Autowired
    public WebSocketAuthChannelInterceptor(AuthenticationProvider authenticationProvider) {
        this.authenticationProvider = authenticationProvider;
    }

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        var accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);
        if (StompCommand.CONNECT.equals(accessor.getCommand())) {
            try {
                var jwt = accessor.getFirstNativeHeader("Authorization");
                var usernamePasswordAuthToken = (UsernamePasswordAuthenticationToken) authenticationProvider.getAuthentication(jwt);

                if (usernamePasswordAuthToken.getAuthorities().contains(new SimpleGrantedAuthority("ANONYMOUS"))) {
                    throw new UnauthorizedException("Cannot get authorized.");
                }

                accessor.setUser(usernamePasswordAuthToken);
            } catch (Exception e) {
                throw new UnauthorizedException("Cannot get authorized.");
            }
        }
        return message;
    }
}
