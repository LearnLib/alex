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

package de.learnlib.alex.webhooks.services;

import de.learnlib.alex.auth.entities.User;
import de.learnlib.alex.webhooks.dao.WebhookDAO;
import de.learnlib.alex.webhooks.entities.Event;
import de.learnlib.alex.webhooks.entities.Webhook;
import org.springframework.stereotype.Service;

import javax.inject.Inject;
import javax.ws.rs.client.Client;
import javax.ws.rs.client.ClientBuilder;
import javax.ws.rs.client.Entity;
import javax.ws.rs.core.MediaType;
import java.util.List;

/**
 * The service that emits events to all remote subscribers.
 */
@Service
public class WebhookService {

    /** HTTP client. */
    private final Client client;

    /** The webhook DAO to use. */
    private WebhookDAO webhookDAO;

    /**
     * Constructor.
     *
     * @param webhookDAO The injected webhook DAO.
     */
    @Inject
    public WebhookService(WebhookDAO webhookDAO) {
        this.webhookDAO = webhookDAO;
        this.client = ClientBuilder.newClient();
    }

    /**
     * Sends the event to all subscribers.
     *
     * @param user  The user under which the event occurred.
     * @param event The event that occurred.
     * @param <T>   The type of the event.
     */
    public <T> void fireEvent(User user, Event<T> event) {
        final List<Webhook> webhooks = webhookDAO.getByUserAndEvent(user, event.getEventType());
        for (final Webhook webhook : webhooks) {
            try {
                client.target(webhook.getUrl())
                        .request(MediaType.APPLICATION_JSON)
                        .async()
                        .post(Entity.json(event))
                        .get();
            } catch (Exception e) {
            }
        }
    }
}
