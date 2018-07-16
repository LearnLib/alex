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

import {AlphabetSymbol} from './alphabet-symbol';

/**
 * The parametrized symbol.
 */
export class ParametrizedSymbol {

    /**
     * Constructor.
     * @param {Object} obj
     */
    constructor(obj = {}) {

        /**
         * The ID of the parameterized symbol.
         * @type {?number}
         */
        this.id = obj.id == null ? null : obj.id;

        /**
         * The symbol to execute.
         * @type {?AlphabetSymbol}
         */
        this.symbol = obj.symbol != null ? new AlphabetSymbol(obj.symbol) : null;

        /**
         * The parameter values for the symbol.
         * @type {Object[]}
         */
        this.parameterValues = obj.parameterValues || [];
    }

    getComputedName() {
        const params = this.parameterValues
            .filter(v => !v.parameter.private && v.value != null)
            .map(v => v.value);

        if (params.length === 0) {
            return this.symbol.name;
        } else {
            return `${this.symbol.name} <${params.join(', ')}>`;
        }
    }

    /**
     * Create a parametrized symbol from a symbol.
     *
     * @param {AlphabetSymbol} symbol
     * @return {ParametrizedSymbol}
     */
    static fromSymbol(symbol) {
        const pSymbol = new ParametrizedSymbol();
        pSymbol.symbol = {
            id: symbol.id,
            name: symbol.name,
            expectedResult: symbol.expectedResult
        };
        pSymbol.parameterValues = symbol.inputs.map(input => ({parameter: input, value: null}));
        return pSymbol;
    }
}
