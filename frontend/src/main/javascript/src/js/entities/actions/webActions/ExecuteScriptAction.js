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

import {actionType} from "../../../constants";
import {Action} from "../Action";

/**
 * The action to execute a piece of JavaScript in the web browser.
 */
export class ExecuteScriptAction extends Action {

    /**
     * Constructor.
     *
     * @param obj {*} - The object to create the action from.
     */
    constructor(obj) {
        super(actionType.WEB_EXECUTE_SCRIPT, obj);

        /**
         * The JavaScript to execute.
         * @type {string}
         */
        this.script = obj.script || null;

        /**
         * The name of the variable the return value can be stored into.
         * @type {string}
         */
        this.name = obj.name || null;
    }

    /**
     * The string representation of the action.
     *
     * @returns {string}
     */
    toString() {
        let output = 'Execute JavaScript in the browser';
        if (this.name && this.name.trim() !== "") {
            output += ` and store the result in variable "${this.name}"`;
        }
        return output;
    }
}