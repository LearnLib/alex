(function () {
    'use strict';

    angular
        .module('weblearner.controller')
        .controller('ProjectSettingsController', [
            '$scope', '$state', 'ProjectResource', 'SessionService', 'PromptService',
            ProjectSettingsController
        ]);

    function ProjectSettingsController($scope, $state, ProjectResource, SessionService, PromptService) {

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
        	
        	PromptService.confirm("Do you really want to delete this project with all its symbols and test results? This process can not be undone.")
	        	.then(function(){
	        		ProjectResource.delete($scope.project)
		                .then(function () {
		                    SessionService.project.remove();
		                    $state.go('home');
		                })
	        	})
        };

        $scope.reset = function () {
            $scope.project = angular.copy($scope.projectCopy);
        }
    }
}());