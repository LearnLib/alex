/*
 * Copyright 2018 TU Dortmund
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

package de.learnlib.alex.learning.rest;

import de.learnlib.alex.ALEXTestApplication;
import de.learnlib.alex.auth.entities.User;
import de.learnlib.alex.common.exceptions.NotFoundException;
import de.learnlib.alex.data.dao.ProjectDAO;
import de.learnlib.alex.data.dao.SymbolDAO;
import de.learnlib.alex.data.entities.Project;
import de.learnlib.alex.data.entities.Symbol;
import de.learnlib.alex.learning.dao.LearnerResultDAO;
import de.learnlib.alex.learning.entities.LearnerResult;
import de.learnlib.alex.learning.entities.LearnerResultStep;
import de.learnlib.alex.learning.entities.LearnerResumeConfiguration;
import de.learnlib.alex.learning.entities.LearnerStartConfiguration;
import de.learnlib.alex.learning.entities.LearnerStatus;
import de.learnlib.alex.learning.entities.Statistics;
import de.learnlib.alex.learning.entities.learnlibproxies.CompactMealyMachineProxy;
import de.learnlib.alex.learning.entities.webdrivers.HtmlUnitDriverConfig;
import de.learnlib.alex.learning.entities.webdrivers.AbstractWebDriverConfig;
import de.learnlib.alex.learning.exceptions.LearnerException;
import de.learnlib.alex.learning.repositories.LearnerResultRepository;
import de.learnlib.alex.learning.repositories.LearnerResultStepRepository;
import de.learnlib.alex.learning.services.Learner;
import de.learnlib.alex.webhooks.services.WebhookService;
import net.automatalib.words.impl.SimpleAlphabet;
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
import java.util.ArrayList;
import java.util.Collections;

import static org.junit.Assert.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.willThrow;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.spy;
import static org.mockito.Mockito.verify;

public class LearnerResourceTest extends JerseyTest {

    private static final String driverConfig = "{\"name\":\"htmlUnit\",\"height\":0,\"implicitlyWait\":0,\"pageLoadTimeout\":10,\"scriptTimeout\":10,\"width\":0}";

    private static final long USER_TEST_ID = 1;
    private static final long PROJECT_TEST_ID = 1;
    private static final long TEST_NO = 2;
    private static final long RESET_SYMBOL_TEST_ID = 3;
    private static final String START_JSON = "{\"symbols\": [1,2]"
                                           + ",\"resetSymbol\":" + RESET_SYMBOL_TEST_ID
                                           + ",\"algorithm\":{\"name\":\"TTT\"}"
                                           + ",\"eqOracle\": {\"type\": \"complete\"}"
                                           + ",\"driverConfig\": " + driverConfig +"}";

    private static final String RESUME_JSON = "{\"eqOracle\": {\"type\": \"complete\"},\"stepNo\":1,\"symbolsToAdd\":[],\"maxAmountOfStepsToLearn\":-1}";

    @Mock
    private ProjectDAO projectDAO;

    @Mock
    private SymbolDAO symbolDAO;

    @Mock
    private LearnerResultDAO learnerResultDAO;

    @Mock
    private LearnerResource learnerResource;

    @Mock
    private Learner learner;

    @Mock
    private Project project;

    @Mock
    private LearnerResultStepRepository learnerResultStepRepository;

    @Mock
    private LearnerResultRepository learnerResultRepository;

    @Mock
    private WebhookService webhookService;

    private User admin;
    private String adminToken;
    private AbstractWebDriverConfig browserConfig = new HtmlUnitDriverConfig();

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
                bind(learnerResultStepRepository).to(LearnerResultStepRepository.class);
                bind(learnerResultRepository).to(LearnerResultRepository.class);
                bind(learner).to(Learner.class);
                bind(webhookService).to(WebhookService.class);
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
        given(symbolDAO.get(admin, PROJECT_TEST_ID, RESET_SYMBOL_TEST_ID))
                .willReturn(resetSymbol);

        LearnerResult result = new LearnerResult();
        result.setProject(new Project(PROJECT_TEST_ID));
        result.setTestNo(TEST_NO);
        Statistics learnerStatistics = new Statistics();
        learnerStatistics.setStartDate(ZonedDateTime.parse("1970-01-01T00:00:00.000+00:00"));
        result.setStatistics(learnerStatistics);

        given(learner.isActive(PROJECT_TEST_ID)).willReturn(true);
        given(learner.getResult(PROJECT_TEST_ID)).willReturn(result);

        LearnerStatus learnerStatus = new LearnerStatus(result, Learner.LearnerPhase.LEARNING, new ArrayList<>());
        given(learner.getStatus(PROJECT_TEST_ID)).willReturn(learnerStatus);
    }

    @Test
    public void shouldStartALearningProcess() throws NotFoundException {
        Response response = target("/learner/" + PROJECT_TEST_ID + "/start")
                .request()
                .header("Authorization", adminToken)
                .post(Entity.json(START_JSON));

        assertEquals(Response.Status.OK.getStatusCode(), response.getStatus());

        String expectedJSON = "{\"active\":true,\"currentQueries\":[],\"learnerPhase\":\"LEARNING\","
                + "\"project\":" + PROJECT_TEST_ID + ",\"statistics\":{\"duration\":{\"learner\":0,"
                + "\"eqOracle\":0,\"total\":0},\"eqsUsed\":0,\"mqsUsed\":{\"learner\":0,\"eqOracle\":0,"
                + "\"total\":0},\"startDate\":\"1970-01-01T00:00:00.000+00:00\",\"symbolsUsed\":{\"learner\":0,"
                + "\"eqOracle\":0,\"total\":0}},\"stepNo\":0,\"testNo\":" + TEST_NO + "}";
        assertEquals(expectedJSON, response.readEntity(String.class));
        verify(learner).start(eq(admin), eq(project), any(LearnerStartConfiguration.class));
    }

    @Test
    public void shouldNotStartALearningProcessIfTheProjectDoesNotExist() throws NotFoundException {
        given(projectDAO.getByID(USER_TEST_ID, PROJECT_TEST_ID, ProjectDAO.EmbeddableFields.ALL))
                .willThrow(NotFoundException.class);

        Response response = target("/learner/" + PROJECT_TEST_ID + "/start").request().header("Authorization", adminToken)
                                .post(Entity.json(START_JSON));

        assertEquals(Response.Status.NOT_FOUND.getStatusCode(), response.getStatus());
        verify(learner, never()).start(any(User.class), any(Project.class), any(LearnerStartConfiguration.class));
    }

    @Test
    public void shouldReturn404IfTheLearnerCouldNotFindASymbol() throws NotFoundException {
        willThrow(NotFoundException.class).given(learner)
                                                .start(eq(admin), eq(project), any(LearnerStartConfiguration.class));

        Response response = target("/learner/" + PROJECT_TEST_ID + "/start").request().header("Authorization", adminToken)
                                .post(Entity.json(START_JSON));

        assertEquals(Response.Status.NOT_FOUND.getStatusCode(), response.getStatus());
    }

    @Test
    public void shouldNotStartALearningProcessIfTheConfigurationIsInvalid() throws NotFoundException {
        willThrow(IllegalArgumentException.class).given(learner).start(any(User.class),
                                                                       any(Project.class),
                                                                       any(LearnerStartConfiguration.class));

        Response response = target("/learner/" + PROJECT_TEST_ID + "/start").request().header("Authorization", adminToken)
                                .post(Entity.json(START_JSON));

        verify(learner).start(any(User.class), any(Project.class), any(LearnerStartConfiguration.class));
        assertEquals(Response.Status.BAD_REQUEST.getStatusCode(), response.getStatus());
    }

    @Test
    public void shouldNotStartALearningProcessIfTheUserInTheConfigurationDoesntMatch() throws NotFoundException {
        String json = "{\"user\": 100}";

        Response response = target("/learner/" + PROJECT_TEST_ID + "/start").request().header("Authorization", adminToken)
                                .post(Entity.json(json));

        verify(learner, never()).start(any(User.class), any(Project.class), any(LearnerStartConfiguration.class));
        assertEquals(Response.Status.BAD_REQUEST.getStatusCode(), response.getStatus());
    }

    @Test
    public void shouldNotStartALearningProcessIfTheProjectInTheConfigurationDoesntMatch() throws NotFoundException {
        String json = "{\"project\": 100}";

        Response response = target("/learner/" + PROJECT_TEST_ID + "/start").request().header("Authorization", adminToken)
                                .post(Entity.json(json));

        verify(learner, never()).start(any(User.class), any(Project.class), any(LearnerStartConfiguration.class));
        assertEquals(Response.Status.BAD_REQUEST.getStatusCode(), response.getStatus());
    }

    @Test
    public void shouldNotStartALearningProcessTwice() throws NotFoundException {
        willThrow(IllegalStateException.class).given(learner).start(any(User.class),
                                                                    any(Project.class),
                                                                    any(LearnerStartConfiguration.class));

        Response response = target("/learner/" + PROJECT_TEST_ID + "/start").request().header("Authorization", adminToken)
                                .post(Entity.json(START_JSON));

        assertEquals(Response.Status.NOT_MODIFIED.getStatusCode(), response.getStatus());
    }

    @Test
    public void shouldResumeIfPossible() throws NotFoundException {
        prepareResumeTest();

        target("/learner/" + PROJECT_TEST_ID + "/start").request().header("Authorization", adminToken)
                .post(Entity.json(START_JSON));

        Response response = target("/learner/" + PROJECT_TEST_ID + "/resume/"  + TEST_NO).request()
                                .header("Authorization", adminToken).post(Entity.json(RESUME_JSON));

        assertEquals(Response.Status.OK.getStatusCode(), response.getStatus());
        String expectedJSON = "{\"active\":true,\"currentQueries\":[],\"learnerPhase\":\"LEARNING\","
                + "\"project\":" + PROJECT_TEST_ID + ",\"statistics\":{\"duration\":{\"learner\":0,"
                + "\"eqOracle\":0,\"total\":0},\"eqsUsed\":0,\"mqsUsed\":{\"learner\":0,\"eqOracle\":0,"
                + "\"total\":0},\"startDate\":\"1970-01-01T00:00:00.000+00:00\",\"symbolsUsed\":{\"learner\":0,"
                + "\"eqOracle\":0,\"total\":0}},\"stepNo\":0,\"testNo\":" + TEST_NO + "}";

        assertEquals(expectedJSON, response.readEntity(String.class));
        verify(learner).resume(any(User.class), any(Project.class), any(LearnerResult.class), any(LearnerResumeConfiguration.class));
    }

    @Test
    public void shouldReturn404IfTheUserHasNoPreviousLearnResult() throws NotFoundException {
        given(learner.getResult(PROJECT_TEST_ID)).willReturn(null);

        Response response = target("/learner/" + PROJECT_TEST_ID + "/resume/"  + TEST_NO).request()
                                .header("Authorization", adminToken).post(Entity.json(RESUME_JSON));

        assertEquals(Response.Status.NOT_FOUND.getStatusCode(), response.getStatus());
        verify(learner, never()).resume(any(User.class), any(Project.class), any(LearnerResult.class), any(LearnerResumeConfiguration.class));
    }

    @Test
    public void shouldReturn302IfTheUserHasAnActiveLearnProcess() throws NotFoundException {
        willThrow(IllegalStateException.class).given(learner).resume(eq(admin), any(Project.class), any(LearnerResult.class), any(LearnerResumeConfiguration.class));

        prepareResumeTest();

        Response response = target("/learner/" + PROJECT_TEST_ID + "/resume/"  + TEST_NO).request()
                                .header("Authorization", adminToken).post(Entity.json(RESUME_JSON));

        assertEquals(Response.Status.NOT_MODIFIED.getStatusCode(), response.getStatus());
    }

    @Test
    public void shouldReturn404IfTheSymbolsOfTheLearnerAreGone() throws NotFoundException {
        willThrow(NotFoundException.class).given(learner).resume(eq(admin), any(Project.class), any(LearnerResult.class), any(LearnerResumeConfiguration.class));

        Response response = target("/learner/" + PROJECT_TEST_ID + "/resume/"  + TEST_NO).request()
                .header("Authorization", adminToken).post(Entity.json(RESUME_JSON));

        assertEquals(Response.Status.NOT_FOUND.getStatusCode(), response.getStatus());
    }

    @Test
    public void shouldReturn400IfTheResumeConfigurationWasInvalid() {
        String invalidResumeConfig = "{\"eqOracle\": {\"type\": \"complete\"},\"stepNo\":-1,\"symbolsToAdd\":[],\"maxAmountOfStepsToLearn\":-1}";

        Response response = target("/learner/" + PROJECT_TEST_ID + "/resume/"  + TEST_NO).request()
                .header("Authorization", adminToken).post(Entity.json(invalidResumeConfig));

        assertEquals(Response.Status.BAD_REQUEST.getStatusCode(), response.getStatus());
    }

    @Test
    public void shouldStopIfTheLearningIsActive() {
        Response response = target("/learner/" + PROJECT_TEST_ID + "/stop").request().header("Authorization", adminToken).get();

        assertEquals(Response.Status.OK.getStatusCode(), response.getStatus());
        String expectedJSON = "{\"active\":true,\"currentQueries\":[],\"learnerPhase\":\"LEARNING\","
                + "\"project\":" + PROJECT_TEST_ID + ",\"statistics\":{\"duration\":{\"learner\":0,"
                + "\"eqOracle\":0,\"total\":0},\"eqsUsed\":0,\"mqsUsed\":{\"learner\":0,\"eqOracle\":0,"
                + "\"total\":0},\"startDate\":\"1970-01-01T00:00:00.000+00:00\",\"symbolsUsed\":{\"learner\":0,"
                + "\"eqOracle\":0,\"total\":0}},\"stepNo\":0,\"testNo\":" + TEST_NO + "}";
        assertEquals(expectedJSON, response.readEntity(String.class));
        verify(learner).stop(admin);
    }

    @Test
    public void shouldNotStopIfTheLearningIsNotActive() {
        given(learner.isActive(PROJECT_TEST_ID)).willReturn(false);
        given(learner.getResult(PROJECT_TEST_ID)).willReturn(null);
        LearnerStatus learnerStatus = new LearnerStatus();
        given(learner.getStatus(PROJECT_TEST_ID)).willReturn(learnerStatus);

        Response response = target("/learner/" + PROJECT_TEST_ID + "/stop").request().header("Authorization", adminToken).get();

        assertEquals(Response.Status.OK.getStatusCode(), response.getStatus());
        String expectedJSON = "{\"active\":false}";
        assertEquals(expectedJSON, response.readEntity(String.class));
        verify(learner, never()).stop(admin);
    }

    @Test
    public void shouldReturnTheRightActiveInformationIfALearningProcessIsActive() {
        Response response = target("/learner/" + PROJECT_TEST_ID + "/active").request().header("Authorization", adminToken).get();

        assertEquals(Response.Status.OK.getStatusCode(), response.getStatus());
        String expectedJSON = "{\"active\":true,\"currentQueries\":[],\"learnerPhase\":\"LEARNING\","
                + "\"project\":" + PROJECT_TEST_ID + ",\"statistics\":{\"duration\":{\"learner\":0,"
                + "\"eqOracle\":0,\"total\":0},\"eqsUsed\":0,\"mqsUsed\":{\"learner\":0,\"eqOracle\":0,"
                + "\"total\":0},\"startDate\":\"1970-01-01T00:00:00.000+00:00\",\"symbolsUsed\":{\"learner\":0,"
                + "\"eqOracle\":0,\"total\":0}},\"stepNo\":0,\"testNo\":" + TEST_NO + "}";
        assertEquals(expectedJSON, response.readEntity(String.class));
    }

    @Test
    public void shouldReturnTheRightActiveInformationIfNoLearningProcessIsActive() {
        LearnerStatus learnerStatus = new LearnerStatus();
        given(learner.getStatus(PROJECT_TEST_ID)).willReturn(learnerStatus);

        Response response = target("/learner/" + PROJECT_TEST_ID + "/active").request().header("Authorization", adminToken).get();

        assertEquals(Response.Status.OK.getStatusCode(), response.getStatus());
        String expectedJSON = "{\"active\":false}";
        assertEquals(expectedJSON, response.readEntity(String.class));
    }

    @Test
    public void shouldReturnAnActiveStatus() {
        LearnerResult realResult = new LearnerResult();
        given(learner.getResult(PROJECT_TEST_ID)).willReturn(realResult);

        Response response = target("/learner/" + PROJECT_TEST_ID + "/status").request().header("Authorization", adminToken).get();

        assertEquals(Response.Status.OK.getStatusCode(), response.getStatus());
    }

    @Test
    public void shouldReturn404IfNoStatusIsAvailable() {
        given(learner.getResult(PROJECT_TEST_ID)).willReturn(null);

        Response response = target("/learner/" + PROJECT_TEST_ID + "/status").request().header("Authorization", adminToken).get();

        assertEquals(Response.Status.NOT_FOUND.getStatusCode(), response.getStatus());
    }

    @Test
    public void shouldReturn404IfStatusWasDeletedInTheDB() throws NotFoundException {
        given(learnerResultDAO.get(admin, PROJECT_TEST_ID, TEST_NO, false)).willThrow(NotFoundException.class);

        Response response = target("/learner/" + PROJECT_TEST_ID + "/status").request().header("Authorization", adminToken).get();

        assertEquals(Response.Status.NOT_FOUND.getStatusCode(), response.getStatus());
    }

    @Test
    public void shouldReadTheCorrectOutput() {
        String json = "{\"symbols\":{\"resetSymbol\":" + RESET_SYMBOL_TEST_ID + ",\"symbols\":[1,2]},\"driverConfig\":" + driverConfig + "}";

        Response response = target("/learner/" + PROJECT_TEST_ID + "/outputs")
                                .request()
                                .header("Authorization", adminToken)
                                .post(Entity.json(json));

        assertEquals(Response.Status.OK.getStatusCode(), response.getStatus());
    }

    @Test
    public void shouldCreateEmptyOutputForNoSymbols() throws NotFoundException {
        String json = "{\"symbols\":{\"resetSymbol\":" + RESET_SYMBOL_TEST_ID + ",\"symbols\":[]},\"driverConfig\":" + driverConfig + "}";

        Response response = target("/learner/" + PROJECT_TEST_ID + "/outputs").request().header("Authorization", adminToken)
                                .post(Entity.json(json));

        assertEquals(Response.Status.OK.getStatusCode(), response.getStatus());
        assertEquals("[]", response.readEntity(String.class));
    }

    @Test
    public void shouldReturn400IfCreatingAnOutputFailed() throws NotFoundException {
        given(learner.readOutputs(any(), any(), any(), any(), any(HtmlUnitDriverConfig.class)))
                .willThrow(LearnerException.class);

        String json = "{\"symbols\":{\"resetSymbol\":" + RESET_SYMBOL_TEST_ID + ",\"symbols\":[1,2]},\"driverConfig\":" + driverConfig +"}";

        Response response = target("/learner/" + PROJECT_TEST_ID + "/outputs").request().header("Authorization", adminToken)
                                .post(Entity.json(json));

        assertEquals(Response.Status.BAD_REQUEST.getStatusCode(), response.getStatus());
    }

    @Test
    public void shouldReturn404IfOutputShouldBeCreatedForANotExistingProject() throws NotFoundException {
        given(projectDAO.getByID(USER_TEST_ID, PROJECT_TEST_ID)).willThrow(NotFoundException.class);

        String json = "{\"symbols\": {\"resetSymbol\": " + RESET_SYMBOL_TEST_ID + ", \"symbols\": [1,2]}, \"driverConfig\": " + driverConfig + "}";
        Response response = target("/learner/" + PROJECT_TEST_ID + "/outputs").request().header("Authorization", adminToken)
                                .post(Entity.json(json));

        assertEquals(Response.Status.NOT_FOUND.getStatusCode(), response.getStatus());
        verify(learner, never()).readOutputs(any(User.class), any(Project.class), any(Symbol.class), anyList(),
                any(AbstractWebDriverConfig.class));
    }

    @Test
    public void shouldReturn404IfOutputShouldBeCreatedWithANotExistingResetSymbol() throws NotFoundException {
        given(symbolDAO.get(admin, PROJECT_TEST_ID, RESET_SYMBOL_TEST_ID))
                .willThrow(NotFoundException.class);

        String json = "{\"symbols\":{\"resetSymbol\":" + RESET_SYMBOL_TEST_ID + ",\"symbols\":[1,2]},\"driverConfig\":" + driverConfig +"}";

        Response response = target("/learner/" + PROJECT_TEST_ID + "/outputs").request().header("Authorization", adminToken)
                                .post(Entity.json(json));

        assertEquals(Response.Status.NOT_FOUND.getStatusCode(), response.getStatus());
        verify(learner, never()).readOutputs(any(User.class), any(Project.class), any(Symbol.class), any(),
                any(AbstractWebDriverConfig.class));
    }

    @Test
    public void shouldReturn404IfOutputShouldBeCreatedWithoutAnyResetSymbol() throws NotFoundException {
        String json = "{\"symbols\":{\"symbols\":[1,2]},\"driverConfig\":" + driverConfig +"}";

        Response response = target("/learner/" + PROJECT_TEST_ID + "/outputs").request().header("Authorization", adminToken)
                                .post(Entity.json(json));

        assertEquals(Response.Status.NOT_FOUND.getStatusCode(), response.getStatus());
        verify(learner, never()).readOutputs(any(User.class), any(Project.class), any(Symbol.class), anyList(),
                any(AbstractWebDriverConfig.class));
    }

    @Test
    public void shouldReturn404IfOutputShouldBeCreatedWithForNotExistingSymbols() throws NotFoundException {
        given(symbolDAO.get(admin, PROJECT_TEST_ID, 2L)).willThrow(NotFoundException.class);

        String json = "{\"symbols\":{\"resetSymbol\":" + RESET_SYMBOL_TEST_ID + ",\"symbols\":[1,2]},\"driverConfig\":" + driverConfig +"}";

        Response response = target("/learner/" + PROJECT_TEST_ID + "/outputs").request().header("Authorization", adminToken)
                                .post(Entity.json(json));

        assertEquals(Response.Status.NOT_FOUND.getStatusCode(), response.getStatus());
        verify(learner, never()).readOutputs(any(User.class), any(Project.class), any(Symbol.class), anyList(),
                any(AbstractWebDriverConfig.class));
    }

    private void prepareResumeTest() throws NotFoundException {
        Project project = mock(Project.class);
        given(project.getId()).willReturn(PROJECT_TEST_ID);

        CompactMealyMachineProxy hypothesis = mock(CompactMealyMachineProxy.class);
        given(hypothesis.createAlphabet()).willReturn(new SimpleAlphabet<>());

        LearnerResultStep step = mock(LearnerResultStep.class);
        given(step.getHypothesis()).willReturn(hypothesis);

        Statistics statistics = mock(Statistics.class);

        LearnerResult result = mock(LearnerResult.class);
        given(result.getTestNo()).willReturn(TEST_NO);
        given(result.getProjectId()).willReturn(PROJECT_TEST_ID);
        given(result.getSteps()).willReturn(Collections.singletonList(step));
        given(result.getStatistics()).willReturn(statistics);

        given(projectDAO.getByID(USER_TEST_ID, PROJECT_TEST_ID)).willReturn(project);
        given(learnerResultDAO.get(admin, PROJECT_TEST_ID, TEST_NO, true)).willReturn(result);

        doNothing().when(learnerResultStepRepository).delete(step);
        doNothing().when(learnerResultStepRepository).flush();
        given(learnerResultRepository.saveAndFlush(result)).willReturn(result);
    }

}
