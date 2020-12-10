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

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.jayway.jsonpath.JsonPath;
import de.learnlib.alex.auth.entities.User;
import de.learnlib.alex.data.entities.ParameterizedSymbol;
import de.learnlib.alex.data.entities.Project;
import de.learnlib.alex.integrationtests.SpringRestError;
import de.learnlib.alex.integrationtests.resources.api.ProjectApi;
import de.learnlib.alex.integrationtests.resources.api.SymbolApi;
import de.learnlib.alex.integrationtests.resources.api.TestApi;
import de.learnlib.alex.integrationtests.resources.api.TestReportApi;
import de.learnlib.alex.integrationtests.resources.api.UserApi;
import de.learnlib.alex.integrationtests.resources.utils.SymbolUtils;
import de.learnlib.alex.integrationtests.websocket.util.TestPresenceServiceWSMessages;
import de.learnlib.alex.integrationtests.websocket.util.WebSocketUser;
import de.learnlib.alex.learning.entities.WebDriverConfig;
import de.learnlib.alex.testing.entities.TestCase;
import de.learnlib.alex.testing.entities.TestCaseResult;
import de.learnlib.alex.testing.entities.TestCaseStep;
import de.learnlib.alex.testing.entities.TestExecutionConfig;
import de.learnlib.alex.testing.entities.TestExecutionResult;
import de.learnlib.alex.testing.entities.TestQueueItem;
import de.learnlib.alex.testing.entities.TestReport;
import de.learnlib.alex.testing.entities.TestSuite;
import de.learnlib.alex.testing.entities.TestSuiteResult;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.springframework.http.HttpStatus;

import javax.ws.rs.core.Response;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.concurrent.TimeUnit;

import static org.awaitility.Awaitility.await;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;

public class ATestResourceIT extends AbstractResourceIT {

    private TestApi testApi;
    private SymbolApi symbolApi;
    private TestReportApi testReportApi;
    private SymbolUtils symbolUtils;

    private String jwtUser1;

    private String jwtUser2;

    private int userId1;

    private int userId2;

    private Project project;
    private int projectId;

    private int rootTestSuiteId;

    private ProjectApi projectApi;

    private TestPresenceServiceWSMessages testPresenceServiceWSMessages;

    @Before
    public void pre() {
        this.testApi = new TestApi(client, port);
        this.testPresenceServiceWSMessages = new TestPresenceServiceWSMessages();

        final UserApi userApi = new UserApi(client, port);
        final Response res1 = userApi.create("{\"email\":\"test1@test.de\", \"username\":\"test1\", \"password\":\"test\"}");
        final Response res2 = userApi.create("{\"email\":\"test2@test.de\", \"username\":\"test2\", \"password\":\"test\"}");

        userId1 = res1.readEntity(User.class).getId().intValue();
        userId2 = res2.readEntity(User.class).getId().intValue();

        jwtUser1 = userApi.login("test1@test.de", "test");
        jwtUser2 = userApi.login("test2@test.de", "test");

        projectApi = new ProjectApi(client, port);
        final Response res3 = projectApi.create("{\"name\":\"test\",\"url\":\"http://localhost:8080\"}", jwtUser1);
        project = res3.readEntity(Project.class);
        projectId = project.getId().intValue();

        symbolApi = new SymbolApi(client, port);
        symbolUtils = new SymbolUtils(symbolApi);

        testReportApi = new TestReportApi(client, port);

        final SymbolApi symbolApi = new SymbolApi(client, port);
        symbolApi.create(projectId, "{\"name\":\"s1\"}", jwtUser1);
        symbolApi.create(projectId, "{\"name\":\"s2\"}", jwtUser1);

        final Response res4 = testApi.getRoot(projectId, jwtUser1);
        this.rootTestSuiteId = JsonPath.read(res4.readEntity(String.class), "$.id");
    }

    @Test
    public void shouldCreateATestCase() {
        final String tc = "{\"name\": \"tc\", \"type\": \"case\"}";
        final Response res = testApi.create(projectId, tc, jwtUser1);
        assertEquals(Response.Status.CREATED.getStatusCode(), res.getStatus());

        final String tcRes = res.readEntity(String.class);
        assertEquals("case", JsonPath.read(tcRes, "$.type")); // is test case?
        assertEquals(Integer.valueOf(rootTestSuiteId), JsonPath.read(tcRes, "$.parent")); // created in root?
        assertEquals(Integer.valueOf(projectId), JsonPath.read(tcRes, "$.project"));
    }

    @Test
    public void shouldCreateATestSuite() {
        final String ts = "{\"name\": \"ts\", \"type\": \"suite\"}";
        final Response res = testApi.create(projectId, ts, jwtUser1);
        assertEquals(Response.Status.CREATED.getStatusCode(), res.getStatus());

        final String tsRes = res.readEntity(String.class);
        assertEquals("suite", JsonPath.read(tsRes, "$.type")); // is test suite?
        assertEquals(Integer.valueOf(rootTestSuiteId), JsonPath.read(tsRes, "$.parent")); // created in root?
        assertEquals(Integer.valueOf(projectId), JsonPath.read(tsRes, "$.project"));
        assertEquals("[]", JsonPath.read(tsRes, "$.tests").toString());
    }

    @Test
    public void shouldCreateTestCaseInTestSuite() throws Exception {
        final String ts = "{\"name\": \"ts\", \"type\": \"suite\"}";
        final Response res1 = testApi.create(projectId, ts, jwtUser1);
        final int tsId = JsonPath.read(res1.readEntity(String.class), "$.id");

        final String tc = "{\"name\": \"tc\", \"type\": \"suite\", \"parent\": " + tsId + "}";
        final Response res2 = testApi.create(projectId, tc, jwtUser1);
        assertEquals(Response.Status.CREATED.getStatusCode(), res2.getStatus());

        final String tcRes = res2.readEntity(String.class);
        assertEquals(Integer.valueOf(tsId), JsonPath.read(tcRes, "$.parent")); // correct parent?

        final Response res3 = testApi.get(projectId, tsId, jwtUser1);
        final JsonNode tsNode = objectMapper.readTree(res3.readEntity(String.class));
        assertEquals(tcRes, tsNode.get("tests").get(0).toString()); // test case in suite?
    }

    @Test
    public void shouldCreateTestSuiteInTestSuite() throws Exception {
        final String ts1 = "{\"name\": \"ts\", \"type\": \"suite\"}";
        final Response res1 = testApi.create(projectId, ts1, jwtUser1);
        final int ts1Id = JsonPath.read(res1.readEntity(String.class), "$.id");

        final String ts2 = "{\"name\": \"ts\", \"type\": \"suite\", \"parent\": " + ts1Id + "}";
        final Response res2 = testApi.create(projectId, ts2, jwtUser1);
        assertEquals(Response.Status.CREATED.getStatusCode(), res2.getStatus());

        final String ts2Res = res2.readEntity(String.class);
        assertEquals(Integer.valueOf(ts1Id), JsonPath.read(ts2Res, "$.parent")); // correct parent?

        final Response res3 = testApi.get(projectId, ts1Id, jwtUser1);
        final JsonNode ts1Node = objectMapper.readTree(res3.readEntity(String.class));
        assertEquals(ts2Res, ts1Node.get("tests").get(0).toString()); // test case in suite?
    }

    @Test
    public void shouldFailToCreateTestWithInvalidParent() throws Exception {
        final String tc = "{\"name\": \"tc\", \"type\": \"case\", \"parent\": -1}";
        final Response res1 = testApi.create(projectId, tc, jwtUser1);
        assertEquals(Response.Status.NOT_FOUND.getStatusCode(), res1.getStatus());

        final Response res2 = testApi.getRoot(projectId, jwtUser1);
        final JsonNode rootTsNode = objectMapper.readTree(res2.readEntity(String.class));
        assertEquals("[]", rootTsNode.get("tests").toString()); // no test case created?
    }

    @Test
    public void shouldIncrementNameOfTestIfNameExistsInTestSuite() {
        final String tc1 = "{\"name\": \"tc\", \"type\": \"case\"}";
        testApi.create(projectId, tc1, jwtUser1);

        final Response res1 = testApi.create(projectId, tc1, jwtUser1);
        assertEquals(Response.Status.CREATED.getStatusCode(), res1.getStatus());
        assertEquals("tc - 1", JsonPath.read(res1.readEntity(String.class), "$.name"));

        final Response res2 = testApi.create(projectId, tc1, jwtUser1);
        assertEquals(Response.Status.CREATED.getStatusCode(), res2.getStatus());
        assertEquals("tc - 2", JsonPath.read(res2.readEntity(String.class), "$.name"));
    }

    @Test
    public void shouldCreateTests() throws Exception {
        final String tests = "["
                + "{\"name\": \"tc1\", \"type\": \"case\"}"
                + ",{\"name\": \"tc2\", \"type\": \"case\"}"
                + ",{\"name\": \"ts\", \"type\": \"suite\"}]";

        final Response res1 = testApi.createMany(projectId, tests, jwtUser1);
        assertEquals(Response.Status.CREATED.getStatusCode(), res1.getStatus());

        final Response res2 = testApi.getRoot(projectId, jwtUser1);
        final JsonNode rootNode = objectMapper.readTree(res2.readEntity(String.class));
        assertEquals(3, rootNode.get("tests").size());
    }

    @Test
    public void shouldFailToCreateTestsIfOneCannotBeCreated() throws Exception {
        final String tests = "["
                + "{\"name\": \"tc1\", \"type\": \"case\"}"
                + ",{\"name\": \"tc2\", \"type\": \"case\", \"parent\": -1}"
                + ",{\"name\": \"ts\", \"type\": \"suite\"}]";

        final Response res1 = testApi.createMany(projectId, tests, jwtUser1);
        assertEquals(Response.Status.NOT_FOUND.getStatusCode(), res1.getStatus());

        final Response res2 = testApi.getRoot(projectId, jwtUser1);
        final JsonNode rootNode = objectMapper.readTree(res2.readEntity(String.class));
        assertEquals(0, rootNode.get("tests").size());
    }

    @Test
    public void shouldGetTest() {
        final String tc = "{\"name\": \"tc\", \"type\": \"case\"}";
        final Response res1 = testApi.create(projectId, tc, jwtUser1);
        final String tcRes = res1.readEntity(String.class);

        final Response res2 = testApi.get(projectId, JsonPath.read(tcRes, "$.id"), jwtUser1);
        assertEquals(Response.Status.OK.getStatusCode(), res2.getStatus());
        assertEquals(tcRes, res2.readEntity(String.class));
    }

    @Test
    public void shouldFailToGetUnknownTest() {
        final Response res = testApi.get(projectId, -1, jwtUser1);
        assertEquals(Response.Status.NOT_FOUND.getStatusCode(), res.getStatus());
    }

    @Test
    public void shouldUpdateTest() throws Exception {
        final String tc = "{\"name\": \"tc\", \"type\": \"case\"}";
        final Response res1 = testApi.create(projectId, tc, jwtUser1);

        final TestCase testCase = res1.readEntity(TestCase.class);
        testCase.setName("abc");

        final Response res2 = testApi.update(testCase.getProjectId(), testCase.getId(), objectMapper.writeValueAsString(testCase), jwtUser1);
        assertEquals(Response.Status.OK.getStatusCode(), res2.getStatus());

        // get updated test case
        final TestCase updatedTestCase = res2.readEntity(TestCase.class);
        assertEquals(testCase.getName(), updatedTestCase.getName());

        // updated test case is in db
        final TestCase testCaseIdDb = testApi.get(projectId, testCase.getId().intValue(), jwtUser1)
                .readEntity(TestCase.class);
        assertEquals(testCase.getName(), testCaseIdDb.getName());
    }

    @Test
    public void shouldUpdateTestLockedByUser() throws Exception {
        WebSocketUser webSocketUser = new WebSocketUser("webSocketUser", client, port);
        projectApi.addMembers(Integer.toUnsignedLong(projectId), Collections.singletonList(webSocketUser.getUserId()), jwtUser1);

        final String tc = "{\"name\": \"tc\", \"type\": \"case\"}";
        final Response res1 = testApi.create(projectId, tc, jwtUser1);

        final TestCase testCase = res1.readEntity(TestCase.class);

        // lock testcase
        webSocketUser.send("default", testPresenceServiceWSMessages.userEnteredTest(projectId, testCase.getId()));

        testCase.setName("abc");

        final Response res2 = testApi.update(testCase.getProjectId(), testCase.getId(), objectMapper.writeValueAsString(testCase), webSocketUser.getJwt());
        assertEquals(Response.Status.OK.getStatusCode(), res2.getStatus());

        webSocketUser.forceDisconnectAll();
    }

    @Test
    public void shouldFailToUpdateTestLockedByOtherUser() throws Exception {
        WebSocketUser webSocketUser = new WebSocketUser("webSocketUser", client, port);
        projectApi.addMembers(Integer.toUnsignedLong(projectId), Collections.singletonList(webSocketUser.getUserId()), jwtUser1);

        final String tc = "{\"name\": \"tc\", \"type\": \"case\"}";
        final Response res1 = testApi.create(projectId, tc, jwtUser1);

        final TestCase testCase = res1.readEntity(TestCase.class);

        // lock testcase
        webSocketUser.send("default", testPresenceServiceWSMessages.userEnteredTest(projectId, testCase.getId()));

        testCase.setName("abc");

        final Response res2 = testApi.update(testCase.getProjectId(), testCase.getId(), objectMapper.writeValueAsString(testCase), webSocketUser.getJwt());
        assertEquals(Response.Status.OK.getStatusCode(), res2.getStatus());

        // get updated test case
        final TestCase updatedTestCase = res2.readEntity(TestCase.class);
        assertEquals(testCase.getName(), updatedTestCase.getName());

        // updated test case is in db
        final TestCase testCaseIdDb = testApi.get(projectId, testCase.getId().intValue(), jwtUser1)
                .readEntity(TestCase.class);
        assertEquals(testCase.getName(), testCaseIdDb.getName());

        webSocketUser.forceDisconnectAll();
    }

    @Test
    public void shouldUpdateLastUpdatedByOnUpdate() throws JsonProcessingException {
        projectApi.addOwners((long) projectId, Collections.singletonList((long) userId2), jwtUser1);

        final String tc = "{\"name\": \"tc\", \"type\": \"case\"}";
        final Response res1 = testApi.create(projectId, tc, jwtUser1);

        final TestCase testCase = res1.readEntity(TestCase.class);

        final Response res2 = testApi.update(testCase.getProjectId(), testCase.getId(), objectMapper.writeValueAsString(testCase), jwtUser2);
        assertEquals(Response.Status.OK.getStatusCode(), res2.getStatus());

        final TestCase updatedTestCase = res2.readEntity(TestCase.class);
        assertEquals((long) updatedTestCase.getLastUpdatedBy().getId(), userId2);
    }

    @Test
    public void shouldCreateTestWithSameNameInDifferentTestSuites() throws Exception {
        TestSuite ts1 = createTestSuite((long) projectId, "ts1", null, jwtUser1);
        TestSuite ts2 = createTestSuite((long) projectId, "ts2", null, jwtUser1);

        final TestCase tc1 = new TestCase();
        tc1.setName("tc");
        tc1.setProjectId((long) projectId);
        tc1.setParent(ts1);
        testApi.create(projectId, objectMapper.writeValueAsString(tc1), jwtUser1);
        tc1.setParent(ts2);
        testApi.create(projectId, objectMapper.writeValueAsString(tc1), jwtUser1);

        ts1 = testApi.get(projectId, ts1.getId().intValue(), jwtUser1).readEntity(TestSuite.class);
        ts2 = testApi.get(projectId, ts2.getId().intValue(), jwtUser1).readEntity(TestSuite.class);

        assertEquals(1, ts1.getTestCases().size());
        assertEquals(1, ts2.getTestCases().size());
        assertEquals("tc", ts1.getTestCases().get(0).getName());
        assertEquals("tc", ts2.getTestCases().get(0).getName());
    }

    @Test
    public void shouldMoveTestCase() throws Exception {
        TestSuite ts1 = createTestSuite((long) projectId, "ts1", null, jwtUser1);
        TestCase tc = createTestCase((long) projectId, "tc", null, jwtUser1);

        final Response res3 = testApi.move(projectId, tc.getId().intValue(), ts1.getId().intValue(), jwtUser1);
        assertEquals(HttpStatus.OK.value(), res3.getStatus());

        ts1 = testApi.get(projectId, ts1.getId().intValue(), jwtUser1).readEntity(TestSuite.class);
        tc = testApi.get(projectId, tc.getId().intValue(), jwtUser1).readEntity(TestCase.class);

        assertEquals(ts1.getId(), tc.getParent().getId());
        assertEquals(1, ts1.getTestCases().size());
        assertEquals(tc.getId(), ts1.getTestCases().get(0).getId());
    }

    @Test
    public void shouldMoveTestSuite() throws Exception {
        TestSuite ts1 = createTestSuite((long) projectId, "ts1", null, jwtUser1);
        TestSuite ts2 = createTestSuite((long) projectId, "ts2", null, jwtUser1);

        final Response res3 = testApi.move(projectId, ts1.getId().intValue(), ts2.getId().intValue(), jwtUser1);
        assertEquals(HttpStatus.OK.value(), res3.getStatus());

        ts1 = testApi.get(projectId, ts1.getId().intValue(), jwtUser1).readEntity(TestSuite.class);
        ts2 = testApi.get(projectId, ts2.getId().intValue(), jwtUser1).readEntity(TestSuite.class);

        assertEquals(ts2.getId(), ts1.getParentId());
        assertEquals(1, ts2.getTestSuites().size());
        assertEquals(ts1.getId(), ts2.getTestSuites().get(0).getId());
    }

    @Test
    public void shouldNotMoveRootTestSuite() throws Exception {
        final String ts = "{\"name\": \"ts\", \"type\": \"suite\"}";
        final Response res1 = testApi.create(projectId, ts, jwtUser1);
        final int id = JsonPath.read(res1.readEntity(String.class), "$.id");

        final Response res2 = testApi.move(projectId, rootTestSuiteId, id, jwtUser1);
        assertEquals(Response.Status.BAD_REQUEST.getStatusCode(), res2.getStatus());

        final Response res3 = testApi.getRoot(projectId, jwtUser1);
        assertTrue(objectMapper.readTree(res3.readEntity(String.class)).get("parent").isNull());
    }

    @Test
    public void shouldFailToMoveTestToNonExistingTestSuite() {
        final String ts = "{\"name\": \"ts\", \"type\": \"suite\"}";
        final Response res1 = testApi.create(projectId, ts, jwtUser1);
        final int id = JsonPath.read(res1.readEntity(String.class), "$.id");

        final Response res2 = testApi.move(projectId, id, -1, jwtUser1);
        assertEquals(Response.Status.NOT_FOUND.getStatusCode(), res2.getStatus());
    }

    @Test
    public void shouldNotMoveTestSuiteToItsDescendant() throws Exception {
        TestSuite ts1 = createTestSuite((long) projectId, "ts1", null, jwtUser1);
        TestSuite ts2 = createTestSuite((long) projectId, "ts2", ts1.getId(), jwtUser1);

        final Response res = testApi.move(projectId, ts1.getId().intValue(), ts2.getId().intValue(), jwtUser1);
        assertEquals(HttpStatus.BAD_REQUEST.value(), res.getStatus());
        res.readEntity(SpringRestError.class);

        ts1 = testApi.get(projectId, ts1.getId().intValue(), jwtUser1).readEntity(TestSuite.class);
        ts2 = testApi.get(projectId, ts2.getId().intValue(), jwtUser1).readEntity(TestSuite.class);
        TestSuite root = testApi.getRoot(projectId, jwtUser1).readEntity(TestSuite.class);

        assertEquals(root.getId(), ts1.getParentId());
        assertEquals(ts1.getId(), ts2.getParentId());
    }

    @Test
    public void shouldNotMoveTestToTestCase() throws Exception {
        TestCase tc1 = createTestCase((long) projectId, "tc1", null, jwtUser1);
        TestCase tc2 = createTestCase((long) projectId, "tc2", null, jwtUser1);

        final Response res = testApi.move(projectId, tc1.getId().intValue(), tc2.getId().intValue(), jwtUser1);
        assertEquals(HttpStatus.BAD_REQUEST.value(), res.getStatus());
        res.readEntity(SpringRestError.class);

        tc1 = testApi.get(projectId, tc1.getId().intValue(), jwtUser1).readEntity(TestCase.class);
        tc2 = testApi.get(projectId, tc2.getId().intValue(), jwtUser1).readEntity(TestCase.class);

        final TestSuite root = testApi.getRoot(projectId, jwtUser1).readEntity(TestSuite.class);
        assertEquals(root.getId(), tc1.getParentId());
        assertEquals(root.getId(), tc2.getParentId());
        assertEquals(2, root.getTestCases().size());
    }

    @Test
    public void shouldNotMoveTestToItself() throws Exception {
        TestCase tc1 = createTestCase((long) projectId, "tc1", null, jwtUser1);

        final Response res = testApi.move(projectId, tc1.getId().intValue(), tc1.getId().intValue(), jwtUser1);
        assertEquals(HttpStatus.BAD_REQUEST.value(), res.getStatus());
        res.readEntity(SpringRestError.class);

        tc1 = testApi.get(projectId, tc1.getId().intValue(), jwtUser1).readEntity(TestCase.class);

        final TestSuite root = testApi.getRoot(projectId, jwtUser1).readEntity(TestSuite.class);
        assertEquals(root.getId(), tc1.getParentId());
        assertEquals(1, root.getTestCases().size());
    }

    @Test
    public void shouldNotMoveLockedTestCase() throws Exception {
        WebSocketUser webSocketUser = new WebSocketUser("webSocketUser", client, port);
        projectApi.addMembers(Integer.toUnsignedLong(projectId), Collections.singletonList(webSocketUser.getUserId()), jwtUser1);

        TestSuite ts1 = createTestSuite((long) projectId, "ts1", null, jwtUser1);
        TestSuite ts2 = createTestSuite((long) projectId, "ts2", null, jwtUser1);
        TestCase tc1 = createTestCase((long) projectId, "tc1", ts1.getId(), jwtUser1);

        // lock testcase
        webSocketUser.send("default", testPresenceServiceWSMessages.userEnteredTest(projectId, tc1.getId()));

        final Response res = testApi.move(projectId, tc1.getId().intValue(), ts2.getId().intValue(), webSocketUser.getJwt());
        assertEquals(HttpStatus.UNAUTHORIZED.value(), res.getStatus());

        webSocketUser.forceDisconnectAll();
    }

    @Test
    public void shouldNotMoveLockedTestSuite() throws Exception {
        WebSocketUser webSocketUser = new WebSocketUser("webSocketUser", client, port);
        projectApi.addMembers(Integer.toUnsignedLong(projectId), Collections.singletonList(webSocketUser.getUserId()), jwtUser1);

        TestSuite ts1 = createTestSuite((long) projectId, "ts1", null, jwtUser1);
        TestSuite ts2 = createTestSuite((long) projectId, "ts2", null, jwtUser1);
        TestCase tc1 = createTestCase((long) projectId, "tc1", ts1.getId(), jwtUser1);

        // lock testcase
        webSocketUser.send("default", testPresenceServiceWSMessages.userEnteredTest(projectId, tc1.getId()));

        final Response res = testApi.move(projectId, ts1.getId().intValue(), ts2.getId().intValue(), webSocketUser.getJwt());
        assertEquals(HttpStatus.UNAUTHORIZED.value(), res.getStatus());

        webSocketUser.forceDisconnectAll();
    }

    @Test
    public void shouldDeleteTestCase() throws Exception {
        final String tc1 = "{\"name\": \"tc1\", \"type\": \"case\"}";
        final Response res1 = testApi.create(projectId, tc1, jwtUser1);
        final int id = JsonPath.read(res1.readEntity(String.class), "$.id");

        final Response res2 = testApi.delete(projectId, id, jwtUser1);
        assertEquals(Response.Status.NO_CONTENT.getStatusCode(), res2.getStatus());
        assertEquals(0, getNumberOfTestsInRoot());
    }

    @Test
    public void shouldNotDeleteRootTestSuite() {
        final Response res1 = testApi.delete(projectId, rootTestSuiteId, jwtUser1);
        assertEquals(Response.Status.BAD_REQUEST.getStatusCode(), res1.getStatus());

        final Response res2 = testApi.getRoot(projectId, jwtUser1);
        assertEquals(Response.Status.OK.getStatusCode(), res2.getStatus());
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
        assertEquals(Response.Status.NO_CONTENT.getStatusCode(), res3.getStatus());
        assertEquals(0, getNumberOfTestsInRoot());
    }

    @Test
    public void shouldNotDeleteMultipleTestsIfOneFails() throws Exception {
        final String tc1 = "{\"name\": \"tc1\", \"type\": \"case\"}";
        final Response res1 = testApi.create(projectId, tc1, jwtUser1);
        final int tc1Id = JsonPath.read(res1.readEntity(String.class), "$.id");

        final Response res2 = testApi.deleteMany(projectId, Arrays.asList(tc1Id, -1), jwtUser1);
        assertEquals(Response.Status.NOT_FOUND.getStatusCode(), res2.getStatus());
        assertEquals(1, getNumberOfTestsInRoot());
    }

    @Test
    public void shouldNotDeleteLockedTestCase() throws Exception {
        WebSocketUser webSocketUser = new WebSocketUser("webSocketUser", client, port);
        projectApi.addMembers(Integer.toUnsignedLong(projectId), Collections.singletonList(webSocketUser.getUserId()), jwtUser1);

        TestCase tc1 = createTestCase((long) projectId, "tc1", null, jwtUser1);

        // lock testcase
        webSocketUser.send("default", testPresenceServiceWSMessages.userEnteredTest(projectId, tc1.getId()));

        final Response res = testApi.delete(projectId, tc1.getId().intValue(), webSocketUser.getJwt());
        assertEquals(HttpStatus.UNAUTHORIZED.value(), res.getStatus());

        webSocketUser.forceDisconnectAll();
    }

    @Test
    public void shouldNotDeleteLockedTestSuite() throws Exception {
        WebSocketUser webSocketUser = new WebSocketUser("webSocketUser", client, port);
        projectApi.addMembers(Integer.toUnsignedLong(projectId), Collections.singletonList(webSocketUser.getUserId()), jwtUser1);

        TestSuite ts1 = createTestSuite((long) projectId, "ts1", null, jwtUser1);
        TestCase tc1 = createTestCase((long) projectId, "tc1", ts1.getId(), jwtUser1);

        // lock testcase
        webSocketUser.send("default", testPresenceServiceWSMessages.userEnteredTest(projectId, tc1.getId()));

        final Response res = testApi.delete(projectId, ts1.getId().intValue(), webSocketUser.getJwt());
        assertEquals(HttpStatus.UNAUTHORIZED.value(), res.getStatus());

        webSocketUser.forceDisconnectAll();
    }

    @Test
    public void shouldCreateTestWithSteps() throws Exception {
        createTestCaseWithSteps(project.getId(), "test", null, jwtUser1);
    }

    @Test
    public void shouldExecuteTest() throws Exception {
        objectMapper.addMixIn(TestReport.class, IgnoreTestReportFieldsMixin.class);
        objectMapper.addMixIn(TestExecutionResult.class, IgnoreTestExecutionResultFieldsMixin.class);
        objectMapper.addMixIn(TestCaseResult.class, IgnoreTestCaseResultFieldsMixin.class);

        final var testCase = createTestCaseWithSteps(project.getId(), "test", null, jwtUser1);

        final var driverConfig = new WebDriverConfig();
        driverConfig.setBrowser("chrome");

        final var config = new TestExecutionConfig();
        config.setDriverConfig(driverConfig);
        config.setProject(project);
        config.setEnvironment(project.getDefaultEnvironment());
        config.setTests(List.of(testCase));

        final var res1 = testApi.execute(project.getId(), config, jwtUser1);
        Assert.assertEquals(HttpStatus.OK.value(), res1.getStatus());

        final var item = objectMapper.readValue(res1.readEntity(String.class), TestQueueItem.class);
        assertNotNull(item);
        assertNotNull(item.getConfig());
        assertNotNull(item.getReport());
        assertNotNull(item.getResults());

        var report = pollForTestReport(item.getReport().getId(), jwtUser1);
        assertEquals(TestReport.Status.FINISHED, report.getStatus());
        assertTrue(report.getTestResults().size() > 0);
    }

    @Test
    public void shouldExecuteTestSuite() throws Exception {
        objectMapper.addMixIn(TestReport.class, IgnoreTestReportFieldsMixin.class);
        objectMapper.addMixIn(TestExecutionResult.class, IgnoreTestExecutionResultFieldsMixin.class);
        objectMapper.addMixIn(TestCaseResult.class, IgnoreTestCaseResultFieldsMixin.class);
        objectMapper.addMixIn(TestSuiteResult.class, IgnoreTestSuiteResultFieldsMixin.class);

        final var testSuite = createTestSuite(project.getId(), "testSuite", null, jwtUser1);
        createTestCaseWithSteps(project.getId(), "test", testSuite.getId(), jwtUser1);

        final var driverConfig = new WebDriverConfig();
        driverConfig.setBrowser("chrome");

        final var config = new TestExecutionConfig();
        config.setDriverConfig(driverConfig);
        config.setProject(project);
        config.setEnvironment(project.getDefaultEnvironment());
        config.setTests(List.of(testSuite));

        final var res1 = testApi.execute(project.getId(), config, jwtUser1);
        Assert.assertEquals(HttpStatus.OK.value(), res1.getStatus());

        final var item = objectMapper.readValue(res1.readEntity(String.class), TestQueueItem.class);
        assertNotNull(item);
        assertNotNull(item.getConfig());
        assertNotNull(item.getReport());
        assertNotNull(item.getResults());

        var report = pollForTestReport(item.getReport().getId(), jwtUser1);
        assertEquals(TestReport.Status.FINISHED, report.getStatus());
        assertTrue(report.getTestResults().size() > 0);
    }

    private TestReport pollForTestReport(Long reportId, String jwt) throws JsonProcessingException {
        await().atMost(10, TimeUnit.SECONDS).until(() -> {
            final var res2 = testReportApi.get(project.getId(), reportId, jwt);
            assertEquals(HttpStatus.OK.value(), res2.getStatus());

            final var report = objectMapper.readValue(res2.readEntity(String.class), TestReport.class);
            return List.of(TestReport.Status.ABORTED, TestReport.Status.FINISHED).contains(report.getStatus());
        });

        final var res = testReportApi.get(project.getId(), reportId, jwt);
        return objectMapper.readValue(res.readEntity(String.class), TestReport.class);
    }

    private int getNumberOfTestsInRoot() throws Exception {
        final Response res = testApi.getRoot(projectId, jwtUser1);
        final JsonNode rootNode = objectMapper.readTree(res.readEntity(String.class));
        return rootNode.get("tests").size();
    }

    private TestSuite createTestSuite(Long projectId, String name, Long parentId, String jwt) throws Exception {
        final TestSuite ts = new TestSuite();
        ts.setName(name);
        ts.setProjectId(projectId);
        ts.setParentId(parentId);

        final Response res = testApi.create(projectId.intValue(), objectMapper.writeValueAsString(ts), jwt);
        assertEquals(HttpStatus.CREATED.value(), res.getStatus());
        return res.readEntity(TestSuite.class);
    }

    private TestCase createTestCase(Long projectId, String name, Long parentId, String jwt) throws Exception {
        final TestCase tc = new TestCase();
        tc.setName(name);
        tc.setProjectId(projectId);
        tc.setParentId(parentId);

        final Response res = testApi.create(projectId.intValue(), objectMapper.writeValueAsString(tc), jwt);
        assertEquals(HttpStatus.CREATED.value(), res.getStatus());
        return res.readEntity(TestCase.class);
    }

    private TestCase createTestCaseWithSteps(Long projectId, String name, Long parentId, String jwt) throws Exception {
        final TestCase tc = new TestCase();
        tc.setName(name);
        tc.setProjectId(projectId);
        tc.setParentId(parentId);

        final ParameterizedSymbol resetSymbol = symbolUtils.createResetSymbol(project, jwt);
        final ParameterizedSymbol authSymbol = symbolUtils.createAuthSymbol(project, ADMIN_EMAIL, ADMIN_PASSWORD, jwt);
        final ParameterizedSymbol getProfileSymbol = symbolUtils.createGetProfileSymbol(project, jwt);

        final var preStep = new TestCaseStep();
        preStep.setPSymbol(resetSymbol);
        tc.getPreSteps().add(preStep);

        final var step1 = new TestCaseStep();
        step1.setPSymbol(authSymbol);
        tc.getSteps().add(step1);

        final var step2 = new TestCaseStep();
        step2.setPSymbol(getProfileSymbol);
        tc.getSteps().add(step2);

        final Response res = testApi.create(projectId.intValue(), objectMapper.writeValueAsString(tc), jwt);
        assertEquals(HttpStatus.CREATED.value(), res.getStatus());
        return res.readEntity(TestCase.class);
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static abstract class IgnoreTestReportFieldsMixin {
        @JsonIgnore
        abstract void setTime(Long time);

        @JsonIgnore
        abstract void setNumTests(Long num);

        @JsonIgnore
        abstract void setNumTestsFailed(Long num);

        @JsonIgnore
        abstract void setNumTestsPassed(Long num);
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static abstract class IgnoreTestExecutionResultFieldsMixin {
        @JsonIgnore
        abstract void setOutput(String output);
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static abstract class IgnoreTestCaseResultFieldsMixin {
        @JsonIgnore
        abstract void setPassed(boolean passed);

        @JsonIgnore
        abstract void setFailureMessage(String failureMessage);

        @JsonIgnore
        abstract de.learnlib.alex.testing.entities.Test.TestRepresentation getTestRepresentation();
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static abstract class IgnoreTestSuiteResultFieldsMixin {
        @JsonIgnore
        abstract void setPassed(boolean passed);

        @JsonIgnore
        abstract void setFailureMessage(String failureMessage);

        @JsonIgnore
        abstract de.learnlib.alex.testing.entities.Test.TestRepresentation getTestRepresentation();
    }
}
