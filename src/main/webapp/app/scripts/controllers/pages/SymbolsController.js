(function () {
    'use strict';

    angular
        .module('weblearner.controller')
        .controller('SymbolsController', [
            '$scope', 'SessionService', 'SymbolResource', 'SelectionService', 'type',
            SymbolsController
        ]);

    function SymbolsController($scope, SessionService, SymbolResource, SelectionService, type) {

        /** the open project @type {*} */
        $scope.project = SessionService.project.get();

        /** the symbol type @type {string} */
        $scope.type = type;

        /** the list of web or rest symbols @type {[]|*[]} */
        $scope.symbols = [];

        //////////

        // load symbols from the server
        SymbolResource.getAll($scope.project.id, {type: type})
            .then(function (symbols) {
                $scope.symbols = symbols;
            });

        //////////

        /**
         *
         * @param symbols
         */
        function removeSymbolsFromScope(symbols) {
            if (symbols.length) {
                _.forEach(symbols, function (symbol) {
                    _.remove($scope.symbols, {id: symbol.id})
                })
            }
        }

        //////////

        /**
         *
         * @param symbol
         */
        $scope.deleteSymbol = function (symbol) {
            SymbolResource.delete($scope.project.id, symbol.id)
                .then(function () {
                    removeSymbolsFromScope([symbol])
                })
        };

        /**
         * Delete the symbols the user selected from the server and the scope
         */
        $scope.deleteSelectedSymbols = function () {

            var selectedSymbols = SelectionService.getSelected($scope.symbols);
            var symbolsIds;

            if (selectedSymbols.length) {
                symbolsIds = _.pluck(selectedSymbols, 'id');
                SymbolResource.deleteSome($scope.project.id, symbolsIds)
                    .then(function () {
                        removeSymbolsFromScope(selectedSymbols);
                    });
            }
        };

        /**
         * Add a symbol to the scope
         * @param symbol
         */
        $scope.addSymbol = function (symbol) {
            $scope.symbols.push(symbol)
        };

        /**
         * Update a symbol in the scope
         * @param symbol
         */
        $scope.updateSymbol = function (symbol) {
            var index = _.findIndex($scope.symbols, {id: symbol.id});
            if (index > -1) {
                SelectionService.select(symbol);
                $scope.symbols[index] = symbol;
            }
        };
    }
}());