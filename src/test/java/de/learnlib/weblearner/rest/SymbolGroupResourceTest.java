package de.learnlib.weblearner.rest;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import de.learnlib.weblearner.WeblearnerTestApplication;
import de.learnlib.weblearner.dao.LearnerResultDAO;
import de.learnlib.weblearner.dao.ProjectDAO;
import de.learnlib.weblearner.dao.SymbolDAO;
import de.learnlib.weblearner.dao.SymbolGroupDAO;
import de.learnlib.weblearner.entities.Project;
import de.learnlib.weblearner.entities.Symbol;
import de.learnlib.weblearner.entities.SymbolGroup;
import de.learnlib.weblearner.learner.Learner;
import org.glassfish.jersey.test.JerseyTest;
import org.junit.Before;
import org.junit.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import javax.ws.rs.client.Entity;
import javax.ws.rs.core.Application;
import javax.ws.rs.core.GenericType;
import javax.ws.rs.core.Response;

import java.util.LinkedList;
import java.util.List;

import static org.junit.Assert.assertEquals;
import static org.mockito.BDDMockito.given;
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
        ObjectMapper mapper = new ObjectMapper();
        String json = mapper.writeValueAsString(group1);

        Response response = target("/projects/" + PROJECT_TEST_ID + "/groups").request().post(Entity.json(json));

        assertEquals(Response.Status.CREATED.getStatusCode(), response.getStatus());
//        assertEquals("http://localhost:9998/projects/10/groups/1", response.getHeaderString("Location"));
        verify(symbolGroupDAO).create(any(SymbolGroup.class));
    }

    @Test
    public void shouldGetAllGroupsOfAProject() {
        List<SymbolGroup> groups = new LinkedList<>();
        groups.add(group1);
        groups.add(group2);
        given(symbolGroupDAO.getAll(PROJECT_TEST_ID)).willReturn(groups);

        Response response = target("/projects/" + PROJECT_TEST_ID + "/groups").request().get();

        assertEquals(Response.Status.OK.getStatusCode(), response.getStatus());
        List<SymbolGroup> groupsInResponse = response.readEntity(new GenericType<List<SymbolGroup>>() { });
        assertEquals(2, groupsInResponse.size());
        verify(symbolGroupDAO).getAll(PROJECT_TEST_ID);
    }

    @Test
    public void shouldGetTheRightGroup() {
        given(symbolGroupDAO.get(PROJECT_TEST_ID, 1L)).willReturn(group1);

        Response response = target("/projects/" + PROJECT_TEST_ID + "/groups/1").request().get();

        assertEquals(Response.Status.OK.getStatusCode(), response.getStatus());
        SymbolGroup groupInResponse = response.readEntity(SymbolGroup.class);
        assertEquals(group1, groupInResponse);
        verify(symbolGroupDAO).get(PROJECT_TEST_ID, 1L);
    }

}
