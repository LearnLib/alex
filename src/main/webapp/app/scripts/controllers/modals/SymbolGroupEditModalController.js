(function () {
    'use strict';

    angular
        .module('weblearner.controller')
        .controller('SymbolGroupEditModalController', SymbolGroupEditModalController);

    SymbolGroupEditModalController.$inject = ['$scope', '$modalInstance', 'modalData', 'SymbolGroup', '_'];

    function SymbolGroupEditModalController($scope, $modalInstance, modalData, SymbolGroup, _) {

        $scope.groupExists = false;
        $scope.group = modalData.group.copy();
        $scope.groups = [];

        SymbolGroup.Resource.getAll($scope.group.project)
            .then(function (groups) {
                $scope.groups = groups;
            });

        $scope.updateGroup = function () {
            SymbolGroup.Resource.update($scope.group.project, $scope.group)
                .then(function (updatedGroup) {
                    $modalInstance.close({
                        status: 'updated',
                        group: updatedGroup
                    });
                })
        };

        $scope.deleteGroup = function () {
            SymbolGroup.Resource.delete($scope.group.project, $scope.group)
                .then(function () {
                    $modalInstance.close({
                        status: 'updated',
                        group: $scope.group
                    });
                });
        };

        /**
         * Close the modal.
         */
        $scope.closeModal = function () {
            $modalInstance.dismiss();
        }
    }
}());