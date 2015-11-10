(function () {
    'use strict';

    angular
        .module('ALEX.controllers')
        .controller('SymbolCreateModalController', SymbolCreateModalController);

    /**
     * Handles the behaviour of the modal to create a new symbol.
     *
     * @param $scope
     * @param $modalInstance
     * @param SessionService
     * @param Symbol
     * @param SymbolResource
     * @param SymbolGroupResource
     * @param ToastService
     * @param EventBus
     * @param events
     * @constructor
     */
    // @ngInject
    function SymbolCreateModalController($scope, $modalInstance, SessionService, Symbol, SymbolResource,
                                         SymbolGroupResource, ToastService, EventBus, events) {

        // the id of the project the new symbol is created for
        const project = SessionService.project.get();

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

        // fetch all symbol groups so that they can be selected in the template
        SymbolGroupResource.getAll(project.id).then(groups => {
            $scope.groups = groups;
        });

        /**
         * Makes a request to the API and create a new symbol. If the name of the group the user entered was not found
         * the symbol will be put in the default group with the id 0. Closes the modal on success.
         */
        $scope.createSymbol = function () {
            $scope.errorMsg = null;

            const group = _.find($scope.groups, {name: $scope.selectedGroup});

            // attach the new symbol to the default group in case none is specified
            $scope.symbol.group = angular.isDefined(group) ? group.id : 0;

            SymbolResource.create(project.id, $scope.symbol)
                .then(createdSymbol => {
                    ToastService.success('Created symbol <strong>' + createdSymbol.name + '</strong>');
                    EventBus.emit(events.SYMBOL_CREATED, {symbol: createdSymbol});
                    $modalInstance.dismiss();
                })
                .catch(response => {
                    $scope.errorMsg = response.data.message;
                })
        };

        /** Closes the modal dialog */
        $scope.closeModal = function () {
            $modalInstance.dismiss();
        }
    }
}());