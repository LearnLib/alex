(function () {
    'use strict';

    angular
        .module('weblearner.controller')
        .controller('LearnSetupSettingsModalController', LearnSetupSettingsModalController);

    LearnSetupSettingsModalController.$inject = [
        '$scope', '$modalInstance', 'modalData', 'eqOracles', 'learnAlgorithms', 'EqOracle'
    ];

    /**
     * The controller for the modal dialog where you can set the settings for an upcoming test run. Handles the template
     * under 'views/modals/learn-setup-settings-modal.html'. Passes the edited instance of a LearnConfiguration on
     * success.
     *
     * @param $scope
     * @param $modalInstance
     * @param modalData - The data that is passed to the controller. Must be an object with the property 'learnConfiguration'
     * @param eqOracles - The constants for eqOracles types
     * @param learnAlgorithms - The constants for learnAlgorithm names
     * @param EqOracle - The model for an EqOracle
     * @constructor
     */
    function LearnSetupSettingsModalController($scope, $modalInstance, modalData, eqOracles, learnAlgorithms, EqOracle) {

        /**
         * The constants for eqOracles types
         */
        $scope.eqOracles = eqOracles;

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
        $scope.learnConfiguration = modalData.learnConfiguration.copy();

        /**
         * Sets the Eq Oracle of the learn configuration depending on the selected value
         */
        $scope.setEqOracle = function () {
            $scope.learnConfiguration.eqOracle = EqOracle.createFromType($scope.selectedEqOracle)
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