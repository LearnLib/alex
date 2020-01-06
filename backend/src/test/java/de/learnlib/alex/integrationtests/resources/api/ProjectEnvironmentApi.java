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

package de.learnlib.alex.integrationtests.resources.api;

import de.learnlib.alex.data.entities.ProjectEnvironment;
import de.learnlib.alex.data.entities.ProjectEnvironmentVariable;
import de.learnlib.alex.data.entities.ProjectUrl;

import javax.ws.rs.client.Client;
import javax.ws.rs.client.Entity;
import javax.ws.rs.core.HttpHeaders;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

public class ProjectEnvironmentApi extends AbstractApi {

    public ProjectEnvironmentApi(Client client, int port) {
        super(client, port);
    }

    public Response getAll(Long projectId, String jwt) {
        return client.target(envUrl(projectId)).request()
                .header(HttpHeaders.AUTHORIZATION, jwt)
                .header(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON)
                .get();
    }

    public Response create(Long projectId, ProjectEnvironment env, String jwt) {
        return client.target(envUrl(projectId)).request()
                .header(HttpHeaders.AUTHORIZATION, jwt)
                .post(Entity.json(env));
    }

    public Response delete(Long projectId, Long envId, String jwt) {
        return client.target(envUrl(projectId, envId)).request()
                .header(HttpHeaders.AUTHORIZATION, jwt)
                .delete();
    }

    public Response update(Long projectId, Long envId, ProjectEnvironment env, String jwt) {
        return client.target(envUrl(projectId, envId)).request()
                .header(HttpHeaders.AUTHORIZATION, jwt)
                .put(Entity.json(env));
    }

    public Response createUrl(Long projectId, Long envId, ProjectUrl projectUrl, String jwt) {
        return client.target(envUrlUrl(projectId, envId)).request()
                .header(HttpHeaders.AUTHORIZATION, jwt)
                .post(Entity.json(projectUrl));
    }

    public Response updateUrl(Long projectId, Long envId, Long urlId, ProjectUrl projectUrl, String jwt) {
        return client.target(envUrlUrl(projectId, envId, urlId)).request()
                .header(HttpHeaders.AUTHORIZATION, jwt)
                .put(Entity.json(projectUrl));
    }

    public Response deleteUrl(Long projectId, Long envId, Long urlId, String jwt) {
        return client.target(envUrlUrl(projectId, envId, urlId)).request()
                .header(HttpHeaders.AUTHORIZATION, jwt)
                .delete();
    }

    public Response createVariable(Long projectId, Long envId, ProjectEnvironmentVariable variable, String jwt) {
        return client.target(envVarUrl(projectId, envId)).request()
                .header(HttpHeaders.AUTHORIZATION, jwt)
                .post(Entity.json(variable));
    }

    public Response updateVariable(Long projectId, Long envId, Long varId, ProjectEnvironmentVariable variable, String jwt) {
        return client.target(envVarUrl(projectId, envId, varId)).request()
                .header(HttpHeaders.AUTHORIZATION, jwt)
                .put(Entity.json(variable));
    }

    public Response deleteVariable(Long projectId, Long envId, Long varId, String jwt) {
        return client.target(envVarUrl(projectId, envId, varId)).request()
                .header(HttpHeaders.AUTHORIZATION, jwt)
                .delete();
    }

    private String envUrl(Long projectId) {
        return baseUrl() + "/projects/" + projectId + "/environments";
    }

    private String envUrl(Long projectId, Long envId) {
        return envUrl(projectId) + "/" + envId;
    }

    private String envUrlUrl(Long projectId, Long envId) {
        return envUrl(projectId, envId) + "/urls";
    }

    private String envUrlUrl(Long projectId, Long envId, Long urlId) {
        return envUrlUrl(projectId, envId) + "/" + urlId;
    }

    private String envVarUrl(Long projectId, Long envId) {
        return envUrl(projectId, envId) + "/variables";
    }

    private String envVarUrl(Long projectId, Long envId, Long varId) {
        return envVarUrl(projectId, envId) + "/" + varId;
    }
}
