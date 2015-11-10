(function () {
    "use strict";

    /** The controller for the admin users page */
    // @ngInject
    class AdminUsersController {

        /**
         * Constructor
         * @param $scope
         * @param UserResource
         * @param EventBus
         * @param events
         */
        constructor($scope, UserResource, EventBus, events) {

            /**
             * All registered users
             * @type {User[]}
             */
            this.users = [];

            // fetch all users from the server
            UserResource.getAll().then(users => {
                this.users = users;
            });

            // listen on user updated event
            EventBus.on(events.USER_UPDATED, (evt, data) => {
                const user = data.user;
                const i = this.users.findIndex(u => u.id === user.id);
                if (i > -1) this.users[i] = user;
            }, $scope);

            // listen on user deleted event
            EventBus.on(events.USER_DELETED, (evt, data) => {
                const i = this.users.findIndex(u => u.id === data.user.id);
                if (i > -1) this.users.splice(i, 1);
            }, $scope);
        }
    }

    angular
        .module('ALEX.controllers')
        .controller('AdminUsersController', AdminUsersController);
}());