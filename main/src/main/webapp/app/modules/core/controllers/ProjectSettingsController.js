(function () {
    'use strict';

    angular
        .module('ALEX.core')
        .controller('ProjectSettingsController', ProjectSettingsController);

    ProjectSettingsController.$inject = [
        '$scope', '$state', 'ProjectResource', 'SessionService', 'PromptService', 'ToastService', 'LearnerService',
        'SymbolGroupResource', 'FileDownloadService', '_'
    ];

    /**
     * The controller that handles the deleting and updating of a project. The page cannot be requested if the learner
     * is actively learning the current project. Therefore it redirects to the projects dashboard.
     *
     * Template: '/views/project-settings.html'
     *
     * @param $scope - The controllers scope
     * @param $state - The ui.router $state service
     * @param ProjectResource - Project API Resource handler
     * @param Session - The SessionService
     * @param PromptService - The PromptService
     * @param Toast - The ToastService
     * @param Learner - The LearnerService for the API
     * @param SymbolGroupResource - The SymbolGroupResource
     * @param FileDownloadService - The FileDownloadService
     * @param _ - Lodash
     */
    function ProjectSettingsController($scope, $state, ProjectResource, Session, PromptService, Toast, Learner,
                                       SymbolGroupResource, FileDownloadService, _) {

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
        }());

        /**
         * Updates a project and saves the updated project in the sessionStorage
         */
        $scope.updateProject = function () {
            ProjectResource.update($scope.project)
                .then(function (updatedProject) {
                    Toast.success('Project updated');
                    Session.project.save(updatedProject);
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
                    ProjectResource.delete($scope.project)
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
         * Saves the project including symbol groups into a json file
         */
        $scope.exportProject = function () {
            SymbolGroupResource.getAll($scope.project.id, {embedSymbols: true})
                .then(function(groups){

                    var projectToExport = angular.copy($scope.project);
                    projectToExport.groups = groups;

                    // prepare project for export
                    delete projectToExport.id;
                    _.forEach(projectToExport.groups, function(group){
                        delete group.id;
                        delete group.project;
                        _.forEach(group.symbols, function(symbol){
                            delete symbol.project;
                            delete symbol.group;
                            delete symbol.id;
                            delete symbol.revision;
                        })
                    });

                    FileDownloadService.downloadJson(projectToExport)
                        .then(function(){
                            Toast.success('Project exported');
                        });
                })
        }
    }
}());