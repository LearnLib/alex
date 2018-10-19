/*
 * Copyright 2018 TU Dortmund
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

import {apiUrl} from '../../../../environments';
import {AlphabetSymbol} from '../../entities/alphabet-symbol';
import {IHttpService} from 'angular';
import {SymbolGroup} from '../../entities/symbol-group';

/**
 * The resource that handles http requests to the API to do CRUD operations on symbols.
 */
export class SymbolResource {

  /**
   * Constructor.
   *
   * @param $http
   */
  /* @ngInject */
  constructor(private $http: IHttpService) {

  }

  /**
   * Gets a single symbol by its id.
   *
   * @param projectId The id of the project the symbol belongs to.
   * @param symbolId The id of the symbol that should be fetched.
   */
  get(projectId: number, symbolId: number) {
    return this.$http.get(`${apiUrl}/projects/${projectId}/symbols/${symbolId}`)
      .then(response => new AlphabetSymbol(response.data));
  }

  /**
   * Get all symbols of a project.
   *
   * @param projectId The id of the project the symbols belong to.
   * @param includeHiddenSymbols If hidden symbols should be included or not.
   */
  getAll(projectId: number, includeHiddenSymbols = false) {
    const params = includeHiddenSymbols ? '?visibility=hidden' : '';
    return this.$http.get(`${apiUrl}/projects/${projectId}/symbols${params}`)
      .then(response => (<any[]> response.data).map(s => new AlphabetSymbol(s)));
  }

  /**
   * Creates a new symbol.
   *
   * @param projectId The id of the project the symbol should belong to.
   * @param symbol The symbol that should be created.
   */
  create(projectId: number, symbol: AlphabetSymbol) {
    return this.$http.post(`${apiUrl}/projects/${projectId}/symbols`, symbol)
      .then(response => new AlphabetSymbol(response.data));
  }

  /**
   * Creates many new symbols.
   *
   * @param projectId The id of the project.
   * @param symbols The symbols to create.
   */
  createMany(projectId: number, symbols: AlphabetSymbol[]) {
    return this.$http.post(`${apiUrl}/projects/${projectId}/symbols/batch`, symbols)
      .then(response => (<any[]> response.data).map(s => new AlphabetSymbol(s)));
  }

  /**
   * Move symbols to another group.
   *
   * @param symbols The symbol[s] to be moved to another group.
   * @param group The id of the symbol group.
   */
  moveMany(symbols: AlphabetSymbol[], group: SymbolGroup) {
    const ids = symbols.map(s => s.id).join(',');
    const project = symbols[0].project;
    return this.$http.put(`${apiUrl}/projects/${project}/symbols/batch/${ids}/moveTo/${group.id}`, {});
  }

  /**
   * Updates a single symbol.
   *
   * @param symbol The symbol to be updated.
   */
  update(symbol: AlphabetSymbol) {
    return this.$http.put(`${apiUrl}/projects/${symbol.project}/symbols/${symbol.id}`, symbol)
      .then(response => new AlphabetSymbol(response.data));
  }

  /**
   * Deletes a single symbol.
   *
   * @param symbol The the symbol that should be deleted.
   */
  remove(symbol: AlphabetSymbol) {
    return this.$http.post(`${apiUrl}/projects/${symbol.project}/symbols/${symbol.id}/hide`, {});
  }

  /**
   * Removes many symbols.
   *
   * @param symbols The symbols to delete.
   */
  removeMany(symbols: AlphabetSymbol[]) {
    const ids = symbols.map(s => s.id).join(',');
    const project = symbols[0].project;
    return this.$http.post(`${apiUrl}/projects/${project}/symbols/batch/${ids}/hide`, {});
  }

  /**
   * Deletes a symbol permanently.
   *
   * @param symbol The ID of the symbol.
   */
  delete(symbol: AlphabetSymbol) {
    return this.$http.delete(`${apiUrl}/projects/${symbol.project}/symbols/${symbol.id}`);
  }

  /**
   * Recovers a single symbol by setting its property 'visible' to true.
   *
   * @param symbol The symbol to recover.
   */
  recover(symbol: AlphabetSymbol) {
    return this.$http.post(`${apiUrl}/projects/${symbol.project}/symbols/${symbol.id}/show`, {});
  }

  /**
   * Recovers many symbols by setting their property 'visible' to true.
   *
   * @param symbols The symbols to recover.
   */
  recoverMany(symbols: AlphabetSymbol[]) {
    const ids = symbols.map(s => s.id).join(',');
    const project = symbols[0].project;
    return this.$http.post(`${apiUrl}/projects/${project}/symbols/batch/${ids}/show`, {});
  }
}
