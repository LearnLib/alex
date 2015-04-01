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
         * Creates a toast message.
         *
         * @param {string} type - a bootstrap alert class type: 'success', 'error', 'info' etc.
         * @param {string} message - The message to be displayed
         */
        function createToast(type, message) {
            ngToast.create({
                class: type,
                content: message,
                dismissButton: true
            });
        }

        /**
         * Create a success toast message
         *
         * @param {String} message - The message to be displayed
         */
        function success(message) {
            createToast('success', message);
        }

        /**
         * Create an error / danger toast message
         *
         * @param {String} message - The message to be displayed
         */
        function danger(message) {
            createToast('danger', message);
        }

        /**
         * Create an info toast message
         *
         * @param {String} message - The message to be displayed
         */
        function info(message) {
            createToast('info', message);
        }
    }
}());