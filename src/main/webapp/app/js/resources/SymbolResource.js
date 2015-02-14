(function () {
    'use strict';

    angular
        .module('weblearner.resources')
        .factory('SymbolResource', [
            '$http', '$q', 'api', 'ResourceResponseService',
            SymbolResource
        ]);


    /**
     *
     * @param $http
     * @param $q
     * @param api
     * @param ResourceResponseService
     * @return {{get: getSymbol, getAll: getAllSymbols, getRevisions: getRevisions, recover: recoverSymbol, create: createSymbol, update: updateSymbol, delete: deleteSymbol, deleteSome: deleteSomeSymbols}}
     * @constructor
     */
    function SymbolResource($http, $q, api, ResourceResponseService) {

        var service = {
            get: getSymbol,
            getAll: getAllSymbols,
            getRevisions: getRevisions,
            recover: recoverSymbol,
            create: createSymbol,
            update: updateSymbol,
            delete: deleteSymbol,
            deleteSome: deleteSomeSymbols,
        };
        return service;

        // ////////

        /**
         * get a specific web or rest symbol by its id
         *
         * @param projectId
         * @param symbolId
         * @return {*}
         */
        function getSymbol(projectId, symbolId) {

            return $http.get(api.URL + '/projects/' + projectId + '/symbols/' + symbolId)
                .then(ResourceResponseService.success)
                .catch(ResourceResponseService.fail);
        }

        /**
         * get all rest and web symbols of a project by the projects id
         *
         * @param projectId
         * @param options
         * @return {*}
         */
        function getAllSymbols(projectId, options) {

            var queryParams = '?';

            if (options) {

                if (options.type) queryParams += 'type=' + options.type;
                if (options.deleted && options.deleted === true) queryParams += '&visbility=hidden';

                return $http.get(api.URL + '/projects/' + projectId + '/symbols/' + queryParams)
                    .then(ResourceResponseService.success)
                    .catch(ResourceResponseService.fail);

            } else {
                return $http.get(api.URL + '/projects/' + projectId + '/symbols')
                    .then(ResourceResponseService.success)
                    .catch(ResourceResponseService.fail);
            }
        }

        /**
         *
         * @param projectId
         * @param symbolId
         * @return {*}
         */
        function recoverSymbol(projectId, symbolId) {
            return $http.post(api.URL + '/projects/' + projectId + '/symbols/' + symbolId + '/show', {})
                .then(ResourceResponseService.success)
                .catch(ResourceResponseService.fail);
        }

        /**
         * create a new symbol
         *
         * @param projectId
         * @param symbol
         * @return {*}
         */
        function createSymbol(projectId, symbol) {

            if (angular.isArray(symbol)) {
                return createSymbols(projectId, symbol)
            }

            return $http.post(api.URL + '/projects/' + projectId + '/symbols', symbol)
                .then(success)
                .catch(ResourceResponseService.fail);

            function success(response) {
                var message = 'Symbol ' + response.data.name + ' created';
                return ResourceResponseService.successWithToast(response, message);
            }
        }

        function createSymbols(projectId, symbols) {

            return $http.put(api.URL + '/projects/' + projectId + '/symbols', symbols)
                .then(success)
                .catch(fail);

            function success(response) {
                var message = 'Symbols created';
                return ResourceResponseService.successWithToast(response, message);
            }

            function fail(response) {
                var message = 'Upload failed. Some symbols already exist or existed in this project';
                return ResourceResponseService.failWithToast(response, message);
            }
        }

        /**
         * update an existing symbol
         *
         * @param projectId
         * @param symbol
         * @return {*}
         */
        function updateSymbol(projectId, symbol) {
            return $http.put(api.URL + '/projects/' + projectId + '/symbols/' + symbol.id, symbol)
                .then(success)
                .catch(ResourceResponseService.fail);

            function success(response) {
                var message = 'Symbol "' + response.data.name + '" updated';
                return ResourceResponseService.successWithToast(response, message);
            }
        }

        /**
         * delete an existing symbol
         *
         * @param projectId
         * @param symbolId
         * @return {*}
         */
        function deleteSymbol(projectId, symbolId) {

            return $http.post(api.URL + '/projects/' + projectId + '/symbols/' + symbolId + '/hide')
                .then(success)
                .catch(ResourceResponseService.fail);

            function success(response) {
                var message = 'Symbol deleted';
                return ResourceResponseService.successWithToast(response, message);
            }
        }

        function deleteSomeSymbols(projectId, symbolsIds) {

            symbolsIds = symbolsIds.join();

            return $http.post(api.URL + '/projects/' + projectId + '/symbols/' + symbolsIds + '/hide')
                .then(success)
                .catch(ResourceResponseService.fail);

            function success(response) {
                var message = 'Symbols deleted';
                return ResourceResponseService.successWithToast(response, message);
            }
        }

        function getRevisions(projectId, symbolId) {

            return $http.get(api.URL + '/projects/' + projectId + '/symbols/' + symbolId + '/complete')
                .then(ResourceResponseService.success)
                .catch(ResourceResponseService.fail);
        }
    }
}());