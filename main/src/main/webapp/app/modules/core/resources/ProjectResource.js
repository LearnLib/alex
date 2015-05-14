(function () {
    'use strict';

    angular
        .module('ALEX.core')
        .factory('ProjectResource', Resource);

    Resource.$inject = ['$http', 'paths', 'Project'];

    /**
     * The resource that handles http calls to the API to do CRUD operations on projects
     *
     * @param $http - The $http angular service
     * @param paths - The constant with application paths
     * @param Project - Project factory
     * @returns {{getAll: getAll, get: get, create: create, update: update, delete: remove}}
     * @constructor
     */
    function Resource($http, paths, Project) {
        return {
            getAll: getAll,
            get: get,
            create: create,
            update: update,
            delete: remove
        };

        /**
         * Make a GET http request to /rest/projects in order to fetch all existing projects
         *
         * @returns {*}
         */
        function getAll() {
            return $http.get(paths.api.URL + '/projects')
                .then(Project.transformApiResponse);
        }

        /**
         * Make a GET http request to /rest/projects/{id} in order to fetch a single project by its id
         *
         * @param {number} id - The id of the project that should be fetched
         * @return {*}
         */
        function get (id) {
            return $http.get(paths.api.URL + '/projects/' + id)
                .then(Project.transformApiResponse);
        }

        /**
         * Make a POST http request to /rest/projects with a project object as data in order to create a new project
         *
         * @param {Project} project - The project that should be created
         * @return {*}
         */
        function create (project) {
            return $http.post(paths.api.URL + '/projects', project)
                .then(Project.transformApiResponse);
        }

        /**
         * Make a PUT http request to /rest/projects with a project as data in order to update an existing project
         *
         * @param {Project} project - The updated instance of a project that should be updated on the server
         * @return {*}
         */
        function update (project) {
            return $http.put(paths.api.URL + '/projects/' + project.id, project)
                .then(Project.transformApiResponse);
        }

        /**
         * Make a DELETE http request to /rest/projects in order to delete an existing project
         *
         * @param {Project} project - The project that should be deleted
         * @returns {HttpPromise}
         */
        function remove (project) {
            return $http.delete(paths.api.URL + '/projects/' + project.id)
        }
    }
}());