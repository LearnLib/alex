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
        switch ($scope.type) {
            case 'web':
                // web symbols
                SymbolResource.allWeb($scope.project.id)
                    .then(function (symbols) {
                        $scope.symbols = symbols;
                    });
                break;
            case 'rest':
                // rest symbols
                SymbolResource.allRest($scope.project.id)
                    .then(function (symbols) {
                        $scope.symbols = symbols;
                    });
                break;
            default:
                break;
        }

        //////////

        /**
         * @description deletes the symbols that the user selected from the server and the scope
         */
        $scope.deleteSelectedSymbols = function () {
            var selectedSymbols = SelectionService.getSelected($scope.symbols);
            if (selectedSymbols.length > 0) {
                SelectionService.removeSelection(selectedSymbols);
                _.forEach(selectedSymbols, function (symbol) {
                    SymbolResource.delete(symbol.project, symbol.id)
                        .then(function () {
                            _.remove($scope.symbols, function (s) {
                                return s.id == symbol.id
                            })
                        })
                })
            }
        };

        /**
         * @description add a symbol to the scope
         * @param symbol {{}}
         */
        $scope.addSymbol = function (symbol) {
            $scope.symbols.push(symbol)
        };

        /**
         * @description updates a symbol in the scope
         * @param symbol {{}}
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