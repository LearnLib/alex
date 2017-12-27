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
 * Selects an entry from a select box.
 */
export class SelectWebAction extends Action {

    /**
     * Constructor.
     *
     * @param {object} obj - The object to create the action from.
     */
    constructor(obj) {
        super(actionType.WEB_SELECT, obj);

        /**
         * The CSS selector of an select element.
         * @type {any}
         */
        this.node = obj.node || {selector: '', type: 'CSS'};

        /**
         * The value of the select input that should be selected.
         * @type {*|string}
         */
        this.value = obj.value || '';

        /**
         * The type the option is selected by {'TEXT', 'VALUE', 'INDEX'}.
         * @type {string}
         */
        this.selectBy = obj.selectBy || 'TEXT';
    }

    /**
     * Get the string representation of the action.
     *
     * @returns {string}
     */
    toString() {
        return `Select value "${this.value}" from select input "${this.node.selector}"`;
    }
}
