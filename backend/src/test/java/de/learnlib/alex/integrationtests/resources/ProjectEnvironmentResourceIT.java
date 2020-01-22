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

import de.learnlib.alex.data.entities.Project;
import de.learnlib.alex.data.entities.ProjectEnvironment;
import de.learnlib.alex.data.entities.ProjectEnvironmentVariable;
import de.learnlib.alex.data.entities.ProjectUrl;
import de.learnlib.alex.integrationtests.SpringRestError;
import de.learnlib.alex.integrationtests.resources.api.ProjectApi;
import de.learnlib.alex.integrationtests.resources.api.ProjectEnvironmentApi;
import de.learnlib.alex.integrationtests.resources.api.UserApi;
import org.junit.Before;
import org.junit.Test;
import org.springframework.http.HttpStatus;

import javax.ws.rs.core.GenericType;
import javax.ws.rs.core.Response;
import java.util.Arrays;
import java.util.List;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;

public class ProjectEnvironmentResourceIT extends AbstractResourceIT {

    private ProjectEnvironmentApi envApi;

    private ProjectApi projectApi;

    private String adminJwt;

    private Project project;

    @Before
    public void pre() {
        final UserApi userApi = new UserApi(client, port);
        projectApi = new ProjectApi(client, port);
        envApi = new ProjectEnvironmentApi(client, port);

        adminJwt = userApi.login("admin@alex.example", "admin");

        final Response res = projectApi.create("{\"name\":\"test\",\"url\":\"http://localhost:8080\"}", adminJwt);
        project = res.readEntity(Project.class);
    }

    @Test
    public void shouldCreateNewEnvironment() {
        final ProjectEnvironment env = new ProjectEnvironment();
        env.setName("test");

        final Response res = envApi.create(project.getId(), env, adminJwt);
        assertEquals(HttpStatus.CREATED.value(), res.getStatus());

        final ProjectEnvironment createdEnvironment = res.readEntity(ProjectEnvironment.class);
        assertNotNull(createdEnvironment.getId());
        assertEquals("test", createdEnvironment.getName());
        assertEquals(1, createdEnvironment.getUrls().size());
    }

    @Test
    public void shouldNotCreateEnvironmentWithSameName() {
        final ProjectEnvironment env1 = new ProjectEnvironment();
        env1.setName("test");

        final ProjectEnvironment env2 = new ProjectEnvironment();
        env2.setName("test");

        envApi.create(project.getId(), env1, adminJwt);
        final Response res = envApi.create(project.getId(), env2, adminJwt);
        assertEquals(HttpStatus.BAD_REQUEST.value(), res.getStatus());
        res.readEntity(SpringRestError.class);
        assertEquals(2, countEnvironments());
    }

    @Test
    public void newEnvironmentShouldHaveSameUrlsAsTheDefaultOne() {
        final ProjectEnvironment env1 = new ProjectEnvironment();
        env1.setName("test");

        ProjectEnvironment initialEnvironment = project.getEnvironments().get(0);
        final ProjectUrl newUrl = new ProjectUrl();
        newUrl.setName("url2");
        newUrl.setUrl("http://url2");
        envApi.createUrl(project.getId(), initialEnvironment.getId(), newUrl, adminJwt);
        initialEnvironment = getById(initialEnvironment.getId());

        final ProjectEnvironment createdEnvironment = envApi.create(project.getId(), env1, adminJwt)
                .readEntity(ProjectEnvironment.class);

        assertUrlsAreTheSame(initialEnvironment, createdEnvironment);
    }

    @Test
    public void newEnvironmentShouldHaveSameVariablesAsTheDefaultOne() {
        final ProjectEnvironment env1 = new ProjectEnvironment();
        env1.setName("test");

        ProjectEnvironment initialEnvironment = project.getEnvironments().get(0);
        final ProjectEnvironmentVariable variable = new ProjectEnvironmentVariable();
        variable.setName("var");
        variable.setValue("test");
        envApi.createVariable(project.getId(), initialEnvironment.getId(), variable, adminJwt);
        initialEnvironment = getById(initialEnvironment.getId());

        final ProjectEnvironment createdEnvironment = envApi.create(project.getId(), env1, adminJwt)
                .readEntity(ProjectEnvironment.class);

        assertVariablesAreTheSame(initialEnvironment, createdEnvironment);
    }

    @Test
    public void updatingUrlNameShouldUpdateAllUrlNames() {
        final List<ProjectEnvironment> environments = createEnvironments();
        ProjectEnvironment env1 = environments.get(0);
        ProjectEnvironment env2 = environments.get(1);

        final ProjectUrl urlToUpdate = env1.getUrls().get(env1.getUrls().size() - 1);
        urlToUpdate.setName("teeeest");
        final Response res3 = envApi.updateUrl(project.getId(), env1.getId(), urlToUpdate.getId(), urlToUpdate, adminJwt);

        assertEquals(HttpStatus.OK.value(), res3.getStatus());
        env2 = getById(env2.getId());

        assertUrlsAreTheSame(env1, env2);
    }

    @Test
    public void updatingVariableNameShouldUpdateAllVariableNames() {
        final List<ProjectEnvironment> environments = createEnvironments();
        ProjectEnvironment env1 = environments.get(0);
        ProjectEnvironment env2 = environments.get(1);

        final ProjectEnvironmentVariable variableToUpdate = env1.getVariables().get(env1.getVariables().size() - 1);
        variableToUpdate.setName("teeeest");
        final Response res3 = envApi.updateVariable(project.getId(), env1.getId(), variableToUpdate.getId(), variableToUpdate, adminJwt);

        assertEquals(HttpStatus.OK.value(), res3.getStatus());
        env2 = getById(env2.getId());

        assertVariablesAreTheSame(env1, env2);
    }

    @Test
    public void deletingUrlDeletesUrlInAllEnvironments() {
        final List<ProjectEnvironment> environments = createEnvironments();
        ProjectEnvironment env1 = environments.get(0);
        ProjectEnvironment env2 = environments.get(1);

        final ProjectUrl urlToDelete = env1.getUrls().get(env1.getUrls().size() - 1);
        final Response res3 = envApi.deleteUrl(project.getId(), env1.getId(), urlToDelete.getId(), adminJwt);

        assertEquals(HttpStatus.NO_CONTENT.value(), res3.getStatus());

        final ProjectEnvironment env1Post = getById(env1.getId());
        final ProjectEnvironment env2Post = getById(env2.getId());

        assertEquals(env1.getUrls().size() - 1, env1Post.getUrls().size());
        assertEquals(env2.getUrls().size() - 1, env2Post.getUrls().size());
        assertTrue(env1Post.getUrls().stream().noneMatch(v -> v.getName().equals(urlToDelete.getName())));
        assertVariablesAreTheSame(env1Post, env2Post);
    }

    @Test
    public void deletingVariablesDeletesVariableInAllEnvironments() {
        final List<ProjectEnvironment> environments = createEnvironments();
        ProjectEnvironment env1 = environments.get(0);
        ProjectEnvironment env2 = environments.get(1);

        final ProjectEnvironmentVariable variableToDelete = env1.getVariables().get(env1.getVariables().size() - 1);
        final Response res3 = envApi.deleteVariable(project.getId(), env1.getId(), variableToDelete.getId(), adminJwt);

        assertEquals(HttpStatus.NO_CONTENT.value(), res3.getStatus());

        final ProjectEnvironment env1Post = getById(env1.getId());
        final ProjectEnvironment env2Post = getById(env2.getId());

        assertEquals(env1.getVariables().size() - 1, env1Post.getVariables().size());
        assertEquals(env2.getVariables().size() - 1, env2Post.getVariables().size());
        assertTrue(env1Post.getVariables().stream().noneMatch(v -> v.getName().equals(variableToDelete.getName())));
        assertVariablesAreTheSame(env1Post, env2Post);
    }

    private List<ProjectEnvironment> createEnvironments() {
        ProjectEnvironment env1 = project.getDefaultEnvironment();

        final ProjectUrl url = new ProjectUrl();
        url.setName("url1");
        url.setUrl("http://asd");
        envApi.createUrl(project.getId(), env1.getId(), url, adminJwt);

        final ProjectEnvironmentVariable variable1 = new ProjectEnvironmentVariable();
        variable1.setName("var1");
        variable1.setValue("test1");
        envApi.createVariable(project.getId(), env1.getId(), variable1, adminJwt);

        final ProjectEnvironmentVariable variable2 = new ProjectEnvironmentVariable();
        variable1.setName("var2");
        variable1.setValue("test2");
        envApi.createVariable(project.getId(), env1.getId(), variable2, adminJwt);

        env1 = getById(env1.getId());

        ProjectEnvironment env2 = new ProjectEnvironment();
        env2.setProject(project);
        env2.setName("env2");
        final Response res1 = envApi.create(project.getId(), env2, adminJwt);
        env2 = res1.readEntity(ProjectEnvironment.class);

        assertVariablesAreTheSame(env1, env2);
        assertUrlsAreTheSame(env1, env2);

        return Arrays.asList(env1, env2);
    }

    @Test
    public void shouldNotDeleteLastUrlInEnvironment() {
        final ProjectEnvironment environment = project.getDefaultEnvironment();
        final ProjectUrl url = environment.getUrls().get(0);
        final Response res = envApi.deleteUrl(project.getId(), environment.getId(), url.getId(), adminJwt);

        assertEquals(HttpStatus.BAD_REQUEST.value(), res.getStatus());
        assertEquals(environment.getUrls().size(), getById(environment.getId()).getUrls().size());
    }

    @Test
    public void shouldNotDeleteTheLastEnvironment() {
        final Long envId = project.getEnvironments().get(0).getId();
        final Response res = envApi.delete(project.getId(), envId, adminJwt);
        assertEquals(HttpStatus.BAD_REQUEST.value(), res.getStatus());
        res.readEntity(SpringRestError.class);

        final Project p = projectApi.get(project.getId().intValue(), adminJwt).readEntity(Project.class);
        assertEquals(1, p.getEnvironments().size());
    }

    @Test
    public void shouldMakeAnotherEnvironmentDefaultWhenDeletingDefaultEnvironment() {
        final ProjectEnvironment env = new ProjectEnvironment();
        env.setName("env2");

        envApi.create(project.getId(), env, adminJwt);
        project = projectApi.get(project.getId().intValue(), adminJwt).readEntity(Project.class);

        final Long defaultEnvId = project.getDefaultEnvironment().getId();
        final Response res = envApi.delete(project.getId(), defaultEnvId, adminJwt);
        project = projectApi.get(project.getId().intValue(), adminJwt).readEntity(Project.class);

        assertEquals(HttpStatus.NO_CONTENT.value(), res.getStatus());
        assertEquals(1, project.getEnvironments().size());
        assertNotEquals(defaultEnvId, project.getDefaultEnvironment().getId());
    }

    @Test
    public void shouldNotUpdateEnvironmentIfNameExists() {
        ProjectEnvironment env2 = new ProjectEnvironment();
        env2.setName("env2");

        ProjectEnvironment env3 = new ProjectEnvironment();
        env3.setName("env3");

        env2 = envApi.create(project.getId(), env2, adminJwt).readEntity(ProjectEnvironment.class);
        env3 = envApi.create(project.getId(), env3, adminJwt).readEntity(ProjectEnvironment.class);

        env2.setName("env3");
        final Response res = envApi.update(project.getId(), env2.getId(), env2, adminJwt);
        project = projectApi.get(project.getId().intValue(), adminJwt).readEntity(Project.class);

        env2 = project.getEnvironments().stream().filter(e -> e.getName().equals("env2")).findFirst().orElse(null);
        env3 = project.getEnvironments().stream().filter(e -> e.getName().equals("env3")).findFirst().orElse(null);

        res.readEntity(SpringRestError.class);
        assertEquals(HttpStatus.BAD_REQUEST.value(), res.getStatus());
        assertNotNull(env2);
        assertNotNull(env3);
    }

    @Test
    public void shouldMakeAnotherEnvironmentTheDefaultOne() {
        ProjectEnvironment env2 = new ProjectEnvironment();
        env2.setName("env2");
        env2 = envApi.create(project.getId(), env2, adminJwt).readEntity(ProjectEnvironment.class);

        env2.setDefault(true);
        env2 = envApi.update(project.getId(), env2.getId(), env2, adminJwt).readEntity(ProjectEnvironment.class);

        project = projectApi.get(project.getId().intValue(), adminJwt).readEntity(Project.class);

        assertEquals(env2.getId(), project.getDefaultEnvironment().getId());
        assertEquals(1, project.getEnvironments().stream().filter(ProjectEnvironment::isDefault).count());
    }

    @Test
    public void shouldNotCreateVariableIfNameExists() {
        final ProjectEnvironment env = project.getDefaultEnvironment();

        final ProjectEnvironmentVariable var1 = new ProjectEnvironmentVariable();
        var1.setName("var1");
        var1.setValue("test");

        envApi.createVariable(project.getId(), env.getId(), var1, adminJwt);

        final ProjectEnvironmentVariable var2 = new ProjectEnvironmentVariable();
        var2.setName("var1");
        var2.setValue("test");

        final Response res = envApi.createVariable(project.getId(), env.getId(), var1, adminJwt);
        project = projectApi.get(project.getId().intValue(), adminJwt).readEntity(Project.class);

        res.readEntity(SpringRestError.class);
        assertEquals(HttpStatus.BAD_REQUEST.value(), res.getStatus());
        assertEquals(1, project.getDefaultEnvironment().getVariables().size());
        assertEquals("var1", project.getDefaultEnvironment().getVariables().get(0).getName());
    }

    @Test
    public void shouldNotUpdateVariableWithExistingName() {
        ProjectEnvironmentVariable var1 = new ProjectEnvironmentVariable();
        var1.setName("var1");
        var1.setValue("test");

        ProjectEnvironmentVariable var2 = new ProjectEnvironmentVariable();
        var2.setName("var2");
        var2.setValue("test");

        var1 = envApi.createVariable(project.getId(), project.getDefaultEnvironment().getId(), var1, adminJwt)
                .readEntity(ProjectEnvironmentVariable.class);
        var2 = envApi.createVariable(project.getId(), project.getDefaultEnvironment().getId(), var2, adminJwt)
                .readEntity(ProjectEnvironmentVariable.class);

        var2.setName("var1");

        final Response res = envApi.updateVariable(project.getId(), project.getDefaultEnvironment().getId(), var2.getId(), var2, adminJwt);
        project = projectApi.get(project.getId().intValue(), adminJwt).readEntity(Project.class);

        res.readEntity(SpringRestError.class);
        assertEquals(HttpStatus.BAD_REQUEST.value(), res.getStatus());
        assertEquals(1,  project.getDefaultEnvironment().getVariables().stream().filter(v -> v.getName().equals("var1")).count());
        assertEquals(1,  project.getDefaultEnvironment().getVariables().stream().filter(v -> v.getName().equals("var2")).count());
    }

    private void assertVariablesAreTheSame(ProjectEnvironment env1, ProjectEnvironment env2) {
        assertEquals(env1.getVariables().size(), env2.getVariables().size());
        for (ProjectEnvironmentVariable v : env1.getVariables()) {
            assertEquals(1, env2.getVariables().stream().filter(u ->
                    u.getName().equals(v.getName()) && u.getValue().equals(v.getValue())).count()
            );
        }
    }

    private void assertUrlsAreTheSame(ProjectEnvironment env1, ProjectEnvironment env2) {
        assertEquals(env1.getUrls().size(), env2.getUrls().size());
        for (ProjectUrl url : env1.getUrls()) {
            assertEquals(1, env2.getUrls().stream().filter(u ->
                    u.getName().equals(url.getName()) && u.getUrl().equals(url.getUrl())).count()
            );
        }
    }

    private List<ProjectEnvironment> getAllEnvironments() {
        return envApi.getAll(project.getId(), adminJwt)
                .readEntity(new GenericType<List<ProjectEnvironment>>() {
                });
    }

    private ProjectEnvironment getById(Long envId) {
        return getAllEnvironments().stream()
                .filter(e -> e.getId().equals(envId))
                .findFirst()
                .orElse(null);
    }

    private int countEnvironments() {
        return getAllEnvironments().size();
    }
}
