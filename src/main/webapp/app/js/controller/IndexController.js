(function () {
    'use strict';

    angular
        .module('weblearner.controller')
        .controller('IndexController', [
            '$scope', '$location', 'ProjectResource', 'SessionService',
            IndexController
        ]);

    /**
     * IndexController
     *
     * The controller for the landing page. It lists the projects.
     *
     * @param $scope
     * @param $location
     * @param ProjectResource
     * @param SessionService
     * @constructor
     */
    function IndexController($scope, $location, ProjectResource, SessionService) {

        /** The project list */
        $scope.projects = [];

        //////////

        // redirect to the project dash page if one is open
        if (SessionService.project.get() != null) {
            $location.path('/project/' + SessionService.project.get().id);
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
            $location.path('/project/' + project.id);
        }
    }
}());