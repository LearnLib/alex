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

import de.learnlib.alex.learning.entities.LearnerResumeConfiguration;
import de.learnlib.alex.learning.entities.LearnerStartConfiguration;
import de.learnlib.alex.learning.entities.ReadOutputConfig;

import javax.ws.rs.client.Client;
import javax.ws.rs.client.Entity;
import javax.ws.rs.core.HttpHeaders;
import javax.ws.rs.core.Response;

public class LearnerApi extends AbstractApi {

    public LearnerApi(Client client, int port) {
        super(client, port);
    }

    public Response start(Long projectId, LearnerStartConfiguration configuration, String jwt) {
        return client.target(url(projectId) + "/start").request()
                .header(HttpHeaders.AUTHORIZATION, jwt)
                .post(Entity.json(configuration));
    }

    public Response resume(Long projectId, Long testNo, LearnerResumeConfiguration configuration, String jwt) {
        return client.target(url(projectId) + "/" + testNo + "/resume").request()
                .header(HttpHeaders.AUTHORIZATION, jwt)
                .post(Entity.json(configuration));
    }

    public Response abort(Long projectId, Long testNo, String jwt) {
        return client.target(url(projectId) + "/" + testNo + "/stop").request()
                .header(HttpHeaders.AUTHORIZATION, jwt)
                .get();
    }

    public Response getStatus(Long projectId, String jwt) {
        return client.target(url(projectId) + "/status").request()
                .header(HttpHeaders.AUTHORIZATION, jwt)
                .get();
    }

    public Response readOutput(Long projectId, ReadOutputConfig config, String jwt) {
        return client.target(url(projectId) + "/outputs").request()
                .header(HttpHeaders.AUTHORIZATION, jwt)
                .post(Entity.json(config));
    }

    private String url(Long projectId) {
        return baseUrl() + "/projects/" + projectId + "/learner";
    }
}
