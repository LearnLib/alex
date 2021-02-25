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

import javax.ws.rs.client.Client;
import javax.ws.rs.client.Entity;
import javax.ws.rs.core.HttpHeaders;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.List;
import java.util.stream.Collectors;

public class SymbolApi extends AbstractApi {

    public SymbolApi(Client client, int port) {
        super(client, port);
    }

    public Response get(int projectId, Long symbolId, String jwt) {
        return client.target(url(projectId, symbolId)).request()
                .header(HttpHeaders.AUTHORIZATION, jwt)
                .header(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON)
                .get();
    }

    public Response update(int projectId, Long symbolId, String symbol, String jwt) {
        return client.target(url(projectId, symbolId)).request()
                .header(HttpHeaders.AUTHORIZATION, jwt)
                .header(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON)
                .put(Entity.json(symbol));
    }

    public Response move(int projectId, Long symbolId, Long groupId, String jwt) {
        return client.target(url(projectId, symbolId) + "/moveTo/" + groupId).request()
                .header(HttpHeaders.AUTHORIZATION, jwt)
                .header(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON)
                .put(Entity.json("{}"));
    }

    public Response move(int projectId, List<Long> symbolIds, Long groupId, String jwt) {
        final String ids = symbolIds.stream().map(String::valueOf).collect(Collectors.joining(","));

        return client.target(url(projectId) + "/batch/" + ids + "/moveTo/" + groupId).request()
                .header(HttpHeaders.AUTHORIZATION, jwt)
                .header(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON)
                .put(Entity.json("{}"));
    }

    public Response get(int projectId, List<Long> symbolIds, String jwt) {
        final String ids = symbolIds.stream().map(String::valueOf).collect(Collectors.joining(","));

        return client.target(url(projectId) + "/batch/" + ids).request()
                .header(HttpHeaders.AUTHORIZATION, jwt)
                .header(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON)
                .get();
    }

    public Response getAll(int projectId, String jwt) {
        return client.target(url(projectId)).request()
                .header(HttpHeaders.AUTHORIZATION, jwt)
                .header(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON)
                .get();
    }

    public Response create(int projectId, String symbol, String jwt) {
        return client.target(url(projectId)).request()
                .header(HttpHeaders.AUTHORIZATION, jwt)
                .header(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON)
                .post(Entity.json(symbol));
    }

    public Response createMany(int projectId, String symbols, String jwt) {
        return client.target(url(projectId) + "/batch").request()
                .header(HttpHeaders.AUTHORIZATION, jwt)
                .header(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON)
                .post(Entity.json(symbols));
    }

    public Response archive(int projectId, int symbolId, String jwt) {
        return client.target(url(projectId) + "/" + symbolId + "/hide").request()
                .header(HttpHeaders.AUTHORIZATION, jwt)
                .header(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON)
                .post(null);
    }

    public Response archiveMany(int projectId, List<Integer> symbolIds, String jwt) {
        final String ids = symbolIds.stream().map(String::valueOf).collect(Collectors.joining(","));

        return client.target(url(projectId) + "/batch/" + ids + "/hide").request()
                .header(HttpHeaders.AUTHORIZATION, jwt)
                .header(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON)
                .post(null);
    }

    public Response restore(Long projectId, Long symbolId, String jwt) {
        return client.target(url(projectId) + "/" + symbolId + "/show").request()
                .header(HttpHeaders.AUTHORIZATION, jwt)
                .header(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON)
                .post(null);
    }

    public Response restore(Long projectId, List<Long> symbolIds, String jwt) {
        final String ids = symbolIds.stream().map(String::valueOf).collect(Collectors.joining(","));

        return client.target(url(projectId) + "/batch/" + ids + "/show").request()
                .header(HttpHeaders.AUTHORIZATION, jwt)
                .header(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON)
                .post(null);
    }

    public Response delete(int projectId, Long symbolId, String jwt) {
        return client.target(url(projectId, symbolId)).request()
                .header(HttpHeaders.AUTHORIZATION, jwt)
                .header(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON)
                .delete();
    }

    public Response delete(int projectId, List<Long> symbolIds, String jwt) {
        final String ids = symbolIds.stream().map(String::valueOf).collect(Collectors.joining(","));

        return client.target(url(projectId) + "/batch/" + ids).request()
                .header(HttpHeaders.AUTHORIZATION, jwt)
                .header(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON)
                .delete();
    }

    public String url(long projectId) {
        return baseUrl() + "/projects/" + projectId + "/symbols";
    }

    public String url(long projectId, long symbolId) {
        return baseUrl() + "/projects/" + projectId + "/symbols/" + symbolId;
    }
}
