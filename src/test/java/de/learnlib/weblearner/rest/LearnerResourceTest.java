package de.learnlib.weblearner.rest;

import de.learnlib.weblearner.WeblearnerTestApplication;
import de.learnlib.weblearner.dao.LearnerResultDAO;
import de.learnlib.weblearner.dao.ProjectDAO;
import de.learnlib.weblearner.dao.SymbolDAO;
import de.learnlib.weblearner.entities.LearnerConfiguration;
import de.learnlib.weblearner.entities.LearnerResult;
import de.learnlib.weblearner.entities.Project;
import de.learnlib.weblearner.entities.Symbol;
import de.learnlib.weblearner.learner.Learner;
import org.glassfish.jersey.test.JerseyTest;
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
    @Mock
    private ProjectDAO projectDAO;

    @Mock
    private SymbolDAO symbolDAO;

    @Mock
    private LearnerResultDAO learnerResultDAO;

    @Mock
    private Project project;

    @Mock
    private Learner learner;

    @Override
    protected Application configure() {
        MockitoAnnotations.initMocks(this);

        return new WeblearnerTestApplication(projectDAO, symbolDAO, learnerResultDAO, learner, LearnerResource.class);
    }

    @Test
    public void shouldStartALearningProcess() {
        given(project.getResetSymbol()).willReturn(mock(Symbol.class));
        given(projectDAO.getByID(PROJECT_TEST_ID, "all")).willReturn(project);
        given(learner.isActive()).willReturn(true);
        LearnerResult result = mock(LearnerResult.class);
        given(result.getProjectId()).willReturn(PROJECT_TEST_ID);
        given(result.getTestNo()).willReturn(1L);
        given(learner.getResult()).willReturn(result);

        String json = "{\"symbols\": ["
                            + "{\"id\": 1, \"revision\": 1},"
                            + "{\"id\": 2, \"revision\": 4}"
                        + "],\"algorithm\":\"DHC\", \"eqOracle\": {\"type\": \"complete\"}}";
        Response response = target("/learner/start/" + PROJECT_TEST_ID).request().post(Entity.json(json));

        assertEquals(Response.Status.OK.getStatusCode(), response.getStatus());
        String expectedJSON = "{\"active\":true,\"project\":" + PROJECT_TEST_ID + ",\"testNo\":1}";
        assertEquals(expectedJSON, response.readEntity(String.class));
        verify(learner).start(eq(project), any(LearnerConfiguration.class));
    }

    @Test
    public void shouldNotStartALearningProcessIfTheConfigurationIsInvalid() {
        given(project.getResetSymbol()).willReturn(mock(Symbol.class));
        given(projectDAO.getByID(PROJECT_TEST_ID)).willReturn(project);
        willThrow(IllegalArgumentException.class).given(learner).start(any(Project.class),
                                                                       any(LearnerConfiguration.class));

        String json = "{\"symbols\": ["
                        + "{\"id\": 1, \"revision\": 1},"
                        + "{\"id\": 2, \"revision\": 4}"
                    + "],\"algorithm\":\"DHC\", \"eqOracle\": {\"type\": \"complete\"}}";
        Response response = target("/learner/start/" + PROJECT_TEST_ID).request().post(Entity.json(json));

        verify(learner).start(any(Project.class), any(LearnerConfiguration.class));
        assertEquals(Response.Status.BAD_REQUEST.getStatusCode(), response.getStatus());
    }

}
