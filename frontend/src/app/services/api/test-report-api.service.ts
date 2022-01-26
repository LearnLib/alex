/*
 * Copyright 2015 - 2022 TU Dortmund
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

import { BaseApiService } from './base-api.service';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EnvironmentProvider } from '../../../environments/environment.provider';

/** The resource for test reports. */
@Injectable()
export class TestReportApiService extends BaseApiService {

  constructor(private http: HttpClient, private env: EnvironmentProvider) {
    super();
  }

  /**
   * Get all reports.
   *
   * @param projectId The id of the project.
   * @param page The page.
   * @param size The number of items in the page.
   */
  getAll(projectId: number, page = 0, size = 25): Observable<any> {
    const options = this.defaultHttpOptions;
    options.params = {page, size};
    return this.http.get(`${this.env.apiUrl}/projects/${projectId}/tests/reports`, options);
  }

  /**
   * Get a report.
   *
   * @param projectId The id of the project.
   * @param testReportId The id of the report.
   */
  get(projectId: number, testReportId: number): Observable<any> {
    return this.http.get(`${this.env.apiUrl}/projects/${projectId}/tests/reports/${testReportId}`, this.defaultHttpOptions);
  }

  export(projectId: number, testReportId: number, format: string = 'junit'): Observable<any> {
    const options = {
      headers: this.defaultHttpHeaders,
      params: {},
      responseType: 'text'
    };

    options.params = new HttpParams()
      .append('format', format);

    return this.http.get(`${this.env.apiUrl}/projects/${projectId}/tests/reports/${testReportId}`, options as any);
  }

  /**
   * Get the latest report.
   *
   * @param projectId The id of the project.
   */
  getLatest(projectId: number): Observable<any> {
    return this.http.get(`${this.env.apiUrl}/projects/${projectId}/tests/reports/latest`, this.defaultHttpOptions);
  }

  /**
   * Deletes a test report.
   *
   * @param projectId The id of the project.
   * @param testReportId The id of the report.
   */
  remove(projectId: number, testReportId: number): Observable<any> {
    return this.http.delete(`${this.env.apiUrl}/projects/${projectId}/tests/reports/${testReportId}`, this.defaultHttpOptions);
  }

  /**
   * Delete multiple test reports.
   *
   * @param projectId The id of the project.
   * @param testReports The test reports.
   */
  removeMany(projectId: number, testReports: any[]): Observable<any> {
    const ids = testReports.map((r) => r.id).join(',');
    return this.http.delete(`${this.env.apiUrl}/projects/${projectId}/tests/reports/batch/${ids}`, this.defaultHttpOptions);
  }
}
