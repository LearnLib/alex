(function () {
    'use strict';

    angular
        .module('weblearner.controller')
        .controller('ProjectCreateController', [
            '$scope', '$state', 'ProjectResource',
            ProjectCreateController
        ]);

    /**
     * ProjectCreateController
     *
     * The controller that belongs to 'app/partials/project-create.html' and handles the creation of a new project
     *
     * @param $scope
     * @param $state
     * @param ProjectResource
     * @constructor
     */
    function ProjectCreateController($scope, $state, ProjectResource) {

        $scope.project = {
            name: null,
            baseUrl: null,
            description: null
        };

        /**
         * Make a call to the API to create a new project
         *
         * @param project - The project that should be created
         */
        $scope.createProject = function() {
            ProjectResource.create($scope.project)
                .then(function () {
                    $state.go('home');
                })
        }
    }
}());