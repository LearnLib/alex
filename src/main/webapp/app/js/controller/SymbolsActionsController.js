(function () {
    'use strict';

    angular
        .module('weblearner.controller')
        .controller('SymbolsActionsController', [
            '$scope', '$stateParams', 'SymbolResource', 'SessionService', 'SelectionService', 'WebActionTypesEnum',
            'RestActionTypesEnum', 'ngToast',
            SymbolsActionsController
        ]);

    function SymbolsActionsController($scope, $stateParams, SymbolResource, SessionService, SelectionService,
                                      WebActionTypesEnum, RestActionTypesEnum, toast) {

        /** the enum for web action types that are displayed in a select box */
        $scope.webActionTypes = WebActionTypesEnum;

        /** the enum for rest action types that are displayed in a select box */
        $scope.restActionTypes = RestActionTypesEnum;

        /** the open project */
        $scope.project = SessionService.project.get();

        /** the symbol whose actions are managed */
        $scope.symbol = null;

        /** a copy of $scope.symbol to revert unsaved changes */
        $scope.symbolCopy = null;

        //////////

        // load all actions from the symbol
        SymbolResource.get($scope.project.id, $stateParams.symbolId)
            .then(init);

        //////////

        function init(symbol) {

            // create unique ids for actions
            _.forEach(symbol.actions, function (action) {
                action._id = _.uniqueId();
            });

            // add symbol to scope and create a copy in order to revert changes
            $scope.symbol = symbol;
            $scope.symbolCopy = angular.copy($scope.symbol);
        }

        //////////

        /**
         * delete the actions that the user selected from the scope
         */
        $scope.deleteSelectedActions = function () {
            var selectedActions = SelectionService.getSelected($scope.symbol.actions);
            if (selectedActions.length) {
                _.forEach(selectedActions, $scope.deleteAction);
            }
        };

        $scope.deleteAction = function(action) {
            _.remove($scope.symbol.actions, {_id: action._id});
        };

        /**
         * add a new action to the list of actions of the symbol
         * @param action
         */
        $scope.addAction = function (action) {
            action._id = _.uniqueId();
            $scope.symbol.actions.push(action);
        };

        /**
         * update an action
         * @param updatedAction
         */
        $scope.updateAction = function (updatedAction) {
            var index = _.findIndex($scope.symbol.actions, {_id: updatedAction._id});
            if (index > -1) {
                $scope.symbol.actions[index] = updatedAction;
            }
        };

        /**
         * save the changes that were made to the symbol by updating it on the server
         */
        $scope.saveChanges = function () {
            SelectionService.removeSelection($scope.actions);

            // remove the temporarily create unique id attribute
            _.forEach(copy.actions, function (action) {
                delete action._id;
            });

            // update the symbol
            SymbolResource.update($scope.project.id, $scope.symbol)
                .then(init)
        };

        /**
         * revert the changes that were made to the symbol
         */
        $scope.revertChanges = function () {
            $scope.symbol = angular.copy($scope.symbolCopy);
        };
    }
}());