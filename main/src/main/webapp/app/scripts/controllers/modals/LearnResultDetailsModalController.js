(function () {
    'use strict';

    angular
        .module('weblearner.controller')
        .controller('LearnResultDetailsModalController', LearnResultDetailsModalController);

    LearnResultDetailsModalController.$inject = ['$scope', '$modalInstance', 'modalData'];

    /**
     * The controller that is used to display the details of a learn result in a modal dialog. The data that is passed
     * to this controller should be an object with a property 'result' which contains a learn result object. If none is
     * given, nothing will be displayed.
     *
     * The template can be found at 'views/learn-result-details-modal.html'.
     *
     * @param $scope - The controllers scope
     * @param $modalInstance - The ui.bootstrap $modalInstance service
     * @param modalData - The data that is passed to the controller from its handle
     * @constructor
     */
    function LearnResultDetailsModalController($scope, $modalInstance, modalData) {

        /**
         * The learn result whose details should be displayed
         * @type {LearnResult}
         */
        $scope.result = modalData.result;

        /**
         * Close the modal dialog without passing any data
         */
        $scope.ok = function () {
            $modalInstance.dismiss();
        }
    }
}());