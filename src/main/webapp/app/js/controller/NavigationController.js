(function () {
    'use strict';

    angular
        .module('weblearner.controller')
        .controller('NavigationController', [
            '$scope', '$location', 'SessionService',
            NavigationController
        ]);

    /**
     * the controller to handle the app navigation
     * @template 'app/partials/navs/nav-main.html'
     * @param $scope
     * @param $location
     * @param Session
     * @constructor
     */
    function NavigationController($scope, $location, Session) {

        /** the project or null if not open */
        $scope.project = Session.project.get();

        //////////

        // load project into scope when projectOpened is emitted
        $scope.$on('project.opened', function () {
            $scope.project = Session.project.get();
        });

        // delete project from scope when projectOpened is emitted
        $scope.$on('project.closed', function () {
            $scope.project = null;
        });

        //////////

        /**
         * remove the project object from the session and redirect to the start page
         */
        $scope.closeProject = function () {
            Session.project.remove();
            $location.path('/');
        }
    }
}());