(function () {
    'use strict';

    angular
        .module('ALEX.controllers')
        .controller('ConfirmDialogController', ConfirmDialogController);

    /**
     * The controller that handles the confirm modal dialog.
     *
     * @param $scope
     * @param $modalInstance
     * @param modalData
     * @constructor
     */
    // @ngInject
    function ConfirmDialogController($scope, $modalInstance, modalData) {

        /** The text to be displayed **/
        $scope.text = modalData.text;
        $scope.regexp = modalData.regexp;
        $scope.errorMsg = modalData.errorMsg;

        /**
         * Close the modal dialog
         */
        $scope.ok = function () {
            $modalInstance.close();
        };

        /**
         * Close the modal dialog
         */
        $scope.close = function () {
            $modalInstance.dismiss();
        }
    }
}());