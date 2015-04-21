(function () {
    'use strict';

    angular
        .module('ALEX.resources')
        .factory('SymbolResource', Resource);

    Resource.$inject = ['$http', 'paths', '_'];

    /**
     * The resource that handles http requests to the API to do CRUD operations on symbols
     *
     * @param $http - The angular $http service
     * @param paths - The constant with application paths
     * @param _ - Lodash
     * @returns {SymbolResource}
     * @constructor
     */
    function Resource($http, paths, _) {

        /**
         * The resource object for a symbol
         * @constructor
         */
        function SymbolResource() {
        }

        /**
         * Make a GET request to /rest/projects/{projectId}/symbols/{symbolId} in order to fetch the latest revision of
         * a symbol.
         *
         * @param projectId - The id of the project the symbol belongs to
         * @param symbolId - The id of the symbol that should be fetched
         */
        SymbolResource.prototype.get = function (projectId, symbolId) {
            var _this = this;

            return $http.get(paths.api.URL + '/projects/' + projectId + '/symbols/' + symbolId)
                .then(function (response) {
                    return _this.build(response.data);
                });
        };

        /**
         * Make a GET request to /rest/projects/{projectId}/symbols in oder to fetch all symbols, that means all latest
         * revisions from symbols.
         *
         * As options, you can pass an object {deleted: true} which will get all latest revisions from deleted symbols.
         *
         * @param projectId - The id of the project the symbols belong to
         * @param options - The query options as described in the functions description
         * @returns {*}
         */
        SymbolResource.prototype.getAll = function (projectId, options) {
            var _this = this;
            var query;

            if (options && options.deleted && options.deleted === true) {
                query = '?visibility=hidden';
            }

            return $http.get(paths.api.URL + '/projects/' + projectId + '/symbols' + (query ? query : ''))
                .then(function (response) {
                    return _this.buildSome(response.data);
                });
        };

        /**
         * Make a GET request to /rest/projects/{projectId}/symbols/{symbolId}/complete in order to fetch all revisions.
         * of a symbol
         *
         * @param projectId - The id of the project the symbol belongs to
         * @param symbolId - The id of the symbol whose revisions should be fetched
         * @returns {*}
         */
        SymbolResource.prototype.getRevisions = function (projectId, symbolId) {
            var _this = this;

            return $http.get(paths.api.URL + '/projects/' + projectId + '/symbols/' + symbolId + '/complete')
                .then(function (response) {
                    return _this.buildSome(response.data);
                })
        };

        /**
         * Make a POST request to /rest/projects/{projectId}/symbols in order to create a new symbol.
         *
         * @param projectId - The id of the project the symbol should belong to
         * @param symbol - The symbol that should be created
         */
        SymbolResource.prototype.create = function (projectId, symbol) {
            var _this = this;

            return $http.post(paths.api.URL + '/projects/' + projectId + '/symbols', symbol)
                .then(function (response) {
                    return _this.build(response.data);
                })
        };

        /**
         * Make a POST request to /rest/projects/{projectId}/symbols/batch in order to create multiple symbols at once.
         *
         * @param projectId - The id of the project the symbols should belong to
         * @param symbols - The array of symbols that should be created
         * @returns {*}
         */
        SymbolResource.prototype.createSome = function (projectId, symbols) {
            var _this = this;

            return $http.post(paths.api.URL + '/projects/' + projectId + '/symbols/batch', symbols)
                .then(function (response) {
                    return _this.buildSome(response.data);
                });
        };

        /**
         * Make a PUT request to /rest/projects/{projectId}/symbols in order to update a single symbol.
         *
         * @param projectId - The id of the project the symbol belongs to
         * @param symbol - The updated symbol
         * @returns {*}
         */
        SymbolResource.prototype.update = function (projectId, symbol) {
            var _this = this;

            return $http.put(paths.api.URL + '/projects/' + projectId + '/symbols/' + symbol.id, symbol)
                .then(function (response) {
                    return _this.build(response.data);
                });
        };

        /**
         * Makes a PUT request to /rest/projects/{projectId}/symbols/{symbolId}/moveTo/{groupId} in order to move
         * a symbol to another group without creating a new revision
         *
         * @param {number} projectId - The id of the project
         * @param {number} symbolId - The id of the symbol
         * @param {number} groupId - The id of the symbol group
         * @returns {HttpPromise}
         */
        SymbolResource.prototype.move = function (projectId, symbolId, groupId) {
            return $http.put(paths.api.URL + '/projects/' + projectId + '/symbols/' + symbolId + '/moveTo/' + groupId, {})
        };

        /**
         * Makes a PUT request to /rest/projects/{projectId}/symbols/{symbolId}/moveTo/{groupId} in order to move
         * a symbol to another group without creating a new revision
         *
         * @param {number} projectId - The id of the project
         * @param {Symbol[]} symbols - The symbols to be moved
         * @param {number} groupId - The id of the symbol group
         * @returns {HttpPromise}
         */
        SymbolResource.prototype.moveSome = function (projectId, symbols, groupId) {
            var symbolIds = _.pluck(symbols, 'id').join(',');
            return $http.put(paths.api.URL + '/projects/' + projectId + '/symbols/batch/' + symbolIds + '/moveTo/' + groupId, {})
        };

        /**
         * Make a POST request to /rest/projects/{projectId}/symbols/batch/{symbolIds} in order to update a bunch of
         * symbols at once
         *
         * @param projectId
         * @param symbols
         * @returns {*}
         */
        SymbolResource.prototype.updateSome = function (projectId, symbols) {
            var _this = this;
            var ids = _.pluck(symbols, 'id').join(',');

            return $http.put(paths.api.URL + '/projects/' + projectId + '/symbols/batch/' + ids, symbols)
                .then(function (response) {
                    return _this.buildSome(response.data);
                })
        };

        /**
         * Make a POST request to /rest/projects/{projectId}/symbols/hide in order to delete a single symbol. The
         * Symbol will not be deleted permanently, it will be just hidden and ignored when you call getAll().
         *
         * @param projectId - The id of the project the symbol belongs to
         * @param symbol - The the symbol that should be deleted
         * @returns {*}
         */
        SymbolResource.prototype.delete = function (projectId, symbol) {
            var _this = this;

            return $http.post(paths.api.URL + '/projects/' + projectId + '/symbols/' + symbol.id + '/hide', {})
                .then(function (response) {
                    return _this.build(response.data);
                });
        };

        /**
         * Make a POST request to /rest/projects/{projectId}/symbols/batch/{symbolIds}/hide in order to delete multiple symbols at once.
         * Symbols will not be deleted permanently but stay hidden.
         *
         * @param projectId - The id of the projects the symbols belong to
         * @param symbols - The symbols that should be deleted
         * @returns {*}
         */
        SymbolResource.prototype.deleteSome = function (projectId, symbols) {
            var _this = this;
            var symbolIds = _.pluck(symbols, 'id').join(',');

            return $http.post(paths.api.URL + '/projects/' + projectId + '/symbols/batch/' + symbolIds + '/hide', {})
                .then(function (response) {
                    return _this.buildSome(response.data);
                });
        };

        /**
         * Makes a POST request to /rest/projects/{projectId}/symbols/symbolId/show in order to revert the deleting
         * of a symbol.
         *
         * @param projectId - The id of the project the symbol belongs to
         * @param symbol - The symbol that should be made visible again
         * @returns {*}
         */
        SymbolResource.prototype.recover = function (projectId, symbol) {
            var _this = this;

            return $http.post(paths.api.URL + '/projects/' + projectId + '/symbols/' + symbol.id + '/show', {})
                .then(function (response) {
                    return _this.build(response.data);
                });
        };

        /**
         * Makes a POST request to /rest/projects/{projectId}/symbols/batch/{symbolIds}/show in order to revert the
         * deleting of multiple symbols.
         *
         * @param projectId - The id of the project the symbols belongs to
         * @param symbols - The symbols that should be made visible again
         * @returns {*} - A promise object
         */
        SymbolResource.prototype.recoverSome = function (projectId, symbols) {
            var _this = this;
            var symbolIds = _.pluck(symbols, 'id').join(',');

            return $http.post(paths.api.URL + '/projects/' + projectId + '/symbols/batch/' + symbolIds + '/show', {})
                .then(function (response) {
                    return _this.buildSome(response.data);
                });
        };

        /**
         * Overwrite this method in order to create an instance of a symbol. This method will be called on every
         * successful http request where a single symbol is involved.
         *
         * @param data - The data the symbol instance should be build from
         * @returns {*}
         */
        SymbolResource.prototype.build = function (data) {
            return data;
        };

        /**
         * Overwrite this method in order to create an array of symbols. This method will be called on every successful
         * http request where multiple symbols are involved.
         *
         * @param data - The data the symbol instances should be build from
         * @returns {*}
         */
        SymbolResource.prototype.buildSome = function (data) {
            return data;
        };

        return SymbolResource;
    }
}());