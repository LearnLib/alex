(function () {
    'use strict';

    angular
        .module('ALEX.services')
        .service('ErrorService', ErrorService);

    ErrorService.$inject = ['$state'];

    /**
     * Used to store an error message and can redirect to the error page.
     *
     * @param $state
     * @returns {{getErrorMessage: getErrorMessage, setErrorMessage: setErrorMessage, goToErrorPage: goToErrorPage}}
     * @constructor
     */
    function ErrorService($state) {
        var errorMessage = null;

        return {
            getErrorMessage: getErrorMessage,
            setErrorMessage: setErrorMessage,
            goToErrorPage: goToErrorPage
        };

        /**
         * Gets the error message and removes it from the service
         * @returns {string|null}
         */
        function getErrorMessage(){
            var msg = errorMessage;
            errorMessage = null;
            return msg;
        }

        /**
         * Sets the error message
         * @param {string} message
         */
        function setErrorMessage (message){
            errorMessage = message;
        }

        /**
         * Redirects to the error page
         */
        function goToErrorPage() {
            $state.go('error');
        }
    }
}());