(function () {
    'use strict';

    angular
        .module('ALEX.controller')
        .controller('SymbolsTrashController', SymbolsTrashController);

    SymbolsTrashController.$inject = ['$scope', 'SessionService', 'Symbol', '_', 'ToastService'];

    /**
     * Lists all deleted symbols, what means the symbols where the property 'visible' == 'hidden'. Handles the recover
     * of these symbols. By default, recovered symbols will be moved in the default group with the id 0.
     *
     * @param $scope - The controllers scope object
     * @param Session - The SessionService
     * @param Symbol - The Symbol factory
     * @param _ - Lodash
     * @param Toast - The ToastService
     * @constructor
     */
    function SymbolsTrashController($scope, Session, Symbol, _, Toast) {

        // The project that is saved in the sessionStorage
        var project = Session.project.get();

        /**
         * The list of deleted symbols
         * @type {Symbol[]}
         */
        $scope.symbols = [];

        /**
         * The list of selected symbols
         * @type {Symbol[]}
         */
        $scope.selectedSymbols = [];

        // initialize controller scope variables
        (function init() {

            // fetch all deleted symbols and save them in scope
            Symbol.Resource.getAll(project.id, {deleted: true})
                .then(function (symbols) {
                    $scope.symbols = symbols;
                });
        }());

        /**
         * Recovers a deleted symbol by calling the API and removes the recovered symbol from the symbol list on success
         *
         * @param {Symbol} symbol - The symbol that should be recovered from the trash
         */
        $scope.recoverSymbol = function (symbol) {
            Symbol.Resource.recover(project.id, symbol)
                .then(function (recoveredSymbol) {
                    Toast.success('Symbol ' + recoveredSymbol.name + ' recovered');
                    _.remove($scope.symbols, {id: recoveredSymbol.id});
                })
                .catch(function (response) {
                    Toast.danger('<p><strong>Error recovering symbol ' + symbol.name + '!</strong></p>' + response.data.message);
                })
        };

        /**
         * Recovers all symbols that were selected and calls $scope.recoverSymbol for each one
         */
        $scope.recoverSelectedSymbols = function () {
            if ($scope.selectedSymbols.length > 0) {
                Symbol.Resource.recoverSome(project.id, $scope.selectedSymbols)
                    .then(function () {
                        Toast.success('Symbols recovered');
                        _.forEach($scope.selectedSymbols, function (symbol) {
                            _.remove($scope.symbols, {id: symbol.id})
                        });
                        $scope.selectedSymbols = [];
                    })
                    .catch(function (response) {
                        Toast.danger('<p><strong>Error recovering symbols!</strong></p>' + response.data.message);
                    })
            }
        }
    }
}());