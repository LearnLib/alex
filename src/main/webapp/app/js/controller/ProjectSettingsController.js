(function () {
    'use strict';

    angular
        .module('weblearner.controller')
        .controller('ProjectSettingsController', [
            '$scope', '$location', 'ProjectResource', 'SessionService',
            ProjectSettingsController
        ]);

    function ProjectSettingsController($scope, $location, ProjectResource, SessionService) {

        $scope.project = SessionService.project.get();
        $scope.projectCopy = angular.copy($scope.project);
        
        //////////

        $scope.updateProject = function () {
            if ($scope.update_form.$valid) {
                ProjectResource.update($scope.project)
                    .then(function (project) {
                        SessionService.project.save(project);
                        $scope.project = project;
                        $scope.projectCopy = project;
                    })
            } else {
                $scope.update_form.submitted = true;
            }
        };

        $scope.deleteProject = function () {
            ProjectResource.delete($scope.project)
                .then(function () {
                    SessionService.project.remove();
                    $location.path('/')
                })
        };

        $scope.reset = function () {
            $scope.project = angular.copy($scope.projectCopy);
        }
    }
}());