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

import { environment as env } from '../../../environments/environment';
import { BaseApiService } from './base-api.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

/** The resource for symbol parameters. */
@Injectable()
export class SymbolParameterApiService extends BaseApiService {

  constructor(private http: HttpClient) {
    super();
  }

  /**
   * Create a symbol parameter.
   *
   * @param projectId The id of the project.
   * @param symbolId The id of the symbol.
   * @param parameter The parameter to create.
   */
  create(projectId: number, symbolId: number, parameter: any): Observable<any> {
    return this.http.post(this.url(projectId, symbolId), parameter, this.defaultHttpOptions);
  }

  /**
   * update a symbol parameter.
   *
   * @param projectId The id of the project.
   * @param symbolId The id of the symbol.
   * @param parameter The parameter to create.
   */
  update(projectId: number, symbolId: number, parameter: any): Observable<any> {
    return this.http.put(`${this.url(projectId, symbolId)}/${parameter.id}`, parameter, this.defaultHttpOptions);
  }

  /**
   * Delete a symbol parameter.
   *
   * @param projectId The id of the project.
   * @param symbolId The id of the symbol.
   * @param parameterId The id of  the parameter.
   */
  remove(projectId: number, symbolId: number, parameterId: number): Observable<any> {
    return this.http.delete(`${this.url(projectId, symbolId)}/${parameterId}`, this.defaultHttpOptions);
  }

  private url(projectId: number, symbolId: number) {
    return `${env.apiUrl}/projects/${projectId}/symbols/${symbolId}/parameters`;
  }
}
