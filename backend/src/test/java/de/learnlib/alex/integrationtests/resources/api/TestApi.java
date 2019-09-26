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
import java.util.stream.Collectors;

public class TestApi extends AbstractApi {

    public TestApi(Client client, int port) {
        super(client, port);
    }

    public Response create(int projectId, String test, String jwt) {
        return client.target(url(projectId)).request()
                .header(HttpHeaders.AUTHORIZATION, jwt)
                .header(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON)
                .post(Entity.json(test));
    }

    public Response createMany(int projectId, String tests, String jwt) {
        return client.target(url(projectId) + "/batch").request()
                .header(HttpHeaders.AUTHORIZATION, jwt)
                .header(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON)
                .post(Entity.json(tests));
    }

    public Response get(int projectId, int testId, String jwt) {
        return client.target(url(projectId) + "/" + testId).request()
                .header(HttpHeaders.AUTHORIZATION, jwt)
                .header(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON)
                .get();
    }

    public Response getRoot(int projectId, String jwt) {
        return client.target(url(projectId) + "/root").request()
                .header(HttpHeaders.AUTHORIZATION, jwt)
                .header(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON)
                .get();
    }

    public Response update(int projectId, int testId, String test, String jwt) {
        return client.target(url(projectId) + "/" + testId).request()
                .header(HttpHeaders.AUTHORIZATION, jwt)
                .header(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON)
                .put(Entity.json(test));
    }

    public Response move(int projectId, int fromTestId, int toTestId, String jwt) {
        return client.target(url(projectId) + "/batch/" + fromTestId + "/moveTo/" + toTestId).request()
                .header(HttpHeaders.AUTHORIZATION, jwt)
                .header(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON)
                .put(Entity.json(""));
    }

    public Response delete(int projectId, int testId, String jwt) {
        return client.target(url(projectId) + "/" + testId).request()
                .header(HttpHeaders.AUTHORIZATION, jwt)
                .header(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON)
                .delete();
    }

    public Response deleteMany(int projectId, List<Integer> testIds, String jwt) {
        final List<String> ids = testIds.stream().map(String::valueOf).collect(Collectors.toList());
        return client.target(url(projectId) + "/batch/" + String.join(",", ids)).request()
                .header(HttpHeaders.AUTHORIZATION, jwt)
                .header(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON)
                .delete();
    }

    public String url(long projectId) {
        return baseUrl() + "/projects/" + projectId + "/tests";
    }
}
