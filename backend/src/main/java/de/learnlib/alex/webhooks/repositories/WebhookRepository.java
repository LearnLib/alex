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

package de.learnlib.alex.webhooks.repositories;

import de.learnlib.alex.webhooks.entities.EventType;
import de.learnlib.alex.webhooks.entities.Webhook;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/** The repository for webhooks. */
@Repository
public interface WebhookRepository extends JpaRepository<Webhook, Long> {

    /**
     * Get a webhook by user id and webhook url.
     *
     * @param userId
     *         The id of the user.
     * @param url
     *         The url of the webhook.
     * @return The webhook.
     */
    Webhook findByUser_IdAndUrl(Long userId, String url);

    /**
     * Get all webhooks of a user.
     *
     * @param userId
     *         The id of the user.
     * @return The list of webhooks.
     */
    List<Webhook> findByUser_id(Long userId);

    List<Webhook> findAllByEventsContains(EventType event);
}
