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
import {IHttpService, IPromise} from 'angular';

/** The resource for symbol parameters. */
export class SymbolParameterResource {

  /**
   * Constructor.
   *
   * @param $http
   */
  /* @ngInject */
  constructor(private $http: IHttpService) {
  }

  /**
   * Create a symbol parameter.
   *
   * @param projectId The id of the project.
   * @param symbolId The id of the symbol.
   * @param parameter The parameter to create.
   */
  create(projectId: number, symbolId: number, parameter: any): IPromise<any> {
    return this.$http.post(this.url(projectId, symbolId), parameter)
      .then(res => res.data);
  }

  /**
   * update a symbol parameter.
   *
   * @param projectId The id of the project.
   * @param symbolId The id of the symbol.
   * @param parameter The parameter to create.
   */
  update(projectId: number, symbolId: number, parameter: any): IPromise<any> {
    return this.$http.put(`${this.url(projectId, symbolId)}/${parameter.id}`, parameter)
      .then(res => res.data);
  }

  /**
   * Delete a symbol parameter.
   *
   * @param projectId The id of the project.
   * @param symbolId The id of the symbol.
   * @param parameterId The id of  the parameter.
   */
  remove(projectId: number, symbolId: number, parameterId: number): IPromise<any> {
    return this.$http.delete(`${this.url(projectId, symbolId)}/${parameterId}`);
  }

  private url(projectId: number, symbolId: number) {
    return `${apiUrl}/projects/${projectId}/symbols/${symbolId}/parameters`;
  }
}
