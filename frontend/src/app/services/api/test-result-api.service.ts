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

import { BaseApiService } from './base-api.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { EnvironmentProvider } from '../../../environments/environment.provider';

@Injectable()
export class TestResultApiService extends BaseApiService {

  constructor(private http: HttpClient, private env: EnvironmentProvider) {
    super();
  }

  /**
   * Get a result.
   *
   * @param projectId The id of the project.
   * @param testReportId The id of the report.
   * @param testResultId The id of the result.
   */
  get(projectId: number, testReportId: number, testResultId: number): Observable<any> {
    return this.http.get(this.getUrl(projectId, testReportId, testResultId), this.defaultHttpOptions);
  }

  getScreenshot(projectId: number, testReportId: number, testResultId: number, screenshotName: string): Observable<any> {
    const options = {
      headers: this.defaultHttpHeaders.set('Accept', 'application/octet-stream'),
      responseType: 'blob',
      observe: 'response'
    };

    return this.http.get(`${this.getUrl(projectId, testReportId, testResultId)}/screenshots/${screenshotName}`, options as any);
  }

  getScreenshots(projectId: number, testReportId: number, testResultId: number): Observable<any> {
    const options = {
      headers: this.defaultHttpHeaders.set('Accept', 'application/octet-stream'),
      responseType: 'blob',
      observe: 'response'
    };

    return this.http.get(`${this.getUrl(projectId, testReportId, testResultId)}/screenshots/batch`, options as any);
  }

  private getUrl(projectId: number, testReportId: number, testResultId: number) {
    return `${this.env.apiUrl}/projects/${projectId}/tests/reports/${testReportId}/results/${testResultId}`;
  }
}
