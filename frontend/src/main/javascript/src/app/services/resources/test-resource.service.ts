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
import { IHttpService, IPromise } from 'angular';

/**
 * The resource to handle actions with test cases over the API.
 */
export class TestResource {

  /* @ngInject */
  constructor(private $http: IHttpService) {
  }

  /**
   * Create a test case.
   *
   * @param testCase The test case to create.
   */
  create(testCase: any): IPromise<any> {
    return this.$http.post(`${env.apiUrl}/projects/${testCase.project}/tests`, testCase)
      .then(response => response.data);
  }

  /**
   * Create multiple test cases at once.
   *
   * @param projectId The id of the project.
   * @param tests The tests to create.
   */
  createMany(projectId: number, tests: any[]): IPromise<any> {
    return this.$http.post(`${env.apiUrl}/projects/${projectId}/tests/batch`, tests)
      .then(response => response.data);
  }

  /**
   * Gets the root test suite.
   *
   * @param projectId The id of the project to get all test cases from
   */
  getRoot(projectId: number): IPromise<any> {
    return this.$http.get(`${env.apiUrl}/projects/${projectId}/tests/root`)
      .then(response => response.data);
  }

  /**
   * Get a single test case by its id.
   *
   * @param projectId The id of the project.
   * @param testCaseId The id of the test case.
   */
  get(projectId: number, testCaseId: number): IPromise<any> {
    return this.$http.get(`${env.apiUrl}/projects/${projectId}/tests/${testCaseId}`)
      .then(response => response.data);
  }

  /**
   * Get the status of the current test process.
   *
   * @param projectId The id of the project.
   */
  getStatus(projectId: number): IPromise<any> {
    return this.$http.get(`${env.apiUrl}/projects/${projectId}/tests/status`)
      .then(response => response.data);
  }

  /**
   * Abort the execution of the current test processes.
   *
   * @param projectId The ID of the project.
   */
  abort(projectId: number): IPromise<any> {
    return this.$http.post(`${env.apiUrl}/projects/${projectId}/tests/abort`, null)
      .then(response => response.data);
  }

  /**
   * Update a test case.
   *
   * @param testCase The updated test case.
   */
  update(testCase: any): IPromise<any> {
    return this.$http.put(`${env.apiUrl}/projects/${testCase.project}/tests/${testCase.id}`, testCase)
      .then(response => response.data);
  }

  /**
   * Deletes a test case.
   *
   * @param testCase The test case to delete.
   */
  remove(testCase: any): IPromise<any> {
    return this.$http.delete(`${env.apiUrl}/projects/${testCase.project}/tests/${testCase.id}`)
      .then(response => response.data);
  }

  /**
   * Deletes a test case.
   *
   * @param projectId The id of the project the tests are in.
   * @param tests The test case to delete.
   */
  removeMany(projectId: number, tests: any[]): IPromise<any> {
    const ids = tests.map(t => t.id).join(',');
    return this.$http.delete(`${env.apiUrl}/projects/${projectId}/tests/batch/${ids}`)
      .then(response => response.data);
  }

  /**
   * Move tests to another test suite.
   *
   * @param projectId The id of the project.
   * @param testIds The ids of the tests to move.
   * @param targetId The id of the target test suite.
   */
  moveMany(projectId: number, testIds: number[], targetId: number): IPromise<any> {
    return this.$http.put(`${env.apiUrl}/projects/${projectId}/tests/batch/${testIds.join(',')}/moveTo/${targetId}`, null)
      .then(response => response.data);
  }

  /**
   * Execute a test.
   *
   * @param testCase The test to execute.
   * @param browserConfig The config to execute the test with.
   */
  execute(testCase: any, browserConfig: number): IPromise<any> {
    return this.$http.post(`${env.apiUrl}/projects/${testCase.project}/tests/${testCase.id}/execute`, browserConfig)
      .then(response => response.data);
  }

  /**
   * Execute multiple tests at once.
   *
   * @param projectId The id of the project
   * @param testConfig The configuration for the web driver.
   */
  executeMany(projectId: number, testConfig: number): IPromise<any> {
    return this.$http.post(`${env.apiUrl}/projects/${projectId}/tests/execute`, testConfig)
      .then((response) => response.data);
  }

  /**
   * Get all available results of a test.
   *
   * @param projectId The ID of the project.
   * @param testId The ID of the test.
   * @param page
   * @param size
   */
  getResults(projectId: number, testId: number, page = 0, size = 25): IPromise<any> {
    return this.$http.get(`${env.apiUrl}/projects/${projectId}/tests/${testId}/results?page=${page}&size=${size}`)
      .then(response => response.data);
  }

  export(projectId: number, config: any) {
    return this.$http.post(`${env.apiUrl}/projects/${projectId}/tests/export`, config)
      .then(response => response.data);
  }

  import(projectId: number, data: any) {
    return this.$http.post(`${env.apiUrl}/projects/${projectId}/tests/import`, data)
      .then(response => response.data);
  }
}
