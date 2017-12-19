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

import {webBrowser} from "../constants";
import {RandomEqOracle} from "../entities/EqOracle";
import {DriverConfigService} from "../services/DriverConfigService";

/**
 * The model for a learn configuration.
 */
export class LearnConfiguration {

    /**
     * Constructor.
     *
     * @param {*} obj - The object to create a learn configuration from.
     */
    constructor(obj = {}) {

        /**
         * The list of ids of symbols to learn.
         * @type {number[]}
         */
        this.symbols = obj.symbols || [];

        /**
         * The max amount of hypotheses to generate.
         * @type {number}
         */
        this.maxAmountOfStepsToLearn = obj.maxAmountOfStepsToLearn || -1;

        /**
         * The EQ oracle to user.
         * @type {*|RandomEqOracle}
         */
        this.eqOracle = obj.eqOracle || new RandomEqOracle(1, 10, 20);

        /**
         * The algorithm to use for learning.
         * @type {object}
         */
        this.algorithm = obj.algorithm || {name: "TTT"};

        /**
         * The id of the reset symbol.
         * @type {number}
         */
        this.resetSymbol = obj.resetSymbol || null;

        /**
         * A comment.
         * @type {string|null}
         */
        this.comment = obj.comment || null;

        /**
         * The browser to use.
         * @type {object}
         */
        this.driverConfig = obj.driverConfig || DriverConfigService.createFromName(webBrowser.HTML_UNIT);

        /**
         * If membership queries should be cached.
         * @type {boolean}
         */
        this.useMQCache = obj.useMQCache !== undefined ? obj.useMQCache : true;
    }

    /**
     * Adds a symbol to the configuration.
     *
     * @param {AlphabetSymbol} symbol - The symbol to add to the config.
     */
    addSymbol(symbol) {
        this.symbols.push(symbol.id);
    }

    /**
     * Sets the reset symbols for the configuration.
     *
     * @param {AlphabetSymbol} symbol - The reset symbol to use.
     */
    setResetSymbol(symbol) {
        this.resetSymbol = symbol.id;
    }
}