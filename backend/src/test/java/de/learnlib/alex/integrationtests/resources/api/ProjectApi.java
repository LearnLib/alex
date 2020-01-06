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

import javax.ws.rs.client.Client;
import javax.ws.rs.client.Entity;
import javax.ws.rs.core.HttpHeaders;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.List;

public class ProjectApi extends AbstractApi {

    public ProjectApi(Client client, int port) {
        super(client, port);
    }

    public Response create(String project, String jwt) {
        return client.target(url()).request()
                .header(HttpHeaders.AUTHORIZATION, jwt)
                .post(Entity.json(project));
    }

    public Response importProject(String project, String jwt) {
        return client.target(url() + "/import").request()
                .header(HttpHeaders.AUTHORIZATION, jwt)
                .post(Entity.json(project));
    }

    public Response getAll(String jwt) {
        return client.target(url()).request()
                .header(HttpHeaders.AUTHORIZATION, jwt)
                .header(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON)
                .get();
    }

    public Response get(int projectId, String jwt) {
        return client.target(url() + "/" + projectId).request()
                .header(HttpHeaders.AUTHORIZATION, jwt)
                .header(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON)
                .get();
    }

    public Response update(int projectId, String project, String jwt) {
        return client.target(url() + "/" + projectId).request()
                .header(HttpHeaders.AUTHORIZATION, jwt)
                .put(Entity.json(project));
    }

    public Response delete(int projectId, String jwt) {
        return client.target(url() + "/" + projectId).request()
                .header(HttpHeaders.AUTHORIZATION, jwt)
                .delete();
    }

    public Response delete(List<String> projectIds, String jwt) {
        return client.target(url() + "/batch/" + String.join(",", projectIds)).request()
                .header(HttpHeaders.AUTHORIZATION, jwt)
                .delete();
    }

    public String url() {
        return baseUrl() + "/projects";
    }
}
