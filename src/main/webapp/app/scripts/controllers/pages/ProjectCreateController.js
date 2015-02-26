(function () {
    'use strict';

    angular
        .module('weblearner.controller')
        .controller('ProjectCreateController', ProjectCreateController);

    ProjectCreateController.$inject = ['$scope', '$state', 'Project'];

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
    function ProjectCreateController($scope, $state, Project) {

        $scope.project = new Project();

        /**
         * Make a call to the API to create a new project
         *
         * @param project - The project that should be created
         */
        $scope.createProject = function() {
            Project.Resource.create($scope.project)
                .then(function () {
                    $state.go('home');
                })
        }
    }
}());