(function () {
    'use strict';

    angular
        .module('weblearner.controller')
        .controller('SymbolGroupCreateModalController', SymbolGroupCreateModalController);

    SymbolGroupCreateModalController.$inject = ['$scope', '$modalInstance', 'modalData', 'SymbolGroup', '_'];

    function SymbolGroupCreateModalController($scope, $modalInstance, modalData, SymbolGroup, _) {

        $scope.projectId = modalData.projectId;
        $scope.group = new SymbolGroup();
        $scope.groups = [];
        $scope.groupExists = false;

        SymbolGroup.Resource.getAll($scope.projectId)
            .then(function (groups) {
                $scope.groups = groups;
            });

        $scope.createGroup = function () {

            var index = _.findIndex($scope.groups, {name: $scope.group.name});
            if (index === -1) {
                SymbolGroup.Resource.create($scope.projectId, $scope.group)
                    .then(function (newGroup) {
                        $modalInstance.close(newGroup);
                    });
                $scope.groupExists = false;
            } else {
                $scope.groupExists = true;
            }
        };

        /**
         * Close the modal.
         */
        $scope.closeModal = function () {
            $modalInstance.dismiss();
        }
    }
}());