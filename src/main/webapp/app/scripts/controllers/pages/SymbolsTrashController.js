(function () {
    'use strict';

    angular
        .module('weblearner.controller')
        .controller('SymbolsTrashController', [
            '$scope', 'type', 'SessionService', 'SymbolResource', 'SelectionService',
            SymbolsTrashController
        ]);

    /**
     * SymbolsTrashController
     *
     * @param $scope
     * @param type
     * @param SessionService
     * @param SymbolResource
     * @param SelectionService
     * @constructor
     */
    function SymbolsTrashController($scope, type, SessionService, SymbolResource, SelectionService) {

        /**
         * The open project
         */
        $scope.project = SessionService.project.get();

        /**
         * The list of deleted symbols
         * @type {Array}
         */
        $scope.symbols = [];

        /**
         * The type of the symbols
         * @type {String}
         */
        $scope.type = type;

        //////////

        // load all deleted symbols into scope
        SymbolResource.getAll($scope.project.id, {type:type, deleted: true})
            .then(function (symbols) {
                $scope.symbols = symbols;
            });

        //////////

        /**
         * Recover a deleted symbol and remove it from the scope
         * @param {Object} symbol
         */
        $scope.recover = function (symbol) {
            SymbolResource.recover($scope.project.id, symbol.id)
                .then(function () {
                    _.remove($scope.symbols, {id: symbol.id});
                })
        };

        /**
         * Recover the symbols that were selected
         */
        $scope.recoverSelected = function () {
            var selectedSymbols = SelectionService.getSelected($scope.symbols);
            _.forEach(selectedSymbols, $scope.recover)
        }
    }
}());