/*
 * Copyright 2015 - 2022 TU Dortmund
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

import com.fasterxml.jackson.databind.ObjectMapper;
import de.learnlib.alex.auth.entities.User;
import de.learnlib.alex.webhooks.dao.WebhookDAO;
import de.learnlib.alex.webhooks.entities.Event;
import de.learnlib.alex.webhooks.entities.Webhook;
import de.learnlib.alex.webhooks.repositories.WebhookRepository;
import org.glassfish.jersey.client.ClientProperties;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.ws.rs.client.Client;
import javax.ws.rs.client.ClientBuilder;
import javax.ws.rs.client.Entity;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.List;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

/**
 * The service that emits events to all remote subscribers.
 */
@Service
public class WebhookService {

    private static final Logger logger = LoggerFactory.getLogger(WebhookService.class);

    /** The client timeout. */
    private static final int READ_CONNECT_TIMEOUT = 3000;

    /** The maximum number of threads to use for sending http requests. */
    private static final int MAX_THREADS = 4;

    /** HTTP client. */
    private final Client client;

    /** The webhook DAO to use. */
    private final WebhookDAO webhookDAO;

    private final WebhookRepository webhookRepository;

    /** The thread executor for webhooks. */
    private final ExecutorService executorService;

    private final ObjectMapper objectMapper;

    @Autowired
    public WebhookService(WebhookDAO webhookDAO, WebhookRepository webhookRepository, ObjectMapper objectMapper) {
        this.webhookDAO = webhookDAO;
        this.webhookRepository = webhookRepository;
        this.objectMapper = objectMapper;
        this.client = ClientBuilder.newClient()
                .property(ClientProperties.READ_TIMEOUT, READ_CONNECT_TIMEOUT)
                .property(ClientProperties.CONNECT_TIMEOUT, READ_CONNECT_TIMEOUT);

        this.executorService = Executors.newFixedThreadPool(MAX_THREADS);
    }

    /**
     * Sends the event to all subscribers.
     *
     * @param user
     *         The user under which the event occurred.
     * @param event
     *         The event that occurred.
     * @param <T>
     *         The type of the event.
     */
    public <T> void fireEvent(User user, Event<T> event) {
        final List<Webhook> webhooks = webhookDAO.getByUserAndEvent(user, event.getEventType());
        triggerWebhooks(event, webhooks);
    }

    /**
     * Sends the event to all subscribers.
     *
     * @param event
     *         The event that occurred.
     * @param <T>
     *         The type of the event.
     */
    public <T> void fireEvent(Event<T> event) {
        final List<Webhook> webhooks = webhookDAO.getByEvent(event.getEventType());
        triggerWebhooks(event, webhooks);
    }

    private <T> void triggerWebhooks(Event<T> event, List<Webhook> webhooks) {
        for (final Webhook webhook : webhooks) {
            executorService.submit(() -> {
                try {
                    logger.info("Send {} to {} {}.", event, webhook.getMethod(), webhook.getUrl());
                    var request = client.target(webhook.getUrl()).request();

                    // set header
                    for (var header : webhook.getHeaders().entrySet()) {
                        request = request.header(header.getKey(), header.getValue());
                    }

                    final var body = objectMapper.writeValueAsString(event);
                    final var bodyEntity = Entity.entity(body, MediaType.APPLICATION_JSON);

                    final var response = switch (webhook.getMethod()) {
                        case GET -> request.get();
                        case POST -> request.post(bodyEntity);
                        case PUT -> request.put(bodyEntity);
                        case DELETE -> request.delete();
                    };

                    logger.info("Receive response from {} {} with status {}.", webhook.getMethod(), webhook.getUrl(), response.getStatus());
                } catch (Exception e) {
                    e.printStackTrace();
                }
            });

            if (webhook.getOnce()) {
                final Webhook webhookInDB = webhookRepository.findById(webhook.getId()).orElse(null);
                this.webhookRepository.delete(webhookInDB);
            }

        }
    }
}
