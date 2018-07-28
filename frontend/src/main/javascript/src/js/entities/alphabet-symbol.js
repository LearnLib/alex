/*
 * Copyright 2018 TU Dortmund
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

import {ActionService} from '../services/action.service';
import {ParametrizedSymbol} from './parametrized-symbol';

const actionService = new ActionService();

/**
 * The symbol model.
 */
export class AlphabetSymbol {

    /**
     * Constructor.
     *
     * @param {object} obj - The object to create the symbol from.
     */
    constructor(obj = {}) {

        /**
         * The unique name of the symbol.
         * @type {string}
         */
        this.name = obj.name || null;

        /**
         * The id of the group the symbol should be created in.
         * @type {number}
         */
        this.group = obj.group || null;

        /**
         * The id of the symbol.
         * @type {number}
         */
        this.id = obj.id;

        /**
         * The id of the project the symbol belongs to.
         * @type {number}
         */
        this.project = obj.project;

        /**
         * The flag if the symbol has been deleted.
         * @type {boolean}
         */
        this.hidden = obj.hidden;

        /**
         * The custom output of the symbol on success.
         * @type {String}
         */
        this.successOutput = obj.successOutput;

        /**
         * The list of input variables.
         * @type {Object[]}
         */
        this.inputs = obj.inputs || [];

        /**
         * The list of output variables.
         * @type {Object[]}
         */
        this.outputs = obj.outputs || [];

        /**
         * The steps that are executed in the symbol.
         * @type {Object[]}
         */
        this.steps = obj.steps ? obj.steps.map(step => {
            if (step.type === 'symbol') {
                step.pSymbol = new ParametrizedSymbol(step.pSymbol);
            } else if (step.type === 'action') {
                step.action = actionService.create(step.action);
            }
            return step;
        }) : [];

        /**
         * The description of the symbol.
         * @type {?string}
         */
        this.description = obj.description || '';

        /**
         * The expected result of the symbol.
         * @type {?string}
         */
        this.expectedResult = obj.expectedResult || '';
    }

    /**
     * Gets a reduced version of the symbol that can be used to export it.
     *
     * @returns {Object}
     */
    getExportableSymbol() {
        const symbol = JSON.parse(JSON.stringify(this));
        symbol.inputs.forEach(input => delete input.id);
        symbol.outputs.forEach(output => delete output.id);
        symbol.steps = symbol.steps.map(step => {
            const s = AlphabetSymbol.stepsToJson(step);
            if (s.type === 'symbol') {
                s.pSymbol.symbolFromName = s.pSymbol.symbol.name;
                delete s.pSymbol.symbol;
            }
            return s;
        });

        return {
            name: symbol.name,
            description: symbol.description,
            expectedResult: symbol.expectedResult,
            successOutput: symbol.successOutput,
            inputs: symbol.inputs,
            outputs: symbol.outputs,
            steps: symbol.steps
        };
    }

    containsSymbolSteps() {
        return this.steps.filter(s => s.type === 'symbol').length > 0;
    }

    copy() {
        const copy = new AlphabetSymbol(JSON.parse(JSON.stringify(this)));
        delete copy.id;
        copy.steps = copy.steps.map(AlphabetSymbol.stepsToJson);
        copy.inputs.forEach(input => delete input.id);
        copy.outputs.forEach(output => delete output.id);
        return copy;
    }

    static stepsToJson(step) {
        const s = JSON.parse(JSON.stringify(step));
        delete s.$$hashKey;
        delete s.symbol;
        delete s.id;
        if (s.type === 'symbol') {
            delete s.pSymbol.id;
            s.pSymbol.parameterValues.forEach(pv => {
                delete pv.id;
            })
        } else if (s.type === 'action') {
            delete s.action.id;
        }
        return s;
    }

    toJson() {
        const symbol = new AlphabetSymbol(JSON.parse(JSON.stringify(this)));
        symbol.steps.forEach(step => {
            if (step.type === 'symbol') {
                step.pSymbol.symbol = step.pSymbol.symbol.id;
            }
        });
        return symbol;
    }
}
