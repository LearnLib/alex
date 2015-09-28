(function () {
    "use strict";

    angular
        .module('ALEX.core')
        .controller('AdminUsersController', AdminUsersController);

    AdminUsersController.$inject = ['$scope', 'UserResource', '_', 'ToastService'];

    function AdminUsersController($scope, UserResource, _, Toast) {
        $scope.users = [];

        UserResource.getAll()
            .then(function (users) {
                $scope.users = users;
                console.log($scope.users);
            });

        $scope.deleteUser = function (user) {
            UserResource.remove(user)
                .then(function () {
                    Toast.success('The user has been deleted');
                    _.remove($scope.users, {id: user.id});
                })
                .catch(function (response) {
                    Toast.danger('Deletion failed. ' + response.data.message);
                })
        }
    }
}());