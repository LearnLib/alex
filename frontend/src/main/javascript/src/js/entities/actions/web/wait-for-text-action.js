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
import {Action} from '../action';

/**
 * Action to wait for a text/pattern to be present in an element.
 */
export class WaitForTextAction extends Action {

    /**
     * Constructor.
     *
     * @param {object} obj - The object to create the action from.
     */
    constructor(obj) {
        super(actionType.WAIT_FOR_TEXT, obj);

        /**
         * The css selector of the element.
         * @type {object}
         */
        this.node = obj.node || {selector: 'body', type: 'CSS'};

        /**
         * The piece of text to look for.
         * @type {string}
         */
        this.value = obj.value || '';

        /**
         * Whether the value is a regular expression.
         * @type {*|boolean}
         */
        this.regexp = obj.regexp || false;

        /**
         * The time to wait for the change at max.
         * @type {number}
         */
        this.maxWaitTime = obj.maxWaitTime || 10;
    }

    toString() {
        return `Wait until the text "${this.value}" ${this.regexp ? '(regex)' : ''} is present in element "${this.node.selector}" for a maximum of ${this.maxWaitTime}s.`;
    }
}
