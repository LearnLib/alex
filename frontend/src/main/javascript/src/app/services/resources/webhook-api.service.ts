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

import { environment as env } from '../../../environments/environment';
import { BaseApiService } from './base-api.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Webhook } from '../../entities/webhook';
import { map } from 'rxjs/operators';

/**
 * The resource for webhooks.
 */
@Injectable()
export class WebhookApiService extends BaseApiService {

  constructor(private http: HttpClient) {
    super()
  }

  /**
   * Get all available events.
   *
   * @return The events.
   */
  getEvents(): Observable<any> {
    return this.http.get(`${this.url()}/events`, this.defaultHttpOptions);
  }

  /**
   * Get all webhooks of a user.
   *
   * @return The webhooks.
   */
  getAll(): Observable<Webhook[]> {
    return this.http.get(this.url(), this.defaultHttpOptions)
      .pipe(
        map((body: any) => body.map(w => Webhook.fromData(w)))
      );
  }

  /**
   * Create a webhook.
   *
   * @param webhook The webhook to create.
   * @return The created webhook.
   */
  create(webhook: Webhook): Observable<Webhook> {
    return this.http.post(this.url(), webhook, this.defaultHttpOptions)
      .pipe(
        map(body => Webhook.fromData(body))
      );
  }

  /**
   * Update a webhook.
   *
   * @param webhook The webhook to update.
   * @return The updated webhook.
   */
  update(webhook: Webhook): Observable<Webhook> {
    return this.http.put(this.url(), webhook, this.defaultHttpOptions)
      .pipe(
        map(body => Webhook.fromData(body))
      );
  }

  /**
   * Deletes a webhook.
   *
   * @param webhook The webhook to delete.
   * @return The HTTP promise.
   */
  remove(webhook: Webhook): Observable<any> {
    return this.http.delete(`${this.url()}/${webhook.id}`, this.defaultHttpOptions);
  }

  /**
   * Deletes many webhooks at once.
   *
   * @param webhooks The webhooks to delete.
   * @return the HTTP promise.
   */
  removeMany(webhooks: Webhook[]): Observable<any> {
    const ids = webhooks.map((w) => w.id).join(',');
    return this.http.delete(`${this.url()}/batch/${ids}`, this.defaultHttpOptions);
  }

  private url(): string {
    return `${env.apiUrl}/webhooks`;
  }
}
