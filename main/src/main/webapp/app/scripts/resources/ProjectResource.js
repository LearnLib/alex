(function () {
    'use strict';

    angular
        .module('weblearner.resources')
        .factory('ProjectResource', ProjectResource);

    ProjectResource.$inject = ['$http', 'paths'];

    /**
     * The resource that handles http calls to the API to do CRUD operations on projects
     *
     * @param $http - The $http angular service
     * @param paths - The constant with application paths
     * @return {Resource}
     * @constructor
     */
    function ProjectResource($http, paths) {

        /**
         * The resource object
         *
         * @constructor
         */
        function Resource() {
        }

        /**
         * Make a GET http request to /rest/projects in order to fetch all existings projects
         *
         * @return {*}
         */
        Resource.prototype.all = function () {
            var _this = this;
            return $http.get(paths.api.URL + '/projects')
                .then(function (response) {
                    return _this.buildSome(response.data);
                })
        };

        /**
         * Make a GET http request to /rest/projects/{id} in order to fetch a single project by its id
         *
         * @param id - The id of the project that should be fetched
         * @return {*}
         */
        Resource.prototype.get = function (id) {
            var _this = this;
            return $http.get(paths.api.URL + '/projects/' + id)
                .then(function (response) {
                    return _this.build(response.data);
                })
        };

        /**
         * Make a POST http request to /rest/projects with a project object as data in order to create a new project
         *
         * @param project - The project that should be created
         * @return {*}
         */
        Resource.prototype.create = function (project) {
            var _this = this;
            return $http.post(paths.api.URL + '/projects', project)
                .then(function (response) {
                    return _this.build(response.data);
                })
        };

        /**
         * Make a PUT http request to /rest/projects with a project as data in order to update an existing project
         *
         * @param project - The updated instance of a project that should be updated on the server
         * @return {*}
         */
        Resource.prototype.update = function (project) {
            var _this = this;
            return $http.put(paths.api.URL + '/projects/' + project.id, project)
                .then(function (response) {
                    return _this.build(response.data);
                })
        };

        /**
         * Make a DELETE http request to /rest/projects in order to delete an existing project
         *
         * @param project - The project that should be deleted
         * @return {*}
         */
        Resource.prototype.delete = function (project) {
            var _this = this;
            return $http.delete(paths.api.URL + '/projects/' + project.id)
                .then(function (response) {
                    return _this.build(response.data);
                })
        };

        /**
         * The function that is called by all other request methods that should create a new instance of a project.
         * Overwrite this method when creating an instance of ProjectResource! Or leave it as it is ...
         *
         * @param data - The object the project should be created from
         * @return {*}
         */
        Resource.prototype.build = function (data) {
            return data;
        };

        /**
         * Overwrite this method in order to create an array of projects. This method will be called on every successful
         * http request where multiple projects are involved.
         *
         * @param data - The data the array of projects should be build from
         * @returns {*}
         */
        Resource.prototype.buildSome = function (data) {
            return data;
        };

        return Resource;
    }
}());