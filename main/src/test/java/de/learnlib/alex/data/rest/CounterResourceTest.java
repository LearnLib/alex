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

package de.learnlib.alex.data.rest;

import de.learnlib.alex.ALEXTestApplication;
import de.learnlib.alex.auth.entities.User;
import de.learnlib.alex.common.exceptions.NotFoundException;
import de.learnlib.alex.data.dao.CounterDAO;
import de.learnlib.alex.data.entities.Counter;
import de.learnlib.alex.data.entities.Project;
import org.glassfish.hk2.utilities.binding.AbstractBinder;
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

    private static final Long USER_TEST_ID = 1L;
    private static final long PROJECT_TEST_ID = 10;
    private static final String  COUNTER_NAME = "Counter";
    private static final Integer COUNTER_VALUE = 42;

    @Mock
    private CounterDAO counterDAO;

    @Mock
    private Project project;

    private User admin;
    private String adminToken;

    private Counter[] counters;

    @Override
    protected Application configure() {
        MockitoAnnotations.initMocks(this);

        ALEXTestApplication testApplication = new ALEXTestApplication(CounterResource.class);
        admin = testApplication.getAdmin();
        adminToken = testApplication.getAdminToken();
        testApplication.register(new AbstractBinder() {
            @Override
            protected void configure() {
                bind(counterDAO).to(CounterDAO.class);
            }
        });
        return testApplication;
    }

    @Before
    @Override
    public void setUp() throws Exception {
        super.setUp();

        admin.setId(USER_TEST_ID);
        given(project.getId()).willReturn(PROJECT_TEST_ID);

        counters = new Counter[2];
        counters[0] = new Counter();
        counters[0].setUser(admin);
        counters[0].setProject(project);
        counters[0].setName(COUNTER_NAME + " 1");
        counters[0].setValue(COUNTER_VALUE);
        counters[1] = new Counter();
        counters[1].setProject(project);
        counters[1].setUser(admin);
        counters[1].setName(COUNTER_NAME + " 2");
        counters[1].setValue(COUNTER_VALUE);
    }

    @Test
    public void shouldGetAllCounters() throws NotFoundException {
        given(counterDAO.getAll(USER_TEST_ID, PROJECT_TEST_ID)).willReturn(Arrays.asList(counters));

        Response response = target("/projects/" + PROJECT_TEST_ID + "/counters").request()
                                .header("Authorization", adminToken).get();
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

        Response response = target("/projects/" + PROJECT_TEST_ID + "/counters").request()
                                .header("Authorization", adminToken).get();

        assertEquals(Response.Status.NOT_FOUND.getStatusCode(), response.getStatus());
    }

    @Test
    public void shouldDeleteAValidCounter() throws NotFoundException {
        Response response = target("/projects/" + PROJECT_TEST_ID + "/counters/" + COUNTER_NAME).request()
                                .header("Authorization", adminToken).delete();

        assertEquals(Response.Status.NO_CONTENT.getStatusCode(), response.getStatus());
        verify(counterDAO).delete(USER_TEST_ID, PROJECT_TEST_ID, COUNTER_NAME);
    }

    @Test
    public void shouldReturn404WhenDeleteAnInvalidCounter() throws NotFoundException {
        willThrow(NotFoundException.class).given(counterDAO).delete(USER_TEST_ID, PROJECT_TEST_ID, COUNTER_NAME);

        Response response = target("/projects/" + PROJECT_TEST_ID + "/counters/" + COUNTER_NAME).request()
                                .header("Authorization", adminToken).delete();

        assertEquals(Response.Status.NOT_FOUND.getStatusCode(), response.getStatus());
        verify(counterDAO).delete(USER_TEST_ID, PROJECT_TEST_ID, COUNTER_NAME);
    }

    @Test
    public void shouldDeleteValidCounters() throws NotFoundException {
        String path = "/projects/" + PROJECT_TEST_ID + "/counters/batch/" + COUNTER_NAME + "," + COUNTER_NAME + "2";
        Response response = target(path).request().header("Authorization", adminToken).delete();

        assertEquals(Response.Status.NO_CONTENT.getStatusCode(), response.getStatus());
        verify(counterDAO).delete(USER_TEST_ID, PROJECT_TEST_ID, COUNTER_NAME, COUNTER_NAME + "2");
    }

    @Test
    public void shouldReturn404WhenDeleteInvalidCounters() throws NotFoundException {
        String path = "/projects/" + PROJECT_TEST_ID + "/counters/batch/" + COUNTER_NAME + "," + COUNTER_NAME + "2";
        willThrow(NotFoundException.class).given(counterDAO).delete(USER_TEST_ID, PROJECT_TEST_ID,
                                                                    COUNTER_NAME, COUNTER_NAME + "2");

        Response response = target(path).request().header("Authorization", adminToken).delete();

        assertEquals(Response.Status.NOT_FOUND.getStatusCode(), response.getStatus());
        verify(counterDAO).delete(USER_TEST_ID, PROJECT_TEST_ID, COUNTER_NAME, COUNTER_NAME + "2");
    }

}
