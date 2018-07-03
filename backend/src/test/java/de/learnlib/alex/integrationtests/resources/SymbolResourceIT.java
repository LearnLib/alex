/*
 * Copyright 2018 TU Dortmund
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
import de.learnlib.alex.integrationtests.resources.api.ProjectApi;
import de.learnlib.alex.integrationtests.resources.api.SymbolApi;
import de.learnlib.alex.integrationtests.resources.api.SymbolGroupApi;
import de.learnlib.alex.integrationtests.resources.api.UserApi;
import org.junit.Before;
import org.junit.Test;
import org.skyscreamer.jsonassert.JSONAssert;
import org.springframework.http.HttpStatus;

import javax.ws.rs.core.Response;
import java.util.Arrays;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

public class SymbolResourceIT extends AbstractResourceIT {

    private String jwtUser1;

    private String jwtUser2;

    private int projectId1;

    private int projectId2;

    private int symbolGroupId1;

    private int symbolGroupId2;

    private SymbolApi symbolApi;

    private SymbolGroupApi symbolGroupApi;

    @Before
    public void pre() {
        symbolGroupApi = new SymbolGroupApi(client, port);
        symbolApi = new SymbolApi(client, port);
        final UserApi userApi = new UserApi(client, port);
        final ProjectApi projectApi = new ProjectApi(client, port);

        userApi.create("{\"email\":\"test1@test.de\",\"password\":\"test\"}");
        userApi.create("{\"email\":\"test2@test.de\",\"password\":\"test\"}");

        jwtUser1 = userApi.login("test1@test.de", "test");
        jwtUser2 = userApi.login("test2@test.de", "test");

        final Response res1 =
                projectApi.create("{\"name\":\"test\",\"urls\":[{\"url\":\"http://localhost:8080\"}]}", jwtUser1);
        final Response res2 =
                projectApi.create("{\"name\":\"test\",\"urls\":[{\"url\":\"http://localhost:8080\"}]}", jwtUser2);

        projectId1 = JsonPath.read(res1.readEntity(String.class), "id");
        projectId2 = JsonPath.read(res2.readEntity(String.class), "id");

        final Response res3 =
                symbolGroupApi.create(projectId1, "{\"name\":\"group1\", \"project\": " + projectId1 + "}", jwtUser1);
        final Response res4 =
                symbolGroupApi.create(projectId2, "{\"name\":\"group2\", \"project\": " + projectId2 + "}", jwtUser2);

        symbolGroupId1 = JsonPath.read(res3.readEntity(String.class), "id");
        symbolGroupId2 = JsonPath.read(res4.readEntity(String.class), "id");
    }

    @Test
    public void shouldNotCreateSymbolIfProjectIdsDoNotMatch() throws Exception {
        final String symbol = createSymbolWithProjectJson(projectId1, "s1");
        final Response res = symbolApi.create(projectId2, symbol, jwtUser1);

        assertEquals(HttpStatus.BAD_REQUEST.value(), res.getStatus());
        assertEquals(0, getNumberOfSymbols(projectId1, jwtUser1));
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
        JSONAssert.assertEquals(symbolNode.toString(), symbolRes, true);

        final Response res2 = symbolGroupApi.getAll(projectId1, jwtUser1);
        final String symbolInGroup = objectMapper.readTree(res2.readEntity(String.class)).get(1).get("symbols").get(0).toString();
        JSONAssert.assertEquals(symbolNode.toString(), symbolInGroup, true);
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
    public void shouldNotCreateASymbolIfNameExists() throws Exception {
        final String symbol1 = createSymbolWithProjectJson(projectId1, "s1");
        final String symbol2 = createSymbolWithProjectJson(projectId1, "s1");

        symbolApi.create(projectId1, symbol1, jwtUser1);
        final Response res = symbolApi.create(projectId1, symbol2, jwtUser1);
        assertEquals(HttpStatus.BAD_REQUEST.value(), res.getStatus());
        assertEquals(1, getNumberOfSymbols(projectId1, jwtUser1));
    }

    @Test
    public void shouldCreateASymbolInAGroup() throws Exception {
        final String symbolJson = createSymbolWithGroupJson(projectId1, symbolGroupId1, "s1");
        final Response res1 = symbolApi.create(projectId1, symbolJson, jwtUser1);
        assertEquals(HttpStatus.CREATED.value(), res1.getStatus());

        final String symbol = res1.readEntity(String.class);
        final int groupId = JsonPath.read(symbol, "$.group");
        assertEquals(symbolGroupId1, groupId);

        final Response res2 = symbolGroupApi.getAll(projectId1, jwtUser1);
        final JsonNode groupNode = objectMapper.readTree(res2.readEntity(String.class));
        assertEquals(1, groupNode.get(1).get("symbols").size());
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
        assertEquals(0, getNumberOfSymbols(projectId1, jwtUser1));

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
        assertEquals(0, getNumberOfSymbols(projectId1, jwtUser1));

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

        final JsonNode groupsNode = objectMapper.readTree(symbolGroupApi.getAll(projectId1, jwtUser1).readEntity(String.class));
        final JsonNode symbolNode = groupsNode.get(1).get("symbols").get(2);

        assertEquals(2, symbolNode.get("steps").size());
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
                + "{\"type\":\"action\", \"disabled\": false, \"action\": {\"type\": \"wait\", \"negated\": false, \"ignoreFailure\": false, \"duration\": 1000}}"
                + ",{\"type\":\"action\", \"disabled\": false, \"action\": {\"type\": \"wait\", \"negated\": false, \"ignoreFailure\": false, \"duration\": 1000}}"
                + "]"
                + "}";
    }

    private String createSymbolWithSymbolStepsJson(int projectId, int groupId, String name) {
        return "{"
                + "\"name\":\"" + name + "\""
                + ",\"project\": " + projectId
                + ",\"group\": " + groupId
                + ",\"steps\": ["
                + "{\"type\":\"symbol\", \"disabled\": false, \"pSymbol\": {\"symbolFromName\": \"s2\", \"parameterValues\": []}}"
                + ",{\"type\":\"symbol\", \"disabled\": false, \"pSymbol\": {\"symbolFromName\": \"s3\", \"parameterValues\": []}}"
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
                + ",\"hidden\": false"
                + ",\"inputs\": []"
                + ",\"outputs\": []"
                + ",\"successOutput\": \"yep\""
                + "}";
    }
}
