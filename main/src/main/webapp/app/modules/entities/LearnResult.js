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
         * The learnConfiguration
         * @type {LearnConfiguration|*}
         */
        this.configuration = new LearnConfiguration(obj.configuration);

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
         * The alphabet the process has been learned with
         * @type {{id:number,revision:number}[]}
         */
        this.sigma = obj.sigma;

        /**
         * The n in n-th hypothesis
         * @type {number}
         */
        this.stepNo = obj.stepNo;

        /**
         * The test number
         * @type {number}
         */
        this.testNo = obj.testNo;

        /**
         * The internal data structure of the used algorithm.
         * Not available for DHC
         * @type {string}
         */
        this.algorithmInformation = obj.algorithmInformation;

        /**
         * The statistics of the process
         * @type {object}
         */
        this.statistics = obj.statistics;

        /**
         * If there has been an error
         * @type {boolean}
         */
        this.error = obj.error;

        /**
         * The error message why the process failed
         * @type {string}
         */
        this.errorText = obj.errorText;

        // convert ns to ms
        this.statistics.startTime = Math.ceil(this.statistics.startTime / 1000000);
        this.statistics.duration = Math.ceil(this.statistics.duration / 1000000);
    }
}

export default LearnResult;