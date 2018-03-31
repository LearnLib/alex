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
import {LearnResult} from '../../entities/learner-result';

/**
 * The resource that handles http request to the API to do CRUD operations on learn results.
 */
export class LearnResultResource {

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
     * Gets all final steps of all learn results.
     *
     * @param {number} projectId - The id of the project whose final learn results should be fetched.
     * @returns {*}
     */
    getAll(projectId) {
        return this.$http.get(`${apiUrl}/projects/${projectId}/results?embed=steps`)
            .then(response => response.data.map(r => new LearnResult(r)));
    }

    /**
     * Gets the final learn result of a test run.
     *
     * @param {number} projectId - The id of the project.
     * @param {number} testNo - The number of the test run.
     * @returns {*}
     */
    get(projectId, testNo) {
        return this.$http.get(`${apiUrl}/projects/${projectId}/results/${testNo}?embed=steps`)
            .then(response => new LearnResult(response.data));
    }

    /**
     * Get the latest learner result.
     *
     * @param {number} projectId The id of the project.
     */
    getLatest(projectId) {
        return this.$http.get(`${apiUrl}/projects/${projectId}/results/latest`)
            .then(response => new LearnResult(response.data));
    }

    /**
     * Deletes a learn result.
     *
     * @param {LearnResult} result - The learn result to delete.
     */
    remove(result) {
        return this.$http.delete(`${apiUrl}/projects/${result.project}/results/${result.testNo}`, {});
    }

    /**
     * Deletes a list of learn results.
     *
     * @param {LearnResult[]} results - The learn results to delete.
     */
    removeMany(results) {
        const testNos = results.map(r => r.testNo).join(',');
        const projectId = results[0].project;
        return this.$http.delete(`${apiUrl}/projects/${projectId}/results/${testNos}`, {});
    }
}
