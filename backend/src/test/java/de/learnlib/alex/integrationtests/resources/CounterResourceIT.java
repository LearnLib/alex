/*
 * Copyright 2015 - 2019 TU Dortmund
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
import de.learnlib.alex.integrationtests.resources.api.CounterApi;
import de.learnlib.alex.integrationtests.resources.api.ProjectApi;
import de.learnlib.alex.integrationtests.resources.api.UserApi;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.skyscreamer.jsonassert.JSONAssert;
import org.springframework.http.HttpStatus;

import javax.ws.rs.core.Response;
import java.util.Arrays;
import java.util.List;

import static org.junit.Assert.assertEquals;

public class CounterResourceIT extends AbstractResourceIT {

    private String jwtUser1;

    private String jwtUser2;

    private int projectId1;

    private int projectId2;

    private UserApi userApi;

    private ProjectApi projectApi;

    private CounterApi counterApi;

    @Before
    public void pre() {
        userApi = new UserApi(client, port);
        projectApi = new ProjectApi(client, port);
        counterApi = new CounterApi(client, port);

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
    }

    @Test
    public void shouldCreateACounter() throws Exception {
        final String counter = createCounterJson("counter", projectId1, 1);
        final Response res1 = counterApi.create(projectId1, counter, jwtUser1);

        assertEquals(HttpStatus.CREATED.value(), res1.getStatus());
        assertEquals(1, getNumberOfCounters(projectId1, jwtUser1));
    }

    @Test
    public void shouldNotCreateTheSameCounterTwice() throws Exception {
        final String counter = createCounterJson("counter", projectId1, 1);
        counterApi.create(projectId1, counter, jwtUser1);
        final Response res1 = counterApi.create(projectId1, counter, jwtUser1);

        assertEquals(HttpStatus.BAD_REQUEST.value(), res1.getStatus());
        assertEquals(1, getNumberOfCounters(projectId1, jwtUser1));
    }

    @Test
    public void shouldNotCreateCounterIfProjectCannotBeFound() throws Exception {
        final String counter = createCounterJson("counter", -1, 1);
        final Response res1 = counterApi.create(-1, counter, jwtUser1);

        Assert.assertEquals(Response.Status.NOT_FOUND.getStatusCode(), res1.getStatus());
        Assert.assertEquals(0, getNumberOfCounters(projectId1, jwtUser1));
    }

    @Test
    public void shouldNotCreateACounterInAnotherUsersProject() throws Exception {
        final String counter = createCounterJson("counter1", projectId2, 1);
        final Response res1 = counterApi.create(projectId2, counter, jwtUser1);

        assertEquals(HttpStatus.UNAUTHORIZED.value(), res1.getStatus());

        final Response res3 = counterApi.getAll(projectId1, jwtUser1);
        JSONAssert.assertEquals("[]", res3.readEntity(String.class), true);

        final Response res2 = counterApi.getAll(projectId2, jwtUser2);
        JSONAssert.assertEquals("[]", res2.readEntity(String.class), true);
    }

    @Test
    public void shouldGetAllCounters() throws Exception {
        final String counter1 = createCounterJson("counter1", projectId1, 1);
        final String counter2 = createCounterJson("counter2", projectId1, 1);
        final String counter3 = createCounterJson("counter3", projectId1, 1);

        counterApi.create(projectId1, counter1, jwtUser1);
        counterApi.create(projectId1, counter2, jwtUser1);
        counterApi.create(projectId1, counter3, jwtUser1);

        final Response res = counterApi.getAll(projectId1, jwtUser1);

        assertEquals(HttpStatus.OK.value(), res.getStatus());
        assertEquals(3, getNumberOfCounters(projectId1, jwtUser1));
    }

    @Test
    public void shouldNotGetCountersOfAnotherUsersProject() {
        final String counter = createCounterJson("counter", projectId1, 1);
        counterApi.create(projectId2, counter, jwtUser2);

        final Response res = counterApi.getAll(projectId2, jwtUser1);
        assertEquals(HttpStatus.UNAUTHORIZED.value(), res.getStatus());
    }

    @Test
    public void shouldUpdateValueOfACounter() throws Exception {
        final String counter = createCounterJson("counter1", projectId1, 1);
        final Long id = getCounterId(counterApi.create(projectId1, counter, jwtUser1));
        final String updatedCounter = createCounterJson(id, "counter1", projectId1, 5);

        final Response res1 = counterApi.update(projectId1, id, updatedCounter, jwtUser1);
        assertEquals(HttpStatus.OK.value(), res1.getStatus());
        JSONAssert.assertEquals(res1.readEntity(String.class), updatedCounter, true);

        final Response res2 = counterApi.getAll(projectId1, jwtUser1);
        JSONAssert.assertEquals("[" + updatedCounter + "]", res2.readEntity(String.class), true);
    }

    @Test
    public void shouldNotUpdateNameOfACounter() throws Exception {
        final String counter = createCounterJson("counter1", projectId1, 1);
        final Long id = getCounterId(counterApi.create(projectId1, counter, jwtUser1));
        final String updatedCounter = createCounterJson(id, "updatedName", projectId1, 1);

        final Response res1 = counterApi.update(projectId1, id, updatedCounter, jwtUser1);
        assertEquals(HttpStatus.BAD_REQUEST.value(), res1.getStatus());

        final Response res2 = counterApi.getAll(projectId1, jwtUser1);
        JSONAssert.assertEquals(res2.readEntity(String.class), "[" + createCounterJson(id,"counter1", projectId1, 1) + "]", true);
    }

    @Test
    public void shouldNotUpdateAnotherUsersCounter() throws Exception {
        final String counter = createCounterJson("counter1", projectId1, 1);
        final Long id = getCounterId(counterApi.create(projectId1, counter, jwtUser1));

        final String updatedCounter = createCounterJson(id,"counter1", projectId1, 5);
        final Response res1 = counterApi.update(projectId1, id, updatedCounter, jwtUser2);

        assertEquals(HttpStatus.UNAUTHORIZED.value(), res1.getStatus());

        final Response res2 = counterApi.getAll(projectId1, jwtUser1);
        JSONAssert.assertEquals("[" + createCounterJson(id,"counter1", projectId1, 1) + "]", res2.readEntity(String.class), true);
    }

    @Test
    public void shouldDeleteCounter() throws Exception {
        final String counter1 = createCounterJson("counter1", projectId1, 1);
        final String counter2 = createCounterJson("counter2", projectId1, 1);

        final Response res1 = counterApi.create(projectId1, counter1, jwtUser1);
        counterApi.create(projectId1, counter2, jwtUser1);

        final Long id = getCounterId(res1);

        final Response res = counterApi.delete(projectId1, id, jwtUser1);
        assertEquals(HttpStatus.NO_CONTENT.value(), res.getStatus());
        assertEquals(1, getNumberOfCounters(projectId1, jwtUser1));
    }

    @Test
    public void shouldNotDeleteAnotherUsersCounter() throws Exception {
        final String counter = createCounterJson("counter1", projectId2, 1);
        final Response res = counterApi.create(projectId2, counter, jwtUser2);
        final Long id = getCounterId(res);

        final Response res2 = counterApi.delete(projectId2, id, jwtUser1);
        assertEquals(HttpStatus.UNAUTHORIZED.value(), res2.getStatus());
        assertEquals(1, getNumberOfCounters(projectId2, jwtUser2));
    }

    @Test
    public void shouldFailToDeleteCounterIfItDoesNotExist() throws Exception {
        final Response res = counterApi.delete(projectId1, -1L, jwtUser1);
        assertEquals(HttpStatus.NOT_FOUND.value(), res.getStatus());
        assertEquals(0, getNumberOfCounters(projectId1, jwtUser1));
    }

    @Test
    public void shouldDeleteMultipleCountersAtOnce() throws Exception {
        final String counter1 = createCounterJson("counter1", projectId1, 1);
        final String counter2 = createCounterJson("counter2", projectId1, 1);

        final Long id1 = getCounterId(counterApi.create(projectId1, counter1, jwtUser1));
        final Long id2 = getCounterId(counterApi.create(projectId1, counter2, jwtUser1));

        final Response res = counterApi.delete(projectId1, Arrays.asList(id1, id2), jwtUser1);
        assertEquals(HttpStatus.NO_CONTENT.value(), res.getStatus());
        assertEquals(0, getNumberOfCounters(projectId1, jwtUser1));
    }

    @Test
    public void shouldNotDeleteMultipleCountersIfOneDoesNotExist() throws Exception {
        final String counter1 = createCounterJson("counter1", projectId1, 1);
        final String counter2 = createCounterJson("counter2", projectId1, 1);

        final List<Long> ids = Arrays.asList(
                getCounterId(counterApi.create(projectId1, counter1, jwtUser1)),
                getCounterId(counterApi.create(projectId1, counter2, jwtUser1)),
                -1L
        );

        final Response res = counterApi.delete(projectId1, ids, jwtUser1);
        assertEquals(HttpStatus.NOT_FOUND.value(), res.getStatus());
        assertEquals(2, getNumberOfCounters(projectId1, jwtUser1));
    }

    private int getNumberOfCounters(int projectId, String jwt) throws Exception {
        final Response res2 = counterApi.getAll(projectId, jwt);
        return objectMapper.readTree(res2.readEntity(String.class)).size();
    }

    private String createCounterJson(Long id, String name, int projectId, int value) {
        return "{"
                + "\"id\":" + id
                + ",\"name\":\"" + name + "\""
                + ",\"project\":" + projectId
                + ",\"value\":" + value
                + "}";
    }

    private String createCounterJson(String name, int projectId, int value) {
        return "{"
                + "\"name\":\"" + name + "\""
                + ",\"project\":" + projectId
                + ",\"value\":" + value
                + "}";
    }

    private Long getCounterId(Response res) {
        final Integer id = JsonPath.read(res.readEntity(String.class), "id");
        return id.longValue();
    }
}
