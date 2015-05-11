(function () {
    'use strict';

    angular
        .module('ALEX.controller')
        .controller('SymbolsExportController', SymbolsExportController);

    SymbolsExportController.$inject = ['$scope', 'SessionService', 'SymbolGroup', 'actionTypes', '_'];

    /**
     * The controller that handles the export of symbols. The corresponding template is at
     * 'views/pages/symbols-export.html'.
     *
     * @param $scope
     * @param Session
     * @param SymbolGroup
     * @param actionTypes
     * @param _
     * @constructor
     */
    function SymbolsExportController($scope, Session, SymbolGroup, actionTypes, _) {

        // the project that is saved in session storage
        var _project = Session.project.get();

        /**
         * The symbol groups that belong to the opened project
         * @type {SymbolGroup[]}
         */
        $scope.groups = [];

        /**
         * All symbols from all symbol groups
         * @type {Symbol[]}
         */
        $scope.allSymbols = [];

        // fetch symbol groups from API
        // extract all symbols
        SymbolGroup.Resource.getAll(_project.id, {embedSymbols: true})
            .then(function (groups) {
                $scope.groups = groups;
                $scope.allSymbols = _.flatten(_.pluck($scope.groups, 'symbols'));
            });

        /**
         * Deletes all properties that are not needed for downloading symbols which are the id, revision, project, group
         * and hidden properties. They are removed so that they can later be uploaded and created like new symbols.
         *
         * @returns {*} - The list of downloadable symbols without unneeded properties
         */
        $scope.getDownloadableSymbols = function () {
            var symbols = _(angular.copy($scope.allSymbols))
                .filter('_selected')
                .sortBy(function (n) {
                    return n.id;
                })
                .map(function (n) {
                    delete n._selected;
                    n.revision = 1;
                    return n;
                }).value();

            _.forEach(symbols, function (symbol) {
                delete symbol.revision;
                delete symbol.project;
                delete symbol.group;
                delete symbol.hidden;
                delete symbol.id;
                _.forEach(symbol.actions, function (action) {
                    if (action.type === actionTypes.EXECUTE_SYMBOL) {
                        action.symbolToExecute.revision = 1;
                    }
                })
            });
            return symbols;
        };
    }
}());