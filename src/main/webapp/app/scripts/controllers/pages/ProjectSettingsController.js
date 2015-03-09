(function () {
    'use strict';

    angular
        .module('weblearner.controller')
        .controller('ProjectSettingsController', ProjectSettingsController);

    ProjectSettingsController.$inject = [
        '$scope', '$state', 'Project', 'SessionService', 'PromptService', 'ToastService', 'LearnerResource'
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
     */
    function ProjectSettingsController($scope, $state, Project, Session, PromptService, Toast, LearnerResource) {

        var projectCopy;

        /** The project that is stored in the session **/
        $scope.project = Session.project.get();
        projectCopy = angular.copy($scope.project);

        //////////

        /**
         * Updates a project and saves the updated project in the sessionStorage
         */
        $scope.updateProject = function () {

            // delete this property because it is read only and the will throw an error otherwise
            delete $scope.project.symbolAmount;

            // update the project on the server
            Project.Resource.update($scope.project)
                .then(function (updatedProject) {
                    SessionService.project.save(updatedProject);
                    $scope.project = updatedProject;
                    projectCopy = angular.copy($scope.project);
                })
        };

        /**
         * Prompts the user for confirmation and deletes the project on success. Redirects to '/home' when project
         * was deleted and removes the project from the sessionStorage
         */
        $scope.deleteProject = function () {
            var message = 'Do you really want to delete this project with all its symbols and test results? This process can not be undone.';

            LearnerResource.isActive()
                .then(function (data) {
                    if (data.active !== false || (data.project !== $scope.project.id)) {
                        confirmDeletion();
                    } else {
                        Toast.info('Project could not be deleted because there is an active learning process')
                    }
                });

            function confirmDeletion() {
                PromptService.confirm(message)
                    .then(function () {
                        Project.Resource.delete($scope.project)
                            .then(function () {
                                SessionService.project.remove();
                                $state.go('home');
                            })
                    })
            }
        };

        /**
         * Resets the project edit form by copying the project copy back to the project under edit
         */
        $scope.resetForm = function () {
            $scope.project = angular.copy(projectCopy);
        }
    }
}());