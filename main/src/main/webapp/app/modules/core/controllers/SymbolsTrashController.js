(function () {
    'use strict';

    angular
        .module('ALEX.core')
        .controller('SymbolsTrashController', SymbolsTrashController);

    SymbolsTrashController.$inject = ['$scope', 'SessionService', 'Symbol', 'SymbolResource', '_', 'ToastService'];

    /**
     * Lists all deleted symbols, what means the symbols where the property 'visible' == 'hidden'. Handles the recover
     * of these symbols. By default, recovered symbols will be moved in the default group with the id 0.
     *
     * Template: 'views/symbols-trash.html'
     *
     * @param $scope - The controllers scope object
     * @param Session - The SessionService
     * @param Symbol - The Symbol factory
     * @param SymbolResource - The Symbol API Resource handler
     * @param _ - Lodash
     * @param Toast - The ToastService
     * @constructor
     */
    function SymbolsTrashController($scope, Session, Symbol, SymbolResource, _, Toast) {

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
            SymbolResource.getAll(project.id, {deleted: true})
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
            SymbolResource.recover(symbol)
                .success(function () {
                    Toast.success('Symbol ' + symbol.name + ' recovered');
                    _.remove($scope.symbols, {id: symbol.id});
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
                SymbolResource.recover($scope.selectedSymbols)
                    .success(function () {
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