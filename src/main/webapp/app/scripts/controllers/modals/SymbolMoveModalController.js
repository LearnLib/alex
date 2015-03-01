(function () {
    'use strict';

    angular
        .module('weblearner.controller')
        .controller('SymbolMoveModalController', SymbolMoveModalController);

    SymbolMoveModalController.$inject = [
        '$scope', '$modalInstance', 'modalData', 'Symbol'
    ];

    function SymbolMoveModalController($scope, $modalInstance, modalData, Symbol) {

        $scope.symbols = modalData.symbols;
        $scope.groups = modalData.groups;
        $scope.selectedGroup = null;

        $scope.moveSymbols = function () {
            if ($scope.selectedGroup !== null) {
                // TODO: update logic
            }
        };

        $scope.selectGroup = function (group) {
            if ($scope.selectedGroup.name == group.name) {
                $scope.selectedGroup = null;
            } else {
                $scope.selectedGroup = group;
            }
        };

        /**
         * Close the modal dialog
         */
        $scope.closeModal = function () {
            $modalInstance.dismiss();
        }
    }
}());