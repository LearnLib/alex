(function () {
    'use strict';

    /**
     * The controller of the error page
     */
    // @ngInject
    class ErrorController {

        /**
         * Constructor
         * @param $state
         * @param ErrorService
         */
        constructor($state, ErrorService) {

            /**
             * The error message
             * @type{string|null}
             */
            this.errorMessage = null;

            const message = ErrorService.getErrorMessage();
            if (message !== null) {
                this.errorMessage = message;
            } else {
                $state.go('home')
            }
        }
    }

    angular
        .module('ALEX.controllers')
        .controller('ErrorController', ErrorController);
}());