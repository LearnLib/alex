(function () {
    'use strict';

    angular
        .module('weblearner.controller')
        .controller('ProjectSettingsController', ProjectSettingsController);

    ProjectSettingsController.$inject = [
        '$scope', '$state', 'Project', 'SessionService', 'PromptService', 'ToastService', 'LearnerService'
    ];

    /**
     * The controller that handles the deleting and updating of a project. The page cannot be requested if the learner
     * is actively learning the current project. Therefore it redirects to the projects dashboard.
     *
     * Template: '/views/pages/project-settings.html'
     *
     * @param $scope - The controllers scope
     * @param $state - The ui.router $state service
     * @param Project - The factory for Projects
     * @param Session - The SessionService
     * @param PromptService - The PromptService
     * @param Toast - The ToastService
     * @param Learner - The LearnerService for the API
     */
    function ProjectSettingsController($scope, $state, Project, Session, PromptService, Toast, Learner) {

        // a copy of the sessions project for resetting the form
        var projectCopy;

        /**
         * The project that is stored in the session
         * @type {Project}
         **/
        $scope.project = Session.project.get();

        (function init() {

            // check if the current project is used in learning and abort deletion
            // because of unknown side effects
            Learner.isActive()
                .then(function (data) {
                    if (data.active && data.project === $scope.project.id) {
                        Toast.info('Cannot edit the project. A learning process is still active.');
                        $state.go('project');
                    }
                });

            copyProject();
        }());

        /**
         *
         */
        function copyProject() {
            projectCopy = Project.build(angular.copy($scope.project));
        }

        /**
         * Updates a project and saves the updated project in the sessionStorage
         */
        $scope.updateProject = function () {

            // update the project on the server
            Project.Resource.update($scope.project)
                .then(function (updatedProject) {
                    Toast.success('Project updated');
                    Session.project.save(updatedProject);
                    $scope.project = updatedProject;
                    copyProject();
                })
                .catch(function () {
                    Toast.danger('<p><strong>Project update failed!</strong></p> The project seems to exists already.');
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