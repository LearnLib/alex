(function () {
    'use strict';

    angular
        .module('ALEX.controllers')
        .controller('SymbolMoveModalController', SymbolMoveModalController);

    /**
     * The controller that handles the moving of symbols into another group.
     *
     * @param $scope
     * @param $modalInstance
     * @param modalData
     * @param Symbol
     * @param SymbolResource
     * @param ToastService
     * @param _
     * @constructor
     */
    // @ngInject
    function SymbolMoveModalController($scope, $modalInstance, modalData, Symbol, SymbolResource, ToastService, _) {

        /**
         * The list of symbols that should be moved
         * @type {Symbol[]}
         */
        $scope.symbols = _.map(modalData.symbols, Symbol.build);

        /**
         * The list of existing symbol groups
         * @type {SymbolGroup[]}
         */
        $scope.groups = modalData.groups;

        /**
         * The symbol group the symbols should be moved into
         * @type {SymbolGroup|null}
         */
        $scope.selectedGroup = null;

        /**
         * Moves the symbols into the selected group by changing the group property of each symbol and then batch
         * updating them on the server
         */
        $scope.moveSymbols = function () {
            if ($scope.selectedGroup !== null) {
                _.forEach($scope.symbols, function (symbol) {
                    delete symbol._selected;
                    symbol.group = $scope.selectedGroup.id;
                });

                SymbolResource.move($scope.symbols, $scope.selectedGroup)
                    .success(function () {
                        ToastService.success('Symbols move to group <strong>' + $scope.selectedGroup.name + '</strong>');
                        $modalInstance.close({
                            symbols: modalData.symbols,
                            group: $scope.selectedGroup
                        });
                    })
                    .catch(function (response) {
                        ToastService.danger('<p><strong>Moving symbols failed</strong></p>' + response.data.message);
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

        /**
         * Close the modal dialog
         */
        $scope.closeModal = function () {
            $modalInstance.dismiss();
        }
    }
}());