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

import {LearnResult} from '../entities/LearnResult';

/**
 * The service for interacting with the learner.
 */
export class LearnerResource {

    /**
     * Constructor.
     *
     * @param $http
     * @param __env
     */
    // @ngInject
    constructor($http, __env) {
        this.$http = $http;
        this.__env = __env;
    }

    /**
     * Start the server side learning process of a project.
     *
     * @param {number} projectId - The id of the project of the test.
     * @param {LearnConfiguration} learnConfiguration - The configuration to learn with.
     * @return {*}
     */
    start(projectId, learnConfiguration) {
        return this.$http.post(this.__env.apiUrl + `/learner/${projectId}/start`, learnConfiguration);
    }

    /**
     * Try to force stop a running learning process of a project. May not necessarily work due to difficulties
     * with the thread handling.
     *
     * @param {number} projectId - The id of the test to resume with.
     * @return {*}
     */
    stop(projectId) {
        return this.$http.get(this.__env.apiUrl + `/learner/${projectId}/stop`);
    }

    /**
     * Resume a paused learning process where the eqOracle was 'sample' and the learn process was interrupted
     * so that the ongoing process parameters could be defined.
     *
     * @param {number} projectId - The id of the test to resume with.
     * @param {number} testNo - The test number of the test to resume.
     * @param {LearnConfiguration} learnConfiguration - The configuration to resume with.
     * @return {*}
     */
    resume(projectId, testNo, learnConfiguration) {
        return this.$http.post(this.__env.apiUrl + `/learner/${projectId}/resume/${testNo}`, learnConfiguration);
    }

    /**
     * Gets the learner result that includes the hypothesis. make sure isActive() returns true before calling this
     * function.
     *
     * @param {number} projectId - The id of the test to resume with.
     * @return {*}
     */
    getStatus(projectId) {
        return this.$http.get(this.__env.apiUrl + `/learner/${projectId}/status`)
            .then(response => new LearnResult(response.data))
            .catch(() => null);
    }

    /**
     * Check if the server is finished learning a project.
     *
     * @param {number} projectId - The id of the test to resume with.
     * @return {*}
     */
    isActive(projectId) {
        return this.$http.get(this.__env.apiUrl + `/learner/${projectId}/active`)
            .then(response => response.data);
    }

    /**
     * Verifies a possible counterexample.
     *
     * @param {number} projectId - The project id.
     * @param {object} outputConfig - The id of the reset symbol.
     * @returns {*}
     */
    readOutputs(projectId, outputConfig) {
        return this.$http.post(this.__env.apiUrl + `/learner/${projectId}/outputs`, outputConfig)
            .then(response => response.data);
    }

    /**
     * Tests the outputs of a word.
     *
     * @param {number} projectId - The project id.
     * @param {*} readOutputConfig - The config to read the outputs.
     * @returns {*|Request}
     */
    testWord(projectId, readOutputConfig) {
        return this.$http.post(this.__env.apiUrl + `/learner/${projectId}/words/outputs`, readOutputConfig)
            .then(response => response.data);
    }

    /**
     * Compare two hypotheses and return the separating word.
     *
     * @param {object} hypA - The first hypothesis.
     * @param {object} hypB - The second hypothesis.
     */
    getSeparatingWord(hypA, hypB) {
        return this.$http.post(this.__env.apiUrl + `/learner/compare/separatingWord`, [hypA, hypB])
            .then(response => response.data);
    }

    /**
     * Compare two hypotheses and return the difference tree.
     * Test a on b.
     *
     * @param {object} hypA - The first hypothesis.
     * @param {object} hypB - The second hypothesis.
     */
    getDifferenceTree(hypA, hypB) {
        return this.$http.post(this.__env.apiUrl + `/learner/compare/differenceTree`, [hypA, hypB])
            .then(response => response.data);
    }
}
