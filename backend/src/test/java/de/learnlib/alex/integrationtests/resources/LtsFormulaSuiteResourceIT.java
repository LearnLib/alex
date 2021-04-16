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

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

import de.learnlib.alex.data.entities.Project;
import de.learnlib.alex.integrationtests.SpringRestError;
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

public class LtsFormulaSuiteResourceIT extends AbstractResourceIT {

    private LtsFormulaSuiteApi formulaSuiteApi;
    private LtsFormulaApi formulaApi;

    private Project project;
    private String jwt;

    @BeforeEach
    public void before() {
        final UserApi userApi = new UserApi(client, port);
        final ProjectApi projectApi = new ProjectApi(client, port);

        formulaApi = new LtsFormulaApi(client, port);
        formulaSuiteApi = new LtsFormulaSuiteApi(client, port);

        jwt = userApi.login(ADMIN_EMAIL, ADMIN_PASSWORD);

        project = projectApi.create("{\"name\":\"test\",\"url\":\"http://localhost:8080\"}", jwt)
                .readEntity(Project.class);
    }

    @Test
    public void createFormulaSuite() {
        final LtsFormulaSuite suite = new LtsFormulaSuite();
        suite.setName("test");

        final Response res = formulaSuiteApi.create(project.getId(), suite, jwt);
        assertEquals(HttpStatus.CREATED.value(), res.getStatus());
        final LtsFormulaSuite createdSuite = res.readEntity(LtsFormulaSuite.class);
        assertFormulaSuite(createdSuite, "test", 0);
    }

    @Test
    public void shouldNotCreateFormulaSuiteWithSameNameTwice() {
        final LtsFormulaSuite suite1 = new LtsFormulaSuite();
        suite1.setName("test");
        formulaSuiteApi.create(project.getId(), suite1, jwt);

        final LtsFormulaSuite suite2 = new LtsFormulaSuite();
        suite2.setName("test");
        final Response res = formulaSuiteApi.create(project.getId(), suite2, jwt);
        assertEquals(HttpStatus.BAD_REQUEST.value(), res.getStatus());
        res.readEntity(SpringRestError.class);
        assertEquals(1, getNumberOfFormulaSuites(project.getId(), jwt));
    }

    @Test
    public void shouldDeleteEmptyFormulaSuite() {
        final LtsFormulaSuite suite = createFormulaSuite(project.getId(), "test", jwt);
        final Response res = formulaSuiteApi.delete(project.getId(), suite.getId(), jwt);
        assertEquals(HttpStatus.NO_CONTENT.value(), res.getStatus());
        assertEquals(0, getNumberOfFormulaSuites(project.getId(), jwt));
    }

    @Test
    public void shouldDeleteNonEmptyFormulaSuite() {
        LtsFormulaSuite suite = createFormulaSuite(project.getId(), "test", jwt);
        createFormula(project.getId(), suite.getId(), "f1", "[]true", jwt);
        createFormula(project.getId(), suite.getId(), "f2", "[]false", jwt);

        suite = formulaSuiteApi.get(project.getId(), suite.getId(), jwt)
                .readEntity(LtsFormulaSuite.class);

        assertFormulaSuite(suite, "test", 2);

        final Response res = formulaSuiteApi.delete(project.getId(), suite.getId(), jwt);
        assertEquals(HttpStatus.NO_CONTENT.value(), res.getStatus());
        assertEquals(0, getNumberOfFormulaSuites(project.getId(), jwt));
    }

    @Test
    public void shouldDeleteMultipleFormulaSuites() {
        final LtsFormulaSuite suite1 = createFormulaSuite(project.getId(), "test1", jwt);
        final LtsFormulaSuite suite2 = createFormulaSuite(project.getId(), "test2", jwt);

        final Response res = formulaSuiteApi.deleteAll(project.getId(), Arrays.asList(suite1.getId(), suite2.getId()), jwt);
        assertEquals(HttpStatus.NO_CONTENT.value(), res.getStatus());
        assertEquals("", res.readEntity(String.class));
        assertEquals(0, getNumberOfFormulaSuites(project.getId(), jwt));
    }

    @Test
    public void shouldFailToDeleteSuiteWithNonExistingId() {
        final LtsFormulaSuite suite1 = createFormulaSuite(project.getId(), "test1", jwt);

        final Response res = formulaSuiteApi.deleteAll(project.getId(), Arrays.asList(suite1.getId(), -1L), jwt);
        assertEquals(HttpStatus.NOT_FOUND.value(), res.getStatus());
        res.readEntity(SpringRestError.class);
        assertEquals(1, getNumberOfFormulaSuites(project.getId(), jwt));
    }

    @Test
    public void shouldUpdateName() {
        final LtsFormulaSuite suite = createFormulaSuite(project.getId(), "test1", jwt);
        suite.setName("updatedName");

        final Response res = formulaSuiteApi.update(project.getId(), suite.getId(), suite, jwt);
        assertEquals(HttpStatus.OK.value(), res.getStatus());

        final LtsFormulaSuite updatedSuite = res.readEntity(LtsFormulaSuite.class);
        assertFormulaSuite(updatedSuite, "updatedName", 0);
    }

    @Test
    public void shouldNotUpdateNameIfNameExists() {
        createFormulaSuite(project.getId(), "test", jwt);

        LtsFormulaSuite suite = createFormulaSuite(project.getId(), "newSuite", jwt);
        suite.setName("test");

        final Response res = formulaSuiteApi.update(project.getId(), suite.getId(), suite, jwt);
        assertEquals(HttpStatus.BAD_REQUEST.value(), res.getStatus());
        res.readEntity(SpringRestError.class);

        suite = formulaSuiteApi.get(project.getId(), suite.getId(), jwt).readEntity(LtsFormulaSuite.class);
        assertFormulaSuite(suite, "newSuite", 0);
    }

    private LtsFormulaSuite createFormulaSuite(Long projectId, String name, String jwt) {
        final LtsFormulaSuite suite = new LtsFormulaSuite();
        suite.setName(name);

        return formulaSuiteApi.create(projectId, suite, jwt)
                .readEntity(LtsFormulaSuite.class);
    }

    private LtsFormula createFormula(Long projectId, Long suiteId, String name, String formula, String jwt) {
        final LtsFormula f = new LtsFormula();
        f.setName(name);
        f.setFormula(formula);

        return formulaApi.create(projectId, suiteId, f, jwt)
                .readEntity(LtsFormula.class);
    }

    private void assertFormulaSuite(LtsFormulaSuite suite, String name, int numberOfFormulas) {
        assertNotNull(suite.getId());
        assertNotNull(suite.getProject());
        assertEquals(name, suite.getName());
        assertEquals(numberOfFormulas, suite.getFormulas().size());
    }

    private int getNumberOfFormulaSuites(Long projectId, String jwt) {
        return formulaSuiteApi.getAll(projectId, jwt)
                .readEntity(new GenericType<List<LtsFormulaSuite>>() {
                })
                .size();
    }
}
