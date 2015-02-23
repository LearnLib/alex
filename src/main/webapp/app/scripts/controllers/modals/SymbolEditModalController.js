(function () {
    'use strict';

    angular
        .module('weblearner.controller')
        .controller('SymbolEditModalController', [
            '$scope', '$modalInstance', 'modalData', 'SymbolResource', 'SelectionService',
            SymbolEditModalController
        ]);

    /**
     * SymbolEditModalController
     *
     * Handles the behaviour of the modal to edit an existing symbol and updates the edited symbol on the server.
     * The corresponding template for this modal can found under 'app/partials/modals/symbol-edit-modal.html'.
     *
     * @param $scope
     * @param $modalInstance
     * @param modalData
     * @param SymbolResource
     * @param SelectionService
     * @constructor
     */
    function SymbolEditModalController($scope, $modalInstance, modalData, SymbolResource, SelectionService) {

        /** The symbol that is passed to the modal. */
        $scope.symbol = modalData.symbol;

        //////////

        // listen on the event 'symbol.edited' from a child scope
        $scope.$on('symbol.edited', updateSymbol);

        //////////

        /**
         * Make a request to the API in order to update the symbol. Close the modal on success.
         *
         * @param evt - The event from the
         * @param symbol - The edited symbol
         */
        function updateSymbol(evt, symbol) {

            // remove the selection from the symbol in case there is any
            SelectionService.removeSelection(symbol);

            // update the symbol
            SymbolResource.update(symbol.project, symbol)
                .then(function (updatedSymbol) {
                    $modalInstance.close(updatedSymbol);
                })
        }

        //////////

        /**
         * Close the modal dialog
         */
        $scope.closeModal = function () {
            $modalInstance.dismiss();
        }
    }
}());