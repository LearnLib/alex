(function () {
    'use strict';

    angular
        .module('weblearner.controller')
        .controller('SymbolUploadController', [
            '$scope', 'SessionService', 'SymbolResource', 'SelectionService',
            SymbolUploadController
        ]);

    function SymbolUploadController($scope, SessionService, SymbolResource, SelectionService) {

        var _project = SessionService.project.get();

        ////////////

        $scope.symbols = [];

        ////////////

        $scope.fileLoaded = function(data) {
            $scope.symbols = data;
            _.forEach($scope.symbols, function(symbol){
                symbol.project = _project.id;
            })
        };

        $scope.createSymbols = function() {
            var selectedSymbols = SelectionService.getSelected($scope.symbols);
            SelectionService.removeSelection(selectedSymbols);
            if (selectedSymbols.length > 1) {
                _.forEach(selectedSymbols, function(symbol){
                    SymbolResource.create(symbol);
                })
            }
        }
    }
}());