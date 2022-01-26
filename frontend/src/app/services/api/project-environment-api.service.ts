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

import { ProjectEnvironment } from '../../entities/project-environment';
import { ProjectUrl } from '../../entities/project-url';
import { ProjectEnvironmentVariable } from '../../entities/project-environment-variable';
import { BaseApiService } from './base-api.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EnvironmentProvider } from '../../../environments/environment.provider';

@Injectable()
export class ProjectEnvironmentApiService extends BaseApiService {

  constructor(private http: HttpClient, private env: EnvironmentProvider) {
    super();
  }

  getAll(projectId: number): Observable<ProjectEnvironment[]> {
    return this.http.get(`${this.env.apiUrl}/projects/${projectId}/environments`, this.defaultHttpOptions)
      .pipe(
        map((body: any) => body.map(e => ProjectEnvironment.fromData(e)))
      );
  }

  getOutput(projectId: number, envId: number, config: any): Observable<any> {
    return this.http.post(`${this.env.apiUrl}/projects/${projectId}/environments/${envId}/outputs`, config, this.defaultHttpOptions);
  }

  create(projectId: number, env: ProjectEnvironment): Observable<ProjectEnvironment> {
    return this.http.post(`${this.env.apiUrl}/projects/${projectId}/environments`, env, this.defaultHttpOptions)
      .pipe(
        map((body) => ProjectEnvironment.fromData(body))
      );
  }

  delete(projectId: number, env: ProjectEnvironment): Observable<any> {
    return this.http.delete(`${this.env.apiUrl}/projects/${projectId}/environments/${env.id}`, this.defaultHttpOptions);
  }

  update(projectId: number, env: ProjectEnvironment): Observable<ProjectEnvironment> {
    return this.http.put(`${this.env.apiUrl}/projects/${projectId}/environments/${env.id}`, env, this.defaultHttpOptions)
      .pipe(
        map((body) => ProjectEnvironment.fromData(body))
      );
  }

  createUrl(projectId: number, envId: number, url: ProjectUrl): Observable<ProjectUrl[]> {
    return this.http.post(`${this.env.apiUrl}/projects/${projectId}/environments/${envId}/urls`, url, this.defaultHttpOptions)
      .pipe(
        map((body: any) => body.map(e => ProjectUrl.fromData(e)))
      );
  }

  deleteUrl(projectId: number, envId: number, url: ProjectUrl): Observable<any> {
    return this.http.delete(`${this.env.apiUrl}/projects/${projectId}/environments/${envId}/urls/${url.id}`, this.defaultHttpOptions);
  }

  updateUrl(projectId: number, envId: number, urlId: number, url: ProjectUrl): Observable<ProjectUrl[]> {
    return this.http.put(`${this.env.apiUrl}/projects/${projectId}/environments/${envId}/urls/${url.id}`, url, this.defaultHttpOptions)
      .pipe(
        map((body: any) => body.map(e => ProjectUrl.fromData(e)))
      );
  }

  createVariable(projectId: number, envId: number, variable: ProjectEnvironmentVariable): Observable<ProjectEnvironmentVariable> {
    return this.http.post(`${this.env.apiUrl}/projects/${projectId}/environments/${envId}/variables`, variable, this.defaultHttpOptions)
      .pipe(
        map((body) => ProjectEnvironmentVariable.fromData(body))
      );
  }

  deleteVariable(projectId: number, envId: number, variable: ProjectEnvironmentVariable): Observable<any> {
    return this.http.delete(`${this.env.apiUrl}/projects/${projectId}/environments/${envId}/variables/${variable.id}`, this.defaultHttpOptions);
  }

  updateVariable(projectId: number, envId: number, urlId: number, variable: ProjectEnvironmentVariable): Observable<ProjectEnvironmentVariable> {
    return this.http.put(`${this.env.apiUrl}/projects/${projectId}/environments/${envId}/variables/${variable.id}`, variable, this.defaultHttpOptions)
      .pipe(
        map((body) => ProjectEnvironmentVariable.fromData(body))
      );
  }
}
