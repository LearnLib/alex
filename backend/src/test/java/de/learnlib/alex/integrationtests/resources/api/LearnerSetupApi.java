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

package de.learnlib.alex.integrationtests.resources.api;

import de.learnlib.alex.learning.entities.LearnerOptions;
import de.learnlib.alex.learning.entities.LearnerSetup;
import javax.ws.rs.client.Client;
import javax.ws.rs.client.Entity;
import javax.ws.rs.core.HttpHeaders;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

public class LearnerSetupApi extends AbstractApi {

    public LearnerSetupApi(Client client, int port) {
        super(client, port);
    }

    public Response getAll(Long projectId, String jwt) {
        return client.target(url(projectId)).request()
                .header(HttpHeaders.AUTHORIZATION, jwt)
                .header(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON)
                .get();
    }

    public Response get(Long projectId, Long setupId, String jwt) {
        return client.target(url(projectId, setupId)).request()
                .header(HttpHeaders.AUTHORIZATION, jwt)
                .header(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON)
                .get();
    }

    public Response create(Long projectId, LearnerSetup setup, String jwt) {
        return client.target(url(projectId)).request()
                .header(HttpHeaders.AUTHORIZATION, jwt)
                .post(Entity.json(setup));
    }

    public Response run(Long projectId, Long setupId, String jwt) {
        return client.target(url(projectId, setupId) + "/run").request()
                .header(HttpHeaders.AUTHORIZATION, jwt)
                .post(Entity.json(""));
    }

    public Response run(Long projectId, Long setupId, LearnerOptions options, String jwt) {
        return client.target(url(projectId, setupId) + "/run").request()
                .header(HttpHeaders.AUTHORIZATION, jwt)
                .post(Entity.json(options));
    }

    public Response update(Long projectId, Long setupId, LearnerSetup setup, String jwt) {
        return client.target(url(projectId, setupId)).request()
                .header(HttpHeaders.AUTHORIZATION, jwt)
                .put(Entity.json(setup));
    }

    public Response delete(Long projectId, Long setupId, String jwt) {
        return client.target(url(projectId, setupId)).request()
                .header(HttpHeaders.AUTHORIZATION, jwt)
                .delete();
    }

    public Response copy(Long projectId, Long setupId, String jwt) {
        return client.target(url(projectId, setupId) + "/copy").request()
                .header(HttpHeaders.AUTHORIZATION, jwt)
                .header(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON)
                .post(Entity.json("{}"));
    }

    private String url(Long projectId) {
        return baseUrl() + "/projects/" + projectId + "/learner/setups";
    }

    private String url(Long projectId, Long setupId) {
        return baseUrl() + "/projects/" + projectId + "/learner/setups/" + setupId;
    }
}
