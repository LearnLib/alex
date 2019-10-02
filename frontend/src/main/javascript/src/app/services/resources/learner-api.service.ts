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
import { LearnResult } from '../../entities/learner-result';
import { LearnConfiguration } from '../../entities/learner-configuration';
import { BaseApiService } from './base-api.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * The service for interacting with the learner.
 */
@Injectable()
export class LearnerApiService extends BaseApiService {

  constructor(private http: HttpClient) {
    super();
  }

  /**
   * Start the server side learning process of a project.
   *
   * @param projectId The id of the project of the test.
   * @param learnConfiguration The configuration to learn with.
   */
  start(projectId: number, learnConfiguration: LearnConfiguration): Observable<any> {
    return this.http.post(`${env.apiUrl}/learner/${projectId}/start`, learnConfiguration, this.defaultHttpOptions);
  }

  /**
   * Try to force stop a running learning process of a project. May not necessarily work due to difficulties
   * with the thread handling.
   *
   * @param projectId The id of the test to resume with.
   */
  stop(projectId: number): Observable<any> {
    return this.http.get(`${env.apiUrl}/learner/${projectId}/stop`, this.defaultHttpOptions);
  }

  /**
   * Resume a paused learning process where the eqOracle was 'sample' and the learn process was interrupted
   * so that the ongoing process parameters could be defined.
   *
   * @param projectId The id of the test to resume with.
   * @param testNo The test number of the test to resume.
   * @param learnConfiguration The configuration to resume with.
   */
  resume(projectId: number, testNo: number, learnConfiguration: LearnConfiguration): Observable<any> {
    return this.http.post(`${env.apiUrl}/learner/${projectId}/resume/${testNo}`, learnConfiguration, this.defaultHttpOptions);
  }

  /**
   * Gets the status of the learner.
   *
   * @param projectId The id of the test to resume with.
   */
  getStatus(projectId: number): Observable<any> {
    return this.http.get(`${env.apiUrl}/learner/${projectId}/status`, this.defaultHttpOptions)
      .pipe(
        map((body: any) => {
          if (body.result != null) {
            body.result = new LearnResult(body.result);
          }
          return body;
        })
      );
  }

  /**
   * Verifies a possible counterexample.
   *
   * @param projectId The project id.
   * @param outputConfig The id of the reset symbol.
   */
  readOutputs(projectId: number, outputConfig: any): Observable<any> {
    return this.http.post(`${env.apiUrl}/learner/${projectId}/outputs`, outputConfig, this.defaultHttpOptions)
  }

  /**
   * Compare two hypotheses and return the separating word.
   *
   * @param hypA The first hypothesis.
   * @param hypB The second hypothesis.
   */
  getSeparatingWord(hypA: any, hypB: any): Observable<any> {
    return this.http.post(`${env.apiUrl}/learner/compare/separatingWord`, [hypA, hypB], this.defaultHttpOptions)
  }

  /**
   * Compare two hypotheses and return the difference tree.
   * Test a on b.
   *
   * @param hypA The first hypothesis.
   * @param hypB The second hypothesis.
   */
  getDifferenceTree(hypA: any, hypB: any): Observable<any> {
    return this.http.post(`${env.apiUrl}/learner/compare/differenceTree`, [hypA, hypB], this.defaultHttpOptions)
  }
}
