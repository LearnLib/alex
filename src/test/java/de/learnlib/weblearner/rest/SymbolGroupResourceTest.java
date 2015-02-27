package de.learnlib.weblearner.rest;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import de.learnlib.weblearner.WeblearnerTestApplication;
import de.learnlib.weblearner.dao.LearnerResultDAO;
import de.learnlib.weblearner.dao.ProjectDAO;
import de.learnlib.weblearner.dao.SymbolDAO;
import de.learnlib.weblearner.dao.SymbolGroupDAO;
import de.learnlib.weblearner.entities.Project;
import de.learnlib.weblearner.entities.SymbolGroup;
import de.learnlib.weblearner.learner.Learner;
import org.glassfish.jersey.test.JerseyTest;
import org.junit.Before;
import org.junit.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import javax.ws.rs.client.Entity;
import javax.ws.rs.core.Application;
import javax.ws.rs.core.Response;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;
import static org.mockito.BDDMockito.given;
import static org.mockito.Matchers.any;
import static org.mockito.Matchers.eq;
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
    private SymbolGroup group;

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

        group = new SymbolGroup();
        group.setName("SymbolGroupResource - Test Group");
        group.setProject(project);
    }

    @Test
    public void shouldCreateValidGroup() throws JsonProcessingException {
        group.setProject(null);
        ObjectMapper mapper = new ObjectMapper();
        String json = mapper.writeValueAsString(group);

        Response response = target("/projects/" + PROJECT_TEST_ID + "/groups").request().post(Entity.json(json));

        assertEquals(Response.Status.CREATED.getStatusCode(), response.getStatus());
//        assertEquals("http://localhost:9998/projects/10/symbols/1", response.getHeaderString("Location"));
        verify(symbolGroupDAO).create(any(SymbolGroup.class));
    }

}
