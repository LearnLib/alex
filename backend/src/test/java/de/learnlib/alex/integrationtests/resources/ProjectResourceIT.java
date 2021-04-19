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

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.jayway.jsonpath.JsonPath;
import de.learnlib.alex.auth.entities.User;
import de.learnlib.alex.data.entities.Project;
import de.learnlib.alex.integrationtests.SpringRestError;
import de.learnlib.alex.integrationtests.resources.api.ProjectApi;
import de.learnlib.alex.integrationtests.resources.api.SymbolGroupApi;
import de.learnlib.alex.integrationtests.resources.api.UserApi;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import javax.ws.rs.core.GenericType;
import javax.ws.rs.core.Response;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;

public class ProjectResourceIT extends AbstractResourceIT {

    private String adminJwt;
    private User admin;
    private String user1Jwt;
    private User user1;
    private String user2Jwt;
    private User user2;

    private UserApi userApi;
    private ProjectApi projectApi;
    private SymbolGroupApi symbolGroupApi;

    @BeforeEach
    public void pre() {
        userApi = new UserApi(client, port);
        projectApi = new ProjectApi(client, port);
        symbolGroupApi = new SymbolGroupApi(client, port);

        userApi.create("{\"email\":\"test@test.de\",\"username\":\"test\",\"password\":\"test\"}");
        userApi.create("{\"email\":\"user2@test.de\",\"username\":\"user2\",\"password\":\"test\"}");

        adminJwt = userApi.login(ADMIN_EMAIL, ADMIN_PASSWORD);
        user1Jwt = userApi.login("test@test.de", "test");
        user2Jwt = userApi.login("user2@test.de", "test");

        admin = userApi.getProfile(adminJwt).readEntity(User.class);
        user1 = userApi.getProfile(user1Jwt).readEntity(User.class);
        user2 = userApi.getProfile(user2Jwt).readEntity(User.class);
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
    public void shouldImportProject() throws Exception {
        final String path = Thread.currentThread().getContextClassLoader().getResource("integrationtest/ALEX-rest.project.json").getPath();
        final String content = new String(Files.readAllBytes(Paths.get(path)));

        final Response res = projectApi.importProject(content, adminJwt);
        assertEquals(HttpStatus.CREATED.value(), res.getStatus());
    }

    @Test
    public void shouldNotGetProjectOfAnotherUser() {
        final Project project = projectApi.create(createProjectJson("test", "http://localhost:8080"), adminJwt)
                .readEntity(Project.class);

        final Response res2 = projectApi.get(project.getId(), user1Jwt);
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
        final Response res = projectApi.get(-1L, adminJwt);
        assertEquals(HttpStatus.NOT_FOUND.value(), res.getStatus());
    }

    @Test
    public void shouldUpdateAProject() throws Exception {
        final Project project = createTestProject(adminJwt);
        project.setName("updatedTest");

        final Response res = projectApi.update(project.getId(), objectMapper.writeValueAsString(project), adminJwt);
        assertEquals(HttpStatus.OK.value(), res.getStatus());

        final Project updatedProject = res.readEntity(Project.class);
        assertEquals("updatedTest", updatedProject.getName());
    }

    @Test
    public void shouldDeleteAProject() throws Exception {
        final Project project = createTestProject(adminJwt);
        final Response res = projectApi.delete(project.getId(), adminJwt);

        assertEquals(HttpStatus.NO_CONTENT.value(), res.getStatus());
        assertEquals(0, objectMapper.readTree(projectApi.getAll(adminJwt).readEntity(String.class)).size());
    }

    @Test
    public void shouldNotDeleteTheProjectOfAnotherUser() {
        final Project project = createTestProject(adminJwt);

        final Response res1 = projectApi.delete(project.getId(), user1Jwt);
        assertEquals(HttpStatus.UNAUTHORIZED.value(), res1.getStatus());

        final Response res2 = projectApi.get(project.getId(), adminJwt);
        assertEquals(HttpStatus.OK.value(), res2.getStatus());
        res2.readEntity(Project.class);
    }

    @Test
    public void shouldAddMembers() throws Exception {
        final Project project = projectApi.create(createProjectJson("test", "http://localhost:8080"), adminJwt)
                .readEntity(Project.class);

        final Response res = projectApi.addMembers(project.getId(), Arrays.asList(user1.getId(), user2.getId()), adminJwt);
        assertEquals(HttpStatus.OK.value(), res.getStatus());

        final JsonNode updatedProject = objectMapper.readTree(res.readEntity(String.class));
        final List<Long> members = Arrays.asList(objectMapper.convertValue(updatedProject.get("members"), Long[].class));
        assertEquals(2, members.size());
        assertTrue(members.contains(user1.getId()));
        assertTrue(members.contains(user2.getId()));
    }

    @Test
    public void shouldAddOwnersAsOwner() throws Exception {
        final Project project = projectApi.create(createProjectJson("test", "http://localhost:8080"), adminJwt)
                .readEntity(Project.class);

        final Response res = projectApi.addOwners(project.getId(), Arrays.asList(user1.getId(), user2.getId()), adminJwt);
        assertEquals(HttpStatus.OK.value(), res.getStatus());

        final JsonNode updatedProject = objectMapper.readTree(res.readEntity(String.class));
        final List<Long> owners = Arrays.asList(objectMapper.convertValue(updatedProject.get("owners"), Long[].class));
        assertEquals(3, owners.size());
        assertTrue(owners.contains(user1.getId()));
        assertTrue(owners.contains(user2.getId()));
    }

    @Test
    public void shouldPromoteMembersAsOwner() throws Exception {
        final Project project = projectApi.create(createProjectJson("test", "http://localhost:8080"), adminJwt)
                .readEntity(Project.class);

        projectApi.addMembers(project.getId(), Arrays.asList(user1.getId(), user2.getId()), adminJwt);

        final Response res1 = projectApi.addOwners(project.getId(), Arrays.asList(user1.getId(), user2.getId()), adminJwt);
        assertEquals(HttpStatus.OK.value(), res1.getStatus());

        final JsonNode updatedProject = objectMapper.readTree(res1.readEntity(String.class));
        final List<Long> ownerIds = Arrays.asList(objectMapper.convertValue(updatedProject.get("owners"), Long[].class));
        final List<Long> memberIds = Arrays.asList(objectMapper.convertValue(updatedProject.get("members"), Long[].class));

        assertEquals(0, memberIds.size());
        assertEquals(3, ownerIds.size());
        assertTrue(ownerIds.contains(user1.getId()));
        assertTrue(ownerIds.contains(user2.getId()));
    }

    @Test
    public void shouldDemoteOwnersAsOwner() throws Exception {
        final Project project = projectApi.create(createProjectJson("test", "http://localhost:8080"), adminJwt)
                .readEntity(Project.class);

        projectApi.addOwners(project.getId(), Arrays.asList(user1.getId(), user2.getId()), adminJwt);

        final Response res1 = projectApi.addMembers(project.getId(), Arrays.asList(user1.getId(), user2.getId()), adminJwt);
        assertEquals(HttpStatus.OK.value(), res1.getStatus());

        final JsonNode updatedProject = objectMapper.readTree(res1.readEntity(String.class));
        final List<Long> ownerIds = Arrays.asList(objectMapper.convertValue(updatedProject.get("owners"), Long[].class));
        final List<Long> memberIds = Arrays.asList(objectMapper.convertValue(updatedProject.get("members"), Long[].class));

        assertEquals(2, memberIds.size());
        assertTrue(memberIds.contains(user1.getId()));
        assertTrue(memberIds.contains(user2.getId()));

        assertEquals(1, ownerIds.size());
        assertFalse(ownerIds.contains(user1.getId()));
        assertFalse(ownerIds.contains(user2.getId()));
    }

    @Test
    public void shouldRemoveMembers() throws Exception {
        final Project project = projectApi.create(createProjectJson("test", "http://localhost:8080"), adminJwt)
                .readEntity(Project.class);

        projectApi.addMembers(project.getId(), Arrays.asList(user1.getId(), user2.getId()), adminJwt);

        final Response res1 = projectApi.removeMembers(project.getId(), Arrays.asList(user1.getId(), user2.getId()), adminJwt);
        assertEquals(HttpStatus.OK.value(), res1.getStatus());

        final JsonNode updatedProject = objectMapper.readTree(
                projectApi.get(project.getId(), adminJwt).readEntity(String.class)
        );

        final List<Long> ownerIds = Arrays.asList(
                objectMapper.readValue(updatedProject.get("owners").toString(), Long[].class)
        );

        assertEquals(1, ownerIds.size());
        assertFalse(ownerIds.contains(user1.getId()));
        assertFalse(ownerIds.contains(user2.getId()));
    }

    @Test
    public void shouldRemoveOwnersAsOwner() throws Exception {
        final Project project = projectApi.create(createProjectJson("test", "http://localhost:8080"), adminJwt)
                .readEntity(Project.class);

        projectApi.addOwners(project.getId(), Arrays.asList(user1.getId(), user2.getId()), adminJwt);

        final Response res1 = projectApi.removeOwners(project.getId(), Arrays.asList(user1.getId(), user2.getId()), adminJwt);
        assertEquals(HttpStatus.OK.value(), res1.getStatus());

        final JsonNode updatedProject = objectMapper.readTree(
                projectApi.get(project.getId(), adminJwt).readEntity(String.class)
        );

        final List<Long> ownerIds = Arrays.asList(
                objectMapper.readValue(updatedProject.get("owners").toString(), Long[].class)
        );

        assertEquals(1, ownerIds.size());
        assertFalse(ownerIds.contains(user1.getId()));
        assertFalse(ownerIds.contains(user2.getId()));
    }

    @Test
    public void shouldNotAllowMembersToUpdateTheProject() throws Exception {
        Project project = projectApi.create(createProjectJson("test", "http://localhost:8080"), adminJwt)
                .readEntity(Project.class);

        projectApi.addMembers(project.getId(), Collections.singletonList(user1.getId()), adminJwt);

        project.setName("updatedTest");

        final Response res1 = projectApi.update(project.getId(), objectMapper.writeValueAsString(project), user1Jwt);
        assertEquals(HttpStatus.UNAUTHORIZED.value(), res1.getStatus());

        project = projectApi.get(project.getId(), adminJwt).readEntity(Project.class);
        assertEquals("test", project.getName());
    }

    @Test
    public void shouldNotRemoveLastOwner() throws IOException {
        final Project project = projectApi.create(createProjectJson("test", "http://localhost:8080"), adminJwt)
                .readEntity(Project.class);

        projectApi.addOwners(project.getId(), Collections.singletonList(user1.getId()), adminJwt);

        final Response res = projectApi.removeOwners(project.getId(), Arrays.asList(admin.getId(), user1.getId()), adminJwt);
        assertEquals(HttpStatus.BAD_REQUEST.value(), res.getStatus());

        final JsonNode projectJson = objectMapper.readTree(
                projectApi.get(project.getId(), adminJwt).readEntity(String.class)
        );

        assertEquals(0, projectJson.get("members").size());
        assertEquals(2, projectJson.get("owners").size());
    }

    @Test
    public void shouldCrudProject() throws Exception {
        final Response res1 = projectApi.create(createProjectJson("test", "http://localhost:8080"), adminJwt);
        final Project project = res1.readEntity(Project.class);

        assertEquals(HttpStatus.CREATED.value(), res1.getStatus());

        final Response res2 = projectApi.get(project.getId(), adminJwt);
        assertEquals(HttpStatus.OK.value(), res2.getStatus());

        project.setName("updatedName");
        final Response res3 = projectApi.update(project.getId(), objectMapper.writeValueAsString(project), adminJwt);
        assertEquals(HttpStatus.OK.value(), res3.getStatus());

        final Response res4 = projectApi.delete(project.getId(), adminJwt);
        assertEquals(HttpStatus.NO_CONTENT.value(), res4.getStatus());

        final Response res5 = projectApi.get(project.getId(), adminJwt);
        assertEquals(HttpStatus.NOT_FOUND.value(), res5.getStatus());
    }

    @Test
    public void shouldCreateProjectWithAlreadyExistingName() throws IOException {
        final Response res1 =
                projectApi.create(createProjectJson("test", "http://localhost:8080"), adminJwt);
        assertEquals(HttpStatus.CREATED.value(), res1.getStatus());

        final JsonNode project1 = objectMapper.readTree(res1.readEntity(String.class));
        final int projectId1 = project1.get("id").asInt();

        final Response res2 =
                projectApi.create(createProjectJson("test", "http://localhost:8080"), adminJwt);
        assertEquals(HttpStatus.CREATED.value(), res2.getStatus());

        final JsonNode project2 = objectMapper.readTree(res2.readEntity(String.class));
        final int projectId2 = project2.get("id").asInt();

        final Response res3 =
                projectApi.getAll(adminJwt);
        final String body = res3.readEntity(String.class);
        List<Integer> projectIds = new ArrayList<>();
        projectIds.add(JsonPath.read(body, "[0].id"));
        projectIds.add(JsonPath.read(body, "[1].id"));
        assertTrue(projectIds.contains(projectId1));
        assertTrue(projectIds.contains(projectId2));
    }

    @Test
    public void shouldUpdateProjectNameToAlreadyExistingName() throws IOException {
        final Response res1 =
                projectApi.create(createProjectJson("test", "http://localhost:8080"), adminJwt);
        assertEquals(HttpStatus.CREATED.value(), res1.getStatus());

        final JsonNode project1 = objectMapper.readTree(res1.readEntity(String.class));
        final Long projectId1 = project1.get("id").asLong();

        final Response res2 =
                projectApi.create(createProjectJson("test2", "http://localhost:8080"), adminJwt);
        assertEquals(HttpStatus.CREATED.value(), res2.getStatus());

        final JsonNode project2 = objectMapper.readTree(res2.readEntity(String.class));
        final Long projectId2 = project2.get("id").asLong();

        ((ObjectNode) project2).put("name", "test");

        final Response res3 = projectApi.update(projectId2, project2.toString(), adminJwt);
        assertEquals(HttpStatus.OK.value(), res3.getStatus());

        final List<Long> projectIds = projectApi.getAll(adminJwt)
                .readEntity(new GenericType<List<Project>>() {
                })
                .stream()
                .map(Project::getId)
                .collect(Collectors.toList());

        assertTrue(projectIds.contains(projectId1));
        assertTrue(projectIds.contains(projectId2));
    }

    @Test
    public void shouldGetCorrectlyAddedToProjectWithSameName() throws IOException {
        final Response res1 = projectApi.create(createProjectJson("test", "http://localhost:8080"), adminJwt);
        assertEquals(HttpStatus.CREATED.value(), res1.getStatus());

        final Project project1 = res1.readEntity(Project.class);

        final Response res2 = projectApi.create(createProjectJson("test2", "http://localhost:8080"), user1Jwt);
        assertEquals(HttpStatus.CREATED.value(), res2.getStatus());

        final Project project2 = res2.readEntity(Project.class);

        final Response res3 = projectApi.addOwners(project1.getId(), Collections.singletonList(user1.getId()), adminJwt);
        assertEquals(HttpStatus.OK.value(), res3.getStatus());

        final List<Long> projectIds = projectApi.getAll(user1Jwt)
                .readEntity(new GenericType<List<Project>>() {
                })
                .stream()
                .map(Project::getId)
                .collect(Collectors.toList());

        assertTrue(projectIds.contains(project1.getId()));
        assertTrue(projectIds.contains(project2.getId()));
    }

    @Test
    public void memberShouldNotDeleteProject() {
        Project project = createTestProject(adminJwt);

        project = projectApi.addMembers(project.getId(), Collections.singletonList(user1.getId()), adminJwt)
                .readEntity(Project.class);

        final Response res = projectApi.delete(project.getId(), user1Jwt);
        assertEquals(HttpStatus.UNAUTHORIZED.value(), res.getStatus());
        res.readEntity(SpringRestError.class);

        final Response res2 = projectApi.get(project.getId(), adminJwt);
        assertEquals(HttpStatus.OK.value(), res2.getStatus());
        res2.readEntity(Project.class);
    }

    @Test
    public void memberShouldNotPromoteHimself() throws IOException {
        Project project = createTestProject(adminJwt);

        project = projectApi.addMembers(project.getId(), Collections.singletonList(user1.getId()), adminJwt)
                .readEntity(Project.class);

        final Response res1 = projectApi.addOwners(project.getId(), Collections.singletonList(user1.getId()), user1Jwt);
        assertEquals(HttpStatus.UNAUTHORIZED.value(), res1.getStatus());
        res1.readEntity(SpringRestError.class);

        final JsonNode project2 = objectMapper.readTree(
                projectApi.get(project.getId(), adminJwt).readEntity(String.class)
        );

        assertEquals(1, project2.get("members").size());
        assertEquals((long) user1.getId(), project2.get("members").get(0).asLong());
        assertEquals(1, project2.get("owners").size());
        assertEquals((long) admin.getId(), project2.get("owners").get(0).asLong());
    }

    @Test
    public void memberShouldNotDemoteOwner() throws IOException {
        Project project = createTestProject(adminJwt);

        project = projectApi.addMembers(project.getId(), Collections.singletonList(user1.getId()), adminJwt)
                .readEntity(Project.class);

        final Response res1 = projectApi.removeOwners(project.getId(), Collections.singletonList(admin.getId()), user1Jwt);
        assertEquals(HttpStatus.UNAUTHORIZED.value(), res1.getStatus());
        res1.readEntity(SpringRestError.class);

        final JsonNode project2 = objectMapper.readTree(
                projectApi.get(project.getId(), adminJwt).readEntity(String.class)
        );

        assertEquals(1, project2.get("members").size());
        assertEquals((long) user1.getId(), project2.get("members").get(0).asLong());
        assertEquals(1, project2.get("owners").size());
        assertEquals((long) admin.getId(), project2.get("owners").get(0).asLong());
    }

    @Test
    public void memberShouldNotRemoveOtherMember() throws IOException {
        Project project = createTestProject(adminJwt);

        project = projectApi.addMembers(project.getId(), Collections.singletonList(user1.getId()), adminJwt)
                .readEntity(Project.class);
        project = projectApi.addMembers(project.getId(), Collections.singletonList(user2.getId()), adminJwt)
                .readEntity(Project.class);

        final Response res1 = projectApi.removeMembers(project.getId(), Collections.singletonList(user2.getId()), user1Jwt);
        assertEquals(HttpStatus.UNAUTHORIZED.value(), res1.getStatus());
        res1.readEntity(SpringRestError.class);

        final JsonNode project2 = objectMapper.readTree(
                projectApi.get(project.getId(), adminJwt).readEntity(String.class)
        );

        final List<Long> memberIds = Arrays.asList(objectMapper.readValue(project2.get("members").toString(), Long[].class));
        assertEquals(2, memberIds.size());
        assertTrue(memberIds.contains(user1.getId()));
        assertTrue(memberIds.contains(user2.getId()));
    }

    @Test
    public void memberShouldNotRemoveOtherOwner() throws IOException {
        Project project = createTestProject(adminJwt);

        project = projectApi.addMembers(project.getId(), Collections.singletonList(user1.getId()), adminJwt)
                .readEntity(Project.class);

        final Response res1 = projectApi.removeOwners(project.getId(), Collections.singletonList(admin.getId()), user1Jwt);
        assertEquals(HttpStatus.UNAUTHORIZED.value(), res1.getStatus());
        res1.readEntity(SpringRestError.class);

        final JsonNode project2 = objectMapper.readTree(
                projectApi.get(project.getId(), adminJwt).readEntity(String.class)
        );

        final List<Long> ownerIds = Arrays.asList(objectMapper.readValue(project2.get("owners").toString(), Long[].class));
        assertEquals(1, ownerIds.size());
        assertTrue(ownerIds.contains(admin.getId()));
    }

    private Project createTestProject(String jwt) {
        return projectApi.create(createProjectJson("test", "http://localhost:8080"), jwt)
                .readEntity(Project.class);
    }

    private String createProjectJson(String name, String url) {
        return "{"
                + "\"name\":\"" + name + "\""
                + ",\"url\":\"" + url + "\""
                + "}";
    }
}
