(function () {
    'use strict';

    angular
        .module('ALEX.controllers')
        .controller('SymbolGroupEditModalController', SymbolGroupEditModalController);

    /**
     * The controller that handles the modal dialog for deleting and updating a symbol group. The modal data that is
     * passed must have an property 'group' whose value should be an instance of SymbolGroup
     *
     * @param $scope
     * @param $modalInstance
     * @param modalData - The data that is passed to this controller
     * @param SymbolGroupResource
     * @param ToastService - The ToastService
     * @param events - The applications events
     * @param EventBus
     * @constructor
     */
    // @ngInject
    function SymbolGroupEditModalController($scope, $modalInstance, modalData, SymbolGroupResource, ToastService, events, EventBus) {

        /**
         * The symbol group that should be edited
         * @type {SymbolGroup}
         */
        $scope.group = modalData.group;

        /**
         * An error message that can be displayed in the template
         * @type {null|String}
         */
        $scope.errorMsg = null;

        /**
         * Updates the symbol group under edit and closes the modal dialog on success
         */
        $scope.updateGroup = function () {
            $scope.errorMsg = null;

            SymbolGroupResource.update($scope.group)
                .then(function (updatedGroup) {
                    ToastService.success('Group updated');
                    EventBus.emit(events.GROUP_UPDATED, {
                        group: updatedGroup
                    });
                    $modalInstance.dismiss();
                })
                .catch(function (response) {
                    $scope.errorMsg = response.data.message;
                })
        };

        /**
         * Deletes the symbol group under edit and closes the modal dialog on success
         */
        $scope.deleteGroup = function () {
            $scope.errorMsg = null;

            SymbolGroupResource.delete($scope.group)
                .then(function () {
                    ToastService.success('Group <strong>' + $scope.group.name + '</strong> deleted');
                    EventBus.emit(events.GROUP_DELETED, {
                        group: $scope.group
                    });
                    $modalInstance.dismiss();
                })
                .catch(function (response) {
                    $scope.errorMsg = response.data.message;
                })
        };

        /**
         * Closes the modal dialog
         */
        $scope.closeModal = function () {
            $modalInstance.dismiss();
        }
    }
}());