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

import {eqOracleType} from '../constants';

/** The model for the random eq oracle */
class RandomEqOracle {

    /**
     * Constructor
     * @param {number} minLength
     * @param {number} maxLength
     * @param {number} maxNoOfTests
     */
    constructor(minLength = 0, maxLength = 0, maxNoOfTests = 0) {
        this.type = eqOracleType.RANDOM;
        this.minLength = minLength;
        this.maxLength = maxLength;
        this.maxNoOfTests = maxNoOfTests;
    }
}

/** The model for the complete eq oracle */
class CompleteEqOracle {

    /**
     * Constructor
     * @param {number} minDepth
     * @param {number} maxDepth
     */
    constructor(minDepth = 0, maxDepth = 0) {
        this.type = eqOracleType.COMPLETE;
        this.minDepth = minDepth;
        this.maxDepth = maxDepth;
    }
}

/** The model for the sample eq oracle */
class SampleEqOracle {

    /**
     * Constructor
     * @param {Array} counterExamples
     */
    constructor(counterExamples = []) {
        this.type = eqOracleType.SAMPLE;
        this.counterExamples = counterExamples;
    }
}

/** The model the the wmethod eq oracle */
class WMethodEqOracle {

    /**
     * Constructor
     * @param {number} maxDepth
     */
    constructor(maxDepth = 1) {
        this.type = eqOracleType.WMETHOD;
        this.maxDepth = maxDepth;
    }
}

export {RandomEqOracle, CompleteEqOracle, WMethodEqOracle, SampleEqOracle};