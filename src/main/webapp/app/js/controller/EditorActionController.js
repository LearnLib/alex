(function () {
    'use strict';

    angular
        .module('weblearner.controller')
        .controller('EditorActionController', [
            '$scope', '$stateParams', 'SymbolResource', 'SessionService', 'SelectionService', 'WebActionTypesEnum', 'RestActionTypesEnum', 'ngToast',
            EditorActionController
        ]);

    function EditorActionController($scope, $stateParams, SymbolResource, SessionService, SelectionService, WebActionTypesEnum, RestActionTypesEnum, toast) {

        var _id = 0;

        //////////

        /** the enum for web action types that are displayed in a select box */
        $scope.webActionTypes = WebActionTypesEnum;

        /** the enum for rest action types that are displayed in a select box */
        $scope.restActionTypes = RestActionTypesEnum;

        //////////

        /** the open project */
        $scope.project = SessionService.project.get();

        /** the symbol whose actions are managed */
        $scope.symbol = null;

        /** a copy of $scope.symbol to revert unsaved changes */
        $scope.symbolCopy = null;

        //////////

        // load all actions from the symbol
        SymbolResource.get($scope.project.id, $stateParams.symbolId).then(function (symbol) {

            _.forEach(symbol.actions, function (action) {
                action._id = _id++;
            });

            $scope.symbol = symbol;
            $scope.symbolCopy = angular.copy($scope.symbol);
        });

        //////////

        /**
         * delete the actions that the user selected from the scope
         */
        $scope.deleteActions = function () {
            var selectedActions = SelectionService.getSelected($scope.symbol.actions);
            if (selectedActions.length > 0) {
                _.forEach(selectedActions, function (action) {
                    _.remove($scope.symbol.actions, {_id: action._id})
                });
                toast.create({
                    class: 'success',
                    content: 'Actions deleted'
                });
            }
        };

        /**
         * add a new action to the list of actions of the symbol
         * @param action
         */
        $scope.addAction = function (action) {
            action._id = _id++;
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
            var copy = angular.copy($scope.symbol);
            SelectionService.removeSelection(copy.actions);
            _.forEach(copy.actions, function (action) {
                delete action._id;
            });
            SymbolResource.update($scope.project.id, copy)
                .then(function (updatedSymbol) {

                    _id = 0;
                    _.forEach(updatedSymbol.actions, function (action) {
                        action._id = _id++;
                    });

                    $scope.symbol = updatedSymbol;
                    $scope.symbolCopy = angular.copy(updatedSymbol);
                })
        };

        /**
         * revert the changes that were made to the symbol
         */
        $scope.revertChanges = function () {
            $scope.symbol = angular.copy($scope.symbolCopy);
        };
    }
}());