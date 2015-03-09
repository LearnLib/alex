(function () {
    'use strict';

    angular
        .module('weblearner.controller')
        .controller('ProjectCreateController', ProjectCreateController);

    ProjectCreateController.$inject = ['$scope', '$state', 'Project', 'ToastService'];

    /**
     * ProjectCreateController
     *
     * The controller that belongs to 'app/partials/project-create.html' and handles the creation of a new project
     *
     * @param $scope
     * @param $state
     * @param Project
     * @constructor
     */
    function ProjectCreateController($scope, $state, Project, Toast) {

        $scope.project = new Project();

        /**
         * Make a call to the API to create a new project
         */
        $scope.createProject = function() {
            Project.Resource.create($scope.project)
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