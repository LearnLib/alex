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

        // Listen for the event project.created from a child controller
        $scope.$on('project.created', createProject);

        /**
         * Make a call to the API to create a new project
         *
         * @param evt - The event object
         * @param project - The project that should be created
         */
        function createProject(evt, project) {
            ProjectResource.create(project)
                .then(function () {
                    $state.go('home');
                })
        }
    }
}());