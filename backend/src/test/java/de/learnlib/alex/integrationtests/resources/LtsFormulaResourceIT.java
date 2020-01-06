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

package de.learnlib.alex.integrationtests.resources;

import com.jayway.jsonpath.JsonPath;
import de.learnlib.alex.integrationtests.resources.api.LtsFormulaApi;
import de.learnlib.alex.integrationtests.resources.api.ProjectApi;
import de.learnlib.alex.integrationtests.resources.api.UserApi;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.skyscreamer.jsonassert.JSONAssert;

import javax.ws.rs.core.Response;
import java.util.Arrays;
import java.util.List;

public class LtsFormulaResourceIT extends AbstractResourceIT {

    private String jwtUser1;

    private String jwtUser2;

    private int projectId1;

    private int projectId2;

    private LtsFormulaApi api;

    @Before
    public void before() {
        this.api = new LtsFormulaApi(client, port);

        final UserApi userApi = new UserApi(client, port);
        final ProjectApi projectApi = new ProjectApi(client, port);

        userApi.create("{\"email\":\"test1@test.de\",\"username\":\"test1\",\"password\":\"test\"}");
        userApi.create("{\"email\":\"test2@test.de\",\"username\":\"test2\",\"password\":\"test\"}");
        jwtUser1 = userApi.login("test1@test.de", "test");
        jwtUser2 = userApi.login("test2@test.de", "test");

        final Response res1 = projectApi.create("{\"name\":\"test\",\"url\":\"http://localhost:8080\"}", jwtUser1);
        final Response res2 = projectApi.create("{\"name\":\"test\",\"url\":\"http://localhost:8080\"}", jwtUser2);
        projectId1 = JsonPath.read(res1.readEntity(String.class), "id");
        projectId2 = JsonPath.read(res2.readEntity(String.class), "id");
    }

    @Test
    public void shouldCreateAFormula() throws Exception {
        final Response res = api.create(projectId1, "{\"name\":\"test\",\"formula\":\"<> true\"}", jwtUser1);
        Assert.assertEquals(Response.Status.CREATED.getStatusCode(), res.getStatus());

        final String json = res.readEntity(String.class);
        JsonPath.read(json, "$.id");

        Assert.assertEquals(1, getNumberOfFormulas(projectId1, jwtUser1));
    }

    @Test
    public void shouldCreateAFormulaWithoutName() throws Exception {
        final Response res = api.create(projectId1, "{\"formula\":\"<> true\"}", jwtUser1);
        Assert.assertEquals(Response.Status.CREATED.getStatusCode(), res.getStatus());

        final String json = res.readEntity(String.class);
        JsonPath.read(json, "$.id");

        Assert.assertEquals(1, getNumberOfFormulas(projectId1, jwtUser1));
    }

    @Test
    public void shouldFailToCreateFormulaWithoutFormula() throws Exception {
        final Response res = api.create(projectId1, "{\"name\":\"test\"}", jwtUser1);
        Assert.assertEquals(Response.Status.BAD_REQUEST.getStatusCode(), res.getStatus());
        Assert.assertEquals(0, getNumberOfFormulas(projectId1, jwtUser1));
    }

    @Test
    public void shouldFailToCreateFormulaWithEmptyFormula() throws Exception {
        final Response res = api.create(projectId1, "{\"name\":\"test\",\"formula\":\"\"}", jwtUser1);
        Assert.assertEquals(Response.Status.BAD_REQUEST.getStatusCode(), res.getStatus());
        Assert.assertEquals(0, getNumberOfFormulas(projectId1, jwtUser1));
    }


    @Test
    public void shouldNotCreateFormulaInAnotherUsersProject() throws Exception {
        final Response res = api.create(projectId2, "{\"name\":\"test\",\"formula\":\"<> true\"}", jwtUser1);
        Assert.assertEquals(Response.Status.UNAUTHORIZED.getStatusCode(), res.getStatus());
        Assert.assertEquals(0, getNumberOfFormulas(projectId1, jwtUser1));
        Assert.assertEquals(0, getNumberOfFormulas(projectId2, jwtUser2));
    }

    @Test
    public void shouldDeleteFormula() throws Exception {
        final int formulaId = createFormula(projectId1, "{\"name\":\"test\",\"formula\":\"<> true\"}", jwtUser1);
        final Response res = api.delete(projectId1, formulaId, jwtUser1);
        Assert.assertEquals(Response.Status.NO_CONTENT.getStatusCode(), res.getStatus());
        Assert.assertEquals(0, getNumberOfFormulas(projectId1, jwtUser1));
    }

    @Test
    public void shouldFailToDeleteNonExistingFormula() {
        final Response res = api.delete(projectId1, -1, jwtUser1);
        Assert.assertEquals(Response.Status.NOT_FOUND.getStatusCode(), res.getStatus());
    }

    @Test
    public void shouldFailToDeleteFormulaOfAnotherUser() throws Exception {
        final int formulaId = createFormula(projectId1, "{\"name\":\"test\",\"formula\":\"<> true\"}", jwtUser1);
        final Response res = api.delete(projectId2, formulaId, jwtUser2);
        Assert.assertEquals(Response.Status.UNAUTHORIZED.getStatusCode(), res.getStatus());
        Assert.assertEquals(1, getNumberOfFormulas(projectId1, jwtUser1));
    }

    @Test
    public void shouldDeleteMultipleFormulas() throws Exception {
        final List<Integer> ids = Arrays.asList(
                createFormula(projectId1, "{\"name\":\"test\",\"formula\":\"<> true\"}", jwtUser1),
                createFormula(projectId1, "{\"name\":\"test\",\"formula\":\"<> true\"}", jwtUser1)
        );
        final Response res = api.delete(projectId1, ids, jwtUser1);
        Assert.assertEquals(Response.Status.NO_CONTENT.getStatusCode(), res.getStatus());
        Assert.assertEquals(0, getNumberOfFormulas(projectId1, jwtUser1));
    }

    @Test
    public void shouldFailToDeleteMultipleFormulasIfOneDoesNotExist() throws Exception {
        final List<Integer> ids = Arrays.asList(
                createFormula(projectId1, "{\"name\":\"test\",\"formula\":\"<> true\"}", jwtUser1),
                createFormula(projectId1, "{\"name\":\"test\",\"formula\":\"<> true\"}", jwtUser1),
                -1
        );
        final Response res = api.delete(projectId1, ids, jwtUser1);
        Assert.assertEquals(Response.Status.NOT_FOUND.getStatusCode(), res.getStatus());
        Assert.assertEquals(ids.size() - 1, getNumberOfFormulas(projectId1, jwtUser1));
    }

    @Test
    public void shouldUpdateAFormula() throws Exception {
        final int formulaId = createFormula(projectId1, "{\"name\":\"test\",\"formula\":\"<> true\"}", jwtUser1);
        final String updatedFormula = "{\"name\":\"newName\",\"id\":" + formulaId + ",\"formula\":\"<> false\",\"projectId\": " + projectId1 + "}";

        final Response res = api.update(projectId1, formulaId, updatedFormula, jwtUser1);
        Assert.assertEquals(Response.Status.OK.getStatusCode(), res.getStatus());
        JSONAssert.assertEquals(updatedFormula, res.readEntity(String.class), true);
        Assert.assertEquals(1, getNumberOfFormulas(projectId1, jwtUser1));
    }

    @Test
    public void shouldFailToUpdateIfFormulaIsEmpty() throws Exception {
        final int formulaId = createFormula(projectId1, "{\"name\":\"test\",\"formula\":\"<> true\"}", jwtUser1);
        final String pre = api.getAll(projectId1, jwtUser1).readEntity(String.class);

        final String updatedFormula = "{\"name\":\"newName\",\"id\":" + formulaId + ",\"formula\":\"\",\"projectId\": " + projectId1 + "}";
        final Response res = api.update(projectId1, formulaId, updatedFormula, jwtUser1);
        Assert.assertEquals(Response.Status.BAD_REQUEST.getStatusCode(), res.getStatus());
        JSONAssert.assertEquals(pre, api.getAll(projectId1, jwtUser1).readEntity(String.class), true);
    }

    private int createFormula(int projectId, String formula, String jwt) {
        final Response res = api.create(projectId, formula, jwt);
        return JsonPath.read(res.readEntity(String.class), "$.id");
    }

    private int getNumberOfFormulas(int projectId1, String jwt) throws Exception {
        final Response res = api.getAll(projectId1, jwt);
        return objectMapper.readTree(res.readEntity(String.class)).size();
    }
}
