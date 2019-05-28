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

import {apiUrl} from '../../../../environments';
import {IHttpService, IPromise} from 'angular';

/**
 * The resource for webhooks.
 */
export class WebhookResource {

  /**
   * Constructor.
   *
   * @param $http
   */
  /* @ngInject */
  constructor(private $http: IHttpService) {
  }

  /**
   * Get all available events.
   *
   * @return The events.
   */
  getEvents(): IPromise<any> {
    return this.$http.get(`${this.url()}/events`)
      .then((response) => response.data);
  }

  /**
   * Get all webhooks of a user.
   *
   * @return The webhooks.
   */
  getAll(): IPromise<any> {
    return this.$http.get(this.url())
      .then((response) => response.data);
  }

  /**
   * Create a webhook.
   *
   * @param webhook The webhook to create.
   * @return The created webhook.
   */
  create(webhook: any): IPromise<any> {
    return this.$http.post(this.url(), webhook)
      .then((response) => response.data);
  }

  /**
   * Update a webhook.
   *
   * @param webhook The webhook to update.
   * @return The updated webhook.
   */
  update(webhook: any): IPromise<any> {
    return this.$http.put(this.url(), webhook)
      .then((response) => response.data);
  }

  /**
   * Deletes a webhook.
   *
   * @param webhook The webhook to delete.
   * @return The HTTP promise.
   */
  remove(webhook: any): IPromise<any> {
    return this.$http.delete(`${this.url()}/${webhook.id}`);
  }

  /**
   * Deletes many webhooks at once.
   *
   * @param webhooks The webhooks to delete.
   * @return the HTTP promise.
   */
  removeMany(webhooks: any[]): IPromise<any> {
    const ids = webhooks.map((w) => w.id).join(',');
    return this.$http.delete(`${this.url()}/batch/${ids}`);
  }

  private url(): string {
    return `${apiUrl}/webhooks`;
  }
}
