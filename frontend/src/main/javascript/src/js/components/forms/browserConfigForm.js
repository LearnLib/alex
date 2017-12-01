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
 * The component to configure the web driver.
 *
 * @type {{templateUrl: string, bindings: {config: string}, controllerAs: string, controller: browserConfigForm.controller}}
 */
export const browserConfigForm = {
    templateUrl: 'html/components/forms/browser-config-form.html',
    bindings: {
        config: '='
    },
    controllerAs: 'vm',
    controller: class {

        /**
         * Constructor.
         *
         * @param {SettingsResource} SettingsResource
         */
        // @ngInject
        constructor(SettingsResource) {
            this.SettingsResource = SettingsResource;
            this.supportedWebDrivers = [];
        }

        $onInit() {
            this.SettingsResource.getSupportedWebDrivers()
                .then(data => this.supportedWebDrivers = data.supportedWebDrivers)
                .catch(console.log);
        }
    }
};