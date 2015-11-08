(function () {
    'use strict';

    angular
        .module('ALEX.controllers')
        .controller('SymbolEditModalController', SymbolEditModalController);

    /**
     * Handles the behaviour of the modal to edit an existing symbol and updates the edited symbol on the server.
     *
     * @param $scope
     * @param $modalInstance
     * @param modalData
     * @param Symbol
     * @param SymbolResource
     * @param ToastService
     * @constructor
     */
    // @ngInject
    function SymbolEditModalController($scope, $modalInstance, modalData, Symbol, SymbolResource, ToastService) {

        /**
         * The symbol that is passed to the modal as a copy in order to prevent two way binding in the template.
         * @type {Symbol}
         */
        $scope.symbol = Symbol.build(modalData.symbol);

        /**
         * The error message that is displayed when update fails
         * @type {null|string}
         */
        $scope.errorMsg = null;

        // The copy of the symbol that will be passed back together with the updated one
        var copy = Symbol.build($scope.symbol);

        /**
         * Make a request to the API in order to update the symbol. Close the modal on success.
         */
        $scope.updateSymbol = function () {
            $scope.errorMsg = null;

            // remove the selection from the symbol in case there is any
            delete $scope.symbol._selected;
            delete $scope.symbol._collapsed;

            // do not update on server
            if (angular.isDefined(modalData.updateOnServer) && !modalData.updateOnServer) {
                $modalInstance.close({
                    new: $scope.symbol,
                    old: copy
                });
                return;
            }

            // update the symbol and close the modal dialog on success with the updated symbol
            SymbolResource.update($scope.symbol)
                .then(function (updatedSymbol) {
                    ToastService.success('Symbol updated');
                    $modalInstance.close({
                        new: updatedSymbol,
                        old: copy
                    });
                })
                .catch(function (response) {
                    $scope.errorMsg = response.data.message;
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