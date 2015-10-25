(function () {
    'use strict';

    angular
        .module('ALEX.modals')
        .controller('ProjectSettingsModalController', ProjectSettingsModalController);

    ProjectSettingsModalController.$inject = [
        '$rootScope', '$scope', '$modalInstance', 'modalData', 'Project', 'ProjectResource', 'ToastService'
    ];

    /**
     * The controller of the modal window for editing a project
     *
     * @param $rootScope
     * @param $scope
     * @param $modalInstance
     * @param modalData
     * @param Project
     * @param ProjectResource
     * @param Toast
     * @constructor
     */
    function ProjectSettingsModalController($rootScope, $scope, $modalInstance, modalData, Project, ProjectResource, Toast) {

        /**
         * The project to edit
         * @type {Project}
         */
        $scope.project = modalData.project;

        /**
         * An error message that is displayed on a failed updated
         * @type {null|string}
         */
        $scope.error = null;

        /** Updates the project. Closes the modal window on success. */
        $scope.updateProject = function () {
            $scope.error = null;

            ProjectResource.update($scope.project)
                .then(function (updatedProject) {
                    $rootScope.$emit('project:updated', updatedProject);
                    $scope.closeModal();
                    Toast.success('Project updated');
                })
                .catch(function (response) {
                    $scope.error = response.data.message;
                })
        };

        /** Closes the modal window */
        $scope.closeModal = function () {
            $modalInstance.dismiss();
        };

        ///**
        // * Saves the project including symbol groups into a json file
        // */
        //$scope.exportProject = function () {
        //    SymbolGroupResource.getAll($scope.project.id, {embedSymbols: true})
        //        .then(function(groups){
        //
        //            var projectToExport = angular.copy($scope.project);
        //            projectToExport.groups = groups;
        //
        //            // prepare project for export
        //            delete projectToExport.id;
        //            _.forEach(projectToExport.groups, function(group){
        //                delete group.id;
        //                delete group.project;
        //                _.forEach(group.symbols, function(symbol){
        //                    delete symbol.project;
        //                    delete symbol.group;
        //                    delete symbol.id;
        //                    delete symbol.revision;
        //                })
        //            });
        //
        //            FileDownloadService.downloadJson(projectToExport)
        //                .then(function(){
        //                    Toast.success('Project exported');
        //                });
        //        })
        //}
    }
}());