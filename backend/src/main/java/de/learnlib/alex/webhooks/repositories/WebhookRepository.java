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

package de.learnlib.alex.webhooks.repositories;

import de.learnlib.alex.webhooks.entities.Webhook;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

/** The repository for webhooks. */
@Repository
public interface WebhookRepository extends JpaRepository<Webhook, UUID> {

    /**
     * Get a webhook by user id and webhook url.
     *
     * @param userId The id of the user.
     * @param url    The url of the webhook.
     * @return The webhook.
     */
    Webhook findByUser_IdAndUrl(Long userId, String url);

    /**
     * Get a webhook by user id and webhook id.
     *
     * @param userId The id of the user.
     * @param id     The id of the webhook.
     * @return The webhook.
     */
    Webhook findByUser_IdAndId(Long userId, Long id);

    /**
     * Get all webhooks of a user.
     *
     * @param userId The id of the user.
     * @return The list of webhooks.
     */
    List<Webhook> findByUser_id(Long userId);

    /**
     * Get the highest id of all webhooks of a user.
     *
     * @param userId The id of the user.
     * @return The highest known id.
     */
    @Query("SELECT MAX(w.id) FROM Webhook w WHERE w.user.id = ?1")
    Long findHighestId(Long userId);
}
