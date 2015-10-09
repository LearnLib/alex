(function () {
    "use strict";

    angular
        .module('ALEX.core')
        .controller('UserSettingsController', UserSettingsController);

    UserSettingsController.$inject = ['$scope', '$state', 'UserResource', 'SessionService', 'ToastService', 'PromptService'];

    /**
     * The main controller for the page users settings page
     *
     * @param $scope
     * @param $state
     * @param UserResource
     * @param Session
     * @param Toast
     * @param Prompt
     * @constructor
     */
    function UserSettingsController($scope, $state, UserResource, Session, Toast, Prompt) {

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

        /**
         * Deletes the profile of the user. Redirects to the start page on success.
         */
        $scope.deleteUser = function () {
            Prompt.confirm("Do you really want to delete this profile? All data will be permanently deleted.")
                .then(function () {
                    UserResource.remove($scope.user)
                        .then(function () {
                            Toast.success("Your profile has been deleted");

                            // remove the users jwt so that he cannot do anything after being deleted
                            Session.user.remove();
                            $state.go('home');
                        })
                        .catch(function (response) {
                            Toast.danger("Your profile could not be deleted. " + response.data.message);
                        })
                });
        }
    }
}());