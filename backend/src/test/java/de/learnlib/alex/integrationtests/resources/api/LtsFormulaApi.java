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

import de.learnlib.alex.modelchecking.entities.LtsFormula;
import de.learnlib.alex.modelchecking.entities.LtsFormulaSuite;

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

    public Response create(Long projectId, Long suiteId, LtsFormula formula, String jwt) {
        return client.target(url(projectId, suiteId)).request()
                .header(HttpHeaders.AUTHORIZATION, jwt)
                .header(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON)
                .post(Entity.json(formula));
    }

    public Response update(Long projectId, Long suiteId, Long formulaId, LtsFormula formula, String jwt) {
        return client.target(url(projectId, suiteId, formulaId)).request()
                .header(HttpHeaders.AUTHORIZATION, jwt)
                .header(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON)
                .put(Entity.json(formula));
    }

    public Response delete(Long projectId, Long suiteId, Long formulaId, String jwt) {
        return client.target(url(projectId, suiteId, formulaId)).request()
                .header(HttpHeaders.AUTHORIZATION, jwt)
                .header(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON)
                .delete();
    }

    public Response delete(Long projectId, Long suiteId, List<Long> formulaIds, String jwt) {
        return client.target(url(projectId, suiteId, formulaIds)).request()
                .header(HttpHeaders.AUTHORIZATION, jwt)
                .header(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON)
                .delete();
    }

    public Response updateSuite(Long projectId, Long suiteId, Long formulaId, LtsFormulaSuite suite, String jwt) {
        return client.target(url(projectId, suiteId, formulaId) + "/suite").request()
                .header(HttpHeaders.AUTHORIZATION, jwt)
                .header(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON)
                .put(Entity.json(suite));
    }

    public Response updateSuite(Long projectId, Long suiteId, List<Long> formulaIds, LtsFormulaSuite suite, String jwt) {
        return client.target(url(projectId, suiteId, formulaIds) + "/suite").request()
                .header(HttpHeaders.AUTHORIZATION, jwt)
                .header(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON)
                .put(Entity.json(suite));
    }

    private String url(Long projectId, Long suiteId) {
        return baseUrl() + "/projects/" + projectId + "/ltsFormulaSuites/" + suiteId + "/ltsFormulas";
    }

    private String url(Long projectId, Long suiteId, Long formulaId) {
        return url(projectId, suiteId) + "/" + formulaId;
    }

    private String url(Long projectId, Long suiteId, List<Long> formulaIds) {
        final List<String> ids = formulaIds.stream().map(String::valueOf).collect(Collectors.toList());
        return url(projectId, suiteId) + "/batch/" + String.join(",", ids);
    }

}
