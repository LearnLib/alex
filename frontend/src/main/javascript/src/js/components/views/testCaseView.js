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

export const testCaseView = {
    templateUrl: 'html/components/views/test-case-view.html',
    bindings: {
        test: '='
    },
    controllerAs: 'vm',

    /**
     * The controller of the view.
     */
    controller: class {

        /**
         * Constructor.
         *
         * @param $scope
         * @param $state
         * @param dragulaService
         * @param {SymbolGroupResource} SymbolGroupResource
         * @param {SessionService} SessionService
         * @param {ToastService} ToastService
         * @param {TestResource} TestResource
         * @param {LearnerResource} LearnerResource
         */
        // @ngInject
        constructor($scope, $state, dragulaService, SymbolGroupResource, SessionService, ToastService, TestResource,
                    LearnerResource) {
            this.$state = $state;
            this.ToastService = ToastService;
            this.TestResource = TestResource;
            this.LearnerResource = LearnerResource;

            /**
             * The current project.
             * @type {Project}
             */
            this.project = SessionService.getProject();

            /**
             * The current test
             * @type {object}
             */
            this.test = null;

            /**
             * The outputs of the word.
             * @type {string[]}
             */
            this.outputs = [];

            /**
             * The test result.
             * @type {object}
             */
            this.result = null;

            /**
             * The browser configuration.
             * @type {object}
             */
            this.browserConfig = {
                driver: webBrowser.HTMLUNITDRIVER,
                width: screen.width,
                height: screen.height,
                headless: false
            };

            SymbolGroupResource.getAll(this.project.id, true)
                .then(groups => this.groups = groups)
                .catch(console.log);

            dragulaService.options($scope, 'testSymbols', {
                removeOnSpill: false,
                mirrorContainer: document.createElement('div')
            });

            $scope.$on('testSymbols.drag', () => this.outputs = []);
        }

        /**
         * Save the state of the test case.
         */
        save() {
            const test = JSON.parse(JSON.stringify(this.test));
            test.symbols = test.symbols.map(s => s.id);
            this.TestResource.update(test)
                .then(() => this.ToastService.success("The test case has been updated."))
                .catch(err => this.ToastService.danger("The test case could not be updated. " + err.data.message));
        }

        /**
         * Execute the test case.
         */
        execute() {
            if (!this.test.symbols.length) {
                this.ToastService.info("You have to create at least one symbol.");
                return;
            }

            this.result = null;
            this.TestResource.execute(this.test, this.browserConfig)
                .then(data => this.result = data)
                .catch(err => this.ToastService.info("The test case could not be executed. " + err.data.message));
        }

        /**
         * Test which outputs the SUL generates for this word.
         */
        getOutputs() {
            if (!this.test.symbols.length) {
                this.ToastService.info("You have to create at least one symbol.");
                return;
            }

            this.outputs = [];
            const test = JSON.parse(JSON.stringify(this.test));
            test.symbols = test.symbols.map(s => s.id);

            const resetSymbol = test.symbols[0];
            test.symbols.splice(0, 1);

            this.LearnerResource.readOutputs(this.project.id, {
                symbols: {
                    resetSymbol: resetSymbol,
                    symbols: test.symbols
                }, browser: this.browserConfig
            })
                .then(data => this.outputs = data)
                .catch(console.log)
        }
    }
};