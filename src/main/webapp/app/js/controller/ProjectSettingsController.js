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

        //////////

        $scope.$on('project.edited', updateProject);

        //////////

        function updateProject (evt, project) {

            // delete this property because it is read only and the will throw an error otherwise
        	delete project.symbolAmount;

            // update the project on the server
            ProjectResource.update(project)
                .then(function (updatedProject) {
                    SessionService.project.save(updatedProject);
                    $scope.project = updatedProject;
                })
        }

        //////////

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
    }
}());