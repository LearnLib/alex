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

/** The action model all other actions should extend from */
class Action {

    /**
     * Constructor
     * @param {string} type - The type of the action
     * @param {object} obj - The object to create an action from
     */
    constructor(type, obj) {

        /**
         * The unique action type
         * @type {String}
         */
        this.type = type || '';

        /**
         * Whether the outcome is negated
         * @type {boolean}
         */
        this.negated = obj.negated || false;

        /**
         * Whether the learner continues despite failure
         * @type {boolean}
         */
        this.ignoreFailure = obj.ignoreFailure || false;

        /**
         * Whether the execution of the action should be skipped
         * @type {boolean}
         */
        this.disabled = obj.disabled || false;
    }

    /**
     * Get a string representation of the action
     * @returns {string}
     */
    toString() {
        return 'There is no string representation available for type "' + this.type + '"';
    }
}

export default Action;