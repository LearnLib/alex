(function () {
    'use strict';

    angular
        .module('weblearner.controller')
        .controller('SymbolsImportController', SymbolsImportController);

    SymbolsImportController.$inject = ['$scope', 'SessionService', 'Symbol', '_', 'ToastService'];

    /**
     * The controller that handles the import of symbols from a *.json file.
     *
     * Template: 'views/pages/symbols-import.html'
     *
     * @param $scope - The controllers scope
     * @param Session - The SessionService
     * @param Symbol - The factory for Symbols
     * @param _ - Lodash
     * @param Toast - The ToastService
     * @constructor
     */
    function SymbolsImportController($scope, Session, Symbol, _, Toast) {

        // The project that is saved in the sessionStorage
        var project = Session.project.get();

        /**
         * The symbols that will be uploaded
         * @type {Symbol[]}
         */
        $scope.symbols = [];

        /**
         * The list of selected symbols
         * @type {Symbol[]}
         */
        $scope.selectedSymbols = [];

        /**
         * Creates instances of Symbols from the json string from the *.json file and puts them in the scope.
         *
         * @param data - The json string of loaded symbols
         */
        $scope.fileLoaded = function (data) {
            try {
                $scope.$apply(function () {
                    $scope.symbols = Symbol.buildSome(angular.fromJson(data));
                });
            } catch (e) {
                Toast.danger('<p><strong>Loading json file failed</strong></p>' + e);
            }
        };

        /**
         * Makes an API request in order to create the selected symbols. Removes successfully created symbols from the
         * scope.
         */
        $scope.uploadSelectedSymbols = function () {
            if ($scope.selectedSymbols.length > 0) {
                var symbols = angular.copy($scope.selectedSymbols);
                _.forEach(symbols, function (symbol) {
                    delete symbol._collapsed;
                    delete symbol._selected;
                });
                symbols = _.sortBy(symbols, function (n) {
                    return n.id
                });
                // TODO: delete ids
                Symbol.Resource.createSome(project.id, symbols)
                    .then(function (createdSymbols) {
                        Toast.success('Symbols uploaded');
                        _.forEach(createdSymbols, function (symbol) {
                            _.remove($scope.symbols, {name: symbol.name})
                        })
                    })
                    .catch(function (response) {
                        Toast.danger('<p><strong>Symbol upload failed</strong></p>' + response.data.message)
                    })
            }
        };
    }
}());