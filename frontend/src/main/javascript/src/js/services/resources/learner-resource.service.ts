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
import {LearnResult} from '../../entities/learner-result';
import {IHttpService, IPromise} from 'angular';
import {LearnConfiguration} from '../../entities/learner-configuration';

/**
 * The service for interacting with the learner.
 */
export class LearnerResource {

  /**
   * Constructor.
   *
   * @param $http
   */
  /* @ngInject */
  constructor(private $http: IHttpService) {
  }

  /**
   * Start the server side learning process of a project.
   *
   * @param projectId The id of the project of the test.
   * @param learnConfiguration The configuration to learn with.
   */
  start(projectId: number, learnConfiguration: LearnConfiguration): IPromise<any> {
    return this.$http.post(`${apiUrl}/learner/${projectId}/start`, learnConfiguration);
  }

  /**
   * Try to force stop a running learning process of a project. May not necessarily work due to difficulties
   * with the thread handling.
   *
   * @param projectId The id of the test to resume with.
   */
  stop(projectId: number): IPromise<any> {
    return this.$http.get(`${apiUrl}/learner/${projectId}/stop`);
  }

  /**
   * Resume a paused learning process where the eqOracle was 'sample' and the learn process was interrupted
   * so that the ongoing process parameters could be defined.
   *
   * @param projectId The id of the test to resume with.
   * @param testNo The test number of the test to resume.
   * @param learnConfiguration The configuration to resume with.
   */
  resume(projectId: number, testNo: number, learnConfiguration: LearnConfiguration): IPromise<any> {
    return this.$http.post(`${apiUrl}/learner/${projectId}/resume/${testNo}`, learnConfiguration);
  }

  /**
   * Gets the status of the learner.
   *
   * @param projectId The id of the test to resume with.
   */
  getStatus(projectId: number): IPromise<any> {
    return this.$http.get(`${apiUrl}/learner/${projectId}/status`)
      .then(res => {
        const status = <any> res.data;
        if (status.result != null) {
          status.result = new LearnResult(status.result);
        }
        return status;
      })
      .catch(() => null);
  }

  /**
   * Verifies a possible counterexample.
   *
   * @param projectId The project id.
   * @param outputConfig The id of the reset symbol.
   */
  readOutputs(projectId: number, outputConfig: any): IPromise<any> {
    return this.$http.post(`${apiUrl}/learner/${projectId}/outputs`, outputConfig)
      .then(response => response.data);
  }

  /**
   * Compare two hypotheses and return the separating word.
   *
   * @param hypA The first hypothesis.
   * @param hypB The second hypothesis.
   */
  getSeparatingWord(hypA: any, hypB: any): IPromise<any> {
    return this.$http.post(`${apiUrl}/learner/compare/separatingWord`, [hypA, hypB])
      .then(response => response.data);
  }

  /**
   * Compare two hypotheses and return the difference tree.
   * Test a on b.
   *
   * @param hypA The first hypothesis.
   * @param hypB The second hypothesis.
   */
  getDifferenceTree(hypA: any, hypB: any): IPromise<any> {
    return this.$http.post(`${apiUrl}/learner/compare/differenceTree`, [hypA, hypB])
      .then(response => response.data);
  }
}
