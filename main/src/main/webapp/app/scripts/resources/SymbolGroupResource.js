(function () {

    angular
        .module('weblearner.resources')
        .factory('SymbolGroupResource', Resource);

    Resource.$inject = ['$http', 'paths'];

    /**
     * The resource that handles http requests to the API to do CRUD operations on symbol groups
     *
     * @param $http
     * @param paths
     * @returns {SymbolGroupResource}
     * @constructor
     */
    function Resource($http, paths) {

        /**
         * The recourse object for a symbol group
         *
         * @constructor
         */
        function SymbolGroupResource() {
        }

        /**
         * Makes a GET request to /rest/projects/{projectId}/groups/{groupId} in order to fetch a specific symbol group.
         * As options, an object with a property 'embedSymbols' with a boolean property can be passed. If 'embedSymbols'
         * is true, then all symbols will be fetched, too. Otherwise an empty symbols array.
         *
         * @param {number} projectId - The id of the project the symbol group belongs to
         * @param {number} groupId - The id of the group that should be fetched
         * @param {Object} [options] - An object that can have a boolean property 'embedSymbols'
         * @returns {*} - An angular promise
         */
        SymbolGroupResource.prototype.get = function (projectId, groupId, options) {
            var _this = this;
            var query = '';

            if (options && options.embedSymbols && options.embedSymbols === true) {
                query = '?embed=symbols';
            }

            return $http.get(paths.api.URL + '/projects/' + projectId + '/groups/' + groupId + query)
                .then(function (response) {
                    return _this.build(response.data);
                })
        };

        /**
         * Makes a GET request to /rest/projects/{projectId}/groups in order to fetch all symbol groups of a project.
         * As options, an object with a property 'embedSymbols' with a boolean property can be passed. If 'embedSymbols'
         * is true, then all symbols of all symbol groups will be fetched, too. Otherwise an empty symbols array.
         *
         * @param {number} projectId - The id of the project whose projects should be fetched
         * @param {Object} options - An object that can have a boolean property 'embedSymbols'
         * @returns {*} - An angular promise
         */
        SymbolGroupResource.prototype.getAll = function (projectId, options) {
            var _this = this;
            var query = '';

            if (options && options.embedSymbols && options.embedSymbols === true) {
                query = '?embed=symbols';
            }

            return $http.get(paths.api.URL + '/projects/' + projectId + '/groups' + query)
                .then(function (response) {
                    return _this.buildSome(response.data);
                })
        };

        /**
         * Makes a GET request to /rest/projects/{projectId}/groups/{groupId}/symbols in order to fetch all symbols that
         * belong to a given symbol group.
         *
         * @param {number} projectId - The id of the project of the group
         * @param {number} groupId - The id of the group
         * @returns {*} - An angular promise
         */
        SymbolGroupResource.prototype.getSymbols = function (projectId, groupId) {
            var _this = this;

            $http.get(paths.api.URL + '/projects/' + projectId + '/groups/' + groupId + '/symbols')
                .then(function (response) {
                    return _this.build(response.data);
                })
        };

        /**
         * Makes a POST request to /rest/projects/{projectId}/groups in order to create a new symbol group.
         *
         * @param {number} projectId - The id of the project of the symbol group
         * @param {number} group - The object of the symbol group that should be created
         * @returns {*} - An angular promise
         */
        SymbolGroupResource.prototype.create = function (projectId, group) {
            var _this = this;

            return $http.post(paths.api.URL + '/projects/' + projectId + '/groups', group)
                .then(function (response) {
                    return _this.build(response.data);
                })
        };

        /**
         * Makes a PUT request to /rest/projects/{projectId}/groups in order to update an existing symbol group.
         *
         * @param {number} projectId - The id of the project of the symbol group
         * @param {number} group - The symbol group that should be updated
         * @returns {*} - An angular promise
         */
        SymbolGroupResource.prototype.update = function (projectId, group) {
            var _this = this;

            return $http.put(paths.api.URL + '/projects/' + projectId + '/groups/' + group.id, group)
                .then(function (response) {
                    return _this.build(response.data);
                })
        };

        /**
         * Makes a DELETE request to /rest/projects/{projectId}/groups/{groupId} in order to delete an existing symbol
         * group. When deleted successfully, the symbols that belonged to the group are moved to the default group with
         * the id 0.
         *
         * @param {number} projectId - The id of the project of the symbol group
         * @param {number} group - The symbol group that should be deleted
         * @returns {*} - An angular promise
         */
        SymbolGroupResource.prototype.delete = function (projectId, group) {
            var _this = this;

            return $http.delete(paths.api.URL + '/projects/' + projectId + '/groups/' + group.id)
                .then(function (response) {
                    return _this.build(response.data);
                })
        };

        /**
         * Overwrite this method in order to create an instance of a symbol group. This method will be called on every
         * successful http request where a single symbol group is involved.
         *
         * @param {Object} data - The data the symbol group instance should be build from
         * @returns {*}
         */
        SymbolGroupResource.prototype.build = function (data) {
            return data;
        };

        /**
         * Overwrite this method in order to create a list of instances of symbol groups. This method will be called on
         * every successful http request where multiple symbol groups are involved.
         *
         * @param {Object[]} data - The data the list of symbol group instances should be build from
         * @returns {*}
         */
        SymbolGroupResource.prototype.buildSome = function (data) {
            return data;
        };

        return SymbolGroupResource;
    }
}());