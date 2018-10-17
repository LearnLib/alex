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
import {SymbolGroup} from '../../entities/symbol-group';
import {IHttpService, IPromise} from 'angular';

/**
 * The resource that handles http requests to the API to do CRUD operations on symbol groups.
 */
export class SymbolGroupResource {

  /**
   * Constructor.
   *
   * @param $http
   */
  // @ngInject
  constructor(private $http: IHttpService) {
  }

  /**
   * Fetches all symbol groups from the server.
   *
   * @param projectId The id of the project whose projects should be fetched.
   * @param includeSymbols If the symbols should be included.
   */
  getAll(projectId: number, includeSymbols = false): IPromise<any> {
    const params = includeSymbols ? '?embed=symbols' : '';

    return this.$http.get(`${apiUrl}/projects/${projectId}/groups${params}`)
      .then(response => (<any[]> response.data).map(g => new SymbolGroup(g)));
  }

  /**
   * Creates a new symbol group.
   *
   * @param projectId The id of the project of the symbol group.
   * @param group The object of the symbol group that should be created.
   */
  create(projectId: number, group: SymbolGroup): IPromise<any> {
    return this.$http.post(`${apiUrl}/projects/${projectId}/groups`, group)
      .then(response => new SymbolGroup(response.data));
  }

  createMany(projectId: number, groups: SymbolGroup[]): IPromise<any> {
    return this.$http.post(`${apiUrl}/projects/${projectId}/groups/batch`, groups)
      .then(res => (<any[]> res.data).map(g => new SymbolGroup(g)));
  }

  /**
   * Updates an existing symbol group.
   *
   * @param group The symbol group that should be updated.
   */
  update(group: SymbolGroup): IPromise<any> {
    return this.$http.put(`${apiUrl}/projects/${group.project}/groups/${group.id}`, group)
      .then(response => new SymbolGroup(response.data));
  }

  /**
   * Moves an existing symbol group.
   *
   * @param group The symbol group to move with the new parent.
   */
  move(group: SymbolGroup): IPromise<any> {
    return this.$http.put(`${apiUrl}/projects/${group.project}/groups/${group.id}/move`, group)
      .then(response => new SymbolGroup(response.data));
  }

  /**
   * Deletes a symbol group.
   *
   * @param group The symbol group that should be deleted.
   */
  remove(group: SymbolGroup): IPromise<any> {
    return this.$http.delete(`${apiUrl}/projects/${group.project}/groups/${group.id}`);
  }
}
