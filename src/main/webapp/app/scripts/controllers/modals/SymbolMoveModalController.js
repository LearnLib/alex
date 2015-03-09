(function () {
    'use strict';

    angular
        .module('weblearner.controller')
        .controller('SymbolMoveModalController', SymbolMoveModalController);

    SymbolMoveModalController.$inject = [
        '$scope', '$modalInstance', 'modalData', 'Symbol', 'SelectionService'
    ];

    function SymbolMoveModalController($scope, $modalInstance, modalData, Symbol, SelectionService) {

        $scope.symbols = modalData.symbols;
        $scope.groups = modalData.groups;
        $scope.selectedGroup = null;

        $scope.moveSymbols = function () {
            var symbols;
            if ($scope.selectedGroup !== null) {
                _.forEach($scope.symbols, function (symbol) {
                    SelectionService.removeSelection(symbol);
                    symbol.group = $scope.selectedGroup.id;
                    Symbol.Resource.update($scope.selectedGroup.project, symbol)
                        .then(function (updatedSymbol) {
                            //$modalInstance.$close({
                            //    new: updatedSymbol,
                            //    old:
                            //})
                        })
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