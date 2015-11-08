(function () {
    'use strict';

    angular
        .module('ALEX.controllers')
        .controller('UserEditModalController', UserEditModalController);

    /**
     * The controller for the modal window that handles editing a user.
     * This should only be called by an admin.
     *
     * @param $rootScope
     * @param $scope
     * @param $modalInstance
     * @param modalData
     * @param UserResource
     * @param ToastService
     * @param PromptService
     * @constructor
     */
    // @ngInject
    function UserEditModalController($rootScope, $scope, $modalInstance, modalData, UserResource, ToastService, PromptService) {

        /**
         * The error message in case the update goes wrong
         * @type {null|string}
         */
        $scope.error = null;

        /**
         * The user to edit
         * @type {User}
         */
        $scope.user = modalData.user;

        /** Updates the user on the server and closes the modal window on success */
        $scope.updateUser = function () {
            $scope.error = null;

            UserResource.update($scope.user)
                .then(function () {
                    $rootScope.$emit('user:updated', $scope.user);
                    ToastService.success('User updated successfully');
                    $scope.closeModal();
                }).catch(function (response) {
                    $scope.error = response.data.message;
                })
        };

        /** Deletes a user */
        $scope.deleteUser = function () {
            $scope.error = null;

            PromptService.confirm('Do you want to delete this user permanently?')
                .then(function () {
                    UserResource.remove($scope.user)
                        .then(function () {
                            $rootScope.$emit('user:deleted', $scope.user);
                            ToastService.success('The user has been deleted');
                            $scope.closeModal();
                        })
                        .catch(function (response) {
                            $scope.error = response.data.message;
                        })
                })
        };

        /** Closes the modal window */
        $scope.closeModal = function () {
            $modalInstance.dismiss();
        }
    }
}());