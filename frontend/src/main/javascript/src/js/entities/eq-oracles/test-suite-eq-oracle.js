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
 * The model for the test suite eq oracle.
 */
export class TestSuiteEqOracle {

    /**
     * Constructor.
     *
     * @param {?number} testSuiteId
     * @param {boolean} includeChildTestSuites
     */
    constructor(testSuiteId = null, includeChildTestSuites = false) {
        this.type = eqOracleType.TEST_SUITE;
        this.testSuiteId = testSuiteId;
        this.includeChildTestSuites = includeChildTestSuites;
    }
}
