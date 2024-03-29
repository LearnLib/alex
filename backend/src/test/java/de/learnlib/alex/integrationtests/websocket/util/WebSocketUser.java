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

package de.learnlib.alex.integrationtests.websocket.util;

import static org.junit.jupiter.api.Assertions.assertEquals;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.jayway.jsonpath.JsonPath;
import de.learnlib.alex.integrationtests.resources.api.UserApi;
import de.learnlib.alex.websocket.entities.WebSocketMessage;
import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.LinkedBlockingDeque;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.TimeoutException;
import javax.ws.rs.client.Client;
import javax.ws.rs.client.Entity;
import javax.ws.rs.core.HttpHeaders;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import org.springframework.messaging.converter.MappingJackson2MessageConverter;
import org.springframework.messaging.simp.stomp.StompHeaders;
import org.springframework.messaging.simp.stomp.StompSession;
import org.springframework.web.socket.client.standard.StandardWebSocketClient;
import org.springframework.web.socket.messaging.WebSocketStompClient;
import org.springframework.web.socket.sockjs.client.SockJsClient;
import org.springframework.web.socket.sockjs.client.WebSocketTransport;

public class WebSocketUser {

    /** Default poll time in seconds */
    private final int DEFAULT_POLL_TIME = 3;

    private String wsUrl() {
        return "ws://localhost:" + port + "/rest/ws/stomp";
    }

    private String baseUrl() {
        return "http://localhost:" + port + "/rest";
    }

    private final Client client;
    private final int port;

    private final long userId;
    private final String jwt;

    private final WebSocketStompClient stompClient;
    private final StompHeaders headers;

    private final Map<String, StompSession> sessions;
    private final Map<String, String> sessionIds;
    private final Map<String, BlockingQueue<WebSocketMessage>> messages;

    private final ObjectMapper objectMapper;

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

        this.stompClient = new WebSocketStompClient(
                new SockJsClient(Collections.singletonList(
                        new WebSocketTransport(
                                new StandardWebSocketClient()))));

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

    public String getSessionId(String sessionName) {
        return this.sessionIds.get(sessionName);
    }

    public StompSession getSession(String sessionName) {
        return this.sessions.get(sessionName);
    }

    public void connectNewSession(String sessionName) throws URISyntaxException, InterruptedException, ExecutionException, TimeoutException, IOException {
        final var messageQueue = new LinkedBlockingDeque<WebSocketMessage>();
        this.messages.put(sessionName, messageQueue);

        final var sessionHandler = new BlockingQueueSessionHandler(messageQueue);
        final var stompSession = this.stompClient.connect(new URI(wsUrl()), null, headers, sessionHandler)
                .get(10, TimeUnit.SECONDS);

        this.sessions.put(sessionName, stompSession);

        final var response = getNextMessage(sessionName);
        final var content = (ObjectNode) objectMapper.readTree(response.getContent());
        this.sessionIds.put(sessionName, content.get("sessionId").asText());
    }

    public void send(String sessionName, WebSocketMessage message) throws JsonProcessingException {
        this.sessions.get(sessionName).send("/app/send/event", objectMapper.writeValueAsString(message));
    }

    public WebSocketMessage sendAndReceive(String sessionName, WebSocketMessage message) throws JsonProcessingException, InterruptedException {
        send(sessionName, message);
        return getNextMessage(sessionName);
    }

    public int getAmountOfMessages(String sessionName) {
        return this.messages.get(sessionName).size();
    }

    public WebSocketMessage getNextMessage(String sessionName) throws InterruptedException {
        return this.messages.get(sessionName).poll(DEFAULT_POLL_TIME, TimeUnit.SECONDS);
    }

    public void clearMessagesInAllSessions() {
        this.messages.forEach((k,v) -> v.clear());
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

    public boolean assertNumberOfMessages(List<String> sessions, List<Integer> expectedAmountOfMessages) {
        assertEquals(sessions.size(), expectedAmountOfMessages.size());
        var valid = true;
        for (int i = 0; i < sessions.size(); i++) {
            valid &= getAmountOfMessages(sessions.get(i)) == expectedAmountOfMessages.get(i);
        }
        return valid;
    }

    public boolean assertNumberOfMessages(String session, Integer expectedAmountOfMessages) {
        return assertNumberOfMessages(List.of(session), List.of(expectedAmountOfMessages));
    }
}
