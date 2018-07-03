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

import {apiUrl} from '../../../../environments';

/**
 * The resource to handle actions with test cases over the API.
 */
export class TestResource {

    /**
     * Constructor.
     *
     * @param $http
     */
    // @ngInject
    constructor($http) {
        this.$http = $http;
    }

    /**
     * Create a test case.
     *
     * @param {object} testCase The test case to create.
     */
    create(testCase) {
        return this.$http.post(`${apiUrl}/projects/${testCase.project}/tests`, testCase)
            .then(response => response.data);
    }

    /**
     * Create multiple test cases at once.
     *
     * @param {number} projectId The id of the project.
     * @param {object[]} tests The tests to create.
     */
    createMany(projectId, tests) {
        return this.$http.post(`${apiUrl}/projects/${projectId}/tests/batch`, tests)
            .then(response => response.data);
    }

    /**
     * Gets the root test suite.
     *
     * @param {number} projectId The id of the project to get all test cases from
     */
    getRoot(projectId) {
        return this.$http.get(`${apiUrl}/projects/${projectId}/tests/root`)
            .then(response => response.data);
    }

    /**
     * Get a single test case by its id.
     *
     * @param projectId The id of the project.
     * @param testCaseId The id of the test case.
     */
    get(projectId, testCaseId) {
        return this.$http.get(`${apiUrl}/projects/${projectId}/tests/${testCaseId}`)
            .then(response => response.data);
    }

    /**
     * Get the status of the current test process.
     *
     * @param {number} projectId The id of the project.
     */
    getStatus(projectId) {
        return this.$http.get(`${apiUrl}/projects/${projectId}/tests/status`)
            .then(response => response.data);
    }

    /**
     * Abort the execution of the current test processes.
     *
     * @param {number} projectId The ID of the project.
     * @return {*}
     */
    abort(projectId) {
        return this.$http.post(`${apiUrl}/projects/${projectId}/tests/abort`)
            .then(response => response.data);
    }

    /**
     * Update a test case.
     *
     * @param testCase The updated test case.
     */
    update(testCase) {
        return this.$http.put(`${apiUrl}/projects/${testCase.project}/tests/${testCase.id}`, testCase)
            .then(response => response.data);
    }

    /**
     * Deletes a test case.
     *
     * @param testCase The test case to delete.
     */
    remove(testCase) {
        return this.$http.delete(`${apiUrl}/projects/${testCase.project}/tests/${testCase.id}`)
            .then(response => response.data);
    }

    /**
     * Deletes a test case.
     *
     * @param {number} projectId The id of the project the tests are in.
     * @param tests The test case to delete.
     */
    removeMany(projectId, tests) {
        const ids = tests.map(t => t.id).join(',');
        return this.$http.delete(`${apiUrl}/projects/${projectId}/tests/batch/${ids}`)
            .then(response => response.data);
    }

    /**
     * Move tests to another test suite.
     *
     * @param {Number} projectId The id of the project.
     * @param {Number[]} testIds The ids of the tests to move.
     * @param {Number} targetId The id of the target test suite.
     * @return {*}
     */
    moveMany(projectId, testIds, targetId) {
        return this.$http.put(`${apiUrl}/projects/${projectId}/tests/batch/${testIds.join(',')}/moveTo/${targetId}`)
            .then(response => response.data);
    }

    /**
     * Execute a test.
     *
     * @param {object} testCase The test to execute.
     * @param {object} browserConfig The config to execute the test with.
     */
    execute(testCase, browserConfig) {
        return this.$http.post(`${apiUrl}/projects/${testCase.project}/tests/${testCase.id}/execute`, browserConfig)
            .then(response => response.data);
    }

    /**
     * Execute multiple tests at once.
     *
     * @param {number} projectId The id of the project
     * @param {object} testConfig The configuration for the web driver.
     */
    executeMany(projectId, testConfig) {
        return this.$http.post(`${apiUrl}/projects/${projectId}/tests/execute`, testConfig)
            .then((response) => response.data);
    }
}
