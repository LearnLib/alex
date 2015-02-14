(function () {
    'use strict';

    angular
        .module('weblearner.resources')
        .factory('ProjectResource', [
            '$http', 'api', 'ResourceResponseService',
            ProjectResource
        ]);

    /**
     * @param $http
     * @param api
     * @param ResourceResponseService
     * @return {{all: getAllProjects, get: getProject, create: createProject, update: updateProject, delete: deleteProject}}
     * @constructor
     */
    function ProjectResource($http, api, ResourceResponseService) {

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
                .then(ResourceResponseService.success)
                .catch(ResourceResponseService.fail);
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
                .catch(ResourceResponseService.fail);

            function success(response) {
                var message = 'Project "' + response.data.name + '" created';
                return ResourceResponseService.successWithToast(response, message);
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
                .then(ResourceResponseService.success)
                .catch(ResourceResponseService.fail);
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
                .catch(ResourceResponseService.fail);

            function success(response) {
                var message = 'Project deleted';
                return ResourceResponseService.successWithToast(response, message);
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
                .catch(ResourceResponseService.fail);

            function success(response) {
                var message = 'Project updated';
                return ResourceResponseService.successWithToast(response, message);
            }
        }
    }
}());