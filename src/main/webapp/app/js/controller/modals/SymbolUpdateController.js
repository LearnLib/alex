(function () {
    'use strict';

    angular
        .module('weblearner.controller')
        .controller('SymbolUpdateController', [
            '$scope', '$modalInstance', 'modalData', 'SymbolResource', 'SelectionService',
            SymbolUpdateController
        ]);

    function SymbolUpdateController($scope, $modalInstance, modalData, SymbolResource, SelectionService) {

        $scope.symbol = modalData.symbol;

        //////////

        $scope.updateSymbol = function () {
            SelectionService.removeSelection($scope.symbol);
            SymbolResource.update($scope.symbol.project, $scope.symbol)
                .then(function (updatedSymbol) {
                    $modalInstance.close(updatedSymbol);
                })
        };

        $scope.closeModal = function () {
            $modalInstance.dismiss();
        }
    }
}());