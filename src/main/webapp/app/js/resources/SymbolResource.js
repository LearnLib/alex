(function () {
    'use strict';

    angular
        .module('weblearner.resources')
        .factory('SymbolResource', [
            '$http', '$q', 'api', 'ngToast',
            SymbolResource
        ]);

    /**
     *
     * @param $http
     * @param $q
     * @param api
     * @param toast
     * @return {{all: getAllSymbols, allWeb: getAllWebSymbols, allRest: getAllRestSymbols, get: getSymbol,
     *          create: createSymbol, update: updateSymbol, delete: deleteSymbol}}
     * @constructor
     */
    function SymbolResource($http, $q, api, toast) {

        var service = {
            get: getSymbol,
            getAll: getAllSymbols,
            recover: recoverSymbol,
            create: createSymbol,
            update: updateSymbol,
            delete: deleteSymbol,
            deleteSome: deleteSomeSymbols
        };
        return service;

        //////////

        /**
         * get a specific web or rest symbol by its id
         * @param projectId
         * @param symbolId
         * @return {*}
         */
        function getSymbol(projectId, symbolId) {

            return $http.get(api.URL + '/projects/' + projectId + '/symbols/' + symbolId)
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                console.error(error.data);
                toast.create({
                    class: 'danger',
                    content: error.data.message,
                    dismissButton: true
                });
                return $q.reject();
            }
        }

        /**
         * get all rest and web symbols of a project by the projects id
         * @param projectId
         * @return {*}
         */
        function getAllSymbols(projectId, options) {

            var queryParams = '?';

            if (options) {

                if (options.type) queryParams += 'type=' + options.type;
                if (options.deleted && options.deleted === true) queryParams += '&showHidden=hidden';

                return $http.get(api.URL + '/projects/' + projectId + '/symbols/' + queryParams)
                    .then(success)
                    .catch(fail);

            } else {
                return $http.get(api.URL + '/projects/' + projectId + '/symbols')
                    .then(success)
                    .catch(fail);
            }

            function success(response) {
                return response.data;
            }

            function fail(error) {
                console.error(error.data);
                toast.create({
                    class: 'danger',
                    content: error.data.message,
                    dismissButton: true
                });
                return $q.reject();
            }
        }

        function recoverSymbol(projectId, symbolId) {
        	return $http.post(api.URL + '/projects/' + projectId + '/symbols/' + symbolId + '/show', {})
	    		.then(success)
	    		.catch(fail);
        	
        	function success(response) {
                console.log(response);
                return response.data;
            }

            function fail(error) {
                console.error(error.data);
                toast.create({
                    class: 'danger',
                    content: error.data.message,
                    dismissButton: true
                });
                return $q.reject();
            }
        }

        /**
         * create a new symbol
         * @parem projectId
         * @param symbol
         * @return {*}
         */
        function createSymbol(projectId, symbol) {
        	
        	if (angular.isArray(symbol)) {
        		return createSymbols(projectId, symbol)
        	}
        	        	
            return $http.post(api.URL + '/projects/' + projectId + '/symbols', symbol)
                .then(success)
                .catch(fail);

            function success(response) {
                toast.create({
                    class: 'success',
                    content: 'Symbol ' + response.data.name + ' created'
                });
                return response.data;
            }

            function fail(error) {
                console.error(error.data);
                toast.create({
                    class: 'danger',
                    content: error.data.message,
                    dismissButton: true
                });
                return $q.reject();
            }
        }
        
    	function createSymbols(projectId, symbols) {
        	        	        	
            return $http.put(api.URL + '/projects/' + projectId + '/symbols', symbols)
                .then(success)
                .catch(fail);

            function success(response) {
                toast.create({
                    class: 'success',
                    content: 'Symbols created'
                });
                return response.data;
            }

            function fail(error) {
                console.error(error.data);
                toast.create({
                    class: 'danger',
                    content: 'Upload failed. Some symbols already exist or existed in this project',
                    dismissButton: true
                });
                return $q.reject();
            }
        }
        
        /**
         * update an existing symbol
         * @param symbol
         * @return {*}
         */
        function updateSymbol(projectId, symbol) {
            return $http.put(api.URL + '/projects/' + projectId+ '/symbols/' + symbol.id, symbol)
                .then(success)
                .catch(fail);

            function success(response) {
                toast.create({
                    class: 'success',
                    content: 'Symbol "' + response.data.name + '" updated'
                });
                return response.data;
            }

            function fail(error) {
                console.error(error.data);
                toast.create({
                    class: 'danger',
                    content: error.data.message,
                    dismissButton: true
                });
                return $q.reject();
            }
        }

        /**
         * delete an existing symbol
         * @param symbol
         * @return {*}
         */
        function deleteSymbol(projectId, symbolId) {

            return $http.post(api.URL + '/projects/' + projectId + '/symbols/' + symbolId + '/hide')
                .then(success)
                .catch(fail);

            function success(response) {
                toast.create({
                    class: 'success',
                    content: 'Symbol deleted'
                });
                return response.data;
            }

            function fail(error) {
                console.error(error.data);
                toast.create({
                    class: 'danger',
                    content: error.data.message,
                    dismissButton: true
                });
                return $q.reject();
            }
        }

        function deleteSomeSymbols(projectId, symbolsIds) {

            symbolsIds = symbolsIds.join();

            return $http.post(api.URL + '/projects/' + projectId + '/symbols/' + symbolsIds + '/hide')
                .then(success)
                .catch(fail);

            function success(response) {
                toast.create({
                    class: 'success',
                    content: 'Symbols deleted'
                });
                return response.data;
            }

            function fail(error) {
                console.error(error.data);
                toast.create({
                    class: 'danger',
                    content: error.data.message,
                    dismissButton: true
                });
                return $q.reject();
            }
        }
    }
}());