(function () {
    'use strict';

    angular
        .module('ALEX.core')
        .controller('SymbolsExportController', SymbolsExportController);

    SymbolsExportController.$inject = [
        '$scope', 'SessionService', 'SymbolGroupResource', 'actionTypes', 'actionGroupTypes', '_'
    ];

    /**
     * The controller that handles the export of symbols.
     *
     * Template: 'views/symbols-export.html'.
     *
     * @param $scope - The controllers scope
     * @param Session - The SessionService
     * @param SymbolGroupResource - The SymbolGroup API Resource handler
     * @param actionTypes - The dictionary for action types
     * @param actionGroupTypes - The enum for action group types
     * @param _ - Lodash
     * @constructor
     */
    function SymbolsExportController($scope, Session, SymbolGroupResource, actionTypes, actionGroupTypes, _) {

        // the project that is saved in session storage
        var project = Session.project.get();

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
        (function init() {
            SymbolGroupResource.getAll(project.id, {embedSymbols: true})
                .then(function (groups) {
                    $scope.groups = groups;
                    $scope.allSymbols = _.flatten(_.pluck($scope.groups, 'symbols'));
                });
        }());

        /**
         * Deletes all properties that are not needed for downloading symbols which are the id, revision, project, group
         * and hidden properties. They are removed so that they can later be uploaded and created like new symbols.
         *
         * @returns {*} - The list of downloadable symbols without unneeded properties
         */
        $scope.getDownloadableSymbols = function () {
            var symbols = _(angular.copy($scope.allSymbols))
                .filter('_selected')
                .sortBy(function (symbol) {
                    return symbol.id;
                }).value();

            _.forEach(symbols, function (symbol) {
                _.forEach(symbol.actions, function (action) {
                    if (action.type === actionTypes[actionGroupTypes.GENERAL].EXECUTE_SYMBOL) {
                        action.symbolToExecute.revision = 1;
                        _.forEach(symbols, function (s, j) {
                            if (s.id === action.symbolToExecute.id) {
                                action.symbolToExecute.id = j + 1;
                            }
                        })
                    }
                });
                delete symbol._selected;
                delete symbol._collapsed;
                delete symbol.revision;
                delete symbol.project;
                delete symbol.group;
                delete symbol.hidden;
                delete symbol.id;
            });

            return symbols;
        };
    }
}());