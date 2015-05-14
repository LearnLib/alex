(function () {
    'use strict';

    angular
        .module('ALEX.core')
        .controller('ProjectCreateController', ProjectCreateController);

    ProjectCreateController.$inject = ['$scope', '$state', 'Project', 'ProjectResource', 'ToastService'];

    /**
     * The controller that shows the form for creating new projects
     *
     * Template: 'views/project-create.html'
     *
     * @param $scope - The controllers scope
     * @param $state - The ui.router $state service
     * @param Project - The factory for Project objects
     * @param ProjectResource - The API resource for projects
     * @param Toast - The ToastService
     * @constructor
     */
    function ProjectCreateController($scope, $state, Project, ProjectResource, Toast) {

        /**
         * The model for the new project
         * @type {Project}
         */
        $scope.project = new Project();

        /**
         * Make a call to the API to create a new project
         */
        $scope.createProject = function() {
            ProjectResource.create($scope.project)
                .then(function (createdProject) {
                    Toast.success('Project "' + createdProject.name + '" created');
                    $state.go('home');
                })
                .catch(function (response) {
                    Toast.danger('<p><strong>Creation of project failed</strong></p>' + response.data.message)
                })
        }
    }
}());