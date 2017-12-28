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

import {actionType} from '../../../constants';
import {Action} from '../Action';

/**
 * Action that, given a regular expression, searches in the page source for matches.
 * If a match is found, it extracts the nth group, e.g. (.*?) in the regex, and saves the value into a variable.
 */
export class SetVariableByRegexGroup extends Action {

    /**
     * Constructor.
     *
     * @param {object} obj - The object to create the action from.
     */
    constructor(obj) {
        super(actionType.GENERAL_SET_VARIABLE_BY_REGEX_GROUP, obj);

        /**
         * The name of the variable.
         * @type {string}
         */
        this.name = obj.name || '';

        /**
         * The regex.
         * @type {string}
         */
        this.regex = obj.regex || '';

        /**
         * Which match should be used.
         * @type {number}
         */
        this.nthMatch = typeof obj.nthMatch !== 'undefined' ? obj.nthMatch : 1;

        /**
         * Which group in the match should be used.
         * @type {number}
         */
        this.mthGroup = typeof obj.mthGroup !== 'undefined' ? obj.mthGroup : 0;
    }

    /**
     * A string representation of the action.
     *
     * @returns {string}
     */
    toString() {
        return `Set variable '${this.name}' to the ${this.mthGroup}. group in the ${this.nthMatch}. match of '${this.regex}'`;
    }
}
