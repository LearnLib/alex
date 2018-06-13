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

import {actionType} from '../../../constants';
import {Action} from '../action';

/**
 * Action to check if the value of a variable equals or matches a specific string value.
 */
export class AssertVariableAction extends Action {

    /**
     * Constructor.
     *
     * @param {object} obj - The object to create the action from.
     */
    constructor(obj) {
        super(actionType.GENERAL_ASSERT_VARIABLE, obj);

        /**
         * The name of the variable.
         * @type {*|string}
         */
        this.name = obj.name || '';

        /**
         * The value to assert against.
         * @type {*|string}
         */
        this.value = obj.value || '';

        /**
         * If value is a regular expression.
         * @type {*|boolean}
         */
        this.regexp = obj.regexp || false;
    }

    /**
     * A string representation of the action.
     *
     * @returns {string}
     */
    toString() {
        if (this.regexp) {
            return 'Assert variable "' + this.name + '" to match "' + this.value + '"';
        } else {
            return 'Assert variable "' + this.name + '" to equal "' + this.value + '"';
        }
    }
}
