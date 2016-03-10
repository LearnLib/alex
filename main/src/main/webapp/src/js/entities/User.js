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

/** The model for user forms */
class UserFormModel {

    /**
     * Constructor
     * @param {string} email - The email of the user
     * @param {string} password - The unencrypted password of the user
     */
    constructor(email = '', password = '') {
        this.email = email;
        this.password = password;
    }
}

/** The model for user api results */
class User {

    /**
     * Constructor
     * @param {object} obj - The object to create a user from
     */
    constructor(obj) {

        /**
         * The id of the user
         * @type {*|number}
         */
        this.id = obj.id;

        /**
         * The role of the user
         * @type {*|string}
         */
        this.role = obj.role;

        /**
         * The email of the user
         * @type {*|string}
         */
        this.email = obj.email;
    }
}

export {UserFormModel, User};