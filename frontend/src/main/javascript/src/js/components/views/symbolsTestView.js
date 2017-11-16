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

export const symbolsTestView = {

    /**
     * The controller of the view.
     */
    controller: class SymbolsTestView {

        /**
         * Constructor.
         *
         * @param {SymbolGroupResource} SymbolGroupResource
         * @param {SessionService} SessionService
         * @param {LearnerResource} LearnerResource
         * @param {ToastService} ToastService
         * @param {TestCaseResource} TestCaseResource
         * @param {PromptService} PromptService
         */
        // @ngInject
        constructor(SymbolGroupResource, SessionService, LearnerResource, ToastService,
                    TestCaseResource, PromptService) {
            this.LearnerResource = LearnerResource;
            this.ToastService = ToastService;
            this.TestCaseResource = TestCaseResource;
            this.PromptService = PromptService;

            /**
             * The current project.
             * @type {Project}
             */
            this.project = SessionService.getProject();

            /**
             * All symbol groups of the project.
             * @type {SymbolGroup[]}
             */
            this.groups = [];

            /**
             * The browser to execute the word in.
             * @type {any}
             */
            this.browserConfig = {
                driver: null,
                width: screen.width,
                height: screen.height
            };

            this.testCases = [];

            this.testCaseUnderEdit = null;

            SymbolGroupResource.getAll(this.project.id, true)
                .then(groups => this.groups = groups)
                .catch(err => console.log(err));

            TestCaseResource.getAll(this.project.id)
                .then(data => {
                    this.testCases = data;
                    console.log(this.testCases);
                })
                .catch(console.log);
        }

        /**
         * Deletes a test case.
         *
         * @param testCase - The test case to delete.
         */
        deleteTestCase(testCase) {
            delete testCase._selected;
            this.TestCaseResource.remove(testCase)
                .then(() => {
                    const i = this.testCases.findIndex(tc => tc.id === testCase.id);
                    if (i > -1) this.testCases.splice(i, 1);
                    this.ToastService.success(`Test case "${testCase.name}" deleted.`);
                })
                .catch(err => this.ToastService.danger("Deleting the test case failed."));
            // const i = this.testCases.findIndex(tc => tc.id === testCase.id);
            // if (i > -1) this.testCases.splice(i, 1);
        }

        updateTestCase(testCase) {
            const i = this.testCases.findIndex(tc => tc.id === testCase.id);
            if (i > -1) {
                this.testCases[i] = testCase;
                this.testCaseUnderEdit = testCase;
            }
        }

        executeTestCases() {
            if (this.browserConfig.driver === null) {
                this.ToastService.info("Select a web driver.");
                return;
            }

            const testCases = this.testCases.filter(tc => tc._selected);
            if (testCases.length === 0) {
                this.ToastService.info("Select at least one test case.");
                return;
            }

            let next = (testCase) => {
                let outputs = [];
                const symbols = testCase.symbols.map(s => s.id);
                const resetSymbol = symbols.shift();

                const readOutputConfig = {
                    symbols: {resetSymbol, symbols},
                    browser: this.browserConfig
                };

                this.LearnerResource.testWord(this.project.id, readOutputConfig)
                    .then(out => {
                        outputs = out;
                    })
                    .catch(res => {
                        this.ToastService.danger("The word could not be executed. " + res.data.message);
                    })
                    .finally(() => {
                        if (testCases.length) {
                            next(testCases.pop());
                        }
                    });
            };

            next(testCases.pop());
        }
    },
    controllerAs: 'vm',
    templateUrl: 'html/components/views/symbols-test-view.html'
};