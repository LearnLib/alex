package de.learnlib.alex.integrationtests.websocket.util;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.jayway.jsonpath.JsonPath;
import de.learnlib.alex.integrationtests.resources.api.UserApi;
import de.learnlib.alex.websocket.entities.WebSocketMessage;
import de.learnlib.alex.websocket.services.enums.WebSocketServiceEnum;
import jdk.nashorn.internal.ir.Block;
import org.springframework.messaging.converter.MappingJackson2MessageConverter;
import org.springframework.messaging.simp.stomp.StompHeaders;
import org.springframework.messaging.simp.stomp.StompSession;
import org.springframework.messaging.simp.stomp.StompSessionHandlerAdapter;
import org.springframework.web.socket.client.standard.StandardWebSocketClient;
import org.springframework.web.socket.messaging.WebSocketStompClient;
import org.springframework.web.socket.sockjs.client.SockJsClient;
import org.springframework.web.socket.sockjs.client.WebSocketTransport;

import javax.ws.rs.client.Client;
import javax.ws.rs.client.Entity;
import javax.ws.rs.core.HttpHeaders;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.io.IOException;
import java.lang.reflect.Type;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.LinkedBlockingDeque;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.TimeoutException;

public class WebSocketUser {

    private String wsUrl() {
        return "ws://localhost:" + port + "/rest/ws/stomp";
    }
    private String baseUrl() {
        return "http://localhost:" + port + "/rest";
    }

    private Client client;
    private int port;

    private long userId;
    private String jwt;

    private WebSocketStompClient stompClient;
    private StompHeaders headers;

    private Map<String, StompSession> sessions;
    private Map<String, String> sessionIds;
    private Map<String, BlockingQueue<WebSocketMessage>> messages;

    private ObjectMapper objectMapper;

    public WebSocketUser(String username, Client client, int port) throws InterruptedException, ExecutionException, TimeoutException, IOException, URISyntaxException {
        this.client = client;
        this.port = port;

        this.sessions = new HashMap<>();
        this.sessionIds = new HashMap<>();
        this.messages = new HashMap<>();
        this.objectMapper = new ObjectMapper();

        final UserApi userApi = new UserApi(client, port);
        final Response res = userApi.create("{\"email\":\"" + username + "@test.de\",\"username\":\"" + username + "\",\"password\":\"test\"}");
        this.userId = Integer.toUnsignedLong(JsonPath.read(res.readEntity(String.class), "id"));
        this.jwt = userApi.login(username + "@test.de", "test");

        this.stompClient = new WebSocketStompClient(new SockJsClient(
                Collections.singletonList(new WebSocketTransport(new StandardWebSocketClient()))));

        this.stompClient.setMessageConverter(new MappingJackson2MessageConverter());

        headers = new StompHeaders();
        headers.add("Authorization", this.jwt);

        this.connectNewSession("default");
    }

    public long getUserId() {
        return userId;
    }

    public String getJwt() {
        return jwt;
    }

    public void connectNewSession(String sessionName) throws URISyntaxException, InterruptedException, ExecutionException, TimeoutException, IOException {
        this.messages.put(sessionName, new LinkedBlockingDeque<>());
        this.sessions.put(sessionName, this.stompClient.connect(new URI(wsUrl()), null, headers, new MySessionHandler(this.messages.get(sessionName))).get(1, TimeUnit.SECONDS));

        WebSocketMessage response = this.messages.get(sessionName).poll(1, TimeUnit.SECONDS);
        ObjectNode content = (ObjectNode) objectMapper.readTree(response.getContent());
        this.sessionIds.put(sessionName, content.get("sessionId").asText());
    }

    public void send(String sessionName, WebSocketMessage message) throws JsonProcessingException {
        this.sessions.get(sessionName).send("/app/send/event", objectMapper.writeValueAsString(message));
    }

    public BlockingQueue<WebSocketMessage> getMessages(String sessionName) {
        return this.messages.get(sessionName);
    }

    public void clearMessagesDelayed(String sessionName) throws InterruptedException {
        this.messages.get(sessionName).poll(1, TimeUnit.SECONDS);
        this.messages.get(sessionName).clear();
    }

    public void forceDisconnect(String sessionName) {
        client.target(baseUrl() + "/ws/disconnect").request()
                .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON)
                .header(HttpHeaders.AUTHORIZATION, this.jwt)
                .post(Entity.json("{\"sessionId\":\"" + this.sessionIds.get(sessionName) + "\"}"));
    }

    public void forceDisconnectAll() {
        this.sessionIds.keySet().forEach(this::forceDisconnect);
    }

    private class MySessionHandler extends StompSessionHandlerAdapter {

        private final BlockingQueue queue;

        private ObjectMapper objectMapper = new ObjectMapper();

        public MySessionHandler(BlockingQueue queue) {
            this.queue = queue;
        }

        @Override
        public void afterConnected(StompSession session, StompHeaders connectedHeaders) {
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
            queue.offer(payload);
        }
    }
}