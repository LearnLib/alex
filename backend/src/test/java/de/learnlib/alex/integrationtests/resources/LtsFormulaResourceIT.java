/*
 * Copyright 2015 - 2021 TU Dortmund
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

import static org.hibernate.validator.internal.util.Contracts.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertEquals;

import com.jayway.jsonpath.JsonPath;
import de.learnlib.alex.data.entities.Project;
import de.learnlib.alex.integrationtests.resources.api.LtsFormulaApi;
import de.learnlib.alex.integrationtests.resources.api.LtsFormulaSuiteApi;
import de.learnlib.alex.integrationtests.resources.api.ProjectApi;
import de.learnlib.alex.integrationtests.resources.api.UserApi;
import de.learnlib.alex.modelchecking.entities.LtsFormula;
import de.learnlib.alex.modelchecking.entities.LtsFormulaSuite;
import java.util.Arrays;
import java.util.List;
import javax.ws.rs.core.GenericType;
import javax.ws.rs.core.Response;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;

public class LtsFormulaResourceIT extends AbstractResourceIT {

    private String jwtUser1;

    private String jwtUser2;

    private Long projectId1;

    private Long projectId2;

    private LtsFormulaApi formulaApi;
    private LtsFormulaSuiteApi formulaSuiteApi;

    private LtsFormulaSuite suite1;
    private LtsFormulaSuite suite2;

    @BeforeEach
    public void before() {
        this.formulaApi = new LtsFormulaApi(client, port);

        final UserApi userApi = new UserApi(client, port);
        final ProjectApi projectApi = new ProjectApi(client, port);
        formulaSuiteApi = new LtsFormulaSuiteApi(client, port);

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

        final LtsFormulaSuite suite = new LtsFormulaSuite();
        suite.setName("default");

        this.suite1 = formulaSuiteApi.create(projectId1, suite, jwtUser1)
                .readEntity(LtsFormulaSuite.class);

        this.suite2 = formulaSuiteApi.create(projectId2, suite, jwtUser2)
                .readEntity(LtsFormulaSuite.class);
    }

    @Test
    public void shouldCreateAFormula() throws Exception {
        final LtsFormula formula = new LtsFormula();
        formula.setName("test");
        formula.setFormula("<>true");

        final Response res = formulaApi.create(projectId1, suite1.getId(), formula, jwtUser1);
        assertEquals(Response.Status.CREATED.getStatusCode(), res.getStatus());

        final String json = res.readEntity(String.class);
        JsonPath.read(json, "$.id");

        assertEquals(1, getNumberOfFormulas(projectId1, suite1.getId(), jwtUser1));
    }

    @Test
    public void shouldCreateAFormulaWithoutName() throws Exception {
        final LtsFormula formula = new LtsFormula();
        formula.setFormula("<>true");

        final Response res = formulaApi.create(projectId1, suite1.getId(), formula, jwtUser1);
        assertEquals(Response.Status.CREATED.getStatusCode(), res.getStatus());

        final LtsFormula createdFormula = res.readEntity(LtsFormula.class);
        assertNotNull(createdFormula.getId());
        assertEquals(formula.getFormula(), createdFormula.getFormula());
        assertEquals(formula.getName(), createdFormula.getName());

        assertEquals(1, getNumberOfFormulas(projectId1, suite1.getId(), jwtUser1));
    }

    @Test
    public void shouldFailToCreateFormulaWithoutFormula() throws Exception {
        final LtsFormula formula = new LtsFormula();
        formula.setName("test");

        final Response res = formulaApi.create(projectId1, suite1.getId(), formula, jwtUser1);
        assertEquals(Response.Status.BAD_REQUEST.getStatusCode(), res.getStatus());
        assertEquals(0, getNumberOfFormulas(projectId1, suite1.getId(), jwtUser1));
    }

    @Test
    public void shouldFailToCreateFormulaWithInvalidFormula() throws Exception {
        final LtsFormula formula = new LtsFormula();
        formula.setName("test");
        formula.setFormula("invalid");

        final Response res = formulaApi.create(projectId1, suite1.getId(), formula, jwtUser1);
        assertEquals(Response.Status.BAD_REQUEST.getStatusCode(), res.getStatus());
        assertEquals(0, getNumberOfFormulas(projectId1, suite1.getId(), jwtUser1));
    }

    @Test
    public void shouldNotCreateFormulaInAnotherUsersProject() throws Exception {
        final LtsFormula formula = new LtsFormula();
        formula.setName("test");
        formula.setFormula("<>true");

        final Response res = formulaApi.create(projectId2, suite2.getId(), formula, jwtUser1);
        assertEquals(Response.Status.UNAUTHORIZED.getStatusCode(), res.getStatus());
        assertEquals(0, getNumberOfFormulas(projectId1, suite1.getId(), jwtUser1));
        assertEquals(0, getNumberOfFormulas(projectId2, suite2.getId(), jwtUser2));
    }

    @Test
    public void shouldDeleteFormula() throws Exception {
        final LtsFormula formula = createFormula(projectId1, suite1.getId(), "test", "<>true", jwtUser1);
        final Response res = formulaApi.delete(projectId1, suite1.getId(), formula.getId(), jwtUser1);
        assertEquals(Response.Status.NO_CONTENT.getStatusCode(), res.getStatus());
        assertEquals(0, getNumberOfFormulas(projectId1, suite1.getId(), jwtUser1));
    }

    @Test
    public void shouldFailToDeleteNonExistingFormula() {
        final Response res = formulaApi.delete(projectId1, suite1.getId(), -1L, jwtUser1);
        assertEquals(Response.Status.NOT_FOUND.getStatusCode(), res.getStatus());
    }

    @Test
    public void shouldFailToDeleteFormulaOfAnotherUser() throws Exception {
        final LtsFormula formula = createFormula(projectId1, suite1.getId(), "test", "<>true", jwtUser1);
        final Response res = formulaApi.delete(projectId2, suite1.getId(), formula.getId(), jwtUser2);
        assertEquals(Response.Status.UNAUTHORIZED.getStatusCode(), res.getStatus());
        assertEquals(1, getNumberOfFormulas(projectId1, suite1.getId(), jwtUser1));
    }

    @Test
    public void shouldDeleteMultipleFormulas() throws Exception {
        final List<Long> ids = Arrays.asList(
                createFormula(projectId1, suite1.getId(), "test", "<> true", jwtUser1).getId(),
                createFormula(projectId1, suite1.getId(), "test", "<> true", jwtUser1).getId()
        );
        final Response res = formulaApi.delete(projectId1, suite1.getId(), ids, jwtUser1);
        assertEquals(Response.Status.NO_CONTENT.getStatusCode(), res.getStatus());
        assertEquals(0, getNumberOfFormulas(projectId1, suite1.getId(), jwtUser1));
    }

    @Test
    public void shouldFailToDeleteMultipleFormulasIfOneDoesNotExist() throws Exception {
        final List<Long> ids = Arrays.asList(
                createFormula(projectId1, suite1.getId(), "test", "<> true", jwtUser1).getId(),
                createFormula(projectId1, suite1.getId(), "test", "<> true", jwtUser1).getId()
                        - 1
        );
        final Response res = formulaApi.delete(projectId1, suite1.getId(), ids, jwtUser1);
        assertEquals(Response.Status.NOT_FOUND.getStatusCode(), res.getStatus());
        assertEquals(2, getNumberOfFormulas(projectId1, suite1.getId(), jwtUser1));
    }

    @Test
    public void shouldUpdateAFormula() throws Exception {
        final LtsFormula formula = createFormula(projectId1, suite1.getId(), "test", "<> true", jwtUser1);
        formula.setName("newName");
        formula.setFormula("<>false");

        final Response res = formulaApi.update(projectId1, suite1.getId(), formula.getId(), formula, jwtUser1);
        assertEquals(Response.Status.OK.getStatusCode(), res.getStatus());

        final LtsFormula updatedFormula = res.readEntity(LtsFormula.class);
        assertEquals(formula.getId(), updatedFormula.getId());
        assertEquals(formula.getName(), updatedFormula.getName());
        assertEquals(formula.getFormula(), updatedFormula.getFormula());

        assertEquals(1, getNumberOfFormulas(projectId1, suite1.getId(), jwtUser1));
    }

    @Test
    public void shouldFailToUpdateIfFormulaIsEmpty() {
        shouldFailToUpdate(projectId1, "test", "<>true", "newName", "", jwtUser1);
    }

    @Test
    public void shouldFailToUpdateIfFormulaIsInvalid() {
        shouldFailToUpdate(projectId1, "test", "<>true", "newName", "invalid", jwtUser1);
    }

    @Test
    public void shouldMoveFormulaToAnotherSuite() {
        LtsFormulaSuite s1 = createFormulaSuite(projectId1, "s1", jwtUser1);
        LtsFormulaSuite s2 = createFormulaSuite(projectId1, "s2", jwtUser1);

        LtsFormula formula = createFormula(projectId1, s1.getId(), "test", "true", jwtUser1);

        final Response res = formulaApi.updateSuite(projectId1, s1.getId(), formula.getId(), s2, jwtUser1);
        assertEquals(HttpStatus.OK.value(), res.getStatus());
        formula = res.readEntity(LtsFormula.class);
        assertEquals(s2.getId(), formula.getSuiteId());
    }

    @Test
    public void shouldMoveMultipleFormulasToAnotherSuite() throws Exception {
        LtsFormulaSuite s1 = createFormulaSuite(projectId1, "s1", jwtUser1);
        LtsFormulaSuite s2 = createFormulaSuite(projectId1, "s2", jwtUser1);

        LtsFormula f1 = createFormula(projectId1, s1.getId(), "test", "true", jwtUser1);
        LtsFormula f2 = createFormula(projectId1, s1.getId(), "test", "true", jwtUser1);

        final Response res = formulaApi.updateSuite(projectId1, s1.getId(), Arrays.asList(f1.getId(), f2.getId()), s2, jwtUser1);
        assertEquals(HttpStatus.OK.value(), res.getStatus());

        final List<LtsFormula> updatedFormulas = res.readEntity(new GenericType<>() {
        });
        for (LtsFormula f : updatedFormulas) {
            assertEquals(s2.getId(), f.getSuiteId());
        }

        assertEquals(0, getNumberOfFormulas(projectId1, s1.getId(), jwtUser1));
        assertEquals(2, getNumberOfFormulas(projectId1, s2.getId(), jwtUser1));
    }

    private void shouldFailToUpdate(Long projectId, String name, String formula, String newName, String newFormula, String jwt) {
        final LtsFormula ltlFormula = createFormula(projectId1, suite1.getId(), name, formula, jwtUser1);
        ltlFormula.setName(newName);
        ltlFormula.setFormula(newFormula);

        final Response res = formulaApi.update(projectId, suite1.getId(), ltlFormula.getId(), ltlFormula, jwt);
        assertEquals(Response.Status.BAD_REQUEST.getStatusCode(), res.getStatus());

        final LtsFormula f = formulaSuiteApi.get(projectId1, suite1.getId(), jwt)
                .readEntity(LtsFormulaSuite.class)
                .getFormulas()
                .stream()
                .filter(l -> l.getId().equals(ltlFormula.getId()))
                .findFirst()
                .orElse(null);

        assertNotNull(f);
        assertEquals(name, f.getName());
        assertEquals(formula, f.getFormula());
    }

    private LtsFormula createFormula(Long projectId, Long suiteId, String name, String formula, String jwt) {
        final LtsFormula f = new LtsFormula();
        f.setName(name);
        f.setFormula(formula);

        return formulaApi.create(projectId, suiteId, f, jwt)
                .readEntity(LtsFormula.class);
    }

    private LtsFormulaSuite createFormulaSuite(Long projectId, String name, String jwt) {
        final LtsFormulaSuite suite = new LtsFormulaSuite();
        suite.setName(name);
        return formulaSuiteApi.create(projectId, suite, jwt)
                .readEntity(LtsFormulaSuite.class);
    }

    private int getNumberOfFormulas(Long projectId1, Long suiteId, String jwt) throws Exception {
        return formulaSuiteApi.get(projectId1, suiteId, jwt)
                .readEntity(LtsFormulaSuite.class)
                .getFormulas()
                .size();
    }
}
