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
 * @type {{templateUrl: string, bindings: {dismiss: string, close: string, resolve: string}, controller: testConfigModal.controller, controllerAs: string}}
 */
export const testConfigModalComponent = {
    template: require('./test-config-modal.component.html'),
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

            /**
             * The current project.
             * @type {Project}
             */
            this.project = null;

            /**
             * The model for the url ids.
             * @type {number[]}
             */
            this.urlIds = [];
        }

        $onInit() {
            this.configuration = this.resolve.configuration;
            this.urlIds = [this.configuration.urlId];
            this.project = this.resolve.project;
        }

        /**
         * Close the modal window and pass the configuration.
         */
        update() {
            this.configuration.urlId = this.urlIds[0];
            this.close({$value: this.configuration});
        }
    },
    controllerAs: 'vm'
};
