(function () {
    'use strict';

    angular
        .module('ALEX.modals')
        .controller('LearnSetupSettingsModalController', LearnSetupSettingsModalController);

    LearnSetupSettingsModalController.$inject = [
        '$scope', '$modalInstance', 'modalData', 'learnAlgorithms', 'EqOracle', 'LearnConfiguration'
    ];

    /**
     * The controller for the modal dialog where you can set the settings for an upcoming test run. Handles the template
     * under 'views/modals/learn-setup-settings-modal.html'. Passes the edited instance of a LearnConfiguration on
     * success.
     *
     * @param $scope
     * @param $modalInstance
     * @param modalData - The data that is passed to the controller. Must be an object with the property 'learnConfiguration'
     * @param learnAlgorithms - The constants for learnAlgorithm names
     * @param EqOracle - The model for an EqOracle
     * @param LearnConfiguration
     * @constructor
     */
    function LearnSetupSettingsModalController($scope, $modalInstance, modalData, learnAlgorithms, EqOracle, LearnConfiguration) {

        /**
         * The constants for eqOracles types
         */
        $scope.eqOracles = EqOracle.types;

        /**
         * The model for the select input that holds a type for an eqOracle
         */
        $scope.selectedEqOracle = modalData.learnConfiguration.eqOracle.type;

        /**
         * The constants for learnAlgorithm names
         */
        $scope.learnAlgorithms = learnAlgorithms;

        /**
         * The LearnConfiguration to be edited
         *
         * @type {LearnConfiguration}
         */
        $scope.learnConfiguration = LearnConfiguration.build(modalData.learnConfiguration);

        /**
         * Sets the Eq Oracle of the learn configuration depending on the selected value
         */
        $scope.setEqOracle = function () {
            $scope.learnConfiguration.eqOracle = EqOracle.build($scope.selectedEqOracle)
        };

        /**
         * Close the modal dialog and pass the edited learn configuration instance.
         */
        $scope.ok = function () {
            $modalInstance.close($scope.learnConfiguration);
        };

        /**
         * Close the modal dialog.
         */
        $scope.closeModal = function () {
            $modalInstance.dismiss();
        }
    }
}());