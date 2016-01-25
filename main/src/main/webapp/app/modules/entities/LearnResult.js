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

import LearnConfiguration from './LearnConfiguration';

/**
 * The model for a learner result
 */
class LearnResult {

    /**
     * Constructor
     * @param obj - The object to create a learn result from
     */
    constructor(obj) {

        /**
         * The algorithm that is used
         * @type {string}
         */
        this.algorithm = obj.algorithm;

        /**
         * The browser that is used
         * @type {string}
         */
        this.browser = obj.browser;

        /**
         * The hypothesis
         * @type {object}
         */
        this.hypothesis = obj.hypothesis;

        /**
         * The project id of the learn result
         * @type{number}
         */
        this.project = obj.project;

        /**
         * The id revision pair of the reset symbol
         */
        this.resetSymbol = obj.resetSymbol;

        /**
         * The alphabet the process has been learned with
         * @type {{id:number,revision:number}[]}
         */
        this.sigma = obj.sigma;

        /**
         * The cumulated statistics
         */
        this.statistics = obj.statistics;

        /**
         * The steps of the learn process
         * @type {{eqOracle:Object, stepNo:number, statistics:Object, hypothesis:Object}}
         */
        this.steps = obj.steps;

        /**
         * Sigma
         */
        this.symbols = obj.symbols;

        /**
         * The test number
         * @type {number}
         */
        this.testNo = obj.testNo;

        /**
         * The id of the user
         * @type {number}
         */
        this.user = obj.user;

        // convert ns to ms
        this.statistics.duration = Math.ceil(this.statistics.duration / 1000000);

        if (this.steps) {
            this.steps.forEach(step => step.statistics.duration = Math.ceil(step.statistics.duration / 1000000));
        }
    }

    getConfiguration() {
        return {
            algorith: this.algorithm,
            browser: this.browser,
            eqOracle: this.steps[this.steps.length - 1].eqOracle
        }
    }
}

export default LearnResult;