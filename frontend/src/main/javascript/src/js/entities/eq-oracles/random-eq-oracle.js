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

import {eqOracleType} from '../../constants';

/**
 * The model for the random eq oracle.
 */
export class RandomEqOracle {

    /**
     * Constructor.
     *
     * @param {number} minLength
     * @param {number} maxLength
     * @param {number} maxNoOfTests
     * @param {seed} seed
     */
    constructor(minLength = 0, maxLength = 0, maxNoOfTests = 0, seed = 42) {
        this.type = eqOracleType.RANDOM;
        this.minLength = minLength;
        this.maxLength = maxLength;
        this.maxNoOfTests = maxNoOfTests;
        this.seed = seed;
    }
}
