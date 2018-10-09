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
import com.fasterxml.jackson.databind.ObjectMapper;
import com.jayway.jsonpath.JsonPath;
import de.learnlib.alex.integrationtests.resources.api.ProjectApi;
import de.learnlib.alex.integrationtests.resources.api.SymbolApi;
import de.learnlib.alex.integrationtests.resources.api.SymbolParameterApi;
import de.learnlib.alex.integrationtests.resources.api.UserApi;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;

import javax.ws.rs.core.Response;

public class SymbolParameterResourceIT extends AbstractResourceIT {

    private static ObjectMapper om = new ObjectMapper();

    private SymbolParameterApi symbolParameterApi;

    private SymbolApi symbolApi;

    private String jwtUser1;

    private int projectId;

    private int symbolId;

    @Before
    public void pre() {
        this.symbolParameterApi = new SymbolParameterApi(client, port);

        final UserApi userApi = new UserApi(client, port);
        userApi.create("{\"email\":\"test1@test.de\",\"password\":\"test\"}");
        jwtUser1 = userApi.login("test1@test.de", "test");

        final ProjectApi projectApi = new ProjectApi(client, port);
        final Response res1 = projectApi.create("{\"name\":\"test\",\"urls\":[{\"default\":true,\"url\":\"http://test\"}]}", jwtUser1);
        Assert.assertEquals(res1.getStatus(), Response.Status.CREATED.getStatusCode());
        this.projectId = JsonPath.read(res1.readEntity(String.class), "$.id");

        this.symbolApi = new SymbolApi(client, port);
        final Response res2 = symbolApi.create(projectId, "{\"name\":\"s1\",\"steps\":[]}", jwtUser1);
        Assert.assertEquals(res2.getStatus(), Response.Status.CREATED.getStatusCode());
        this.symbolId = JsonPath.read(res2.readEntity(String.class), "$.id");
    }

    @Test
    public void shouldCreateAPublicInputStringParameter() throws Exception {
        final Response res = symbolParameterApi.create(projectId, symbolId, createInputStringParam(symbolId, "test", false), jwtUser1);
        Assert.assertEquals(res.getStatus(), Response.Status.CREATED.getStatusCode());

        final JsonNode symbol = getSymbol();
        final JsonNode inputs = symbol.get("inputs");

        Assert.assertEquals(1, inputs.size());
        Assert.assertTrue(inputs.get(0).hasNonNull("id"));
        Assert.assertFalse(inputs.get(0).get("private").asBoolean());
        Assert.assertEquals("STRING", inputs.get(0).get("parameterType").asText());
    }

    @Test
    public void shouldCreateAPrivateInputStringParameter() throws Exception {
        final Response res = symbolParameterApi.create(projectId, symbolId, createInputStringParam(symbolId, "test", true), jwtUser1);
        Assert.assertEquals(res.getStatus(), Response.Status.CREATED.getStatusCode());

        final JsonNode symbol = getSymbol();
        final JsonNode inputs = symbol.get("inputs");

        Assert.assertEquals(1, inputs.size());
        Assert.assertTrue(inputs.get(0).hasNonNull("id"));
        Assert.assertTrue(inputs.get(0).get("private").asBoolean());
        Assert.assertEquals("STRING", inputs.get(0).get("parameterType").asText());
    }

    @Test
    public void shouldCreateAPublicInputCounterParameter() throws Exception {
        final Response res = symbolParameterApi.create(projectId, symbolId, createInputCounterParam(symbolId, "test", false), jwtUser1);
        Assert.assertEquals(res.getStatus(), Response.Status.CREATED.getStatusCode());

        final JsonNode symbol = getSymbol();
        final JsonNode inputs = symbol.get("inputs");

        Assert.assertEquals(1, inputs.size());
        Assert.assertTrue(inputs.get(0).hasNonNull("id"));
        Assert.assertFalse(inputs.get(0).get("private").asBoolean());
        Assert.assertEquals("COUNTER", inputs.get(0).get("parameterType").asText());
    }

    @Test
    public void shouldCreateAPrivateInputCounterParameter() throws Exception {
        final Response res = symbolParameterApi.create(projectId, symbolId, createInputCounterParam(symbolId, "test", true), jwtUser1);
        Assert.assertEquals(res.getStatus(), Response.Status.CREATED.getStatusCode());

        final JsonNode symbol = getSymbol();
        final JsonNode inputs = symbol.get("inputs");

        Assert.assertEquals(1, inputs.size());
        Assert.assertTrue(inputs.get(0).hasNonNull("id"));
        Assert.assertTrue(inputs.get(0).get("private").asBoolean());
        Assert.assertEquals("COUNTER", inputs.get(0).get("parameterType").asText());
    }

    @Test
    public void shouldCreateAnOutputStringParameter() throws Exception {
        final Response res = symbolParameterApi.create(projectId, symbolId, createOutputStringParam(symbolId, "test"), jwtUser1);
        Assert.assertEquals(res.getStatus(), Response.Status.CREATED.getStatusCode());

        final JsonNode symbol = getSymbol();
        final JsonNode inputs = symbol.get("outputs");

        Assert.assertEquals(1, inputs.size());
        Assert.assertTrue(inputs.get(0).hasNonNull("id"));
        Assert.assertEquals("STRING", inputs.get(0).get("parameterType").asText());
    }

    @Test
    public void shouldCreateAnOutputCounterParameter() throws Exception {
        final Response res = symbolParameterApi.create(projectId, symbolId, createOutputCounterParam(symbolId, "test"), jwtUser1);
        Assert.assertEquals(res.getStatus(), Response.Status.CREATED.getStatusCode());

        final JsonNode symbol = getSymbol();
        final JsonNode inputs = symbol.get("outputs");

        Assert.assertEquals(1, inputs.size());
        Assert.assertTrue(inputs.get(0).hasNonNull("id"));
        Assert.assertEquals("COUNTER", inputs.get(0).get("parameterType").asText());
    }

    @Test
    public void shouldNotCreateInputParameterIfNameIsTaken() throws Exception {
        symbolParameterApi.create(projectId, symbolId, createInputStringParam(symbolId, "test", false), jwtUser1);
        final Response res1 = symbolParameterApi.create(projectId, symbolId, createInputStringParam(symbolId, "test", false), jwtUser1);
        Assert.assertEquals(Response.Status.BAD_REQUEST.getStatusCode(), res1.getStatus());

        final Response res2 = symbolParameterApi.create(projectId, symbolId, createInputCounterParam(symbolId, "test", false), jwtUser1);
        Assert.assertEquals(Response.Status.BAD_REQUEST.getStatusCode(), res2.getStatus());

        final JsonNode symbol = getSymbol();
        Assert.assertEquals(1, symbol.get("inputs").size());
    }

    @Test
    public void shouldNotCreateOutputParameterIfNameIsTaken() throws Exception {
        symbolParameterApi.create(projectId, symbolId, createOutputStringParam(symbolId, "test"), jwtUser1);
        final Response res1 = symbolParameterApi.create(projectId, symbolId, createOutputStringParam(symbolId, "test"), jwtUser1);
        Assert.assertEquals(Response.Status.BAD_REQUEST.getStatusCode(), res1.getStatus());

        final Response res2 = symbolParameterApi.create(projectId, symbolId, createOutputCounterParam(symbolId, "test"), jwtUser1);
        Assert.assertEquals(Response.Status.BAD_REQUEST.getStatusCode(), res2.getStatus());

        final JsonNode symbol = getSymbol();
        Assert.assertEquals(1, symbol.get("outputs").size());
    }

    @Test
    public void shouldUpdateInputParameter() {
        // TODO
    }

    @Test
    public void shouldUpdateOutputParameter() {
        // TODO
    }

    @Test
    public void shouldNotUpdateInputParameterIfNameIsTaken() {
        // TODO
    }

    @Test
    public void shouldNotUpdateOutputParameterIfNameIsTaken() {
        // TODO
    }

    @Test
    public void shouldDeleteInputParameter() {
        // TODO
    }

    @Test
    public void shouldDeleteOutputParameter() {
        // TODO
    }

    @Test
    public void shouldDeleteReferencesToParameterInTestsIfParameterIsDeleted() {
        // TODO
    }

    @Test
    public void shouldDeleteReferencesToParameterInLearnerResultsIfParameterIsDeleted() {
        // TODO
    }

    @Test
    public void shouldDeleteReferencesToParameterInSymbolStepsIfParameterIsDeleted() {
        // TODO
    }

    private JsonNode getSymbol() throws Exception {
        final Response res = symbolApi.getAll(projectId, jwtUser1);
        final String symbols = res.readEntity(String.class);
        return om.readTree(symbols).get(0);
    }

    private String createInputParam(int symbolId, String name, boolean isPrivate, String parameterType) {
        return "{\"symbol\":\"" + symbolId + "\""
                + ",\"name\":\"" + name + "\""
                + ",\"private\":" + (isPrivate ? "true": "false")
                + ",\"type\":\"input\""
                + ",\"parameterType\": \"" + parameterType + "\"}";
    }

    private String createOutputParam(int symbolId, String name, String parameterType) {
        return "{\"symbol\":\"" + symbolId + "\""
                + ",\"name\":\"" + name + "\""
                + ",\"type\":\"output\""
                + ",\"parameterType\": \"" + parameterType + "\"}";
    }

    private String createInputStringParam(int symbolId, String name, boolean isPrivate) {
        return createInputParam(symbolId, name, isPrivate, "STRING");
    }

    private String createInputCounterParam(int symbolId, String name, boolean isPrivate) {
        return createInputParam(symbolId, name, isPrivate, "COUNTER");
    }

    private String createOutputStringParam(int symbolId, String name) {
        return createOutputParam(symbolId, name, "STRING");
    }

    private String createOutputCounterParam(int symbolId, String name) {
        return createOutputParam(symbolId, name, "COUNTER");
    }
}
