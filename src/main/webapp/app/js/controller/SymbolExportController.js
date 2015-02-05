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

        $scope.downloadSymbols = function () {

            var symbolsToDownload = angular.copy(SelectionService.getSelected($scope.symbols));
            SelectionService.removeSelection(symbolsToDownload);

            _.forEach(symbolsToDownload, function (symbol) {
                delete symbol.id;
                delete symbol.project;
                delete symbol.revision;
            })

            if (symbolsToDownload.length > 0) {
                var a = document.createElement('a');
                a.setAttribute('href', window.URL.createObjectURL(new Blob([angular.toJson(symbolsToDownload)], {type: 'text/json'})));
                a.setAttribute('target', '_blank');
                a.setAttribute('download', _fileName);
                a.click();
            }
        }
    }
}());