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

import com.jayway.jsonpath.JsonPath;
import de.learnlib.alex.integrationtests.resources.api.ProjectApi;
import de.learnlib.alex.integrationtests.resources.api.TestExecutionConfigApi;
import de.learnlib.alex.integrationtests.resources.api.UserApi;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;

import javax.ws.rs.core.Response;

public class ATestExecutionConfigResourceIT extends AbstractResourceIT {

    private TestExecutionConfigApi api;

    private String jwtUser1;

    private String jwtUser2;

    private int projectId1;

    private int projectId2;

    private int envId1;

    private int envId2;

    @Before
    public void before() {
        this.api = new TestExecutionConfigApi(client, port);

        final UserApi userApi = new UserApi(client, port);
        userApi.create("{\"email\":\"user1@alex.com\", \"username\":\"user1\", \"password\":\"password123\"}");
        userApi.create("{\"email\":\"user2@alex.com\", \"username\":\"user2\", \"password\":\"password123\"}");
        this.jwtUser1 = userApi.login("user1@alex.com", "password123");
        this.jwtUser2 = userApi.login("user2@alex.com", "password123");

        final ProjectApi projectApi = new ProjectApi(client, port);

        final Response res1 = projectApi.create("{\"name\":\"test\",\"url\":\"http://localhost:8080\"}", this.jwtUser1);
        final String project1 = res1.readEntity(String.class);
        this.projectId1 = JsonPath.read(project1, "$.id");
        this.envId1 = JsonPath.read(project1, "$.environments[0].id");

        final Response res2 = projectApi.create("{\"name\":\"test\",\"url\":\"http://localhost:8080\"}", this.jwtUser2);
        final String project2 = res2.readEntity(String.class);
        this.projectId2 = JsonPath.read(project2, "$.id");
        this.envId2 = JsonPath.read(project2, "$.environments[0].id");
    }

    @Test
    public void shouldCreateAConfig() throws Exception {
        final Response res = api.create(projectId1, createConfig(projectId1, envId1), jwtUser1);
        Assert.assertEquals(Response.Status.CREATED.getStatusCode(), res.getStatus());
        Assert.assertEquals(1, getNumberOfConfigs(projectId1, jwtUser1));
    }

    @Test
    public void shouldGetEmptyListIfNoConfigExists() throws Exception {
        final Response res = api.getAll(projectId1, jwtUser1);
        Assert.assertEquals(Response.Status.OK.getStatusCode(), res.getStatus());
        Assert.assertEquals("[]", res.readEntity(String.class));
        Assert.assertEquals(0, getNumberOfConfigs(projectId1, jwtUser1));
    }

    @Test
    public void shouldGetAllConfigs() throws Exception {
        api.create(projectId1, createConfig(projectId1, envId1), jwtUser1);
        api.create(projectId1, createConfig(projectId1, envId1), jwtUser1);
        Assert.assertEquals(2, getNumberOfConfigs(projectId1, jwtUser1));
    }

    @Test
    public void shouldNotGetConfigsOfAnotherUsersProject() {
        final Response res = api.getAll(projectId2, jwtUser1);
        Assert.assertEquals(Response.Status.UNAUTHORIZED.getStatusCode(), res.getStatus());
        JsonPath.read(res.readEntity(String.class), "$.message");
    }

    @Test
    public void shouldFailToCreateConfigIfUrlDoesNotExist() throws Exception {
        final Response res = api.create(projectId1, createConfig(projectId1, -1), jwtUser1);
        Assert.assertEquals(Response.Status.NOT_FOUND.getStatusCode(), res.getStatus());
        Assert.assertEquals(0, getNumberOfConfigs(projectId1, jwtUser1));
    }

    @Test
    public void shouldNotCreateConfigInAnotherUsersProject() throws Exception {
        final Response res = api.create(projectId1, createConfig(projectId1, envId1), jwtUser2);
        Assert.assertEquals(Response.Status.UNAUTHORIZED.getStatusCode(), res.getStatus());
        Assert.assertEquals(0, getNumberOfConfigs(projectId1, jwtUser1));
        Assert.assertEquals(0, getNumberOfConfigs(projectId2, jwtUser2));
    }

    @Test
    public void shouldDeleteConfig() throws Exception {
        final Response res = api.create(projectId1, createConfig(projectId1, envId1), jwtUser1);
        final int id = JsonPath.read(res.readEntity(String.class), "$.id");

        final Response res2 = api.delete(projectId1, id, jwtUser1);
        Assert.assertEquals(Response.Status.NO_CONTENT.getStatusCode(), res2.getStatus());
        Assert.assertEquals(0, getNumberOfConfigs(projectId1, jwtUser1));
    }

    @Test
    public void shouldFailToDeleteIfConfigDoesNotExist() throws Exception {
        final Response res = api.delete(projectId1, -1, jwtUser1);
        Assert.assertEquals(Response.Status.NOT_FOUND.getStatusCode(), res.getStatus());
        Assert.assertEquals(0, getNumberOfConfigs(projectId1, jwtUser1));
    }

    @Test
    public void shouldFailToDeleteConfigOfAnotherUser() throws Exception {
        final Response res = api.create(projectId1, createConfig(projectId1, envId1), jwtUser1);
        final int id = JsonPath.read(res.readEntity(String.class), "$.id");

        final Response res2 = api.delete(projectId1, id, jwtUser2);
        Assert.assertEquals(Response.Status.UNAUTHORIZED.getStatusCode(), res2.getStatus());
        Assert.assertEquals(1, getNumberOfConfigs(projectId1, jwtUser1));
    }

    private int getNumberOfConfigs(int projectId1, String jwt) throws Exception {
        final Response res = api.getAll(projectId1, jwt);
        return objectMapper.readTree(res.readEntity(String.class)).size();
    }

    private String createConfig(int projectId, int envId) {
        return "{"
                + "\"tests\":[]"
                + ",\"driverConfig\":{\"browser\":\"chrome\"}"
                + ",\"environment\":" + envId
                + ",\"project\":" + projectId
                + "}";
    }
}
