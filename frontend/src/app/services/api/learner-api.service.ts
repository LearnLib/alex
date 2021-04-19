/*
 * Copyright 2015 - 2021 TU Dortmund
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

import { LearnerResult } from '../../entities/learner-result';
import { BaseApiService } from './base-api.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LearnerStatus } from '../../entities/learner-status';
import { LearnerSetup } from '../../entities/learner-setup';
import { EnvironmentProvider } from '../../../environments/environment.provider';

/**
 * The service for interacting with the learner.
 */
@Injectable()
export class LearnerApiService extends BaseApiService {

  constructor(private http: HttpClient, private env: EnvironmentProvider) {
    super();
  }

  /**
   * Start the server side learning process of a project.
   *
   * @param projectId The id of the project of the test.
   * @param configuration The configuration to learn with.
   */
  start(projectId: number, configuration: {setup: LearnerSetup; options?: any}): Observable<LearnerResult> {
    return this.http.post(`${this.env.apiUrl}/projects/${projectId}/learner/start`, configuration, this.defaultHttpOptions)
      .pipe(
        map(data => new LearnerResult(data))
      );
  }

  /**
   * Try to force stop a running learning process of a project. May not necessarily work due to difficulties
   * with the thread handling.
   *
   * @param projectId The id of the test to resume with.
   * @param testNo The number of the test process to abort.
   */
  stop(projectId: number, testNo: number): Observable<any> {
    return this.http.get(`${this.env.apiUrl}/projects/${projectId}/learner/${testNo}/stop`, this.defaultHttpOptions);
  }

  /**
   * Resume a paused learning process where the eqOracle was 'sample' and the learn process was interrupted
   * so that the ongoing process parameters could be defined.
   *
   * @param projectId The id of the test to resume with.
   * @param testNo The test number of the test to resume.
   * @param learnConfiguration The configuration to resume with.
   */
  resume(projectId: number, testNo: number, learnConfiguration: any): Observable<any> {
    return this.http.post(`${this.env.apiUrl}/projects/${projectId}/learner/${testNo}/resume`, learnConfiguration, this.defaultHttpOptions)
      .pipe(
        map(data => new LearnerResult(data))
      );
  }

  /**
   * Gets the status of the learner.
   *
   * @param projectId The id of the test to resume with.
   */
  getStatus(projectId: number): Observable<LearnerStatus> {
    return this.http.get(`${this.env.apiUrl}/projects/${projectId}/learner/status`, this.defaultHttpOptions)
      .pipe(
        map((data: any) => data as LearnerStatus)
      );
  }

  /**
   * Compare two hypotheses and return the separating word.
   *
   * @param projectId The ID of the project.
   * @param hypA The first hypothesis.
   * @param hypB The second hypothesis.
   */
  getSeparatingWord(projectId: number, hypA: any, hypB: any): Observable<any> {
    return this.http.post(`${this.env.apiUrl}/projects/${projectId}/learner/compare/separatingWord`, [hypA, hypB], this.defaultHttpOptions);
  }

  /**
   * Compare two hypotheses and return the difference tree.
   * Test a on b.
   *
   * @param projectId The ID of the project.
   * @param hypA The first hypothesis.
   * @param hypB The second hypothesis.
   */
  getDifferenceTree(projectId: number, hypA: any, hypB: any): Observable<any> {
    return this.http.post(`${this.env.apiUrl}/projects/${projectId}/learner/compare/differenceTree`, [hypA, hypB], this.defaultHttpOptions);
  }
}
