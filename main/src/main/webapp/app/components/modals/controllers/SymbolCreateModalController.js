(function () {
    'use strict';

    angular
        .module('ALEX.modals')
        .controller('SymbolCreateModalController', SymbolCreateModalController);

    SymbolCreateModalController.$inject = [
        '$scope', '$modalInstance', 'modalData', 'Symbol', 'SymbolGroup', 'ToastService'
    ];

    /**
     * Handles the behaviour of the modal to create a new symbol.
     *
     * The template for this modal can found at 'app/partials/modals/symbol-create-modal.html'.
     *
     * @param $scope
     * @param $modalInstance
     * @param modalData
     * @param Symbol
     * @param SymbolGroup
     * @param Toast
     * @constructor
     */
    function SymbolCreateModalController($scope, $modalInstance, modalData, Symbol, SymbolGroup, Toast) {

        // the id of the project the new symbol is created for
        var projectId = null;

        /**
         * The model of the symbol that will be created
         * @type {Symbol}
         */
        $scope.symbol = new Symbol();

        /**
         * An error message that can be displayed in the template
         * @type {String|null}
         */
        $scope.errorMsg = null;

        /**
         * The list of available symbol groups where the new symbol could be created in
         * @type {SymbolGroup[]}
         */
        $scope.groups = [];

        /**
         * The symbol group that is selected
         * @type {null|SymbolGroup}
         */
        $scope.selectedGroup = null;

        // parameter validation &
        // fetch all symbol groups so that they can be selected in the template
        (function init() {
            if (angular.isUndefined(modalData.projectId)) {
                throw new Error('required parameter projectId not defined');
            } else {
                projectId = modalData.projectId;
                SymbolGroup.Resource.getAll(projectId)
                    .then(function (groups) {
                        $scope.groups = groups;
                    });
            }
        }());

        /**
         * Makes a request to the API and create a new symbol. If the name of the group the user entered was not found
         * the symbol will be put in the default group with the id 0. Closes the modal on success.
         */
        $scope.createSymbol = function () {
            $scope.errorMsg = null;

            var group = _.find($scope.groups, {name: $scope.selectedGroup});

            $scope.symbol.group = angular.isDefined(group) ? group.id : 0;

            Symbol.Resource.create(projectId, $scope.symbol)
                .then(function (newSymbol) {
                    Toast.success('Created symbol <strong>' + newSymbol.name + '</strong>');
                    $modalInstance.close(newSymbol);
                })
                .catch(function (response) {
                    $scope.errorMsg = response.data.message
                })
        };

        /** Closes the modal dialog */
        $scope.closeModal = function () {
            $modalInstance.dismiss();
        }
    }
}());