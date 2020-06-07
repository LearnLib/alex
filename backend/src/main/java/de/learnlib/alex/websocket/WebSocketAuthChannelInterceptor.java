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

@Component
public class WebSocketAuthChannelInterceptor implements ChannelInterceptor {

    private final AuthenticationProvider authenticationProvider;

    @Autowired
    public WebSocketAuthChannelInterceptor(AuthenticationProvider authenticationProvider) {
        this.authenticationProvider = authenticationProvider;
    }

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);
        if (StompCommand.CONNECT.equals(accessor.getCommand())) {
            try {
                String jwt = accessor.getFirstNativeHeader("Authorization");
                UsernamePasswordAuthenticationToken usernamePasswordAuthToken = (UsernamePasswordAuthenticationToken) authenticationProvider.getAuthentication(jwt);

                if (usernamePasswordAuthToken.getAuthorities().contains(new SimpleGrantedAuthority("GUEST"))) {
                    throw new UnauthorizedException("Cannot get authorized.");
                };

                accessor.setUser(usernamePasswordAuthToken);
            } catch (Exception e) {
                throw new UnauthorizedException("Cannot get authorized.");
            }
        }
        return message;
    }
}
