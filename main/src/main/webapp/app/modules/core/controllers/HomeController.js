(function () {
    'use strict';

    angular
        .module('ALEX.core')
        .controller('HomeController', HomeController);

    HomeController.$inject = ['$scope', '$state', 'ProjectResource', 'SessionService'];

    /**
     * The controller for the landing page. It lists the projects.
     *
     * Template: 'views/home.html'
     *
     * @param $scope - The controllers scope
     * @param $state - The ui.router $state service
     * @param ProjectResource - The API resource for projects
     * @param Session - The SessionService
     * @constructor
     */
    function HomeController($scope, $state, ProjectResource, Session) {

        /**
         * The list of all created projects
         * @type {Project[]}
         */
        $scope.projects = [];

        (function init() {

            // redirect to the project dash page if one is open
            if (Session.project.get() !== null) {
                $state.go('project');
            }

            // get all projects from the server
            ProjectResource.getAll()
                .then(function (projects) {
                    $scope.projects = projects;
                });
        }());

        /**
         * Opens a project by saving it into the session and redirect to the projects dashboard.
         *
         * @param {Project} project - The project that should be saved in the sessionStorage
         */
        $scope.openProject = function (project) {
            Session.project.save(project);
            $state.go('project');
        }
    }
}());