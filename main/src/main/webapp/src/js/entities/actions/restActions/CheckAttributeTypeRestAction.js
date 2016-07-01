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


/** Checks if a property of the JSON of a HTTP response has a specific type */
export class CheckAttributeTypeRestAction extends Action {

    /**
     * Constructor
     * @param {object} obj - The object to create the action from
     * @constructor
     */
    constructor(obj) {
        super(actionType.REST_CHECK_ATTRIBUTE_TYPE, obj);

        /**
         * The JSON property
         * @type {string}
         */
        this.attribute = obj.attribute || '';

        /**
         * The Type in {INTEGER,STRING,BOOLEAN,OBJECT}
         * @type {string}
         */
        this.jsonType = obj.jsonType || 'STRING';
    }

    /**
     * A string presentation of the actions
     * @returns {string}
     */
    toString() {
        return 'Check the JSON attribute "' + this.attribute + '" is type of "' + this.jsonType + '"';
    }
}