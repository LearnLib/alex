(function () {

    angular
        .module('ALEX.resources')
        .factory('SymbolGroupResource', Resource);

    /**
     * The resource that handles http requests to the API to do CRUD operations on symbol groups
     *
     * @param $http - The angular $http service
     * @param SymbolGroup - The factory for SymbolGroup objects
     * @returns {{getAll: getAll, create: create, update: update, delete: remove}}
     * @constructor
     */
    // @ngInject
    function Resource($http, SymbolGroup) {
        return {
            getAll: getAll,
            create: create,
            update: update,
            delete: remove
        };

        /**
         * Makes a GET request to /rest/projects/{projectId}/groups in order to fetch all symbol groups of a project.
         * As options, an object with a property 'embedSymbols' with a boolean property can be passed. If 'embedSymbols'
         * is true, then all symbols of all symbol groups will be fetched, too. Otherwise an empty symbols array.
         *
         * @param {number} projectId - The id of the project whose projects should be fetched
         * @param {Object} [options] - An object that can have a boolean property 'embedSymbols'
         * @returns {*} - An angular promise
         */
        function getAll(projectId, options) {
            var query = '';

            if (options && options.embedSymbols && options.embedSymbols === true) {
                query = '?embed=symbols';
            }

            return $http.get('/rest/projects/' + projectId + '/groups' + query)
                .then(SymbolGroup.transformApiResponse);
        }

        /**
         * Makes a POST request to /rest/projects/{projectId}/groups in order to create a new symbol group.
         *
         * @param {number} projectId - The id of the project of the symbol group
         * @param {number} group - The object of the symbol group that should be created
         * @returns {*} - An angular promise
         */
        function create(projectId, group) {
            return $http.post('/rest/projects/' + projectId + '/groups', group)
                .then(SymbolGroup.transformApiResponse);
        }

        /**
         * Makes a PUT request to /rest/projects/{projectId}/groups in order to update an existing symbol group.
         *
         * @param {SymbolGroup} group - The symbol group that should be updated
         * @returns {*} - An angular promise
         */
        function update(group) {
            return $http.put('/rest/projects/' + group.project + '/groups/' + group.id, group)
                .then(SymbolGroup.transformApiResponse);
        }

        /**
         * Makes a DELETE request to /rest/projects/{projectId}/groups/{groupId} in order to delete an existing symbol
         * group. When deleted successfully, the symbols that belonged to the group are moved to the default group with
         * the id 0.
         *
         * @param {SymbolGroup} group - The symbol group that should be deleted
         * @returns {*} - An angular promise
         */
        function remove(group) {
            return $http.delete('/rest/projects/' + group.project + '/groups/' + group.id)
        }
    }
}());