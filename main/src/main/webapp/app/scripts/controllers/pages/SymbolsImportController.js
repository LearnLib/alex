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

        /**
         * Changes the name and/or the abbreviation a symbol before uploading it to prevent naming conflicts in the
         * database.
         *
         * @param {Symbol} updatedSymbol - The updated symbol
         * @param {Symbol} oldSymbol - The old symbol
         */
        $scope.updateSymbol = function (updatedSymbol, oldSymbol) {
            var symbol;

            // check whether name or abbreviation already exist and don't update symbol
            if (angular.equals(updatedSymbol, oldSymbol)) {
                return
            } else if (updatedSymbol.name !== oldSymbol.name &&
                updatedSymbol.abbreviation === oldSymbol.abbreviation) {
                if (_.where($scope.symbols, {name: updatedSymbol.name}).length > 0) {
                    Toast.danger('Name <strong>' + updatedSymbol.name + '</strong> already exists');
                    return;
                }
            } else if (updatedSymbol.abbreviation !== oldSymbol.abbreviation &&
                updatedSymbol.name === oldSymbol.name) {
                if (_.where($scope.symbols, {abbreviation: updatedSymbol.abbreviation}).length > 0) {
                    Toast.danger('Abbreviation <strong>' + updatedSymbol.abbreviation + '</strong> already exists');
                    return;
                }
            }

            // update symbol in scope
            symbol = _.find($scope.symbols, {name: oldSymbol.name});
            symbol.name = updatedSymbol.name;
            symbol.abbreviation = updatedSymbol.abbreviation;
        }
    }
}());