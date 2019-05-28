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
import {Counter} from '../../entities/counter';
import {IHttpService, IPromise} from 'angular';

/**
 * The service that communicates with the API in order to read and delete counters.
 */
export class CounterResource {

  /**
   * Constructor.
   *
   * @param $http
   */
  /* @ngInject */
  constructor(private $http: IHttpService) {
  }

  /**
   * Fetches all counters from the server.
   *
   * @param projectId The id of a project.
   * @returns angular promise object of the request.
   */
  getAll(projectId: number): IPromise<any> {
    return this.$http.get(`${apiUrl}/projects/${projectId}/counters`)
      .then(response => (<any[]> response.data).map(c => new Counter(c)));
  }

  /**
   * Creates a counter.
   *
   * @param projectId The id of the project.
   * @param counter The counter to create.
   */
  create(projectId: number, counter: Counter): IPromise<any> {
    return this.$http.post(`${apiUrl}/projects/${projectId}/counters`, counter)
      .then(response => new Counter(response.data));
  }

  /**
   * Updates a counter.
   *
   * @param projectId The id of the project.
   * @param counter The counter to update.
   */
  update(projectId: number, counter: Counter): IPromise<any> {
    return this.$http.put(`${apiUrl}/projects/${projectId}/counters/${counter.name}`, counter)
      .then(response => new Counter(response.data));
  }

  /**
   * Deletes a single file from the server.
   *
   * @param projectId The id of a project.
   * @param counter The counter to delete.
   * @returns angular promise object of the request.
   */
  remove(projectId: number, counter: Counter): IPromise<any> {
    return this.$http.delete(`${apiUrl}/projects/${projectId}/counters/${counter.name}`);
  }

  /**
   * Deletes multiple files from the server.
   *
   * @param projectId The id of a project.
   * @param counters A list of counters to delete.
   * @returns angular promise object of the request.
   */
  removeMany(projectId: number, counters: Counter[]): IPromise<any> {
    const names = counters.map(c => c.name).join(',');
    return this.$http.delete(`${apiUrl}/projects/${projectId}/counters/batch/${names}`);
  }
}
