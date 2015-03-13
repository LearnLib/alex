(function () {
    'use strict';

    angular
        .module('weblearner.controller')
        .controller('SymbolsActionsController', SymbolsActionsController);

    SymbolsActionsController.$inject = [
        '$scope', '$stateParams', 'Symbol', 'SessionService', 'SelectionService', 'ToastService'
    ];

    /**
     * The controller that handles the page for managing all actions of a symbol. The symbol whose actions should be
     * manages has to be defined in the url by its id. The URL /symbols/4/actions therefore manages the actions of the
     * symbol with id 4. When no such id was found, the controller redirects to an error page.
     *
     * The template can be found at 'views/pages/symbols-actions.html'.
     *
     * @param $scope - The controllers scope
     * @param $stateParams - The parameters of the state
     * @param Symbol - The Symbol model
     * @param Session - The session service
     * @param SelectionService - The selection service
     * @param Toast - The ToastService
     * @constructor
     */
    function SymbolsActionsController($scope, $stateParams, Symbol, Session, SelectionService, Toast) {

        /**
         * The project that is stored in the session
         * @type {Project}
         */
        $scope.project = Session.project.get();

        /**
         * The symbol whose actions are managed
         * @type {Symbol|null}
         */
        $scope.symbol = null;

        /**
         * A copy of $scope.symbol to revert unsaved changes
         * @type {Symbol|null}
         */
        $scope.symbolCopy = null;

        /**
         * The list of selected actions
         * @type {Array}
         */
        $scope.selectedActions = [];

        // load all actions from the symbol
        // redirect to an error page when the symbol from the url id cannot be found
        (function init() {
            Symbol.Resource.get($scope.project.id, $stateParams.symbolId)
                .then(prepareSymbol)
                .catch(function (response) {
                    // TODO: redirect to an error page with a message
                });
        }());

        // initialize the controller for a given symbol
        function prepareSymbol(symbol) {

            // create unique ids for actions
            _.forEach(symbol.actions, function (action) {
                action._id = _.uniqueId();
            });

            // add symbol to scope and create a copy in order to revert changes
            $scope.symbol = symbol;
            $scope.symbolCopy = symbol.copy();
        }

        /**
         * Deletes the actions that the user selected from the scope
         */
        $scope.deleteSelectedActions = function () {
            if ($scope.selectedActions.length > 0) {
                _.forEach($scope.selectedActions, $scope.deleteAction);
                Toast.success('Actions deleted');
            }
        };

        /**
         * Removes an action from a symbol
         *
         * @param {Object} action
         */
        $scope.deleteAction = function (action) {
            _.remove($scope.symbol.actions, {_id: action._id});
            Toast.success('Action deleted');
        };

        /**
         * Adds a new action to the list of actions of the symbol and gives it a temporary unique id
         *
         * @param {Object} action
         */
        $scope.addAction = function (action) {
            action._id = _.uniqueId();
            $scope.symbol.actions.push(action);
            Toast.success('Action created');
        };

        /**
         * Updates an existing action
         *
         * @param {Object} updatedAction
         */
        $scope.updateAction = function (updatedAction) {
            var index = _.findIndex($scope.symbol.actions, {_id: updatedAction._id});
            if (index > -1) {
                $scope.symbol.actions[index] = updatedAction;
                Toast.success('Action updated');
            }
        };

        /**
         * Saves the changes that were made to the symbol by updating it on the server.
         */
        $scope.saveChanges = function () {

            // update the copy for later reverting
            var copy = $scope.symbol.copy();
            SelectionService.removeSelection(copy.actions);

            // remove the temporarily create unique id attribute
            _.forEach(copy.actions, function (action) {
                delete action._id;
            });

            // update the symbol
            Symbol.Resource.update($scope.project.id, copy)
                .then(function (updatedSymbol) {
                    prepareSymbol(updatedSymbol);
                    Toast.success('Symbol <strong>' + updatedSymbol.name + '</strong> updated');
                })
                .catch(function (response) {
                    Toast.danger('<p><strong>Error updating symbol</strong></p>' + response.data.message);
                })
        };

        /**
         * Reverts the changes that were made to the symbol before the last update
         */
        $scope.revertChanges = function () {
            prepareSymbol($scope.symbolCopy);
            Toast.info('Changes reverted to the last update');
        };
    }
}());