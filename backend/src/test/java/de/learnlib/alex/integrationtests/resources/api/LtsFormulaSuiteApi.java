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

import de.learnlib.alex.modelchecking.entities.LtsFormulaSuite;
import java.util.List;
import java.util.stream.Collectors;
import javax.ws.rs.client.Client;
import javax.ws.rs.client.Entity;
import javax.ws.rs.core.HttpHeaders;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

public class LtsFormulaSuiteApi extends AbstractApi {

    public LtsFormulaSuiteApi(Client client, int port) {
        super(client, port);
    }

    public Response create(Long projectId, LtsFormulaSuite suite, String jwt) {
        return client.target(url(projectId)).request()
                .header(HttpHeaders.AUTHORIZATION, jwt)
                .header(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON)
                .post(Entity.json(suite));
    }

    public Response getAll(Long projectId, String jwt) {
        return client.target(url(projectId)).request()
                .header(HttpHeaders.AUTHORIZATION, jwt)
                .header(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON)
                .get();
    }

    public Response get(Long projectId, Long suiteId, String jwt) {
        return client.target(url(projectId, suiteId)).request()
                .header(HttpHeaders.AUTHORIZATION, jwt)
                .header(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON)
                .get();
    }

    public Response delete(Long projectId, Long suiteId, String jwt) {
        return client.target(url(projectId, suiteId)).request()
                .header(HttpHeaders.AUTHORIZATION, jwt)
                .header(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON)
                .delete();
    }

    public Response deleteAll(Long projectId, List<Long> suiteIds, String jwt) {
        final String ids = suiteIds.stream()
                .map(String::valueOf)
                .collect(Collectors.joining(","));

        return client.target(url(projectId) + "/batch/" + ids).request()
                .header(HttpHeaders.AUTHORIZATION, jwt)
                .header(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON)
                .delete();
    }

    public Response update(Long projectId, Long suiteId, LtsFormulaSuite suite, String jwt) {
        return client.target(url(projectId, suiteId)).request()
                .header(HttpHeaders.AUTHORIZATION, jwt)
                .header(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON)
                .put(Entity.json(suite));
    }

    private String url(Long projectId) {
        return baseUrl() + "/projects/" + projectId + "/ltsFormulaSuites";
    }

    private String url(Long projectId, Long suiteId) {
        return baseUrl() + "/projects/" + projectId + "/ltsFormulaSuites/" + suiteId;
    }
}
