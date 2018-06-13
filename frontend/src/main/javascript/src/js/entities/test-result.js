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
 * The test result class.
 */
export class TestResult {

    /**
     * Constructor.
     */
    constructor() {

        /**
         * If the test succeeded.
         * @type {boolean}
         */
        this.success = true;

        /**
         * How many test cases passed.
         * @type {number}
         */
        this.testCasesPassed = 0;

        /**
         * How many test cases failed.
         * @type {number}
         */
        this.testCasesFailed = 0;

        /**
         * How many test cases have been executed.
         * @type {number}
         */
        this.testCasesRun = 0;
    }

    /**
     * Update the statistics.
     * @param {TestResult} result - The result to update the current one with.
     */
    add(result) {
        this.success &= result.success;
        this.testCasesPassed += result.testCasesPassed;
        this.testCasesFailed += result.testCasesFailed;
        this.testCasesRun += result.testCasesRun;
    }
}
