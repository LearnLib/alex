package de.learnlib.weblearner.rest;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ser.FilterProvider;
import com.fasterxml.jackson.databind.ser.impl.SimpleBeanPropertyFilter;
import com.fasterxml.jackson.databind.ser.impl.SimpleFilterProvider;
import de.learnlib.weblearner.WeblearnerTestApplication;
import de.learnlib.weblearner.dao.LearnerResultDAO;
import de.learnlib.weblearner.dao.ProjectDAO;
import de.learnlib.weblearner.dao.SymbolDAO;
import de.learnlib.weblearner.dao.SymbolGroupDAO;
import de.learnlib.weblearner.entities.Project;
import de.learnlib.weblearner.entities.PropertyFilterMixIn;
import de.learnlib.weblearner.entities.SymbolGroup;
import de.learnlib.weblearner.learner.Learner;
import org.glassfish.jersey.test.JerseyTest;
import org.junit.Before;
import org.junit.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import javax.validation.ValidationException;
import javax.ws.rs.client.Entity;
import javax.ws.rs.core.Application;
import javax.ws.rs.core.GenericType;
import javax.ws.rs.core.Response;
import java.io.IOException;
import java.util.LinkedList;
import java.util.List;
import java.util.NoSuchElementException;

import static org.junit.Assert.assertEquals;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.willThrow;
import static org.mockito.Matchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;

public class SymbolGroupResourceTest extends JerseyTest {

    private static final long PROJECT_TEST_ID = 10;

    @Mock
    private ProjectDAO projectDAO;

    @Mock
    private SymbolGroupDAO symbolGroupDAO;

    @Mock
    private SymbolDAO symbolDAO;

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

        LearnerResultDAO learnerResultDAO = mock(LearnerResultDAO.class);
        Learner learner = mock(Learner.class);

        return new WeblearnerTestApplication(projectDAO, symbolGroupDAO, symbolDAO,
                                             learnerResultDAO, learner, SymbolGroupResource.class);
    }

    @Before
    @Override
    public void setUp() throws Exception {
        super.setUp();

        project = new Project();
        project.setId(PROJECT_TEST_ID);
        given(projectDAO.getByID(project.getId())).willReturn(project);

        group1 = new SymbolGroup();
        group1.setName("SymbolGroupResource - Test Group 1");
        group1.setProject(project);

        group2 = new SymbolGroup();
        group2.setName("SymbolGroupResource - Test Group 2");
        group2.setProject(project);
    }

    @Test
    public void shouldCreateValidGroup() throws JsonProcessingException {
        group1.setProject(null);
        String json = writeGroup(group1);

        Response response = target("/projects/" + PROJECT_TEST_ID + "/groups").request().post(Entity.json(json));

        assertEquals(Response.Status.CREATED.getStatusCode(), response.getStatus());
//        assertEquals("http://localhost:9998/projects/10/groups/1", response.getHeaderString("Location"));
        verify(symbolGroupDAO).create(any(SymbolGroup.class));
    }

    @Test
    public void shouldReturn400IfProjectCouldNotBeCreated() {
        willThrow(ValidationException.class).given(symbolGroupDAO).create(group1);

        Response response = target("/projects/" + PROJECT_TEST_ID + "/groups").request().post(Entity.json(group1));

        assertEquals(Response.Status.BAD_REQUEST.getStatusCode(), response.getStatus());
    }

    @Test
    public void shouldGetAllGroupsOfAProject() {
        List<SymbolGroup> groups = new LinkedList<>();
        groups.add(group1);
        groups.add(group2);
        given(symbolGroupDAO.getAll(PROJECT_TEST_ID)).willReturn(groups);

        Response response = target("/projects/" + PROJECT_TEST_ID + "/groups").request().get();

        assertEquals(Response.Status.OK.getStatusCode(), response.getStatus());
        List<Object> groupsInResponse = response.readEntity(new GenericType<List<Object>>() { });
        assertEquals(2, groupsInResponse.size());
        verify(symbolGroupDAO).getAll(PROJECT_TEST_ID);
    }

    @Test
    public void shouldReturn404IfYouWantToGetAllGroupsOfANonExistingProject() {
        willThrow(NoSuchElementException.class).given(symbolGroupDAO).getAll(PROJECT_TEST_ID);

        Response response = target("/projects/" + PROJECT_TEST_ID + "/groups").request().get();

        assertEquals(Response.Status.NOT_FOUND.getStatusCode(), response.getStatus());
    }

    @Test
    public void shouldGetTheRightGroup() throws IOException {
        given(symbolGroupDAO.get(PROJECT_TEST_ID, 1L)).willReturn(group1);

        Response response = target("/projects/" + PROJECT_TEST_ID + "/groups/1").request().get();

        assertEquals(Response.Status.OK.getStatusCode(), response.getStatus());
        String responseBody = response.readEntity(String.class);
        SymbolGroup groupInResponse = readGroup(responseBody);
        assertEquals(group1, groupInResponse);
        verify(symbolGroupDAO).get(PROJECT_TEST_ID, 1L);
    }

    @Test
    public void shouldReturn404IfYouWantToGetANonExistingGroup() {
        willThrow(NoSuchElementException.class).given(symbolGroupDAO).get(PROJECT_TEST_ID, 1L);

        Response response = target("/projects/" + PROJECT_TEST_ID + "/groups/1").request().get();

        assertEquals(Response.Status.NOT_FOUND.getStatusCode(), response.getStatus());
    }

    @Test
    public void shouldUpdateAGroup() throws JsonProcessingException {
        String json = writeGroup(group1);

        String path = "/projects/" + PROJECT_TEST_ID + "/groups/" + group1.getId();
        Response response = target(path).request().put(Entity.json(json));

        assertEquals(Response.Status.OK.getStatusCode(), response.getStatus());
        verify(symbolGroupDAO).update(group1);
    }

    @Test
    public void shouldReturn400IfUpdatingAGroupWasNotPossible() {
        willThrow(ValidationException.class).given(symbolGroupDAO).update(group1);

        String path = "/projects/" + PROJECT_TEST_ID + "/groups/" + group1.getId();
        Response response = target(path).request().put(Entity.json(group1));

        assertEquals(Response.Status.BAD_REQUEST.getStatusCode(), response.getStatus());
    }

    @Test
    public void shouldReturn404IfGroupToUpdateWasNotFound() throws JsonProcessingException {
        willThrow(NoSuchElementException.class).given(symbolGroupDAO).update(group1);
        String json = writeGroup(group1);

        String path = "/projects/" + PROJECT_TEST_ID + "/groups/" + group1.getId();
        Response response = target(path).request().put(Entity.json(json));

        assertEquals(Response.Status.NOT_FOUND.getStatusCode(), response.getStatus());
    }

    @Test
    public void shouldDeleteAGroup() {
        String path = "/projects/" + PROJECT_TEST_ID + "/groups/" + group1.getId();
        Response response = target(path).request().delete();

        assertEquals(Response.Status.NO_CONTENT.getStatusCode(), response.getStatus());
        verify(symbolGroupDAO).delete(PROJECT_TEST_ID, group1.getId());
    }

    @Test
    public void shouldReturn400IfYouWantToDeleteADefaultGroup() {
        willThrow(IllegalArgumentException.class).given(symbolGroupDAO).delete(PROJECT_TEST_ID, group1.getId());

        String path = "/projects/" + PROJECT_TEST_ID + "/groups/" + group1.getId();
        Response response = target(path).request().delete();

        assertEquals(Response.Status.BAD_REQUEST.getStatusCode(), response.getStatus());
    }

}
