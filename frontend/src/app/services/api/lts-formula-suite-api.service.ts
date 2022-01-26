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

import { Injectable } from '@angular/core';
import { BaseApiService } from './base-api.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EnvironmentProvider } from '../../../environments/environment.provider';

@Injectable()
export class LtsFormulaSuiteApiService extends BaseApiService {

  constructor(private http: HttpClient, private env: EnvironmentProvider) {
    super();
  }

  getAll(projectId: number): Observable<any> {
    return this.http.get(this.url(projectId), this.defaultHttpOptions);
  }

  get(projectId: number, suiteId: number): Observable<any> {
    return this.http.get(`${this.url(projectId)}/${suiteId}`, this.defaultHttpOptions);
  }

  create(projectId: number, suite: any): Observable<any> {
    return this.http.post(this.url(projectId), suite, this.defaultHttpOptions);
  }

  update(projectId: number, suiteId: number, suite: any): Observable<any> {
    return this.http.put(`${this.url(projectId)}/${suiteId}`, suite, this.defaultHttpOptions);
  }

  remove(projectId: number, suiteId: number): Observable<any> {
    return this.http.delete(`${this.url(projectId)}/${suiteId}`, this.defaultHttpOptions);
  }

  removeAll(projectId: number, suiteIds: number[]): Observable<any> {
    return this.http.delete(`${this.url(projectId)}/batch/${suiteIds.join(',')}`, this.defaultHttpOptions);
  }

  private url(projectId: number): string {
    return `${this.env.apiUrl}/projects/${projectId}/ltsFormulaSuites`;
  }
}
