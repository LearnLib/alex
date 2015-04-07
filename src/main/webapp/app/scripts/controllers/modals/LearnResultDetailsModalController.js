(function () {
    'use strict';

    angular
        .module('ALEX.controller')
        .controller('LearnResultDetailsModalController', LearnResultDetailsModalController);

    LearnResultDetailsModalController.$inject = ['$scope', '$modalInstance', 'modalData', 'LearnResult'];

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
     * @param LearnResult - The factory for LearnResult
     * @constructor
     */
    function LearnResultDetailsModalController($scope, $modalInstance, modalData, LearnResult) {

        $scope.tabs = [
            {heading: 'Current', result: modalData.result}
        ];

        if (modalData.result.stepNo > 0) {
            LearnResult.Resource.getFinal(modalData.result.project, modalData.result.testNo)
                .then(function(res){
                    $scope.tabs.push({
                        heading: 'Cumulated',
                        result: res
                    })
                });
        } else {
            $scope.tabs[0].heading = 'Cumulated';
        }

        /**
         * Close the modal dialog without passing any data
         */
        $scope.ok = function () {
            $modalInstance.dismiss();
        }
    }
}());