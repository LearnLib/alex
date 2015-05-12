package de.learnlib.alex.rest;

import de.learnlib.alex.WeblearnerTestApplication;
import de.learnlib.alex.core.dao.CounterDAO;
import de.learnlib.alex.core.dao.LearnerResultDAO;
import de.learnlib.alex.core.dao.ProjectDAO;
import de.learnlib.alex.core.dao.SymbolDAO;
import de.learnlib.alex.core.dao.SymbolGroupDAO;
import de.learnlib.alex.core.entities.Counter;
import de.learnlib.alex.core.entities.Project;
import de.learnlib.alex.core.learner.Learner;
import de.learnlib.alex.exceptions.NotFoundException;
import org.glassfish.jersey.test.JerseyTest;
import org.junit.Before;
import org.junit.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import javax.ws.rs.core.Application;
import javax.ws.rs.core.Response;
import java.util.Arrays;

import static org.junit.Assert.assertEquals;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.verify;

public class CounterResourceTest extends JerseyTest {

    private static final long PROJECT_TEST_ID = 10;
    private static final String  COUNTER_NAME = "Counter";
    private static final Integer COUNTER_VALUE = 42;

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

    private Counter[] counters;

    @Override
    protected Application configure() {
        MockitoAnnotations.initMocks(this);

        return new WeblearnerTestApplication(projectDAO, counterDAO, symbolGroupDAO, symbolDAO,
                                             learnerResultDAO, learner, CounterResource.class);
    }

    @Before
    @Override
    public void setUp() throws Exception {
        super.setUp();

        project = new Project();
        project.setId(PROJECT_TEST_ID);
        given(projectDAO.getByID(project.getId())).willReturn(project);

        counters = new Counter[2];
        counters[0] = new Counter();
        counters[0].setProject(project);
        counters[0].setName(COUNTER_NAME + " 1");
        counters[0].setValue(COUNTER_VALUE);
        counters[1] = new Counter();
        counters[1].setProject(project);
        counters[1].setName(COUNTER_NAME + " 2");
        counters[1].setValue(COUNTER_VALUE);
    }

    @Test
    public void shouldGetAllCounters() throws NotFoundException {
        given(counterDAO.getAll(PROJECT_TEST_ID)).willReturn(Arrays.asList(counters));

        Response response = target("/projects/" + PROJECT_TEST_ID + "/counters").request().get();
        String json = response.readEntity(String.class);

        assertEquals(Response.Status.OK.getStatusCode(), response.getStatus());
        String expectJSON = "[{\"name\":\"" + COUNTER_NAME + " 1\",\"value\":" + COUNTER_VALUE + ","
                                    + "\"project\":" + PROJECT_TEST_ID + "},"
                          +  "{\"name\":\"" + COUNTER_NAME + " 2\",\"value\":" + COUNTER_VALUE + ","
                                    + "\"project\":" + PROJECT_TEST_ID + "}"
                          + "]";
        assertEquals(expectJSON, json);
        assertEquals(String.valueOf(counters.length), response.getHeaderString("X-Total-Count"));
    }

    @Test
    public void shouldReturn404WhenAskingForAllCounterOfANotExistingProject() throws NotFoundException {
        given(counterDAO.getAll(PROJECT_TEST_ID)).willThrow(NotFoundException.class);

        Response response = target("/projects/" + PROJECT_TEST_ID + "/counters").request().get();

        assertEquals(Response.Status.NOT_FOUND.getStatusCode(), response.getStatus());
    }

    @Test
    public void shouldDeleteAValidCounter() throws NotFoundException {
        Response response = target("/projects/" + PROJECT_TEST_ID + "/counters/" + COUNTER_NAME).request().delete();

        assertEquals(Response.Status.NO_CONTENT.getStatusCode(), response.getStatus());
        verify(counterDAO).delete(PROJECT_TEST_ID, COUNTER_NAME);
    }

}