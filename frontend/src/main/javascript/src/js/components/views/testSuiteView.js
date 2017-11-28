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
import {TestResult} from "../../entities/TestResult";

export const testSuiteView = {
    templateUrl: 'html/components/views/test-suite-view.html',
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
         * @param {$state} $state
         * @param {SymbolGroupResource} SymbolGroupResource
         * @param {SessionService} SessionService
         * @param {LearnerResource} LearnerResource
         * @param {ToastService} ToastService
         * @param {TestResource} TestResource
         * @param {PromptService} PromptService
         */
        // @ngInject
        constructor($state, SymbolGroupResource, SessionService, LearnerResource, ToastService,
                    TestResource, PromptService) {
            this.$state = $state;
            this.LearnerResource = LearnerResource;
            this.ToastService = ToastService;
            this.TestResource = TestResource;
            this.PromptService = PromptService;

            /**
             * The current project.
             * @type {Project}
             */
            this.project = SessionService.getProject();

            /**
             * The tests.
             * @type {object[]}
             */
            this.tests = [];

            /**
             * The results of the test execution.
             * @type {object[]}
             */
            this.results = [];

            /**
             * The test result over all
             * @type {TestResult}
             */
            this.overallResult = null;

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
        }

        $onInit() {
            let tests = null;
            if (Array.isArray(this.test)) {
                tests = this.test;
            } else {
                tests = this.test.tests;
            }

            // sort by type and then alphabetically
            const testSuites = tests.filter(t => t.tests);
            const testCases = tests.filter(t => t.symbols);

            const compare = (a,b) => a.name > b.name ? 1 : b.name > a.name ? -1 : 0;

            testSuites.sort(compare);
            testCases.sort(compare);

            this.tests = testSuites.concat(testCases);
        }

        createTestSuite() {
            this.PromptService.prompt("Enter a name for the test suite.")
                .then(name => {
                    const testSuite = {
                        type: 'suite',
                        name: name,
                        project: this.project.id,
                        parent: this.test.id ? this.test.id : null,
                        tests: []
                    };
                    this.TestResource.create(testSuite)
                        .then(data => {
                            this.ToastService.success(`The test suite "${testSuite.name}" has been created.`);
                            this.tests.push(data)
                        })
                        .catch(err => this.ToastService.danger("The test suite could not be created. " + err.data.message));
                });
        }

        createTestCase() {
            this.PromptService.prompt("Enter a name for the test case.")
                .then(name => {
                    const testCase = {
                        type: 'case',
                        name: name,
                        project: this.project.id,
                        parent: this.test.id ? this.test.id : null,
                        symbols: []
                    };
                    this.TestResource.create(testCase)
                        .then(data => {
                            this.ToastService.success(`The test case "${testCase.name}" has been created.`);
                            this.tests.push(data)
                        })
                        .catch(err => this.ToastService.danger("The test suite could not be created. " + err.data.message));
                });
        }

        editTest(test) {
            this.PromptService.prompt(`Update the name for the test.`, test.name)
                .then(name => {
                    if (name === test.name) {
                        return;
                    }

                    const testCopy = JSON.parse(JSON.stringify(test));
                    delete testCopy._selected;

                    // TODO: remove later when backend bug is fixed
                    testCopy.type = testCopy.tests ? 'suite' : 'case';

                    testCopy.name = name;
                    if (testCopy.type === 'suite') {
                        testCopy.tests = testCopy.tests.map(t => t.id);
                    } else {
                        testCopy.symbols = testCopy.symbols.map(s => s.id);
                    }

                    this.TestResource.update(testCopy)
                        .then(() => {
                            this.ToastService.success("The name has been updated.");
                            test.name = name
                        })
                        .catch(err => this.ToastService.danger(`The test ${test.type} could not be created. ${err.data.message}`));
                });
        }

        reset() {
            this.overallResult = new TestResult();
            this.results = {};
        }

        deleteTest(test) {
            this.reset();

            this.TestResource.remove(test)
                .then(() => {
                    this.ToastService.success(`The test ${test.type} has been deleted.`);
                    const i = this.tests.findIndex(t => t.id === test.id);
                    if (i > -1) this.tests.splice(i, 1);
                })
                .catch(err => this.ToastService.danger(`The test ${test.type} could not be deleted. ${err.data.message}`));
        }

        deleteSelected() {
            if (this.tests.findIndex(t => t._selected) === -1) {
                this.ToastService.info("You have to select at least one test case or test suite.");
                return;
            }

            this.reset();

            const selected = this.tests.filter(t => t._selected);

            const next = (test) => {
                test.project = this.project.id;
                this.TestResource.remove(test)
                    .then(() => {
                        const i = this.tests.findIndex(t => t.id === test.id);
                        if (i > -1) this.tests.splice(i, 1);
                        if (selected.length) {
                            next(selected.shift());
                        } else {
                            this.ToastService.success("All selected test cases and test suites have been deleted.")
                        }
                    })
                    .catch(console.log);
            };
            next(selected.shift());
        }

        executeSelected() {
            if (this.tests.findIndex(t => t._selected) === -1) {
                this.ToastService.info("You have to select at least one test case or test suite.");
                return;
            }

            this.reset();
            const selected = this.tests.filter(t => t._selected);
            const next = (test) => {
                test.project = this.project.id;
                this.TestResource.execute(test, this.browserConfig)
                    .then(data => {
                        this.results[test.id] = data;
                        this.overallResult.add(data);

                        if (selected.length) {
                            next(selected.shift());
                        } else {
                            this.ToastService.success("Finished executing all tests.")
                        }
                    })
                    .catch(console.log);
            };
            next(selected.shift());
        }
    }
};