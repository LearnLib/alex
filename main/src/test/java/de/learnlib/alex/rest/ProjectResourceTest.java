package de.learnlib.alex.rest;

import de.learnlib.alex.ALEXTestApplication;
import de.learnlib.alex.core.dao.CounterDAO;
import de.learnlib.alex.core.dao.LearnerResultDAO;
import de.learnlib.alex.core.dao.ProjectDAO;
import de.learnlib.alex.core.dao.SymbolDAO;
import de.learnlib.alex.core.dao.SymbolGroupDAO;
import de.learnlib.alex.core.entities.Project;
import de.learnlib.alex.core.entities.Symbol;
import de.learnlib.alex.core.learner.Learner;
import de.learnlib.alex.exceptions.NotFoundException;
import org.glassfish.jersey.test.JerseyTest;
import org.junit.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import javax.validation.ValidationException;
import javax.ws.rs.client.Entity;
import javax.ws.rs.core.Application;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;
import java.util.ArrayList;
import java.util.List;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.fail;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.willThrow;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;

public class ProjectResourceTest extends JerseyTest {

    private static final Long PROJECT_TEST_ID = 1L;

    @Mock
    private ProjectDAO projectDAO;

    @Mock
    private CounterDAO counterDAO;

    @Mock
    private SymbolGroupDAO symbolGroupDAO;

    @Mock
    private SymbolDAO symbolDAO;

    @Mock
    private LearnerResultDAO learnerResultDAO;

    @Mock
    private Learner learner;

    private Project project;

    @Override
    protected Application configure() {
        MockitoAnnotations.initMocks(this);

        Symbol symbol = new Symbol();
        symbol.setName("Project Resource Test Symbol");
        symbol.setAbbreviation("prts");

        project = new Project();
        project.setId(PROJECT_TEST_ID);
        project.setName("Test Project");
        project.addSymbol(symbol);
        try {
            given(projectDAO.getByID(PROJECT_TEST_ID)).willReturn(project);
        } catch (NotFoundException e) {
            e.printStackTrace();
            fail();
        }

        return new ALEXTestApplication(projectDAO, counterDAO, symbolGroupDAO, symbolDAO,
                                             learnerResultDAO, learner, ProjectResource.class);
    }

    @Test
    public void shouldCreateAProject() {
        String json = "{\"id\": " + project.getId() + ","
                        + "\"name\": \"" + project.getName() + "\","
                        + "\"baseUrl\": \"" + project.getBaseUrl() + "\","
                        + "\"description\": \"" + project.getDescription() + "\"}";
        Response response = target("/projects").request().post(Entity.json(json));

        assertEquals(Status.CREATED.getStatusCode(), response.getStatus());
        assertEquals("http://localhost:9998/projects/1", response.getHeaderString("Location"));
        verify(projectDAO).create(project);
    }

    @Test
    public void shouldReturn400IfProjectCouldNotBeCreated() {
        willThrow(new ValidationException("Test Message")).given(projectDAO).create(project);

        Response response = target("/projects").request().post(Entity.json(project));

        assertEquals(Status.BAD_REQUEST.getStatusCode(), response.getStatus());
    }

    @Test
    public void shouldReturnAllProjectsWithoutEmbedded() {
        List<Project> projects = new ArrayList<>();
        projects.add(project);
        given(projectDAO.getAll()).willReturn(projects);

        Response response = target("/projects").request().get();

        assertEquals(Status.OK.getStatusCode(), response.getStatus());
        assertEquals("1", response.getHeaderString("X-Total-Count"));
        verify(projectDAO).getAll();
    }

    @Test
    public void shouldReturnAllProjectsWithEmbedded() {
        List<Project> projects = new ArrayList<>();
        projects.add(project);
        given(projectDAO.getAll(ProjectDAO.EmbeddableFields.SYMBOLS, ProjectDAO.EmbeddableFields.TEST_RESULTS))
                .willReturn(projects);

        Response response = target("/projects").queryParam("embed", "symbols,test_results").request().get();

        assertEquals(Status.OK.getStatusCode(), response.getStatus());
        assertEquals("1", response.getHeaderString("X-Total-Count"));
        verify(projectDAO).getAll(ProjectDAO.EmbeddableFields.SYMBOLS, ProjectDAO.EmbeddableFields.TEST_RESULTS);
    }

    @Test
    public void shouldGetTheRightProjectWithoutEmbeddedFields() throws NotFoundException {
        Response response = target("/projects/" + PROJECT_TEST_ID).request().get();
        assertEquals(Status.OK.getStatusCode(), response.getStatus());

        verify(projectDAO).getByID(PROJECT_TEST_ID);
    }

    @Test
    public void shouldGetTheRightProjectWithEmbedded() throws NotFoundException {
        given(projectDAO.getByID(PROJECT_TEST_ID,
                                 ProjectDAO.EmbeddableFields.SYMBOLS,
                                 ProjectDAO.EmbeddableFields.TEST_RESULTS))
                .willReturn(project);
        Response response = target("/projects/" + PROJECT_TEST_ID).queryParam("embed", "symbols,test_results")
                                .request().get();
        assertEquals(Status.OK.getStatusCode(), response.getStatus());

        verify(projectDAO).getByID(PROJECT_TEST_ID,
                                   ProjectDAO.EmbeddableFields.SYMBOLS,
                                   ProjectDAO.EmbeddableFields.TEST_RESULTS);
    }

    @Test
    public void shouldReturn404WhenProjectNotFound() throws NotFoundException {
        given(projectDAO.getByID(PROJECT_TEST_ID)).willThrow(NotFoundException.class);

        Response response = target("/projects/" + PROJECT_TEST_ID).request().get();

        assertEquals(Status.NOT_FOUND.getStatusCode(), response.getStatus());
        verify(projectDAO).getByID(PROJECT_TEST_ID);
    }

    @Test
    public void shouldUpdateTheRightProject() throws NotFoundException {
        String json = "{\"id\": " + project.getId() + ","
                        + "\"name\": \"" + project.getName() + "\","
                        + "\"baseUrl\": \"" + project.getBaseUrl() + "\","
                        + "\"description\": \"" + project.getDescription() + "\"}";

        target("/project").request().post(Entity.json(project));
        Response response = target("/projects/" + project.getId()).request().put(Entity.json(json));

        assertEquals(Status.OK.getStatusCode(), response.getStatus());
        verify(projectDAO).update(project);
    }

    /*
    @Test
    public void shouldReturn404OnUpdateWhenProjectNotFound() {
        project.setId(PROJECT_TEST_ID);
        project.setName("Test Project - Update 404");

        willThrow(new IllegalArgumentException()).given(projectDAO).update(project);
        Response response = target("/projects/" + project.getId()).request().put(Entity.json(project));

        assertEquals(Status.NOT_FOUND.getStatusCode(), response.getStatus());
    }
    */

    @Test
    public void shouldFailIfIdInUrlAndObjectAreDifferent() throws NotFoundException {
        project.setName("Test Project - Update Diff");
        target("/project").request().post(Entity.json(project));
        Response response = target("/projects/" + (project.getId() + 1)).request().put(Entity.json(project));

        assertEquals(Status.BAD_REQUEST.getStatusCode(), response.getStatus());
        verify(projectDAO, never()).update(project);
    }

    @Test
    public void shouldReturn400OnUpdateWhenProjectIsInvalid() throws NotFoundException {
        project.setName("Test Project - Invalid Test");

        willThrow(new ValidationException()).given(projectDAO).update(project);
        Response response = target("/projects/" + project.getId()).request().put(Entity.json(project));

        assertEquals(Status.BAD_REQUEST.getStatusCode(), response.getStatus());
    }

    @Test
    public void shouldDeleteTheRightProject() throws NotFoundException {
        target("/project").request().post(Entity.json(project));

        Response response = target("/projects/" + project.getId()).request().delete();
        assertEquals(Status.NO_CONTENT.getStatusCode(), response.getStatus());

        verify(projectDAO).delete(project.getId());
    }

    @Test
    public void shouldReturn404OnDeleteWhenProjectNotFound() throws NotFoundException {
        willThrow(NotFoundException.class).given(projectDAO).delete(PROJECT_TEST_ID);
        Response response = target("/projects/" + PROJECT_TEST_ID).request().delete();

        assertEquals(Status.NOT_FOUND.getStatusCode(), response.getStatus());
    }

}
