(function () {
    'use strict';

    angular
        .module('ALEX.controllers')
        .controller('ErrorController', ErrorController);

    /**
     * The controller of the error page that displays a single error message
     *
     * Template: 'views/error.html'
     *
     * @param $scope - The controllers scope
     * @param $state - The ui.router $state service
     * @param ErrorService - The ErrorService
     * @constructor
     */
    // @ngInject
    function ErrorController($scope, $state, ErrorService) {

        /**
         * The error message
         * @type{string|null}
         */
        $scope.errorMessage = null;

        var msg = ErrorService.getErrorMessage();
        if (msg === null) {
            $state.go('home')
        } else {
            $scope.errorMessage = msg;
        }
    }
}());