(function () {
    'use strict';

    angular
        .module('weblearner.controller')
        .controller('SymbolsHistoryController', SymbolsHistoryController);

    SymbolsHistoryController.$inject = ['$scope', '$stateParams', 'Symbol', 'SessionService', 'ToastService'];

    /**
     * @param $scope - The controllers scope
     * @param $stateParams - The ui.router $stateParams service
     * @param Symbol - The factory for the Symbol model
     * @param Session - The SessionService
     * @param Toast - The ToastService
     * @constructor
     */
    function SymbolsHistoryController($scope, $stateParams, Symbol, Session, Toast) {

        // The project in the session
        var project = Session.project.get();

        /**
         * All revisions of a symbol
         * @type {Symbol[]}
         */
        $scope.revisions = [];

        /**
         * The most current version of a symbol
         * @type {Symbol}
         */
        $scope.latestRevision = null;

        // init controller
        (function init() {

            // load all revisions of the symbol whose id is passed in the URL
            if (angular.isDefined($stateParams.symbolId)) {
                Symbol.Resource.getRevisions(project.id, $stateParams.symbolId)
                    .then(function (revisions) {
                        $scope.latestRevision = revisions[revisions.length - 1];
                        $scope.revisions = revisions;
                    })
                    .catch(function () {
                        // TODO: go to error page
                    })
            } else {
                // TODO: go to error page
            }
        }());

        /**
         * Restores a previous revision of a symbol by updating the latest with the properties of the revision
         *
         * @param {Symbol} revision - The revision of the symbol that should be restored
         */
        $scope.restoreRevision = function (revision) {
            var symbol = $scope.latestRevision.copy();

            // copy all important properties from the revision to the latest
            symbol.name = revision.name;
            symbol.abbreviation = revision.abbreviation;
            symbol.actions = revision.actions;

            // update symbol with new properties
            Symbol.Resource.update(project.id, symbol)
                .then(function (updatedSymbol) {
                    Toast.success('Updated symbol to revision <strong>' + revision.revision + '</strong>');
                    $scope.revisions.push(updatedSymbol);
                    $scope.latestRevision = updatedSymbol;
                })
                .catch(function (response) {
                    Toast.danger('<p><strong>Update to revision failed</strong></p>' + response.data.message);
                })
        }
    }
}());