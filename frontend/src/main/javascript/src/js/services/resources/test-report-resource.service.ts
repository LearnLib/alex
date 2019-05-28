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

import {apiUrl} from '../../../../environments';
import {IHttpService, IPromise} from 'angular';

/** The resource for test reports. */
export class TestReportResource {

  /**
   * Constructor.
   * @param $http
   */
  /* @ngInject */
  constructor(private $http: IHttpService) {
  }

  /**
   * Get all reports.
   *
   * @param projectId The id of the project.
   * @param page The page.
   * @param size The number of items in the page.
   */
  getAll(projectId: number, page = 0, size = 25): IPromise<any> {
    return this.$http.get(`${apiUrl}/projects/${projectId}/tests/reports?page=${page}&size=${size}`)
      .then(response => response.data);
  }

  /**
   * Get a report.
   *
   * @param projectId The id of the project.
   * @param testReportId The id of the report.
   * @param format How and if the report should be returned in another format.
   */
  get(projectId: number, testReportId: number, format: any = null): IPromise<any> {
    return this.$http.get(`${apiUrl}/projects/${projectId}/tests/reports/${testReportId}`, {params: format})
      .then(response => response.data);
  }

  /**
   * Get the latest report.
   *
   * @param projectId The id of the project.
   */
  getLatest(projectId: number): IPromise<any> {
    return this.$http.get(`${apiUrl}/projects/${projectId}/tests/reports/latest`)
      .then(response => response.data);
  }

  /**
   * Deletes a test report.
   *
   * @param projectId The id of the project.
   * @param testReportId The id of the report.
   */
  remove(projectId: number, testReportId: number): IPromise<any> {
    return this.$http.delete(`${apiUrl}/projects/${projectId}/tests/reports/${testReportId}`);
  }

  /**
   * Delete multiple test reports.
   *
   * @param projectId The id of the project.
   * @param testReports The test reports.
   */
  removeMany(projectId: number, testReports: any[]): IPromise<any> {
    const ids = testReports.map((r) => r.id).join(',');
    return this.$http.delete(`${apiUrl}/projects/${projectId}/tests/reports/batch/${ids}`);
  }
}
