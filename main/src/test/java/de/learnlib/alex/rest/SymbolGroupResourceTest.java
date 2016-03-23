/*
 * Copyright 2016 TU Dortmund
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

package de.learnlib.alex.rest;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ser.FilterProvider;
import com.fasterxml.jackson.databind.ser.impl.SimpleBeanPropertyFilter;
import com.fasterxml.jackson.databind.ser.impl.SimpleFilterProvider;
import de.learnlib.alex.ALEXTestApplication;
import de.learnlib.alex.core.dao.ProjectDAO;
import de.learnlib.alex.core.dao.SymbolDAO;
import de.learnlib.alex.core.dao.SymbolGroupDAO;
import de.learnlib.alex.core.entities.Project;
import de.learnlib.alex.core.entities.PropertyFilterMixIn;
import de.learnlib.alex.core.entities.SymbolGroup;
import de.learnlib.alex.core.entities.User;
import de.learnlib.alex.exceptions.NotFoundException;
import org.glassfish.hk2.utilities.binding.AbstractBinder;
import org.glassfish.jersey.test.JerseyTest;
import org.junit.Before;
import org.junit.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import javax.validation.ValidationException;
import javax.ws.rs.client.Entity;
import javax.ws.rs.core.Application;
import javax.ws.rs.core.Response;
import java.io.IOException;
import java.util.LinkedList;
import java.util.List;

import static org.junit.Assert.assertEquals;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.willThrow;
import static org.mockito.Matchers.any;
import static org.mockito.Mockito.verify;

public class SymbolGroupResourceTest extends JerseyTest {

    private static final long USER_TEST_ID = 1L;
    private static final long PROJECT_TEST_ID = 10;

    @Mock
    private ProjectDAO projectDAO;

    @Mock
    private SymbolGroupDAO symbolGroupDAO;

    @Mock
    private SymbolDAO symbolDAO;

    private User admin;
    private String adminToken;

    private Project project;
    private SymbolGroup group1;
    private SymbolGroup group2;

    public static SymbolGroup readGroup(String json) throws IOException {
        json = json.replaceFirst(",\"symbolAmount\":[ ]?[0-9]+", "");
        ObjectMapper mapper = new ObjectMapper();
        return mapper.readValue(json, SymbolGroup.class);
    }

    public static String writeGroup(SymbolGroup group) throws JsonProcessingException {
        SimpleBeanPropertyFilter filter = SimpleBeanPropertyFilter.serializeAllExcept("symbolAmount");
        FilterProvider filters = new SimpleFilterProvider().addFilter("filter properties by name", filter);
        ObjectMapper mapper = new ObjectMapper();
        mapper.addMixInAnnotations(Object.class, PropertyFilterMixIn.class);
        return mapper.writer(filters).writeValueAsString(group);
    }

    @Override
    protected Application configure() {
        MockitoAnnotations.initMocks(this);

        ALEXTestApplication testApplication = new ALEXTestApplication(SymbolGroupResource.class);
        admin = testApplication.getAdmin();
        adminToken = testApplication.getAdminToken();
        testApplication.register(new AbstractBinder() {
            @Override
            protected void configure() {
                bind(projectDAO).to(ProjectDAO.class);
                bind(symbolDAO).to(SymbolDAO.class);
                bind(symbolGroupDAO).to(SymbolGroupDAO.class);
            }
        });
        return testApplication;
    }


    @Before
    @Override
    public void setUp() throws Exception {
        super.setUp();

        project = new Project();
        project.setId(PROJECT_TEST_ID);
        project.setUser(admin);
        given(projectDAO.getByID(admin.getId(), project.getId())).willReturn(project);

        group1 = new SymbolGroup();
        group1.setName("SymbolGroupResource - Test Group 1");
        group1.setUser(admin);
        group1.setProject(project);

        group2 = new SymbolGroup();
        group2.setName("SymbolGroupResource - Test Group 2");
        group2.setUser(admin);
        group2.setProject(project);
    }

    @Test
    public void shouldCreateValidGroup() throws JsonProcessingException {
        group1.setProject(null);
        group1.setUser(null);
        String json = writeGroup(group1);

        Response response = target("/projects/" + PROJECT_TEST_ID + "/groups").request()
                                .header("Authorization", adminToken).post(Entity.json(json));

        assertEquals(Response.Status.CREATED.getStatusCode(), response.getStatus());
//        assertEquals("http://localhost:9998/projects/10/groups/1", response.getHeaderString("Location"));
        verify(symbolGroupDAO).create(any(SymbolGroup.class));
    }

    @Test
    public void shouldReturn400IfProjectCouldNotBeCreated() {
        willThrow(ValidationException.class).given(symbolGroupDAO).create(group1);

        Response response = target("/projects/" + PROJECT_TEST_ID + "/groups").request()
                                .header("Authorization", adminToken).post(Entity.json(group1));

        assertEquals(Response.Status.BAD_REQUEST.getStatusCode(), response.getStatus());
    }

    @Test
    public void shouldGetAllGroupsOfAProject() throws NotFoundException {
        List<SymbolGroup> groups = new LinkedList<>();
        groups.add(group1);
        groups.add(group2);
        given(symbolGroupDAO.getAll(admin.getId(), PROJECT_TEST_ID)).willReturn(groups);

        Response response = target("/projects/" + PROJECT_TEST_ID + "/groups")
                            .request().header("Authorization", adminToken).get();

        assertEquals(Response.Status.OK.getStatusCode(), response.getStatus());
        System.out.println(response.readEntity(String.class));
//        List<Object> groupsInResponse = response.readEntity(new GenericType<List<Object>>() { });
//        assertEquals(2, groupsInResponse.size());
//        verify(symbolGroupDAO).getAll(PROJECT_TEST_ID);
    }

    @Test
    public void shouldGetAllSymbolsOfAGroup() throws NotFoundException {
        String path = "/projects/" + PROJECT_TEST_ID + "/groups/" + group1.getId() + "/symbols";
        Response response = target(path).request().header("Authorization", adminToken).get();
        assertEquals(Response.Status.OK.getStatusCode(), response.getStatus());

        verify(symbolDAO).getAllWithLatestRevision(admin, PROJECT_TEST_ID, group1.getId());
    }

    @Test
    public void shouldReturn404IfYouWantToGetAllGroupsOfANonExistingProject() throws NotFoundException {
        willThrow(NotFoundException.class).given(symbolGroupDAO).getAll(USER_TEST_ID, PROJECT_TEST_ID);

        Response response = target("/projects/" + PROJECT_TEST_ID + "/groups").request()
                                .header("Authorization", adminToken).get();

        assertEquals(Response.Status.NOT_FOUND.getStatusCode(), response.getStatus());
    }

    @Test
    public void shouldGetTheRightGroup() throws IOException, NotFoundException {
        given(symbolGroupDAO.get(admin, PROJECT_TEST_ID, 1L)).willReturn(group1);

        Response response = target("/projects/" + PROJECT_TEST_ID + "/groups/1").request()
                                .header("Authorization", adminToken).get();

        assertEquals(Response.Status.OK.getStatusCode(), response.getStatus());
        String responseBody = response.readEntity(String.class);
        SymbolGroup groupInResponse = readGroup(responseBody);
        assertEquals(group1, groupInResponse);
        verify(symbolGroupDAO).get(admin, PROJECT_TEST_ID, 1L);
    }

    @Test
    public void shouldReturn404IfYouWantToGetANonExistingGroup() throws NotFoundException {
        willThrow(NotFoundException.class).given(symbolGroupDAO).get(admin, PROJECT_TEST_ID, 1L);

        Response response = target("/projects/" + PROJECT_TEST_ID + "/groups/1").request()
                                .header("Authorization", adminToken).get();

        assertEquals(Response.Status.NOT_FOUND.getStatusCode(), response.getStatus());
    }

    @Test
    public void shouldUpdateAGroup() throws JsonProcessingException, NotFoundException {
        String json = writeGroup(group1);

        String path = "/projects/" + PROJECT_TEST_ID + "/groups/" + group1.getId();
        Response response = target(path).request().header("Authorization", adminToken).put(Entity.json(json));

        assertEquals(Response.Status.OK.getStatusCode(), response.getStatus());
        verify(symbolGroupDAO).update(group1);
    }

    @Test
    public void shouldReturn400IfUpdatingAGroupWasNotPossible() throws NotFoundException {
        willThrow(ValidationException.class).given(symbolGroupDAO).update(group1);

        String path = "/projects/" + PROJECT_TEST_ID + "/groups/" + group1.getId();
        Response response = target(path).request().header("Authorization", adminToken).put(Entity.json(group1));

        assertEquals(Response.Status.BAD_REQUEST.getStatusCode(), response.getStatus());
    }

    @Test
    public void shouldReturn404IfGroupToUpdateWasNotFound() throws JsonProcessingException, NotFoundException {
        willThrow(NotFoundException.class).given(symbolGroupDAO).update(group1);
        String json = writeGroup(group1);

        String path = "/projects/" + PROJECT_TEST_ID + "/groups/" + group1.getId();
        Response response = target(path).request().header("Authorization", adminToken).put(Entity.json(json));

        assertEquals(Response.Status.NOT_FOUND.getStatusCode(), response.getStatus());
    }

    @Test
    public void shouldDeleteAGroup() throws NotFoundException {
        given(symbolGroupDAO.get(admin, PROJECT_TEST_ID, group1.getId())).willReturn(group1);

        String path = "/projects/" + PROJECT_TEST_ID + "/groups/" + group1.getId();
        Response response = target(path).request().header("Authorization", adminToken).delete();

        assertEquals(Response.Status.NO_CONTENT.getStatusCode(), response.getStatus());
        verify(symbolGroupDAO).delete(admin, PROJECT_TEST_ID, group1.getId());
    }

    @Test
    public void shouldReturn400IfYouWantToDeleteADefaultGroup() throws NotFoundException {
        given(symbolGroupDAO.get(admin, PROJECT_TEST_ID, group1.getId())).willReturn(group1);
        willThrow(IllegalArgumentException.class).given(symbolGroupDAO).delete(admin, PROJECT_TEST_ID, group1.getId());

        String path = "/projects/" + PROJECT_TEST_ID + "/groups/" + group1.getId();
        Response response = target(path).request().header("Authorization", adminToken).delete();

        assertEquals(Response.Status.BAD_REQUEST.getStatusCode(), response.getStatus());
    }

}
