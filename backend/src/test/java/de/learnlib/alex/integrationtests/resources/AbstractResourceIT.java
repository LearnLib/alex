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

package de.learnlib.alex.integrationtests.resources;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.jayway.jsonpath.JsonPath;
import de.learnlib.alex.settings.entities.Settings;
import org.junit.After;
import org.junit.Before;
import org.junit.runner.RunWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.web.server.LocalServerPort;
import org.springframework.http.HttpStatus;
import org.springframework.test.context.junit4.SpringRunner;

import javax.ws.rs.client.Client;
import javax.ws.rs.client.ClientBuilder;
import javax.ws.rs.client.Entity;
import javax.ws.rs.core.HttpHeaders;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.ArrayList;
import java.util.List;

import static org.junit.Assert.assertEquals;

@RunWith(SpringRunner.class)
@SpringBootTest(
        webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT
)
public abstract class AbstractResourceIT {

    protected static final String ADMIN_EMAIL = "admin@alex.example";

    protected static final String ADMIN_PASSWORD = "admin";

    @LocalServerPort
    protected int port;

    protected Client client = ClientBuilder.newClient();

    protected ObjectMapper objectMapper = new ObjectMapper();

    protected String baseUrl() {
        return "http://localhost:" + port + "/rest";
    }

    @Before
    public void pre() {
    }

    @After
    public void post() throws Exception {
        final Response res1 = client.target(baseUrl() + "/users/login").request()
                .post(Entity.json("{\"email\":\"" + ADMIN_EMAIL + "\",\"password\":\"" + ADMIN_PASSWORD + "\"}"));

        assertEquals(HttpStatus.OK.value(), res1.getStatus());

        final String token = "Bearer " + JsonPath.read(res1.readEntity(String.class), "token");

        deleteAllUsersExceptTheDefaultAdmin(token);
        deleteAllProjectsOfDefaultAdmin(token);
        resetSettings(token);
    }

    private void resetSettings(String token) throws Exception {
        final Settings settings = new Settings();
        settings.setAllowUserRegistration(true);

        final Response res = client.target(baseUrl() + "/settings").request()
                .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON)
                .header(HttpHeaders.AUTHORIZATION, token)
                .put(Entity.json(objectMapper.writeValueAsString(settings)));

        assertEquals(HttpStatus.OK.value(), res.getStatus());
    }

    private void deleteAllUsersExceptTheDefaultAdmin(String token) throws Exception {
        final Response res2 = client.target(baseUrl() + "/users").request()
                .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON)
                .header(HttpHeaders.AUTHORIZATION, token)
                .get();

        final List<String> userIds = new ArrayList<>();

        final JsonNode users = objectMapper.readTree(res2.readEntity(String.class));
        users.forEach(user -> {
            final String userId = user.get("id").asText();
            if (!userId.equals("1")) {
                userIds.add(userId);
            }
        });

        if (!userIds.isEmpty()) {
            final Response res3 = client.target(baseUrl() + "/users/batch/" + String.join(",", userIds)).request()
                    .header(HttpHeaders.AUTHORIZATION, token)
                    .delete();

            assertEquals(HttpStatus.NO_CONTENT.value(), res3.getStatus());
        }
    }

    private void deleteAllProjectsOfDefaultAdmin(String token) throws Exception {
        final Response res1 = client.target(baseUrl() + "/projects").request()
                .header(HttpHeaders.AUTHORIZATION, token)
                .header(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON)
                .get();

        final JsonNode projects = objectMapper.readTree(res1.readEntity(String.class));
        projects.forEach(project -> {
            final String projectId = project.get("id").asText();
            final Response res2 = client.target(baseUrl() + "/projects/" + projectId).request()
                    .header(HttpHeaders.AUTHORIZATION, token)
                    .delete();

            assertEquals(HttpStatus.NO_CONTENT.value(), res2.getStatus());
        });
    }

    protected void checkIsRestError(String body) throws Exception {
        JsonPath.read(body, "statusCode");
        JsonPath.read(body, "statusText");
        JsonPath.read(body, "message");
    }
}
