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

import {eqOracleType} from '../../constants';

/**
 * The model for the complete eq oracle.
 */
export class CompleteEqOracle {

    /**
     * Constructor.
     *
     * @param {number} minDepth
     * @param {number} maxDepth
     */
    constructor(minDepth = 1, maxDepth = 10) {
        this.type = eqOracleType.COMPLETE;
        this.minDepth = minDepth;
        this.maxDepth = maxDepth;
    }
}
