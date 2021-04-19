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

package de.learnlib.alex.webhooks.dao;

import de.learnlib.alex.auth.entities.User;
import de.learnlib.alex.common.exceptions.NotFoundException;
import de.learnlib.alex.webhooks.entities.EventType;
import de.learnlib.alex.webhooks.entities.Webhook;
import de.learnlib.alex.webhooks.repositories.WebhookRepository;
import java.util.List;
import java.util.stream.Collectors;
import javax.validation.ValidationException;
import org.apache.shiro.authz.UnauthorizedException;
import org.hibernate.Hibernate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * The implementation of the {@link WebhookDAO}.
 */
@Service
@Transactional(rollbackFor = Exception.class)
public class WebhookDAO {

    /**
     * The repository for webhooks.
     */
    private final WebhookRepository webhookRepository;

    /**
     * Constructor.
     *
     * @param webhookRepository
     *         The injected repository for webhooks.
     */
    @Autowired
    public WebhookDAO(WebhookRepository webhookRepository) {
        this.webhookRepository = webhookRepository;
    }

    public Webhook create(User user, Webhook webhook) {
        if (webhookRepository.findByUser_IdAndUrl(user.getId(), webhook.getUrl()) != null) {
            throw new ValidationException("A webhook under the given URL is already registered. "
                    + "Update the existing one instead.");
        }

        webhook.setUser(user);
        return webhookRepository.save(webhook);
    }

    public List<Webhook> getAll(User user) {
        final List<Webhook> webhooks = webhookRepository.findByUser_id(user.getId());
        webhooks.forEach(this::loadLazyRelations);
        return webhooks;
    }

    public List<Webhook> getByEvent(EventType event) {
        final List<Webhook> webhooks = webhookRepository.findAllByEventsContains(event);
        webhooks.forEach(this::loadLazyRelations);
        return webhooks;
    }

    public List<Webhook> getByUserAndEvent(User user, EventType event) {
        final List<Webhook> webhooks = webhookRepository.findByUser_id(user.getId()).stream()
                .filter(webhook -> webhook.getEvents().contains(event))
                .collect(Collectors.toList());
        webhooks.forEach(this::loadLazyRelations);
        return webhooks;
    }

    public void delete(User user, Long id) {
        final Webhook webhook = webhookRepository.findById(id).orElse(null);
        checkAccess(user, webhook);
        webhookRepository.delete(webhook);
    }

    public void delete(User user, List<Long> ids) {
        for (Long id : ids) {
            delete(user, id);
        }
    }

    public Webhook update(User user, Long webhookId, Webhook webhook) {
        final Webhook webhookInDb = webhookRepository.findById(webhookId).orElse(null);
        checkAccess(user, webhookInDb);

        // check if there is another webhook registered to the new URL.
        final Webhook webhookWithSameUrl = webhookRepository.findByUser_IdAndUrl(user.getId(), webhook.getUrl());
        if (webhookWithSameUrl != null && !webhook.getId().equals(webhookWithSameUrl.getId())) {
            throw new ValidationException("Another webhook is already registered to the URL.");
        }

        webhookInDb.setEvents(webhook.getEvents());
        webhookInDb.setUrl(webhook.getUrl());
        webhookInDb.setName(webhook.getName());

        return webhookRepository.save(webhookInDb);
    }

    public void checkAccess(User user, Webhook webhook) {
        if (webhook == null) {
            throw new NotFoundException("The webhook does not exist.");
        }

        if (!webhook.getUser().equals(user)) {
            throw new UnauthorizedException("You are not allowed to access the webhook.");
        }
    }

    private void loadLazyRelations(Webhook webhook) {
        Hibernate.initialize(webhook.getEvents());
    }
}
