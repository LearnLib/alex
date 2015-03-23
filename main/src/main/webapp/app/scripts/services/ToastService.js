(function () {
    'use strict';

    angular
        .module('weblearner.services')
        .service('ToastService', ToastService);

    ToastService.$inject = ['ngToast'];

    /**
     * A service that is used as a wrapper around the ngToast module.
     *
     * @param ngToast - The ngToast
     * @returns {{success: success, danger: danger, info: info}}
     * @constructor
     */
    function ToastService(ngToast) {

        return {
            success: success,
            danger: danger,
            info: info
        };

        /**
         * Create a success toast message
         *
         * @param {String} message - The message to be displayed
         */
        function success(message) {
            ngToast.create({
                class: 'success',
                content: message,
                dismissButton: true
            });
        }

        /**
         * Create an error / danger toast message
         *
         * @param {String} message - The message to be displayed
         */
        function danger(message) {
            ngToast.create({
                class: 'danger',
                content: message,
                dismissButton: true
            });
        }

        /**
         * Create an info toast message
         *
         * @param {String} message - The message to be displayed
         */
        function info(message) {
            ngToast.create({
                class: 'info',
                content: message,
                dismissButton: true
            });
        }
    }
}());