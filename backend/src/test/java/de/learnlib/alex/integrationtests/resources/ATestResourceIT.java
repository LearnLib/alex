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
import com.jayway.jsonpath.JsonPath;
import de.learnlib.alex.integrationtests.resources.api.ProjectApi;
import de.learnlib.alex.integrationtests.resources.api.SymbolApi;
import de.learnlib.alex.integrationtests.resources.api.TestApi;
import de.learnlib.alex.integrationtests.resources.api.UserApi;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;

import javax.ws.rs.core.Response;
import java.util.Arrays;

public class ATestResourceIT extends AbstractResourceIT {

    private TestApi testApi;

    private String jwtUser1;

    private String jwtUser2;

    private int projectId;

    private int rootTestSuiteId;

    @Before
    public void pre() {
        this.testApi = new TestApi(client, port);

        final UserApi userApi = new UserApi(client, port);
        userApi.create("{\"email\":\"test1@test.de\",\"password\":\"test\"}");
        userApi.create("{\"email\":\"test2@test.de\",\"password\":\"test\"}");
        jwtUser1 = userApi.login("test1@test.de", "test");
        jwtUser2 = userApi.login("test2@test.de", "test");

        final ProjectApi projectApi = new ProjectApi(client, port);
        final Response res1 = projectApi.create("{\"name\":\"test\",\"urls\":[{\"url\":\"http://localhost:8080\"}]}", jwtUser1);
        projectId = JsonPath.read(res1.readEntity(String.class), "$.id");

        final SymbolApi symbolApi = new SymbolApi(client, port);
        symbolApi.create(projectId, "{\"name\":\"s1\"}", jwtUser1);
        symbolApi.create(projectId, "{\"name\":\"s2\"}", jwtUser1);

        final Response res = testApi.getRoot(projectId, jwtUser1);
        this.rootTestSuiteId = JsonPath.read(res.readEntity(String.class), "$.id");
    }

    @Test
    public void shouldCreateATestCase() {
        final String tc = "{\"name\": \"tc\", \"type\": \"case\"}";
        final Response res = testApi.create(projectId, tc, jwtUser1);
        Assert.assertEquals(Response.Status.CREATED.getStatusCode(), res.getStatus());

        final String tcRes = res.readEntity(String.class);
        Assert.assertEquals("case", JsonPath.read(tcRes, "$.type")); // is test case?
        Assert.assertEquals(Integer.valueOf(rootTestSuiteId), JsonPath.read(tcRes, "$.parent")); // created in root?
        Assert.assertEquals(Integer.valueOf(projectId), JsonPath.read(tcRes, "$.project"));
    }

    @Test
    public void shouldCreateATestSuite() {
        final String ts = "{\"name\": \"ts\", \"type\": \"suite\"}";
        final Response res = testApi.create(projectId, ts, jwtUser1);
        Assert.assertEquals(Response.Status.CREATED.getStatusCode(), res.getStatus());

        final String tsRes = res.readEntity(String.class);
        Assert.assertEquals("suite", JsonPath.read(tsRes, "$.type")); // is test suite?
        Assert.assertEquals(Integer.valueOf(rootTestSuiteId), JsonPath.read(tsRes, "$.parent")); // created in root?
        Assert.assertEquals(Integer.valueOf(projectId), JsonPath.read(tsRes, "$.project"));
        Assert.assertEquals("[]", JsonPath.read(tsRes, "$.tests").toString());
    }

    @Test
    public void shouldCreateTestCaseInTestSuite() throws Exception {
        final String ts = "{\"name\": \"ts\", \"type\": \"suite\"}";
        final Response res1 = testApi.create(projectId, ts, jwtUser1);
        final int tsId = JsonPath.read(res1.readEntity(String.class), "$.id");

        final String tc = "{\"name\": \"tc\", \"type\": \"suite\", \"parent\": " + tsId + "}";
        final Response res2 = testApi.create(projectId, tc, jwtUser1);
        Assert.assertEquals(Response.Status.CREATED.getStatusCode(), res2.getStatus());

        final String tcRes = res2.readEntity(String.class);
        Assert.assertEquals(Integer.valueOf(tsId), JsonPath.read(tcRes, "$.parent")); // correct parent?

        final Response res3 = testApi.get(projectId, tsId, jwtUser1);
        final JsonNode tsNode = objectMapper.readTree(res3.readEntity(String.class));
        Assert.assertEquals(tcRes, tsNode.get("tests").get(0).toString()); // test case in suite?
    }

    @Test
    public void shouldCreateTestSuiteInTestSuite() throws Exception {
        final String ts1 = "{\"name\": \"ts\", \"type\": \"suite\"}";
        final Response res1 = testApi.create(projectId, ts1, jwtUser1);
        final int ts1Id = JsonPath.read(res1.readEntity(String.class), "$.id");

        final String ts2 = "{\"name\": \"ts\", \"type\": \"suite\", \"parent\": " + ts1Id + "}";
        final Response res2 = testApi.create(projectId, ts2, jwtUser1);
        Assert.assertEquals(Response.Status.CREATED.getStatusCode(), res2.getStatus());

        final String ts2Res = res2.readEntity(String.class);
        Assert.assertEquals(Integer.valueOf(ts1Id), JsonPath.read(ts2Res, "$.parent")); // correct parent?

        final Response res3 = testApi.get(projectId, ts1Id, jwtUser1);
        final JsonNode ts1Node = objectMapper.readTree(res3.readEntity(String.class));
        Assert.assertEquals(ts2Res, ts1Node.get("tests").get(0).toString()); // test case in suite?
    }

    @Test
    public void shouldFailToCreateTestWithInvalidParent() throws Exception {
        final String tc = "{\"name\": \"tc\", \"type\": \"case\", \"parent\": -1}";
        final Response res1 = testApi.create(projectId, tc, jwtUser1);
        Assert.assertEquals(Response.Status.NOT_FOUND.getStatusCode(), res1.getStatus());

        final Response res2 = testApi.getRoot(projectId, jwtUser1);
        final JsonNode rootTsNode = objectMapper.readTree(res2.readEntity(String.class));
        Assert.assertEquals("[]", rootTsNode.get("tests").toString()); // no test case created?
    }

    @Test
    public void shouldIncrementNameOfTestIfNameExistsInTestSuite() {
        final String tc1 = "{\"name\": \"tc\", \"type\": \"case\"}";
        testApi.create(projectId, tc1, jwtUser1);

        final Response res1 = testApi.create(projectId, tc1, jwtUser1);
        Assert.assertEquals(Response.Status.CREATED.getStatusCode(), res1.getStatus());
        Assert.assertEquals("tc - 1", JsonPath.read(res1.readEntity(String.class), "$.name"));

        final Response res2 = testApi.create(projectId, tc1, jwtUser1);
        Assert.assertEquals(Response.Status.CREATED.getStatusCode(), res2.getStatus());
        Assert.assertEquals("tc - 2", JsonPath.read(res2.readEntity(String.class), "$.name"));
    }

    @Test
    public void shouldCreateTests() throws Exception {
        final String tests = "["
                + "{\"name\": \"tc1\", \"type\": \"case\"}"
                + ",{\"name\": \"tc2\", \"type\": \"case\"}"
                + ",{\"name\": \"ts\", \"type\": \"suite\"}]";

        final Response res1 = testApi.createMany(projectId, tests, jwtUser1);
        Assert.assertEquals(Response.Status.CREATED.getStatusCode(), res1.getStatus());

        final Response res2 = testApi.getRoot(projectId, jwtUser1);
        final JsonNode rootNode = objectMapper.readTree(res2.readEntity(String.class));
        Assert.assertEquals(3, rootNode.get("tests").size());
    }

    @Test
    public void shouldFailToCreateTestsIfOneCannotBeCreated() throws Exception {
        final String tests = "["
                + "{\"name\": \"tc1\", \"type\": \"case\"}"
                + ",{\"name\": \"tc2\", \"type\": \"case\", \"parent\": -1}"
                + ",{\"name\": \"ts\", \"type\": \"suite\"}]";

        final Response res1 = testApi.createMany(projectId, tests, jwtUser1);
        Assert.assertEquals(Response.Status.NOT_FOUND.getStatusCode(), res1.getStatus());

        final Response res2 = testApi.getRoot(projectId, jwtUser1);
        final JsonNode rootNode = objectMapper.readTree(res2.readEntity(String.class));
        Assert.assertEquals(0, rootNode.get("tests").size());
    }

    @Test
    public void shouldGetTest() {
        final String tc = "{\"name\": \"tc\", \"type\": \"case\"}";
        final Response res1 = testApi.create(projectId, tc, jwtUser1);
        final String tcRes = res1.readEntity(String.class);

        final Response res2 = testApi.get(projectId, JsonPath.read(tcRes, "$.id"), jwtUser1);
        Assert.assertEquals(Response.Status.OK.getStatusCode(), res2.getStatus());
        Assert.assertEquals(tcRes, res2.readEntity(String.class));
    }

    @Test
    public void shouldFailToGetUnknownTest() {
        final Response res = testApi.get(projectId, -1, jwtUser1);
        Assert.assertEquals(Response.Status.NOT_FOUND.getStatusCode(), res.getStatus());
    }

    @Test
    public void shouldGetAllTestCasesFlat() throws Exception {
        final String tc1 = "{\"name\": \"tc1\", \"type\": \"case\"}";
        testApi.create(projectId, tc1, jwtUser1);

        final String ts = "{\"name\": \"tc2\", \"type\": \"suite\"}";
        final Response res2 = testApi.create(projectId, ts, jwtUser1);
        final int tsId = JsonPath.read(res2.readEntity(String.class), "$.id");

        final String tc2 = "{\"name\": \"tc2\", \"type\": \"case\", \"parent\": " + tsId + "}";
        testApi.create(projectId, tc2, jwtUser1);

        final Response res4 = testApi.getAll(projectId, jwtUser1);
        Assert.assertEquals(2, objectMapper.readTree(res4.readEntity(String.class)).size());
    }

    @Test
    public void shouldUpdateTest() {
        // TODO
    }

    @Test
    public void shouldCreateTestWithSameNameInDifferentTestSuites() {
        // TODO
    }

    @Test
    public void shouldMoveTestCase() {
        // TODO
    }

    @Test
    public void shouldMoveTestSuite() {
        // TODO
    }

    @Test
    public void shouldNotMoveRootTestSuite() throws Exception {
        final String ts = "{\"name\": \"ts\", \"type\": \"suite\"}";
        final Response res1 = testApi.create(projectId, ts, jwtUser1);
        final int id = JsonPath.read(res1.readEntity(String.class), "$.id");

        final Response res2 = testApi.move(projectId, rootTestSuiteId, id, jwtUser1);
        Assert.assertEquals(Response.Status.BAD_REQUEST.getStatusCode(), res2.getStatus());

        final Response res3 = testApi.getRoot(projectId, jwtUser1);
        Assert.assertTrue(objectMapper.readTree(res3.readEntity(String.class)).get("parent").isNull());
    }

    @Test
    public void shouldFailToMoveTestToNonExistingTestSuite() {
        final String ts = "{\"name\": \"ts\", \"type\": \"suite\"}";
        final Response res1 = testApi.create(projectId, ts, jwtUser1);
        final int id = JsonPath.read(res1.readEntity(String.class), "$.id");

        final Response res2 = testApi.move(projectId, id, -1, jwtUser1);
        Assert.assertEquals(Response.Status.NOT_FOUND.getStatusCode(), res2.getStatus());
    }

    @Test
    public void shouldNotMoveTestSuiteToItsDescendant() {
        // TODO
    }

    @Test
    public void shouldNotMoveTestToTestCase() {
        // TODO
    }

    @Test
    public void shouldNotMoveTestToItself() {
        // TODO
    }

    @Test
    public void shouldDeleteTestCase() throws Exception {
        final String tc1 = "{\"name\": \"tc1\", \"type\": \"case\"}";
        final Response res1 = testApi.create(projectId, tc1, jwtUser1);
        final int id = JsonPath.read(res1.readEntity(String.class), "$.id");

        final Response res2 = testApi.delete(projectId, id, jwtUser1);
        Assert.assertEquals(Response.Status.NO_CONTENT.getStatusCode(), res2.getStatus());
        Assert.assertEquals(0, getNumberOfTestsInRoot());
    }

    @Test
    public void shouldNotDeleteRootTestSuite() {
        final Response res1 = testApi.delete(projectId, rootTestSuiteId, jwtUser1);
        Assert.assertEquals(Response.Status.BAD_REQUEST.getStatusCode(), res1.getStatus());

        final Response res2 = testApi.getRoot(projectId, jwtUser1);
        Assert.assertEquals(Response.Status.OK.getStatusCode(), res2.getStatus());
    }

    @Test
    public void shouldDeleteMultipleTests() throws Exception {
        final String tc1 = "{\"name\": \"tc1\", \"type\": \"case\"}";
        final Response res1 = testApi.create(projectId, tc1, jwtUser1);
        final int tc1Id = JsonPath.read(res1.readEntity(String.class), "$.id");

        final String tc2 = "{\"name\": \"tc2\", \"type\": \"case\"}";
        final Response res2 = testApi.create(projectId, tc2, jwtUser1);
        final int tc2Id = JsonPath.read(res2.readEntity(String.class), "$.id");

        final Response res3 = testApi.deleteMany(projectId, Arrays.asList(tc1Id, tc2Id), jwtUser1);
        Assert.assertEquals(Response.Status.NO_CONTENT.getStatusCode(), res3.getStatus());
        Assert.assertEquals(0, getNumberOfTestsInRoot());
    }

    @Test
    public void shouldNotDeleteMultipleTestsIfOneFails() throws Exception {
        final String tc1 = "{\"name\": \"tc1\", \"type\": \"case\"}";
        final Response res1 = testApi.create(projectId, tc1, jwtUser1);
        final int tc1Id = JsonPath.read(res1.readEntity(String.class), "$.id");

        final Response res2 = testApi.deleteMany(projectId, Arrays.asList(tc1Id, -1), jwtUser1);
        Assert.assertEquals(Response.Status.NOT_FOUND.getStatusCode(), res2.getStatus());
        Assert.assertEquals(1, getNumberOfTestsInRoot());
    }

    private int getNumberOfTestsInRoot() throws Exception {
        final Response res = testApi.getRoot(projectId, jwtUser1);
        final JsonNode rootNode = objectMapper.readTree(res.readEntity(String.class));
        return rootNode.get("tests").size();
    }
}
