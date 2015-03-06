(function () {
    'use strict';

    angular
        .module('weblearner.resources')
        .factory('SymbolResource', Resource);

    Resource.$inject = ['$http', 'paths', 'ResourceResponseService'];

    /**
     * The resource that handles http requests to the API to do CRUD operations on symbols
     *
     * @param $http - The angular $http service
     * @param paths - The constant with application paths
     * @param ResourceResponseService
     * @returns {SymbolResource}
     * @constructor
     */
    function Resource($http, paths, ResourceResponseService) {

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

            // make the request
            return $http.get(paths.api.URL + '/projects/' + projectId + '/symbols/' + symbolId)
                .then(success)
                .catch(ResourceResponseService.fail);

            // build a symbol instance from the response
            function success(response) {
                return _this.build(response.data);
            }
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

            // check if options are defined and build a query
            if (options && options.deleted && options.deleted === true) {
                query = '?visibility=hidden';
            }

            // make the request with the query
            return $http.get(paths.api.URL + '/projects/' + projectId + '/symbols' + (query ? query : ''))
                .then(success)
                .catch(ResourceResponseService.fail);

            // build an array of symbol instances from the response
            function success(response) {
                return _this.buildSome(response.data);
            }
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

            // make the request
            return $http.get(paths.api.URL + '/projects/' + projectId + '/symbols/' + symbolId + '/complete')
                .then(success)
                .catch(ResourceResponseService.fail);

            // build an instance of a symbol from the http response
            function success(response) {
                return _this.buildSome(response.data);
            }
        };

        /**
         * Make a POST request to /rest/projects/{projectId}/symbols in order to create a new symbol.
         *
         * @param projectId - The id of the project the symbol should belong to
         * @param symbol - The symbol that should be created
         */
        SymbolResource.prototype.create = function (projectId, symbol) {
            var _this = this;

            // make the request
            return $http.post(paths.api.URL + '/projects/' + projectId + '/symbols', symbol)
                .then(success)
                .catch(ResourceResponseService.fail);

            // build an instance of a symbol from the http response
            function success(response) {
                return _this.build(response.data);
            }
        };

        /**
         * Make a PUT request to /rest/projects/{projectId}/symbols in order to create multiple symbols at once.
         *
         * @param projectId - The id of the project the symbols should belong to
         * @param symbols - The array of symbols that should be created
         * @returns {*}
         */
        SymbolResource.prototype.createSome = function (projectId, symbols) {
            var _this = this;

            // make the request
            return $http.put(paths.api.URL + '/projects/' + projectId + '/symbols', symbols)
                .then(success)
                .catch(ResourceResponseService.fail);

            // build an array of symbol instances from the response
            function success(response) {
                return _this.buildSome(response.data);
            }
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

            // make the request
            return $http.put(paths.api.URL + '/projects/' + projectId + '/symbols/' + symbol.id, symbol)
                .then(success)
                .catch(ResourceResponseService.fail);

            // build an instance of the updated symbol
            function success(response) {
                return _this.build(response.data);
            }
        };

        SymbolResource.prototype.updateSome = function (projectId, symbols) {
            // TODO
        };

        /**
         * Make a DELETE request to /rest/projects/{projectId}/symbols/hide in order to delete a single symbol. The
         * Symbol will not be deleted permanently, it will be just hidden and ignored when you call getAll().
         *
         * @param projectId - The id of the project the symbol belongs to
         * @param symbolId - The id of the symbol that should be deleted
         * @returns {*}
         */
        SymbolResource.prototype.delete = function (projectId, symbolId) {
            var _this = this;

            // make the request
            return $http.post(paths.api.URL + '/projects/' + projectId + '/symbols/' + symbolId + '/hide', {})
                .then(success)
                .catch(ResourceResponseService.fail);

            // build an instance of the deleted symbol
            function success(resonse) {
                return _this.build(resonse.data);
            }
        };

        /**
         * Make a DELETE request to /rest/projects/{projectId}/symbols/hide in order to delete multiple symbols at once.
         * Symbols will not be deleted permanently but stay hidden.
         *
         * @param projectId - The id of the projects the symbols belong to
         * @param symbolIds - The array of ids from the symbols that should be deleted
         * @returns {*}
         */
        SymbolResource.prototype.deleteSome = function (projectId, symbolIds) {
            var _this = this;

            // create a string from the ids array for the request path
            symbolIds = symbolIds.join(',');

            // make the request
            return $http.post(paths.api.URL + '/projects/' + projectId + '/symbols/' + symbolIds + '/hide', {})
                .then(success)
                .catch(ResourceResponseService.fail);

            // build an array of instances from the deleted symbols
            function success(response) {
                return _this.buildSome(response.data);
            }
        };

        /**
         * Make a POST request to /rest/projects/{projectId}/symbols/symbolId/show in order to revert the deleting
         * of a symbol.
         *
         * @param projectId - The id of the project the symbol belongs to
         * @param symbol - The symbol that should be made visible again
         * @returns {*}
         */
        SymbolResource.prototype.recover = function (projectId, symbol) {
            var _this = this;

            // make the request
            return $http.post(paths.api.URL + '/projects/' + projectId + '/symbols/' + symbol.id + '/show', {})
                .then(success)
                .catch(ResourceResponseService.fail);

            // build and instance of the visible symbol
            function success(response) {
                return _this.build(response.data);
            }
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