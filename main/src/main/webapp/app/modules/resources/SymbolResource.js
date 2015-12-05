import {Symbol} from '../entities/Symbol';

/**
 * The resource that handles http requests to the API to do CRUD operations on symbols
 */
// @ngInject
class SymbolResource {

    /**
     * Constructor
     * @param $http
     */
    constructor($http) {
        this.$http = $http;
    }

    /**
     * Gets a single symbol by its id
     *
     * @param {number} projectId - The id of the project the symbol belongs to
     * @param {number} symbolId - The id of the symbol that should be fetched
     */
    get(projectId, symbolId) {
        return this.$http.get(`/rest/projects/${projectId}/symbols/${symbolId}`)
            .then(response => new Symbol(response.data));
    }

    /**
     * Get all symbols of a project
     *
     * @param {number} projectId - The id of the project the symbols belong to
     * @param {boolean} includeHiddenSymbols - If hidden symbols should be included or not
     * @returns {*}
     */
    getAll(projectId, includeHiddenSymbols = false) {
        const params = includeHiddenSymbols ? '?visibility=hidden' : '';
        return this.$http.get(`/rest/projects/${projectId}/symbols${params}`)
            .then(response => response.data.map(s => new Symbol(s)));
    }

    /**
     * Gets a list of symbols by a list of id/revision pairs
     * {id_1}:{rev_1},...,{id_n}:{rev_n}
     *
     * @param {number} projectId - The id of the project
     * @param {{id:number,revision:number}[]} idRevisionPairs - The list of id/revision pairs
     * @returns {*}
     */
    getManyByIdRevisionPairs(projectId, idRevisionPairs) {
        const pairs = idRevisionPairs.map(pair => pair.id + ':' + pair.revision).join(',');
        return this.$http.get(`/rest/projects/${projectId}/symbols/batch/${pairs}`)
            .then(response => response.data.map(s => new Symbol(s)));
    }

    /**
     * Make a GET request to /rest/projects/{projectId}/symbols/{symbolId}/complete in order to fetch all revisions.
     * of a symbol
     *
     * @param {number} projectId - The id of the project the symbol belongs to
     * @param {number} symbolId - The id of the symbol whose revisions should be fetched
     * @returns {*}
     */
    getRevisions(projectId, symbolId) {
        return this.$http.get(`/rest/projects/${projectId}/symbols/${symbolId}/complete`)
            .then(response => response.data.map(s => new Symbol(s)));
    }

    /**
     * Creates a new symbol
     *
     * @param {number} projectId - The id of the project the symbol should belong to
     * @param {SymbolFormModel} symbol - The symbol that should be created
     */
    create(projectId, symbol) {
        return this.$http.post(`/rest/projects/${projectId}/symbols`, symbol)
            .then(response => new Symbol(response.data));
    }

    /**
     * Creates many new symbols
     *
     * @param {number} projectId - The id of the project
     * @param {Symbol[]} symbols - The symbols to create
     * @returns {*}
     */
    createMany(projectId, symbols) {
        return this.$http.post(`/rest/projects/${projectId}/symbols/batch`, symbols)
            .then(response => response.data.map(s => new Symbol(s)));
    }

    /**
     * Makes a PUT request to /rest/projects/{projectId}/symbols[/batch]/{symbolId[s]}/moveTo/{groupId} in order to
     * move [a] symbol[s] to another group without creating a new revision
     *
     * @param {Symbol|Symbol[]} symbols - The symbol[s] to be moved to another group
     * @param {SymbolGroup} group - The id of the symbol group
     * @returns {HttpPromise}
     */
    moveMany(symbols, group) {
        const ids = symbols.map(s => s.id).join(',');
        const project = symbols[0].project;
        return this.$http.put(`/rest/projects/${project}/symbols/batch/${ids}/moveTo/${group.id}`, {});
    }

    /**
     * Updates a single symbol and increments its revision number
     *
     * @param {Symbol} symbol - The symbol to be updated
     * @returns {*}
     */
    update(symbol) {
        return this.$http.put(`/rest/projects/${symbol.project}/symbols/${symbol.id}`, symbol)
            .then(response => new Symbol(response.data));
    }

    /**
     * Deletes a single symbol
     *
     * @param {Symbol} symbol - The the symbol that should be deleted
     * @returns {*}
     */
    remove(symbol) {
        return this.$http.post(`/rest/projects/${symbol.project}/symbols/${symbol.id}/hide`, {});
    }

    /**
     * Removes many symbols
     *
     * @param {Symbol[]} symbols
     * @returns {*}
     */
    removeMany(symbols) {
        const ids = symbols.map(s => s.id).join(',');
        const project = symbols[0].project;
        return this.$http.post(`/rest/projects/${project}/symbols/batch/${ids}/hide`, {});
    }

    /**
     * Recovers a single symbol by setting its property 'visible' to true
     *
     * @param {Symbol} symbol - The symbol to recover
     * @returns {*}
     */
    recover(symbol) {
        return this.$http.post(`/rest/projects/${symbol.project}/symbols/${symbol.id}/show`, {});
    }

    /**
     * Recovers many symbols by setting their property 'visible' to true
     *
     * @param {Symbol[]} symbols - The symbols to recover
     * @returns {*}
     */
    recoverMany(symbols) {
        const ids = symbols.map(s => s.id).join(',');
        const project = symbols[0].project;
        return this.$http.post(`/rest/projects/${project}/symbols/batch/${ids}/show`, {});
    }
}

export default SymbolResource;