(function () {
    "use strict";

    angular
        .module('ALEX.core')
        .controller('UserSettingsController', UserSettingsController);

    UserSettingsController.$inject = ['$scope', 'UserResource', 'SessionService'];

    /**
     * The main controller for the page users settings page
     *
     * @param $scope
     * @param UserResource
     * @param Session
     * @constructor
     */
    function UserSettingsController($scope, UserResource, Session) {

        // the user from the jwt
        var user = Session.user.get();

        /**
         * The user to edit
         * @type {null}
         */
        $scope.user = null;

        // fetch the user from the api
        UserResource.get(user.id)
            .then(function (user) {
                $scope.user = user;
            });
    }
}());