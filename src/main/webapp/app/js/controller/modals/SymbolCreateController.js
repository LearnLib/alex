(function () {
    'use strict';

    angular
        .module('weblearner.controller')
        .controller('SymbolCreateController', [
            '$scope', '$modalInstance', 'config', 'SymbolResource',
            SymbolCreateController
        ]);

    function SymbolCreateController($scope, $modalInstance, config, SymbolResource) {

        var _projectId = config.projectId;

        //////////

        $scope.symbol = {
            type: config.symbolType
        };

        //////////

        $scope.createSymbol = function () {
            SymbolResource.create(_projectId, $scope.symbol)
                .then(function (newSymbol) {
                    $modalInstance.close(newSymbol);
                })
        };

        $scope.closeModal = function () {
            $modalInstance.dismiss();
        }
    }
}());