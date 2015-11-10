(function () {
    'use strict';

    /** A service that is used as a wrapper around the ngToast module. */
        // @ngInject
    class ToastService {

        /**
         * Constructor
         * @param ngToast - The ngToast service
         */
        constructor(ngToast) {
            this.ngToast = ngToast;
        }

        /**
         * Creates a toast message.
         * @param {string} type - a bootstrap alert class type: 'success', 'error', 'info' etc.
         * @param {string} message - The message to display
         */
        createToast(type, message) {
            this.ngToast.create({
                className: type,
                content: message,
                dismissButton: true
            });
        }

        /**
         * Create a success toast message
         * @param {String} message - The message to display
         */
        success(message) {
            this.createToast('success', message);
        }

        /**
         * Create an error / danger toast message
         * @param {String} message - The message display
         */
        danger(message) {
            this.createToast('danger', message);
        }

        /**
         * Create an info toast message
         * @param {String} message - The message to display
         */
        info(message) {
            this.createToast('info', message);
        }
    }

    angular.module('ALEX.services').service('ToastService', ToastService);
}());