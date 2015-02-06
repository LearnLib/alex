(function () {
    'use strict';

    angular
        .module('weblearner.controller')
        .controller('SymbolExportController', [
            '$scope', 'SessionService', 'SymbolResource', 'SelectionService',
            SymbolExportController
        ]);

    function SymbolExportController($scope, SessionService, SymbolResource, SelectionService) {

        var _project = SessionService.project.get();
        var _fileName = 'symbols-project-' + _project.id + '.json';

        //////////

        $scope.symbols = [];

        //////////

        SymbolResource.all(_project.id)
            .then(function (symbols) {
                $scope.symbols = symbols;
            });
        
        //////////
        
        $scope.getSelectedSymbols = function() {
        	var selectedSymbols = SelectionService.getSelected($scope.symbols);
        	SelectionService.removeSelection(selectedSymbols);
        	return selectedSymbols;
        }
    }
}());