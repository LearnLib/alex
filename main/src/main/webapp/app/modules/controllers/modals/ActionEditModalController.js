(function () {
    'use strict';

    angular
        .module('ALEX.controllers')
        .controller('ActionEditModalController', ActionEditModalController);

    /**
     * The controller for the modal dialog that handles the editing of an action.
     *
     * @param $scope - The controllers scope
     * @param $modalInstance - The model instance
     * @param modalData - The data that is passed to this controller
     * @param ActionService - The Service for creating actions
     * @param SymbolResource - The API Resource for symbols
     * @param SessionService - The SessionService
     * @constructor
     */
    // @ngInject
    function ActionEditModalController($scope, $modalInstance, modalData, ActionService, SymbolResource, SessionService) {

        // the project in the session
        var project = SessionService.project.get();

        /**
         * The copy of the action that should be edited
         * @type {Object}
         */
        $scope.action = angular.copy(modalData.action);

        /**
         *
         * @type {Array}
         */
        $scope.symbols = [];

        (function init() {
            SymbolResource.getAll(project.id)
                .then(function (symbols) {
                    $scope.symbols = symbols;
                })
        }());

        /**
         * Close the modal dialog and pass the updated action to the handle that called it
         */
        $scope.updateAction = function () {

            // because actions are identified by temporary id
            // a new action has to be build and given the old id manually
            var id = $scope.action._id;
            $scope.action = ActionService.buildFromData($scope.action);
            $scope.action._id = id;
            $modalInstance.close($scope.action);
        };

        /**
         * Close the modal dialog without passing any data
         */
        $scope.closeModal = function () {
            $modalInstance.dismiss();
        }
    }
}());