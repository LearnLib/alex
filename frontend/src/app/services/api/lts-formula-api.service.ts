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
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EnvironmentProvider } from "../../../environments/environment.provider";

/** The resource for lts formulas. */
@Injectable()
export class LtsFormulaApiService extends BaseApiService {

  constructor(private http: HttpClient, private env: EnvironmentProvider) {
    super();
  }

  /**
   * Create a new formula.
   *
   * @param projectId The ID of the project.
   * @param suiteId The ID of the suite.
   * @param formula The formula to create.
   */
  create(projectId: number, suiteId: number, formula: any): Observable<any> {
    return this.http.post(this.url(projectId, suiteId), formula, this.defaultHttpOptions);
  }

  /**
   * Update a formula.
   *
   * @param projectId The ID of the project.
   * @param suiteId The ID of the suite.
   * @param formula The formula to update.
   */
  update(projectId: number, suiteId: number, formula: any): Observable<any> {
    return this.http.put(`${this.url(projectId, suiteId)}/${formula.id}`, formula, this.defaultHttpOptions);
  }

  updateSuite(projectId: number, suiteId: number, formulas: any[], suite: any): Observable<any> {
    const ids = formulas.map(f => f.id).join(',');
    return this.http.put(`${this.url(projectId, suiteId)}/batch/${ids}/suite`, suite, this.defaultHttpOptions);
  }

  /**
   * Delete a formula.
   *
   * @param projectId
   * @param suiteId The ID of the suite.
   * @param formulaId
   */
  delete(projectId: number, suiteId: number, formulaId: number): Observable<any> {
    return this.http.delete(`${this.url(projectId, suiteId)}/${formulaId}`, this.defaultHttpOptions);
  }

  /**
   * Delete many formulas at once.
   *
   * @param projectId The ID of the project.
   * @param suiteId The ID of the suite.
   * @param formulaIds The IDs of the formulas to delete.
   */
  deleteMany(projectId: number, suiteId: number, formulaIds: number[]): Observable<any> {
    return this.http.delete(`${this.url(projectId, suiteId)}/batch/${formulaIds.join(',')}`, this.defaultHttpOptions);
  }

  private url(projectId: number, suiteId: number): string {
    return `${this.env.apiUrl}/projects/${projectId}/ltsFormulaSuites/${suiteId}/ltsFormulas`;
  }
}
