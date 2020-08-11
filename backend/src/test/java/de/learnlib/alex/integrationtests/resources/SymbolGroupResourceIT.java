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

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.jayway.jsonpath.JsonPath;
import de.learnlib.alex.data.entities.Project;
import de.learnlib.alex.data.entities.Symbol;
import de.learnlib.alex.data.entities.SymbolGroup;
import de.learnlib.alex.integrationtests.resources.api.ProjectApi;
import de.learnlib.alex.integrationtests.resources.api.SymbolApi;
import de.learnlib.alex.integrationtests.resources.api.SymbolGroupApi;
import de.learnlib.alex.integrationtests.resources.api.UserApi;
import de.learnlib.alex.integrationtests.websocket.util.SymbolPresenceServiceWSMessages;
import de.learnlib.alex.integrationtests.websocket.util.WebSocketUser;
import org.junit.Before;
import org.junit.Test;
import org.skyscreamer.jsonassert.JSONAssert;
import org.springframework.http.HttpStatus;

import javax.ws.rs.core.GenericType;
import javax.ws.rs.core.Response;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

public class SymbolGroupResourceIT extends AbstractResourceIT {

    private String jwtUser1;

    private String jwtUser2;

    private int projectId1;

    private int projectId2;

    private SymbolGroupApi symbolGroupApi;

    @Before
    public void pre() {
        final UserApi userApi = new UserApi(client, port);
        ProjectApi projectApi = new ProjectApi(client, port);
        symbolGroupApi = new SymbolGroupApi(client, port);

        userApi.create("{\"email\":\"test1@test.de\",\"username\":\"test1\",\"password\":\"test\"}");
        userApi.create("{\"email\":\"test2@test.de\",\"username\":\"test2\",\"password\":\"test\"}");

        jwtUser1 = userApi.login("test1@test.de", "test");
        jwtUser2 = userApi.login("test2@test.de", "test");

        final Response res1 =
                projectApi.create("{\"name\":\"test\",\"url\":\"http://localhost:8080\"}", jwtUser1);
        final Response res2 =
                projectApi.create("{\"name\":\"test\",\"url\":\"http://localhost:8080\"}", jwtUser2);

        projectId1 = JsonPath.read(res1.readEntity(String.class), "id");
        projectId2 = JsonPath.read(res2.readEntity(String.class), "id");
    }

    @Test
    public void shouldHaveCreatedADefaultGroup() throws Exception {
        assertEquals(1, getNumberOfGroups(projectId1, jwtUser1));

        final Response res = symbolGroupApi.getAll(projectId1, jwtUser1);
        final String name = JsonPath.read(res.readEntity(String.class), "[0].name");
        assertEquals(HttpStatus.OK.value(), res.getStatus());
        assertEquals("Default group", name);
    }

    @Test
    public void shouldCreateAGroup() throws Exception {
        final String group = createSymbolGroupJson(projectId1, "group", null);
        final Response res = symbolGroupApi.create(projectId1, group, jwtUser1);
        assertEquals(HttpStatus.CREATED.value(), res.getStatus());
        assertEquals(2, getNumberOfGroups(projectId1, jwtUser1));
        JsonPath.read(res.readEntity(String.class), "id");
    }

    @Test
    public void createAGroupWithAParent() throws Exception {
        SymbolGroup parent = new SymbolGroup();
        parent.setName("parent");

        parent = symbolGroupApi.create(projectId1, objectMapper.writeValueAsString(parent), jwtUser1)
                .readEntity(SymbolGroup.class);

        SymbolGroup child = new SymbolGroup();
        child.setName("child");
        child.setParent(parent);

        final Response res = symbolGroupApi.create(projectId1, objectMapper.writeValueAsString(child), jwtUser1);
        child = res.readEntity(SymbolGroup.class);

        assertEquals(HttpStatus.CREATED.value(), res.getStatus());
        assertEquals(parent.getId(), child.getParent().getId());
    }

    @Test
    public void shouldFailToCreateAGroupIfNameIsEmpty() throws Exception {
        final String group2 = createSymbolGroupJson(projectId1, "", null);
        final Response res2 = symbolGroupApi.create(projectId1, group2, jwtUser1);
        assertEquals(HttpStatus.BAD_REQUEST.value(), res2.getStatus());
        assertEquals(1, getNumberOfGroups(projectId1, jwtUser1));
    }

    @Test
    public void shouldIncrementTheNameIfGroupNameExists() {
        final String group = createSymbolGroupJson(projectId1, "group", null);
        symbolGroupApi.create(projectId1, group, jwtUser1);
        final Response res = symbolGroupApi.create(projectId1, group, jwtUser1);
        assertEquals(HttpStatus.CREATED.value(), res.getStatus());
        final String name = JsonPath.read(res.readEntity(String.class), "name");
        assertEquals(name, "group (1)");
    }

    @Test
    public void shouldNotCreateAGroupInAnotherUsersProject() throws Exception {
        final String group = createSymbolGroupJson(projectId2, "group", null);
        final Response res = symbolGroupApi.create(projectId2, group, jwtUser1);
        assertEquals(HttpStatus.UNAUTHORIZED.value(), res.getStatus());
        assertEquals(1, getNumberOfGroups(projectId1, jwtUser1));
        assertEquals(1, getNumberOfGroups(projectId2, jwtUser2));
    }

    @Test
    public void shouldMoveGroup() throws Exception {
        final String defaultGroup = getDefaultGroupJson(projectId1, jwtUser1);
        final int defaultGroupId = JsonPath.read(defaultGroup, "id");

        final String group = createSymbolGroupJson(projectId1, "childGroup", null);
        final Response res1 = symbolGroupApi.create(projectId1, group, jwtUser1);
        final int groupId = JsonPath.read(res1.readEntity(String.class), "id");

        final String updatedGroup = ((ObjectNode) objectMapper.readTree(group))
                .put("id", groupId)
                .put("parent", defaultGroupId)
                .toString();

        final Response res2 = symbolGroupApi.move(projectId1, groupId, updatedGroup, jwtUser1);
        assertEquals(HttpStatus.OK.value(), res2.getStatus());
        assertEquals(1, getNumberOfGroups(projectId1, jwtUser1));

        final Response res3 = symbolGroupApi.getAll(projectId1, jwtUser1);
        final int id = JsonPath.read(res3.readEntity(String.class), "[0].groups[0].id");
        assertEquals(groupId, id);
    }

    @Test
    public void shouldUpdateGroup() throws Exception {
        final String group = createSymbolGroupJson(projectId1, "group", null);
        final Response res1 = symbolGroupApi.create(projectId1, group, jwtUser1);
        final String createdGroup = res1.readEntity(String.class);
        final int createdGroupId = JsonPath.read(createdGroup, "id");

        final String updatedGroup = ((ObjectNode) objectMapper.readTree(createdGroup))
                .put("name", "anotherName")
                .toString();

        final Response res = symbolGroupApi.update(projectId1, createdGroupId, updatedGroup, jwtUser1);
        assertEquals(HttpStatus.OK.value(), res.getStatus());
        JSONAssert.assertEquals(res.readEntity(String.class), updatedGroup, true);
    }

    @Test
    public void shouldNotMoveDefaultGroup() throws Exception {
        final String defaultGroupPre = getDefaultGroupJson(projectId1, jwtUser1);
        final int defaultGroupId = JsonPath.read(defaultGroupPre, "id");

        final String group = createSymbolGroupJson(projectId1, "group", null);
        final Response res1 = symbolGroupApi.create(projectId1, group, jwtUser1);
        final int parentId = JsonPath.read(res1.readEntity(String.class), "id");

        final JsonNode defaultGroupNode = objectMapper.readTree(defaultGroupPre);
        ((ObjectNode) defaultGroupNode).put("parent", parentId);

        final Response res2 = symbolGroupApi.move(projectId1, defaultGroupId, defaultGroupNode.toString(), jwtUser1);
        assertEquals(HttpStatus.BAD_REQUEST.value(), res2.getStatus());

        final String defaultGroupPost = getDefaultGroupJson(projectId1, jwtUser1);
        assertFalse(objectMapper.readTree(defaultGroupPost).has("parent"));
    }

    @Test
    public void shouldDeleteAGroup() throws Exception {
        final String group = createSymbolGroupJson(projectId1, "group", null);
        final Response res1 = symbolGroupApi.create(projectId1, group, jwtUser1);
        final int groupId = JsonPath.read(res1.readEntity(String.class), "id");

        final Response res2 = symbolGroupApi.delete(projectId1, groupId, jwtUser1);
        assertEquals(HttpStatus.NO_CONTENT.value(), res2.getStatus());
        assertEquals(1, getNumberOfGroups(projectId1, jwtUser1));
    }

    @Test
    public void shouldNotDeleteTheDefaultGroup() throws Exception {
        final String group = getDefaultGroupJson(projectId1, jwtUser1);
        final int groupId = JsonPath.read(group, "id");

        final Response res = symbolGroupApi.delete(projectId1, groupId, jwtUser1);
        assertEquals(HttpStatus.BAD_REQUEST.value(), res.getStatus());
        assertEquals(1, getNumberOfGroups(projectId1, jwtUser1));
    }

    @Test
    public void shouldNotDeleteAGroupOfAnotherUser() throws Exception {
        final String group = createSymbolGroupJson(projectId1, "group", null);
        final Response res1 = symbolGroupApi.create(projectId2, group, jwtUser2);
        final int groupId = JsonPath.read(res1.readEntity(String.class), "id");

        final Response res2 = symbolGroupApi.delete(projectId2, groupId, jwtUser1);
        assertEquals(HttpStatus.UNAUTHORIZED.value(), res2.getStatus());
        assertEquals(2, getNumberOfGroups(projectId2, jwtUser2));
        assertEquals(1, getNumberOfGroups(projectId1, jwtUser1));

        final Response res3 = symbolGroupApi.delete(projectId1, groupId, jwtUser1);
        assertEquals(HttpStatus.UNAUTHORIZED.value(), res3.getStatus());
        assertEquals(2, getNumberOfGroups(projectId2, jwtUser2));
        assertEquals(1, getNumberOfGroups(projectId1, jwtUser1));
    }

    @Test
    public void shouldGetAGroupById() {
        final String group = createSymbolGroupJson(projectId1, "group", null);
        final Response res1 = symbolGroupApi.create(projectId1, group, jwtUser1);
        final SymbolGroup g = res1.readEntity(SymbolGroup.class);

        final Response res2 = symbolGroupApi.get(g.getProjectId(), g.getId(), jwtUser1);
        final SymbolGroup g2 = res2.readEntity(SymbolGroup.class);

        assertEquals(g.getId(), g2.getId());
    }

    @Test
    public void shouldCreateMultipleGroupsAtOnce() {
        final SymbolGroup g1 = new SymbolGroup();
        g1.setName("group1");

        final SymbolGroup g2 = new SymbolGroup();
        g2.setName("group2");

        final Response res = symbolGroupApi.create(projectId1, Arrays.asList(g1, g2), jwtUser1);
        final List<SymbolGroup> createdGroups = res.readEntity(new GenericType<List<SymbolGroup>>(){});

        assertEquals(2, createdGroups.size());
        assertEquals("group1", createdGroups.get(0).getName());
        assertEquals("group2", createdGroups.get(1).getName());

        final Response res1 = symbolGroupApi.getAll(projectId1, jwtUser1);
        final List<SymbolGroup> allGroups = res1.readEntity(new GenericType<List<SymbolGroup>>(){});
        assertTrue(allGroups.containsAll(createdGroups));
    }

    private String getDefaultGroupJson(int projectId, String jwt) throws Exception {
        final Response res = symbolGroupApi.getAll(projectId, jwt);
        return objectMapper.readTree(res.readEntity(String.class)).get(0).toString();
    }

    private int getNumberOfGroups(int projectId, String jwt) throws Exception {
        final Response res = symbolGroupApi.getAll(projectId, jwt);
        return objectMapper.readTree(res.readEntity(String.class)).size();
    }

    private String createSymbolGroupJson(int projectId, String name, Integer parentId) {
        return "{"
                + "\"name\":\"" + name + "\""
                + ",\"parent\":" + parentId
                + ",\"project\":" + projectId
                + ",\"symbols\":[]"
                + ",\"groups\":[]"
                + "}";
    }
}
