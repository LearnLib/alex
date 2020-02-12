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

import com.jayway.jsonpath.JsonPath;
import de.learnlib.alex.data.entities.Project;
import de.learnlib.alex.integrationtests.resources.api.LtsFormulaApi;
import de.learnlib.alex.integrationtests.resources.api.ProjectApi;
import de.learnlib.alex.integrationtests.resources.api.UserApi;
import de.learnlib.alex.modelchecking.entities.LtsFormula;
import org.junit.Before;
import org.junit.Test;

import javax.ws.rs.core.GenericType;
import javax.ws.rs.core.Response;
import java.util.Arrays;
import java.util.List;

import static org.hibernate.validator.internal.util.Contracts.assertNotNull;
import static org.junit.Assert.assertEquals;

public class LtsFormulaResourceIT extends AbstractResourceIT {

    private String jwtUser1;

    private String jwtUser2;

    private Long projectId1;

    private Long projectId2;

    private LtsFormulaApi api;

    @Before
    public void before() {
        this.api = new LtsFormulaApi(client, port);

        final UserApi userApi = new UserApi(client, port);
        final ProjectApi projectApi = new ProjectApi(client, port);

        userApi.create("{\"email\":\"test1@test.de\",\"username\":\"test1\",\"password\":\"test\"}");
        userApi.create("{\"email\":\"test2@test.de\",\"username\":\"test2\",\"password\":\"test\"}");
        jwtUser1 = userApi.login("test1@test.de", "test");
        jwtUser2 = userApi.login("test2@test.de", "test");

        projectId1 = projectApi.create("{\"name\":\"test\",\"url\":\"http://localhost:8080\"}", jwtUser1)
                .readEntity(Project.class)
                .getId();

        projectId2 = projectApi.create("{\"name\":\"test\",\"url\":\"http://localhost:8080\"}", jwtUser2)
                .readEntity(Project.class)
                .getId();
    }

    @Test
    public void shouldCreateAFormula() throws Exception {
        final LtsFormula formula = new LtsFormula();
        formula.setName("test");
        formula.setFormula("<>true");

        final Response res = api.create(projectId1, formula, jwtUser1);
        assertEquals(Response.Status.CREATED.getStatusCode(), res.getStatus());

        final String json = res.readEntity(String.class);
        JsonPath.read(json, "$.id");

        assertEquals(1, getNumberOfFormulas(projectId1, jwtUser1));
    }

    @Test
    public void shouldCreateAFormulaWithoutName() throws Exception {
        final LtsFormula formula = new LtsFormula();
        formula.setFormula("<>true");

        final Response res = api.create(projectId1, formula, jwtUser1);
        assertEquals(Response.Status.CREATED.getStatusCode(), res.getStatus());

        final LtsFormula createdFormula = res.readEntity(LtsFormula.class);
        assertNotNull(createdFormula.getId());
        assertEquals(formula.getFormula(), createdFormula.getFormula());
        assertEquals(formula.getName(), createdFormula.getName());

        assertEquals(1, getNumberOfFormulas(projectId1, jwtUser1));
    }

    @Test
    public void shouldFailToCreateFormulaWithoutFormula() throws Exception {
        final LtsFormula formula = new LtsFormula();
        formula.setName("test");

        final Response res = api.create(projectId1, formula, jwtUser1);
        assertEquals(Response.Status.BAD_REQUEST.getStatusCode(), res.getStatus());
        assertEquals(0, getNumberOfFormulas(projectId1, jwtUser1));
    }

    @Test
    public void shouldFailToCreateFormulaWithInvalidFormula() throws Exception {
        final LtsFormula formula = new LtsFormula();
        formula.setName("test");
        formula.setFormula("invalid");

        final Response res = api.create(projectId1, formula, jwtUser1);
        assertEquals(Response.Status.BAD_REQUEST.getStatusCode(), res.getStatus());
        assertEquals(0, getNumberOfFormulas(projectId1, jwtUser1));
    }

    @Test
    public void shouldNotCreateFormulaInAnotherUsersProject() throws Exception {
        final LtsFormula formula = new LtsFormula();
        formula.setName("test");
        formula.setFormula("<>true");

        final Response res = api.create(projectId2, formula, jwtUser1);
        assertEquals(Response.Status.UNAUTHORIZED.getStatusCode(), res.getStatus());
        assertEquals(0, getNumberOfFormulas(projectId1, jwtUser1));
        assertEquals(0, getNumberOfFormulas(projectId2, jwtUser2));
    }

    @Test
    public void shouldDeleteFormula() throws Exception {
        final LtsFormula formula = createFormula(projectId1, "test", "<>true", jwtUser1)
                .readEntity(LtsFormula.class);

        final Response res = api.delete(projectId1, formula.getId(), jwtUser1);
        assertEquals(Response.Status.NO_CONTENT.getStatusCode(), res.getStatus());
        assertEquals(0, getNumberOfFormulas(projectId1, jwtUser1));
    }

    @Test
    public void shouldFailToDeleteNonExistingFormula() {
        final Response res = api.delete(projectId1, -1L, jwtUser1);
        assertEquals(Response.Status.NOT_FOUND.getStatusCode(), res.getStatus());
    }

    @Test
    public void shouldFailToDeleteFormulaOfAnotherUser() throws Exception {
        final LtsFormula formula = createFormula(projectId1, "test", "<>true", jwtUser1)
                .readEntity(LtsFormula.class);

        final Response res = api.delete(projectId2, formula.getId(), jwtUser2);
        assertEquals(Response.Status.UNAUTHORIZED.getStatusCode(), res.getStatus());
        assertEquals(1, getNumberOfFormulas(projectId1, jwtUser1));
    }

    @Test
    public void shouldDeleteMultipleFormulas() throws Exception {
        final List<Long> ids = Arrays.asList(
                createFormula(projectId1, "test", "<> true", jwtUser1).readEntity(LtsFormula.class).getId(),
                createFormula(projectId1, "test", "<> true", jwtUser1).readEntity(LtsFormula.class).getId()
        );
        final Response res = api.delete(projectId1, ids, jwtUser1);
        assertEquals(Response.Status.NO_CONTENT.getStatusCode(), res.getStatus());
        assertEquals(0, getNumberOfFormulas(projectId1, jwtUser1));
    }

    @Test
    public void shouldFailToDeleteMultipleFormulasIfOneDoesNotExist() throws Exception {
        final List<Long> ids = Arrays.asList(
                createFormula(projectId1, "test", "<> true", jwtUser1).readEntity(LtsFormula.class).getId(),
                createFormula(projectId1, "test", "<> true", jwtUser1).readEntity(LtsFormula.class).getId()
                -1
        );
        final Response res = api.delete(projectId1, ids, jwtUser1);
        assertEquals(Response.Status.NOT_FOUND.getStatusCode(), res.getStatus());
        assertEquals(2, getNumberOfFormulas(projectId1, jwtUser1));
    }

    @Test
    public void shouldUpdateAFormula() throws Exception {
        final LtsFormula formula = createFormula(projectId1, "test", "<> true", jwtUser1)
                .readEntity(LtsFormula.class);

        formula.setName("newName");
        formula.setFormula("<>false");

        final Response res = api.update(projectId1, formula.getId(), formula, jwtUser1);
        assertEquals(Response.Status.OK.getStatusCode(), res.getStatus());

        final LtsFormula updatedFormula = res.readEntity(LtsFormula.class);
        assertEquals(formula.getId(), updatedFormula.getId());
        assertEquals(formula.getName(), updatedFormula.getName());
        assertEquals(formula.getFormula(), updatedFormula.getFormula());

        assertEquals(1, getNumberOfFormulas(projectId1, jwtUser1));
    }

    @Test
    public void shouldFailToUpdateIfFormulaIsEmpty() {
        shouldFailToUpdate(projectId1, "test", "<>true", "newName", "", jwtUser1);
    }

    @Test
    public void shouldFailToUpdateIfFormulaIsInvalid() {
        shouldFailToUpdate(projectId1, "test", "<>true", "newName", "invalid", jwtUser1);
    }

    private void shouldFailToUpdate(Long projectId, String name, String formula, String newName, String newFormula, String jwt) {
        final LtsFormula ltlFormula = createFormula(projectId1, name, formula, jwtUser1)
                .readEntity(LtsFormula.class);

        ltlFormula.setName(newName);
        ltlFormula.setFormula(newFormula);

        final Response res = api.update(projectId, ltlFormula.getId(), ltlFormula, jwt);
        assertEquals(Response.Status.BAD_REQUEST.getStatusCode(), res.getStatus());

        final LtsFormula f = api.getAll(projectId, jwt).readEntity(new GenericType<List<LtsFormula>>(){}).stream()
                .filter(l -> l.getId().equals(ltlFormula.getId()))
                .findFirst()
                .orElse(null);

        assertNotNull(f);
        assertEquals(name, f.getName());
        assertEquals(formula, f.getFormula());
    }

    private Response createFormula(Long projectId, String name, String formula, String jwt) {
        final LtsFormula f = new LtsFormula();
        f.setName(name);
        f.setFormula(formula);
        return api.create(projectId, f, jwt);
    }

    private int getNumberOfFormulas(Long projectId1, String jwt) throws Exception {
        final Response res = api.getAll(projectId1, jwt);
        return objectMapper.readTree(res.readEntity(String.class)).size();
    }
}
