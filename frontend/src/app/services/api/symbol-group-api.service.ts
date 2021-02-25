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

import { SymbolGroup } from '../../entities/symbol-group';
import { BaseApiService } from './base-api.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EnvironmentProvider } from '../../../environments/environment.provider';

/**
 * The resource that handles http requests to the API to do CRUD operations on symbol groups.
 */
@Injectable()
export class SymbolGroupApiService extends BaseApiService {

  constructor(private http: HttpClient, private env: EnvironmentProvider) {
    super();
  }

  /**
   * Fetches all symbol groups from the server.
   *
   * @param projectId The id of the project whose projects should be fetched.
   */
  getAll(projectId: number): Observable<SymbolGroup[]> {
    return this.http.get(`${this.env.apiUrl}/projects/${projectId}/groups`, this.defaultHttpOptions)
      .pipe(
        map((body: any) => body.map(g => new SymbolGroup(g)))
      );
  }

  /**
   * Creates a new symbol group.
   *
   * @param projectId The id of the project of the symbol group.
   * @param group The object of the symbol group that should be created.
   */
  create(projectId: number, group: SymbolGroup): Observable<SymbolGroup> {
    return this.http.post(`${this.env.apiUrl}/projects/${projectId}/groups`, group, this.defaultHttpOptions)
      .pipe(
        map(body => new SymbolGroup(body))
      );
  }

  importSymbolGroups(projectId: number, symbolGroupsImportable: any): Observable<SymbolGroup[]> {
    return this.http.post(`${this.env.apiUrl}/projects/${projectId}/groups/import`, symbolGroupsImportable, this.defaultHttpOptions)
      .pipe(
        map((body: any) => body.map(g => new SymbolGroup(g)))
      );
  }

  /**
   * Updates an existing symbol group.
   *
   * @param group The symbol group that should be updated.
   */
  update(group: SymbolGroup): Observable<SymbolGroup> {
    return this.http.put(`${this.env.apiUrl}/projects/${group.project}/groups/${group.id}`, group, this.defaultHttpOptions)
      .pipe(
        map(body => new SymbolGroup(body))
      );
  }

  /**
   * Moves an existing symbol group.
   *
   * @param group The symbol group to move with the new parent.
   */
  move(group: SymbolGroup): Observable<any> {
    return this.http.put(`${this.env.apiUrl}/projects/${group.project}/groups/${group.id}/move`, group, this.defaultHttpOptions)
      .pipe(
        map(body => new SymbolGroup(body))
      );
  }

  /**
   * Deletes a symbol group.
   *
   * @param group The symbol group that should be deleted.
   */
  remove(group: SymbolGroup): Observable<any> {
    return this.http.delete(`${this.env.apiUrl}/projects/${group.project}/groups/${group.id}`, this.defaultHttpOptions);
  }
}
