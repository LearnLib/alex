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

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import de.learnlib.alex.ALEXTestApplication;
import de.learnlib.alex.auth.entities.User;
import de.learnlib.alex.common.exceptions.NotFoundException;
import de.learnlib.alex.data.entities.Project;
import de.learnlib.alex.learning.dao.LearnerResultDAO;
import de.learnlib.alex.learning.entities.LearnerResult;
import de.learnlib.alex.learning.services.Learner;
import de.learnlib.alex.learning.services.TestGenerator;
import net.automatalib.words.Alphabet;
import net.automatalib.words.impl.SimpleAlphabet;
import org.glassfish.hk2.utilities.binding.AbstractBinder;
import org.glassfish.jersey.test.JerseyTest;
import org.junit.Before;
import org.junit.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import javax.validation.ValidationException;
import javax.ws.rs.core.Application;
import javax.ws.rs.core.Response;
import java.util.Arrays;
import java.util.Collections;
import java.util.LinkedList;
import java.util.List;

import static org.junit.Assert.assertEquals;
import static org.mockito.ArgumentMatchers.anyBoolean;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.willThrow;
import static org.mockito.Mockito.verify;

public class LearnerResultResourceTest extends JerseyTest {

    private static final long PROJECT_ID = 1L;
    private static final long RESULT_ID = 10L;
    private static final int TEST_RESULT_AMOUNT = 10;
    private static final List<Long> TEST_NOS = Arrays.asList(1L, 2L, 42L);

    @Mock
    private LearnerResultDAO learnerResultDAO;

    @Mock
    private Learner learner;

    @Mock
    private TestGenerator testGenerator;

    private User admin;
    private String adminToken;

    private Project project;

    @Override
    protected Application configure() {
        MockitoAnnotations.initMocks(this);

        ALEXTestApplication testApplication = new ALEXTestApplication(LearnerResultResource.class);
        admin = testApplication.getAdmin();
        adminToken = testApplication.getAdminToken();
        testApplication.register(new AbstractBinder() {
            @Override
            protected void configure() {
                bind(learnerResultDAO).to(LearnerResultDAO.class);
                bind(learner).to(Learner.class);
                bind(testGenerator).to(TestGenerator.class);
            }
        });
        return testApplication;
    }

    @Before
    public void setUp() throws Exception {
        super.setUp();

        project = new Project();
        project.setId(PROJECT_ID);
    }

    @Test
    public void shouldReturnAllResultsOfOneProject() throws NotFoundException, JsonProcessingException {
        List<LearnerResult> results = createTestLearnResults();
        given(learnerResultDAO.getAll(eq(admin), eq(PROJECT_ID), anyBoolean())).willReturn(results);

        Response response = target("/projects/" + PROJECT_ID + "/results").request()
                .header("Authorization", adminToken).get();
        assertEquals(Response.Status.OK.getStatusCode(), response.getStatus());
        assertEquals(String.valueOf(TEST_RESULT_AMOUNT), response.getHeaderString("X-Total-Count"));

        ObjectMapper mapper = new ObjectMapper();
        String expectedJSON = mapper.writeValueAsString(results);
        assertEquals(expectedJSON, response.readEntity(String.class));
    }

    @Test
    public void ensureThatGettingAllResultsOfOneProjectHandlesAValidEmbedParameter() throws NotFoundException {
        List<LearnerResult> results = createTestLearnResults();
        given(learnerResultDAO.getAll(admin, PROJECT_ID, true)).willReturn(results);

        Response response = target("/projects/" + PROJECT_ID + "/results").queryParam("embed", "STEPS").request()
                .header("Authorization", adminToken).get();

        assertEquals(Response.Status.OK.getStatusCode(), response.getStatus());
        assertEquals(String.valueOf(TEST_RESULT_AMOUNT), response.getHeaderString("X-Total-Count"));
    }

    @Test
    public void ensureThatGettingAllResultsOfOneProjectHandlesAnInvalidEmbedParameter() throws NotFoundException {
        List<LearnerResult> results = createTestLearnResults();
        given(learnerResultDAO.getAll(eq(admin), eq(PROJECT_ID), anyBoolean())).willReturn(results);

        Response response = target("/projects/" + PROJECT_ID + "/results").queryParam("embed", "INVALID").request()
                .header("Authorization", adminToken).get();

        assertEquals(Response.Status.BAD_REQUEST.getStatusCode(), response.getStatus());
    }

    @Test
    public void ensureThatGettingAllResultsReturns404IfTheProjectIdIsInvalid() throws NotFoundException {
        given(learnerResultDAO.getAll(eq(admin), eq(PROJECT_ID), anyBoolean()))
                .willThrow(NotFoundException.class);

        Response response = target("/projects/" + PROJECT_ID + "/results").request()
                .header("Authorization", adminToken).get();

        assertEquals(Response.Status.NOT_FOUND.getStatusCode(), response.getStatus());
    }

    @Test
    public void shouldGetOneTestResult() throws NotFoundException, JsonProcessingException {
        // given
        ObjectMapper objectMapper = new ObjectMapper();
        Alphabet<String> sigma = new SimpleAlphabet<>();
        sigma.add("0");
        sigma.add("1");

        LearnerResult learnerResult = new LearnerResult();
        learnerResult.setProject(project);
        learnerResult.setTestNo(RESULT_ID);

        given(learnerResultDAO.get(admin, PROJECT_ID, RESULT_ID, false)).willReturn(learnerResult);

        // when
        Response response = target("/projects/" + PROJECT_ID + "/results/" + RESULT_ID).request()
                .header("Authorization", adminToken).get();

        // then
        assertEquals(Response.Status.OK.getStatusCode(), response.getStatus());
        assertEquals(objectMapper.writeValueAsString(learnerResult), response.readEntity(String.class));
    }

    @Test
    public void shouldReturn404IfOneTestNoDoesNotExists() throws NotFoundException, JsonProcessingException {
        given(learnerResultDAO.getAll(eq(admin), eq(PROJECT_ID), eq(TEST_NOS), anyBoolean()))
                .willThrow(NotFoundException.class);

        Response response = target("/projects/" + PROJECT_ID + "/results/1,2,42").request()
                .header("Authorization", adminToken).get();

        assertEquals(Response.Status.NOT_FOUND.getStatusCode(), response.getStatus());
    }

    @Test
    public void shouldGetManyResults() throws NotFoundException, JsonProcessingException {
        // given
        ObjectMapper objectMapper = new ObjectMapper();
        List<LearnerResult> results = createTestLearnResults();
        given(learnerResultDAO.getAll(eq(admin), eq(PROJECT_ID), eq(TEST_NOS), anyBoolean()))
                .willReturn(results);

        // when
        Response response = target("/projects/" + PROJECT_ID + "/results/1,2,42").request()
                .header("Authorization", adminToken).get();

        // then
        assertEquals(Response.Status.OK.getStatusCode(), response.getStatus());
        assertEquals(String.valueOf(TEST_RESULT_AMOUNT), response.getHeaderString("X-Total-Count"));
        assertEquals(objectMapper.writeValueAsString(results), response.readEntity(String.class));
    }


    @Test
    public void ensureThatGettingSpecificResultsOfOneProjectHandlesAValidEmbedParameter() throws NotFoundException {
        List<LearnerResult> results = createTestLearnResults();
        given(learnerResultDAO.getAll(admin, PROJECT_ID, TEST_NOS, true)).willReturn(results);

        Response response = target("/projects/" + PROJECT_ID + "/results/1,2,42").queryParam("embed", "STEPS").request()
                .header("Authorization", adminToken).get();

        assertEquals(Response.Status.OK.getStatusCode(), response.getStatus());
        assertEquals(String.valueOf(TEST_RESULT_AMOUNT), response.getHeaderString("X-Total-Count"));
    }

    @Test
    public void ensureThatGettingSpecificResultsOfOneProjectHandlesAnInvalidEmbedParameter() throws NotFoundException {
        List<LearnerResult> results = createTestLearnResults();
        given(learnerResultDAO.getAll(eq(admin), eq(PROJECT_ID), eq(TEST_NOS), anyBoolean()))
                .willReturn(results);

        Response response = target("/projects/" + PROJECT_ID + "/results/1,2,42").queryParam("embed", "INVALID")
                .request().header("Authorization", adminToken).get();

        assertEquals(Response.Status.BAD_REQUEST.getStatusCode(), response.getStatus());
    }

    @Test
    public void shouldDeleteAOneTestRun() throws NotFoundException {
        Response response = target("/projects/" + PROJECT_ID + "/results/" + RESULT_ID).request()
                .header("Authorization", adminToken).delete();
        assertEquals(Response.Status.NO_CONTENT.getStatusCode(), response.getStatus());

        verify(learnerResultDAO).delete(learner, PROJECT_ID, Collections.singletonList(RESULT_ID));
    }

    @Test
    public void shouldDeleteMultipleLearnResults() throws NotFoundException {
        Response response = target("/projects/" + PROJECT_ID + "/results/" + RESULT_ID + "," + (RESULT_ID + 1))
                .request().header("Authorization", adminToken).delete();
        assertEquals(Response.Status.NO_CONTENT.getStatusCode(), response.getStatus());

        verify(learnerResultDAO).delete(learner, PROJECT_ID, Arrays.asList(RESULT_ID, RESULT_ID + 1));
    }

    @Test
    public void shouldNotCrashIfNoTestNoToDeleteIsSpecified() {
        Response response = target("/projects/" + PROJECT_ID + "/results/").request()
                .header("Authorization", adminToken).delete();
        assertEquals(Response.Status.METHOD_NOT_ALLOWED.getStatusCode(), response.getStatus());
    }

    @Test
    public void shouldReturnAnErrorIfYouTryToDeleteAnInvalidTestNo() throws NotFoundException {
        willThrow(NotFoundException.class).given(learnerResultDAO)
                .delete(learner, PROJECT_ID, Arrays.asList(RESULT_ID, RESULT_ID + 1));

        Response response = target("/projects/" + PROJECT_ID + "/results/" + RESULT_ID + "," + (RESULT_ID + 1))
                .request().header("Authorization", adminToken).delete();

        assertEquals(Response.Status.NOT_FOUND.getStatusCode(), response.getStatus());
    }

    @Test
    public void shouldReturnAnErrorIfYouTryToDeleteAnActiveTestNo() throws NotFoundException {
        willThrow(ValidationException.class).given(learnerResultDAO)
                .delete(learner, PROJECT_ID, Arrays.asList(RESULT_ID, RESULT_ID + 1));

        Response response = target("/projects/" + PROJECT_ID + "/results/" + RESULT_ID + "," + (RESULT_ID + 1))
                .request().header("Authorization", adminToken).delete();

        assertEquals(Response.Status.BAD_REQUEST.getStatusCode(), response.getStatus());
    }

    @Test
    public void ensureThatNoTestNumberToDeleteIsHandledProperly() throws NotFoundException {
        willThrow(NotFoundException.class).given(learnerResultDAO)
                .delete(learner, PROJECT_ID, Arrays.asList(RESULT_ID, RESULT_ID + 1));

        Response response = target("/projects/" + PROJECT_ID + "/results/,,,,")
                .request().header("Authorization", adminToken).delete();

        assertEquals(Response.Status.NOT_FOUND.getStatusCode(), response.getStatus());
    }

    @Test
    public void ensureThatANotValidTestNumberStringOnDeletionIsHandledProperly() throws NotFoundException {
        willThrow(NotFoundException.class).given(learnerResultDAO)
                .delete(learner, PROJECT_ID, Arrays.asList(RESULT_ID, RESULT_ID + 1));

        Response response = target("/projects/" + PROJECT_ID + "/results/foobar")
                .request().header("Authorization", adminToken).delete();

        assertEquals(Response.Status.NOT_FOUND.getStatusCode(), response.getStatus());
    }

    private List<LearnerResult> createTestLearnResults() {
        List<LearnerResult> results = new LinkedList<>();
        for (long i = 0; i < TEST_RESULT_AMOUNT; i++) {
            Alphabet<String> sigma = new SimpleAlphabet<>();
            sigma.add("0");
            sigma.add("1");

            LearnerResult learnerResult = new LearnerResult();
            learnerResult.setProject(project);
            learnerResult.setTestNo(i);

            results.add(learnerResult);
        }
        return results;
    }

}
