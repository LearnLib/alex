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
import de.learnlib.alex.data.entities.Project;
import de.learnlib.alex.integrationtests.resources.api.ProjectApi;
import de.learnlib.alex.integrationtests.resources.api.SymbolGroupApi;
import de.learnlib.alex.integrationtests.resources.api.UserApi;
import org.junit.Before;
import org.junit.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import javax.ws.rs.core.Response;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import static org.junit.Assert.*;

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

        userApi.create("{\"email\":\"test@test.de\",\"username\":\"test\",\"password\":\"test\"}");

        adminJwt = userApi.login(ADMIN_EMAIL, ADMIN_PASSWORD);
        userJwt = userApi.login("test@test.de", "test");
    }

    @Test
    public void shouldCreateAProjectWithDefaultEnvironment() {
        final String url = "http://localhost:8080";
        final String project = createProjectJson("test", url);
        final Response res = projectApi.create(project, adminJwt);

        assertEquals(HttpStatus.CREATED.value(), res.getStatus());

        final String body = res.readEntity(String.class);
        JsonPath.read(body, "id");
        JsonPath.read(body, "environments[0].id");
        JsonPath.read(body, "environments[0].urls[0].id");

        final String envName = JsonPath.read(body, "environments[0].name");
        assertEquals("Production", envName);

        final String u = JsonPath.read(body, "environments[0].urls[0].url");
        assertEquals(url, u);
    }

    @Test
    public void shouldNotCreateAProjectWithoutUrls() {
        final String project = createProjectJson("test", "");
        final Response res = projectApi.create(project, adminJwt);

        assertEquals(HttpStatus.BAD_REQUEST.value(), res.getStatus());
    }

    @Test
    public void shouldDeleteMultipleProjects() {
        final String project1 = createProjectJson("p1", "http://localhost:8080");
        final String project2 = createProjectJson("p2", "http://localhost:8080");

        final Response res1 = projectApi.create(project1, adminJwt);
        final Response res2 = projectApi.create(project2, adminJwt);

        final List<String> ids = Stream.of(res1, res2)
                .map(res -> res.readEntity(Project.class).getId().toString())
                .collect(Collectors.toList());

        final Response res3 = projectApi.delete(ids, adminJwt);
        assertEquals(HttpStatus.NO_CONTENT.value(), res3.getStatus());

        final Response res4 = projectApi.getAll(adminJwt);
        assertEquals("[]", res4.readEntity(String.class));
    }

    @Test
    public void shouldNotCreateAProjectWithAnInvalidUrl() {
        final String project = createProjectJson("", "http://localhost:8080");
        final Response res = projectApi.create(project, adminJwt);

        assertEquals(HttpStatus.BAD_REQUEST.value(), res.getStatus());
    }

    @Test
    public void shouldNotCreateProjectWithEmptyTitle() {
        final String project = createProjectJson("", "http://localhost:8080");
        final Response res = projectApi.create(project, adminJwt);

        assertEquals(HttpStatus.BAD_REQUEST.value(), res.getStatus());
    }

    @Test
    public void shouldNotCreateTheSameProjectTwice() {
        final String project =
                createProjectJson("test", "http://localhost:8080");
        projectApi.create(project, adminJwt);

        final Response res = projectApi.create(project, adminJwt);

        assertEquals(HttpStatus.BAD_REQUEST.value(), res.getStatus());
    }

    @Test
    public void shouldNotGetProjectOfAnotherUser() {
        final Response res1 =
                projectApi.create(createProjectJson("test", "http://localhost:8080"), userJwt);
        final int projectId = JsonPath.read(res1.readEntity(String.class), "id");

        final Response res2 = projectApi.get(projectId, adminJwt);
        assertEquals(HttpStatus.UNAUTHORIZED.value(), res2.getStatus());
    }

    @Test
    public void shouldCreateADefaultGroup() {
        final String project =
                createProjectJson("test", "http://localhost:8080");
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
                projectApi.create(createProjectJson("test", "http://localhost:8080"), adminJwt);

        final JsonNode project = objectMapper.readTree(res1.readEntity(String.class));
        final int projectId = project.get("id").asInt();
        ((ObjectNode) project).put("name", "updatedTest");

        final Response res2 = projectApi.update(projectId, project.toString(), adminJwt);
        assertEquals(HttpStatus.OK.value(), res2.getStatus());

        final JsonNode updatedProject = objectMapper.readTree(res2.readEntity(String.class));
        assertEquals(updatedProject.get("name").asText(), "updatedTest");
    }

    @Test
    public void shouldDeleteAProject() throws Exception {
        final Response res1 =
                projectApi.create(createProjectJson("test", "http://localhost:8080"), adminJwt);
        final int projectId = JsonPath.read(res1.readEntity(String.class), "id");

        final Response res2 = projectApi.delete(projectId, adminJwt);

        assertEquals(HttpStatus.NO_CONTENT.value(), res2.getStatus());
        assertEquals(0, objectMapper.readTree(projectApi.getAll(adminJwt).readEntity(String.class)).size());
    }

    @Test
    public void shouldNotDeleteTheProjectOfAnotherUser() {
        projectApi.create(createProjectJson("test1", "http://localhost:8080"), adminJwt);

        final Response res2 =
                projectApi.create(createProjectJson("test2", "http://localhost:8080"), userJwt);
        final int projectId2 = JsonPath.read(res2.readEntity(String.class), "id");

        final Response res3 = projectApi.delete(projectId2, adminJwt);
        assertEquals(HttpStatus.UNAUTHORIZED.value(), res3.getStatus());
    }

    @Test
    public void shouldAddMembers() throws Exception {
        final Response res1 =
                projectApi.create(createProjectJson("test", "http://localhost:8080"), adminJwt);
        final int projectId = JsonPath.read(res1.readEntity(String.class), "id");

        final Response res2 =
                userApi.create("{\"email\":\"test2@test.de\",\"username\":\"test2\",\"password\":\"test2\"}");
        final int userId1 = JsonPath.read(res2.readEntity(String.class), "id");

        final Response res3 =
                userApi.create("{\"email\":\"test3@test.de\",\"username\":\"test3\",\"password\":\"test3\"}");
        final int userId2 = JsonPath.read(res3.readEntity(String.class), "id");

        final Response res4 =
                projectApi.addMembers(projectId, Arrays.asList(String.valueOf(userId1), String.valueOf(userId2)), adminJwt);
        assertEquals(HttpStatus.OK.value(), res4.getStatus());

        final JsonNode updatedProject = objectMapper.readTree(res4.readEntity(String.class));
        final ArrayList members = objectMapper.convertValue(updatedProject.get("members"), ArrayList.class);
        assertTrue(members.contains(userId1));
        assertTrue(members.contains(userId2));
        assertEquals(2, members.size());
    }

    @Test
    public void shouldAddOwners() throws Exception {
        final Response res1 =
                projectApi.create(createProjectJson("test", "http://localhost:8080"), adminJwt);
        final int projectId = JsonPath.read(res1.readEntity(String.class), "id");

        final Response res2 =
                userApi.create("{\"email\":\"test2@test.de\",\"username\":\"test2\",\"password\":\"test2\"}");
        final int userId1 = JsonPath.read(res2.readEntity(String.class), "id");

        final Response res3 =
                userApi.create("{\"email\":\"test3@test.de\",\"username\":\"test3\",\"password\":\"test3\"}");
        final int userId2 = JsonPath.read(res3.readEntity(String.class), "id");

        final Response res4 =
                projectApi.addOwners(projectId, Arrays.asList(String.valueOf(userId1), String.valueOf(userId2)), adminJwt);
        assertEquals(HttpStatus.OK.value(), res4.getStatus());

        final JsonNode updatedProject = objectMapper.readTree(res4.readEntity(String.class));
        final ArrayList owners = objectMapper.convertValue(updatedProject.get("owners"), ArrayList.class);
        assertTrue(owners.contains(userId1));
        assertTrue(owners.contains(userId2));
        assertEquals(3, owners.size());
    }

    @Test
    public void shouldPromoteMembers() throws Exception {
        final Response res1 =
                projectApi.create(createProjectJson("test", "http://localhost:8080"), adminJwt);
        final int projectId = JsonPath.read(res1.readEntity(String.class), "id");

        final Response res2 =
                userApi.create("{\"email\":\"test2@test.de\",\"username\":\"test2\",\"password\":\"test2\"}");
        final int userId1 = JsonPath.read(res2.readEntity(String.class), "id");

        final Response res3 =
                userApi.create("{\"email\":\"test3@test.de\",\"username\":\"test3\",\"password\":\"test3\"}");
        final int userId2 = JsonPath.read(res3.readEntity(String.class), "id");

        final Response res4 =
                projectApi.addMembers(projectId, Arrays.asList(String.valueOf(userId1), String.valueOf(userId2)), adminJwt);

        final Response res5 =
                projectApi.addOwners(projectId, Arrays.asList(String.valueOf(userId1), String.valueOf(userId2)), adminJwt);
        assertEquals(HttpStatus.OK.value(), res5.getStatus());

        final JsonNode updatedProject = objectMapper.readTree(res5.readEntity(String.class));
        final ArrayList owners = objectMapper.convertValue(updatedProject.get("owners"), ArrayList.class);
        final ArrayList members = objectMapper.convertValue(updatedProject.get("members"), ArrayList.class);

        assertTrue(owners.contains(userId1));
        assertTrue(owners.contains(userId2));
        assertEquals(3, owners.size());

        assertTrue(!members.contains(userId1));
        assertTrue(!members.contains(userId2));
        assertEquals(0, members.size());
    }

    @Test
    public void shouldDemoteOwners() throws Exception {
        final Response res1 =
                projectApi.create(createProjectJson("test", "http://localhost:8080"), adminJwt);
        final int projectId = JsonPath.read(res1.readEntity(String.class), "id");

        final Response res2 =
                userApi.create("{\"email\":\"test2@test.de\",\"username\":\"test2\",\"password\":\"test2\"}");
        final int userId1 = JsonPath.read(res2.readEntity(String.class), "id");

        final Response res3 =
                userApi.create("{\"email\":\"test3@test.de\",\"username\":\"test3\",\"password\":\"test3\"}");
        final int userId2 = JsonPath.read(res3.readEntity(String.class), "id");

        final Response res4 =
                projectApi.addOwners(projectId, Arrays.asList(String.valueOf(userId1), String.valueOf(userId2)), adminJwt);

        final Response res5 =
                projectApi.addMembers(projectId, Arrays.asList(String.valueOf(userId1), String.valueOf(userId2)), adminJwt);
        assertEquals(HttpStatus.OK.value(), res5.getStatus());

        final JsonNode updatedProject = objectMapper.readTree(res5.readEntity(String.class));
        final ArrayList owners = objectMapper.convertValue(updatedProject.get("owners"), ArrayList.class);
        final ArrayList members = objectMapper.convertValue(updatedProject.get("members"), ArrayList.class);

        assertTrue(members.contains(userId1));
        assertTrue(members.contains(userId2));
        assertEquals(2, members.size());

        assertTrue(!owners.contains(userId1));
        assertTrue(!owners.contains(userId2));
        assertEquals(1, owners.size());
    }

    @Test
    public void shouldRemoveMembers() throws Exception {
        final Response res1 =
                projectApi.create(createProjectJson("test", "http://localhost:8080"), adminJwt);
        final int projectId = JsonPath.read(res1.readEntity(String.class), "id");

        final Response res2 =
                userApi.create("{\"email\":\"test2@test.de\",\"username\":\"test2\",\"password\":\"test2\"}");
        final int userId1 = JsonPath.read(res2.readEntity(String.class), "id");

        final Response res3 =
                userApi.create("{\"email\":\"test3@test.de\",\"username\":\"test3\",\"password\":\"test3\"}");
        final int userId2 = JsonPath.read(res3.readEntity(String.class), "id");

        final Response res4 =
                projectApi.addMembers(projectId, Arrays.asList(String.valueOf(userId1), String.valueOf(userId2)), adminJwt);

        final Response res5 =
                projectApi.removeMembers(projectId, Arrays.asList(String.valueOf(userId1), String.valueOf(userId2)), adminJwt);
        assertEquals(HttpStatus.OK.value(), res5.getStatus());

        final JsonNode updatedProject = objectMapper.readTree(res5.readEntity(String.class));
        final ArrayList members = objectMapper.convertValue(updatedProject.get("members"), ArrayList.class);

        assertTrue(!members.contains(userId1));
        assertTrue(!members.contains(userId2));
        assertEquals(0, members.size());
    }

    @Test
    public void shouldRemoveOwners() throws Exception {
        final Response res1 =
                projectApi.create(createProjectJson("test", "http://localhost:8080"), adminJwt);
        final int projectId = JsonPath.read(res1.readEntity(String.class), "id");

        final Response res2 =
                userApi.create("{\"email\":\"test2@test.de\",\"username\":\"test2\",\"password\":\"test2\"}");
        final int userId1 = JsonPath.read(res2.readEntity(String.class), "id");

        final Response res3 =
                userApi.create("{\"email\":\"test3@test.de\",\"username\":\"test3\",\"password\":\"test3\"}");
        final int userId2 = JsonPath.read(res3.readEntity(String.class), "id");

        final Response res4 =
                projectApi.addOwners(projectId, Arrays.asList(String.valueOf(userId1), String.valueOf(userId2)), adminJwt);

        final Response res5 =
                projectApi.removeOwners(projectId, Arrays.asList(String.valueOf(userId1), String.valueOf(userId2)), adminJwt);
        assertEquals(HttpStatus.OK.value(), res5.getStatus());

        final JsonNode updatedProject = objectMapper.readTree(res5.readEntity(String.class));
        final ArrayList owners = objectMapper.convertValue(updatedProject.get("owners"), ArrayList.class);

        assertTrue(!owners.contains(userId1));
        assertTrue(!owners.contains(userId2));
        assertEquals(1, owners.size());
    }

    @Test
    public void shouldNotAllowMembersToManipulateProject() throws Exception {
        final Response res1 =
                projectApi.create(createProjectJson("test", "http://localhost:8080"), adminJwt);
        final int projectId = JsonPath.read(res1.readEntity(String.class), "id");
        final JsonNode project = objectMapper.readTree(res1.readEntity(String.class));

        final Response res2 =
                userApi.create("{\"email\":\"test2@test.de\",\"username\":\"test2\",\"password\":\"test2\"}");
        final int userId1 = JsonPath.read(res2.readEntity(String.class), "id");
        final String userId1Jwt = userApi.login("test2@test.de", "test2");

        final Response res3 =
                userApi.create("{\"email\":\"test3@test.de\",\"username\":\"test3\",\"password\":\"test3\"}");
        final int userId2 = JsonPath.read(res3.readEntity(String.class), "id");

        final Response res4 =
                projectApi.addMembers(projectId, Collections.singletonList(String.valueOf(userId1)), adminJwt);

        final Response res5 =
                projectApi.addMembers(projectId, Collections.singletonList(String.valueOf(userId2)), userId1Jwt);
        assertEquals(HttpStatus.UNAUTHORIZED.value(), res5.getStatus());

        final Response res6 =
                projectApi.addOwners(projectId, Collections.singletonList(String.valueOf(userId2)), userId1Jwt);
        assertEquals(HttpStatus.UNAUTHORIZED.value(), res6.getStatus());

        final Response res7 =
                projectApi.removeMembers(projectId, Collections.singletonList(String.valueOf(userId2)), userId1Jwt);
        assertEquals(HttpStatus.UNAUTHORIZED.value(), res7.getStatus());

        final Response res8 =
                projectApi.removeOwners(projectId, Collections.singletonList(String.valueOf(userId2)), userId1Jwt);
        assertEquals(HttpStatus.UNAUTHORIZED.value(), res8.getStatus());

        ((ObjectNode) project).put("name", "updatedTest");

        final Response res9 =
                projectApi.update(projectId, project.toString(), userId1Jwt);
        assertEquals(HttpStatus.UNAUTHORIZED.value(), res9.getStatus());

        final Response res10 =
                projectApi.delete(projectId, userId1Jwt);
        assertEquals(HttpStatus.UNAUTHORIZED.value(), res10.getStatus());
    }

    @Test
    public void shouldNotRemoveLastOwner() {
        final Response res1 =
                projectApi.create(createProjectJson("test", "http://localhost:8080"), adminJwt);
        final int projectId = JsonPath.read(res1.readEntity(String.class), "id");

        final Response res2 =
                userApi.create("{\"email\":\"test2@test.de\",\"username\":\"test2\",\"password\":\"test2\"}");
        final int userId1 = JsonPath.read(res2.readEntity(String.class), "id");

        final Response res3 =
                projectApi.addOwners(projectId, Collections.singletonList(String.valueOf(userId1)), adminJwt);

        final Response res4 =
                projectApi.removeOwners(projectId, Arrays.asList("1", String.valueOf(userId1)), adminJwt);
        assertEquals(HttpStatus.UNAUTHORIZED.value(), res4.getStatus());

        final Response res5 =
                projectApi.addMembers(projectId, Arrays.asList("1", String.valueOf(userId1)), adminJwt);
        assertEquals(HttpStatus.UNAUTHORIZED.value(), res5.getStatus());
    }

    @Test
    public void shouldNotAllowMembersToManipulateProjectEnvironments() throws Exception {
        final Response res1 =
                projectApi.create(createProjectJson("test", "http://localhost:8080"), adminJwt);
        final int projectId = JsonPath.read(res1.readEntity(String.class), "id");
        final JsonNode project = objectMapper.readTree(res1.readEntity(String.class));

        final Response res2 =
                userApi.create("{\"email\":\"test2@test.de\",\"username\":\"test2\",\"password\":\"test2\"}");
        final int userId1 = JsonPath.read(res2.readEntity(String.class), "id");
        final String userId1Jwt = userApi.login("test2@test.de", "test2");
    }

    @Test
    public void shouldCrudProject() throws Exception {
        final Response res1 =
                projectApi.create(createProjectJson("test", "http://localhost:8080"), adminJwt);
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

    private String createProjectJson(String name, String url) {
        return "{"
                + "\"name\":\"" + name + "\""
                + ",\"url\":\"" + url + "\""
                + "}";
    }
}
