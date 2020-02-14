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

import de.learnlib.alex.data.entities.Counter;

import javax.ws.rs.client.Client;
import javax.ws.rs.client.Entity;
import javax.ws.rs.core.HttpHeaders;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.List;
import java.util.stream.Collectors;

public class CounterApi extends AbstractApi {

    public CounterApi(Client client, int port) {
        super(client, port);
    }

    public Response getAll(Long projectId, String jwt) {
        return client.target(url(projectId)).request()
                .header(HttpHeaders.AUTHORIZATION, jwt)
                .header(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON)
                .get();
    }

    public Response create(Long projectId, Counter counter, String jwt) {
        return client.target(url(projectId)).request()
                .header(HttpHeaders.AUTHORIZATION, jwt)
                .post(Entity.json(counter));
    }

    public Response update(Long projectId, Long counterId, Counter counter, String jwt) {
        return client.target(url(projectId) + "/" + counterId).request()
                .header(HttpHeaders.AUTHORIZATION, jwt)
                .put(Entity.json(counter));
    }

    public Response delete(Long projectId, Counter counter, String jwt) {
        return client.target(url(projectId, counter.getId())).request()
                .header(HttpHeaders.AUTHORIZATION, jwt)
                .delete();
    }

    public Response delete(Long projectId, List<Counter> counters, String jwt) {
        final List<String> ids = counters.stream()
                .map(c -> String.valueOf(c.getId()))
                .collect(Collectors.toList());

        return client.target(url(projectId) + "/batch/" + String.join(",", ids)).request()
                .header(HttpHeaders.AUTHORIZATION, jwt)
                .delete();
    }

    public String url(Long projectId) {
        return baseUrl() + "/projects/" + projectId + "/counters";
    }

    public String url(Long projectId, Long counterId) {
        return url(projectId) + "/" + counterId;
    }
}
