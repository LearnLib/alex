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

/**
 * The resource to handle actions with test cases over the API.
 */
export class TestResource {

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
     * Create a test case.
     *
     * @param {object} testCase - The test case to create.
     */
    create(testCase) {
        return this.$http.post(`${this.__env.apiUrl}/projects/${testCase.project}/tests`, testCase)
            .then(response => response.data);
    }

    /**
     * Create multiple test cases at once.
     *
     * @param {number} projectId - The id of the project.
     * @param {object[]} tests - The tests to create.
     */
    createMany(projectId, tests) {
        return this.$http.post(`${this.__env.apiUrl}/projects/${projectId}/tests/batch`, tests)
            .then(response => response.data);
    }

    /**
     * Gets all test cases of a project.
     *
     * @param {number} projectId - The id of the project to get all test cases from
     */
    getAll(projectId) {
        return this.$http.get(`${this.__env.apiUrl}/projects/${projectId}/tests`)
            .then(response => response.data);
    }

    /**
     * Get a single test case by its id.
     *
     * @param projectId - The id of the project.
     * @param testCaseId - The id of the test case.
     */
    get(projectId, testCaseId) {
        return this.$http.get(`${this.__env.apiUrl}/projects/${projectId}/tests/${testCaseId}`)
            .then(response => response.data);
    }

    /**
     * Get a report.
     *
     * @param projectId - The id of the project.
     * @param result - The result to get the report from.
     */
    getReport(projectId, result) {
        return this.$http.post(`${this.__env.apiUrl}/projects/${projectId}/tests/report`, result)
            .then(response => response.data);
    }

    /**
     * Update a test case.
     *
     * @param testCase - The updated test case.
     */
    update(testCase) {
        return this.$http.put(`${this.__env.apiUrl}/projects/${testCase.project}/tests/${testCase.id}`, testCase)
            .then(response => response.data);
    }

    /**
     * Deletes a test case.
     *
     * @param testCase - The test case to delete.
     */
    remove(testCase) {
        return this.$http.delete(`${this.__env.apiUrl}/projects/${testCase.project}/tests/${testCase.id}`)
            .then(response => response.data);
    }

    /**
     * Deletes a test case.
     *
     * @param {number} projectId - The id of the project the tests are in.
     * @param tests - The test case to delete.
     */
    removeMany(projectId, tests) {
        const ids = tests.map(t => t.id).join(',');
        return this.$http.delete(`${this.__env.apiUrl}/projects/${projectId}/tests/batch/${ids}`)
            .then(response => response.data);
    }

    /**
     * Execute the test.
     *
     * @param {object} testCase - The test to execute.
     * @param {object} browserConfig - The config to execute the test with.
     */
    execute(testCase, browserConfig) {
        return this.$http.post(`${this.__env.apiUrl}/projects/${testCase.project}/tests/${testCase.id}/execute`, browserConfig)
            .then(response => response.data);
    }
}