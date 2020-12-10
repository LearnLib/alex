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

package de.learnlib.alex.webhooks.rest;

import de.learnlib.alex.auth.entities.User;
import de.learnlib.alex.security.AuthContext;
import de.learnlib.alex.webhooks.dao.WebhookDAO;
import de.learnlib.alex.webhooks.entities.EventType;
import de.learnlib.alex.webhooks.entities.Webhook;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.ws.rs.core.MediaType;
import java.util.ArrayList;
import java.util.EnumSet;
import java.util.List;

/**
 * The resource for webhooks.
 */
@RestController
@RequestMapping("/rest/webhooks")
public class WebhookResource {

    private static final Logger LOGGER = LogManager.getLogger();

    private final AuthContext authContext;
    private final WebhookDAO webhookDAO;

    /**
     * Constructor.
     *
     * @param webhookDAO
     *         The {@link WebhookDAO} to use.
     */
    @Autowired
    public WebhookResource(AuthContext authContext, WebhookDAO webhookDAO) {
        this.authContext = authContext;
        this.webhookDAO = webhookDAO;
    }

    /**
     * Create a new webhook.
     *
     * @param webhook
     *         The webhook to create.
     * @return The created webhook.
     */
    @PostMapping(
            consumes = MediaType.APPLICATION_JSON,
            produces = MediaType.APPLICATION_JSON
    )
    public ResponseEntity<Webhook> create(@RequestBody Webhook webhook) {
        final User user = authContext.getUser();
        LOGGER.traceEntry("create '{}' for user '{}'", webhook, user);

        final Webhook createdWebhook = webhookDAO.create(user, webhook);
        LOGGER.traceExit(createdWebhook);
        return ResponseEntity.ok(createdWebhook);
    }

    /**
     * Get all webhooks for the user that is logged in.
     *
     * @return The list of registered webhooks.
     */
    @GetMapping(
            produces = MediaType.APPLICATION_JSON
    )
    public ResponseEntity<List<Webhook>> get() {
        final User user = authContext.getUser();
        LOGGER.traceEntry("get webhooks for user '{}'", user);
        final List<Webhook> webhooks = webhookDAO.getAll(user);
        LOGGER.traceExit(webhooks);
        return ResponseEntity.ok(webhooks);
    }

    /**
     * Update a webhook.
     *
     * @param webhookId
     *         The ID of the webhook to update.
     * @param webhook
     *         The updated webhook.
     * @return The updated webhook on success.
     */
    @PutMapping(
            value = "/{webhookId}",
            consumes = MediaType.APPLICATION_JSON,
            produces = MediaType.APPLICATION_JSON
    )
    public ResponseEntity<Webhook> update(@PathVariable("webhookId") Long webhookId, @RequestBody Webhook webhook) {
        final User user = authContext.getUser();
        LOGGER.traceEntry("update webhook '{}' for user '{}'", webhook, user);

        final Webhook updatedWebhook = webhookDAO.update(user, webhookId, webhook);
        LOGGER.traceExit("Webhook '{}' updated", updatedWebhook);
        return ResponseEntity.ok(updatedWebhook);
    }

    /**
     * Delete a webhook.
     *
     * @param webhookId
     *         The id of the webhook.
     * @return No no content on success.
     */
    @DeleteMapping(
            value = "/{webhookId}",
            produces = MediaType.APPLICATION_JSON
    )
    public ResponseEntity<?> delete(@PathVariable("webhookId") Long webhookId) {
        final User user = authContext.getUser();
        LOGGER.traceEntry("delete webhook '{}' for user '{}'", webhookId, user);

        webhookDAO.delete(user, webhookId);
        LOGGER.traceExit("Webhook {} deleted", webhookId);
        return ResponseEntity.noContent().build();
    }

    /**
     * Deletes multiple webhooks at once.
     *
     * @param webhookIds
     *         The list of ids of the webhooks to delete.
     * @return Not content on success.
     */
    @DeleteMapping(
            value = "/batch/{webhookIds}",
            produces = MediaType.APPLICATION_JSON
    )
    public ResponseEntity<?> delete(@PathVariable("webhookIds") List<Long> webhookIds) {
        final User user = authContext.getUser();
        LOGGER.traceEntry("delete webhooks '{}' for user '{}'", webhookIds, user);

        webhookDAO.delete(user, webhookIds);
        LOGGER.traceExit("Webhooks {} deleted", webhookIds);
        return ResponseEntity.noContent().build();
    }

    /**
     * Get all available events a user can subscribe to.
     *
     * @return All available events.
     */
    @GetMapping(
            value = "/events",
            produces = MediaType.APPLICATION_JSON
    )
    public ResponseEntity<List<EventType>> getEvents() {
        LOGGER.traceEntry("getEvents");
        final List<EventType> eventTypes = new ArrayList<>(EnumSet.allOf(EventType.class));
        LOGGER.traceExit(eventTypes);
        return ResponseEntity.ok(eventTypes);
    }
}
