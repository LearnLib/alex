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
 * Executes another symbol before continuing with other actions.
 */
export class ExecuteSymbolGeneralAction extends Action {

    /**
     * Constructor.
     *
     * @param {object} obj - The object to create the action from.
     */
    constructor(obj) {
        super(actionType.GENERAL_EXECUTE_SYMBOL, obj);

        /**
         * id.
         * @type {number}
         */
        this.symbolToExecute = obj.symbolToExecute || nul;

        let model = {
            name: obj.symbolToExecuteName || null,
        };

        if (typeof obj.getModel !== "undefined") {
            model = obj.getModel();
        }

        this.getModel = () => model;
    }

    /**
     * A string representation of the action.
     *
     * @returns {string}
     */
    toString() {
        return `Execute Symbol ${this.getModel().name}.`;
    }

    /**
     * Sets the symbol to execute.
     *
     * @param {string} name - The name of the symbol to execute.
     * @param {AlphabetSymbol[]} symbols - The available symbols in the scope.
     */
    setSymbol(name, symbols) {
        this.getModel().maxRevision = null;
        for (let i = 0; i < symbols.length; i++) {
            if (symbols[i].name === name) {
                this.symbolToExecute = symbols[i].id;
                this.getModel().name = name;
                break;
            }
        }
    }
}