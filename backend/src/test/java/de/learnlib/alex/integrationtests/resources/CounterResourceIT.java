/*
 * Copyright 2015 - 2020 TU Dortmund
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

package de.learnlib.alex.integrationtests.resources;

import de.learnlib.alex.data.entities.Counter;
import de.learnlib.alex.data.entities.Project;
import de.learnlib.alex.integrationtests.SpringRestError;
import de.learnlib.alex.integrationtests.resources.api.CounterApi;
import de.learnlib.alex.integrationtests.resources.api.ProjectApi;
import de.learnlib.alex.integrationtests.resources.api.UserApi;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.springframework.http.HttpStatus;

import javax.ws.rs.NotFoundException;
import javax.ws.rs.core.GenericType;
import javax.ws.rs.core.Response;
import java.util.Arrays;
import java.util.List;

import static org.junit.Assert.assertEquals;

public class CounterResourceIT extends AbstractResourceIT {

    private String jwtUser1;
    private String jwtUser2;

    private Project project1;
    private Project project2;

    private UserApi userApi;
    private ProjectApi projectApi;
    private CounterApi counterApi;

    @Before
    public void pre() {
        userApi = new UserApi(client, port);
        projectApi = new ProjectApi(client, port);
        counterApi = new CounterApi(client, port);

        userApi.create("{\"email\":\"test1@test.de\",\"username\":\"test1\",\"password\":\"test\"}");
        userApi.create("{\"email\":\"test2@test.de\",\"username\":\"test2\",\"password\":\"test\"}");

        jwtUser1 = userApi.login("test1@test.de", "test");
        jwtUser2 = userApi.login("test2@test.de", "test");

        project1 = projectApi.create("{\"name\":\"test\",\"url\":\"http://localhost:8080\"}", jwtUser1)
                .readEntity(Project.class);

        project2 = projectApi.create("{\"name\":\"test\",\"url\":\"http://localhost:8080\"}", jwtUser2)
                .readEntity(Project.class);
    }

    @Test
    public void shouldCreateACounter() {
        final Counter counter = createCounter("counter", project1, 1);
        final Response res1 = counterApi.create(project1.getId(), counter, jwtUser1);

        assertEquals(HttpStatus.CREATED.value(), res1.getStatus());
        final Counter createdCounter = res1.readEntity(Counter.class);

        assertCounter(createdCounter, "counter", 1);
        assertEquals(1, getNumberOfCounters(project1.getId(), jwtUser1));
    }

    @Test
    public void shouldNotCreateTheSameCounterTwice() {
        final Counter counter1 = createCounter("counter", project1, 1);
        counterApi.create(project1.getId(), counter1, jwtUser1);

        final Counter counter2 = createCounter("counter", project1, 1);
        final Response res1 = counterApi.create(project1.getId(), counter2, jwtUser1);

        assertEquals(HttpStatus.BAD_REQUEST.value(), res1.getStatus());
        assertEquals(1, getNumberOfCounters(project1.getId(), jwtUser1));
    }

    @Test
    public void shouldNotCreateCounterIfProjectCannotBeFound() {
        final Counter counter = createCounter("counter", new Project(-1L), 1);
        final Response res1 = counterApi.create(-1L, counter, jwtUser1);

        Assert.assertEquals(Response.Status.NOT_FOUND.getStatusCode(), res1.getStatus());
        Assert.assertEquals(0, getNumberOfCounters(project1.getId(), jwtUser1));
    }

    @Test
    public void shouldNotCreateACounterInAnotherUsersProject() {
        final Counter counter = createCounter("counter1", project2, 1);
        final Response res1 = counterApi.create(project2.getId(), counter, jwtUser1);

        assertEquals(HttpStatus.UNAUTHORIZED.value(), res1.getStatus());

        final Response res2 = counterApi.getAll(project1.getId(), jwtUser1);
        assertEquals(0, res2.readEntity(new GenericType<List<Counter>>() {
        }).size());

        final Response res3 = counterApi.getAll(project2.getId(), jwtUser2);
        assertEquals(0, res3.readEntity(new GenericType<List<Counter>>() {
        }).size());
    }

    @Test
    public void shouldGetAllCounters() {
        final Counter counter1 = createCounter("counter1", project1, 1);
        final Counter counter2 = createCounter("counter2", project1, 1);
        final Counter counter3 = createCounter("counter3", project1, 1);

        counterApi.create(project1.getId(), counter1, jwtUser1);
        counterApi.create(project1.getId(), counter2, jwtUser1);
        counterApi.create(project1.getId(), counter3, jwtUser1);

        final Response res = counterApi.getAll(project1.getId(), jwtUser1);

        assertEquals(HttpStatus.OK.value(), res.getStatus());
        assertEquals(3, getNumberOfCounters(project1.getId(), jwtUser1));
    }

    @Test
    public void shouldNotGetCountersOfAnotherUsersProject() {
        final Counter counter = createCounter("counter", project1, 1);
        counterApi.create(project2.getId(), counter, jwtUser2);

        final Response res = counterApi.getAll(project2.getId(), jwtUser1);
        assertEquals(HttpStatus.UNAUTHORIZED.value(), res.getStatus());
        res.readEntity(SpringRestError.class);
    }

    @Test
    public void shouldUpdateValueOfACounter() {
        Counter counter = createCounter("counter1", project1, 1);
        counter = counterApi.create(project1.getId(), counter, jwtUser1).readEntity(Counter.class);

        counter.setValue(5);

        final Response res1 = counterApi.update(project1.getId(), counter.getId(), counter, jwtUser1);
        assertEquals(HttpStatus.OK.value(), res1.getStatus());

        final Counter updatedCounter = res1.readEntity(Counter.class);
        assertCounter(updatedCounter, "counter1", 5);
    }

    @Test
    public void shouldNotUpdateNameOfACounter() {
        Counter counter = createCounter("counter1", project1, 1);
        counter = counterApi.create(project1.getId(), counter, jwtUser1).readEntity(Counter.class);

        counter.setName("updatedName");

        final Response res1 = counterApi.update(project1.getId(), counter.getId(), counter, jwtUser1);
        assertEquals(HttpStatus.OK.value(), res1.getStatus());

        counter = getCounterById(project1.getId(), counter.getId(), jwtUser1);
        assertCounter(counter, "counter1", 1);
    }

    @Test
    public void shouldNotUpdateAnotherUsersCounter() {
        Counter counter = createCounter("counter1", project1, 1);
        counter = counterApi.create(project1.getId(), counter, jwtUser1).readEntity(Counter.class);

        counter.setValue(5);

        final Response res1 = counterApi.update(project1.getId(), counter.getId(), counter, jwtUser2);
        assertEquals(HttpStatus.UNAUTHORIZED.value(), res1.getStatus());
        res1.readEntity(SpringRestError.class);

        counter = getCounterById(project1.getId(), counter.getId(), jwtUser1);
        assertCounter(counter, "counter1", 1);
    }

    @Test
    public void shouldDeleteCounter() {
        Counter counter1 = createCounter("counter1", project1, 1);
        counter1 = counterApi.create(project1.getId(), counter1, jwtUser1).readEntity(Counter.class);

        Counter counter2 = createCounter("counter2", project1, 1);
        counter2 = counterApi.create(project1.getId(), counter2, jwtUser1).readEntity(Counter.class);

        final Response res = counterApi.delete(project1.getId(), counter1, jwtUser1);
        assertEquals(HttpStatus.NO_CONTENT.value(), res.getStatus());
        assertEquals("", res.readEntity(String.class));
        assertEquals(1, getNumberOfCounters(project1.getId(), jwtUser1));
    }

    @Test
    public void shouldNotDeleteAnotherUsersCounter() {
        Counter counter = createCounter("counter1", project2, 1);
        counter = counterApi.create(project2.getId(), counter, jwtUser2).readEntity(Counter.class);

        final Response res = counterApi.delete(project2.getId(), counter, jwtUser1);
        assertEquals(HttpStatus.UNAUTHORIZED.value(), res.getStatus());
        res.readEntity(SpringRestError.class);
        assertEquals(1, getNumberOfCounters(project2.getId(), jwtUser2));
    }

    @Test
    public void shouldFailToDeleteCounterIfItDoesNotExist() {
        final Counter counter = new Counter();
        counter.setProject(project1);
        counter.setName("counter");
        counter.setId(-1L);

        final Response res = counterApi.delete(project1.getId(), counter, jwtUser1);
        assertEquals(HttpStatus.NOT_FOUND.value(), res.getStatus());
        res.readEntity(SpringRestError.class);
        assertEquals(0, getNumberOfCounters(project1.getId(), jwtUser1));
    }

    @Test
    public void shouldDeleteMultipleCountersAtOnce() {
        Counter counter1 = createCounter("counter1", project1, 1);
        counter1 = counterApi.create(project1.getId(), counter1, jwtUser1).readEntity(Counter.class);

        Counter counter2 = createCounter("counter2", project1, 1);
        counter2 = counterApi.create(project1.getId(), counter2, jwtUser1).readEntity(Counter.class);

        final Response res = counterApi.delete(project1.getId(), Arrays.asList(counter1, counter2), jwtUser1);
        assertEquals(HttpStatus.NO_CONTENT.value(), res.getStatus());
        assertEquals("", res.readEntity(String.class));
        assertEquals(0, getNumberOfCounters(project1.getId(), jwtUser1));
    }

    @Test
    public void shouldNotDeleteMultipleCountersIfOneDoesNotExist() {
        Counter counter1 = createCounter("counter1", project1, 1);
        counter1 = counterApi.create(project1.getId(), counter1, jwtUser1).readEntity(Counter.class);

        Counter counter2 = createCounter("counter2", project1, 1);
        counter2 = counterApi.create(project1.getId(), counter2, jwtUser1).readEntity(Counter.class);

        final Counter counter3 = createCounter("counter3", project1, 1);
        counter3.setId(-1L);

        final Response res = counterApi.delete(project1.getId(), Arrays.asList(counter1, counter2, counter3), jwtUser1);
        assertEquals(HttpStatus.NOT_FOUND.value(), res.getStatus());
        res.readEntity(SpringRestError.class);
        assertEquals(2, getNumberOfCounters(project1.getId(), jwtUser1));
    }

    private int getNumberOfCounters(Long projectId, String jwt) {
        return counterApi.getAll(projectId, jwt)
                .readEntity(new GenericType<List<Counter>>() {
                })
                .size();
    }

    private Counter getCounterById(Long projectId, Long counterId, String jwt) {
        return counterApi.getAll(projectId, jwt)
                .readEntity(new GenericType<List<Counter>>() {
                })
                .stream()
                .filter(c -> c.getId().equals(counterId))
                .findFirst()
                .orElseThrow(NotFoundException::new);
    }

    private Counter createCounter(String name, Project project, Integer value) {
        final Counter counter = new Counter();
        counter.setName(name);
        counter.setProject(project);
        counter.setValue(value);
        return counter;
    }

    private void assertCounter(Counter counter, String name, Integer value) {
        assertEquals(name, counter.getName());
        assertEquals(value, counter.getValue());
    }
}
