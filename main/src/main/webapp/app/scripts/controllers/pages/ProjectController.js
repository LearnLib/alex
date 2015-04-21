(function(){
    'use strict';

    angular
        .module('ALEX.controller')
        .controller('ProjectController', ProjectController);

    ProjectController.$inject = ['$scope', 'SessionService'];

    /**
     * The controller that is responsible for the site '/project' and shows the dashboard of the project
     *
     * @param $scope
     * @param SessionService
     * @constructor
     */
    function ProjectController($scope, SessionService) {

        /** The project that is stored in the sessionStorage **/
        $scope.project = SessionService.project.get();
    }
}());
