(function () {
    'use strict';

    angular
        .module('weblearner.controller')
        .controller('HomeController', HomeController);

    HomeController.$inject = ['$scope', '$state', 'Project', 'SessionService'];

    /**
     * The controller for the landing page. It lists the projects.
     *
     * The controller can be found at 'views/pages/home.html'
     *
     * @param $scope
     * @param $state
     * @param Project
     * @param Session
     * @constructor
     */
    function HomeController($scope, $state, Project, Session) {

        /**
         * The list of all created projects
         * @type {Project[]}
         */
        $scope.projects = [];

        // initialize the controllers data
        (function init() {

            // redirect to the project dash page if one is open
            if (Session.project.get() !== null) {
                $state.go('project');
            }

            // get all projects from the server
            Project.Resource.all()
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