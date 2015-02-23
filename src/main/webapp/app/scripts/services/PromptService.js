(function () {
    'use strict';

    angular
        .module('weblearner.services')
        .service('PromptService', [
            '$modal',
            PromptService
        ]);

    /**
     * PromptService
     *
     * The service that can be called to replace window.prompt() with some more options.
     *
     * @param $modal
     * @return {{prompt: prompt}}
     * @constructor
     */
    function PromptService($modal) {

        var service = {
            prompt: prompt,
            confirm: confirm
        };
        return service;

        //////////

        /**
         * Open the prompt dialog.
         *
         * @param text {string} - The text to display
         * @param options {{regexp: string, errorMsg: string}}
         * @return {*} - The modal result promise
         */
        function prompt(text, options) {

            var modal = $modal.open({
                templateUrl: 'app/partials/modals/modal-prompt-dialog.html',
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
         * Open the confirm dialog
         * 
         * @param text - The text to be displayed
         */
        function confirm(text) {

            var modal = $modal.open({
                templateUrl: 'app/partials/modals/modal-confirm-dialog.html',
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