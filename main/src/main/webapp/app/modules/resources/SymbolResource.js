import {_} from '../libraries';
import {Symbol} from '../entities/Symbol';

/**
 * The resource that handles http requests to the API to do CRUD operations on symbols
 *
 * @param $http - The angular $http service
 * @returns {{get: get, getAll: getAll, getRevisions: getRevisions, create: create, update: update, delete: remove, move: move, recover: recover}}
 * @constructor
 */
// @ngInject
function SymbolResource($http) {
    return {
        get: get,
        getAll: getAll,
        getByIdRevisionPairs: getByIdRevisionPairs,
        getRevisions: getRevisions,
        create: create,
        update: update,
        delete: remove,
        move: move,
        recover: recover
    };

    /**
     * Make a GET request to /rest/projects/{projectId}/symbols/{symbolId} in order to fetch the latest revision of
     * a symbol.
     *
     * @param {number} projectId - The id of the project the symbol belongs to
     * @param {number} symbolId - The id of the symbol that should be fetched
     */
    function get(projectId, symbolId) {
        return $http.get('/rest/projects/' + projectId + '/symbols/' + symbolId)
            .then(response => new Symbol(response.data));
    }

    /**
     * Make a GET request to /rest/projects/{projectId}/symbols in oder to fetch all symbols, that means all latest
     * revisions from symbols.
     *
     * As options, you can pass an object {deleted: true} which will get all latest revisions from deleted symbols.
     *
     * @param {number} projectId - The id of the project the symbols belong to
     * @param {{deleted:boolean}} options - The query options as described in the functions description
     * @returns {*}
     */
    function getAll(projectId, options) {
        var query;
        if (options && options.deleted && options.deleted === true) {
            query = '?visibility=hidden';
        }
        return $http.get('/rest/projects/' + projectId + '/symbols' + (query ? query : ''))
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
    function getByIdRevisionPairs(projectId, idRevisionPairs) {
        var pairs = _.map(idRevisionPairs, function (pair) {
            return pair.id + ':' + pair.revision
        }).join(',');

        return $http.get('/rest/projects/' + projectId + '/symbols/batch/' + pairs)
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
    function getRevisions(projectId, symbolId) {
        return $http.get('/rest/projects/' + projectId + '/symbols/' + symbolId + '/complete')
            .then(response => response.data.map(s => new Symbol(s)));
    }

    /**
     * Make a POST request to /rest/projects/{projectId}/symbols[/batch] in order to create [a] new symbol[s].
     *
     * @param {number} projectId - The id of the project the symbol should belong to
     * @param {Symbol|Symbol[]} symbols - The symbol[s] that should be created
     */
    function create(projectId, symbols) {
        if (angular.isArray(symbols)) {
            return $http.post('/rest/projects/' + projectId + '/symbols/batch', symbols)
                .then(response => response.data.map(s => new Symbol(s)));
        } else {
            return $http.post('/rest/projects/' + projectId + '/symbols', symbols)
                .then(response => new Symbol(response.data));
        }
    }

    /**
     * Makes a PUT request to /rest/projects/{projectId}/symbols[/batch]/{symbolId[s]}/moveTo/{groupId} in order to
     * move [a] symbol[s] to another group without creating a new revision
     *
     * @param {Symbol|Symbol[]} symbols - The symbol[s] to be moved to another group
     * @param {SymbolGroup} group - The id of the symbol group
     * @returns {HttpPromise}
     */
    function move(symbols, group) {
        if (angular.isArray(symbols)) {
            var symbolIds = _.pluck(symbols, 'id').join(',');
            return $http.put('/rest/projects/' + group.project + '/symbols/batch/' + symbolIds + '/moveTo/' + group.id, {})
        } else {
            return $http.put('/rest/projects/' + group.project + '/symbols/' + symbols.id + '/moveTo/' + group.id, {})
        }
    }

    /**
     * Make a PUT request to /rest/projects/{projectId}/symbols[/batch]/{symbolIds} in order to update a bunch of
     * symbols at once
     *
     * @param {Symbol|Symbol[]} symbols - The symbol[s] to be updated
     * @returns {*}
     */
    function update(symbols) {
        if (angular.isArray(symbols)) {
            var symbolIds = _.pluck(symbols, 'id').join(',');
            return $http.put('/rest/projects/' + symbols[0].project + '/symbols/batch/' + symbolIds, symbols)
                .then(response => response.data.map(s => new Symbol(s)));
        } else {
            var symbol = symbols;
            return $http.put('/rest/projects/' + symbol.project + '/symbols/' + symbol.id, symbol)
                .then(response => new Symbol(response.data));
        }
    }

    /**
     * Make a POST request to /rest/projects/{projectId}/symbols[/batch]/{symbolId[s]}/hide in order to hide
     * [a] symbol[s].
     *
     * @param {Symbol|Symbol[]} symbols - The the symbol[s] that should be deleted
     * @returns {*}
     */
    function remove(symbols) {
        if (angular.isArray(symbols)) {
            var symbolIds = _.pluck(symbols, 'id').join(',');
            return $http.post('/rest/projects/' + symbols[0].project + '/symbols/batch/' + symbolIds + '/hide', {})
        } else {
            var symbol = symbols;
            return $http.post('/rest/projects/' + symbol.project + '/symbols/' + symbol.id + '/hide', {})
        }
    }

    /**
     * Makes a POST request to /rest/projects/{projectId}/symbols/symbolId/show in order to revert the deleting
     * of a symbol.
     *
     * @param {Symbol|Symbol[]} symbols - The symbol that should be made visible again
     * @returns {*}
     */
    function recover(symbols) {
        if (angular.isArray(symbols)) {
            var symbolIds = _.pluck(symbols, 'id').join(',');
            return $http.post('/rest/projects/' + symbols[0].project + '/symbols/batch/' + symbolIds + '/show', {})
        } else {
            var symbol = symbols;
            return $http.post('/rest/projects/' + symbol.project + '/symbols/' + symbol.id + '/show', {})
        }
    }
}

export default SymbolResource;