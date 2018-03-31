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

/**
 * A modal dialog for the web driver configuration.
 *
 * @type {{templateUrl: string, bindings: {dismiss: string, close: string, resolve: string}, controller: browserConfigModal.controller, controllerAs: string}}
 */
export const browserConfigModalComponent = {
    template: require('./browser-config-modal.component.html'),
    bindings: {
        dismiss: '&',
        close: '&',
        resolve: '='
    },
    controller: class {

        /**
         * Constructor.
         */
        constructor() {

            /**
             * The web driver configuration.
             * @type {object}
             */
            this.configuration = null;
        }

        $onInit() {
            this.configuration = this.resolve.modalData.configuration;
        }

        /**
         * Close the modal window and pass the configuration.
         */
        update() {
            this.close({$value: this.configuration});
        }
    },
    controllerAs: 'vm'
};
