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

import {Action} from "../Action";
import {actionType} from "../../../constants";

/**
 * Fills an input element with a value.
 */
export class FillWebAction extends Action {

    /**
     * Constructor.
     *
     * @param {object} obj - The object to create the action from.
     */
    constructor(obj) {
        super(actionType.WEB_FILL, obj);

        /**
         * The CSS selector of an element.
         * @type {any}
         */
        this.node = obj.node || {selector: '', type: 'CSS'};

        /**
         * The value it should be filled with.
         * @type {*|string}
         */
        this.value = obj.value || '';
    }

    /**
     * The string representation of the action.
     *
     * @returns {string}
     */
    toString() {
        return `Fill input "${this.node.selector}" with "${this.value}"`;
    }
}