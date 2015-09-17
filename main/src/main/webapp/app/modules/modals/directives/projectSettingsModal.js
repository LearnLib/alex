(function () {
    'use strict';

    angular
        .module('ALEX.modals')
        .directive('projectSettingsModalHandle', projectSettingsModalHandle)
        .controller('ProjectSettingsModalController', ProjectSettingsModalController);

    projectSettingsModalHandle.$inject = ['$modal', 'paths', 'LearnerService', 'ToastService'];

    function projectSettingsModalHandle($modal, paths, Learner, Toast) {
        return {
            restrict: 'A',
            scope: {
                project: '='
            },
            link: link
        };

        function link(scope, el) {
            el.on('click', handleModal);

            function handleModal() {

                // check if the current project is used in learning and abort deletion
                // because of unknown side effects
                Learner.isActive()
                    .then(function (data) {
                        if (data.active && data.project === scope.project.id) {
                            Toast.info('You cannot edit this project because a learning process is still active.');
                        } else {
                            $modal.open({
                                templateUrl: paths.COMPONENTS + '/modals/views/project-settings-modal.html',
                                controller: 'ProjectSettingsModalController',
                                resolve: {
                                    modalData: function () {
                                        return {
                                            project: scope.project
                                        }
                                    }
                                }
                            });
                        }
                    });
            }
        }
    }

    ProjectSettingsModalController.$inject = [
        '$rootScope', '$scope', '$modalInstance', 'modalData', 'Project', 'ProjectResource', 'ToastService'
    ];

    function ProjectSettingsModalController($rootScope, $scope, $modalInstance, modalData, Project, ProjectResource, Toast) {
        $scope.project = Project.build(modalData.project);

        $scope.errorMsg = null;

        $scope.updateProject = function () {
            ProjectResource.update($scope.project)
                .then(function (updatedProject) {
                    $rootScope.$emit('project:updated', updatedProject);
                    $scope.closeModal();
                    Toast.success('Project updated');
                })
                .catch(function (response) {
                    $scope.errorMsg = response.data.message;
                })
        };

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