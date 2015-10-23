(function () {
    "use strict";

    angular
        .module('ALEX.core')
        .controller('AdminUsersController', AdminUsersController);

    AdminUsersController.$inject = ['$scope', 'UserResource', '_', 'ToastService', 'PromptService'];

    /**
     * The controller for the user management page
     *
     * @param $scope
     * @param UserResource
     * @param _
     * @param Toast
     * @param PromptService
     * @constructor
     */
    function AdminUsersController($scope, UserResource, _, Toast, PromptService) {

        /**
         * All registered users
         * @type {Array}
         */
        $scope.users = [];

        // fetch all users from the server
        UserResource.getAll()
            .then(function (users) {
                $scope.users = users;
            });

        /**
         * Deletes a user
         * @param user - The user to delete
         */
        $scope.deleteUser = function (user) {
            PromptService.confirm('Do you want to delete this user permanently?')
                .then(function(){
                    UserResource.remove(user)
                        .then(function() {
                            Toast.success('The user has been deleted');
                            _.remove($scope.users, {id: user.id});
                        })
                        .catch(function (response) {
                            Toast.danger('Deletion failed. ' + response.data.message);
                        })
                })
        }
    }
}());