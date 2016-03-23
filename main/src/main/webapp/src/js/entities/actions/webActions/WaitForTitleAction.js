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

import Action from '../Action';
import {actionType} from '../../../constants';

/**
 * Wait for the title of the page to have changed
 **/
class WaitForTitleAction extends Action {

    /**
     * Constructor
     * @param {object} obj - The object to create the action from
     */
    constructor(obj) {
        super(actionType.WAIT_FOR_TITLE, obj);

        /**
         * For what event should be waited
         * Can be 'IS' or 'CONTAINS'
         * @type {string}
         */
        this.waitCriterion = obj.waitCriterion || 'IS';

        /**
         * The value of the title
         * @type {*|string}
         */
        this.value = obj.value || '';

        /**
         * The time to wait for the change at max
         * @type {number}
         */
        this.maxWaitTime = obj.maxWaitTime || 10;
    }

    /**
     * A string presentation of the actions
     * @returns {string}
     */
    toString() {
        if (this.waitCriterion === 'IS') {
            return `Wait until the title is "${this.value}" for a maximum of "${this.maxWaitTime}s"`;
        } else {
            return `Wait until the title contains "${this.value}" for a maximum of "${this.maxWaitTime}s"`;
        }
    }
}

export default WaitForTitleAction;
