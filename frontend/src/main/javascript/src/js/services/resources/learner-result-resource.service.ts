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

import { apiUrl } from '../../../../environments';
import { LearnResult } from '../../entities/learner-result';
import { IHttpService, IPromise } from 'angular';

/**
 * The resource that handles http request to the API to do CRUD operations on learn results.
 */
export class LearnResultResource {

  /**
   * Constructor.
   *
   * @param $http
   */
  /* @ngInject */
  constructor(private $http: IHttpService) {
  }

  /**
   * Gets all final steps of all learn results.
   *
   * @param projectId The id of the project whose final learn results should be fetched.
   */
  getAll(projectId: number): IPromise<any> {
    return this.$http.get(`${apiUrl}/projects/${projectId}/results?embed=steps`)
      .then(response => (<any[]> response.data).map(r => new LearnResult(r)));
  }

  /**
   * Gets the final learn result of a test run.
   *
   * @param projectId The id of the project.
   * @param testNo The number of the test run.
   */
  get(projectId: number, testNo: number): IPromise<any> {
    return this.$http.get(`${apiUrl}/projects/${projectId}/results/${testNo}?embed=steps`)
      .then(response => new LearnResult(response.data));
  }

  /**
   * Get the latest learner result.
   *
   * @param projectId The id of the project.
   */
  getLatest(projectId: number): IPromise<any> {
    return this.$http.get(`${apiUrl}/projects/${projectId}/results/latest`)
      .then(res => res.data === '' ? null : new LearnResult(res.data));
  }

  /**
   * Deletes a learn result.
   *
   * @param result The learn result to delete.
   */
  remove(result: LearnResult): IPromise<any> {
    return this.$http.delete(`${apiUrl}/projects/${result.project}/results/${result.testNo}`, {});
  }

  /**
   * Deletes a list of learn results.
   *
   * @param results The learn results to delete.
   */
  removeMany(results: LearnResult[]): IPromise<any> {
    const testNos = results.map(r => r.testNo).join(',');
    const projectId = results[0].project;
    return this.$http.delete(`${apiUrl}/projects/${projectId}/results/${testNos}`, {});
  }

  /**
   * Clone a learner result.
   *
   * @param result The result to clone.
   */
  clone(result: LearnResult): IPromise<any> {
    return this.$http.post(`${apiUrl}/projects/${result.project}/results/${result.testNo}/clone`, {})
      .then(res => new LearnResult(res.data));
  }

  /**
   * Generate a test suite of a discrimination tree.
   *
   * @param projectId The ID of the project.
   * @param testNo The test number.
   * @param config The config object.
   */
  generateTestSuite(projectId: number, testNo: number, config: any): IPromise<any> {
    return this.$http.post(`${apiUrl}/projects/${projectId}/results/${testNo}/generateTestSuite`, config)
      .then(res => res.data);
  }
}
