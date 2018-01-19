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

import {DriverConfigService} from '../../../services/driver-config.service';

/**
 * The component to configure the web driver.
 *
 * @type {{templateUrl: string, bindings: {config: string}, controllerAs: string, controller: browserConfigForm.controller}}
 */
export const browserConfigFormComponent = {
    template: require('./browser-config-form.component.html'),
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

            /**
             * The list of locally installed web drivers.
             * @type {string[]}
             */
            this.supportedWebDrivers = [];

            /**
             * If the timeouts fields are displayed.
             * @type {boolean}
             */
            this.timeoutsCollapsed = true;

            /**
             * Target web platform for the remote driver.
             * @type {object}
             */
            this.platforms = {
                any: {
                    'Any': 'ANY'
                },
                windows: {
                    'Windows': 'WINDOWS',
                    'Windows 10': 'WIN10',
                    'Windows 8.1': 'WIN8_1',
                    'Windows 8': 'WIN8',
                    'Windows Vista': 'VISTA',
                    'Windows XP': 'XP',
                },
                mac: {
                    'Mac OS': 'MAC',
                    'Sierra': 'SIERRA',
                    'El Capitan': 'EL_CAPITAN',
                    'Yosemite': 'YOSEMITE',
                    'Mavericks': 'MAVERICKS',
                    'Mountain Lion': 'MOUNTAIN_LION',
                    'Snow Leopard': 'SNOW_LEOPARD'
                },
                unix: {
                    'Linux': 'LINUX',
                    'Unix': 'UNIX'
                }
            };

            /**
             * Target web browsers for the remote driver.
             * @type {object}
             */
            this.browsers = {
                'Chrome': 'chrome',
                'Edge': 'MicrosoftEdge',
                'Firefox': 'firefox',
                'HTML Unit': 'htmlunit',
                'Internet Explorer': 'iexplore',
                'Opera': 'operablink',
                'Safari': 'safari'
            };
        }

        $onInit() {
            this.SettingsResource.getSupportedWebDrivers()
                .then(data => this.supportedWebDrivers = data.supportedWebDrivers)
                .catch(console.log);

            this.driverName = this.config.name;
        }

        selectWebDriver() {
            this.config = DriverConfigService.createFromName(this.driverName);
        }
    }
};
