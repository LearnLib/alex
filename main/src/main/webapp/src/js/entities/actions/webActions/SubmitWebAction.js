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

/** Submits a form. Can also be applied to an input element of a form */
export class SubmitWebAction extends Action {

    /**
     * Constructor
     * @param {object} obj - The object to create the action from
     * @constructor
     */
    constructor(obj) {
        super(actionType.WEB_SUBMIT, obj);

        /**
         * The CSS selector of an element
         * @type {*|string}
         */
        this.node = obj.node || '';
    }

    /**
     * A string presentation of the actions
     * @returns {string}
     */
    toString() {
        return `Submit form "${this.node}"`;
    }
}