(function () {
    'use strict';

    // the instance of the errorService
    let instance = null;

    /**
     * Used to store an error message and can redirect to the error page.
     *
     * @param $state - The ui.router $state service
     * @returns {{getErrorMessage: getErrorMessage, setErrorMessage: setErrorMessage, goToErrorPage: goToErrorPage}}
     * @constructor
     */
    // @ngInject
    class ErrorService {

        /**
         * Constructor
         * @param $state - The ui.router $state service
         * @returns {*}
         */
        constructor($state) {
            // return the instance if available
            if (instance !== null) return instance;

            this.$state = $state;
            this.errorMessage = null;

            // create an instance of ErrorService
            instance = this;
        }

        /**
         * Gets the error message and removes it from the service
         * @returns {string|null}
         */
        getErrorMessage() {
            const msg = this.errorMessage;
            this.errorMessage = null;
            return msg;
        }

        /**
         * Sets the error message
         * @param {string} message
         */
        setErrorMessage(message) {
            this.errorMessage = message;
        }

        /** Redirects to the error page */
        goToErrorPage() {
            this.$state.go('error');
        }
    }

    angular
        .module('ALEX.services')
        .service('ErrorService', ErrorService);
}());