/*
 * Copyright 2018 TU Dortmund
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

/**
 * The action model all other actions should extend from.
 */
export class Action {

    /**
     * Constructor.
     *
     * @param {string} type - The type of the action.
     * @param {object} obj - The object to create an action from.
     */
    constructor(type, obj) {

        /**
         * The ID of the action in the DB:
         * @type {?number}
         */
        this.id = obj.id == null ? null : obj.id;

        /**
         * The unique action type.
         * @type {String}
         */
        this.type = type || '';
    }

    /**
     * Get a string representation of the action.
     * @returns {string}
     */
    toString() {
        return 'There is no string representation available for type "' + this.type + '"';
    }
}
