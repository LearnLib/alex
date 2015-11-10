(function () {
    'use strict';

    angular
        .module('ALEX.services')
        .service('PromptService', PromptService);

    /**
     * @param $modal
     * @returns {{prompt: prompt, confirm: confirm}}
     * @constructor
     */
    // @ngInject
    function PromptService($modal) {

        // the available service methods
        return {
            prompt: prompt,
            confirm: confirm
        };

        /**
         * Opens the prompt dialog.
         *
         * @param text {string} - The text to display
         * @param options {{regexp: string, errorMsg: string}}
         * @return {*} - The modal result promise
         */
        function prompt(text, options) {
            return $modal.open({
                templateUrl: 'views/modals/prompt-dialog.html',
                controller: 'PromptDialogController',
                resolve: {
                    modalData: function () {
                        return {
                            text: text,
                            regexp: options.regexp,
                            errorMsg: options.errorMsg
                        };
                    }
                }
            }).result;
        }

        /**
         * Opens the confirm dialog
         *
         * @param text - The text to be displayed in the confirm dialog
         * @returns {*} - The modal result promise
         */
        function confirm(text) {
            return $modal.open({
                templateUrl: 'views/modals/confirm-dialog.html',
                controller: 'ConfirmDialogController',
                resolve: {
                    modalData: function () {
                        return {
                            text: text
                        };
                    }
                }
            }).result;
        }
    }
}());