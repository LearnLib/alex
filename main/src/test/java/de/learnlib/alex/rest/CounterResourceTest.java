package de.learnlib.alex.rest;

import de.learnlib.alex.ALEXTestApplication;
import de.learnlib.alex.FakeAuthenticationFilter;
import de.learnlib.alex.core.dao.CounterDAO;
import de.learnlib.alex.core.dao.FileDAO;
import de.learnlib.alex.core.dao.LearnerResultDAO;
import de.learnlib.alex.core.dao.ProjectDAO;
import de.learnlib.alex.core.dao.SymbolDAO;
import de.learnlib.alex.core.dao.SymbolGroupDAO;
import de.learnlib.alex.core.dao.UserDAO;
import de.learnlib.alex.core.entities.Counter;
import de.learnlib.alex.core.entities.Project;
import de.learnlib.alex.core.entities.User;
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
import static org.mockito.BDDMockito.willThrow;
import static org.mockito.Mockito.verify;

public class CounterResourceTest extends JerseyTest {

    private static final Long USER_TEST_ID = FakeAuthenticationFilter.FAKE_USER_ID;
    private static final long PROJECT_TEST_ID = 10;
    private static final String  COUNTER_NAME = "Counter";
    private static final Integer COUNTER_VALUE = 42;

    @Mock
    private UserDAO userDAO;

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
    private FileDAO fileDAO;

    @Mock
    private Learner learner;

    @Mock
    private User user;

    @Mock
    private Project project;

    private Counter[] counters;

    @Override
    protected Application configure() {
        MockitoAnnotations.initMocks(this);

        return new ALEXTestApplication(userDAO, projectDAO, counterDAO, symbolGroupDAO, symbolDAO,
                                       learnerResultDAO, fileDAO, learner, CounterResource.class);
    }

    @Before
    @Override
    public void setUp() throws Exception {
        super.setUp();

        given(user.getId()).willReturn(USER_TEST_ID);
        given(project.getId()).willReturn(PROJECT_TEST_ID);

        counters = new Counter[2];
        counters[0] = new Counter();
        counters[0].setUser(user);
        counters[0].setProject(project);
        counters[0].setName(COUNTER_NAME + " 1");
        counters[0].setValue(COUNTER_VALUE);
        counters[1] = new Counter();
        counters[1].setProject(project);
        counters[1].setUser(user);
        counters[1].setName(COUNTER_NAME + " 2");
        counters[1].setValue(COUNTER_VALUE);
    }

    @Test
    public void shouldGetAllCounters() throws NotFoundException {
        given(counterDAO.getAll(USER_TEST_ID, PROJECT_TEST_ID)).willReturn(Arrays.asList(counters));

        Response response = target("/projects/" + PROJECT_TEST_ID + "/counters").request().get();
        String json = response.readEntity(String.class);

        assertEquals(Response.Status.OK.getStatusCode(), response.getStatus());
        String expectJSON = "[{\"name\":\"" + COUNTER_NAME + " 1\",\"project\":" + PROJECT_TEST_ID + ","
                                    + "\"user\":" + USER_TEST_ID + ",\"value\":" + COUNTER_VALUE + "},"
                          +  "{\"name\":\"" + COUNTER_NAME + " 2\",\"project\":" + PROJECT_TEST_ID + ","
                                    + "\"user\":" + USER_TEST_ID + ",\"value\":" + COUNTER_VALUE + "}"
                          + "]";
        assertEquals(expectJSON, json);
        assertEquals(String.valueOf(counters.length), response.getHeaderString("X-Total-Count"));
    }

    @Test
    public void shouldReturn404WhenAskingForAllCounterOfANotExistingProject() throws NotFoundException {
        given(counterDAO.getAll(USER_TEST_ID, PROJECT_TEST_ID)).willThrow(NotFoundException.class);

        Response response = target("/projects/" + PROJECT_TEST_ID + "/counters").request().get();

        assertEquals(Response.Status.NOT_FOUND.getStatusCode(), response.getStatus());
    }

    @Test
    public void shouldDeleteAValidCounter() throws NotFoundException {
        Response response = target("/projects/" + PROJECT_TEST_ID + "/counters/" + COUNTER_NAME).request().delete();

        assertEquals(Response.Status.NO_CONTENT.getStatusCode(), response.getStatus());
        verify(counterDAO).delete(USER_TEST_ID, PROJECT_TEST_ID, COUNTER_NAME);
    }

    @Test
    public void shouldReturn404WhenDeleteAnInvalidCounter() throws NotFoundException {
        willThrow(NotFoundException.class).given(counterDAO).delete(USER_TEST_ID, PROJECT_TEST_ID, COUNTER_NAME);

        Response response = target("/projects/" + PROJECT_TEST_ID + "/counters/" + COUNTER_NAME).request().delete();

        assertEquals(Response.Status.NOT_FOUND.getStatusCode(), response.getStatus());
        verify(counterDAO).delete(USER_TEST_ID, PROJECT_TEST_ID, COUNTER_NAME);
    }

    @Test
    public void shouldDeleteValidCounters() throws NotFoundException {
        String path = "/projects/" + PROJECT_TEST_ID + "/counters/batch/" + COUNTER_NAME + "," + COUNTER_NAME + "2";
        Response response = target(path).request().delete();

        assertEquals(Response.Status.NO_CONTENT.getStatusCode(), response.getStatus());
        verify(counterDAO).delete(USER_TEST_ID, PROJECT_TEST_ID, COUNTER_NAME, COUNTER_NAME + "2");
    }

    @Test
    public void shouldReturn404WhenDeleteInvalidCounters() throws NotFoundException {
        String path = "/projects/" + PROJECT_TEST_ID + "/counters/batch/" + COUNTER_NAME + "," + COUNTER_NAME + "2";
        willThrow(NotFoundException.class).given(counterDAO).delete(USER_TEST_ID, PROJECT_TEST_ID, COUNTER_NAME, COUNTER_NAME + "2");

        Response response = target(path).request().delete();

        assertEquals(Response.Status.NOT_FOUND.getStatusCode(), response.getStatus());
        verify(counterDAO).delete(USER_TEST_ID, PROJECT_TEST_ID, COUNTER_NAME, COUNTER_NAME + "2");
    }

}
