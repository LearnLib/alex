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
 * Action to check the value of a nodes attribute.
 */
export class CheckNodeAttributeValueAction extends Action {

    /**
     * Constructor.
     *
     * @param {object} obj - The object to create the action from.
     */
    constructor(obj) {
        super(actionType.WEB_CHECK_ATTRIBUTE_VALUE, obj);

        /**
         * The selector of the element.
         * @type {string}
         */
        this.node = obj.node || '';

        /**
         * The attribute name of the element to check.
         * @type {string}
         */
        this.attribute = obj.attribute || '';

        /**
         * The selector of the node to search.
         * @type {string}
         */
        this.value = obj.value || '';

        /**
         * The method that is used to check the attribute value.
         * @type {string}
         */
        this.checkMethod = obj.checkMethod || 'IS';
    }

    /**
     * A string representation of the action.
     *
     * @returns {string}
     */
    toString() {
        return `
            Check if the attribute "${this.attribute}" of the element "${this.node}" 
            ${this.checkMethod.toLowerCase()} "${this.value}"`;
    }
}