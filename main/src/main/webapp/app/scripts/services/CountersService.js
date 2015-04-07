(function () {
    'use strict';

    angular
        .module('weblearner.services')
        .factory('CountersService', CountersService);

    CountersService.$inject = ['$http', 'paths'];

    /**
     * The service that communicates with the API in order to read and delete counters. Counters are objects consisting
     * of a unique 'name' property, a 'value' which holds the current value of the counter in the database and 'project'
     * for the projects id.
     *
     * Example: {"name": "i", "value": 10, "project": 1}
     *
     * @param $http - angular $http service
     * @param paths - application paths constants
     * @returns {{getAll: getAll, delete: deleteOne, deleteSome: deleteSome}}
     * @constructor
     */
    function CountersService($http, paths) {

        // the services functions
        return {
            getAll: getAll,
            delete: deleteOne,
            deleteSome: deleteSome
        };

        /**
         * Makes a GET request to /rest/projects/{projectId}/counters in order to fetch all counter of the current
         * project.
         *
         * @param {number} projectId - The id of a project
         * @returns angular promise object of the request
         */
        function getAll(projectId) {
            return $http.get(paths.api.URL + '/projects/' + projectId + '/counters')
                .then(function (response) {
                    return response.data;
                })
        }

        /**
         * Makes a DELETE request to /rest/projects/{projectId}/counters/{counterName} in order to delete a counter from
         * the database.
         *
         * @param {number} projectId - The id of a project
         * @param {string} name - The name of a counter
         * @returns angular promise object of the request
         */
        function deleteOne(projectId, name) {
            return $http.delete(paths.api.URL + '/projects/' + projectId + '/counters/' + name)
                .then(function (response) {
                    return response.data;
                })
        }

        /**
         * Makes a DELETE request to /rest/projects/{projectId}/counters/batch/{counterNames} in order to delete
         * multiple counters from the database
         *
         * @param {number} projectId - The id of a project
         * @param {string[]} names - A list of the names of counters
         * @returns angular promise object of the request
         */
        function deleteSome(projectId, names) {
            var n = names.join(',');
            return $http.delete(paths.api.URL + '/projects/' + projectId + '/counters/batch/' + n)
                .then(function (response) {
                    return response.data;
                })
        }
    }
}());