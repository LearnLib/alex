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
import de.learnlib.alex.core.entities.IdRevisionPair;
import de.learnlib.alex.core.entities.LearnerConfiguration;
import de.learnlib.alex.core.entities.LearnerResult;
import de.learnlib.alex.core.entities.LearnerStatus;
import de.learnlib.alex.core.entities.Project;
import de.learnlib.alex.core.entities.Symbol;
import de.learnlib.alex.core.entities.User;
import de.learnlib.alex.core.learner.Learner;
import de.learnlib.alex.exceptions.LearnerException;
import de.learnlib.alex.exceptions.NotFoundException;
import org.glassfish.jersey.test.JerseyTest;
import org.junit.Before;
import org.junit.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import javax.ws.rs.client.Entity;
import javax.ws.rs.core.Application;
import javax.ws.rs.core.Response;
import java.util.Date;
import java.util.List;

import static org.junit.Assert.assertEquals;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.willThrow;
import static org.mockito.Matchers.any;
import static org.mockito.Matchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;

public class LearnerResourceTest extends JerseyTest {

    private static final long USER_TEST_ID = FakeAuthenticationFilter.FAKE_USER_ID;
    private static final long PROJECT_TEST_ID = 1;
    private static final long TEST_NO = 2;
    private static final long RESET_SYMBOL_TEST_ID = 3;
    private static final String START_JSON = "{\"symbols\": ["
                                               + "{\"id\": 1, \"revision\": 1},"
                                               + "{\"id\": 2, \"revision\": 4}"
                                           + "],\"resetSymbol\":{\"id\": " + RESET_SYMBOL_TEST_ID + ", \"revision\": 1}"
                                           + ",\"algorithm\":\"DHC\", \"eqOracle\": {\"type\": \"complete\"}}";
    private static final String RESUME_JSON = "{\"eqOracle\": {\"type\": \"complete\"}}";

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

    private User user = FakeAuthenticationFilter.FAKE_USER;

    @Mock
    private Project project;

    @Mock
    private Learner learner;

    @Override
    protected Application configure() {
        MockitoAnnotations.initMocks(this);

        return new ALEXTestApplication(userDAO, projectDAO, counterDAO, symbolGroupDAO, symbolDAO,
                                             learnerResultDAO, fileDAO, learner, LearnerResource.class);
    }

    @Before
    @Override
    public void setUp() throws Exception {
        super.setUp();
        given(projectDAO.getByID(USER_TEST_ID, PROJECT_TEST_ID, ProjectDAO.EmbeddableFields.ALL)).willReturn(project);
        Symbol resetSymbol = mock(Symbol.class);
        given(symbolDAO.get(user, PROJECT_TEST_ID, new IdRevisionPair(RESET_SYMBOL_TEST_ID, 1L))).willReturn(resetSymbol);

        LearnerResult result = mock(LearnerResult.class);
        given(result.getUserId()).willReturn(USER_TEST_ID);
        given(result.getProjectId()).willReturn(PROJECT_TEST_ID);
        given(result.getTestNo()).willReturn(TEST_NO);
        given(learner.getStartDate(user)).willReturn(new Date(0));
        given(learner.isActive(user)).willReturn(true);
        given(learner.getResult(user)).willReturn(result);

        LearnerStatus learnerStatus = new LearnerStatus(user, learner);
        given(learner.getStatus(user)).willReturn(learnerStatus);
    }

    @Test
    public void shouldStartALearningProcess() throws NotFoundException {
        Response response = target("/learner/start/" + PROJECT_TEST_ID).request().post(Entity.json(START_JSON));

        assertEquals(Response.Status.OK.getStatusCode(), response.getStatus());
        String expectedJSON = "{"
                                + "\"active\":true,\"project\":" + PROJECT_TEST_ID + ",\"statistics\":"
                                  + "{\"mqsUsed\":0,\"startDate\":\"1970-01-01T00:00:00.000+00:00\"},"
                                + "\"testNo\":" + TEST_NO
                              + "}";
        assertEquals(expectedJSON, response.readEntity(String.class));
        verify(learner).start(eq(user), eq(project), any(LearnerConfiguration.class));
    }

    @Test
    public void shouldNotStartALearningProcessIfTheProjectDoesNotExist() throws NotFoundException {
        given(projectDAO.getByID(USER_TEST_ID, PROJECT_TEST_ID, ProjectDAO.EmbeddableFields.ALL))
                .willThrow(NotFoundException.class);

        Response response = target("/learner/start/" + PROJECT_TEST_ID).request().post(Entity.json(START_JSON));

        assertEquals(Response.Status.NOT_FOUND.getStatusCode(), response.getStatus());
        verify(learner, never()).start(any(User.class), any(Project.class), any(LearnerConfiguration.class));
    }

    @Test
    public void shouldNotStartALearningProcessIfTheResetSymbolDoesNotExist() throws NotFoundException {
        given(symbolDAO.get(FakeAuthenticationFilter.FAKE_USER,
                            PROJECT_TEST_ID,
                            new IdRevisionPair(RESET_SYMBOL_TEST_ID, 1L)))
                .willThrow(NotFoundException.class);

        Response response = target("/learner/start/" + PROJECT_TEST_ID).request().post(Entity.json(START_JSON));

        assertEquals(Response.Status.NOT_FOUND.getStatusCode(), response.getStatus());
        verify(learner, never()).start(any(User.class), any(Project.class), any(LearnerConfiguration.class));
    }

    @Test
    public void shouldNotStartALearningProcessIfASymbolDoesNotExist() throws NotFoundException {
        given(symbolDAO.getAll(eq(FakeAuthenticationFilter.FAKE_USER), eq(PROJECT_TEST_ID), any(List.class)))
                .willThrow(NotFoundException.class);

        Response response = target("/learner/start/" + PROJECT_TEST_ID).request().post(Entity.json(START_JSON));

        assertEquals(Response.Status.NOT_FOUND.getStatusCode(), response.getStatus());
        verify(learner, never()).start(any(User.class), any(Project.class), any(LearnerConfiguration.class));
    }

    @Test
    public void shouldNotStartALearningProcessIfTheConfigurationIsInvalid() throws NotFoundException {
        willThrow(IllegalArgumentException.class).given(learner).start(any(User.class),
                                                                       any(Project.class),
                                                                       any(LearnerConfiguration.class));

        Response response = target("/learner/start/" + PROJECT_TEST_ID).request().post(Entity.json(START_JSON));

        verify(learner).start(any(User.class), any(Project.class), any(LearnerConfiguration.class));
        assertEquals(Response.Status.BAD_REQUEST.getStatusCode(), response.getStatus());
    }

    @Test
    public void shouldNotStartALearningProcessTwice() {
        willThrow(IllegalStateException.class).given(learner).start(any(User.class),
                                                                    any(Project.class),
                                                                    any(LearnerConfiguration.class));

        Response response = target("/learner/start/" + PROJECT_TEST_ID).request().post(Entity.json(START_JSON));

        assertEquals(Response.Status.NOT_MODIFIED.getStatusCode(), response.getStatus());
    }

    @Test
    public void shouldResumeIfPossible() {
        target("/learner/start/" + PROJECT_TEST_ID).request().post(Entity.json(START_JSON));

        Response response = target("/learner/resume/" + PROJECT_TEST_ID + "/"  + TEST_NO).request()
                                .post(Entity.json(RESUME_JSON));

        assertEquals(Response.Status.OK.getStatusCode(), response.getStatus());
        String expectedJSON = "{\"active\":true,\"project\":" + PROJECT_TEST_ID + ",\"statistics\":{\"mqsUsed\":0,\"startDate\":\"1970-01-01T00:00:00.000+00:00\"},\"testNo\":" + TEST_NO + "}";
        assertEquals(expectedJSON, response.readEntity(String.class));
        verify(learner).resume(any(User.class), any(LearnerConfiguration.class));
    }

    @Test
    public void shouldStopIfTheLearningIsActive() {
        Response response = target("/learner/stop").request().post(Entity.json(""));

        assertEquals(Response.Status.OK.getStatusCode(), response.getStatus());
        String expectedJSON = "{\"active\":true,\"project\":" + PROJECT_TEST_ID + ",\"statistics\":{\"mqsUsed\":0,\"startDate\":\"1970-01-01T00:00:00.000+00:00\"},\"testNo\":" + TEST_NO + "}";
        assertEquals(expectedJSON, response.readEntity(String.class));
        verify(learner).stop(user);
    }

    @Test
    public void shouldNotStopIfTheLearningIsNotActive() {
        given(learner.isActive(user)).willReturn(false);
        given(learner.getResult(user)).willReturn(null);
        LearnerStatus learnerStatus = new LearnerStatus(user, learner);
        given(learner.getStatus(user)).willReturn(learnerStatus);

        Response response = target("/learner/stop").request().post(Entity.json(""));

        assertEquals(Response.Status.OK.getStatusCode(), response.getStatus());
        String expectedJSON = "{\"active\":false}";
        assertEquals(expectedJSON, response.readEntity(String.class));
        verify(learner, never()).stop(user);
    }

    @Test
    public void shouldReturnTheRightActiveInformationIfALearningProcessIsActive() {
        Response response = target("/learner/active").request().get();

        assertEquals(Response.Status.OK.getStatusCode(), response.getStatus());
        String expectedJSON = "{\"active\":true,\"project\":" + PROJECT_TEST_ID + ",\"statistics\":{\"mqsUsed\":0,\"startDate\":\"1970-01-01T00:00:00.000+00:00\"},\"testNo\":" + TEST_NO + "}";
        assertEquals(expectedJSON, response.readEntity(String.class));
    }

    @Test
    public void shouldReturnTheRightActiveInformationIfNoLearningProcessIsActive() {
        given(learner.isActive(user)).willReturn(false);
        LearnerStatus learnerStatus = new LearnerStatus(user, learner);
        given(learner.getStatus(user)).willReturn(learnerStatus);

        Response response = target("/learner/active").request().get();

        assertEquals(Response.Status.OK.getStatusCode(), response.getStatus());
        String expectedJSON = "{\"active\":false}";
        assertEquals(expectedJSON, response.readEntity(String.class));
    }

    @Test
    public void shouldReturnAnActiveStatus() {
        LearnerResult realResult = new LearnerResult();
        given(learner.getResult(user)).willReturn(realResult);

        Response response = target("/learner/status").request().get();

        assertEquals(Response.Status.OK.getStatusCode(), response.getStatus());
    }

    @Test
    public void shouldReturn404IfNoStatusIsAvailable() {
        given(learner.getResult(user)).willReturn(null);

        Response response = target("/learner/status").request().get();

        assertEquals(Response.Status.NOT_FOUND.getStatusCode(), response.getStatus());
    }

    @Test
    public void shouldReturn404IfStatusWasDeletedInTheDB() throws NotFoundException {
        given(learnerResultDAO.get(USER_TEST_ID, PROJECT_TEST_ID, TEST_NO)).willThrow(NotFoundException.class);

        Response response = target("/learner/status").request().get();

        assertEquals(Response.Status.NOT_FOUND.getStatusCode(), response.getStatus());
    }

    @Test
    public void shouldReadTheCorrectOutput() {
        String json = "{\"resetSymbol\":"
                        + "{\"id\": " + RESET_SYMBOL_TEST_ID + ", \"revision\": 1},"
                    + "\"symbols\": ["
                        + "{\"id\": 1, \"revision\": 1},"
                        + "{\"id\": 2, \"revision\": 4}"
                    + "]}";
        Response response = target("/learner/outputs/" + PROJECT_TEST_ID).request().post(Entity.json(json));

        assertEquals(Response.Status.OK.getStatusCode(), response.getStatus());
    }

    @Test
    public void shouldCreateEmptyOutputForNoSymbols() throws NotFoundException {
        String json = "{\"resetSymbol\":"
                + "{\"id\": " + RESET_SYMBOL_TEST_ID + ", \"revision\": 1},"
                + "\"symbols\": []}";
        Response response = target("/learner/outputs/" + PROJECT_TEST_ID).request().post(Entity.json(json));

        assertEquals(Response.Status.OK.getStatusCode(), response.getStatus());
        assertEquals("[]", response.readEntity(String.class));
    }

    @Test
    public void shouldReturn400IfCreatingAnOutputFailed() throws NotFoundException {
        given(learner.readOutputs(any(User.class), any(Project.class), any(Symbol.class), any(List.class)))
                .willThrow(LearnerException.class);

        String json = "{\"resetSymbol\":"
                + "{\"id\": " + RESET_SYMBOL_TEST_ID + ", \"revision\": 1},"
                + "\"symbols\": ["
                + "{\"id\": 1, \"revision\": 1},"
                + "{\"id\": 2, \"revision\": 4}"
                + "]}";
        Response response = target("/learner/outputs/" + PROJECT_TEST_ID).request().post(Entity.json(json));

        assertEquals(Response.Status.BAD_REQUEST.getStatusCode(), response.getStatus());
    }

    @Test
    public void shouldReturn404IfOutputShouldBeCreatedForANotExistingProject() throws NotFoundException {
        given(projectDAO.getByID(USER_TEST_ID, PROJECT_TEST_ID)).willThrow(NotFoundException.class);

        String json = "{\"resetSymbol\":"
                + "{\"id\": " + RESET_SYMBOL_TEST_ID + ", \"revision\": 1},"
                + "\"symbols\": ["
                + "{\"id\": 1, \"revision\": 1},"
                + "{\"id\": 2, \"revision\": 4}"
                + "]}";
        Response response = target("/learner/outputs/" + PROJECT_TEST_ID).request().post(Entity.json(json));

        assertEquals(Response.Status.NOT_FOUND.getStatusCode(), response.getStatus());
        verify(learner, never()).readOutputs(any(User.class), any(Project.class), any(Symbol.class), any(List.class));
    }

    @Test
    public void shouldReturn404IfOutputShouldBeCreatedWithANotExistingResetSymbol() throws NotFoundException {
        given(symbolDAO.get(user, PROJECT_TEST_ID, new IdRevisionPair(RESET_SYMBOL_TEST_ID, 1L)))
                .willThrow(NotFoundException.class);

        String json = "{\"resetSymbol\":"
                        + "{\"id\": " + RESET_SYMBOL_TEST_ID + ", \"revision\": 1},"
                    + "\"symbols\": ["
                        + "{\"id\": 1, \"revision\": 1},"
                        + "{\"id\": 2, \"revision\": 4}"
                    + "]}";
        Response response = target("/learner/outputs/" + PROJECT_TEST_ID).request().post(Entity.json(json));

        assertEquals(Response.Status.NOT_FOUND.getStatusCode(), response.getStatus());
        verify(learner, never()).readOutputs(any(User.class), any(Project.class), any(Symbol.class), any(List.class));
    }

    @Test
    public void shouldReturn404IfOutputShouldBeCreatedWithoutAnyResetSymbol() throws NotFoundException {
        String json = "{\"symbols\": ["
                        + "{\"id\": 1, \"revision\": 1},"
                        + "{\"id\": 2, \"revision\": 4}"
                    + "]}";
        Response response = target("/learner/outputs/" + PROJECT_TEST_ID).request().post(Entity.json(json));

        assertEquals(Response.Status.NOT_FOUND.getStatusCode(), response.getStatus());
        verify(learner, never()).readOutputs(any(User.class), any(Project.class), any(Symbol.class), any(List.class));
    }

    @Test
    public void shouldReturn404IfOutputShouldBeCreatedWithForNotExistingSymbols() throws NotFoundException {
        given(symbolDAO.get(user, PROJECT_TEST_ID, new IdRevisionPair(2, 4))).willThrow(NotFoundException.class);

        String json = "{\"resetSymbol\":"
                        + "{\"id\": " + RESET_SYMBOL_TEST_ID + ", \"revision\": 1},"
                    + "\"symbols\": ["
                        + "{\"id\": 1, \"revision\": 1},"
                        + "{\"id\": 2, \"revision\": 4}"
                    + "]}";
        Response response = target("/learner/outputs/" + PROJECT_TEST_ID).request().post(Entity.json(json));

        assertEquals(Response.Status.NOT_FOUND.getStatusCode(), response.getStatus());
        verify(learner, never()).readOutputs(any(User.class), any(Project.class), any(Symbol.class), any(List.class));
    }

}
