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

import de.learnlib.alex.settings.entities.Settings;
import javax.ws.rs.client.Client;
import javax.ws.rs.client.Entity;
import javax.ws.rs.core.HttpHeaders;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

public class SettingsApi extends AbstractApi {

    public SettingsApi(Client client, int port) {
        super(client, port);
    }

    public Response get() {
        return client.target(url()).request()
                .header(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON)
                .get();
    }

    public Response get(String jwt) {
        return client.target(url()).request()
                .header(HttpHeaders.AUTHORIZATION, jwt)
                .header(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON)
                .get();
    }

    public Response update(Settings settings) throws Exception {
        return client.target(url()).request()
                .header(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON)
                .put(Entity.json(objectMapper.writeValueAsString(settings)));
    }

    public Response update(Settings settings, String jwt) throws Exception {
        return client.target(url()).request()
                .header(HttpHeaders.AUTHORIZATION, jwt)
                .header(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON)
                .put(Entity.json(objectMapper.writeValueAsString(settings)));
    }

    public String url() {
        return baseUrl() + "/settings";
    }
}
