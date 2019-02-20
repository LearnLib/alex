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

package de.learnlib.alex.webhooks.dao;

import de.learnlib.alex.auth.entities.User;
import de.learnlib.alex.common.exceptions.NotFoundException;
import de.learnlib.alex.webhooks.entities.EventType;
import de.learnlib.alex.webhooks.entities.Webhook;
import org.apache.shiro.authz.UnauthorizedException;

import javax.validation.ValidationException;
import java.util.List;

/**
 * The DAO for webhooks.
 */
public interface WebhookDAO {

    /**
     * Create a new webhook.
     *
     * @param user
     *         The user that registers the webhook.
     * @param webhook
     *         The webhook to register.
     * @return The created webhook.
     * @throws ValidationException
     *         If a webhook with the same URL is already registerd.
     */
    Webhook create(User user, Webhook webhook) throws ValidationException;

    /**
     * Get all webhooks of a user.
     *
     * @param user
     *         The user.
     * @return The list of registered webhooks.
     */
    List<Webhook> getAll(User user);

    /**
     * Get all webhooks of a user that contains a specific event.
     *
     * @param user
     *         The user.
     * @param event
     *         The event.
     * @return The webhooks of the user that contain the event.
     */
    List<Webhook> getByUserAndEvent(User user, EventType event);

    /**
     * Delete a webhook.
     *
     * @param user
     *         The user.
     * @param id
     *         The id of the webhook.
     * @throws NotFoundException
     *         If the webhook with the given id cannot be found.
     */
    void delete(User user, Long id) throws NotFoundException;

    /**
     * Delete multiple webhooks at once.
     *
     * @param user
     *         The user.
     * @param ids
     *         The ids of the webhooks to delete.
     * @throws NotFoundException
     *         If a webhook could not be found.
     */
    void delete(User user, List<Long> ids) throws NotFoundException;

    /**
     * Update an existing webhook.
     *
     * @param user
     *         The user.
     * @param webhook
     *         The updated webhook.
     * @return The updated webhook.
     * @throws NotFoundException
     *         If the webhook with the given id could not be found.
     * @throws ValidationException
     *         If another webhook with the URL is already registered.
     */
    Webhook update(User user, Webhook webhook) throws NotFoundException, ValidationException;

    /**
     * Checks if the user is allowed to access or modify a webhook.
     *
     * @param user
     *         The user.
     * @param webhook
     *         The webhook.
     * @throws NotFoundException
     *         If the webhook could not be found.
     * @throws UnauthorizedException
     *         If the user is not allowed to access the webhook.
     */
    void checkAccess(User user, Webhook webhook) throws NotFoundException, UnauthorizedException;
}
