package de.learnlib.weblearner.rest;

import de.learnlib.weblearner.WeblearnerTestApplication;
import de.learnlib.weblearner.dao.LearnerResultDAO;
import de.learnlib.weblearner.dao.ProjectDAO;
import de.learnlib.weblearner.dao.SymbolDAO;
import de.learnlib.weblearner.dao.SymbolGroupDAO;
import de.learnlib.weblearner.entities.LearnerConfiguration;
import de.learnlib.weblearner.entities.LearnerResult;
import de.learnlib.weblearner.entities.Project;
import de.learnlib.weblearner.entities.Symbol;
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
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.willThrow;
import static org.mockito.Matchers.any;
import static org.mockito.Matchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;

public class LearnerResourceTest extends JerseyTest {

    private static final long PROJECT_TEST_ID = 1;
    private static final long RESET_SYMBOL_TEST_ID = 3;

    @Mock
    private ProjectDAO projectDAO;

    @Mock
    private SymbolGroupDAO symbolGroupDAO;

    @Mock
    private SymbolDAO symbolDAO;

    @Mock
    private LearnerResultDAO learnerResultDAO;

    @Mock
    private Project project;

    @Mock
    private Learner learner;

    private Symbol resetSymbol;

    @Override
    protected Application configure() {
        MockitoAnnotations.initMocks(this);

        return new WeblearnerTestApplication(projectDAO, symbolGroupDAO, symbolDAO,
                                             learnerResultDAO, learner, LearnerResource.class);
    }

    @Before
    @Override
    public void setUp() throws Exception {
        super.setUp();
        resetSymbol = mock(Symbol.class);
        given(symbolDAO.get(PROJECT_TEST_ID, RESET_SYMBOL_TEST_ID, 1)).willReturn(resetSymbol);
    }

    @Test
    public void shouldStartALearningProcess() {
        given(projectDAO.getByID(PROJECT_TEST_ID, "all")).willReturn(project);
        given(learner.isActive()).willReturn(true);
        LearnerResult result = mock(LearnerResult.class);
        given(result.getProjectId()).willReturn(PROJECT_TEST_ID);
        given(result.getTestNo()).willReturn(1L);
        given(learner.getResult()).willReturn(result);

        String json = "{\"symbols\": ["
                        + "{\"id\": 1, \"revision\": 1},"
                        + "{\"id\": 2, \"revision\": 4}"
                    + "],\"resetSymbol\":{\"id\": " + RESET_SYMBOL_TEST_ID + ", \"revision\": 1}"
                    + ",\"algorithm\":\"DHC\", \"eqOracle\": {\"type\": \"complete\"}}";
        Response response = target("/learner/start/" + PROJECT_TEST_ID).request().post(Entity.json(json));

        assertEquals(Response.Status.OK.getStatusCode(), response.getStatus());
        String expectedJSON = "{\"active\":true,\"project\":" + PROJECT_TEST_ID + ",\"testNo\":1}";
        assertEquals(expectedJSON, response.readEntity(String.class));
        verify(learner).start(eq(project), any(LearnerConfiguration.class), eq(resetSymbol));
    }

    @Test
    public void shouldNotStartALearningProcessIfTheConfigurationIsInvalid() {

        given(projectDAO.getByID(PROJECT_TEST_ID)).willReturn(project);
        willThrow(IllegalArgumentException.class).given(learner).start(any(Project.class),
                                                                       any(LearnerConfiguration.class),
                                                                       any(Symbol.class));

        String json = "{\"symbols\": ["
                        + "{\"id\": 1, \"revision\": 1},"
                        + "{\"id\": 2, \"revision\": 4}"
                    + "],\"resetSymbol\":{\"id\": " + RESET_SYMBOL_TEST_ID + ", \"revision\": 1},"
                    + " \"algorithm\":\"DHC\",\"eqOracle\": {\"type\": \"complete\"}}";
        Response response = target("/learner/start/" + PROJECT_TEST_ID).request().post(Entity.json(json));

        verify(learner).start(any(Project.class), any(LearnerConfiguration.class), any(Symbol.class));
        assertEquals(Response.Status.BAD_REQUEST.getStatusCode(), response.getStatus());
    }

}
