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
                _.forEach($scope.symbols, function (symbol) {
                    $scope.symbol.group = $scope.selectedGroup.id;
                    Symbol.Resource.update($scope.selectedGroup.project, symbol);
                })
            }
        };

        $scope.selectGroup = function (group) {
            $scope.selectedGroup = $scope.selectedGroup === group ? null : group;
        };

        /**
         * Close the modal dialog
         */
        $scope.closeModal = function () {
            $modalInstance.dismiss();
        }
    }
}());