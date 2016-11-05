/*
 * Copyright 2016 TU Dortmund
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

import {AlphabetSymbol} from "../entities/AlphabetSymbol";

/**
 * The resource that handles http requests to the API to do CRUD operations on symbols.
 */
export class SymbolResource {

    /**
     * Constructor.
     *
     * @param $http
     */
    // @ngInject
    constructor($http) {
        this.$http = $http;
    }

    /**
     * Gets a single symbol by its id.
     *
     * @param {number} projectId - The id of the project the symbol belongs to.
     * @param {number} symbolId - The id of the symbol that should be fetched.
     */
    get(projectId, symbolId) {
        return this.$http.get(`rest/projects/${projectId}/symbols/${symbolId}`)
            .then(response => new AlphabetSymbol(response.data));
    }

    /**
     * Get all symbols of a project.
     *
     * @param {number} projectId - The id of the project the symbols belong to.
     * @param {boolean} includeHiddenSymbols - If hidden symbols should be included or not.
     * @returns {*}
     */
    getAll(projectId, includeHiddenSymbols = false) {
        const params = includeHiddenSymbols ? '?visibility=hidden' : '';
        return this.$http.get(`rest/projects/${projectId}/symbols${params}`)
            .then(response => response.data.map(s => new AlphabetSymbol(s)));
    }

    /**
     * Gets a list of symbols by a list of id/revision pairs.
     *
     * @param {number} projectId - The id of the project.
     * @param {{id:number,revision:number}[]} idRevisionPairs - The list of id/revision pairs.
     * @returns {*}
     */
    getManyByIdRevisionPairs(projectId, idRevisionPairs) {
        const pairs = idRevisionPairs.map(pair => pair.id + ':' + pair.revision).join(',');
        return this.$http.get(`rest/projects/${projectId}/symbols/batch/${pairs}`)
            .then(response => response.data.map(s => new AlphabetSymbol(s)));
    }

    /**
     * Creates a new symbol.
     *
     * @param {number} projectId - The id of the project the symbol should belong to.
     * @param {AlphabetSymbol} symbol - The symbol that should be created.
     */
    create(projectId, symbol) {
        return this.$http.post(`rest/projects/${projectId}/symbols`, symbol)
            .then(response => new AlphabetSymbol(response.data));
    }

    /**
     * Creates many new symbols.
     *
     * @param {number} projectId - The id of the project.
     * @param {AlphabetSymbol[]} symbols - The symbols to create.
     * @returns {*}
     */
    createMany(projectId, symbols) {
        return this.$http.post(`rest/projects/${projectId}/symbols/batch`, symbols)
            .then(response => response.data.map(s => new AlphabetSymbol(s)));
    }

    /**
     * Move symbols to another group without creating a new revision.
     *
     * @param {AlphabetSymbol|AlphabetSymbol[]} symbols - The symbol[s] to be moved to another group.
     * @param {SymbolGroup} group - The id of the symbol group.
     * @returns {*}
     */
    moveMany(symbols, group) {
        const ids = symbols.map(s => s.id).join(',');
        const project = symbols[0].project;
        return this.$http.put(`rest/projects/${project}/symbols/batch/${ids}/moveTo/${group.id}`, {});
    }

    /**
     * Updates a single symbol and increments its revision number.
     *
     * @param {AlphabetSymbol} symbol - The symbol to be updated.
     * @returns {*}
     */
    update(symbol) {
        return this.$http.put(`rest/projects/${symbol.project}/symbols/${symbol.id}`, symbol)
            .then(response => new AlphabetSymbol(response.data));
    }

    /**
     * Deletes a single symbol.
     *
     * @param {AlphabetSymbol} symbol - The the symbol that should be deleted.
     * @returns {*}
     */
    remove(symbol) {
        return this.$http.post(`rest/projects/${symbol.project}/symbols/${symbol.id}/hide`, {});
    }

    /**
     * Removes many symbols.
     *
     * @param {AlphabetSymbol[]} symbols - The symbols to delete.
     * @returns {*}
     */
    removeMany(symbols) {
        const ids = symbols.map(s => s.id).join(',');
        const project = symbols[0].project;
        return this.$http.post(`rest/projects/${project}/symbols/batch/${ids}/hide`, {});
    }

    /**
     * Recovers a single symbol by setting its property 'visible' to true.
     *
     * @param {AlphabetSymbol} symbol - The symbol to recover.
     * @returns {*}
     */
    recover(symbol) {
        return this.$http.post(`rest/projects/${symbol.project}/symbols/${symbol.id}/show`, {});
    }

    /**
     * Recovers many symbols by setting their property 'visible' to true.
     *
     * @param {AlphabetSymbol[]} symbols - The symbols to recover.
     * @returns {*}
     */
    recoverMany(symbols) {
        const ids = symbols.map(s => s.id).join(',');
        const project = symbols[0].project;
        return this.$http.post(`rest/projects/${project}/symbols/batch/${ids}/show`, {});
    }
}