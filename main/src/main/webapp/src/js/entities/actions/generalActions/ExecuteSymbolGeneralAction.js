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

/** Executes another symbol before continuing with other actions */
class ExecuteSymbolGeneralAction extends Action {

    /**
     * Constructor
     * @param {object} obj - The object to create the action from
     */
    constructor(obj) {
        super(actionType.GENERAL_EXECUTE_SYMBOL, obj);

        /**
         * idRevisionPair
         * @type {*|{id: null, revision: null}}
         */
        this.symbolToExecute = obj.symbolToExecute || {id: null, revision: null};

        let model = {
            name: obj.symbolToExecuteName || null,
            maxRevision: null
        };

        if (angular.isDefined(obj.getModel)) {
            model = obj.getModel();
        }

        this.getModel = () => model;
    }

    /**
     * A string presentation of the actions
     * @returns {string}
     */
    toString() {
        return 'Execute symbol "' + this.getModel().name + '", rev. ' + this.symbolToExecute.revision;
    }

    /**
     * Update the revision of the symbol to execute
     * @param {Symbol[]} symbols
     */
    updateRevision(symbols) {
        for (let i = 0; i < symbols.length; i++) {
            if (symbols[i].id === this.symbolToExecute.id) {
                this.symbolToExecute.revision = symbols[i].revision;
                break;
            }
        }
    }

    /**
     * Sets the symbol to execute
     * @param {string} name - The name of the symbol to execute
     * @param {Symbol[]} symbols
     */
    setSymbol(name, symbols) {
        this.getModel().maxRevision = null;
        for (let i = 0; i < symbols.length; i++) {
            if (symbols[i].name === name) {
                this.symbolToExecute = symbols[i].getIdRevisionPair();
                this.getModel().name = name;
                this.getModel().maxRevision = symbols[i].revision;
                break;
            }
        }
    }
}

export default ExecuteSymbolGeneralAction;