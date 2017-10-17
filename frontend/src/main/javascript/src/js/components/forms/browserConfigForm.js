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

import {webBrowser} from "../../constants";

export const browserConfigFormComponent = {
    templateUrl: 'html/components/forms/browser-config-form.html',
    bindings: {
        config: '='
    },
    controller: class {

        /**
         * Constructor
         * @param {SettingsResource} SettingsResource
         */
        // @ngInject
        constructor(SettingsResource) {
            this.SettingsResource = SettingsResource;

            /**
             * The web driver enum.
             * @type {any}
             */
            this.webBrowsers = null;
        }

        $onInit() {
            this.SettingsResource.getSupportedBrowserEnum()
                .then(data => {
                    this.webBrowsers = data.supportedBrowsers;
                    if (Object.values(this.webBrowsers).indexOf(data.defaultDriver) > -1) {
                        this.config.driver = data.defaultDriver;
                    } else {
                        this.config.driver = webBrowser.HTMLUNITDRIVER;
                    }
                })
                .catch(err => console.log(err));
        }
    },
    controllerAs: 'vm'
};