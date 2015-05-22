(function () {
    'use strict';

    angular
        .module('ALEX.core')
        .controller('SymbolsActionsController', SymbolsActionsController);

    SymbolsActionsController.$inject = [
        '$scope', '$stateParams', 'Symbol', 'SymbolResource', 'SessionService', 'ToastService', 'ErrorService', '_'
    ];

    /**
     * The controller that handles the page for managing all actions of a symbol. The symbol whose actions should be
     * manages has to be defined in the url by its id. The URL /symbols/4/actions therefore manages the actions of the
     * symbol with id 4. When no such id was found, the controller redirects to an error page.
     *
     * Template 'views/symbols-actions.html'.
     *
     * @param $scope - The controllers scope
     * @param $stateParams - The parameters of the state
     * @param Symbol - The factory for Symbol objects
     * @param SymbolResource - The Symbol model
     * @param Session - The session service
     * @param Toast - The ToastService
     * @param Error - The ErrorService
     * @param _ - Lodash
     * @constructor
     */
    function SymbolsActionsController($scope, $stateParams, Symbol, SymbolResource, Session, Toast, Error, _) {

        /**
         * A copy of $scope.symbol to revert unsaved changes
         * @type {Symbol|null}
         */
        var symbolCopy = null;

        /**
         * The project that is stored in the session
         * @type {Project}
         */
        var project = Session.project.get();

        /**
         * The symbol whose actions are managed
         * @type {Symbol|null}
         */
        $scope.symbol = null;

        /**
         * The list of selected actions
         * @type {Object[]}
         */
        $scope.selectedActions = [];

        /**
         * Whether there are unsaved changes to the symbol
         * @type {boolean}
         */
        $scope.hasUnsavedChanges = false;

        /**
         * Options for ng-sortable directive from Sortable lib
         * @type {{animation: number, onUpdate: Function}}
         */
        $scope.sortableOptions = {
            animation: 150,
            onUpdate: function(){
                $scope.hasUnsavedChanges = true
            }
        };

        // load all actions from the symbol
        // redirect to an error page when the symbol from the url id cannot be found
        (function init() {
            SymbolResource.get(project.id, $stateParams.symbolId)
                .then(function (symbol) {

                    // create unique ids for actions so that they can be found
                    _.forEach(symbol.actions, function (action) {
                        action._id = _.uniqueId();
                    });

                    // add symbol to scope and create a copy in order to revert changes
                    $scope.symbol = symbol;
                    symbolCopy = Symbol.build(symbol);
                })
                .catch(function () {
                    Error.setErrorMessage('The symbol with the ID "' + $stateParams.symbolId + "' could not be found");
                    Error.goToErrorPage();
                });
        }());

        /**
         * Deletes the actions that the user selected from the scope
         */
        $scope.deleteSelectedActions = function () {
            if ($scope.selectedActions.length > 0) {
                _.forEach($scope.selectedActions, $scope.deleteAction);
                Toast.success('Actions deleted');
            }
            $scope.hasUnsavedChanges = true;
        };

        /**
         * Removes an action from a symbol
         *
         * @param {Object} action
         */
        $scope.deleteAction = function (action) {
            _.remove($scope.symbol.actions, {_id: action._id});
            Toast.success('Action deleted');
            $scope.hasUnsavedChanges = true;
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
            $scope.hasUnsavedChanges = true;
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
            $scope.hasUnsavedChanges = true;
        };

        /**
         * Saves the changes that were made to the symbol by updating it on the server.
         */
        $scope.saveChanges = function () {

            // update the copy for later reverting
            var copy = Symbol.build($scope.symbol);

            _.forEach(copy.actions, function (a) {
                delete a._id;
                delete a._selected;
            });

            // update the symbol
            SymbolResource.update(copy)
                .then(function (updatedSymbol) {
                    $scope.symbol.revision = updatedSymbol.revision;
                    symbolCopy = Symbol.build($scope.symbol);
                    Toast.success('Symbol <strong>' + updatedSymbol.name + '</strong> updated');
                    $scope.hasUnsavedChanges = false;
                })
                .catch(function (response) {
                    Toast.danger('<p><strong>Error updating symbol</strong></p>' + response.data.message);
                })
        };

        /**
         * Reverts the changes that were made to the symbol before the last update
         */
        $scope.revertChanges = function () {
            $scope.symbol = symbolCopy;
            symbolCopy = Symbol.build($scope.symbol);
            Toast.info('Changes reverted to the last update');
            $scope.hasUnsavedChanges = false;
        };
    }
}());