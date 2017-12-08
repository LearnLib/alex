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
 * Wait for the value of an elements attribute to be or contain a given value.
 */
export class WaitForNodeAttributeAction extends Action {

    /**
     * Constructor.
     *
     * @param {object} obj - The object to create the action from.
     */
    constructor(obj) {
        super(actionType.WAIT_FOR_NODE_ATTRIBUTE, obj);

        /**
         * For what event should be waited.
         * Can be 'IS' or 'CONTAINS'.
         * @type {string}
         */
        this.waitCriterion = obj.waitCriterion || 'IS';

        /**
         * The CSS selector of an element.
         * @type {any}
         */
        this.node = obj.node || {selector: '', type: 'CSS'};

        /**
         * The name of the attribute.
         * @type {*|string}
         */
        this.attribute = obj.attribute || '';

        /**
         * The value of the attribute.
         * @type {*|string}
         */
        this.value = obj.value || '';

        /**
         * The time to wait for the change at max.
         * @type {number}
         */
        this.maxWaitTime = obj.maxWaitTime || 10;
    }

    /**
     * A string representation of the action.
     *
     * @returns {string}
     */
    toString() {
        return `Wait until the attribute "${this.attribute}" of the element "${this.node.selector}" ${this.waitCriterion === 'IS' ? 'is' : 'contains' } "${this.value}" for a maximum of "${this.maxWaitTime}s"`;
    }
}