/*
 * Copyright 2015 - 2020 TU Dortmund
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
import { LearnerResult } from '../../entities/learner-result';
import { BaseApiService } from './base-api.service';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * The resource that handles http request to the API to do CRUD operations on learn results.
 */
@Injectable()
export class LearnerResultApiService extends BaseApiService {

  constructor(private http: HttpClient) {
    super();
  }

  /**
   * Gets all final steps of all learn results.
   *
   * @param projectId The id of the project whose final learn results should be fetched.
   */
  getAll(projectId: number): Observable<LearnerResult[]> {
    return this.http.get(`${env.apiUrl}/projects/${projectId}/results?embed=steps`, this.defaultHttpOptions)
      .pipe(
        map((body: any) => body.map(lr => new LearnerResult(lr)))
      );
  }

  /**
   * Gets the final learn result of a test run.
   *
   * @param projectId The id of the project.
   * @param testNo The number of the test run.
   */
  get(projectId: number, testNo: number): Observable<LearnerResult> {
    return this.http.get(`${env.apiUrl}/projects/${projectId}/results/${testNo}?embed=steps`, this.defaultHttpOptions)
      .pipe(
        map((body: any) => new LearnerResult(body))
      );
  }

  export(projectId: number, testNo: number, stepNo: number, format = 'DOT'): Observable<any> {
    const options = {
      headers: this.defaultHttpHeaders,
      responseType: 'text',
      params: new HttpParams().append('format', format)
    };

    return this.http.post(`${env.apiUrl}/projects/${projectId}/results/${testNo}/steps/${stepNo}/export`, null, options as any);
  }

  /**
   * Get the latest learner result.
   *
   * @param projectId The id of the project.
   */
  getLatest(projectId: number): Observable<LearnerResult> {
    return this.http.get(`${env.apiUrl}/projects/${projectId}/results/latest`, this.defaultHttpOptions)
      .pipe(
        map((body: any) => (body === '' || body == null) ? null : new LearnerResult(body))
      );
  }

  /**
   * Deletes a learn result.
   *
   * @param result The learn result to delete.
   */
  remove(result: LearnerResult): Observable<any> {
    return this.http.delete(`${env.apiUrl}/projects/${result.project}/results/${result.testNo}`, this.defaultHttpOptions);
  }

  /**
   * Deletes a list of learn results.
   *
   * @param results The learn results to delete.
   */
  removeMany(results: LearnerResult[]): Observable<any> {
    const testNos = results.map(r => r.testNo).join(',');
    const projectId = results[0].project;
    return this.http.delete(`${env.apiUrl}/projects/${projectId}/results/${testNos}`, this.defaultHttpOptions);
  }

  /**
   * Clone a learner result.
   *
   * @param result The result to clone.
   */
  clone(result: LearnerResult): Observable<LearnerResult> {
    return this.http.post(`${env.apiUrl}/projects/${result.project}/results/${result.testNo}/clone`, {}, this.defaultHttpOptions)
      .pipe(
        map((body: any) => new LearnerResult(body))
      );
  }

  /**
   * Generate a test suite of a discrimination tree.
   *
   * @param projectId The ID of the project.
   * @param testNo The test number.
   * @param config The config object.
   */
  generateTestSuite(projectId: number, testNo: number, config: any): Observable<any> {
    return this.http.post(`${env.apiUrl}/projects/${projectId}/results/${testNo}/generateTestSuite`, config, this.defaultHttpOptions);
  }
}
