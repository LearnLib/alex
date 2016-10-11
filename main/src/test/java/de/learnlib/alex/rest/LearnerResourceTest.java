/*
 * Copyright 2016 TU Dortmund
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package de.learnlib.alex.rest;

import de.learnlib.alex.ALEXTestApplication;
import de.learnlib.alex.core.dao.LearnerResultDAO;
import de.learnlib.alex.core.dao.ProjectDAO;
import de.learnlib.alex.core.dao.SymbolDAO;
import de.learnlib.alex.core.entities.IdRevisionPair;
import de.learnlib.alex.core.entities.LearnerConfiguration;
import de.learnlib.alex.core.entities.LearnerResult;
import de.learnlib.alex.core.entities.LearnerResumeConfiguration;
import de.learnlib.alex.core.entities.LearnerStatus;
import de.learnlib.alex.core.entities.Project;
import de.learnlib.alex.core.entities.Statistics;
import de.learnlib.alex.core.entities.Symbol;
import de.learnlib.alex.core.entities.User;
import de.learnlib.alex.core.learner.Learner;
import de.learnlib.alex.exceptions.LearnerException;
import de.learnlib.alex.exceptions.NotFoundException;
import org.glassfish.hk2.utilities.binding.AbstractBinder;
import org.glassfish.jersey.test.JerseyTest;
import org.junit.Before;
import org.junit.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import javax.ws.rs.client.Entity;
import javax.ws.rs.core.Application;
import javax.ws.rs.core.Response;
import java.time.ZonedDateTime;
import java.util.List;

import static org.junit.Assert.assertEquals;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.willThrow;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;

public class LearnerResourceTest extends JerseyTest {

    private static final long USER_TEST_ID = 1;
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
    private ProjectDAO projectDAO;

    @Mock
    private SymbolDAO symbolDAO;

    @Mock
    private LearnerResultDAO learnerResultDAO;

    @Mock
    private Learner learner;

    @Mock
    private Project project;

    private User admin;
    private String adminToken;

    @Override
    protected Application configure() {
        MockitoAnnotations.initMocks(this);

        ALEXTestApplication testApplication = new ALEXTestApplication(LearnerResource.class);
        admin = testApplication.getAdmin();
        adminToken = testApplication.getAdminToken();
        testApplication.register(new AbstractBinder() {
            @Override
            protected void configure() {
                bind(projectDAO).to(ProjectDAO.class);
                bind(symbolDAO).to(SymbolDAO.class);
                bind(learnerResultDAO).to(LearnerResultDAO.class);
                bind(learner).to(Learner.class);
            }
        });
        return testApplication;
    }

    @Before
    @Override
    public void setUp() throws Exception {
        super.setUp();

        given(projectDAO.getByID(USER_TEST_ID, PROJECT_TEST_ID, ProjectDAO.EmbeddableFields.ALL)).willReturn(project);
        Symbol resetSymbol = mock(Symbol.class);
        given(symbolDAO.get(admin, PROJECT_TEST_ID, new IdRevisionPair(RESET_SYMBOL_TEST_ID, 1L)))
                .willReturn(resetSymbol);

        LearnerResult result = new LearnerResult();
        result.setUser(new User(USER_TEST_ID));
        result.setProject(new Project(PROJECT_TEST_ID));
        result.setTestNo(TEST_NO);
        Statistics learnerStatistics = new Statistics();
        learnerStatistics.setStartDate(ZonedDateTime.parse("1970-01-01T00:00:00.000+00:00"));
        result.setStatistics(learnerStatistics);

        given(learner.isActive(admin)).willReturn(true);
        given(learner.getResult(admin)).willReturn(result);

        LearnerStatus learnerStatus = new LearnerStatus(result);
        given(learner.getStatus(admin)).willReturn(learnerStatus);
    }

    @Test
    public void shouldStartALearningProcess() throws NotFoundException {
        Response response = target("/learner/start/" + PROJECT_TEST_ID).request().header("Authorization", adminToken)
                                .post(Entity.json(START_JSON));

        assertEquals(Response.Status.OK.getStatusCode(), response.getStatus());
        String expectedJSON = "{"
                                + "\"active\":true,\"project\":" + PROJECT_TEST_ID + ",\"statistics\":"
                                  + "{\"mqsUsed\":0,\"startDate\":\"1970-01-01T00:00:00.000+00:00\"},"
                                + "\"testNo\":" + TEST_NO
                              + "}";
        assertEquals(expectedJSON, response.readEntity(String.class));
        verify(learner).start(eq(admin), eq(project), any(LearnerConfiguration.class));
    }

    @Test
    public void shouldNotStartALearningProcessIfTheProjectDoesNotExist() throws NotFoundException {
        given(projectDAO.getByID(USER_TEST_ID, PROJECT_TEST_ID, ProjectDAO.EmbeddableFields.ALL))
                .willThrow(NotFoundException.class);

        Response response = target("/learner/start/" + PROJECT_TEST_ID).request().header("Authorization", adminToken)
                                .post(Entity.json(START_JSON));

        assertEquals(Response.Status.NOT_FOUND.getStatusCode(), response.getStatus());
        verify(learner, never()).start(any(User.class), any(Project.class), any(LearnerConfiguration.class));
    }

    @Test
    public void shouldReturn404IfTheLearnerCouldNotFindASymbol() throws NotFoundException {
        willThrow(NotFoundException.class).given(learner)
                                                .start(eq(admin), eq(project), any(LearnerConfiguration.class));

        Response response = target("/learner/start/" + PROJECT_TEST_ID).request().header("Authorization", adminToken)
                                .post(Entity.json(START_JSON));

        assertEquals(Response.Status.NOT_FOUND.getStatusCode(), response.getStatus());
    }

    @Test
    public void shouldNotStartALearningProcessIfTheConfigurationIsInvalid() throws NotFoundException {
        willThrow(IllegalArgumentException.class).given(learner).start(any(User.class),
                                                                       any(Project.class),
                                                                       any(LearnerConfiguration.class));

        Response response = target("/learner/start/" + PROJECT_TEST_ID).request().header("Authorization", adminToken)
                                .post(Entity.json(START_JSON));

        verify(learner).start(any(User.class), any(Project.class), any(LearnerConfiguration.class));
        assertEquals(Response.Status.BAD_REQUEST.getStatusCode(), response.getStatus());
    }

    @Test
    public void shouldNotStartALearningProcessIfTheUserInTheConfigurationDoesntMatch() throws NotFoundException {
        String json = "{\"user\": 100}";

        Response response = target("/learner/start/" + PROJECT_TEST_ID).request().header("Authorization", adminToken)
                                .post(Entity.json(json));

        verify(learner, never()).start(any(User.class), any(Project.class), any(LearnerConfiguration.class));
        assertEquals(Response.Status.BAD_REQUEST.getStatusCode(), response.getStatus());
    }

    @Test
    public void shouldNotStartALearningProcessIfTheProjectInTheConfigurationDoesntMatch() throws NotFoundException {
        String json = "{\"project\": 100}";

        Response response = target("/learner/start/" + PROJECT_TEST_ID).request().header("Authorization", adminToken)
                                .post(Entity.json(json));

        verify(learner, never()).start(any(User.class), any(Project.class), any(LearnerConfiguration.class));
        assertEquals(Response.Status.BAD_REQUEST.getStatusCode(), response.getStatus());
    }

    @Test
    public void shouldNotStartALearningProcessTwice() throws NotFoundException {
        willThrow(IllegalStateException.class).given(learner).start(any(User.class),
                                                                    any(Project.class),
                                                                    any(LearnerConfiguration.class));

        Response response = target("/learner/start/" + PROJECT_TEST_ID).request().header("Authorization", adminToken)
                                .post(Entity.json(START_JSON));

        assertEquals(Response.Status.NOT_MODIFIED.getStatusCode(), response.getStatus());
    }

    @Test
    public void shouldResumeIfPossible() throws NotFoundException {
        target("/learner/start/" + PROJECT_TEST_ID).request().header("Authorization", adminToken)
                .post(Entity.json(START_JSON));

        Response response = target("/learner/resume/" + PROJECT_TEST_ID + "/"  + TEST_NO).request()
                                .header("Authorization", adminToken).post(Entity.json(RESUME_JSON));

        assertEquals(Response.Status.OK.getStatusCode(), response.getStatus());
        String expectedJSON = "{\"active\":true,\"project\":" + PROJECT_TEST_ID + ",\"statistics\":"
                                    + "{\"mqsUsed\":0,\"startDate\":\"1970-01-01T00:00:00.000+00:00\"},"
                                + "\"testNo\":" + TEST_NO + "}";
        assertEquals(expectedJSON, response.readEntity(String.class));
        verify(learner).resume(any(User.class), any(LearnerResumeConfiguration.class));
    }

    @Test
    public void shouldReturn404IfTheUserHasNoPreviousLearnResult() throws NotFoundException {
        given(learner.getResult(admin)).willReturn(null);

        Response response = target("/learner/resume/" + PROJECT_TEST_ID + "/"  + TEST_NO).request()
                                .header("Authorization", adminToken).post(Entity.json(RESUME_JSON));

        assertEquals(Response.Status.NOT_FOUND.getStatusCode(), response.getStatus());
        verify(learner, never()).resume(any(User.class), any(LearnerConfiguration.class));
    }

    @Test
    public void shouldReturn400IfTheGivenProjectIdDoesNotMatchTheOldOne() throws NotFoundException {
        Response response = target("/learner/resume/" + (PROJECT_TEST_ID + 1) + "/"  + TEST_NO).request()
                                .header("Authorization", adminToken).post(Entity.json(RESUME_JSON));

        assertEquals(Response.Status.BAD_REQUEST.getStatusCode(), response.getStatus());
        verify(learner, never()).resume(any(User.class), any(LearnerConfiguration.class));
    }

    @Test
    public void shouldReturn400IfTheGivenTestNoDoesNotMatchTheOldOne() throws NotFoundException {
        Response response = target("/learner/resume/" + PROJECT_TEST_ID + "/"  + (TEST_NO + 1)).request()
                                .header("Authorization", adminToken).post(Entity.json(RESUME_JSON));

        assertEquals(Response.Status.BAD_REQUEST.getStatusCode(), response.getStatus());
        verify(learner, never()).resume(any(User.class), any(LearnerConfiguration.class));
    }

    @Test
    public void shouldReturn302IfTheUserHasAnActiveLearnProcess() throws NotFoundException {
        willThrow(IllegalStateException.class).given(learner).resume(eq(admin), any(LearnerResumeConfiguration.class));

        Response response = target("/learner/resume/" + PROJECT_TEST_ID + "/"  + TEST_NO).request()
                                .header("Authorization", adminToken).post(Entity.json(RESUME_JSON));

        assertEquals(Response.Status.NOT_MODIFIED.getStatusCode(), response.getStatus());
    }

    @Test
    public void shouldReturn404IfTheSymbolsOfTheLearnerAreGone() throws NotFoundException {
        willThrow(NotFoundException.class).given(learner).resume(eq(admin), any(LearnerResumeConfiguration.class));

        Response response = target("/learner/resume/" + PROJECT_TEST_ID + "/"  + TEST_NO).request()
                .header("Authorization", adminToken).post(Entity.json(RESUME_JSON));

        assertEquals(Response.Status.NOT_FOUND.getStatusCode(), response.getStatus());
    }

    @Test
    public void shouldReturn404IfTheResumeConfigurationWasInvalid() throws NotFoundException {
        willThrow(IllegalArgumentException.class)
                .given(learner).resume(eq(admin), any(LearnerResumeConfiguration.class));

        Response response = target("/learner/resume/" + PROJECT_TEST_ID + "/"  + TEST_NO).request()
                .header("Authorization", adminToken).post(Entity.json(RESUME_JSON));

        assertEquals(Response.Status.BAD_REQUEST.getStatusCode(), response.getStatus());
    }

    @Test
    public void shouldStopIfTheLearningIsActive() {
        Response response = target("/learner/stop").request().header("Authorization", adminToken).get();

        assertEquals(Response.Status.OK.getStatusCode(), response.getStatus());
        String expectedJSON = "{\"active\":true,\"project\":" + PROJECT_TEST_ID + ",\"statistics\":"
                                    + "{\"mqsUsed\":0,\"startDate\":\"1970-01-01T00:00:00.000+00:00\"},"
                                + "\"testNo\":" + TEST_NO + "}";
        assertEquals(expectedJSON, response.readEntity(String.class));
        verify(learner).stop(admin);
    }

    @Test
    public void shouldNotStopIfTheLearningIsNotActive() {
        given(learner.isActive(admin)).willReturn(false);
        given(learner.getResult(admin)).willReturn(null);
        LearnerStatus learnerStatus = new LearnerStatus();
        given(learner.getStatus(admin)).willReturn(learnerStatus);

        Response response = target("/learner/stop").request().header("Authorization", adminToken).get();

        assertEquals(Response.Status.OK.getStatusCode(), response.getStatus());
        String expectedJSON = "{\"active\":false}";
        assertEquals(expectedJSON, response.readEntity(String.class));
        verify(learner, never()).stop(admin);
    }

    @Test
    public void shouldReturnTheRightActiveInformationIfALearningProcessIsActive() {
        Response response = target("/learner/active").request().header("Authorization", adminToken).get();

        assertEquals(Response.Status.OK.getStatusCode(), response.getStatus());
        String expectedJSON = "{\"active\":true,\"project\":" + PROJECT_TEST_ID + ",\"statistics\":"
                                        + "{\"mqsUsed\":0,\"startDate\":\"1970-01-01T00:00:00.000+00:00\"},"
                                + "\"testNo\":" + TEST_NO + "}";
        assertEquals(expectedJSON, response.readEntity(String.class));
    }

    @Test
    public void shouldReturnTheRightActiveInformationIfNoLearningProcessIsActive() {
        LearnerStatus learnerStatus = new LearnerStatus();
        given(learner.getStatus(admin)).willReturn(learnerStatus);

        Response response = target("/learner/active").request().header("Authorization", adminToken).get();

        assertEquals(Response.Status.OK.getStatusCode(), response.getStatus());
        String expectedJSON = "{\"active\":false}";
        assertEquals(expectedJSON, response.readEntity(String.class));
    }

    @Test
    public void shouldReturnAnActiveStatus() {
        LearnerResult realResult = new LearnerResult();
        given(learner.getResult(admin)).willReturn(realResult);

        Response response = target("/learner/status").request().header("Authorization", adminToken).get();

        assertEquals(Response.Status.OK.getStatusCode(), response.getStatus());
    }

    @Test
    public void shouldReturn404IfNoStatusIsAvailable() {
        given(learner.getResult(admin)).willReturn(null);

        Response response = target("/learner/status").request().header("Authorization", adminToken).get();

        assertEquals(Response.Status.NOT_FOUND.getStatusCode(), response.getStatus());
    }

    @Test
    public void shouldReturn404IfStatusWasDeletedInTheDB() throws NotFoundException {
        given(learnerResultDAO.get(USER_TEST_ID, PROJECT_TEST_ID, TEST_NO, false)).willThrow(NotFoundException.class);

        Response response = target("/learner/status").request().header("Authorization", adminToken).get();

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
        Response response = target("/learner/outputs/" + PROJECT_TEST_ID).request().header("Authorization", adminToken)
                                .post(Entity.json(json));

        assertEquals(Response.Status.OK.getStatusCode(), response.getStatus());
    }

    @Test
    public void shouldCreateEmptyOutputForNoSymbols() throws NotFoundException {
        String json = "{\"resetSymbol\":"
                + "{\"id\": " + RESET_SYMBOL_TEST_ID + ", \"revision\": 1},"
                + "\"symbols\": []}";
        Response response = target("/learner/outputs/" + PROJECT_TEST_ID).request().header("Authorization", adminToken)
                                .post(Entity.json(json));

        assertEquals(Response.Status.OK.getStatusCode(), response.getStatus());
        assertEquals("[]", response.readEntity(String.class));
    }

    @Test
    public void shouldReturn400IfCreatingAnOutputFailed() throws NotFoundException {
        given(learner.readOutputs(any(), any(), any(), anyList()))
                .willThrow(LearnerException.class);

        String json = "{\"resetSymbol\":"
                + "{\"id\": " + RESET_SYMBOL_TEST_ID + ", \"revision\": 1},"
                + "\"symbols\": ["
                + "{\"id\": 1, \"revision\": 1},"
                + "{\"id\": 2, \"revision\": 4}"
                + "]}";
        Response response = target("/learner/outputs/" + PROJECT_TEST_ID).request().header("Authorization", adminToken)
                                .post(Entity.json(json));

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
        Response response = target("/learner/outputs/" + PROJECT_TEST_ID).request().header("Authorization", adminToken)
                                .post(Entity.json(json));

        assertEquals(Response.Status.NOT_FOUND.getStatusCode(), response.getStatus());
        verify(learner, never()).readOutputs(any(User.class), any(Project.class), any(Symbol.class), anyList());
    }

    @Test
    public void shouldReturn404IfOutputShouldBeCreatedWithANotExistingResetSymbol() throws NotFoundException {
        given(symbolDAO.get(admin, PROJECT_TEST_ID, new IdRevisionPair(RESET_SYMBOL_TEST_ID, 1L)))
                .willThrow(NotFoundException.class);

        String json = "{\"resetSymbol\":"
                        + "{\"id\": " + RESET_SYMBOL_TEST_ID + ", \"revision\": 1},"
                    + "\"symbols\": ["
                        + "{\"id\": 1, \"revision\": 1},"
                        + "{\"id\": 2, \"revision\": 4}"
                    + "]}";
        Response response = target("/learner/outputs/" + PROJECT_TEST_ID).request().header("Authorization", adminToken)
                                .post(Entity.json(json));

        assertEquals(Response.Status.NOT_FOUND.getStatusCode(), response.getStatus());
        verify(learner, never()).readOutputs(any(User.class), any(Project.class), any(Symbol.class), any());
    }

    @Test
    public void shouldReturn404IfOutputShouldBeCreatedWithoutAnyResetSymbol() throws NotFoundException {
        String json = "{\"symbols\": ["
                        + "{\"id\": 1, \"revision\": 1},"
                        + "{\"id\": 2, \"revision\": 4}"
                    + "]}";
        Response response = target("/learner/outputs/" + PROJECT_TEST_ID).request().header("Authorization", adminToken)
                                .post(Entity.json(json));

        assertEquals(Response.Status.NOT_FOUND.getStatusCode(), response.getStatus());
        verify(learner, never()).readOutputs(any(User.class), any(Project.class), any(Symbol.class), anyList());
    }

    @Test
    public void shouldReturn404IfOutputShouldBeCreatedWithForNotExistingSymbols() throws NotFoundException {
        given(symbolDAO.get(admin, PROJECT_TEST_ID, new IdRevisionPair(2L, 2L))).willThrow(NotFoundException.class);

        String json = "{\"resetSymbol\":"
                        + "{\"id\": " + RESET_SYMBOL_TEST_ID + ", \"revision\": 1},"
                    + "\"symbols\": ["
                        + "{\"id\": 1, \"revision\": 1},"
                        + "{\"id\": 2, \"revision\": 2}"
                    + "]}";
        Response response = target("/learner/outputs/" + PROJECT_TEST_ID).request().header("Authorization", adminToken)
                                .post(Entity.json(json));

        assertEquals(Response.Status.NOT_FOUND.getStatusCode(), response.getStatus());
        verify(learner, never()).readOutputs(any(User.class), any(Project.class), any(Symbol.class), anyList());
    }

}

