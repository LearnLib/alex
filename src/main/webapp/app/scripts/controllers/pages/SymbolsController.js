(function () {
    'use strict';

    angular
        .module('weblearner.controller')
        .controller('SymbolsController', SymbolsController);

    SymbolsController.$inject = ['$scope', 'SessionService', 'SymbolGroup', 'SelectionService'];

    function SymbolsController($scope, Session, SymbolGroup, SelectionService) {

        $scope.project = Session.project.get();
        $scope.groups = [];
        $scope.allSymbols = [];
        $scope.collapseAll = false;

        SymbolGroup.Resource.getAll($scope.project.id, {embedSymbols: true})
            .then(function (groups) {
                $scope.groups = groups;
                $scope.allSymbols = _.flatten(_.pluck($scope.groups, 'symbols'));
            });

        $scope.addSymbol = function (symbol) {
            $scope.groups[0].symbols.push(symbol);
        };

        $scope.toggleCollapseAllGroups = function () {
            $scope.collapseAll = !$scope.collapseAll;
            _.forEach($scope.groups, function (group) {
                group._isCollapsed = $scope.collapseAll;
            })
        };

        /**
         * Deletes a given symbol and remove it from the scope so that it will not be listed any longer
         *
         * @param symbol - The symbol that should be deleted
         */
        $scope.deleteSymbol = function (symbol) {
            Symbol.Resource.delete($scope.project.id, symbol.id)
                .then(function (deletedSymbol) {
                    _.remove($scope.symbols, {id: deletedSymbol.id});
                })
        };

        /**
         * Moves the selected symbols to a new group
         *
         * @param group - The group where the selected symbols should be moved into
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
            var selectedSymbols = SelectionService.getSelected($scope.symbols);
            var symbolsIds;

            if (selectedSymbols.length) {

                // get all ids from the selected symbols
                symbolsIds = _.pluck(selectedSymbols, 'id');
                Symbol.Resource.deleteSome($scope.project.id, symbolsIds)
                    .then(function (deletedSymbols) {
                        _.forEach(deletedSymbols, function (symbol) {
                            _.remove($scope.symbols, {id: symbol.id})
                        })
                    });
            }
        };

        //
        ///**
        // * Adds a symbol to the scope
        // *
        // * @param symbol {symbol} - The new symbol that should be added to the list
        // */
        //$scope.addSymbol = function (symbol) {
        //    $scope.symbols.push(symbol)
        //};
        //
        ///**
        // * Updates a symbol in the scope
        // *
        // * @param symbol {Symbol} - The symbol whose properties should be updated
        // */
        //$scope.updateSymbol = function (symbol) {
        //    var index = _.findIndex($scope.symbols, {id: symbol.id});
        //    if (index > -1) {
        //        SelectionService.select(symbol);
        //        $scope.symbols[index] = symbol;
        //    }
        //};
    }
}());