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

import {ParametrizedSymbol} from './parametrized-symbol';

export class TestCaseStep {

    /**
     * Constructor.
     *
     * @param {Object} obj The object to create the test case step from.
     */
    constructor(obj = {}) {

        /**
         * If the step should fail.
         * @type {boolean}
         */
        this.shouldFail = obj.shouldFail != null ? obj.shouldFail : false;

        /**
         * The expected result of the test step.
         * @type {string}
         */
        this.expectedResult = obj.expectedResult || '';

        /**
         * The symbol to execute in the step.
         * @type {?ParametrizedSymbol}
         */
        this.pSymbol = obj.pSymbol == null ? null : new ParametrizedSymbol(obj.pSymbol);
    }

    /**
     * Create a new TestCaseStep from a symbol.
     *
     * @param {AlphabetSymbol} symbol The symbol to create the step from.
     * @return {TestCaseStep}
     */
    static fromSymbol(symbol) {
        return new TestCaseStep({
            shouldFail: false,
            expectedResult: symbol.expectedResult,
            pSymbol: ParametrizedSymbol.fromSymbol(symbol)
        });
    }
}
