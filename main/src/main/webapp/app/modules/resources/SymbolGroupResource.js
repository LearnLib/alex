import {SymbolGroup} from '../entities/SymbolGroup';

/**
 * The resource that handles http requests to the API to do CRUD operations on symbol groups
 */
// @ngInject
class SymbolGroupResource {

    /**
     * Constructor
     * @param $http
     */
    constructor($http) {
        this.$http = $http;
    }

    /**
     * Fetches all symbol groups from the server
     *
     * @param {number} projectId - The id of the project whose projects should be fetched
     * @param {boolean} includeSymbols - If the symbols should be included
     * @returns {*}
     */
    getAll(projectId, includeSymbols = false) {
        const params = includeSymbols ? '?embed=symbols' : '';

        return this.$http.get(`/rest/projects/${projectId}/groups${params}`)
            .then(response => response.data.map(g => new SymbolGroup(g)));
    }

    /**
     * Creates a new symbol group
     *
     * @param {number} projectId - The id of the project of the symbol group
     * @param {SymbolGroupFormModel} group - The object of the symbol group that should be created
     * @returns {*}
     */
    create(projectId, group) {
        return this.$http.post(`/rest/projects/${projectId}/groups`, group)
            .then(response => new SymbolGroup(response.data));
    }

    /**
     * Updates an existing symbol group
     *
     * @param {SymbolGroup} group - The symbol group that should be updated
     * @returns {*}
     */
    update(group) {
        return this.$http.put(`/rest/projects/${group.project}/groups/${group.id}`, group)
            .then(response => new SymbolGroup(response.data));
    }

    /**
     * Deletes a symbol group
     *
     * @param {SymbolGroup} group - The symbol group that should be deleted
     * @returns {*} - An angular promise
     */
    remove(group) {
        return this.$http.delete(`/rest/projects/${group.project}/groups/${group.id}`);
    }
}

export default SymbolGroupResource;