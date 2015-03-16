(function () {
    'use strict';

    angular
        .module('weblearner.services')
        .service('PromptService', PromptService);

    PromptService.$inject = ['$modal', 'paths'];

    /**
     *
     * @param $modal
     * @param paths
     * @returns {{prompt: prompt, confirm: confirm}}
     * @constructor
     */
    function PromptService($modal, paths) {

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
            var modal = $modal.open({
                templateUrl: paths.views.MODALS + '/prompt-dialog.html',
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
            });
            return modal.result;
        }

        /**
         * Opens the confirm dialog
         *
         * @param text - The text to be displayed in the confirm dialog
         * @returns {*} - The modal result promise
         */
        function confirm(text) {
            var modal = $modal.open({
                templateUrl: paths.views.MODALS + '/confirm-dialog.html',
                controller: 'ConfirmDialogController',
                resolve: {
                    modalData: function () {
                        return {
                            text: text
                        };
                    }
                }
            });
            return modal.result;
        }
    }
}());