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

import { Counter } from '../../entities/counter';
import { BaseApiService } from './base-api.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EnvironmentProvider } from '../../../environments/environment.provider';

/**
 * The service that communicates with the API in order to read and delete counters.
 */
@Injectable()
export class CounterApiService extends BaseApiService {

  constructor(private http: HttpClient, private env: EnvironmentProvider) {
    super();
  }

  /**
   * Fetches all counters from the server.
   *
   * @param projectId The id of a project.
   * @returns angular promise object of the request.
   */
  getAll(projectId: number): Observable<Counter[]> {
    return this.http.get(`${this.env.apiUrl}/projects/${projectId}/counters`, this.defaultHttpOptions)
      .pipe(
        map((body: any) => body.map(c => Counter.fromData(c)))
      );
  }

  /**
   * Creates a counter.
   *
   * @param projectId The id of the project.
   * @param counter The counter to create.
   */
  create(projectId: number, counter: Counter): Observable<Counter> {
    return this.http.post(`${this.env.apiUrl}/projects/${projectId}/counters`, counter, this.defaultHttpOptions)
      .pipe(
        map(body => Counter.fromData(body))
      );
  }

  /**
   * Updates a counter.
   *
   * @param projectId The id of the project.
   * @param counter The counter to update.
   */
  update(projectId: number, counter: Counter): Observable<Counter> {
    return this.http.put(`${this.env.apiUrl}/projects/${projectId}/counters/${counter.id}`, counter, this.defaultHttpOptions)
      .pipe(
        map(body => Counter.fromData(body))
      );
  }

  /**
   * Deletes a single file from the server.
   *
   * @param projectId The id of a project.
   * @param counter The counter to delete.
   * @returns angular promise object of the request.
   */
  remove(projectId: number, counter: Counter): Observable<any> {
    return this.http.delete(`${this.env.apiUrl}/projects/${projectId}/counters/${counter.id}`, this.defaultHttpOptions);
  }

  /**
   * Deletes multiple files from the server.
   *
   * @param projectId The id of a project.
   * @param counters A list of counters to delete.
   * @returns angular promise object of the request.
   */
  removeMany(projectId: number, counters: Counter[]): Observable<any> {
    const ids = counters.map(c => c.id).join(',');
    return this.http.delete(`${this.env.apiUrl}/projects/${projectId}/counters/batch/${ids}`, this.defaultHttpOptions);
  }
}
