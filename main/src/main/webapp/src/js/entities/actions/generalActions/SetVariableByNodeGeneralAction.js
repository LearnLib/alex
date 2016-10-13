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
 * Extracts the text content value of an element and saves it value in a variable.
 */
export class SetVariableByNodeGeneralAction extends Action {

    /**
     * Constructor.
     *
     * @param {object} obj - The object to create the action from.
     */
    constructor(obj) {
        super(actionType.GENERAL_SET_VARIABLE_BY_HTML, obj);

        /**
         * The name of the variable.
         * @type {*|string}
         */
        this.name = obj.name || '';

        /**
         * The selector of the node.
         * @type {*|string}
         */
        this.value = obj.value || '';
    }

    /**
     * A string representation of the action.
     *
     * @returns {string}
     */
    toString() {
        return 'Set variable "' + this.name + '" to the value of the element "' + this.value + '"';
    }
}