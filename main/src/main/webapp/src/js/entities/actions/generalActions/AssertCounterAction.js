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

import {Action} from '../Action';
import {actionType} from '../../../constants';

/** Action to compare the value of a counter to another integer value */
export class AssertCounterAction extends Action {

    /**
     * Constructor
     * @param {object} obj - The object to create the action from
     */
    constructor(obj) {
        super(actionType.GENERAL_ASSERT_COUNTER, obj);

        /**
         * The name of the counter
         * @type {*|string}
         */
        this.name = obj.name || '';

        /**
         * The value to compare the content with
         * @type {*|string}
         */
        this.value = obj.value || '';

        /**
         * The operator to compare two integer values
         * @type {*|string}
         */
        this.operator = obj.operator || 'EQUAL';
    }

    /**
     * A string presentation of the actions
     * @returns {string}
     */
    toString() {
        let s;

        switch (this.operator) {
            case 'LESS_THAN':
                s = 'less than';
                break;
            case 'LESS_OR_EQUAL':
                s = 'less or equal to';
                break;
            case 'EQUAL':
                s = 'equal to';
                break;
            case 'GREATER_OR_EQUAL':
                s = 'greater or equal to';
                break;
            case 'GREATER_THAN':
                s = 'greater than';
                break;
            default:
                s = 'undefined';
                break;
        }

        return 'Check if counter "' + this.name + '" is ' + s + ' ' + this.value;
    }
}