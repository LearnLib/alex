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

import de.learnlib.alex.modelchecking.entities.LtsFormula;

import javax.ws.rs.client.Client;
import javax.ws.rs.client.Entity;
import javax.ws.rs.core.HttpHeaders;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.List;
import java.util.stream.Collectors;

public class LtsFormulaApi extends AbstractApi {

    public LtsFormulaApi(Client client, int port) {
        super(client, port);
    }

    public Response getAll(Long projectId, String jwt) {
        return client.target(url(projectId)).request()
                .header(HttpHeaders.AUTHORIZATION, jwt)
                .header(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON)
                .get();
    }

    public Response create(Long projectId, LtsFormula formula, String jwt) {
        return client.target(url(projectId)).request()
                .header(HttpHeaders.AUTHORIZATION, jwt)
                .header(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON)
                .post(Entity.json(formula));
    }

    public Response update(Long projectId, Long formulaId, LtsFormula formula, String jwt) {
        return client.target(url(projectId, formulaId)).request()
                .header(HttpHeaders.AUTHORIZATION, jwt)
                .header(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON)
                .put(Entity.json(formula));
    }

    public Response delete(Long projectId, Long formulaId, String jwt) {
        return client.target(url(projectId, formulaId)).request()
                .header(HttpHeaders.AUTHORIZATION, jwt)
                .header(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON)
                .delete();
    }

    public Response delete(Long projectId, List<Long> formulaIds, String jwt) {
        return client.target(url(projectId, formulaIds)).request()
                .header(HttpHeaders.AUTHORIZATION, jwt)
                .header(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON)
                .delete();
    }

    private String url(Long projectId) {
        return baseUrl() + "/projects/" + projectId + "/ltsFormulas";
    }

    private String url(Long projectId, Long formulaId) {
        return url(projectId) + "/" + formulaId;
    }

    private String url(Long projectId, List<Long> formulaIds) {
        final List<String> ids = formulaIds.stream().map(String::valueOf).collect(Collectors.toList());
        return url(projectId) + "/batch/" + String.join(",", ids);
    }

}
