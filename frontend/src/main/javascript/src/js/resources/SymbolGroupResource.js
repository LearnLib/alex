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

import {SymbolGroup} from "../entities/SymbolGroup";

/**
 * The resource that handles http requests to the API to do CRUD operations on symbol groups.
 */
export class SymbolGroupResource {

    /**
     * Constructor.
     *
     * @param $http
     * @param __env
     */
    // @ngInject
    constructor($http, __env) {
        this.$http = $http;
        this.__env = __env;
    }

    /**
     * Fetches all symbol groups from the server.
     *
     * @param {number} projectId - The id of the project whose projects should be fetched.
     * @param {boolean} includeSymbols - If the symbols should be included.
     * @returns {*}
     */
    getAll(projectId, includeSymbols = false) {
        const params = includeSymbols ? '?embed=symbols' : '';

        return this.$http.get(this.__env.apiUrl + `/projects/${projectId}/groups${params}`)
            .then(response => response.data.map(g => new SymbolGroup(g)));
    }

    /**
     * Creates a new symbol group.
     *
     * @param {number} projectId - The id of the project of the symbol group.
     * @param {SymbolGroup} group - The object of the symbol group that should be created.
     * @returns {*}
     */
    create(projectId, group) {
        return this.$http.post(this.__env.apiUrl + `/projects/${projectId}/groups`, group)
            .then(response => new SymbolGroup(response.data));
    }

    /**
     * Updates an existing symbol group.
     *
     * @param {SymbolGroup} group - The symbol group that should be updated.
     * @returns {*}
     */
    update(group) {
        return this.$http.put(this.__env.apiUrl + `/projects/${group.project}/groups/${group.id}`, group)
            .then(response => new SymbolGroup(response.data));
    }

    /**
     * Deletes a symbol group.
     *
     * @param {SymbolGroup} group - The symbol group that should be deleted.
     * @returns {*} - An angular promise.
     */
    remove(group) {
        return this.$http.delete(this.__env.apiUrl + `/projects/${group.project}/groups/${group.id}`);
    }
}