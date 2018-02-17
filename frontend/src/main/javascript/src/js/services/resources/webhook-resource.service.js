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

import {apiUrl} from '../../../../environments';

/**
 * The resource for webhooks.
 */
export class WebhookResource {

    /**
     * Constructor.
     *
     * @param $http
     */
    // @ngInject
    constructor($http) {
        this.$http = $http;
    }

    /**
     * Get all available events.
     *
     * @return {Promise<string[]>} The events.
     */
    getEvents() {
        return this.$http.get(`${this._uri()}/events`)
            .then((response) => response.data);
    }

    /**
     * Get all webhooks of a user.
     *
     * @return {Promise<Object>} The webhooks.
     */
    getAll() {
        return this.$http.get(this._uri())
            .then((response) => response.data);
    }

    /**
     * Create a webhook.
     *
     * @param {Object} webhook The webhook to create.
     * @return {Promise<Object>} The created webhook.
     */
    create(webhook) {
        return this.$http.post(this._uri(), webhook)
            .then((response) => response.data);
    }

    /**
     * Update a webhook.
     *
     * @param {Object} webhook The webhook to update.
     * @return {Promise<Object>} The updated webhook.
     */
    update(webhook) {
        return this.$http.put(this._uri(), webhook)
            .then((response) => response.data);
    }

    /**
     * Deletes a webhook.
     *
     * @param {Object} webhook The webhook to delete.
     * @return {Promise<Object>} The HTTP promise.
     */
    remove(webhook) {
        return this.$http.delete(`${this._uri()}/${webhook.id}`);
    }

    /**
     * Deletes many webhooks at once.
     *
     * @param {Object[]} webhooks The webhooks to delete.
     * @return {Promise<Object>} the HTTP promise.
     */
    removeMany(webhooks) {
        const ids = webhooks.map((w) => w.id).join(',');
        return this.$http.delete(`${this._uri()}/batch/${ids}`);
    }

    _uri() {
        return `${apiUrl}/webhooks`;
    }
}
