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

import {webBrowser} from "../constants";

/**
 * The resource that handles http calls to the API to do CRUD operations on projects.
 */
export class SettingsResource {

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
     * Get application specific settings.
     *
     * @returns {Promise}
     */
    get() {
        return this.$http.get(this.__env.apiUrl + `/settings`)
            .then(response => response.data);
    }

    /**
     * Update application specific settings.
     *
     * @param {Object} settings - The updated settings object.
     * @returns {Promise}
     */
    update(settings) {
        return this.$http.put(this.__env.apiUrl + `/settings`, settings)
            .then(response => response.data);
    }

    /**
     * Get the supported web drivers.
     *
     * @returns {Promise}
     */
    getSupportedWebDrivers() {
        return this.get().then(settings => {
            let supportedWebDrivers = {
                HTMLUNITDRIVER: 'htmlUnit',
                SAFARI: 'safari',
            };

            for (let key in webBrowser) {
                if (key === 'HTML_UNIT' || key === 'SAFARI') continue;
                if (settings.driver[webBrowser[key]].trim() !== "") {
                    supportedWebDrivers[key] = webBrowser[key];
                }
            }

            return {
                supportedWebDrivers: supportedWebDrivers,
                defaultWebDriver: settings.driver.defaultDriver || webBrowser.HTMLUNITDRIVER
            };
        });
    }
}