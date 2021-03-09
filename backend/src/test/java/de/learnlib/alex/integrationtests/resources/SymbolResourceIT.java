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

package de.learnlib.alex.integrationtests.resources;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.jayway.jsonpath.JsonPath;
import de.learnlib.alex.data.entities.ParameterizedSymbol;
import de.learnlib.alex.data.entities.Symbol;
import de.learnlib.alex.data.entities.SymbolActionStep;
import de.learnlib.alex.data.entities.SymbolGroup;
import de.learnlib.alex.data.entities.SymbolPSymbolStep;
import de.learnlib.alex.data.entities.SymbolStep;
import de.learnlib.alex.data.entities.actions.misc.WaitAction;
import de.learnlib.alex.integrationtests.SpringRestError;
import de.learnlib.alex.integrationtests.resources.api.ProjectApi;
import de.learnlib.alex.integrationtests.resources.api.SymbolApi;
import de.learnlib.alex.integrationtests.resources.api.SymbolGroupApi;
import de.learnlib.alex.integrationtests.resources.api.UserApi;
import de.learnlib.alex.integrationtests.websocket.util.SymbolPresenceServiceWSMessages;
import de.learnlib.alex.integrationtests.websocket.util.WebSocketUser;
import java.io.File;
import java.util.Arrays;
import java.util.Collections;
import java.util.Iterator;
import java.util.List;
import java.util.stream.Collectors;
import javax.ws.rs.core.GenericType;
import javax.ws.rs.core.Response;
import org.junit.Before;
import org.junit.Test;
import org.skyscreamer.jsonassert.JSONAssert;
import org.springframework.http.HttpStatus;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNotEquals;
import static org.junit.Assert.assertTrue;

public class SymbolResourceIT extends AbstractResourceIT {

    private String jwtUser1;

    private String jwtUser2;

    private int userId1;

    private int userId2;

    private int projectId1;

    private int projectId2;

    private int symbolGroupId1;

    private int symbolGroupId2;

    private SymbolApi symbolApi;

    private SymbolGroupApi symbolGroupApi;

    private ProjectApi projectApi;

    private SymbolPresenceServiceWSMessages symbolPresenceServiceWSMessages;

    @Before
    public void pre() throws Exception {
        symbolGroupApi = new SymbolGroupApi(client, port);
        symbolApi = new SymbolApi(client, port);
        final UserApi userApi = new UserApi(client, port);
        projectApi = new ProjectApi(client, port);
        symbolPresenceServiceWSMessages = new SymbolPresenceServiceWSMessages();

        final Response res1 = userApi.create("{\"email\":\"test1@test.de\",\"username\":\"test1\",\"password\":\"test\"}");
        final Response res2 = userApi.create("{\"email\":\"test2@test.de\",\"username\":\"test2\",\"password\":\"test\"}");

        userId1 = JsonPath.read(res1.readEntity(String.class), "id");
        userId2 = JsonPath.read(res2.readEntity(String.class), "id");

        jwtUser1 = userApi.login("test1@test.de", "test");
        jwtUser2 = userApi.login("test2@test.de", "test");

        final Response res3 =
                projectApi.create("{\"name\":\"test\",\"url\":\"http://localhost:8080\"}", jwtUser1);
        final Response res4 =
                projectApi.create("{\"name\":\"test\",\"url\":\"http://localhost:8080\"}", jwtUser2);

        projectId1 = JsonPath.read(res3.readEntity(String.class), "id");
        projectId2 = JsonPath.read(res4.readEntity(String.class), "id");

        final Response res5 =
                symbolGroupApi.create(projectId1, "{\"name\":\"group1\", \"project\": " + projectId1 + "}", jwtUser1);
        final Response res6 =
                symbolGroupApi.create(projectId2, "{\"name\":\"group2\", \"project\": " + projectId2 + "}", jwtUser2);

        symbolGroupId1 = JsonPath.read(res5.readEntity(String.class), "id");
        symbolGroupId2 = JsonPath.read(res6.readEntity(String.class), "id");
    }

    @Test
    public void shouldCreateADefaultSymbol() throws Exception {
        final String symbol = createSymbolWithProjectJson(projectId1, "s1");
        final Response res = symbolApi.create(projectId1, symbol, jwtUser1);

        assertEquals(HttpStatus.CREATED.value(), res.getStatus());
        assertEquals(1, getNumberOfSymbols(projectId1, jwtUser1));
    }

    @Test
    public void shouldCreateASymbolWithAllProperties() throws Exception {
        final String symbolJson = createSymbolWithAllPropertiesJson(projectId1, symbolGroupId1, "s1");
        final Response res1 = symbolApi.create(projectId1, symbolJson, jwtUser1);

        assertEquals(HttpStatus.CREATED.value(), res1.getStatus());
        final String symbolRes = res1.readEntity(String.class);
        final JsonNode symbolNode = objectMapper.readTree(symbolJson);
        ((ObjectNode) symbolNode).put("id", objectMapper.readTree(symbolRes).get("id").intValue());
        ((ObjectNode) symbolNode).put("updatedOn", objectMapper.readTree(symbolRes).get("updatedOn").asText());
        ((ObjectNode) symbolNode).set("lastUpdatedBy", objectMapper.readTree(symbolRes).get("lastUpdatedBy"));
        JSONAssert.assertEquals(symbolNode.toString(), symbolRes, true);

        final Response res2 = symbolApi.getAll(projectId1, jwtUser1);
        final String symbol = objectMapper.readTree(res2.readEntity(String.class)).get(0).toString();
        JSONAssert.assertEquals(symbolNode.toString(), symbol, true);
    }

    @Test
    public void shouldGetAllSymbols() throws Exception {
        final String symbol1 = createSymbolWithProjectJson(projectId1, "s1");
        final String symbol2 = createSymbolWithProjectJson(projectId1, "s2");
        final String symbol3 = createSymbolWithProjectJson(projectId1, "s3");

        symbolApi.create(projectId1, symbol1, jwtUser1);
        symbolApi.create(projectId1, symbol2, jwtUser1);
        symbolApi.create(projectId1, symbol3, jwtUser1);
        assertEquals(3, getNumberOfSymbols(projectId1, jwtUser1));
    }

    @Test
    public void shouldUpdateSymbolLockedByUser() throws Exception {
        WebSocketUser webSocketUser = new WebSocketUser("webSocketUser", client, port);
        projectApi.addMembers(Integer.toUnsignedLong(projectId1), Collections.singletonList(webSocketUser.getUserId()), jwtUser1);

        final Symbol s = createSymbol("s", (long) projectId1, jwtUser1);

        webSocketUser.send("default", symbolPresenceServiceWSMessages.userEnteredSymbol(projectId1, s.getId()));

        s.setName("s2");

        Response res = symbolApi.update(Math.toIntExact(s.getProjectId()), s.getId(), objectMapper.writeValueAsString(s), webSocketUser.getJwt());
        assertEquals(Response.Status.OK.getStatusCode(), res.getStatus());

        webSocketUser.forceDisconnectAll();
    }

    @Test
    public void shouldFailToUpdateSymbolLockedByUser() throws Exception {
        WebSocketUser webSocketUser = new WebSocketUser("webSocketUser", client, port);
        projectApi.addMembers(Integer.toUnsignedLong(projectId1), Collections.singletonList(webSocketUser.getUserId()), jwtUser1);

        final Symbol s = createSymbol("s", (long) projectId1, jwtUser1);

        webSocketUser.send("default", symbolPresenceServiceWSMessages.userEnteredSymbol(projectId1, s.getId()));

        s.setName("s2");

        Response res = symbolApi.update(Math.toIntExact(s.getProjectId()), s.getId(), objectMapper.writeValueAsString(s), webSocketUser.getJwt());
        assertEquals(Response.Status.OK.getStatusCode(), res.getStatus());

        webSocketUser.forceDisconnectAll();
    }

    @Test
    public void shouldUpdateSymbolStepsWithSymbolUpdate() throws Exception {
        Symbol s = createSymbol("s", (long) projectId1, jwtUser1);

        final WaitAction a = new WaitAction();
        a.setDuration(1L);

        final SymbolActionStep step1 = new SymbolActionStep();
        step1.setAction(a);

        final SymbolActionStep step2 = new SymbolActionStep();
        step2.setAction(a);

        s.getSteps().add(step1);
        s.getSteps().add(step2);

        final Response res = symbolApi.update(projectId1, s.getId(), objectMapper.writeValueAsString(s), jwtUser1);
        s = res.readEntity(Symbol.class);

        assertEquals(HttpStatus.OK.value(), res.getStatus());
        assertEquals(2, s.getSteps().size());
    }

    @Test
    public void shouldMergeSymbolStepsOnUpdate() throws Exception {
        Symbol s = createSymbolWithSteps();

        final Long symbolStepIdToDelete = s.getSteps().get(0).getId();
        final Long symbolStepIdToKeep = s.getSteps().get(1).getId();

        s.getSteps().removeIf(st -> st.getId().equals(symbolStepIdToDelete));

        final WaitAction a = new WaitAction();
        a.setDuration(1L);

        final SymbolActionStep step3 = new SymbolActionStep();
        step3.setAction(a);

        s.getSteps().add(step3);

        final Response res2 = symbolApi.update(projectId1, s.getId(), objectMapper.writeValueAsString(s), jwtUser1);
        s = res2.readEntity(Symbol.class);

        assertEquals(HttpStatus.OK.value(), res2.getStatus());
        assertEquals(2, s.getSteps().size());
        assertEquals(symbolStepIdToKeep, s.getSteps().get(0).getId());
        assertNotEquals(symbolStepIdToDelete, s.getSteps().get(1).getId());
    }

    @Test
    public void shouldUpdateOrderOfStepsOnSymbolUpdate() throws Exception {
        Symbol s = createSymbolWithSteps();

        final SymbolStep step1 = s.getSteps().get(0);
        final SymbolStep step2 = s.getSteps().get(1);

        s.getSteps().clear();
        s.getSteps().add(step2);
        s.getSteps().add(step1);

        final Response res = symbolApi.update(projectId1, s.getId(), objectMapper.writeValueAsString(s), jwtUser1);
        s = res.readEntity(Symbol.class);

        assertEquals(HttpStatus.OK.value(), res.getStatus());
        assertEquals(step2.getId(), s.getSteps().get(0).getId());
        assertEquals(step1.getId(), s.getSteps().get(1).getId());
    }

    @Test
    public void shouldSaveSymbolWithSymbolStep() throws Exception {
        final Symbol s1 = createSymbol("s1", (long) projectId1, jwtUser1);
        final Symbol s2 = createSymbol("s2", (long) projectId1, jwtUser1);

        final ParameterizedSymbol pSymbol = new ParameterizedSymbol();
        pSymbol.setSymbol(s2);

        final SymbolPSymbolStep step = new SymbolPSymbolStep();
        step.setPSymbol(pSymbol);
        s1.getSteps().add(step);

        final Response res = symbolApi.update(projectId1, s1.getId(), objectMapper.writeValueAsString(s1), jwtUser1);
        final Symbol updatedSymbol = res.readEntity(Symbol.class);

        assertEquals(HttpStatus.OK.value(), res.getStatus());
        assertEquals(1, updatedSymbol.getSteps().size());

        final SymbolPSymbolStep pSymbolStep = (SymbolPSymbolStep) updatedSymbol.getSteps().get(0);
        assertEquals(s2.getId(), pSymbolStep.getPSymbol().getSymbol().getId());
    }

    @Test
    public void shouldFailToSaveSymbolThatReferencesItself() throws Exception {
        Symbol s1 = createSymbol("s1", (long) projectId1, jwtUser1);

        final Symbol s1ref = new Symbol();
        s1ref.setId(s1.getId());

        final ParameterizedSymbol pSymbol = new ParameterizedSymbol();
        pSymbol.setSymbol(s1ref);

        final SymbolPSymbolStep step = new SymbolPSymbolStep();
        step.setPSymbol(pSymbol);
        s1.getSteps().add(step);

        final Response res = symbolApi.update(projectId1, s1.getId(), objectMapper.writeValueAsString(s1), jwtUser1);
        s1 = symbolApi.get(projectId1, s1.getId(), jwtUser1).readEntity(Symbol.class);

        assertEquals(HttpStatus.BAD_REQUEST.value(), res.getStatus());
        assertEquals(0, s1.getSteps().size());
    }

    private Symbol createSymbolWithSteps() throws Exception {
        Symbol s = createSymbol("s", (long) projectId1, jwtUser1);

        final WaitAction a = new WaitAction();
        a.setDuration(1L);

        final SymbolActionStep step1 = new SymbolActionStep();
        step1.setAction(a);

        final SymbolActionStep step2 = new SymbolActionStep();
        step2.setAction(a);

        final SymbolActionStep step3 = new SymbolActionStep();
        step3.setAction(a);

        s.getSteps().add(step1);
        s.getSteps().add(step2);

        final Response res = symbolApi.update(projectId1, s.getId(), objectMapper.writeValueAsString(s), jwtUser1);
        return res.readEntity(Symbol.class);
    }

    @Test
    public void shouldNotCreateASymbolIfNameExists() throws Exception {
        final String symbol1 = createSymbolWithProjectJson(projectId1, "s1");
        final String symbol2 = createSymbolWithProjectJson(projectId1, "s1");

        symbolApi.create(projectId1, symbol1, jwtUser1);
        final Response res = symbolApi.create(projectId1, symbol2, jwtUser1);
        assertEquals(HttpStatus.BAD_REQUEST.value(), res.getStatus());
        assertEquals(1, getNumberOfSymbols(projectId1, jwtUser1));
    }

    @Test
    public void shouldCreateASymbolInAGroup() {
        final String symbolJson = createSymbolWithGroupJson(projectId1, symbolGroupId1, "s1");
        final Response res1 = symbolApi.create(projectId1, symbolJson, jwtUser1);
        assertEquals(HttpStatus.CREATED.value(), res1.getStatus());

        final String symbol = res1.readEntity(String.class);
        final int groupId = JsonPath.read(symbol, "$.group");
        assertEquals(symbolGroupId1, groupId);

        final Response res2 = symbolGroupApi.getAll(projectId1, jwtUser1);
        final var groups = res2.readEntity(new GenericType<List<SymbolGroup>>(){});
        final var numberOfSymbols = groups.stream()
                .filter(g -> g.getName().equals("group1"))
                .findFirst()
                .map(g -> g.getSymbols().size())
                .orElse(0);

        assertEquals(1, (int) numberOfSymbols);
    }

    @Test
    public void shouldGetASymbolByItsId() throws Exception {
        final Symbol s = createSymbol("sym", (long) projectId1, jwtUser1);
        final Response res2 = symbolApi.get(projectId1, s.getId(), jwtUser1);
        final Symbol symbol = res2.readEntity(Symbol.class);

        assertEquals(HttpStatus.OK.value(), res2.getStatus());
        assertEquals(s.getId(), symbol.getId());
        assertEquals("sym", symbol.getName());
    }

    @Test
    public void shouldReturn404IfSymbolIdIsNotFoundWhenGettingASymbolById() throws Exception {
        final Response res = symbolApi.get(projectId1, -1L, jwtUser1);
        assertEquals(HttpStatus.NOT_FOUND.value(), res.getStatus());
        res.readEntity(SpringRestError.class);
    }

    @Test
    public void shouldGetMultipleSymbolsByTheirIds() throws Exception {
        final Symbol s1 = createSymbol("s1", (long) projectId1, jwtUser1);
        final Symbol s2 = createSymbol("s2", (long) projectId1, jwtUser1);
        final Symbol s3 = createSymbol("s3", (long) projectId1, jwtUser1);

        final Response res = symbolApi.get(projectId1, Arrays.asList(s1.getId(), s3.getId()), jwtUser1);
        final List<Symbol> symbols = res.readEntity(new GenericType<List<Symbol>>() {
        });
        final List<Long> symbolIds = symbols.stream().map(Symbol::getId).collect(Collectors.toList());

        assertEquals(HttpStatus.OK.value(), res.getStatus());
        assertEquals(2, symbolIds.size());
        assertTrue(symbolIds.contains(s1.getId()));
        assertTrue(symbolIds.contains(s3.getId()));
    }

    @Test
    public void shouldUpdateNameExpectedResultAndDescriptionOfASymbol() throws Exception {
        final Symbol s1 = createSymbol("s1", (long) projectId1, jwtUser1);
        s1.setName("updatedName");
        s1.setDescription("updatedDescription");
        s1.setExpectedResult("updatedExpectedResult");

        final Response res = symbolApi.update(projectId1, s1.getId(), objectMapper.writeValueAsString(s1), jwtUser1);
        final Symbol updatedSymbol = res.readEntity(Symbol.class);
        assertEquals(HttpStatus.OK.value(), res.getStatus());
        assertEquals(s1.getName(), updatedSymbol.getName());
        assertEquals(s1.getDescription(), updatedSymbol.getDescription());
        assertEquals(s1.getExpectedResult(), updatedSymbol.getExpectedResult());
    }

    @Test
    public void shouldUpdateTimestampOnUpdate() throws Exception {
        final Symbol s1 = createSymbol("s1", (long) projectId1, jwtUser1);
        s1.setName("updatedName");

        final Response res = symbolApi.update(projectId1, s1.getId(), objectMapper.writeValueAsString(s1), jwtUser1);
        final Symbol updatedSymbol = res.readEntity(Symbol.class);

        assertEquals(HttpStatus.OK.value(), res.getStatus());
        assertTrue(updatedSymbol.getUpdatedOn().isAfter(s1.getUpdatedOn()));
    }

    @Test
    public void shouldUpdateModifiedByOnUpdate() throws Exception {
        projectApi.addOwners((long) projectId1, Collections.singletonList((long) userId2), jwtUser1);

        final Symbol s1 = createSymbol("s1", (long) projectId1, jwtUser1);
        s1.setName("updatedName");

        final Response res = symbolApi.update(projectId1, s1.getId(), objectMapper.writeValueAsString(s1), jwtUser2);
        final Symbol updatedSymbol = res.readEntity(Symbol.class);

        assertEquals(HttpStatus.OK.value(), res.getStatus());
        assertEquals((long) updatedSymbol.getLastUpdatedBy().getId(), userId2);
    }

    @Test
    public void shouldMoveSymbolToAnotherGroup() throws Exception {
        Symbol s = createSymbol("s", (long) projectId1, jwtUser1);
        final SymbolGroup g = createGroup("g", (long) projectId1, jwtUser1);

        final Response res = symbolApi.move(projectId1, s.getId(), g.getId(), jwtUser1);
        s = symbolApi.get(projectId1, s.getId(), jwtUser1).readEntity(Symbol.class);

        assertEquals(HttpStatus.OK.value(), res.getStatus());
        assertEquals(g.getId(), s.getGroupId());
    }

    @Test
    public void shouldMoveSymbolsToAnotherGroup() throws Exception {
        final SymbolGroup g = createGroup("g", (long) projectId1, jwtUser1);
        Symbol s1 = createSymbol("s1", (long) projectId1, jwtUser1);
        Symbol s2 = createSymbol("s2", (long) projectId1, jwtUser1);

        final Response res = symbolApi.move(projectId1, Arrays.asList(s1.getId(), s2.getId()), g.getId(), jwtUser1);
        s1 = symbolApi.get(projectId1, s1.getId(), jwtUser1).readEntity(Symbol.class);
        s2 = symbolApi.get(projectId1, s2.getId(), jwtUser1).readEntity(Symbol.class);

        assertEquals(HttpStatus.OK.value(), res.getStatus());
        assertEquals(g.getId(), s1.getGroupId());
        assertEquals(g.getId(), s2.getGroupId());
    }

    @Test
    public void shouldNotMoveLockedSymbol() throws Exception {
        WebSocketUser webSocketUser = new WebSocketUser("webSocketUser", client, port);
        projectApi.addMembers(Integer.toUnsignedLong(projectId1), Collections.singletonList(webSocketUser.getUserId()), jwtUser1);

        final SymbolGroup g = createGroup("g", (long) projectId1, jwtUser1);
        Symbol s1 = createSymbol("s1", (long) projectId1, jwtUser1);

        webSocketUser.send("default", symbolPresenceServiceWSMessages.userEnteredSymbol(projectId1, s1.getId()));

        final Response res = symbolApi.move(projectId1, s1.getId(), g.getId(), webSocketUser.getJwt());

        assertEquals(HttpStatus.UNAUTHORIZED.value(), res.getStatus());
    }

    @Test
    public void shouldNotDeleteSymbolThatIsNotArchived() throws Exception {
        final Symbol s = createSymbol("s", (long) projectId1, jwtUser1);

        final Response res = symbolApi.delete(projectId1, s.getId(), jwtUser1);
        assertEquals(HttpStatus.BAD_REQUEST.value(), res.getStatus());
        res.readEntity(SpringRestError.class);

        final SymbolGroup group = symbolGroupApi.get((long) projectId1, s.getGroupId(), jwtUser1).readEntity(SymbolGroup.class);
        assertEquals(1, group.getSymbols().size());
    }

    @Test
    public void shouldDeleteSymbol() throws Exception {
        final Symbol s = createSymbol("s", (long) projectId1, jwtUser1);
        symbolApi.archive(projectId1, s.getId().intValue(), jwtUser1);

        final Response res = symbolApi.delete(projectId1, s.getId(), jwtUser1);

        assertEquals(HttpStatus.NO_CONTENT.value(), res.getStatus());
        assertEquals("", res.readEntity(String.class));

        final SymbolGroup group = symbolGroupApi.get((long) projectId1, s.getGroupId(), jwtUser1).readEntity(SymbolGroup.class);
        assertEquals(0, group.getSymbols().size());
    }

    @Test
    public void shouldNotDeleteLockedSymbol() throws Exception {
        WebSocketUser webSocketUser = new WebSocketUser("webSocketUser", client, port);
        projectApi.addMembers(Integer.toUnsignedLong(projectId1), Collections.singletonList(webSocketUser.getUserId()), jwtUser1);

        final Symbol s = createSymbol("s", (long) projectId1, jwtUser1);
        symbolApi.archive(projectId1, s.getId().intValue(), jwtUser1);

        webSocketUser.send("default", symbolPresenceServiceWSMessages.userEnteredSymbol(projectId1, s.getId()));

        final Response res = symbolApi.delete(projectId1, s.getId(), webSocketUser.getJwt());
        assertEquals(HttpStatus.UNAUTHORIZED.value(), res.getStatus());
    }

    @Test
    public void shouldDeleteSymbolsByIds() throws Exception {
        final Symbol s1 = createSymbol("s1", (long) projectId1, jwtUser1);
        final Symbol s2 = createSymbol("s2", (long) projectId1, jwtUser1);

        symbolApi.archiveMany(projectId1, Arrays.asList(s1.getId().intValue(), s2.getId().intValue()), jwtUser1);
        final Response res = symbolApi.delete(projectId1, Arrays.asList(s1.getId(), s2.getId()), jwtUser1);

        assertEquals(HttpStatus.NO_CONTENT.value(), res.getStatus());
        assertEquals("", res.readEntity(String.class));

        final SymbolGroup group = symbolGroupApi.get((long) projectId1, s1.getGroupId(), jwtUser1).readEntity(SymbolGroup.class);
        assertEquals(0, group.getSymbols().size());
    }

    @Test
    public void shouldRestoreSymbolFromTheArchive() throws Exception {
        Symbol s1 = createSymbol("s1", (long) projectId1, jwtUser1);
        symbolApi.archive(projectId1, s1.getId().intValue(), jwtUser1);

        final Response res = symbolApi.restore((long) projectId1, s1.getId(), jwtUser1);
        final Symbol restoredSymbol = res.readEntity(Symbol.class);

        s1 = symbolApi.get(projectId1, s1.getId(), jwtUser1).readEntity(Symbol.class);

        assertEquals(HttpStatus.OK.value(), res.getStatus());
        assertFalse(restoredSymbol.isHidden());
        assertFalse(s1.isHidden());
    }

    @Test
    public void shouldRestoreSymbolsFromTheArchive() throws Exception {
        Symbol s1 = createSymbol("s1", (long) projectId1, jwtUser1);
        Symbol s2 = createSymbol("s2", (long) projectId1, jwtUser1);
        symbolApi.archive(projectId1, s1.getId().intValue(), jwtUser1);
        symbolApi.archive(projectId1, s2.getId().intValue(), jwtUser1);

        final Response res = symbolApi.restore((long) projectId1, Arrays.asList(s1.getId(), s2.getId()), jwtUser1);
        final List<Symbol> restoredSymbols = res.readEntity(new GenericType<List<Symbol>>() {
        });

        s1 = symbolApi.get(projectId1, s1.getId(), jwtUser1).readEntity(Symbol.class);
        s2 = symbolApi.get(projectId1, s2.getId(), jwtUser1).readEntity(Symbol.class);

        assertEquals(HttpStatus.OK.value(), res.getStatus());
        for (Symbol s : restoredSymbols) {
            assertFalse(s.isHidden());
        }
        assertFalse(s1.isHidden());
        assertFalse(s2.isHidden());
    }

    private SymbolGroup createGroup(String name, Long projectId, String jwt) throws Exception {
        final SymbolGroup s = new SymbolGroup();
        s.setProjectId(projectId);
        s.setName(name);

        final Response res = symbolGroupApi.create(projectId1, objectMapper.writeValueAsString(s), jwt);
        return res.readEntity(SymbolGroup.class);
    }

    private Symbol createSymbol(String name, Long projectId, String jwt) throws Exception {
        final Symbol s = new Symbol();
        s.setProjectId(projectId);
        s.setName(name);

        final Response res = symbolApi.create(projectId1, objectMapper.writeValueAsString(s), jwt);
        return res.readEntity(Symbol.class);
    }

    @Test
    public void shouldNotCreateASymbolInANonExistingGroup() throws Exception {
        final String symbolJson = createSymbolWithGroupJson(projectId1, -1, "s1");
        final Response res1 = symbolApi.create(projectId1, symbolJson, jwtUser1);
        assertEquals(HttpStatus.NOT_FOUND.value(), res1.getStatus());
        assertEquals(0, getNumberOfSymbols(projectId1, jwtUser1));
    }

    @Test
    public void shouldNotCreateASymbolInAnotherUsersGroup() throws Exception {
        final String symbolJson = createSymbolWithGroupJson(projectId1, symbolGroupId2, "s1");
        final Response res1 = symbolApi.create(projectId1, symbolJson, jwtUser1);
        assertEquals(HttpStatus.UNAUTHORIZED.value(), res1.getStatus());
        assertEquals(0, getNumberOfSymbols(projectId1, jwtUser1));
        assertEquals(0, getNumberOfSymbols(projectId2, jwtUser2));
    }

    @Test
    public void shouldNotCreateASymbolInAnotherUsersProject() throws Exception {
        final String symbol = createSymbolWithProjectJson(projectId2, "s1");
        final Response res = symbolApi.create(projectId2, symbol, jwtUser1);

        assertEquals(HttpStatus.UNAUTHORIZED.value(), res.getStatus());
        assertEquals(0, getNumberOfSymbols(projectId1, jwtUser1));
        assertEquals(0, getNumberOfSymbols(projectId2, jwtUser2));
    }

    @Test
    public void shouldCreateASymbolsWithActionSteps() throws Exception {
        final String symbolJson = createSymbolWithActionStepsJson(projectId1, "s1");
        final Response res = symbolApi.create(projectId1, symbolJson, jwtUser1);

        assertEquals(HttpStatus.CREATED.value(), res.getStatus());
        assertEquals(1, getNumberOfSymbols(projectId1, jwtUser1));

        final String symbol = res.readEntity(String.class);
        validateSymbol(symbol, projectId1);
    }

    @Test
    public void shouldCreateSymbolsWithActionSteps() throws Exception {
        final String symbolJson1 = createSymbolWithActionStepsJson(projectId1, "s1");
        final String symbolJson2 = createSymbolWithActionStepsJson(projectId1, "s2");
        final String symbolsJson = "[" + String.join(",", Arrays.asList(symbolJson1, symbolJson2)) + "]";
        final Response res = symbolApi.createMany(projectId1, symbolsJson, jwtUser1);

        assertEquals(HttpStatus.CREATED.value(), res.getStatus());
        assertEquals(2, getNumberOfSymbols(projectId1, jwtUser1));

        final String symbols = res.readEntity(String.class);
        final JsonNode symbolsNode = objectMapper.readTree(symbols);
        validateSymbol(symbolsNode.get(0).toString(), projectId1);
        validateSymbol(symbolsNode.get(1).toString(), projectId1);
    }

    @Test
    public void shouldHideASymbol() throws Exception {
        final String symbolJson = createSymbolWithActionStepsJson(projectId1, "s1");
        final Response res1 = symbolApi.create(projectId1, symbolJson, jwtUser1);

        final String symbol = res1.readEntity(String.class);
        final int symbolId = JsonPath.read(symbol, "$.id");

        final Response res2 = symbolApi.archive(projectId1, symbolId, jwtUser1);
        assertEquals(HttpStatus.OK.value(), res2.getStatus());
        assertEquals(1, getNumberOfSymbols(projectId1, jwtUser1));

        final String archivedSymbol = res2.readEntity(String.class);
        final boolean hidden = JsonPath.read(archivedSymbol, "$.hidden");
        assertTrue(hidden);
    }

    @Test
    public void shouldHideSymbols() throws Exception {
        final String symbolJson1 = createSymbolWithActionStepsJson(projectId1, "s1");
        final String symbolJson2 = createSymbolWithActionStepsJson(projectId1, "s2");
        final String symbolsJson = "[" + String.join(",", Arrays.asList(symbolJson1, symbolJson2)) + "]";
        final Response res = symbolApi.createMany(projectId1, symbolsJson, jwtUser1);

        final String symbols = res.readEntity(String.class);
        final int symbol1Id = JsonPath.read(symbols, "$.[0].id");
        final int symbol2Id = JsonPath.read(symbols, "$.[1].id");

        final Response res2 = symbolApi.archiveMany(projectId1, Arrays.asList(symbol1Id, symbol2Id), jwtUser1);
        assertEquals(HttpStatus.OK.value(), res2.getStatus());
        assertEquals(2, getNumberOfSymbols(projectId1, jwtUser1));

        final String archivedSymbols = res2.readEntity(String.class);
        final boolean hidden1 = JsonPath.read(archivedSymbols, "$.[0].hidden");
        final boolean hidden2 = JsonPath.read(archivedSymbols, "$.[1].hidden");

        assertTrue(hidden1);
        assertTrue(hidden2);
    }

    @Test
    public void shouldCreateSymbolsWithSymbolSteps() throws Exception {
        symbolApi.create(projectId1, createSymbolWithAllPropertiesJson(projectId1, symbolGroupId1, "s2"), jwtUser1);
        symbolApi.create(projectId1, createSymbolWithAllPropertiesJson(projectId1, symbolGroupId1, "s3"), jwtUser1);

        final String symbolWithSymbolStepsJson = createSymbolWithSymbolStepsJson(projectId1, symbolGroupId1, "s1");
        final Response resS1 = symbolApi.create(projectId1, symbolWithSymbolStepsJson, jwtUser1);
        assertEquals(HttpStatus.CREATED.value(), resS1.getStatus());

        final JsonNode symbolsNode = objectMapper.readTree(symbolApi.getAll(projectId1, jwtUser1).readEntity(String.class));

        final Iterator<JsonNode> it = symbolsNode.iterator();
        while (it.hasNext()) {
            final JsonNode symbolNode = it.next();
            if (symbolNode.get("name").asText().equals("s1")) {
                assertEquals(2, symbolNode.get("steps").size());
                return;
            }
        }

        throw new Exception("symbol not found");
    }

    @Test
    public void shouldCreateASymbolWithAllWebActions() throws Exception {
        final File file = new File(getClass().getResource("/core/entities/symbol-with-all-web-actions.json").toURI());
        final JsonNode symbolJson = objectMapper.readTree(file);
        final int numberOfSteps = symbolJson.get("steps").size();

        final Response response = symbolApi.create(projectId1, symbolJson.toString(), jwtUser1);
        assertEquals(HttpStatus.CREATED.value(), response.getStatus());
        final JsonNode symbol = objectMapper.readTree(response.readEntity(String.class));

        assertEquals(numberOfSteps, symbol.get("steps").size());
    }

    @Test
    public void shouldCreateASymbolWithAllRestActions() throws Exception {
        final File file = new File(getClass().getResource("/core/entities/symbol-with-all-rest-actions.json").toURI());
        final JsonNode symbolJson = objectMapper.readTree(file);
        final int numberOfSteps = symbolJson.get("steps").size();

        final Response response = symbolApi.create(projectId1, symbolJson.toString(), jwtUser1);
        assertEquals(HttpStatus.CREATED.value(), response.getStatus());
        final JsonNode symbol = objectMapper.readTree(response.readEntity(String.class));

        assertEquals(numberOfSteps, symbol.get("steps").size());
    }

    @Test
    public void shouldCreateASymbolWithAllMiscActions() throws Exception {
        final File file = new File(getClass().getResource("/core/entities/symbol-with-all-misc-actions.json").toURI());
        final JsonNode symbolJson = objectMapper.readTree(file);
        final int numberOfSteps = symbolJson.get("steps").size();

        final Response response = symbolApi.create(projectId1, symbolJson.toString(), jwtUser1);
        assertEquals(HttpStatus.CREATED.value(), response.getStatus());
        final JsonNode symbol = objectMapper.readTree(response.readEntity(String.class));

        assertEquals(numberOfSteps, symbol.get("steps").size());
    }

    private void validateSymbol(String symbol, int projectId) {
        int symbolId = JsonPath.read(symbol, "$.id");
        int symbolProjectId = JsonPath.read(symbol, "$.project");
        JsonPath.read(symbol, "$.steps[0].id");
        JsonPath.read(symbol, "$.steps[0].id");
        int step1SymbolId = JsonPath.read(symbol, "$.steps[0].symbol");
        int step2SymbolId = JsonPath.read(symbol, "$.steps[1].symbol");
        JsonPath.read(symbol, "$.steps[0].action.id");
        JsonPath.read(symbol, "$.steps[1].action.id");

        assertEquals(projectId, symbolProjectId);
        assertEquals(symbolId, step1SymbolId);
        assertEquals(symbolId, step2SymbolId);
    }

    private int getNumberOfSymbols(int projectId, String jwt) throws Exception {
        final Response res = symbolApi.getAll(projectId, jwt);
        return objectMapper.readTree(res.readEntity(String.class)).size();
    }

    private String createSymbolWithActionStepsJson(int projectId, String name) {
        return "{"
                + "\"name\":\"" + name + "\""
                + ",\"project\": " + projectId
                + ",\"steps\": ["
                + "{\"type\":\"action\", \"negated\": false, \"errorOutput\": null, \"ignoreFailure\": false, \"disabled\": false, \"action\": {\"type\": \"wait\", \"duration\": 1000}}"
                + ",{\"type\":\"action\", \"negated\": false, \"errorOutput\": null, \"ignoreFailure\": false, \"disabled\": false, \"action\": {\"type\": \"wait\", \"duration\": 1000}}"
                + "]"
                + "}";
    }

    private String createSymbolWithSymbolStepsJson(int projectId, int groupId, String name) {
        return "{"
                + "\"name\":\"" + name + "\""
                + ",\"project\": " + projectId
                + ",\"group\": " + groupId
                + ",\"steps\": ["
                + "{\"type\":\"symbol\", \"negated\": false, \"errorOutput\": null, \"ignoreFailure\": false, \"disabled\": false, \"pSymbol\": {\"symbol\": {\"name\": \"s2\"}, \"parameterValues\": []}}"
                + ",{\"type\":\"symbol\", \"negated\": false, \"errorOutput\": null, \"ignoreFailure\": false, \"disabled\": false, \"pSymbol\": {\"symbol\": {\"name\": \"s3\"}, \"parameterValues\": []}}"
                + "]"
                + "}";
    }

    private String createSymbolWithProjectJson(int projectId, String name) {
        return "{"
                + "\"name\":\"" + name + "\""
                + ",\"project\": " + projectId
                + ",\"steps\": []"
                + "}";
    }

    private String createSymbolWithGroupJson(int projectId, int groupId, String name) {
        return "{"
                + "\"name\":\"" + name + "\""
                + ",\"project\": " + projectId
                + ",\"group\":" + groupId
                + ",\"steps\": []"
                + "}";
    }

    private String createSymbolWithAllPropertiesJson(int projectId, int groupId, String name) {
        return "{"
                + "\"name\":\"" + name + "\""
                + ",\"project\": " + projectId
                + ",\"group\":" + groupId
                + ",\"steps\": []"
                + ",\"description\": \"test description\""
                + ",\"expectedResult\": \"test\""
                + ",\"hidden\": false"
                + ",\"inputs\": []"
                + ",\"outputs\": []"
                + ",\"successOutput\": \"yep\""
                + "}";
    }
}
