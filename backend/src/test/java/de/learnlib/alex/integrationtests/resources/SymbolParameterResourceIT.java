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

package de.learnlib.alex.integrationtests.resources;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.jayway.jsonpath.JsonPath;
import de.learnlib.alex.integrationtests.resources.api.ProjectApi;
import de.learnlib.alex.integrationtests.resources.api.SymbolApi;
import de.learnlib.alex.integrationtests.resources.api.SymbolParameterApi;
import de.learnlib.alex.integrationtests.resources.api.UserApi;
import de.learnlib.alex.integrationtests.websocket.util.SymbolPresenceServiceWSMessages;
import de.learnlib.alex.integrationtests.websocket.util.WebSocketUser;
import java.time.Duration;
import java.util.Collections;
import java.util.List;
import javax.ws.rs.core.Response;
import org.awaitility.Awaitility;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.skyscreamer.jsonassert.JSONAssert;

public class SymbolParameterResourceIT extends AbstractResourceIT {

    private final Duration defaultWaitTime = Duration.ofSeconds(5);
    private final ObjectMapper om = new ObjectMapper();

    private SymbolParameterApi symbolParameterApi;

    private SymbolApi symbolApi;

    private String jwtUser1;

    private int projectId;

    private int symbolId;

    private SymbolPresenceServiceWSMessages symbolPresenceServiceWSMessages;

    private ProjectApi projectApi;

    @BeforeEach
    public void pre() {
        this.symbolParameterApi = new SymbolParameterApi(client, port);
        this.symbolPresenceServiceWSMessages = new SymbolPresenceServiceWSMessages();

        final UserApi userApi = new UserApi(client, port);
        userApi.create("{\"email\":\"test1@test.de\",\"username\":\"test1\",\"password\":\"test\"}");
        jwtUser1 = userApi.login("test1@test.de", "test");

        projectApi = new ProjectApi(client, port);
        final Response res1 = projectApi.create("{\"name\":\"test\",\"url\":\"http://test\"}", jwtUser1);
        assertEquals(res1.getStatus(), Response.Status.CREATED.getStatusCode());
        this.projectId = JsonPath.read(res1.readEntity(String.class), "$.id");

        this.symbolApi = new SymbolApi(client, port);
        final Response res2 = symbolApi.create(projectId, "{\"name\":\"s1\",\"steps\":[]}", jwtUser1);
        assertEquals(res2.getStatus(), Response.Status.CREATED.getStatusCode());
        this.symbolId = JsonPath.read(res2.readEntity(String.class), "$.id");
    }

    @Test
    public void shouldCreateAnInputStringParameter() throws Exception {
        final Response res = symbolParameterApi.create(projectId, symbolId, createInputStringParam(symbolId, "test"), jwtUser1);
        assertEquals(res.getStatus(), Response.Status.CREATED.getStatusCode());

        final JsonNode symbol = getSymbol();
        final JsonNode inputs = symbol.get("inputs");

        assertEquals(1, inputs.size());
        assertTrue(inputs.get(0).hasNonNull("id"));
        assertEquals("STRING", inputs.get(0).get("parameterType").asText());
    }

    @Test
    public void shouldCreateAnInputCounterParameter() throws Exception {
        final Response res = symbolParameterApi.create(projectId, symbolId, createInputCounterParam(symbolId, "test"), jwtUser1);
        assertEquals(res.getStatus(), Response.Status.CREATED.getStatusCode());

        final JsonNode symbol = getSymbol();
        final JsonNode inputs = symbol.get("inputs");

        assertEquals(1, inputs.size());
        assertTrue(inputs.get(0).hasNonNull("id"));
        assertEquals("COUNTER", inputs.get(0).get("parameterType").asText());
    }

    @Test
    public void shouldCreateAnOutputStringParameter() throws Exception {
        final Response res = symbolParameterApi.create(projectId, symbolId, createOutputStringParam(symbolId, "test"), jwtUser1);
        assertEquals(res.getStatus(), Response.Status.CREATED.getStatusCode());

        final JsonNode symbol = getSymbol();
        final JsonNode inputs = symbol.get("outputs");

        assertEquals(1, inputs.size());
        assertTrue(inputs.get(0).hasNonNull("id"));
        assertEquals("STRING", inputs.get(0).get("parameterType").asText());
    }

    @Test
    public void shouldCreateAnOutputCounterParameter() throws Exception {
        final Response res = symbolParameterApi.create(projectId, symbolId, createOutputCounterParam(symbolId, "test"), jwtUser1);
        assertEquals(res.getStatus(), Response.Status.CREATED.getStatusCode());

        final JsonNode symbol = getSymbol();
        final JsonNode inputs = symbol.get("outputs");

        assertEquals(1, inputs.size());
        assertTrue(inputs.get(0).hasNonNull("id"));
        assertEquals("COUNTER", inputs.get(0).get("parameterType").asText());
    }

    @Test
    public void shouldNotCreateInputParameterIfNameIsTaken() throws Exception {
        symbolParameterApi.create(projectId, symbolId, createInputStringParam(symbolId, "test"), jwtUser1);
        final Response res1 = symbolParameterApi.create(projectId, symbolId, createInputStringParam(symbolId, "test"), jwtUser1);
        assertEquals(Response.Status.BAD_REQUEST.getStatusCode(), res1.getStatus());

        final Response res2 = symbolParameterApi.create(projectId, symbolId, createInputCounterParam(symbolId, "test"), jwtUser1);
        assertEquals(Response.Status.BAD_REQUEST.getStatusCode(), res2.getStatus());

        final JsonNode symbol = getSymbol();
        assertEquals(1, symbol.get("inputs").size());
    }

    @Test
    public void shouldNotCreateOutputParameterIfNameIsTaken() throws Exception {
        symbolParameterApi.create(projectId, symbolId, createOutputStringParam(symbolId, "test"), jwtUser1);
        final Response res1 = symbolParameterApi.create(projectId, symbolId, createOutputStringParam(symbolId, "test"), jwtUser1);
        assertEquals(Response.Status.BAD_REQUEST.getStatusCode(), res1.getStatus());

        final Response res2 = symbolParameterApi.create(projectId, symbolId, createOutputCounterParam(symbolId, "test"), jwtUser1);
        assertEquals(Response.Status.BAD_REQUEST.getStatusCode(), res2.getStatus());

        final JsonNode symbol = getSymbol();
        assertEquals(1, symbol.get("outputs").size());
    }

    @Test
    public void shouldCreateParameterOnSymbolLockedByUser() throws Exception {
        WebSocketUser webSocketUser = new WebSocketUser("webSocketUser", client, port);
        projectApi.addMembers(Integer.toUnsignedLong(projectId), Collections.singletonList(webSocketUser.getUserId()), jwtUser1);

        webSocketUser.send("default", symbolPresenceServiceWSMessages.userEnteredSymbol(projectId, symbolId));
        Awaitility.await().atMost(defaultWaitTime).until(() -> webSocketUser.assertNumberOfMessages(List.of("default"), List.of(1)));

        final Response res = symbolParameterApi.create(projectId, symbolId, createInputStringParam(symbolId, "test"), webSocketUser.getJwt());
        assertEquals(res.getStatus(), Response.Status.CREATED.getStatusCode());

        webSocketUser.forceDisconnectAll();
    }

    @Test
    public void shouldNotCreateParameterOnSymbolLockedByOtherUser() throws Exception {
        WebSocketUser webSocketUser = new WebSocketUser("webSocketUser", client, port);
        projectApi.addMembers(Integer.toUnsignedLong(projectId), Collections.singletonList(webSocketUser.getUserId()), jwtUser1);

        webSocketUser.send("default", symbolPresenceServiceWSMessages.userEnteredSymbol(projectId, symbolId));
        Awaitility.await().atMost(defaultWaitTime).until(() -> webSocketUser.assertNumberOfMessages(List.of("default"), List.of(1)));

        final Response res = symbolParameterApi.create(projectId, symbolId, createInputStringParam(symbolId, "test"), jwtUser1);
        assertEquals(res.getStatus(), Response.Status.UNAUTHORIZED.getStatusCode());

        webSocketUser.forceDisconnectAll();
    }

    @Test
    public void shouldUpdateInputParameter() throws Exception {
        final Response res1 = symbolParameterApi.create(projectId, symbolId, createInputStringParam(symbolId, "test"), jwtUser1);
        final JsonNode paramNode = objectMapper.readTree(res1.readEntity(String.class));

        ((ObjectNode) paramNode).put("name", "newName");

        final Response res2 = symbolParameterApi.update(projectId, symbolId, paramNode.get("id").asInt(), paramNode.toString(), jwtUser1);
        assertEquals(Response.Status.OK.getStatusCode(), res2.getStatus());
        assertEquals(paramNode.toString(), res2.readEntity(String.class));
    }

    @Test
    public void shouldUpdateOutputParameter() throws Exception {
        final Response res1 = symbolParameterApi.create(projectId, symbolId, createOutputStringParam(symbolId, "test"), jwtUser1);
        final JsonNode paramNode = objectMapper.readTree(res1.readEntity(String.class));

        ((ObjectNode) paramNode).put("name", "newName");

        final Response res2 = symbolParameterApi.update(projectId, symbolId, paramNode.get("id").asInt(), paramNode.toString(), jwtUser1);
        assertEquals(Response.Status.OK.getStatusCode(), res2.getStatus());
        assertEquals(paramNode.toString(), res2.readEntity(String.class));
    }

    @Test
    public void shouldNotUpdateInputParameterIfNameIsTaken() throws Exception {
        symbolParameterApi.create(projectId, symbolId, createInputStringParam(symbolId, "test"), jwtUser1);
        final Response res1 = symbolParameterApi.create(projectId, symbolId, createInputStringParam(symbolId, "test2"), jwtUser1);
        final JsonNode paramNode = objectMapper.readTree(res1.readEntity(String.class));
        ((ObjectNode) paramNode).put("name", "test");

        final String symbolPre = symbolApi.getAll(projectId, jwtUser1).readEntity(String.class);

        final Response res2 = symbolParameterApi.update(projectId, symbolId, paramNode.get("id").asInt(), paramNode.toString(), jwtUser1);
        assertEquals(Response.Status.BAD_REQUEST.getStatusCode(), res2.getStatus());

        final String symbolPost = symbolApi.getAll(projectId, jwtUser1).readEntity(String.class);
        JSONAssert.assertEquals(symbolPre, symbolPost, true);
    }

    @Test
    public void shouldNotUpdateOutputParameterIfNameIsTaken() throws Exception {
        symbolParameterApi.create(projectId, symbolId, createOutputStringParam(symbolId, "test"), jwtUser1);
        final Response res1 = symbolParameterApi.create(projectId, symbolId, createOutputStringParam(symbolId, "test2"), jwtUser1);
        final JsonNode paramNode = objectMapper.readTree(res1.readEntity(String.class));
        ((ObjectNode) paramNode).put("name", "test");

        final String symbolPre = symbolApi.getAll(projectId, jwtUser1).readEntity(String.class);

        final Response res2 = symbolParameterApi.update(projectId, symbolId, paramNode.get("id").asInt(), paramNode.toString(), jwtUser1);
        assertEquals(Response.Status.BAD_REQUEST.getStatusCode(), res2.getStatus());

        final String symbolPost = symbolApi.getAll(projectId, jwtUser1).readEntity(String.class);
        JSONAssert.assertEquals(symbolPre, symbolPost, true);
    }

    @Test
    public void shouldUpdateParameterOnSymbolLockedByUser() throws Exception {
        WebSocketUser webSocketUser = new WebSocketUser("webSocketUser", client, port);
        projectApi.addMembers(Integer.toUnsignedLong(projectId), Collections.singletonList(webSocketUser.getUserId()), jwtUser1);

        symbolParameterApi.create(projectId, symbolId, createOutputStringParam(symbolId, "test"), jwtUser1);
        final Response res1 = symbolParameterApi.create(projectId, symbolId, createOutputStringParam(symbolId, "test2"), jwtUser1);
        final JsonNode paramNode = objectMapper.readTree(res1.readEntity(String.class));
        ((ObjectNode) paramNode).put("name", "newName");

        webSocketUser.send("default", symbolPresenceServiceWSMessages.userEnteredSymbol(projectId, symbolId));
        Awaitility.await().atMost(defaultWaitTime).until(() -> webSocketUser.assertNumberOfMessages(List.of("default"), List.of(1)));

        final Response res2 = symbolParameterApi.update(projectId, symbolId, paramNode.get("id").asInt(), paramNode.toString(), webSocketUser.getJwt());
        assertEquals(Response.Status.OK.getStatusCode(), res2.getStatus());

        webSocketUser.forceDisconnectAll();
    }

    @Test
    public void shouldNotUpdateParameterOnSymbolLockedByOtherUser() throws Exception {
        WebSocketUser webSocketUser = new WebSocketUser("webSocketUser", client, port);
        projectApi.addMembers(Integer.toUnsignedLong(projectId), Collections.singletonList(webSocketUser.getUserId()), jwtUser1);

        symbolParameterApi.create(projectId, symbolId, createOutputStringParam(symbolId, "test"), jwtUser1);
        final Response res1 = symbolParameterApi.create(projectId, symbolId, createOutputStringParam(symbolId, "test2"), jwtUser1);
        final JsonNode paramNode = objectMapper.readTree(res1.readEntity(String.class));
        ((ObjectNode) paramNode).put("name", "newName");

        webSocketUser.send("default", symbolPresenceServiceWSMessages.userEnteredSymbol(projectId, symbolId));
        Awaitility.await().atMost(defaultWaitTime).until(() -> webSocketUser.assertNumberOfMessages(List.of("default"), List.of(1)));

        final Response res2 = symbolParameterApi.update(projectId, symbolId, paramNode.get("id").asInt(), paramNode.toString(), jwtUser1);
        assertEquals(Response.Status.UNAUTHORIZED.getStatusCode(), res2.getStatus());

        webSocketUser.forceDisconnectAll();
    }

    @Test
    public void shouldDeleteInputParameter() throws Exception {
        final Response res1 = symbolParameterApi.create(projectId, symbolId, createInputStringParam(symbolId, "test"), jwtUser1);
        final int id = JsonPath.read(res1.readEntity(String.class), "$.id");

        final Response res2 = symbolParameterApi.delete(projectId, symbolId, id, jwtUser1);
        assertEquals(Response.Status.NO_CONTENT.getStatusCode(), res2.getStatus());

        final JsonNode symbols = objectMapper.readTree(symbolApi.getAll(projectId, jwtUser1).readEntity(String.class));
        assertEquals("[]", symbols.get(0).get("inputs").toString());
    }

    @Test
    public void shouldDeleteOutputParameter() throws Exception {
        final Response res1 = symbolParameterApi.create(projectId, symbolId, createOutputStringParam(symbolId, "test"), jwtUser1);
        final int id = JsonPath.read(res1.readEntity(String.class), "$.id");

        final Response res2 = symbolParameterApi.delete(projectId, symbolId, id, jwtUser1);
        assertEquals(Response.Status.NO_CONTENT.getStatusCode(), res2.getStatus());

        final JsonNode symbols = objectMapper.readTree(symbolApi.getAll(projectId, jwtUser1).readEntity(String.class));
        assertEquals("[]", symbols.get(0).get("outputs").toString());
    }

    @Test
    public void shouldDeleteParameterOnSymbolLockedByUser() throws Exception {
        WebSocketUser webSocketUser = new WebSocketUser("webSocketUser", client, port);
        projectApi.addMembers(Integer.toUnsignedLong(projectId), Collections.singletonList(webSocketUser.getUserId()), jwtUser1);

        final Response res1 = symbolParameterApi.create(projectId, symbolId, createInputStringParam(symbolId, "test"), jwtUser1);
        final int id = JsonPath.read(res1.readEntity(String.class), "$.id");

        webSocketUser.send("default", symbolPresenceServiceWSMessages.userEnteredSymbol(projectId, symbolId));
        Awaitility.await().atMost(defaultWaitTime).until(() -> webSocketUser.assertNumberOfMessages(List.of("default"), List.of(1)));

        final Response res2 = symbolParameterApi.delete(projectId, symbolId, id, webSocketUser.getJwt());
        assertEquals(Response.Status.NO_CONTENT.getStatusCode(), res2.getStatus());

        webSocketUser.forceDisconnectAll();
    }

    @Test
    public void shouldNotDeleteParameterOnSymbolLockedByOtherUser() throws Exception {
        WebSocketUser webSocketUser = new WebSocketUser("webSocketUser", client, port);
        projectApi.addMembers(Integer.toUnsignedLong(projectId), Collections.singletonList(webSocketUser.getUserId()), jwtUser1);

        final Response res1 = symbolParameterApi.create(projectId, symbolId, createInputStringParam(symbolId, "test"), jwtUser1);
        final int id = JsonPath.read(res1.readEntity(String.class), "$.id");

        webSocketUser.send("default", symbolPresenceServiceWSMessages.userEnteredSymbol(projectId, symbolId));
        Awaitility.await().atMost(defaultWaitTime).until(() -> webSocketUser.assertNumberOfMessages(List.of("default"), List.of(1)));

        final Response res2 = symbolParameterApi.delete(projectId, symbolId, id, jwtUser1);
        assertEquals(Response.Status.UNAUTHORIZED.getStatusCode(), res2.getStatus());

        webSocketUser.forceDisconnectAll();
    }

    private JsonNode getSymbol() throws Exception {
        final Response res = symbolApi.getAll(projectId, jwtUser1);
        final String symbols = res.readEntity(String.class);
        return om.readTree(symbols).get(0);
    }

    private String createInputParam(int symId, String name, String parameterType) {
        return "{\"symbol\":\"" + symId + "\""
                + ",\"name\":\"" + name + "\""
                + ",\"type\":\"input\""
                + ",\"parameterType\": \"" + parameterType + "\"}";
    }

    private String createOutputParam(int symId, String name, String parameterType) {
        return "{\"symbol\":\"" + symId + "\""
                + ",\"name\":\"" + name + "\""
                + ",\"type\":\"output\""
                + ",\"parameterType\": \"" + parameterType + "\"}";
    }

    private String createInputStringParam(int symId, String name) {
        return createInputParam(symId, name, "STRING");
    }

    private String createInputCounterParam(int symId, String name) {
        return createInputParam(symId, name, "COUNTER");
    }

    private String createOutputStringParam(int symId, String name) {
        return createOutputParam(symId, name, "STRING");
    }

    private String createOutputCounterParam(int symId, String name) {
        return createOutputParam(symId, name, "COUNTER");
    }
}
