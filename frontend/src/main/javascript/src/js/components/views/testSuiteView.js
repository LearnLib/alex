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
        testSuite: '='
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
         * @param $uibModal
         * @param {SettingsResource} SettingsResource
         * @param {DownloadService} DownloadService
         */
        // @ngInject
        constructor($state, SymbolGroupResource, SessionService, LearnerResource, ToastService,
                    TestResource, PromptService, $uibModal, SettingsResource, DownloadService) {
            this.$state = $state;
            this.LearnerResource = LearnerResource;
            this.ToastService = ToastService;
            this.TestResource = TestResource;
            this.PromptService = PromptService;
            this.$uibModal = $uibModal;
            this.DownloadService = DownloadService;

            /**
             * The current project.
             * @type {Project}
             */
            this.project = SessionService.getProject();

            /**
             * The test suite.
             * @type {object}
             */
            this.testSuite = null;

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
             * If tests are being executed.
             * @type {boolean}
             */
            this.isExecuting = false;

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

            SettingsResource.getSupportedWebDrivers()
                .then(data => this.browserConfig.driver = data.defaultWebDriver)
                .catch(console.log);

            SymbolGroupResource.getAll(this.project.id, true)
                .then(groups => this.groups = groups)
                .catch(console.log);
        }

        $onInit() {
            let testSuites = this.testSuite.tests.filter(t => t.type === 'suite');
            let testCases = this.testSuite.tests.filter(t => t.type === 'case');

            const compare = (a, b) => a.name > b.name ? 1 : b.name > a.name ? -1 : 0;

            testSuites.sort(compare);
            testCases.sort(compare);

            this.testSuite.tests = testSuites.concat(testCases);
        }

        createTestSuite() {
            this.PromptService.prompt("Enter a name for the test suite.")
                .then(name => {
                    const testSuite = {
                        type: 'suite',
                        name: name,
                        project: this.project.id,
                        parent: this.testSuite.id,
                        tests: []
                    };
                    this.TestResource.create(testSuite)
                        .then(data => {
                            this.ToastService.success(`The test suite "${testSuite.name}" has been created.`);
                            this.testSuite.tests.push(data);
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
                        parent: this.testSuite.id,
                        symbols: [],
                        variables: {}
                    };
                    this.TestResource.create(testCase)
                        .then(data => {
                            this.ToastService.success(`The test case "${testCase.name}" has been created.`);
                            this.testSuite.tests.push(data);
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

                    const testToUpdate = JSON.parse(JSON.stringify(test));
                    delete testToUpdate._selected;
                    if (testToUpdate.type === 'suite') {
                        testToUpdate.tests = test.tests.map(t => t.id);
                    } else {
                        testToUpdate.symbols = test.symbols.map(s => s.id);
                    }

                    this.TestResource.update(testToUpdate)
                        .then(() => {
                            this.ToastService.success("The name has been updated.");
                            test.name = name
                        })
                        .catch(err => this.ToastService.danger(`The test ${test.type} could not be updated. ${err.data.message}`));
                });
        }

        reset() {
            this.overallResult = null;
            this.results = {};
        }

        deleteTest(test) {
            this.reset();

            this.TestResource.remove(test)
                .then(() => {
                    this.ToastService.success(`The test ${test.type} has been deleted.`);
                    const i = this.testSuite.tests.findIndex(t => t.id === test.id);
                    if (i > -1) this.testSuite.tests.splice(i, 1);
                })
                .catch(err => this.ToastService.danger(`The test ${test.type} could not be deleted. ${err.data.message}`));
        }

        deleteSelected() {
            if (this.testSuite.tests.findIndex(t => t._selected) === -1) {
                this.ToastService.info("You have to select at least one test case or test suite.");
                return;
            }

            this.reset();

            const selected = this.testSuite.tests.filter(t => t._selected);
            this.TestResource.removeMany(this.project.id, selected)
                .then(() => {
                    this.ToastService.success("The tests have been deleted.");
                    selected.forEach(test => {
                        const i = this.testSuite.tests.findIndex(t => t.id === test.id);
                        if (i > -1) this.testSuite.tests.splice(i, 1);
                    });
                })
                .catch(err => this.ToastService.danger(`Deleting the tests failed. ${err.data.message}`));
        }

        stopTestExecution() {
            this.ToastService.info("The execution stops after the current test.");
            this.isExecuting = false;
        }

        executeSelected() {
            if (this.testSuite.tests.findIndex(t => t._selected) === -1) {
                this.ToastService.info("You have to select at least one test case or test suite.");
                return;
            }

            this.reset();
            this.overallResult = new TestResult();
            this.isExecuting = true;
            const selected = this.testSuite.tests.filter(t => t._selected);
            const next = (test) => {
                if (!this.isExecuting) {
                    this.ToastService.success("Finished executing all tests.");
                    return;
                }

                this.TestResource.execute(test, this.browserConfig)
                    .then(data => {
                        this.results[test.id] = data;
                        this.overallResult.add(data);

                        if (selected.length) {
                            next(selected.shift());
                        } else {
                            this.ToastService.success("Finished executing all tests.");
                            this.isExecuting = false;
                        }
                    })
                    .catch(console.log);
            };
            next(selected.shift());
        }

        openBrowserConfigModal() {
            this.$uibModal.open({
                component: 'browserConfigModal',
                resolve: {
                    modalData: () => {
                        return {
                            configuration: JSON.parse(JSON.stringify(this.browserConfig))
                        };
                    }
                }
            }).result.then(data => {
                this.ToastService.success("The settings have been updated.");
                this.browserConfig = data;
            })
        }

        exportSelectedTests() {
            let testCases = this.testSuite.tests.filter(t => t._selected && t.type === 'case');
            if (!testCases.length) {
                this.ToastService.info('You have to select at least one test.');
            } else {
                testCases = JSON.parse(JSON.stringify(testCases));
                testCases.forEach(test => {
                    delete test.id;
                    delete test.project;
                    delete test.user;
                    delete test.parent;
                    delete test._selected;
                    delete test.$$hashKey;

                    test.type = 'case';
                    test.symbols = test.symbols.map(s => s.name);
                });

                const date = new Date();
                const name = 'tests-' + date.getFullYear() + '' + (date.getMonth() + 1) + "" + date.getDate();
                this.PromptService.prompt('Enter a name for the file', name).then(name => {
                    this.DownloadService.downloadObject(testCases, name);
                    this.ToastService.success('The tests have been exported');
                });
            }
        }

        importTests() {
            this.$uibModal.open({
                component: 'testsImportModal',
                resolve: {
                    modalData: () => ({test: this.testSuite})
                }
            }).result.then(tests => {
                this.ToastService.success("Tests have been imported.");
                tests.forEach(t => {
                    t.type = t.tests ? 'suite' : 'case';
                    this.testSuite.tests.push(t);
                });
            });
            
        }
    }
};