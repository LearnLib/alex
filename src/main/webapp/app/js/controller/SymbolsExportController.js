(function () {
    'use strict';

    angular
        .module('weblearner.controller')
        .controller('SymbolsExportController', [
            '$scope', 'SessionService', 'SymbolResource', 'SelectionService',
            SymbolsExportController
        ]);

    function SymbolsExportController($scope, SessionService, SymbolResource, SelectionService) {

        var _project = SessionService.project.get();
        var _fileName = 'symbols-project-' + _project.id + '.json';

        //////////

        $scope.symbols = {
            web: [],
            rest: []
        };

        //////////

        SymbolResource.all(_project.id)
            .then(function (symbols) {
                $scope.symbols.web = _.filter(symbols, {type: 'web'});
                $scope.symbols.rest = _.filter(symbols, {type: 'rest'});
            });

        //////////

        $scope.getSelectedSymbols = function () {

            var selectedWebSymbols = SelectionService.getSelected($scope.symbols.web);
            var selectedRestSymbols = SelectionService.getSelected($scope.symbols.rest);
            var selectedSymbols = selectedWebSymbols.concat(selectedRestSymbols);

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