(function(){
    'use strict';

    angular
        .module('weblearner.controller')
        .controller('ProjectController', [
            '$scope', 'SessionService',
            ProjectController
        ]);

    function ProjectController($scope, SessionService) {

        $scope.project = SessionService.project.get();
    }
}());

