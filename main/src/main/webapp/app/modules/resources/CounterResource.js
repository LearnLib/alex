(function () {
    'use strict';

    angular
        .module('ALEX.resources')
        .factory('CounterResource', CounterResource);

    /**
     * The service that communicates with the API in order to read and delete counters.
     *
     * @param $http - angular $http service
     * @param Counter - The counter model
     * @returns {{getAll: getAll, delete: remove, deleteSome: deleteSome}}
     * @constructor
     */
    // @ngInject
    function CounterResource($http, Counter) {
        return {
            getAll: getAll,
            delete: remove,
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
            return $http.get('/rest/projects/' + projectId + '/counters')
                .then(response => response.data.map(c => new Counter(c)));
        }

        /**
         * Makes a DELETE request to /rest/projects/{projectId}/counters/{counterName} in order to delete a counter from
         * the database.
         *
         * @param {number} projectId - The id of a project
         * @param {string} name - The name of a counter
         * @returns angular promise object of the request
         */
        function remove(projectId, name) {
            return $http.delete('/rest/projects/' + projectId + '/counters/' + name)
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
            const n = names.join(',');
            return $http.delete('/rest/projects/' + projectId + '/counters/batch/' + n)
        }
    }
}());