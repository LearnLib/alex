(function () {
    'use strict';

    angular
        .module('weblearner.controller')
        .controller('SymbolsController', SymbolsController);

    SymbolsController.$inject = [
        '$scope', 'SessionService', 'Symbol', 'SymbolGroup', 'SelectionService', '_', 'ToastService'
    ];

    /**
     * The template can be found at 'views/pages/symbols.html'
     *
     * @param $scope
     * @param Session
     * @param Symbol
     * @param SymbolGroup
     * @param SelectionService
     * @param _
     * @param Toast
     * @constructor
     */
    function SymbolsController($scope, Session, Symbol, SymbolGroup, SelectionService, _, Toast) {

        $scope.project = Session.project.get();
        $scope.groups = [];
        $scope.allSymbols = [];
        $scope.collapseAll = false;

        (function init() {
            SymbolGroup.Resource.getAll($scope.project.id, {embedSymbols: true})
                .then(function (groups) {
                    $scope.groups = groups;
                    $scope.allSymbols = _.flatten(_.pluck($scope.groups, 'symbols'));
                });
        }());

        function removeSymbolsFromScope(symbols) {
            var group;

            _.forEach(symbols, function (symbol) {
                group = _.find($scope.groups, {id: symbol.group});
                _.remove(group.symbols, {id: symbol.id});
                _.remove($scope.allSymbols, {id: symbol.id});
            })
        }

        /**
         * Deletes a given symbol and remove it from the scope so that it will not be listed any longer
         *
         * @param {Symbol} symbol - The symbol that should be deleted
         */
        $scope.deleteSymbol = function (symbol) {
            Symbol.Resource.delete($scope.project.id, symbol.id)
                .then(function () {
                    Toast.success('Symbol <strong>' + symbol.name + '</strong> deleted');
                    removeSymbolsFromScope([symbol]);
                }).catch(function (response) {
                    Toast.danger('<p><strong>Deletion failed!</strong></p>' + response.data.message);
                })
        };

        /**
         * Deletes the symbols the user selected from the server and the scope
         */
        $scope.deleteSelectedSymbols = function () {
            var selectedSymbols = SelectionService.getSelected($scope.allSymbols);
            var symbolsIds;

            if (selectedSymbols.length > 0) {
                symbolsIds = _.pluck(selectedSymbols, 'id');
                Symbol.Resource.deleteSome($scope.project.id, symbolsIds)
                    .then(function () {
                        Toast.success('Symbols deleted');
                        removeSymbolsFromScope(selectedSymbols);
                    }).catch(function (response) {
                        Toast.danger('<p><strong>Deletion failed!</strong></p>' + response.data.message);
                    })
            }
        };

        /**
         * Adds a symbol to to its corresponding group the scope
         *
         * @param {Symbol} symbol - The new symbol that should be added to the list
         */
        $scope.addSymbol = function (symbol) {
            var group = _.find($scope.groups, {id: symbol.group});
            if (angular.isDefined(group)) {
                group.addSymbol(symbol);
            }
        };

        /**
         * Adds a group to the scope
         *
         * @param {SymbolGroup} group - The new group that should be added to the list
         */
        $scope.addGroup = function (group) {
            $scope.groups.push(group);
        };

        /**
         * Updates a symbol in the scope
         * @param symbol
         */
        $scope.updateSymbol = function (symbol) {
            var group = _.find($scope.groups, {id: symbol.group});
            var i = _.findIndex(group.symbols, {id: symbol.id});
            group.symbols[i] = symbol;
        };

        $scope.moveSymbols = function (symbols, group) {
            _.forEach(symbols, function (symbol) {
                var g = _.find($scope.groups, {id: symbol.group});
                _.remove(g.symbols, {id: symbol.id});
            });
            var g = _.find($scope.groups, {id: group.id});
            g.symbols = g.symbols.concat(symbols);
        };

        /**
         *
         * @param group
         */
        $scope.updateGroup = function (group) {
            var g = _.find($scope.groups, {id: group.id});
            if (angular.isDefined(g)) {
                g.name = group.name;
            }
        };

        /**
         *
         * @param group
         */
        $scope.deleteGroup = function (group) {
            _.remove($scope.groups, {id: group.id});
        };

        /**
         *
         */
        $scope.toggleCollapseAllGroups = function () {
            $scope.collapseAll = !$scope.collapseAll;
            _.forEach($scope.groups, function (group) {
                group._isCollapsed = $scope.collapseAll;
            })
        };

        $scope.getSelectedSymbols = function () {
            return SelectionService.getSelected($scope.allSymbols);
        }
    }
}());