/*
 * Copyright 2018 TU Dortmund
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

import com.jayway.jsonpath.JsonPath;
import de.learnlib.alex.integrationtests.resources.api.UserApi;
import de.learnlib.alex.integrationtests.resources.api.WebhookApi;
import org.junit.Before;
import org.junit.Test;
import org.springframework.http.HttpStatus;

import javax.ws.rs.core.GenericType;
import javax.ws.rs.core.Response;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;

public class WebhookResourceIT extends AbstractResourceIT {

    private String jwtUser1;

    private String jwtUser2;

    private UserApi userApi;

    private WebhookApi webhookApi;

    @Before
    public void pre() {
        userApi = new UserApi(client, port);
        webhookApi = new WebhookApi(client, port);

        userApi.create("{\"email\":\"test1@test.de\",\"password\":\"test\"}");
        userApi.create("{\"email\":\"test2@test.de\",\"password\":\"test\"}");

        jwtUser1 = userApi.login("test1@test.de", "test");
        jwtUser2 = userApi.login("test2@test.de", "test");
    }

    @Test
    public void shouldCreateAWebhook() throws Exception {
        final String wh = createWebhookJson("test", "http://test", Arrays.asList("PROJECT_CREATED", "PROJECT_DELETED"));
        final Response res1 = webhookApi.create(wh, jwtUser1);

        assertEquals(HttpStatus.OK.value(), res1.getStatus());
        JsonPath.read(res1.readEntity(String.class), "$.id");
    }

    @Test
    public void shouldNotCreateAWebhookWithTheSameUrlTwice() throws Exception {
        final String wh1 = createWebhookJson("test", "http://test", Arrays.asList("PROJECT_CREATED", "PROJECT_DELETED"));
        final String wh2 = createWebhookJson("test", "http://test", Arrays.asList("PROJECT_CREATED", "PROJECT_DELETED"));
        webhookApi.create(wh1, jwtUser1);
        final Response res2 = webhookApi.create(wh2, jwtUser1);

        assertEquals(HttpStatus.BAD_REQUEST.value(), res2.getStatus());
        assertEquals(1, getNumberOfWebhooks(jwtUser1));
    }

    @Test
    public void shouldNotCreateWebhookWithEmptyEventList() throws Exception {
        final String wh1 = createWebhookJson("test", "http://test", new ArrayList<>());
        final Response res1 = webhookApi.create(wh1, jwtUser1);

        assertEquals(HttpStatus.BAD_REQUEST.value(), res1.getStatus());
        assertEquals(0, getNumberOfWebhooks(jwtUser1));
    }

    @Test
    public void shouldDeleteAWebhook() throws Exception {
        final String wh1 = createWebhookJson("test", "http://test", Arrays.asList("PROJECT_CREATED", "PROJECT_DELETED"));
        final Response res1 = webhookApi.create(wh1, jwtUser1);
        final Integer id = JsonPath.read(res1.readEntity(String.class), "id");
        final Response res2 = webhookApi.delete(id, jwtUser1);

        assertEquals(HttpStatus.NO_CONTENT.value(), res2.getStatus());
        assertEquals(0, getNumberOfWebhooks(jwtUser1));
    }

    @Test
    public void shouldDeleteWebhooks() throws Exception {
        final String wh1 = createWebhookJson("test", "http://test", Arrays.asList("PROJECT_CREATED", "PROJECT_DELETED"));
        final Response res1 = webhookApi.create(wh1, jwtUser1);
        final Integer id1 = JsonPath.read(res1.readEntity(String.class), "id");

        final String wh2 = createWebhookJson("test2", "http://test2", Arrays.asList("PROJECT_CREATED", "PROJECT_DELETED"));
        final Response res2 = webhookApi.create(wh2, jwtUser1);
        final Integer id2 = JsonPath.read(res2.readEntity(String.class), "id");

        final Response res3 = webhookApi.delete(Arrays.asList(id1, id2), jwtUser1);
        assertEquals(HttpStatus.NO_CONTENT.value(), res3.getStatus());
        assertEquals(0, getNumberOfWebhooks(jwtUser1));
    }

    @Test
    public void shouldNotDeleteAWebhookOfAnotherUser() throws Exception {
        final String wh = createWebhookJson("test", "http://test", Arrays.asList("PROJECT_CREATED", "PROJECT_DELETED"));
        final Response res1 = webhookApi.create(wh, jwtUser2);
        final Integer id = JsonPath.read(res1.readEntity(String.class), "id");

        final Response res2 = webhookApi.delete(id, jwtUser1);

        assertEquals(HttpStatus.UNAUTHORIZED.value(), res2.getStatus());
        assertEquals(1, getNumberOfWebhooks(jwtUser2));
    }

    @Test
    public void shouldFailToDeleteAnUnknownWebhook() throws Exception {
        final String wh1 = createWebhookJson("test", "http://test", Arrays.asList("PROJECT_CREATED", "PROJECT_DELETED"));
        webhookApi.create(wh1, jwtUser1);
        final String wh2 = createWebhookJson("test", "http://test", Arrays.asList("PROJECT_CREATED", "PROJECT_DELETED"));
        webhookApi.create(wh2, jwtUser2);

        final Response res = webhookApi.delete(-1, jwtUser1);
        assertEquals(HttpStatus.NOT_FOUND.value(), res.getStatus());
        assertEquals(1, getNumberOfWebhooks(jwtUser1));
        assertEquals(1, getNumberOfWebhooks(jwtUser2));
    }

    @Test
    public void shouldGetAllEvents() throws Exception {
        final Response res = webhookApi.getEvents(jwtUser1);
        final List<String> events = res.readEntity(new GenericType<List<String>>(){});
        assertFalse(events.isEmpty());
    }

    private int getNumberOfWebhooks(String jwt) throws Exception {
        final Response res = webhookApi.get(jwt);
        return objectMapper.readTree(res.readEntity(String.class)).size();
    }

    private String createWebhookJson(String name, String url, List<String> events) {
        events = events.stream().map(e -> "\"" + e + "\"").collect(Collectors.toList());
        return "{"
                + "\"name\":\"" + name + "\""
                + ",\"url\":\"" + url + "\""
                + ",\"events\":[" + String.join(",", events) + "]"
                + "}";
    }
}
