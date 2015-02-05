(function(){
    'use strict';

    angular
        .module('weblearner.controller')
        .controller('DashboardController', [
            '$scope', 'SessionService',
            DashboardController
        ]);

    function DashboardController($scope, SessionService) {

        $scope.project = SessionService.project.get();
    }
}());