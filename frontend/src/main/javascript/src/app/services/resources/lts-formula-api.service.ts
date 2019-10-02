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
import { BaseApiService } from './base-api.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

/** The resource for lts formulas. */
@Injectable()
export class LtsFormulaApiService extends BaseApiService {

  constructor(private http: HttpClient) {
    super();
  }

  /**
   * Get all formulas.
   *
   * @param projectId The ID of the project.
   */
  getAll(projectId: number): Observable<any> {
    return this.http.get(`${env.apiUrl}/projects/${projectId}/ltsFormulas`, this.defaultHttpOptions);
  }

  /**
   * Create a new formula.
   *
   * @param projectId The ID of the project.
   * @param formula The formula to create.
   */
  create(projectId: number, formula: any): Observable<any> {
    return this.http.post(`${env.apiUrl}/projects/${projectId}/ltsFormulas`, formula, this.defaultHttpOptions);
  }

  /**
   * Update a formula.
   *
   * @param projectId The ID of the project.
   * @param formula The formula to update.
   */
  update(projectId: number, formula: any): Observable<any> {
    return this.http.put(`${env.apiUrl}/projects/${projectId}/ltsFormulas/${formula.id}`, formula, this.defaultHttpOptions);
  }

  /**
   * Delete a formula.
   *
   * @param projectId
   * @param formulaId
   */
  delete(projectId: number, formulaId: number): Observable<any> {
    return this.http.delete(`${env.apiUrl}/projects/${projectId}/ltsFormulas/${formulaId}`, this.defaultHttpOptions);
  }

  /**
   * Delete many formulas at once.
   *
   * @param projectId The ID of the project.
   * @param formulaIds The IDs of the formulas to delete.
   */
  deleteMany(projectId: number, formulaIds: number[]): Observable<any> {
    return this.http.delete(`${env.apiUrl}/projects/${projectId}/ltsFormulas/batch/${formulaIds.join(',')}`, this.defaultHttpOptions);
  }

  /**
   * Check formulas against a model.
   *
   * @param projectId The ID of the project.
   * @param config The configuration.
   */
  check(projectId: number, config: any): Observable<any> {
    return this.http.post(`${env.apiUrl}/projects/${projectId}/ltsFormulas/check`, config, this.defaultHttpOptions);
  }
}
