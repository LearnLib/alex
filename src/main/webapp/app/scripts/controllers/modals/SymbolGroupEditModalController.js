(function () {
    'use strict';

    angular
        .module('weblearner.controller')
        .controller('SymbolGroupEditModalController', SymbolGroupEditModalController);

    SymbolGroupEditModalController.$inject = [
        '$scope', '$modalInstance', 'modalData', 'SymbolGroup', 'ToastService'
    ];

    /**
     * The controller that handles the modal dialog for deleting and updating a symbol group. The modal data that is
     * passed must have an property 'group' whose value should be an instance of SymbolGroup
     *
     * The template is at 'views/modals/symbol-group-edit-modal.html'
     *
     * @param $scope
     * @param $modalInstance
     * @param modalData - The data that is passed to this controller
     * @param SymbolGroup
     * @param Toast - The ToastService
     * @constructor
     */
    function SymbolGroupEditModalController($scope, $modalInstance, modalData, SymbolGroup, Toast) {

        /**
         * The symbol group that should be edited
         * @type {null|SymbolGroup}
         */
        $scope.group = null;

        /**
         * An error message that can be displayed in the template
         * @type {null|String}
         */
        $scope.errorMsg = null;

        (function init() {
            if (angular.isDefined(modalData.group) && modalData.group instanceof SymbolGroup) {
                $scope.group = modalData.group.copy();
            } else {
                throw new Error('Wrong parameter type');
            }
        }());

        /**
         * Updates the symbol group under edit and closes the modal dialog on success
         */
        $scope.updateGroup = function () {
            $scope.errorMsg = null;

            SymbolGroup.Resource.update($scope.group.project, $scope.group)
                .then(function (updatedGroup) {
                    Toast.success('Group updated');
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

            SymbolGroup.Resource.delete($scope.group.project, $scope.group)
                .then(function () {
                    Toast.success('Group <strong>' + $scope.group.name + '</strong> deleted');
                    $modalInstance.close({
                        status: 'deleted',
                        group: $scope.group
                    });
                })
                .catch(function (response) {
                    $scope.errorMsg = response.data.message;
                })
        };

        /** Closes the modal dialog */
        $scope.closeModal = function () {
            $modalInstance.dismiss();
        }
    }
}());