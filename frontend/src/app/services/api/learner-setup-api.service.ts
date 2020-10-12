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
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LearnerSetup } from '../../entities/learner-setup';
import { LearnerResult } from '../../entities/learner-result';
import { EnvironmentProvider } from "../../../environments/environment.provider";

@Injectable()
export class LearnerSetupApiService extends BaseApiService {

  constructor(private http: HttpClient, private env: EnvironmentProvider) {
    super();
  }

  getAll(projectId: number): Observable<LearnerSetup[]> {
    return this.http.get(this.url(projectId), this.defaultHttpOptions)
      .pipe(
        map((body: any) => body.map(lr => LearnerSetup.fromData(lr)))
      );
  }

  get(projectId: number, setupId: number): Observable<LearnerSetup> {
    return this.http.get(this.url(projectId, setupId), this.defaultHttpOptions)
      .pipe(
        map((body: any) => LearnerSetup.fromData(body))
      );
  }

  copy(projectId: number, setupId: number): Observable<LearnerSetup> {
    return this.http.post(`${this.url(projectId, setupId)}/copy`, {}, this.defaultHttpOptions)
      .pipe(
        map((body: any) => LearnerSetup.fromData(body))
      );
  }

  create(projectId: number, setup: LearnerSetup): Observable<LearnerSetup> {
    return this.http.post(this.url(projectId), setup, this.defaultHttpOptions)
      .pipe(
        map((body: any) => LearnerSetup.fromData(body))
      );
  }

  update(projectId: number, setup: LearnerSetup): Observable<LearnerSetup> {
    return this.http.put(this.url(projectId, setup.id), setup, this.defaultHttpOptions)
      .pipe(
        map((body: any) => LearnerSetup.fromData(body))
      );
  }

  remove(projectId: number, setupId: number) {
    return this.http.delete(this.url(projectId, setupId), this.defaultHttpOptions)
  }

  run(projectId: number, setupId: number): Observable<LearnerResult> {
    return this.http.post(`${this.url(projectId, setupId)}/run`, {}, this.defaultHttpOptions)
      .pipe(
        map(body => new LearnerResult(body))
      );
  }

  private url(projectId: number, setupId?: number): string {
    return `${this.env.apiUrl}/projects/${projectId}/learner/setups${setupId != null ? '/' + setupId : ''}`;
  }
}
