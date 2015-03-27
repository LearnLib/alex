(function () {
    'use strict';

    angular
        .module('weblearner.controller')
        .controller('ProjectSettingsController', ProjectSettingsController);

    ProjectSettingsController.$inject = [
        '$scope', '$state', 'Project', 'SessionService', 'PromptService', 'ToastService', 'LearnerService'
    ];

    /**
     * The controller that handles the deleting and updating of a project. Belongs to the template at
     * '/views/pages/project-settings.html'
     *
     * @param $scope
     * @param $state
     * @param Project
     * @param Session
     * @param PromptService
     * @param Toast
     * @param Learner
     */
    function ProjectSettingsController($scope, $state, Project, Session, PromptService, Toast, Learner) {

        var projectCopy;

        /**
         * The project that is stored in the session
         * @type {Project}
         **/
        $scope.project = Session.project.get();
        projectCopy = angular.copy($scope.project);

        (function init() {

            // check if the current project is used in learning and abort deletion
            // because of unknown side effects
            Learner.isActive()
                .then(function () {
                    Toast.info('Cannot edit the project. A learning process is still active.');
                    $state.go('project');
                });
        }());

        /**
         * Updates a project and saves the updated project in the sessionStorage
         */
        $scope.updateProject = function () {

            // update the project on the server
            Project.Resource.update($scope.project)
                .then(function (updatedProject) {
                    Session.project.save(updatedProject);
                    $scope.project = updatedProject;
                    projectCopy = angular.copy($scope.project);
                })
        };

        /**
         * Prompts the user for confirmation and deletes the project on success. Redirects to '/home' when project
         * was deleted and removes the project from the sessionStorage.
         */
        $scope.deleteProject = function () {
            var message = 'Do you really want to delete this project with all its symbols and test results? This process can not be undone.';
            PromptService.confirm(message)
                .then(function () {
                    Project.Resource.delete($scope.project)
                        .then(function () {
                            Toast.success('Project <strong>' + $scope.project.name + '</strong> deleted');
                            Session.project.remove();
                            $state.go('home');
                        })
                        .catch(function (response) {
                            Toast.danger('<p><strong>Deleting project failed</strong></p>' + response.data.message);
                        })
                })
        };

        /**
         * Resets the project edit form by copying the project copy back to the project under edit
         */
        $scope.resetForm = function () {
            $scope.project = angular.copy(projectCopy);
        }
    }
}());