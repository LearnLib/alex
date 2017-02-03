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
 * Wait an element of the page to change.
 */
export class WaitForNodeAction extends Action {

    /**
     * Constructor.
     *
     * @param {object} obj - The object to create the action from.
     */
    constructor(obj) {
        super(actionType.WAIT_FOR_NODE, obj);

        /**
         * For what event should be waited.
         * Can be 'IS' or 'CONTAINS'.
         * @type {string}
         */
        this.waitCriterion = obj.waitCriterion || 'VISIBLE';

        /**
         * The css selector of the element.
         * @type {any}
         */
        this.node = obj.node || {selector: '', type: 'CSS'};

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
        let text = `Wait until the element "${this.node.selector}" `;
        switch (this.waitCriterion) {
            case 'VISIBLE':
                text += `is visible `;
                break;
            case 'INVISIBLE':
                text += `is invisible `;
                break;
            case 'ADDED':
                text += `is added to the DOM `;
                break;
            case 'REMOVED':
                text += `is removed from the DOM `;
                break;
            case 'CLICKABLE':
                text += `is clickable `;
                break;
            default:
                break;
        }
        text += `for a maximum of "${this.maxWaitTime}s"`;
        return text;
    }
}