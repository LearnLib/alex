/*
 * Copyright 2015 - 2019 TU Dortmund
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

public class CounterApi extends AbstractApi {

    public CounterApi(Client client, int port) {
        super(client, port);
    }

    public Response getAll(int projectId, String jwt) {
        return client.target(url(projectId)).request()
                .header(HttpHeaders.AUTHORIZATION, jwt)
                .header(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON)
                .get();
    }

    public Response create(int projectId, String counter, String jwt) {
        return client.target(url(projectId)).request()
                .header(HttpHeaders.AUTHORIZATION, jwt)
                .post(Entity.json(counter));
    }

    public Response update(int projectId, String counterName, String counter, String jwt) {
        return client.target(url(projectId) + "/" + counterName).request()
                .header(HttpHeaders.AUTHORIZATION, jwt)
                .put(Entity.json(counter));
    }

    public Response delete(int projectId, String counterName, String jwt) {
        return client.target(url(projectId) + "/" + counterName).request()
                .header(HttpHeaders.AUTHORIZATION, jwt)
                .delete();
    }

    public Response delete(int projectId, List<String> counterNames, String jwt) {
        return client.target(url(projectId) + "/batch/" + String.join(",", counterNames)).request()
                .header(HttpHeaders.AUTHORIZATION, jwt)
                .delete();
    }

    public String url(int projectId) {
        return baseUrl() + "/projects/" + projectId + "/counters";
    }
}
