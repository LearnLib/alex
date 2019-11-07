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
import { BaseApiService } from './base-api.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TestStatus } from '../../entities/test-status';
import { map } from 'rxjs/operators';

/**
 * The resource to handle actions with test cases over the API.
 */
@Injectable()
export class TestApiService extends BaseApiService {

  constructor(private http: HttpClient) {
    super();
  }

  /**
   * Create a test case.
   *
   * @param testCase The test case to create.
   */
  create(testCase: any): Observable<any> {
    return this.http.post(`${env.apiUrl}/projects/${testCase.project}/tests`, testCase, this.defaultHttpOptions);
  }

  /**
   * Gets the root test suite.
   *
   * @param projectId The id of the project to get all test cases from
   */
  getRoot(projectId: number): Observable<any> {
    return this.http.get(`${env.apiUrl}/projects/${projectId}/tests/root`, this.defaultHttpOptions);
  }

  /**
   * Get a single test case by its id.
   *
   * @param projectId The id of the project.
   * @param testCaseId The id of the test case.
   */
  get(projectId: number, testCaseId: number): Observable<any> {
    return this.http.get(`${env.apiUrl}/projects/${projectId}/tests/${testCaseId}`, this.defaultHttpOptions);
  }

  /**
   * Get the status of the current test process.
   *
   * @param projectId The id of the project.
   */
  getStatus(projectId: number): Observable<TestStatus> {
    return this.http.get(`${env.apiUrl}/projects/${projectId}/tests/status`, this.defaultHttpOptions).pipe(
      map((data: any) => data as TestStatus)
    );
  }

  /**
   * Update a test case.
   *
   * @param testCase The updated test case.
   */
  update(testCase: any): Observable<any> {
    return this.http.put(`${env.apiUrl}/projects/${testCase.project}/tests/${testCase.id}`, testCase, this.defaultHttpOptions);
  }

  /**
   * Deletes a test case.
   *
   * @param testCase The test case to delete.
   */
  remove(testCase: any): Observable<any> {
    return this.http.delete(`${env.apiUrl}/projects/${testCase.project}/tests/${testCase.id}`, this.defaultHttpOptions);
  }

  /**
   * Deletes a test case.
   *
   * @param projectId The id of the project the tests are in.
   * @param tests The test case to delete.
   */
  removeMany(projectId: number, tests: any[]): Observable<any> {
    const ids = tests.map(t => t.id).join(',');
    return this.http.delete(`${env.apiUrl}/projects/${projectId}/tests/batch/${ids}`, this.defaultHttpOptions);
  }

  /**
   * Move tests to another test suite.
   *
   * @param projectId The id of the project.
   * @param testIds The ids of the tests to move.
   * @param targetId The id of the target test suite.
   */
  moveMany(projectId: number, testIds: number[], targetId: number): Observable<any> {
    return this.http.put(`${env.apiUrl}/projects/${projectId}/tests/batch/${testIds.join(',')}/moveTo/${targetId}`, null, this.defaultHttpOptions);
  }

  /**
   * Execute multiple tests at once.
   *
   * @param projectId The id of the project
   * @param testConfig The configuration for the web driver.
   */
  executeMany(projectId: number, testConfig: number): Observable<any> {
    return this.http.post(`${env.apiUrl}/projects/${projectId}/tests/execute`, testConfig, this.defaultHttpOptions);
  }

  /**
   * Get all available results of a test.
   *
   * @param projectId The ID of the project.
   * @param testId The ID of the test.
   * @param page
   * @param size
   */
  getResults(projectId: number, testId: number, page = 0, size = 25): Observable<any> {
    return this.http.get(`${env.apiUrl}/projects/${projectId}/tests/${testId}/results?page=${page}&size=${size}`, this.defaultHttpOptions);
  }

  export(projectId: number, config: any): Observable<any> {
    return this.http.post(`${env.apiUrl}/projects/${projectId}/tests/export`, config, this.defaultHttpOptions);
  }

  import(projectId: number, data: any): Observable<any> {
    return this.http.post(`${env.apiUrl}/projects/${projectId}/tests/import`, data, this.defaultHttpOptions);
  }

  abort(projectId: number, reportId: any): Observable<any> {
    return this.http.post(`${env.apiUrl}/projects/${projectId}/tests/abort/${reportId}`, null, this.defaultHttpOptions);
  }
}
