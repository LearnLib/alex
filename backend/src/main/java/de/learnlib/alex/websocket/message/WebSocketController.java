package de.learnlib.alex.websocket.message;

import com.fasterxml.jackson.databind.ObjectMapper;
import de.learnlib.alex.websocket.entities.WebSocketMessage;
import de.learnlib.alex.websocket.services.WebSocketBaseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpAttributesContextHolder;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;

import java.io.IOException;
import java.security.Principal;

@Controller
public class WebSocketController {

    private final WebSocketBaseService webSocketBaseService;

    @Autowired
    public WebSocketController(WebSocketBaseService webSocketBaseService) {
        this.webSocketBaseService = webSocketBaseService;
    }

    @MessageMapping("/send/event")
    public void onIncomingEvent(@Payload String event, Principal userPrincipal) {
        ObjectMapper om = new ObjectMapper();
        WebSocketMessage msg;

        try {
            msg = om.readValue(event, WebSocketMessage.class);
            SecurityContextHolder.getContext().setAuthentication((UsernamePasswordAuthenticationToken) userPrincipal);
            webSocketBaseService.processIncomingMessage(msg, userPrincipal);
        } catch (IOException e) {
            e.printStackTrace();

            WebSocketMessage error = new WebSocketMessage();
            error.setEntity("System");
            error.setType("Error");
            error.setContent("Error - Received malformed WebSocketMessage.");

            this.webSocketBaseService.sendError(SimpAttributesContextHolder.currentAttributes().getSessionId(), error);
        }

    }
}
