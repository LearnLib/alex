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

import LearnResult from '../entities/LearnResult';

/**
 * The resource that handles http request to the API to do CRUD operations on learn results
 */
// @ngInject
class LearnResultResource {

    /**
     * Constructor
     * @param $http
     */
    constructor($http) {
        this.$http = $http;
    }

    /**
     * Gets all final steps of all learn results
     *
     * @param {number} projectId - The id of the project whose final learn results should be fetched
     * @returns {*}
     */
    getAll(projectId) {
        return this.$http.get(`/rest/projects/${projectId}/results`)
            .then(response => response.data.map(r => new LearnResult(r)));
    }

    /**
     * Gets the final learn result of a test run
     *
     * @param {number} projectId - The id of the project
     * @param {number} testNo - The number of the test run
     * @returns {*}
     */
    get(projectId, testNo) {
        return this.$http.get(`/rest/projects/${projectId}/results/${testNo}`)
            .then(response => {
                console.log(response)
                return new LearnResult(response.data)
            });
    }

    /**
     * Deletes a list of learn results
     *
     * @param {LearnResult|LearnResult[]} results
     */
    remove(results) {
        let testNos, projectId;
        if (angular.isArray(results)) {
            testNos = results.map(r => r.testNo).join(',');
            projectId = results[0].project;
        } else {
            testNos = results.testNo;
            projectId = results.project;
        }
        return this.$http.delete(`/rest/projects/${projectId}/results/${testNos}`, {});
    }
}

export default LearnResultResource;