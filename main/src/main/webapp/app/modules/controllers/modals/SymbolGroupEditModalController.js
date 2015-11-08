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
     * @param SymbolGroup
     * @param SymbolGroupResource
     * @param ToastService - The ToastService
     * @constructor
     */
    // @ngInject
    function SymbolGroupEditModalController($scope, $modalInstance, modalData, SymbolGroup, SymbolGroupResource, ToastService) {

        /**
         * The symbol group that should be edited
         * @type {SymbolGroup}
         */
        $scope.group = SymbolGroup.build(modalData.group);

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
                    $modalInstance.close({
                        status: 'updated',
                        newGroup: updatedGroup,
                        oldGroup: modalData.group
                    });
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
                    $modalInstance.close({
                        status: 'deleted',
                        group: $scope.group
                    });
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