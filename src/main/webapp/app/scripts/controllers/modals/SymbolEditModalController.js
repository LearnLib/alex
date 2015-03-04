(function () {
    'use strict';

    angular
        .module('weblearner.controller')
        .controller('SymbolEditModalController', SymbolEditModalController);

    SymbolEditModalController.$inject = ['$scope', '$modalInstance', 'modalData', 'Symbol', 'SelectionService'];

    /**
     * Handles the behaviour of the modal to edit an existing symbol and updates the edited symbol on the server.
     * The corresponding template for this modal can found under 'app/partials/modals/symbol-edit-modal.html'.
     *
     * @param $scope
     * @param $modalInstance
     * @param modalData
     * @param Symbol
     * @param SelectionService
     * @constructor
     */
    function SymbolEditModalController($scope, $modalInstance, modalData, Symbol, SelectionService) {

        /** The symbol that is passed to the modal. @type {Symbol} */
        $scope.symbol = modalData.symbol;

        // The copy of the symbol that will be passed back together with the updated one
        var copy = $scope.symbol.copy();

        /**
         * Make a request to the API in order to update the symbol. Close the modal on success.
         */
        $scope.updateSymbol = function () {

            // remove the selection from the symbol in case there is any
            SelectionService.removeSelection($scope.symbol);

            // TODO: delete this when merging is complete
            $scope.symbol.type = 'web';

            // update the symbol and close the modal dialog on success with the updated symbol
            Symbol.Resource.update($scope.symbol.project, $scope.symbol)
                .then(function (updatedSymbol) {
                    $modalInstance.close({
                        new: updatedSymbol,
                        old: copy
                    });
                })
        };

        /**
         * Close the modal dialog
         */
        $scope.closeModal = function () {
            $modalInstance.dismiss();
        }
    }
}());