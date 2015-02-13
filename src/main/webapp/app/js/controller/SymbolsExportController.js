(function () {
    'use strict';

    angular
        .module('weblearner.controller')
        .controller('SymbolsExportController', [
            '$scope', '$filter', 'SessionService', 'SymbolResource', 'SelectionService',
            SymbolsExportController
        ]);

    function SymbolsExportController($scope, $filter, SessionService, SymbolResource, SelectionService) {

        var _project = SessionService.project.get();

        //////////

        $scope.symbols = {
    		web: [], rest: []
        };

        //////////
        
        SymbolResource.getAll(_project.id)
            .then(function (symbols) {
            	$scope.symbols.web = $filter('typeOfWeb')(symbols);
            	$scope.symbols.rest = $filter('typeOfRest')(symbols);
            });

        //////////

        $scope.getSelectedSymbols = function () {
            var symbols = $scope.symbols.web.concat($scope.symbols.rest);
            var selectedSymbols = SelectionService.getSelected(symbols);
            SelectionService.removeSelection(selectedSymbols);
            _.forEach(selectedSymbols, function (symbol) {
                delete symbol.id;
                delete symbol.revision;
                delete symbol.project;
            });
            return selectedSymbols;
        };
    }
}());