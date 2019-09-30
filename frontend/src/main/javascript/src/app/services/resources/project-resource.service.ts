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
import { CreateProjectForm, Project } from '../../entities/project';
import { IHttpService, IPromise } from 'angular';

/**
 * The resource that handles http calls to the API to do CRUD operations on projects.
 */
export class ProjectResource {

  /* @ngInject */
  constructor(private $http: IHttpService) {
  }

  /**
   * Get a project by its id.
   *
   * @param projectId The id of the project to get.
   */
  get(projectId: number): IPromise<any> {
    return this.$http.get(`${env.apiUrl}/projects/${projectId}`)
      .then(response => new Project(response.data));
  }

  /**
   * Get all projects of a user.
   */
  getAll(): IPromise<any> {
    return this.$http.get(`${env.apiUrl}/projects`)
      .then(response => (<any[]>response.data).map(p => new Project(p)));
  }

  /**
   * Creates a new project.
   *
   * @param project The project to create.
   */
  create(project: CreateProjectForm): IPromise<any> {
    return this.$http.post(`${env.apiUrl}/projects`, project)
      .then(response => new Project(response.data));
  }

  /**
   * Updates a single project.
   *
   * @param project The updated project.
   */
  update(project: Project): IPromise<any> {
    return this.$http.put(`${env.apiUrl}/projects/${project.id}`, project)
      .then(response => new Project(response.data));
  }

  /**
   * Deletes a single project from the server.
   *
   * @param project The project to delete.
   */
  remove(project: Project): IPromise<any> {
    return this.$http.delete(`${env.apiUrl}/projects/${project.id}`);
  }

  removeMany(projects: Project[]): IPromise<any> {
    const ids = projects.map(p => p.id).join(',');
    return this.$http.delete(`${env.apiUrl}/projects/batch/${ids}`);
  }

  export(projectId: number): IPromise<any> {
    return this.$http.post(`${env.apiUrl}/projects/${projectId}/export`, {});
  }

  import(project: Project): IPromise<any> {
    return this.$http.post(`${env.apiUrl}/projects/import`, project)
      .then(res => new Project(res.data));
  }
}
