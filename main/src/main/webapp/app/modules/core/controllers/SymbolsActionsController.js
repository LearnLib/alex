(function () {
    'use strict';

    angular
        .module('ALEX.core')
        .controller('SymbolsActionsController', SymbolsActionsController);

    SymbolsActionsController.$inject = [
        '$scope', '$stateParams', 'Symbol', 'SymbolResource', 'SessionService', 'ToastService', 'ErrorService', '_',
        'ActionService', 'ClipboardService', '$state', 'PromptService'
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
     * @param ActionService - The ActionService
     * @param Clipboard - The ClipboardService
     * @param $state - ui.router $state
     * @param Prompt - PromptService
     * @constructor
     */
    function SymbolsActionsController($scope, $stateParams, Symbol, SymbolResource, Session, Toast, Error, _,
                                      ActionService, Clipboard, $state, Prompt) {

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
         * A map where actions can save temporary key value pairs
         * @type {{}}
         */
        $scope.map = {};

        /**
         * The list of selected actions
         * @type {Object[]}
         */
        $scope.selectedActions = [];

        /**
         * Whether there are unsaved changes to the symbol
         * @type {boolean}
         */
        $scope.hasChanged = false;

        /**
         * Options for ng-sortable directive from Sortable lib
         * @type {{animation: number, onUpdate: Function}}
         */
        $scope.sortableOptions = {
            animation: 150,
            onUpdate: function () {
                setChanged(true);
            }
        };

        /**
         * Sets the flag that indicates if the symbol or its actions have changed
         *
         * @param {boolean} b - If the symbol has changed by any means
         */
        function setChanged(b) {
            $scope.hasChanged = b;
        }

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
                    $scope.symbolCopy = Symbol.build(symbol);
                })
                .catch(function () {
                    Error.setErrorMessage('The symbol with the ID "' + $stateParams.symbolId + "' could not be found");
                    Error.goToErrorPage();
                });

            // show a confirm dialog if the user leaves the page without having saved changes and
            // redirect to the state that the user was about to go to if he doesn't want to save changes
            var offHandler = $scope.$on('$stateChangeStart', function (event, toState) {
                if ($scope.hasChanged) {
                    event.preventDefault();
                    Prompt.confirm('There are unsaved changes. Do you still want to continue and discard them?')
                        .then(function () {
                            offHandler();
                            $state.go(toState);
                        })
                }
            });
        }());

        /**
         * Deletes a list of actions
         *
         * @param {Object[]} actions - The actions to be deleted
         */
        $scope.deleteActions = function (actions) {
            if (actions.length > 0) {
                _.forEach(actions, function (a) {
                    _.remove($scope.symbol.actions, {_id: a._id});
                    _.remove($scope.selectedActions, {id: a._id});
                });
                Toast.success('Action' + (actions.length > 1 ? 's' : '') + ' deleted');
                setChanged(true);
            }
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
            setChanged(true);
            $scope.map = {};
        };

        /**
         * Updates an existing action
         *
         * @param {Object} updatedAction
         */
        $scope.updateAction = function (updatedAction) {
            var action = _.find($scope.symbol.actions, {_id: updatedAction._id});
            _.forIn(action, function (v, k) {
                action[k] = updatedAction[k];
            });
            Toast.success('Action updated');
            setChanged(true);
            $scope.map = {};
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
                    setChanged(false);
                    $scope.hasUnsavedChanges = false;
                })
                .catch(function (response) {
                    Toast.danger('<p><strong>Error updating symbol</strong></p>' + response.data.message);
                })
        };

        /**
         * Copies actions to the clipboard
         *
         * @param {Object[]} actions
         */
        $scope.copyActions = function (actions) {
            Clipboard.copy('actions', angular.copy(actions));
            Toast.info(actions.length + ' action[s] copied to clipboard');
        };

        /**
         * Copies actions to the clipboard and removes them from the scope
         *
         * @param {Object[]} actions
         */
        $scope.cutActions = function (actions) {
            Clipboard.cut('actions', angular.copy(actions));
            $scope.deleteActions(actions);
            Toast.info(actions.length + ' action[s] cut to clipboard');
            setChanged(true);
        };

        /**
         * Pastes the actions from the clipboard to the end of of the action list
         */
        $scope.pasteActions = function () {
            var actions = Clipboard.paste('actions');
            if (actions !== null) {
                actions = _.map(actions, function (action) {
                    return ActionService.buildFromData(action);
                });
                _.forEach(actions, $scope.addAction);
                Toast.info(actions.length + 'action[s] pasted from clipboard');
                setChanged(true);
            }
        };

        /**
         * Toggles the disabled flag on an action
         *
         * @param {Object} action
         */
        $scope.toggleDisableAction = function (action) {
            action.disabled = !action.disabled;
            setChanged(true);
        }
    }
}());