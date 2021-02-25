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

package de.learnlib.alex.integrationtests.resources;

import de.learnlib.alex.integrationtests.resources.api.SettingsApi;
import de.learnlib.alex.integrationtests.resources.api.UserApi;
import de.learnlib.alex.settings.entities.Settings;
import org.junit.Before;
import org.junit.Test;
import org.skyscreamer.jsonassert.JSONAssert;
import org.springframework.http.HttpStatus;

import javax.ws.rs.core.Response;

import static org.junit.Assert.assertEquals;

public class SettingsResourceIT extends AbstractResourceIT {

    private SettingsApi settingsApi;

    private String adminJwt;
    private String userJwt;

    @Before
    public void pre() {
        this.settingsApi = new SettingsApi(client, port);

        final UserApi userApi = new UserApi(client, port);
        userApi.create("{\"email\":\"test@test.de\",\"username\":\"test\",\"password\":\"test\"}");

        adminJwt = userApi.login("admin@alex.example", "admin");
        userJwt = userApi.login("test@test.de", "test");
    }

    @Test
    public void anonymousUserShouldGetSettings() throws Exception {
        shouldGetSettings(null);
    }

    @Test
    public void registeredUserShouldGetSettings() throws Exception {
        shouldGetSettings(userJwt);
    }

    @Test
    public void adminShouldGetSettings() throws Exception {
        shouldGetSettings(adminJwt);
    }

    @Test
    public void anonymousUserShouldNotUpdateSettings() throws Exception {
        shouldNotUpdateSettings(null);
    }

    @Test
    public void registeredUserShouldNotUpdateSettings() throws Exception {
        shouldNotUpdateSettings(userJwt);
    }

    @Test
    public void adminShouldUpdateSettings() throws Exception {
        final Response res = settingsApi.get();
        final Settings settings = res.readEntity(Settings.class);

        settings.setAllowUserRegistration(false);

        final Response res2 = settingsApi.update(settings, adminJwt);
        assertEquals(HttpStatus.OK.value(), res2.getStatus());
        JSONAssert.assertEquals(objectMapper.writeValueAsString(settings), res2.readEntity(String.class), true);

        final Response res3 = settingsApi.get();
        JSONAssert.assertEquals(objectMapper.writeValueAsString(settings), res3.readEntity(String.class), true);
    }

    private void shouldNotUpdateSettings(String jwt) throws Exception {
        final Response res = settingsApi.get();
        final String settingsString = res.readEntity(String.class);
        final Settings settings = objectMapper.readValue(settingsString, Settings.class);

        settings.setAllowUserRegistration(!settings.isAllowUserRegistration());

        final Response res2 = jwt == null ? settingsApi.update(settings) : settingsApi.update(settings, jwt);
        assertEquals(HttpStatus.FORBIDDEN.value(), res2.getStatus());

        // settings unchanged?
        final Response res3 = settingsApi.get();
        JSONAssert.assertEquals(res3.readEntity(String.class), settingsString, true);
    }

    private void shouldGetSettings(String jwt) throws Exception {
        final Response res;
        if (jwt == null) {
            res = settingsApi.get();
        } else {
            res = settingsApi.get(jwt);
        }
        assertEquals(HttpStatus.OK.value(), res.getStatus());
        checkIsSettingsObject(res.readEntity(String.class));
    }

    private void checkIsSettingsObject(String body) throws Exception {
        objectMapper.readValue(body, Settings.class);
    }
}
