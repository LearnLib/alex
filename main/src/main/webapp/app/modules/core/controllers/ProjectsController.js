(function () {
    'use strict';

    angular
        .module('ALEX.core')
        .controller('ProjectsController', ProjectsController);

    ProjectsController.$inject = ['$scope', '$state', 'SessionService'];

    /**
     * The controller that shows the page to manage projects
     *
     * @param $scope
     * @param $state
     * @param SessionService
     * @constructor
     */
    function ProjectsController($scope, $state, Session) {

        // go to the dashboard if there is a project in the session
        if (Session.project.get() !== null) {
            $state.go('dashboard');
        }
    }
}());
