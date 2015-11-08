(function () {
    'use strict';

    angular
        .module('ALEX.resources')
        .factory('FileResource', Resource);

    /**
     * The resource that handles API calls concerning the management of files.
     *
     * @param $http - The angular $http service
     * @param paths - The ALEX paths constant
     * @returns {{getAll: getAll, delete: remove}}
     * @constructor
     */
    // @ngInject
    function Resource($http, paths) {
        return {
            getAll: getAll,
            delete: remove
        };

        /**
         * Fetches all available files from the server that belong to a project
         *
         * @param {number} projectId - The id of the project
         */
        function getAll(projectId) {
            return $http.get(paths.api.URL + '/projects/' + projectId + '/files')
                .then(function (response) {
                    return response.data;
                })
        }

        /**
         * Deletes a single file from the server
         *
         * @param {number} projectId - The id of the project
         * @param {File} file - The file object to be deleted
         */
        function remove(projectId, file) {
            return $http.delete(paths.api.URL + '/projects/' + projectId + '/files/' + encodeURI(file.name))
        }
    }
}());