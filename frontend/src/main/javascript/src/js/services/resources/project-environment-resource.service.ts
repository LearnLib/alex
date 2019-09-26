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

import { IHttpService, IPromise } from 'angular';
import { apiUrl } from '../../../../environments';
import { ProjectEnvironment } from '../../entities/project-environment';
import { ProjectUrl } from '../../entities/project-url';
import { ProjectEnvironmentVariable } from "../../entities/project-environment-variable";

export class ProjectEnvironmentResourceService {

  /* @ngInject */
  constructor(private $http: IHttpService) {
  }

  getAll(projectId: number): IPromise<any> {
    return this.$http.get(`${apiUrl}/projects/${projectId}/environments`)
      .then(res => (<any[]> res.data).map(c => ProjectEnvironment.fromData(c)));
  }

  create(projectId: number, env: ProjectEnvironment): IPromise<any> {
    return this.$http.post(`${apiUrl}/projects/${projectId}/environments`, env)
      .then(res => ProjectEnvironment.fromData(res.data));
  }

  delete(projectId: number, env: ProjectEnvironment): IPromise<any> {
    return this.$http.delete(`${apiUrl}/projects/${projectId}/environments/${env.id}`);
  }

  update(projectId: number, env: ProjectEnvironment): IPromise<any> {
    return this.$http.put(`${apiUrl}/projects/${projectId}/environments/${env.id}`, env)
      .then(res => ProjectEnvironment.fromData(res.data));
  }

  createUrl(projectId: number, envId: number, url: ProjectUrl): IPromise<any> {
    return this.$http.post(`${apiUrl}/projects/${projectId}/environments/${envId}/urls`, url)
      .then(res => (<any[]> res.data).map(u => ProjectUrl.fromData(u)));
  }

  deleteUrl(projectId: number, envId: number, url: ProjectUrl): IPromise<any> {
    return this.$http.delete(`${apiUrl}/projects/${projectId}/environments/${envId}/urls/${url.id}`);
  }

  updateUrl(projectId: number, envId: number, urlId: number, url: ProjectUrl): IPromise<any> {
    return this.$http.put(`${apiUrl}/projects/${projectId}/environments/${envId}/urls/${url.id}`, url)
      .then(res => (<any[]> res.data).map(u => ProjectUrl.fromData(u)));
  }

  createVariable(projectId: number, envId: number, variable: ProjectEnvironmentVariable): IPromise<any> {
    return this.$http.post(`${apiUrl}/projects/${projectId}/environments/${envId}/variables`, variable)
        .then(res => ProjectEnvironmentVariable.fromData(res.data));
  }

  deleteVariable(projectId: number, envId: number, variable: ProjectEnvironmentVariable): IPromise<any> {
    return this.$http.delete(`${apiUrl}/projects/${projectId}/environments/${envId}/variables/${variable.id}`);
  }

  updateVariable(projectId: number, envId: number, urlId: number, variable: ProjectEnvironmentVariable): IPromise<any> {
    return this.$http.put(`${apiUrl}/projects/${projectId}/environments/${envId}/variables/${variable.id}`, variable)
        .then(res => ProjectEnvironmentVariable.fromData(res.data));
  }
}