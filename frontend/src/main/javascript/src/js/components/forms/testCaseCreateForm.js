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

export const testCaseCreateForm = {
    templateUrl: `html/components/forms/test-case-create-form.html`,
    bindings: {
        groups: '=',
        browserConfig: '=',
        onCreated: '&',
    },
    controllerAs: 'vm',
    controller: class TestCaseCreateForm {

        /**
         * Constructor.
         *
         * @param $scope
         * @param dragulaService
         * @param {LearnerResource} LearnerResource
         * @param {ToastService} ToastService
         * @param {TestCaseResource} TestCaseResource
         * @param {SessionService} SessionService
         */
        // @ngInject
        constructor($scope, dragulaService, LearnerResource, ToastService, TestCaseResource,
                    SessionService) {
            this.LearnerResource = LearnerResource;
            this.ToastService = ToastService;
            this.TestCaseResource = TestCaseResource;

            /**
             * The current project.
             * @type {Project}
             */
            this.project = SessionService.getProject();

            /**
             * The word to test.
             * @type {AlphabetSymbol[]}
             */
            this.word = [];

            /**
             * The name of the test case.
             * @type {string}
             */
            this.name = "";

            /**
             * The outputs of the executed word.
             * @type {string[]}
             */
            this.outputs = [];

            /**
             * If the word is being executed.
             * @type {boolean}
             */
            this.isExecuting = false;

            dragulaService.options($scope, 'word', {
                removeOnSpill: false,
                mirrorContainer: document.createElement('div'),
                moves: () => !this.isExecuting
            });

            $scope.$on('word.drop', () => this.outputs = []);
            $scope.$on('$destroy', () => dragulaService.destroy($scope, 'word'));
        }

        /**
         * Creates a test case.
         */
        createTestCase() {
            if (this.name.trim() === "") {
                this.ToastService.info("The name may not be empty");
                return;
            }

            const testCase = {
                name: this.name,
                project: this.project.id,
                symbols: this.word.map(s => s.id)
            };

            this.TestCaseResource.create(testCase)
                .then(data => {
                    this.ToastService.success("The test case has been saved.");
                    this.onCreated({testCase: data});
                })
                .catch(err => {
                    this.ToastService.danger("The test case could not be saved. " + err.data.message);
                });
        }

        /**
         * Executes the word that has been build.
         */
        executeWord() {
            if (this.browserConfig.driver === null) {
                this.ToastService.info("Select a web driver.");
                return;
            }

            this.outputs = [];
            this.isExecuting = true;
            const symbols = this.word.map(s => s.id);
            const resetSymbol = symbols.shift();

            const readOutputConfig = {
                symbols: {resetSymbol, symbols},
                browser: this.browserConfig
            };

            this.LearnerResource.testWord(this.project.id, readOutputConfig)
                .then(outputs => {
                    this.outputs = outputs;
                })
                .catch(res => {
                    this.ToastService.danger("The word could not be executed. " + res.data.message);
                })
                .finally(() => this.isExecuting = false);
        }
    }
};