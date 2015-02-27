(function () {
    'use strict';

    angular
        .module('weblearner.controller')
        .controller('SymbolCreateModalController', SymbolCreateModalController);

    SymbolCreateModalController.$inject = ['$scope', '$modalInstance', 'modalData', 'Symbol', 'SymbolGroup'];

    /**
     * Handles the behaviour of the modal to create a new symbol. The corresponding template for this modal can found
     * under 'app/partials/modals/symbol-create-modal.html'.
     *
     * @param $scope
     * @param $modalInstance
     * @param modalData
     * @param Symbol
     * @param SymbolGroup
     * @constructor
     */
    function SymbolCreateModalController($scope, $modalInstance, modalData, Symbol, SymbolGroup) {

        // the id of the project the new symbol is created for
        var projectId = modalData.projectId;

        /** The model of the symbol that will be created @type {Symbol} */
        $scope.symbol = new Symbol();

        $scope.groups = [];

        $scope.selectedGroup;

        SymbolGroup.Resource.getAll(projectId)
            .then(function (groups) {
                $scope.groups = groups;
            });

        /**
         * Make a request to the API and create a new symbol. Close the modal on success.
         */
        $scope.createSymbol = function () {

            // TODO: Delete this when merging is over
            $scope.symbol.type = 'web';

            // TODO: uncomment this when merging is over
            //if (_.findIndex($scope.groups, {name: $scope.selectedGroup}) >= 0) {
            //    .....
            //}

            Symbol.Resource.create(projectId, $scope.symbol)
                .then(function (newSymbol) {
                    $modalInstance.close(newSymbol);
                })
        };

        /**
         * Close the modal.
         */
        $scope.closeModal = function () {
            $modalInstance.dismiss();
        }
    }
}());