(function () {
    'use strict';

    angular
        .module('weblearner.controller')
        .controller('ActionCreateModalController', ActionCreateModalController);

    ActionCreateModalController.$inject = [
        '$scope', '$modalInstance', 'actionTypes', 'Action', 'Symbol', 'SessionService'
    ];

    /**
     * The controller for the modal dialog that handles the creation of a new action.
     *
     * The template can be found at 'views/modals/action-create-modal.html'.
     *
     * @param $scope
     * @param $modalInstance
     * @param actionTypes
     * @param Action
     * @param Symbol
     * @param Session
     * @constructor
     */
    function ActionCreateModalController($scope, $modalInstance, actionTypes, Action, Symbol, Session) {

        var project = Session.project.get();

        /**
         * The constant for action type names
         * @type {Object}
         */
        $scope.actionTypes = actionTypes;

        /**
         * The model for the new action
         * @type {null|Object}
         */
        $scope.action = null;

        $scope.symbols = [];

        (function init() {
            Symbol.Resource.getAll(project.id)
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
            $scope.action = Action.createByType(type);
        };

        /**
         * Closes the modal dialog an passes the created action back to the handle that called the modal
         */
        $scope.createAction = function () {
            $modalInstance.close($scope.action);
        };

        /**
         * Closes the modal dialog without passing any data
         */
        $scope.closeModal = function () {
            $modalInstance.dismiss();
        };


    }
}());