package de.learnlib.weblearner.rest;

import de.learnlib.weblearner.WeblearnerTestApplication;
import de.learnlib.weblearner.dao.LearnerResultDAO;
import de.learnlib.weblearner.dao.ProjectDAO;
import de.learnlib.weblearner.dao.SymbolDAO;
import de.learnlib.weblearner.entities.LearnerResult;
import de.learnlib.weblearner.entities.Project;
import de.learnlib.weblearner.learner.Learner;
import de.learnlib.weblearner.utils.JSONHelpers;
import net.automatalib.words.Alphabet;
import net.automatalib.words.impl.SimpleAlphabet;
import org.glassfish.jersey.test.JerseyTest;
import org.junit.Before;
import org.junit.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import javax.ws.rs.core.Application;
import javax.ws.rs.core.Response;
import java.util.LinkedList;
import java.util.List;

import static org.junit.Assert.assertEquals;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.willThrow;
import static org.mockito.Mockito.verify;

public class HypothesisResourceTest extends JerseyTest {

    private static final long PROJECT_ID = 1L;
    private static final long RESULT_ID = 10L;
    private static final int TEST_RESULT_AMOUNT = 10;

    @Mock
    private ProjectDAO projectDAO;

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

        return new WeblearnerTestApplication(projectDAO, symbolDAO, learnerResultDAO, learner,
                                                HypothesisResource.class);
    }

    @Before
    public void setUp() throws Exception {
        super.setUp();

        project = new Project();
        project.setId(PROJECT_ID);
    }

    @Test
    public void shouldReturnAllFinalResults() {
        List<String> results = new LinkedList<>();
        for (int i = 0; i < TEST_RESULT_AMOUNT; i++) {
            Alphabet<String> sigma = new SimpleAlphabet<>();
            sigma.add("0");
            sigma.add("1");

            LearnerResult learnerResult = new LearnerResult();
            learnerResult.setProject(project);
            learnerResult.setTestNo(i);
            learnerResult.setStepNo(0L);
            learnerResult.setSigma(sigma);

            results.add(learnerResult.getJSON());
        }
        given(learnerResultDAO.getAllAsJSON(PROJECT_ID)).willReturn(results);

        Response response = target("/projects/" + PROJECT_ID + "/results").request().get();
        assertEquals(Response.Status.OK.getStatusCode(), response.getStatus());
        assertEquals(String.valueOf(TEST_RESULT_AMOUNT), response.getHeaderString("X-Total-Count"));

        String expectedJSON = JSONHelpers.stringListToJSON(results);
        assertEquals(expectedJSON, response.readEntity(String.class));
    }

    @Test
    public void ensureThatGettingAllFinalResultsReturns404IfTheProjectIdIsInvalid() {
        given(learnerResultDAO.getAllAsJSON(PROJECT_ID)).willThrow(IllegalArgumentException.class);

        Response response = target("/projects/" + PROJECT_ID + "/results").request().get();
        assertEquals(Response.Status.NOT_FOUND.getStatusCode(), response.getStatus());
    }

    @Test
    public void shouldReturnAllResultSteps() {
        List<String> results = new LinkedList<>();
        for (int i = 0; i < TEST_RESULT_AMOUNT; i++) {
            Alphabet<String> sigma = new SimpleAlphabet<>();
            sigma.add("0");
            sigma.add("1");

            LearnerResult learnerResult = new LearnerResult();
            learnerResult.setProject(project);
            learnerResult.setTestNo(RESULT_ID);
            learnerResult.setStepNo(i);
            learnerResult.setSigma(sigma);

            results.add(learnerResult.getJSON());
        }
        given(learnerResultDAO.getAllAsJSON(PROJECT_ID, RESULT_ID)).willReturn(results);

        String path = "/projects/" + PROJECT_ID + "/results/" + RESULT_ID + "/complete";
        Response response = target(path).request().get();
        assertEquals(Response.Status.OK.getStatusCode(), response.getStatus());
        assertEquals(String.valueOf(TEST_RESULT_AMOUNT), response.getHeaderString("X-Total-Count"));

        String expectedJSON = JSONHelpers.stringListToJSON(results);
        assertEquals(expectedJSON, response.readEntity(String.class));
    }

    @Test
    public void ensureThatGettingAllResultsOfOneRunReturns404IfTheProjectIdIsInvalid() {
        given(learnerResultDAO.getAllAsJSON(PROJECT_ID, RESULT_ID)).willThrow(IllegalArgumentException.class);

        String path = "/projects/" + PROJECT_ID + "/results/" + RESULT_ID + "/complete";
        Response response = target(path).request().get();
        assertEquals(Response.Status.NOT_FOUND.getStatusCode(), response.getStatus());
    }

    @Test
    public void shouldGetTheFinalResultOfOneTestRun() {
        // given
        Alphabet<String> sigma = new SimpleAlphabet<>();
        sigma.add("0");
        sigma.add("1");

        LearnerResult learnerResult = new LearnerResult();
        learnerResult.setProject(project);
        learnerResult.setTestNo(RESULT_ID);
        learnerResult.setStepNo(0L);
        learnerResult.setSigma(sigma);

        given(learnerResultDAO.getAsJSON(PROJECT_ID, RESULT_ID)).willReturn(learnerResult.getJSON());

        // when
        Response response = target("/projects/" + PROJECT_ID + "/results/" + RESULT_ID).request().get();

        // then
        assertEquals(Response.Status.OK.getStatusCode(), response.getStatus());
        assertEquals(learnerResult.getJSON(), response.readEntity(String.class));
    }

    @Test
    public void shouldDeleteAllStepsOfATestRun() {
        Response response = target("/projects/" + PROJECT_ID + "/results/" + RESULT_ID).request().delete();
        assertEquals(Response.Status.NO_CONTENT.getStatusCode(), response.getStatus());

        verify(learnerResultDAO).delete(PROJECT_ID, RESULT_ID);
    }

    @Test
    public void shouldDeleteMultipleTestResults() {
        Response response = target("/projects/" + PROJECT_ID + "/results/" + RESULT_ID + "," + (RESULT_ID + 1))
                                .request().delete();
        assertEquals(Response.Status.NO_CONTENT.getStatusCode(), response.getStatus());

        verify(learnerResultDAO).delete(PROJECT_ID, RESULT_ID, RESULT_ID + 1);
    }

    @Test
    public void shouldNotCrashIfNoTestNoToDeleteIsSpecified() {
        Response response = target("/projects/" + PROJECT_ID + "/results/").request().delete();
        assertEquals(Response.Status.METHOD_NOT_ALLOWED.getStatusCode(), response.getStatus());
    }

    @Test
    public void shouldReturnAnErrorIfYouTryToDeleteAnInvalidTestNo() {
        willThrow(IllegalArgumentException.class).given(learnerResultDAO).delete(PROJECT_ID, RESULT_ID, RESULT_ID + 1);

        Response response = target("/projects/" + PROJECT_ID + "/results/" + RESULT_ID + "," +  (RESULT_ID + 1))
                            .request().delete();

        assertEquals(Response.Status.NOT_FOUND.getStatusCode(), response.getStatus());
    }

    @Test
    public void ensureThatNoTestNumberToDeleteIsHandledProperly() {
        willThrow(IllegalArgumentException.class).given(learnerResultDAO).delete(PROJECT_ID, RESULT_ID, RESULT_ID + 1);

        Response response = target("/projects/" + PROJECT_ID + "/results/,,,,")
                            .request().delete();

        assertEquals(Response.Status.BAD_REQUEST.getStatusCode(), response.getStatus());
    }

    @Test
    public void ensureThatANotValidTestNumberStringOnDeletionIsHandledProperly() {
        willThrow(IllegalArgumentException.class).given(learnerResultDAO).delete(PROJECT_ID, RESULT_ID, RESULT_ID + 1);

        Response response = target("/projects/" + PROJECT_ID + "/results/foobar")
                            .request().delete();

        assertEquals(Response.Status.BAD_REQUEST.getStatusCode(), response.getStatus());
    }
}
