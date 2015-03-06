(function () {
    'use strict';

    angular
        .module('weblearner.controller')
        .controller('SymbolsImportController', SymbolsImportController);

    SymbolsImportController.$inject = ['$scope', 'SessionService', 'Symbol', 'SelectionService', '_'];

    /**
     * Handles the import of symbols from a *.json file. The corresponding template for this controller is at
     * 'views/pages/symbols-import.html'
     *
     * @param $scope
     * @param Session
     * @param Symbol
     * @param SelectionService
     * @param _
     * @constructor
     */
    function SymbolsImportController($scope, Session, Symbol, SelectionService, _) {

        // The project that is saved in the sessionStorage
        var _project = Session.project.get();

        /**
         * The symbols that will be uploaded
         *
         * @type {Symbol[]}
         */
        $scope.symbols = [];

        /**
         * Creates instances of Symbols from the json string from the *.json file and puts them in the scope
         *
         * @param data - The json string of loaded symbols
         */
        $scope.fileLoaded = function (data) {
            try {
                var symbols = angular.fromJson(data);
                $scope.$apply(function () {
                    $scope.symbols = $scope.symbols.concat(symbols);
                });
            } catch(e) {
                console.error(e);
            }
        };

        /**
         * Makes an API request in order to create the selected symbols. Removes successfully created symbols from the
         * scope
         */
        $scope.uploadSelectedSymbols = function () {
            var selectedSymbols = angular.copy(SelectionService.getSelected($scope.symbols));
            if (selectedSymbols.length > 0) {
                SelectionService.removeSelection(selectedSymbols);
                Symbol.Resource.createSome(_project.id, selectedSymbols)
                    .then(function (createdSymbols) {
                        _.forEach(createdSymbols, function (symbol) {
                            _.remove($scope.symbols, {name: symbol.name})
                        })
                    })
            }
        };
    }
}());