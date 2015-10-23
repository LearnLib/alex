(function () {
    'use strict';

    angular
        .module('ALEX.core')
        .factory('UserResource', UserResource);

    UserResource.$inject = ['$http', 'paths'];

    /**
     * The resource to handle actions with users over the API
     *
     * @param $http
     * @param paths
     * @returns {{getAll: getAll, get: get, create: create, login: login, remove: remove, update: update,
     *            changePassword: changePassword, changeEmail: changeEmail}}
     * @constructor
     */
    function UserResource($http, paths) {
        var uri = paths.api.URL + '/users';

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
            return $http.put(uri + '/' + user.id + '/password', {
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
            return $http.put(uri + '/' + user.id + '/email', {
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
            return $http.get(uri + '/' + userId)
                .then(function (response) {
                    return response.data;
                })
        }

        /**
         * Gets a list of all users. Should only be called by admins.
         *
         * @returns {*} - A promise
         */
        function getAll() {
            return $http.get(uri)
                .then(function (response) {
                    return response.data;
                })
        }

        /**
         * Creates a new user
         *
         * @param {User} user - The user to create
         * @returns {*} - A promise
         */
        function create(user) {
            return $http.post(uri, user);
        }

        /**
         * Logs in a user
         *
         * @param {User} user - The user to login
         * @returns {*} - A promise that contains the jwt
         */
        function login(user) {
            return $http.post(uri + '/login', user);
        }

        /**
         * Removes a user
         *
         * @param {User} user - the user to remove
         * @returns {*} - A promise
         */
        function remove(user) {
            return $http.delete(uri + '/' + user.id, {});
        }

        /**
         * Updates a user. Should only be called by admins.
         *
         * @param {User} user - The user to update
         * @returns {*} - A promise that contains the updated user
         */
        function update(user) {
            return $http.put(uri + '/' + user.id, user)
                .then(function (response) {
                    return response.data;
                })
        }
    }
}());