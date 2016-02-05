/*
 * Copyright 2016 TU Dortmund
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {User} from '../entities/User';

/**
 * The resource to handle actions with users over the API
 */
// @ngInject
class UserResource {

    /**
     * Constructor
     * @param $http
     */
    constructor($http) {
        this.$http = $http;
    }

    /**
     * Changes the password of a user
     *
     * @param {User} user - The user whose password should be changed
     * @param {string} oldPassword - The old password
     * @param {string} newPassword - The new password
     * @returns {*} - A promise
     */
    changePassword(user, oldPassword, newPassword) {
        return this.$http.put(`/rest/users/${user.id}/password`, {
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
    changeEmail(user, email) {
        return this.$http.put(`/rest/users/${user.id}/email`, {
                email: email
            })
            .then(response => new User(response.data));
    }

    /**
     * Gets a single user by its id
     *
     * @param {number} userId - The id of the user to get
     * @returns {*} - A promise
     */
    get(userId) {
        return this.$http.get(`/rest/users/${userId}`)
            .then(response => new User(response.data));
    }

    /**
     * Gets a list of all users. Should only be called by admins.
     *
     * @returns {*} - A promise
     */
    getAll() {
        return this.$http.get('/rest/users')
            .then(response => response.data.map(u => new User(u)));
    }

    /**
     * Creates a new user
     *
     * @param {UserFormModel} user - The user to create
     * @returns {*} - A promise
     */
    create(user) {
        return this.$http.post('/rest/users', user);
    }

    /**
     * Logs in a user
     *
     * @param {User} user - The user to login
     * @returns {*} - A promise that contains the jwt
     */
    login(user) {
        return this.$http.post('/rest/users/login', user);
    }

    /**
     * Removes a user
     *
     * @param {User} user - the user to remove
     * @returns {*} - A promise
     */
    remove(user) {
        return this.$http.delete(`/rest/users/${user.id}`, {});
    }

    /**
     * Gives a registered user admin rights
     *
     * @param {User} user - The user to promote
     * @returns {*}
     */
    promote(user) {
        return this.$http.put(`/rest/users/${user.id}/promote`, {})
            .then(response => new User(response.data));
    }

    /**
     * Takes the admin rights of a user
     *
     * @param {User} user - The user to demote
     * @returns {*}
     */
    demote(user) {
        return this.$http.put(`/rest/users/${user.id}/demote`, {})
            .then(response => new User(response.data));
    }
}

export default UserResource;