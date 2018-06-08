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

/**
 * The model for a learner result.
 */
export class LearnResult {

    /**
     * Constructor.
     *
     * @param obj - The object to create a learn result from.
     */
    constructor(obj) {

        /**
         * The algorithm that is used.
         * @type {object}
         */
        this.algorithm = obj.algorithm;

        /**
         * The browser that is used.
         * @type {object}
         */
        this.driverConfig = obj.driverConfig;

        /**
         * The hypothesis.
         * @type {object}
         */
        this.hypothesis = obj.hypothesis;

        /**
         * The project id of the learn result.
         * @type{number}
         */
        this.project = obj.project;

        /**
         * The id of the reset symbol.
         * @type {*}
         */
        this.resetSymbol = obj.resetSymbol;

        /**
         * The alphabet the process has been learned with.
         * @type {number[]}
         */
        this.sigma = obj.sigma;

        /**
         * The cumulated statistics.
         * @type {*}
         */
        this.statistics = obj.statistics;

        /**
         * The steps of the learn process.
         * @type {Object}
         */
        this.steps = obj.steps;

        /**
         * Sigma.
         * @type {*}
         */
        this.symbols = obj.symbols;

        /**
         * The test number.
         * @type {number}
         */
        this.testNo = obj.testNo;

        /**
         * If the learner encountered an error.
         * @type {boolean}
         */
        this.error = obj.error;

        /**
         * The description of the error that occurred.
         * @type {string}
         */
        this.errorText = obj.errorText;

        /**
         * The comment of the learn result.
         * @type {string}
         */
        this.comment = obj.comment;

        /**
         * The list of URLs.
         */
        this.urls = obj.urls || [];

        /**
         * If membership queries should be cached.
         * @type {boolean}
         */
        this.useMQCache = obj.useMQCache;

        // convert ns to ms
        LearnResult.convertNsToMs(this.statistics.duration);

        if (this.steps != null && this.steps.length > 0) {
            this.steps.forEach(step => LearnResult.convertNsToMs(step.statistics.duration));
        }
    }

    static convertNsToMs(input) {
        input.total = Math.ceil(input.total / 1000000);
        input.learner = Math.ceil(input.learner / 1000000);
        input.eqOracle = Math.ceil(input.eqOracle / 1000000);
    }

}
