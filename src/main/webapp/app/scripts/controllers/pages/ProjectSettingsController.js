(function () {
    'use strict';

    angular
        .module('weblearner.controller')
        .controller('ProjectSettingsController', [
            '$scope', '$state', 'ProjectResource', 'SessionService', 'PromptService',
            ProjectSettingsController
        ]);

    /**
     * @param $scope
     * @param $state
     * @param ProjectResource
     * @param SessionService
     * @param PromptService
     */
    function ProjectSettingsController($scope, $state, ProjectResource, SessionService, PromptService) {

        var projectCopy;

        /** The project that is stored in the session **/
        $scope.project = SessionService.project.get();
        projectCopy = angular.copy($scope.project);

        //////////

        /**
         * Updates a project and saves the updated project in the sessionStorage
         */
        $scope.updateProject = function () {

            // delete this property because it is read only and the will throw an error otherwise
        	delete $scope.project.symbolAmount;

            // update the project on the server
            ProjectResource.update($scope.project)
                .then(function (updatedProject) {
                    SessionService.project.save(updatedProject);
                    $scope.project = updatedProject;
                    projectCopy = angular.copy($scope.project);
                })
        }

        /**
         * Prompts the user for confirmation and deletes the project on success. Redirects to '/home' when project
         * was deleted and removes the project from the sessionStorage
         */
        $scope.deleteProject = function () {
            var message = 'Do you really want to delete this project with all its symbols and test results? This process can not be undone.';

            // prompt the user
        	PromptService.confirm(message)
	        	.then(function(){

	        	    // delete project from server
	        		ProjectResource.delete($scope.project)
		                .then(function () {
		                    SessionService.project.remove();
		                    $state.go('home');
		                })
	        	})
        }

        /**
         * Resets the project edit form by copying the project copy back to the project under edit
         */
        $scope.resetForm = function() {
            $scope.project = angular.copy(projectCopy);
        }
    }
}());