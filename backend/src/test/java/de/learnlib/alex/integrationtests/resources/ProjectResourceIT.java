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

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.jayway.jsonpath.JsonPath;
import de.learnlib.alex.integrationtests.resources.api.ProjectApi;
import de.learnlib.alex.integrationtests.resources.api.SymbolGroupApi;
import de.learnlib.alex.integrationtests.resources.api.UserApi;
import org.junit.Before;
import org.junit.Test;
import org.skyscreamer.jsonassert.JSONAssert;
import org.springframework.http.HttpStatus;

import javax.ws.rs.core.Response;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import static org.junit.Assert.assertEquals;

public class ProjectResourceIT extends AbstractResourceIT {

    private String adminJwt;

    private String userJwt;

    private UserApi userApi;

    private ProjectApi projectApi;

    private SymbolGroupApi symbolGroupApi;

    @Before
    public void pre() {
        userApi = new UserApi(client, port);
        projectApi = new ProjectApi(client, port);
        symbolGroupApi = new SymbolGroupApi(client, port);

        userApi.create("{\"email\":\"test@test.de\",\"password\":\"test\"}");

        adminJwt = userApi.login(ADMIN_EMAIL, ADMIN_PASSWORD);
        userJwt = userApi.login("test@test.de", "test");
    }

    @Test
    public void shouldCreateAProject() {
        final String project =
                createProjectJson("test", Arrays.asList("http://localhost:8080", "http://localhost:8081"));
        final Response res = projectApi.create(project, adminJwt);

        assertEquals(HttpStatus.CREATED.value(), res.getStatus());

        final String body = res.readEntity(String.class);
        JsonPath.read(body, "id");
        JsonPath.read(body, "urls[0].id");
        JsonPath.read(body, "urls[1].id");
    }

    @Test
    public void shouldNotCreateAProjectWithoutUrls() {
        final String project = createProjectJson("test", new ArrayList<>());
        final Response res = projectApi.create(project, adminJwt);

        assertEquals(HttpStatus.BAD_REQUEST.value(), res.getStatus());
    }

    @Test
    public void shouldNotCreateAProjectWithAnInvalidUrl() {
        final String project = createProjectJson("", Arrays.asList("http://localhost:8080", "asdasd"));
        final Response res = projectApi.create(project, adminJwt);

        assertEquals(HttpStatus.BAD_REQUEST.value(), res.getStatus());
    }

    @Test
    public void shouldNotCreateProjectWithEmptyTitle() {
        final String project = createProjectJson("", Arrays.asList("http://localhost:8080", "http://localhost:8081"));
        final Response res = projectApi.create(project, adminJwt);

        assertEquals(HttpStatus.BAD_REQUEST.value(), res.getStatus());
    }

    @Test
    public void shouldNotCreateTheSameProjectTwice() {
        final String project =
                createProjectJson("test", Arrays.asList("http://localhost:8080", "http://localhost:8081"));
        projectApi.create(project, adminJwt);

        final Response res = projectApi.create(project, adminJwt);

        assertEquals(HttpStatus.BAD_REQUEST.value(), res.getStatus());
    }

    @Test
    public void shouldNotGetProjectOfAnotherUser() {
        final Response res1 =
                projectApi.create(createProjectJson("test", Arrays.asList("http://localhost:8080", "http://localhost:8081")), userJwt);
        final int projectId = JsonPath.read(res1.readEntity(String.class), "id");

        final Response res2 = projectApi.get(projectId, adminJwt);
        assertEquals(HttpStatus.UNAUTHORIZED.value(), res2.getStatus());
    }

    @Test
    public void shouldCreateADefaultGroup() {
        final String project =
                createProjectJson("test", Arrays.asList("http://localhost:8080", "http://localhost:8081"));
        final Response res = projectApi.create(project, adminJwt);

        final int projectId = JsonPath.read(res.readEntity(String.class), "id");

        final Response res2 = symbolGroupApi.getAll(projectId, adminJwt);

        final String body = res2.readEntity(String.class);
        JsonPath.read(body, "[0].id");
        assertEquals(JsonPath.read(body, "[0].name"), "Default group");
    }

    @Test
    public void shouldNotBePossibleToGetANonExistingProject() {
        final Response res = projectApi.get(-1, adminJwt);
        assertEquals(HttpStatus.NOT_FOUND.value(), res.getStatus());
    }

    @Test
    public void shouldUpdateAProject() throws Exception {
        final Response res1 =
                projectApi.create(createProjectJson("test", Arrays.asList("http://localhost:8080", "http://localhost:8081")), adminJwt);

        final JsonNode project = objectMapper.readTree(res1.readEntity(String.class));
        final int projectId = project.get("id").asInt();
        ((ObjectNode) project).put("name", "updatedTest");

        final Response res2 = projectApi.update(projectId, project.toString(), adminJwt);
        assertEquals(HttpStatus.OK.value(), res2.getStatus());

        final JsonNode updatedProject = objectMapper.readTree(res2.readEntity(String.class));
        assertEquals(updatedProject.get("name").asText(), "updatedTest");

        JSONAssert.assertEquals(project.get("urls").toString(), updatedProject.get("urls").toString(), true);
    }

    @Test
    public void shouldNotUpdateNonExistingProject() throws Exception {
        final JsonNode project =
                objectMapper.readTree(createProjectJson("test", Arrays.asList("http://localhost:8080", "http://localhost:8081")));
        ((ObjectNode) project).put("id", -1);

        final Response res = projectApi.update(-1, project.toString(), adminJwt);
        assertEquals(HttpStatus.NOT_FOUND.value(), res.getStatus());
    }

    @Test
    public void shouldNotUpdateTheProjectOfAnotherUser() throws Exception {
        final Response res1 =
                projectApi.create(createProjectJson("test", Arrays.asList("http://localhost:8080", "http://localhost:8081")), userJwt);

        final JsonNode projectPre = objectMapper.readTree(res1.readEntity(String.class));
        final int projectId = projectPre.get("id").asInt();
        ((ObjectNode) projectPre).put("name", "updatedTest");

        final Response res2 = projectApi.update(projectId, projectPre.toString(), adminJwt);
        assertEquals(HttpStatus.UNAUTHORIZED.value(), res2.getStatus());

        ((ObjectNode) projectPre).put("name", "test");
        final Response res3 = projectApi.get(projectId, userJwt);
        final JsonNode projectPost = objectMapper.readTree(res3.readEntity(String.class));
        JSONAssert.assertEquals(projectPre.toString(), projectPost.toString(), true);
    }

    @Test
    public void shouldDeleteAProject() throws Exception {
        final Response res1 =
                projectApi.create(createProjectJson("test", Arrays.asList("http://localhost:8080", "http://localhost:8081")), adminJwt);
        final int projectId = JsonPath.read(res1.readEntity(String.class), "id");

        final Response res2 = projectApi.delete(projectId, adminJwt);

        assertEquals(HttpStatus.NO_CONTENT.value(), res2.getStatus());
        assertEquals(0, objectMapper.readTree(projectApi.getAll(adminJwt).readEntity(String.class)).size());
    }

    @Test
    public void shouldNotDeleteTheProjectOfAnotherUser() {
        projectApi.create(createProjectJson("test1", Arrays.asList("http://localhost:8080", "http://localhost:8081")), adminJwt);

        final Response res2 =
                projectApi.create(createProjectJson("test2", Arrays.asList("http://localhost:8080", "http://localhost:8081")), userJwt);
        final int projectId2 = JsonPath.read(res2.readEntity(String.class), "id");

        final Response res3 = projectApi.delete(projectId2, adminJwt);
        assertEquals(HttpStatus.UNAUTHORIZED.value(), res3.getStatus());
    }

    @Test
    public void shouldCrudProject() throws Exception {
        final Response res1 =
                projectApi.create(createProjectJson("test", Arrays.asList("http://localhost:8080", "http://localhost:8081")), adminJwt);
        final JsonNode project = objectMapper.readTree(res1.readEntity(String.class));
        final int projectId = project.get("id").asInt();
        assertEquals(HttpStatus.CREATED.value(), res1.getStatus());

        final Response res2 = projectApi.get(projectId, adminJwt);
        assertEquals(HttpStatus.OK.value(), res2.getStatus());

        ((ObjectNode) project).put("name", "updatedName");
        final Response res3 = projectApi.update(projectId, project.toString(), adminJwt);
        assertEquals(HttpStatus.OK.value(), res3.getStatus());

        final Response res4 = projectApi.delete(projectId, adminJwt);
        assertEquals(HttpStatus.NO_CONTENT.value(), res4.getStatus());

        final Response res5 = projectApi.get(projectId, adminJwt);
        assertEquals(HttpStatus.NOT_FOUND.value(), res5.getStatus());
    }

    @Test
    public void shouldNotUpdateIfUrlsAreEmpty() throws Exception {
        final List<String> urls = Arrays.asList("http://localhost:8080", "http://localhost:8081");
        final Response res1 = projectApi.create(createProjectJson("test", urls), adminJwt);
        final JsonNode projectPre = objectMapper.readTree(res1.readEntity(String.class));
        final int projectId = projectPre.get("id").asInt();

        final JsonNode projectToUpdate = objectMapper.readTree(projectPre.toString());
        ((ObjectNode) projectToUpdate).putArray("urls");

        final Response res2 = projectApi.update(projectId, projectToUpdate.toString(), adminJwt);
        assertEquals(HttpStatus.BAD_REQUEST.value(), res2.getStatus());

        final Response res3 = projectApi.get(projectId, adminJwt);
        JSONAssert.assertEquals(projectPre.toString(), res3.readEntity(String.class), true);
    }

    private String createProjectJson(String name, List<String> urls) {
        final List<String> urlsJson = urls.stream()
                .map(url -> "{\"name\":null, \"url\":\"" + url + "\"}")
                .collect(Collectors.toList());

        return "{"
                + "\"name\":\"" + name + "\""
                + ",\"urls\":[" + String.join(",", urlsJson) + "]"
                + "}";
    }
}
