(function () {
    "use strict";

    angular
        .module('ALEX.core')
        .controller('AdminUsersController', AdminUsersController);

    AdminUsersController.$inject = ['$rootScope', '$scope', 'UserResource', '_'];

    /**
     * The controller for the user management page
     *
     * @param $rootScope
     * @param $scope
     * @param UserResource
     * @param _
     * @constructor
     */
    function AdminUsersController($rootScope, $scope, UserResource, _) {

        /**
         * All registered users
         * @type {User[]}
         */
        $scope.users = [];

        // fetch all users from the server
        UserResource.getAll()
            .then(function (users) {
                $scope.users = users;
            });

        var userUpdatedOffHandler = $rootScope.$on('user:updated', function (evt, user) {
            var i = _.findIndex($scope.users, {id: user.id});
            if (i > -1) {
                $scope.users[i] = user;
            }
        });

        var userDeletedOffHandler = $rootScope.$on('user:deleted', function (evt, user) {
            _.remove($scope.users, {id: user.id});
        });

        // remove events on destroy
        $scope.$on('$destroy', function () {
            userUpdatedOffHandler();
            userDeletedOffHandler();
        })
    }
}());