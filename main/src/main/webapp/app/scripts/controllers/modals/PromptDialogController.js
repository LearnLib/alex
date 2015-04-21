(function () {
    'use strict';

    angular
        .module('ALEX.controller')
        .controller('PromptDialogController', PromptDialogController);

    PromptDialogController.$inject = ['$scope', '$modalInstance', 'modalData'];

    /**
     * The controller that handles the prompt modal dialog.
     *
     * @param $scope
     * @param $modalInstance
     * @param modalData
     * @constructor
     */
    function PromptDialogController($scope, $modalInstance, modalData) {

        /** The model for the input field for the user input **/
        $scope.userInput;

        /** The text to be displayed **/
        $scope.text = modalData.text;

        /** The regex the user input has to match **/
        $scope.inputPattern = modalData.regexp || '';

        /** the message that is shown when the user input doesn't match the regex **/
        $scope.errorMsg = modalData.errorMsg || 'Unknown validation error';

        /**
         * Close the modal dialog and pass the user input
         */
        $scope.ok = function () {
            if ($scope.prompt_form.$valid) {
                $modalInstance.close($scope.userInput);
            } else {
                $scope.prompt_form.submitted = true;
            }
        };

        /**
         * Close the modal dialog
         */
        $scope.close = function () {
            $modalInstance.dismiss();
        }
    }
}());