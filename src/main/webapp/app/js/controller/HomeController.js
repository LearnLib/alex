(function () {
    'use strict';

    angular
        .module('weblearner.controller')
        .controller('HomeController', [
            '$scope', '$state', 'ProjectResource', 'SessionService',
            HomeController
        ]);

    /**
     * HomeController
     *
     * The controller for the landing page. It lists the projects.
     *
     * @param $scope
     * @param $location
     * @param ProjectResource
     * @param SessionService
     * @constructor
     */
    function HomeController($scope, $state, ProjectResource, SessionService) {

        /** The project list */
        $scope.projects = [];

        //////////

        // redirect to the project dash page if one is open
        if (SessionService.project.get()) {
            $state.go('project');
        }

        // get all projects from the server
        ProjectResource.all()
            .then(function (projects) {
                $scope.projects = projects;
            });

        //////////

        /**
         * Open a project by saving it into the session and redirect to the projects dashboard.
         *
         * @param project
         */
        $scope.openProject = function (project) {
            SessionService.project.save(project);
            $state.go('project');
        }
    }
}());