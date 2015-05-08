(function () {
    'use strict';

    angular
        .module('ALEX.controller')
        .controller('ErrorController', ErrorController);

    ErrorController.$inject = ['$scope', '$state', 'ErrorService'];

    /**
     * The controller of the error page that displays a single error message
     *
     * @param $scope
     * @param $state
     * @param Error
     * @constructor
     */
    function ErrorController($scope, $state, Error) {

        /**
         * The error message
         * @type{string|null}
         */
        $scope.errorMessage = null;

        (function init() {
            var msg = Error.getErrorMessage();
            if (msg === null) {
                $state.go('home')
            } else {
                $scope.errorMessage = msg;
            }
        }())
    }
}());