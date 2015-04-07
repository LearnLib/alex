(function () {
    'use strict';

    angular
        .module('ALEX.controller')
        .controller('SymbolMoveModalController', SymbolMoveModalController);

    SymbolMoveModalController.$inject = [
        '$scope', '$modalInstance', 'modalData', 'Symbol', 'SelectionService', 'ToastService'
    ];

    /**
     * The controller that handles the moving of symbols into another group.
     *
     * The template can be found at 'views/modals/symbol-move-modal.html'
     *
     * @param $scope
     * @param $modalInstance
     * @param modalData
     * @param Symbol
     * @param SelectionService
     * @param Toast
     * @constructor
     */
    function SymbolMoveModalController($scope, $modalInstance, modalData, Symbol, SelectionService, Toast) {

        /**
         * The list of symbols that should be moved
         * @type {Symbol[]}
         */
        $scope.symbols = [];

        /**
         * The list of existing symbol groups
         * @type {SymbolGroup[]}
         */
        $scope.groups = [];

        /**
         * The symbol group the symbols should be moved into
         * @type {SymbolGroup|null}
         */
        $scope.selectedGroup = null;

        // some checking if required parameters are given
        (function init() {
            if (angular.isDefined(modalData.groups) && angular.isDefined(modalData.symbols)) {
                $scope.symbols = angular.copy(modalData.symbols);
                $scope.groups = angular.copy(modalData.groups);
            } else {
                throw new Error('Missing data');
            }
        }());

        /**
         * Moves the symbols into the selected group by changing the group property of each symbol and then batch
         * updating them on the server
         */
        $scope.moveSymbols = function () {
            if ($scope.selectedGroup !== null) {
                _.forEach($scope.symbols, function (symbol) {
                    SelectionService.removeSelection(symbol);
                    symbol.group = $scope.selectedGroup.id;
                });
                Symbol.Resource.moveSome($scope.selectedGroup.project, $scope.symbols, $scope.selectedGroup.id)
                    .then(function () {
                        Toast.success('Symbols move to group <strong>' + $scope.selectedGroup.name + '</strong>');
                        $modalInstance.close({
                            symbols: modalData.symbols,
                            group: $scope.selectedGroup
                        });
                    })
                    .catch(function (response) {
                        Toast.danger('<p><strong>Moving symbols failed</strong></p>' + response.data.message);
                    })
            }
        };

        /**
         * Selects the group where the symbols should be moved into
         *
         * @param {SymbolGroup} group
         */
        $scope.selectGroup = function (group) {
            $scope.selectedGroup = $scope.selectedGroup === group ? null : group;
        };

        /** Close the modal dialog */
        $scope.closeModal = function () {
            $modalInstance.dismiss();
        }
    }
}());