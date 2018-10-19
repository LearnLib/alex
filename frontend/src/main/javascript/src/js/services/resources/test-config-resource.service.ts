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

/**
 * The resource for test configs.
 */
export class TestConfigResource {

  /**
   * Constructor.
   *
   * @param $http
   */
  /* @ngInject */
  constructor(private $http: IHttpService) {
  }

  /**
   * Get all test configs in the project.
   *
   * @param projectId The id of the project.
   */
  getAll(projectId: number): IPromise<any> {
    return this.$http.get(this.url(projectId))
      .then(res => res.data);
  }

  /**
   * Create a test config.
   *
   * @param projectId The id of the project.
   * @param config The config to create.
   */
  create(projectId: number, config: any): IPromise<any> {
    return this.$http.post(this.url(projectId), config)
      .then(res => res.data);
  }

  /**
   * Delete a tes config.
   *
   * @param projectId The id of the project.
   * @param configId The id of the config to delete.
   */
  remove(projectId: number, configId: number): IPromise<any> {
    return this.$http.delete(`${this.url(projectId)}/${configId}`);
  }

  private url(projectId: number) {
    return `${apiUrl}/projects/${projectId}/testConfigs`;
  }
}
