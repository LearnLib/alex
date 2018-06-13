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
 * Searches for a piece of text or a regular expression in the HTML document.
 */
export class CheckForTextWebAction extends Action {

    /**
     * Constructor.
     *
     * @param {object} obj - The object to create the action from.
     */
    constructor(obj) {
        super(actionType.WEB_CHECK_TEXT, obj);

        /**
         * The piece of text to look for.
         * @type {*|string}
         */
        this.value = obj.value || '';

        /**
         * Whether the value is a regular expression.
         * @type {*|boolean}
         */
        this.regexp = obj.regexp || false;

        /**
         * The target node to look for the text.
         * @type {{selector: string, type: string}}
         */
        this.node = obj.node || {selector: 'document', type: 'CSS'};
    }

    /**
     * A string representation of the action.
     *
     * @returns {string}
     */
    toString() {
        if (this.regexp) {
            return `Check if the source of element "${this.node.selector}" matches ${this.value}`;
        } else {
            const text = this.node.selector === 'document' ? 'the document' : `the element "${this.node.selector}"`;
            return `Search for text "${this.value}" in ${text}`;
        }
    }
}
