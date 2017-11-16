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

export const testCaseEditForm = {
    templateUrl: `html/components/forms/test-case-edit-form.html`,
    bindings: {
        groups: '=',
        testCase: '=',
        browserConfig: '=',
        onUpdated: '&',
        onDismiss: '&'
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
         * @param {PromptService} PromptService
         * @param {TestCaseResource} TestCaseResource
         * @param {SessionService} SessionService
         */
        // @ngInject
        constructor($scope, dragulaService, LearnerResource, ToastService, PromptService, TestCaseResource,
                    SessionService) {
            this.LearnerResource = LearnerResource;
            this.ToastService = ToastService;
            this.PromptService = PromptService;
            this.TestCaseResource = TestCaseResource;

            /**
             * The current project.
             * @type {Project}
             */
            this.project = SessionService.getProject();

            /** The name for the test case. */
            this.name = null;

            /**
             * The word to test.
             * @type {AlphabetSymbol[]}
             */
            this.word = [];

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
                moves: function () {
                    return !this.isExecuting;
                }.bind(this),
            });

            $scope.$on('word.drop', () => this.outputs = []);
            $scope.$on('$destroy', () => dragulaService.destroy($scope, 'word'));
        }

        $onInit() {
            this.word = this.testCase.symbols;
            this.name = this.testCase.name;
        }

        /**
         * Creates a test case.
         */
        createTestCase() {
            const testCase = JSON.parse(JSON.stringify(this.testCase));
            testCase.symbols = this.word.map(s => s.id);
            testCase.name = this.name;

            this.TestCaseResource.update(testCase)
                .then(data => {
                    this.ToastService.success("The test case has been updated.");
                    this.onUpdated({testCase: data});
                })
                .catch(err => {
                    this.ToastService.danger("The test case could not be updated. " + err.data.message)
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