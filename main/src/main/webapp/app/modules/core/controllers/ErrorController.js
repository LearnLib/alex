(function () {
    'use strict';

    angular
        .module('ALEX.core')
        .controller('ErrorController', ErrorController);

    ErrorController.$inject = ['$scope', '$state', 'ErrorService'];

    /**
     * The controller of the error page that displays a single error message
     *
     * Template: 'views/error.html'
     *
     * @param $scope - The controllers scope
     * @param $state - The ui.router $state service
     * @param Error - The ErrorService
     * @constructor
     */
    function ErrorController($scope, $state, Error) {

        /**
         * The error message
         * @type{string|null}
         */
        $scope.errorMessage = null;

        var msg = Error.getErrorMessage();
        if (msg === null) {
            $state.go('home')
        } else {
            $scope.errorMessage = msg;
        }
    }
}());