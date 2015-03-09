(function () {
    'use strict';

    angular
        .module('weblearner.controller')
        .controller('SymbolsController', SymbolsController);

    SymbolsController.$inject = ['$scope', 'SessionService', 'Symbol', 'SymbolGroup', 'SelectionService', '_'];

    function SymbolsController($scope, Session, Symbol, SymbolGroup, SelectionService, _) {

        $scope.project = Session.project.get();
        $scope.groups = [];
        $scope.allSymbols = [];
        $scope.collapseAll = false;
        $scope.selectedSymbols = [];

        SymbolGroup.Resource.getAll($scope.project.id, {embedSymbols: true})
            .then(function (groups) {
                $scope.groups = groups;
                $scope.allSymbols = _.flatten(_.pluck($scope.groups, 'symbols'));
            });

        $scope.toggleCollapseAllGroups = function () {
            $scope.collapseAll = !$scope.collapseAll;
            _.forEach($scope.groups, function (group) {
                group._isCollapsed = $scope.collapseAll;
            })
        };

        function removeSymbolsFromScope(symbols) {
            _.forEach(symbols, function(symbol){
                var index = _.findIndex($scope.groups, {id: symbol.group});
                _.remove($scope.groups[index].symbols, {id: symbol.id});
                _.remove($scope.symbols, {id: symbol.id});
            })
        }

        /**
         * Deletes a given symbol and remove it from the scope so that it will not be listed any longer
         *
         * @param symbol {Symbol} - The symbol that should be deleted
         */
        $scope.deleteSymbol = function (symbol) {
            Symbol.Resource.delete($scope.project.id, symbol.id)
                .then(function () {
                    removeSymbolsFromScope([symbol]);
                })
        };

        /**
         * Moves the selected symbols to a new group
         *
         * @param group {SymbolGroup} - The group where the selected symbols should be moved into
         */
        $scope.moveSelectedSymbolsTo = function (group) {
            var selectedSymbols = SelectionService.getSelected($scope.allSymbols);

            SelectionService.removeSelection(selectedSymbols);
            _.forEach(selectedSymbols, function (symbol) {
                symbol.group = group.id;
                group.push(symbol);
            });
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
                    .then(removeSymbolsFromScope);
            }
        };

        /**
         * Adds a symbol to to its corresponding group the scope
         *
         * @param symbol {Symbol} - The new symbol that should be added to the list
         */
        $scope.addSymbol = function (symbol) {
            var index = _.findIndex($scope.groups, {id: symbol.group});
            if (index > -1) {
                $scope.groups[index].symbols.push(symbol);
                $scope.allSymbols.push(symbol);
            }
        };

        /**
         * Adds a group to the scope
         *
         * @param group {SymbolGroup} - The new group that should be added to the list
         */
        $scope.addGroup = function (group) {
            $scope.groups.push(group);
        };

        $scope.updateSymbol = function (symbol, oldSymbol) {
            var group = _.find($scope.groups, {id: symbol.group});
            if (group) {
                group.symbols.push(symbol);
            }
        };

        $scope.updateGroup = function (group) {
            var g = _.find($scope.groups, {id: group.id});
            if (angular.isDefined(g)) {
                g.name = group.name;
            }
        };

        $scope.deleteGroup = function (group) {
            removeSymbolsFromScope(group.symbols);
            _.remove($scope.groups, {id: group.id});
        };

        $scope.getSelectedSymbols = function () {
            return SelectionService.getSelected($scope.allSymbols);
        }
    }
}());