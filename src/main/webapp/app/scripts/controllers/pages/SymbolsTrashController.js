(function () {
    'use strict';

    angular
        .module('weblearner.controller')
        .controller('SymbolsTrashController', SymbolsTrashController);

    SymbolsTrashController.$inject = ['$scope', 'SessionService', 'Symbol', 'SelectionService', '_'];

    /**
     * Lists all deleted symbols, what means the symbols where the property 'visible' == 'hidden'. Handles the recover
     * of these symbols. By default, recovered symbols will be moved in the default group with the id 0.
     *
     * @param $scope
     * @param Session
     * @param Symbol
     * @param SelectionService
     * @constructor
     */
    function SymbolsTrashController($scope, Session, Symbol, SelectionService, _) {

        // The project that is saved in the sessionStorage
        var project = Session.project.get();

        /**
         * The list of deleted symbols
         *
         * @type {Symbol[]}
         */
        $scope.symbols = [];

        // fetch all deleted symbols and save them in scope
        Symbol.Resource.getAll(project.id, {deleted: true})
            .then(function (symbols) {
                $scope.symbols = symbols;
            });

        /**
         * Recovers a deleted symbol by calling the API and removes the recovered symbol from the symbol list on success
         *
         * @param symbol {Symbol} - The symbol that should be recovered from the trash
         */
        $scope.recoverSymbol = function (symbol) {

            // create a copy so that the selection won't be removed in case the API call fails
            var s = symbol.copy();
            SelectionService.removeSelection(s);

            Symbol.Resource.recover(project.id, symbol)
                .then(function (recoveredSymbol) {
                    _.remove($scope.symbols, {id: recoveredSymbol.id});
                })
        };

        /**
         * Recovers all symbols that were selected and calls $scope.recoverSymbol for each one
         */
        $scope.recoverSelectedSymbols = function () {
            var selectedSymbols = SelectionService.getSelected($scope.symbols);

            if (selectedSymbols.length > 0) {
                _.forEach(selectedSymbols, $scope.recoverSymbol);
            }
        }
    }
}());