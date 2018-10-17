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

import remove from 'lodash/remove';

export const testConfigListComponent = {
    template: require('./test-config-list.component.html'),
    bindings: {
        configs: '=',
        onSelected: '&'
    },
    controllerAs: 'vm',
    controller: class TestConfigListComponent {

        /**
         * Constructor.
         *
         * @param testConfigResource
         * @param toastService
         */
        // @ngInject
        constructor(testConfigResource, toastService) {
            this.testConfigResource = testConfigResource;
            this.toastService = toastService;

            this.configs = [];

            this.selectedConfig = null;
        }

        selectConfig(config) {
            if (this.selectedConfig != null && this.selectedConfig.id === config.id) {
                this.selectedConfig = null;
            } else {
                this.selectedConfig = config;
            }
            this.onSelected({config: this.selectedConfig});
        }

        deleteConfig(config) {
            this.testConfigResource.remove(config.project, config.id)
                .then(() => {
                    remove(this.configs, {id: config.id});
                    this.toastService.success('The test config has been deleted.');
                });
        }
    }
};
