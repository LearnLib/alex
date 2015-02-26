(function () {
    'use strict';

    angular
        .module('weblearner.controller')
        .controller('SymbolsImportController', [
            '$scope', 'SessionService', 'SymbolResource', 'SelectionService',
            SymbolsImportController
        ]);

    function SymbolsImportController($scope, SessionService, SymbolResource, SelectionService) {

        var _project = SessionService.project.get();

        ////////////

        $scope.symbols = {
            web: [],
            rest: []
        };

        ////////////

        $scope.fileLoaded = function (data) {

            var symbols = angular.fromJson(data);

            _.forEach($scope.symbols, function (symbol) {
                symbol.project = _project.id;
            });

            $scope.$apply(function(){
            	$scope.symbols.web = _.filter(symbols, {type: 'web'});
                $scope.symbols.rest = _.filter(symbols, {type: 'rest'});
            });
        };

        $scope.uploadSymbols = function () {

            var selectedWebSymbols = SelectionService.getSelected($scope.symbols.web);
            var selectedRestSymbols = SelectionService.getSelected($scope.symbols.rest);
            var selectedSymbols = selectedWebSymbols.concat(selectedRestSymbols);

            SelectionService.removeSelection(selectedSymbols);
                       
            SymbolResource.create(_project.id, selectedSymbols);
        }
    }
}());