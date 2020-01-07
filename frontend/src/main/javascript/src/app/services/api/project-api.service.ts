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
import { BaseApiService } from './base-api.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * The resource that handles http calls to the API to do CRUD operations on projects.
 */
@Injectable()
export class ProjectApiService extends BaseApiService {

  constructor(private http: HttpClient) {
    super();
  }

  /**
   * Get a project by its id.
   *
   * @param projectId The id of the project to get.
   */
  get(projectId: number): Observable<Project> {
    return this.http.get(`${env.apiUrl}/projects/${projectId}`, this.defaultHttpOptions)
      .pipe(
        map(body => new Project(body))
      );
  }

  /**
   * Get all projects of a user.
   */
  getAll(): Observable<Project[]> {
    return this.http.get(`${env.apiUrl}/projects`, this.defaultHttpOptions)
      .pipe(
        map((body: any) => body.map(p => new Project(p)))
      );
  }

  /**
   * Creates a new project.
   *
   * @param project The project to create.
   */
  create(project: CreateProjectForm): Observable<Project> {
    return this.http.post(`${env.apiUrl}/projects`, project, this.defaultHttpOptions)
      .pipe(
        map(body => new Project(body))
      );
  }

  /**
   * Updates a single project.
   *
   * @param project The updated project.
   */
  update(project: Project): Observable<Project> {
    return this.http.put(`${env.apiUrl}/projects/${project.id}`, project, this.defaultHttpOptions)
      .pipe(
        map(body => new Project(body))
      );
  }

  /**
   * Deletes a single project from the server.
   *
   * @param project The project to delete.
   */
  remove(project: Project): Observable<any> {
    return this.http.delete(`${env.apiUrl}/projects/${project.id}`, this.defaultHttpOptions);
  }

  removeMany(projects: Project[]): Observable<any> {
    const ids = projects.map(p => p.id).join(',');
    return this.http.delete(`${env.apiUrl}/projects/batch/${ids}`, this.defaultHttpOptions);
  }

  export(projectId: number): Observable<any> {
    return this.http.post(`${env.apiUrl}/projects/${projectId}/export`, {}, this.defaultHttpOptions);
  }

  import(project: Project): Observable<Project> {
    return this.http.post(`${env.apiUrl}/projects/import`, project, this.defaultHttpOptions)
      .pipe(
        map(body => new Project(body))
      );
  }

  addOwners(projectId: number, ownerIds: number[]): Observable<any> {
    return this.http.post(`${env.apiUrl}/projects/${projectId}/owners`, ownerIds, this.defaultHttpOptions)
      .pipe(
        map(body => new Project(body))
      );
  }

  addMembers(projectId: number, memberIds: number[]): Observable<any> {
    return this.http.post(`${env.apiUrl}/projects/${projectId}/members`, memberIds, this.defaultHttpOptions)
      .pipe(
        map(body => new Project(body))
      );
  }

  removeOwners(projectId: number, ownerIds: number[]): Observable<any> {
    const ids = ownerIds.join(',');
    return this.http.delete(`${env.apiUrl}/projects/${projectId}/owners/${ids}`, this.defaultHttpOptions)
      .pipe(
        map(body => new Project(body))
      );
  }

  removeMembers(projectId: number, memberIds: number[]): Observable<any> {
    const ids = memberIds.join(',');
    return this.http.delete(`${env.apiUrl}/projects/${projectId}/members/${ids}`, this.defaultHttpOptions)
      .pipe(
        map(body => new Project(body))
      );
  }
}
