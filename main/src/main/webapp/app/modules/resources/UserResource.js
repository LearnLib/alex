(function () {
    'use strict';

    angular
        .module('ALEX.resources')
        .factory('UserResource', UserResource);

    /**
     * The resource to handle actions with users over the API
     *
     * @param $http
     * @param User
     * @returns {{getAll: getAll, get: get, create: create, login: login, remove: remove, update: update,
     *            changePassword: changePassword, changeEmail: changeEmail}}
     * @constructor
     */
    // @ngInject
    function UserResource($http, User) {
        return {
            getAll: getAll,
            get: get,
            create: create,
            login: login,
            remove: remove,
            update: update,
            changePassword: changePassword,
            changeEmail: changeEmail
        };

        /**
         * Changes the password of a user
         *
         * @param {User} user - The user whose password should be changed
         * @param {string} oldPassword - The old password
         * @param {string} newPassword - The new password
         * @returns {*} - A promise
         */
        function changePassword(user, oldPassword, newPassword) {
            return $http.put('/rest/users/' + user.id + '/password', {
                oldPassword: oldPassword,
                newPassword: newPassword
            });
        }

        /**
         * Changes the email of a user
         *
         * @param {User} user - The user whose email should be changed
         * @param {string} email - The new email
         * @returns {*} - A promise
         */
        function changeEmail(user, email) {
            return $http.put('/rest/users/' + user.id + '/email', {
                email: email
            });
        }

        /**
         * Gets a single user by its id
         *
         * @param {number} userId - The id of the user to get
         * @returns {*} - A promise
         */
        function get(userId) {
            return $http.get('/rest/users/' + userId)
                .then(response => new User(response.data));
        }

        /**
         * Gets a list of all users. Should only be called by admins.
         *
         * @returns {*} - A promise
         */
        function getAll() {
            return $http.get('/rest/users')
                .then(response => response.data.map(u => new User(u)))
        }

        /**
         * Creates a new user
         *
         * @param {UserFormModel} user - The user to create
         * @returns {*} - A promise
         */
        function create(user) {
            return $http.post('/rest/users', user);
        }

        /**
         * Logs in a user
         *
         * @param {User} user - The user to login
         * @returns {*} - A promise that contains the jwt
         */
        function login(user) {
            return $http.post('/rest/users/login', user);
        }

        /**
         * Removes a user
         *
         * @param {User} user - the user to remove
         * @returns {*} - A promise
         */
        function remove(user) {
            return $http.delete('/rest/users/' + user.id, {});
        }

        /**
         * Updates a user. Should only be called by admins.
         *
         * @param {User} user - The user to update
         * @returns {*} - A promise that contains the updated user
         */
        function update(user) {
            return $http.put('/rest/users/' + user.id, user)
                .then(response => new User(response.data))
        }
    }
}());