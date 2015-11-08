(function () {
    'use strict';

    angular
        .module('ALEX.controllers')
        .controller('ActionCreateModalController', ActionCreateModalController);

    /**
     * The controller for the modal dialog that handles the creation of a new action.
     *
     * @param $scope
     * @param $modalInstance
     * @param modalData
     * @param ActionService
     * @param SymbolResource
     * @param SessionService
     * @constructor
     */
    // @ngInject
    function ActionCreateModalController($scope, $modalInstance, modalData, ActionService, SymbolResource, SessionService) {

        var project = SessionService.project.get();

        /**
         * The model for the new action
         * @type {null|Object}
         */
        $scope.action = null;

        /**
         * All symbols of the project
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
         * Creates a new instance of an Action by a type that was clicked in the modal dialog.
         *
         * @param {string} type - The type of the action that should be created
         */
        $scope.selectNewActionType = function (type) {
            $scope.action = ActionService.buildFromType(type);
        };

        /**
         * Closes the modal dialog an passes the created action back to the handle that called the modal
         */
        $scope.createAction = function () {
            $modalInstance.close($scope.action);
        };

        /**
         * Creates a new action in the background without closing the dialog
         */
        $scope.createActionAndContinue = function () {
            modalData.addAction($scope.action);
            $scope.action = null;
        };

        /**
         * Closes the modal dialog without passing any data
         */
        $scope.closeModal = function () {
            $modalInstance.dismiss();
        };
    }
}());