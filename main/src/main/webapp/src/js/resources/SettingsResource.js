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
 * The resource that handles http calls to the API to do CRUD operations on projects.
 */
export class SettingsResource {

    /**
     * Constructor.
     * @param $http
     */
    // @ngInject
    constructor($http) {
        this.$http = $http;
    }

    /**
     * Get application specific settings.
     */
    get() {
        return this.$http.get(`rest/settings`)
            .then(response => angular.fromJson(response.data));
    }

    /**
     * Update application specific settings.
     * 
     * @param {Object} settings - The updated settings object.
     * @returns {*}
     */
    update(settings) {
        return this.$http.put(`rest/settings`, settings)
            .then(response => angular.fromJson(response.data));
    }
}