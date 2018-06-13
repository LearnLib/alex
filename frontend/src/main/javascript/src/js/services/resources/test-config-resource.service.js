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
 * The resource for test configs.
 */
export class TestConfigResource {

    /**
     * Constructor.
     *
     * @param $http
     */
    // @ngInject
    constructor($http) {
        this.$http = $http;

        this.url = (projectId) => `${apiUrl}/projects/${projectId}/testConfigs`;
    }

    /**
     * Get all test configs in the project.
     *
     * @param {number} projectId The id of the project.
     * @return {*}
     */
    getAll(projectId) {
        return this.$http.get(this.url(projectId))
            .then(res => res.data);
    }

    /**
     * Create a test config.
     *
     * @param {number} projectId The id of the project.
     * @param {object} config The config to create.
     * @return {*}
     */
    create(projectId, config) {
        return this.$http.post(this.url(projectId), config)
            .then(res => res.data);
    }

    /**
     * Delete a tes config.
     *
     * @param {number} projectId The id of the project.
     * @param {number} configId The id of the config to delete.
     * @return {*}
     */
    remove(projectId, configId) {
        return this.$http.delete(`${this.url(projectId)}/${configId}`);
    }
}
