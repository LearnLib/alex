(function () {
    'use strict';

    angular
        .module('weblearner.resources')
        .factory('ProjectResource', [
            '$http', '$q', 'api', 'ngToast',
            Project
        ]);

    /**
     * Project
     * The resource to do crud operations on a project
     *
     * @param $http
     * @param $q
     * @param api
     * @param toast
     * @return {{all: getAllProjects, get: getProject, create: createProject, update: updateProject,
     *          delete: deleteProject}}
     * @constructor
     */
    function Project($http, $q, api, toast) {

        var service = {
            all: getAllProjects,
            get: getProject,
            create: createProject,
            update: updateProject,
            delete: deleteProject
        };
        return service;

        //////////

        /**
         * Get all projects from the server
         *
         * @return {*}
         */
        function getAllProjects() {
            return $http.get(api.URL + '/projects')
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                toast.create({
                    class: 'danger',
                    content: error.data.message,
                    dismissButton: true
                });
                return $q.reject();
            }
        }

        /**
         * Create a new project
         *
         * @param project
         * @return {*}
         */
        function createProject(project) {
            return $http.post(api.URL + '/projects', project)
                .then(success)
                .catch(fail);

            function success(response) {
                toast.create({
                    class: 'success',
                    content: 'Project "' + response.data.name + '" created'
                });
                return response.data;
            }

            function fail(error) {
                toast.create({
                    class: 'danger',
                    content: error.data.message,
                    dismissButton: true
                });
                return $q.reject();
            }
        }

        /**
         * Get a project by its id
         *
         * @param id
         * @return {*}
         */
        function getProject(id) {
            return $http.get(api.URL + '/projects/' + id)
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                toast.create({
                    class: 'danger',
                    content: error.data.message,
                    dismissButton: true
                });
                return $q.reject();
            }
        }

        /**
         * Delete an existing project from the server
         *
         * @param project
         * @return {*}
         */
        function deleteProject(project) {
            return $http.delete(api.URL + '/projects/' + project.id)
                .then(success)
                .catch(fail);

            function success(response) {
                toast.create({
                    class: 'success',
                    content: 'Project deleted'
                });
                return response.data;
            }

            function fail(error) {
                toast.create({
                    class: 'danger',
                    content: error.data.message,
                    dismissButton: true
                });
                return $q.reject();
            }
        }

        /**
         * Updates an existing project
         *
         * @param project
         * @return {*}
         */
        function updateProject(project) {
            return $http.put(api.URL + '/projects/' + project.id, project)
                .then(success)
                .catch(fail);

            function success(response) {
                toast.create({
                    class: 'success',
                    content: 'Project Updated'
                });
                return response.data;
            }

            function fail(error) {
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