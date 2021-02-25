/*
 * Copyright 2015 - 2021 TU Dortmund
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
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EnvironmentProvider } from '../../../environments/environment.provider';

/**
 * The resource for test configs.
 */
@Injectable()
export class TestConfigApiService extends BaseApiService {

  constructor(private http: HttpClient, private env: EnvironmentProvider) {
    super();
  }

  /**
   * Get all test configs in the project.
   *
   * @param projectId The id of the project.
   */
  getAll(projectId: number): Observable<any> {
    return this.http.get(this.url(projectId), this.defaultHttpOptions);
  }

  /**
   * Create a test config.
   *
   * @param projectId The id of the project.
   * @param config The config to create.
   */
  create(projectId: number, config: any): Observable<any> {
    return this.http.post(this.url(projectId), config, this.defaultHttpOptions);
  }

  /**
   * Delete a tes config.
   *
   * @param projectId The id of the project.
   * @param configId The id of the config to delete.
   */
  remove(projectId: number, configId: number): Observable<any> {
    return this.http.delete(`${this.url(projectId)}/${configId}`, this.defaultHttpOptions);
  }

  /**
   * update a test config.
   *
   * @param projectId The id of the project.
   * @param config The config to create.
   */
  update(projectId: number, config: any): Observable<any> {
    return this.http.put(`${this.url(projectId)}/${config.id}`, config, this.defaultHttpOptions);
  }

  private url(projectId: number) {
    return `${this.env.apiUrl}/projects/${projectId}/testConfigs`;
  }
}
