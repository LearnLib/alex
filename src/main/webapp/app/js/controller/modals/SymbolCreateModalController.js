(function () {
    'use strict';

    angular
        .module('weblearner.controller')
        .controller('SymbolCreateModalController', [
            '$scope', '$modalInstance', 'modalData', 'SymbolResource',
            SymbolCreateModalController
        ]);

    /**
     * SymbolCreateModalController
     *
     * Handles the behaviour of the modal to create a new symbol. The corresponding template for this modal can found
     * under 'app/partials/modals/symbol-create-modal.html'.
     *
     * @param $scope
     * @param $modalInstance
     * @param modalData
     * @param SymbolResource
     * @constructor
     */
    function SymbolCreateModalController($scope, $modalInstance, modalData, SymbolResource) {

        // the id of the project the new symbol is created for
        var projectId = modalData.projectId;

        //////////

        /**
         * The type of the symbol that should be created.
         *
         * @type {String}
         */
        $scope.type = modalData.symbolType;

        //////////

        // listen on the event 'symbol.created' that is emitted from a child scope
        $scope.$on('symbol.created', createSymbol);

        //////////

        /**
         * Make a request to the API and create a new symbol. Close the modal on success.
         *
         * @param evt - The event object
         * @param symbol - The symbol that is created
         */
        function createSymbol(evt, symbol) {
            SymbolResource.create(projectId, symbol)
                .then(function (newSymbol) {
                    $modalInstance.close(newSymbol);
                })
        }

        /**
         * Close the modal.
         */
        $scope.closeModal = function () {
            $modalInstance.dismiss();
        }
    }
}());