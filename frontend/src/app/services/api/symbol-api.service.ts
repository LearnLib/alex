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

import { AlphabetSymbol } from '../../entities/alphabet-symbol';
import { SymbolGroup } from '../../entities/symbol-group';
import { SymbolUsageResult } from '../../entities/symbol-usage-result';
import { BaseApiService } from './base-api.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EnvironmentProvider } from '../../../environments/environment.provider';

/**
 * The resource that handles http requests to the API to do CRUD operations on symbols.
 */
@Injectable()
export class SymbolApiService extends BaseApiService {

  constructor(private http: HttpClient, private env: EnvironmentProvider) {
    super();
  }

  /**
   * Gets a single symbol by its id.
   *
   * @param projectId The id of the project the symbol belongs to.
   * @param symbolId The id of the symbol that should be fetched.
   */
  get(projectId: number, symbolId: number): Observable<AlphabetSymbol> {
    return this.http.get(`${this.env.apiUrl}/projects/${projectId}/symbols/${symbolId}`, this.defaultHttpOptions)
      .pipe(
        map(body => new AlphabetSymbol(body))
      );
  }

  /**
   * Get all symbols of a project.
   *
   * @param projectId The id of the project the symbols belong to.
   * @param includeHiddenSymbols If hidden symbols should be included or not.
   */
  getAll(projectId: number, includeHiddenSymbols = false): Observable<AlphabetSymbol[]> {
    return this.http.get(`${this.env.apiUrl}/projects/${projectId}/symbols`, this.defaultHttpOptions)
      .pipe(
        map((body: any) => body.map(s => new AlphabetSymbol(s)))
      );
  }

  importSymbols(projectId: number, importableEntity: any): Observable<AlphabetSymbol[]> {
    return this.http.post(`${this.env.apiUrl}/projects/${projectId}/symbols/import`, importableEntity, this.defaultHttpOptions)
      .pipe(
        map((body: any) => body.map(s => new AlphabetSymbol(s)))
      );
  }

  /**
   * Creates a new symbol.
   *
   * @param projectId The id of the project the symbol should belong to.
   * @param symbol The symbol that should be created.
   */
  create(projectId: number, symbol: AlphabetSymbol): Observable<AlphabetSymbol> {
    return this.http.post(`${this.env.apiUrl}/projects/${projectId}/symbols`, symbol, this.defaultHttpOptions)
      .pipe(
        map(body => new AlphabetSymbol(body))
      );
  }

  /**
   * Creates many new symbols.
   *
   * @param projectId The id of the project.
   * @param symbols The symbols to create.
   */
  createMany(projectId: number, symbols: AlphabetSymbol[]): Observable<AlphabetSymbol[]> {
    return this.http.post(`${this.env.apiUrl}/projects/${projectId}/symbols/batch`, symbols, this.defaultHttpOptions)
      .pipe(
        map((body: any) => body.map(s => new AlphabetSymbol(s)))
      );
  }

  /**
   * Move symbols to another group.
   *
   * @param symbols The symbol[s] to be moved to another group.
   * @param group The id of the symbol group.
   */
  moveMany(symbols: AlphabetSymbol[], group: SymbolGroup): Observable<any> {
    const ids = symbols.map(s => s.id).join(',');
    const project = symbols[0].project;
    return this.http.put(`${this.env.apiUrl}/projects/${project}/symbols/batch/${ids}/moveTo/${group.id}`, {}, this.defaultHttpOptions);
  }

  /**
   * Updates a single symbol.
   *
   * @param symbol The symbol to be updated.
   */
  update(symbol: AlphabetSymbol): Observable<AlphabetSymbol> {
    return this.http.put(`${this.env.apiUrl}/projects/${symbol.project}/symbols/${symbol.id}`, symbol, this.defaultHttpOptions)
      .pipe(
        map(body => new AlphabetSymbol(body))
      );
  }

  /**
   * Deletes a single symbol.
   *
   * @param symbol The the symbol that should be deleted.
   */
  remove(symbol: AlphabetSymbol): Observable<any> {
    return this.http.post(`${this.env.apiUrl}/projects/${symbol.project}/symbols/${symbol.id}/hide`, {}, this.defaultHttpOptions);
  }

  /**
   * Removes many symbols.
   */
  removeMany(projectId: number, symbols: AlphabetSymbol[]): Observable<any> {
    const ids = symbols.map(s => s.id).join(',');
    return this.http.post(`${this.env.apiUrl}/projects/${projectId}/symbols/batch/${ids}/hide`, {}, this.defaultHttpOptions);
  }

  /**
   * Deletes a symbol permanently.
   *
   * @param symbol The ID of the symbol.
   */
  delete(symbol: AlphabetSymbol): Observable<any> {
    return this.http.delete(`${this.env.apiUrl}/projects/${symbol.project}/symbols/${symbol.id}`, this.defaultHttpOptions);
  }

  /**
   * Permanently delete multiple symbols at once.
   *
   * @param projectId The ID of the project.
   * @param symbols The symbols to delete.
   */
  deleteMany(projectId: number, symbols: AlphabetSymbol[]): Observable<any> {
    const symbolIds = symbols.map(s => s.id).join(',');
    return this.http.delete(`${this.env.apiUrl}/projects/${projectId}/symbols/batch/${symbolIds}`, this.defaultHttpOptions);
  }

  /**
   * Recovers a single symbol by setting its property 'visible' to true.
   *
   * @param symbol The symbol to recover.
   */
  recover(symbol: AlphabetSymbol): Observable<any> {
    return this.http.post(`${this.env.apiUrl}/projects/${symbol.project}/symbols/${symbol.id}/show`, {}, this.defaultHttpOptions);
  }

  /**
   * Recovers many symbols by setting their property 'visible' to true.
   *
   * @param symbols The symbols to recover.
   */
  recoverMany(symbols: AlphabetSymbol[]): Observable<any> {
    const ids = symbols.map(s => s.id).join(',');
    const project = symbols[0].project;
    return this.http.post(`${this.env.apiUrl}/projects/${project}/symbols/batch/${ids}/show`, {}, this.defaultHttpOptions);
  }

  getUsages(projectId: number, symbolId: number): Observable<SymbolUsageResult> {
    return this.http.get(`${this.env.apiUrl}/projects/${projectId}/symbols/${symbolId}/usages`, this.defaultHttpOptions)
      .pipe(
        map(body => SymbolUsageResult.fromData(body))
      );
  }

  export(projectId: number, config: any): Observable<any> {
    return this.http.post(`${this.env.apiUrl}/projects/${projectId}/symbols/export`, config, this.defaultHttpOptions);
  }
}
