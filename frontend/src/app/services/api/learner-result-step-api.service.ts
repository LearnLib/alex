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

import { Injectable } from '@angular/core';
import { BaseApiService } from './base-api.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { EnvironmentProvider } from '../../../environments/environment.provider';
import { Observable } from 'rxjs';

@Injectable()
export class LearnerResultStepApiService extends BaseApiService {

  constructor(private http: HttpClient, private env: EnvironmentProvider) {
    super();
  }

  getHypothesisOutput(projectId: number, learnerResultId: number, stepId: number, input: string[]): Observable<any>  {
    return this.http.post(`${this.env.apiUrl}/projects/${projectId}/results/${learnerResultId}/steps/${stepId}/hypothesis/outputs`, input, this.defaultHttpOptions);
  }

  getModelCheckingResults(projectId: number, learnerResultId: number, stepId: number, format: string = 'json'): Observable<any>  {
    const options = {
      headers: this.defaultHttpHeaders,
      responseType: format === 'json' ? 'json' : 'text',
      params: new HttpParams().append('format', format)
    };

    return this.http.get(`${this.env.apiUrl}/projects/${projectId}/results/${learnerResultId}/steps/${stepId}/modelCheckingResults`, options as any);
  }
}
