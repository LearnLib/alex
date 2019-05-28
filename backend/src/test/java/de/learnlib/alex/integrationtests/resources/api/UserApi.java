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

import com.jayway.jsonpath.JsonPath;

import javax.ws.rs.client.Client;
import javax.ws.rs.client.Entity;
import javax.ws.rs.core.HttpHeaders;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.List;
import java.util.stream.Collectors;

public class UserApi extends AbstractApi {

    public UserApi(Client client, int port) {
        super(client, port);
    }

    public Response create(String user) {
        return client.target(url()).request()
                .post(Entity.json(user));
    }

    public String login(String email, String password) {
        final Response res = client.target(url() + "/login").request()
                .post(Entity.json("{\"email\":\"" + email + "\",\"password\":\"" + password + "\"}"));

        return "Bearer " + JsonPath.read(res.readEntity(String.class), "token");
    }

    public Response create(String user, String jwt) {
        return client.target(url()).request()
                .header(HttpHeaders.AUTHORIZATION, jwt)
                .post(Entity.json(user));
    }

    public Response getAll(String jwt) {
        return client.target(url()).request()
                .header(HttpHeaders.AUTHORIZATION, jwt)
                .header(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON)
                .get();
    }

    public Response delete(int userId, String jwt) {
        return client.target(url() + "/" + userId).request()
                .header(HttpHeaders.AUTHORIZATION, jwt)
                .delete();
    }

    public Response delete(List<Integer> userIds, String jwt) {
        final List<String> ids = userIds.stream().map(String::valueOf).collect(Collectors.toList());
        return client.target(url() + "/batch/" + String.join(",", ids)).request()
                .header(HttpHeaders.AUTHORIZATION, jwt)
                .delete();
    }

    public Response demote(int userId, String jwt) {
        return client.target(url() + "/" + userId + "/demote").request()
                .header(HttpHeaders.AUTHORIZATION, jwt)
                .put(Entity.json(""));
    }

    public Response promote(int userId, String jwt) {
        return client.target(url() + "/" + userId + "/promote").request()
                .header(HttpHeaders.AUTHORIZATION, jwt)
                .put(Entity.json(""));
    }

    public String url() {
        return baseUrl() + "/users";
    }
}
