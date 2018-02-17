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

package de.learnlib.alex.webhooks.rest;

import de.learnlib.alex.auth.entities.User;
import de.learnlib.alex.auth.security.UserPrincipal;
import de.learnlib.alex.common.exceptions.NotFoundException;
import de.learnlib.alex.common.utils.IdsList;
import de.learnlib.alex.common.utils.ResourceErrorHandler;
import de.learnlib.alex.webhooks.dao.WebhookDAO;
import de.learnlib.alex.webhooks.entities.EventType;
import de.learnlib.alex.webhooks.entities.Webhook;

import javax.annotation.security.RolesAllowed;
import javax.inject.Inject;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.SecurityContext;
import javax.xml.bind.ValidationException;
import java.util.ArrayList;
import java.util.EnumSet;
import java.util.List;

@Path("/webhooks")
@RolesAllowed({"REGISTERED"})
public class WebhookResource {

    /** The security context containing the user of the request. */
    @Context
    private SecurityContext securityContext;

    /** The {@link WebhookDAO} to use. */
    private WebhookDAO webhookDAO;

    /**
     * Constructor.
     *
     * @param webhookDAO The {@link WebhookDAO} to use.
     */
    @Inject
    public WebhookResource(WebhookDAO webhookDAO) {
        this.webhookDAO = webhookDAO;
    }

    /**
     * Create a new webhook.
     *
     * @param webhook The webhook to create.
     * @return The created webhook.
     */
    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response create(Webhook webhook) {
        User user = ((UserPrincipal) securityContext.getUserPrincipal()).getUser();

        try {
            webhookDAO.create(user, webhook);
        } catch (ValidationException e) {
            return ResourceErrorHandler.createRESTErrorMessage("Webhook.create", Response.Status.BAD_REQUEST, e);
        }

        return Response.ok(webhook).build();
    }

    /**
     * Get all webhooks for the user that is logged in.
     *
     * @return The list of registered webhooks.
     */
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response get() {
        User user = ((UserPrincipal) securityContext.getUserPrincipal()).getUser();
        final List<Webhook> webhooks = webhookDAO.getAll(user);
        return Response.ok(webhooks).build();
    }

    /**
     * Update a webhook.
     *
     * @param webhook The updated webhook.
     * @return The updated webhook on success.
     */
    @PUT
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response update(Webhook webhook) {
        User user = ((UserPrincipal) securityContext.getUserPrincipal()).getUser();

        try {
            webhookDAO.update(user, webhook);
        } catch (NotFoundException | ValidationException e) {
            return ResourceErrorHandler.createRESTErrorMessage("Webhook.update", Response.Status.BAD_REQUEST, e);
        }

        return Response.ok(webhook).build();
    }

    /**
     * Delete a webhook.
     *
     * @param webhookId The id of the webhook.
     * @return No no content on success.
     */
    @DELETE
    @Path("/{webhookId}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response delete(@PathParam("webhookId") Long webhookId) {
        User user = ((UserPrincipal) securityContext.getUserPrincipal()).getUser();

        try {
            webhookDAO.delete(user, webhookId);
        } catch (NotFoundException e) {
            return ResourceErrorHandler.createRESTErrorMessage("Webhook.delete", Response.Status.BAD_REQUEST, e);
        }

        return Response.noContent().build();
    }

    /**
     * Deletes multiple webhooks at once.
     *
     * @param webhookIds The list of ids of the webhooks to delete.
     * @return Not content on success.
     */
    @DELETE
    @Path("/batch/{webhookIds}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response delete(@PathParam("webhookIds") IdsList webhookIds) {
        User user = ((UserPrincipal) securityContext.getUserPrincipal()).getUser();

        try {
            webhookDAO.delete(user, webhookIds);
        } catch (NotFoundException e) {
            return ResourceErrorHandler.createRESTErrorMessage("Webhook.delete", Response.Status.BAD_REQUEST, e);
        }

        return Response.noContent().build();
    }

    /**
     * Get all available events a user can subscribe to.
     *
     * @return All available events.
     */
    @GET
    @Path("/events")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getEvents() {
        final List<EventType> eventTypes = new ArrayList<>(EnumSet.allOf(EventType.class));
        return Response.ok(eventTypes).build();
    }
}
